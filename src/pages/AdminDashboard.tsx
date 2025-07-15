import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses, useBudget } from '@/hooks/useFirestore';
import { ChefHat, TrendingUp, DollarSign, AlertCircle, Users, Settings, LogOut, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BudgetCardFirebase from '../components/BudgetCardFirebase';
import ExpenseChartFirebase from '../components/ExpenseChartFirebase';
import QuickExpenseFirebase from '../components/QuickExpenseFirebase';
import RecentTransactionsFirebase from '../components/RecentTransactionsFirebase';

const AdminDashboard = () => {
  const { userProfile, logout } = useAuth();
  const { expenses } = useExpenses();
  const { budget, updateBudget } = useBudget();
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    total: 0,
    equipment: 0,
    support: 0
  });

  const { totalBudget, totalSpent, remainingBudget } = useMemo(() => {
    const totalBudget = budget?.total || 0;
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = totalBudget - totalSpent;

    return { totalBudget, totalSpent, remainingBudget };
  }, [expenses, budget]);

  const budgetCategories = [
    {
      category: 'equipment' as const,
      name: 'Equipment',
      color: 'bg-amber-500',
      icon: 'chef-hat'
    },
    {
      category: 'support' as const,
      name: 'Support',
      color: 'bg-blue-500',
      icon: 'wrench'
    },
    {
      category: 'ingredients' as const,
      name: 'Ingredients',
      color: 'bg-orange-500',
      icon: 'utensils'
    },
    {
      category: 'utilities' as const,
      name: 'Utilities',
      color: 'bg-yellow-500',
      icon: 'dollar-sign'
    }
  ];

  const handleEditBudget = () => {
    setBudgetForm({
      total: budget?.total || 0,
      equipment: budget?.equipment || 0,
      support: budget?.support || 0
    });
    setEditingBudget(true);
  };

  const handleSaveBudget = async () => {
    try {
      await updateBudget(budgetForm);
      setEditingBudget(false);
    } catch (error) {
      console.error('Failed to update budget:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {userProfile?.name} (Administrator)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Budget</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">R{totalBudget.toLocaleString()}</p>
                  <Button
                    onClick={editingBudget ? handleSaveBudget : handleEditBudget}
                    variant="outline"
                    size="sm"
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    {editingBudget ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                  {editingBudget && (
                    <Button
                      onClick={() => setEditingBudget(false)}
                      variant="outline"
                      size="sm"
                      className="text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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

      {/* Budget Edit Form */}
      {editingBudget && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle>Edit Budget Allocations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Budget (R)
                  </label>
                  <Input
                    type="number"
                    value={budgetForm.total}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, total: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment Budget (R)
                  </label>
                  <Input
                    type="number"
                    value={budgetForm.equipment}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, equipment: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Support Budget (R)
                  </label>
                  <Input
                    type="number"
                    value={budgetForm.support}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, support: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
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

          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
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

          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Usage</p>
                <p className="text-2xl font-bold text-orange-600">
                  {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Categories */}
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

        {/* Charts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ExpenseChartFirebase />
          </div>
          <div>
            <QuickExpenseFirebase />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <RecentTransactionsFirebase />
        </div>

        {/* Admin Tools */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-orange-500" />
                Admin Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-xs">Manage Users</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Settings className="h-5 w-5 mb-1" />
                  <span className="text-xs">System Settings</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <TrendingUp className="h-5 w-5 mb-1" />
                  <span className="text-xs">Advanced Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;