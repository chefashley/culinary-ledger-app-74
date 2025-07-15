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
import { useAuth, UserProfile } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Expense {
  id?: string;
  amount: number;
  category: 'equipment' | 'support' | 'ingredients' | 'utilities' | 'supplies';
  description: string;
  createdAt: Timestamp;
  createdBy: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Budget {
  total: number;
  ingredients: number;
  equipment: number;
  utilities: number;
  supplies: number;
  lastUpdated: Timestamp;
}

export interface MenuItem {
  id?: string;
  name: string;
  category: string;
  costPrice: number;
  markupPercentage: number;
  sellingPrice: number;
  ingredients: string[];
  description: string;
  prepTime: number;
  createdBy: string;
  createdAt: Timestamp;
}

export interface SupplyExpense {
  id?: string;
  supplier: string;
  items: string[];
  amount: number;
  category: 'supplies' | 'ingredients' | 'equipment' | 'utilities';
  description: string;
  invoiceNumber?: string;
  createdAt: Timestamp;
  createdBy: string;
}

export interface InventoryItem {
  id?: string;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
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
      where('status', '==', 'approved'),
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

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'createdBy' | 'status'>) => {
    if (!userProfile) return;

    try {
      const status = userProfile.role === 'Manager' ? 'approved' : 'pending';
      
      await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        createdAt: Timestamp.now(),
        createdBy: userProfile.uid,
        status
      });
      
      toast.success(status === 'approved' ? 'Expense added successfully' : 'Expense submitted for approval');
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
          total: 50000,
          ingredients: 20000,
          equipment: 15000,
          utilities: 8000,
          supplies: 7000,
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

export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userData = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserProfile[];
      
      setUsers(userData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { users, loading };
};

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'menuItems'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const menuData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[];
      
      setMenuItems(menuData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addMenuItem = async (menuData: Omit<MenuItem, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!userProfile) return;

    try {
      await addDoc(collection(db, 'menuItems'), {
        ...menuData,
        createdAt: Timestamp.now(),
        createdBy: userProfile.uid
      });
      toast.success('Menu item added successfully');
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('Failed to add menu item');
      throw error;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      await updateDoc(doc(db, 'menuItems', id), updates);
      toast.success('Menu item updated successfully');
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item');
      throw error;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'menuItems', id));
      toast.success('Menu item deleted successfully');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
      throw error;
    }
  };

  return {
    menuItems,
    loading,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
  };
};

export const usePendingExpenses = () => {
  const [pendingExpenses, setPendingExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'expenses'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];
      
      setPendingExpenses(expenseData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching pending expenses:', error);
      toast.error('Failed to load pending expenses');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const approveExpense = async (expenseId: string) => {
    try {
      await updateDoc(doc(db, 'expenses', expenseId), {
        status: 'approved'
      });
      toast.success('Expense approved successfully');
    } catch (error) {
      console.error('Error approving expense:', error);
      toast.error('Failed to approve expense');
      throw error;
    }
  };

  const rejectExpense = async (expenseId: string) => {
    try {
      await updateDoc(doc(db, 'expenses', expenseId), {
        status: 'rejected'
      });
      toast.success('Expense rejected');
    } catch (error) {
      console.error('Error rejecting expense:', error);
      toast.error('Failed to reject expense');
      throw error;
    }
  };

  return {
    pendingExpenses,
    loading,
    approveExpense,
    rejectExpense
  };
};

export const useSupplyExpenses = () => {
  const [supplyExpenses, setSupplyExpenses] = useState<SupplyExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  useEffect(() => {
    if (!userProfile) return;

    const q = query(
      collection(db, 'supplyExpenses'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SupplyExpense[];
      
      setSupplyExpenses(expenseData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching supply expenses:', error);
      toast.error('Failed to load supply expenses');
      setLoading(false);
    });

    return unsubscribe;
  }, [userProfile]);

  const addSupplyExpense = async (expenseData: Omit<SupplyExpense, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!userProfile) return;

    try {
      await addDoc(collection(db, 'supplyExpenses'), {
        ...expenseData,
        createdAt: Timestamp.now(),
        createdBy: userProfile.uid
      });
      toast.success('Supply expense logged successfully');
    } catch (error) {
      console.error('Error adding supply expense:', error);
      toast.error('Failed to log supply expense');
      throw error;
    }
  };

  const updateSupplyExpense = async (id: string, updates: Partial<SupplyExpense>) => {
    try {
      await updateDoc(doc(db, 'supplyExpenses', id), updates);
      toast.success('Supply expense updated successfully');
    } catch (error) {
      console.error('Error updating supply expense:', error);
      toast.error('Failed to update supply expense');
      throw error;
    }
  };

  const deleteSupplyExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'supplyExpenses', id));
      toast.success('Supply expense deleted successfully');
    } catch (error) {
      console.error('Error deleting supply expense:', error);
      toast.error('Failed to delete supply expense');
      throw error;
    }
  };

  return {
    supplyExpenses,
    loading,
    addSupplyExpense,
    updateSupplyExpense,
    deleteSupplyExpense
  };
};

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'inventory'), (snapshot) => {
      const inventoryData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InventoryItem[];
      
      setInventory(inventoryData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      await updateDoc(doc(db, 'inventory', id), {
        ...updates,
        lastUpdated: Timestamp.now()
      });
      toast.success('Inventory updated successfully');
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast.error('Failed to update inventory');
      throw error;
    }
  };

  return {
    inventory,
    loading,
    updateInventoryItem
  };
};