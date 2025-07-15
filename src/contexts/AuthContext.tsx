import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';

export type UserRole = 'Admin' | 'Manager' | 'Chef';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  lastLogin?: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isChef: () => boolean;
  canEditBudgets: () => boolean;
  canEditUsers: () => boolean;
  canAddExpenses: () => boolean;
  canViewAnalytics: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await updateLastLogin(result.user.uid);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email,
        name,
        role,
        lastLogin: new Date()
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userProfile);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.success('Successfully logged out!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log out');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  const updateLastLogin = async (uid: string) => {
    try {
      await setDoc(doc(db, 'users', uid), { lastLogin: new Date() }, { merge: true });
    } catch (error) {
      console.error('Failed to update last login:', error);
    }
  };

  const fetchUserProfile = async (user: User) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          uid: user.uid,
          email: user.email || '',
          name: data.name,
          role: data.role,
          lastLogin: data.lastLogin?.toDate()
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to load user profile');
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return userProfile?.role === role;
  };

  const isAdmin = (): boolean => {
    return userProfile?.role === 'Admin';
  };

  const isManager = (): boolean => {
    return userProfile?.role === 'Manager';
  };

  const isChef = (): boolean => {
    return userProfile?.role === 'Chef';
  };

  const canEditBudgets = (): boolean => {
    return userProfile?.role === 'Admin' || userProfile?.role === 'Manager';
  };

  const canEditUsers = (): boolean => {
    return userProfile?.role === 'Admin';
  };

  const canAddExpenses = (): boolean => {
    return userProfile?.role === 'Admin' || userProfile?.role === 'Manager' || userProfile?.role === 'Chef';
  };

  const canViewAnalytics = (): boolean => {
    return userProfile?.role === 'Admin' || userProfile?.role === 'Manager';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
    resetPassword,
    hasRole,
    isAdmin,
    isManager,
    isChef,
    canEditBudgets,
    canEditUsers,
    canAddExpenses,
    canViewAnalytics
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};