import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses, useBudget } from '@/hooks/useFirestore';
import { ChefHat, TrendingUp, DollarSign, AlertCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BudgetCardFirebase from '../components/BudgetCardFirebase';
import QuickExpenseFirebase from '../components/QuickExpenseFirebase';
import RecentTransactionsFirebase from '../components/RecentTransactionsFirebase';

const ChefDashboard = () => {
  const { userProfile, logout } = useAuth();
  const { expenses } = useExpenses();
  const { budget } = useBudget();

  const { totalBudget, totalSpent, remainingBudget } = useMemo(() => {
    const totalBudget = budget?.total || 0;
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = totalBudget - totalSpent;

    return { totalBudget, totalSpent, remainingBudget };
  }, [expenses, budget]);

  const budgetCategories = [
    {
      category: 'ingredients' as const,
      name: 'Ingredients',
      color: 'bg-orange-500',
      icon: 'utensils'
    },
    {
      category: 'equipment' as const,
      name: 'Equipment',
      color: 'bg-amber-500',
      icon: 'chef-hat'
    },
    {
      category: 'utilities' as const,
      name: 'Utilities',
      color: 'bg-yellow-500',
      icon: 'dollar-sign'
    },
    {
      category: 'supplies' as const,
      name: 'Supplies',
      color: 'bg-red-500',
      icon: 'shopping-bag'
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chef Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {userProfile?.name} (Chef)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">R{totalBudget.toLocaleString()}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">R{totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-green-600">R{remainingBudget.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Usage</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Categories - Read Only for Chef */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {budgetCategories.map((category) => (
            <BudgetCardFirebase 
              key={category.category} 
              category={category.category}
              name={category.name}
              color={category.color}
              icon={category.icon}
            />
          ))}
        </div>

        {/* Quick Expense and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <QuickExpenseFirebase />
          </div>
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Chef Notes</h2>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Tip:</strong> You can add expenses for ingredients, equipment, and supplies.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Budget View:</strong> You can view budget allocations but cannot modify them.
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Analytics:</strong> Contact your manager for detailed expense analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <RecentTransactionsFirebase />
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;