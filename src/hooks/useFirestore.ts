import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc,
  setDoc,
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Expense {
  id?: string;
  amount: number;
  category: 'equipment' | 'support' | 'ingredients' | 'utilities' | 'supplies';
  description: string;
  createdAt: Timestamp;
  createdBy: string;
}

export interface Budget {
  total: number;
  equipment: number;
  support: number;
  lastUpdated: Timestamp;
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  useEffect(() => {
    if (!userProfile) return;

    const q = query(
      collection(db, 'expenses'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];
      
      setExpenses(expenseData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
      setLoading(false);
    });

    return unsubscribe;
  }, [userProfile]);

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!userProfile) return;

    try {
      await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        createdAt: Timestamp.now(),
        createdBy: userProfile.uid
      });
      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
      throw error;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      await updateDoc(doc(db, 'expenses', id), updates);
      toast.success('Expense updated successfully');
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
      toast.success('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
      throw error;
    }
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense
  };
};

export const useBudget = () => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'budget', 'current'), (doc) => {
      if (doc.exists()) {
        setBudget(doc.data() as Budget);
      } else {
        // Initialize default budget if it doesn't exist
        setBudget({
          total: 10000,
          equipment: 3000,
          support: 2000,
          lastUpdated: Timestamp.now()
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching budget:', error);
      toast.error('Failed to load budget');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateBudget = async (updates: Partial<Budget>) => {
    try {
      await setDoc(doc(db, 'budget', 'current'), {
        ...updates,
        lastUpdated: Timestamp.now()
      }, { merge: true });
      toast.success('Budget updated successfully');
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error('Failed to update budget');
      throw error;
    }
  };

  return {
    budget,
    loading,
    updateBudget
  };
};