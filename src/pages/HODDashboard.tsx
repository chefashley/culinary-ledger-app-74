import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses, useBudget, useUsers } from '@/hooks/useFirestore';
import { ChefHat, TrendingUp, DollarSign, AlertCircle, Users, Settings, LogOut, Edit, Save, X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BudgetCardFirebase from '../components/BudgetCardFirebase';
import ExpenseChartFirebase from '../components/ExpenseChartFirebase';
import RecentTransactionsFirebase from '../components/RecentTransactionsFirebase';

const HODDashboard = () => {
  const { userProfile, logout } = useAuth();
  const { expenses } = useExpenses();
  const { budget, updateBudget } = useBudget();
  const { users } = useUsers();
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    total: 0,
    ingredients: 0,
    equipment: 0,
    utilities: 0,
    supplies: 0
  });

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

  const handleEditBudget = () => {
    setBudgetForm({
      total: budget?.total || 0,
      ingredients: budget?.ingredients || 0,
      equipment: budget?.equipment || 0,
      utilities: budget?.utilities || 0,
      supplies: budget?.supplies || 0
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

  const roleStats = useMemo(() => {
    const stats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  }, [users]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500 p-2 rounded-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HOD Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {userProfile?.name} (Head of Department)
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
                    className="text-purple-600 border-purple-600 hover:bg-purple-50"
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
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle>Edit Budget Allocations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                    Ingredients (R)
                  </label>
                  <Input
                    type="number"
                    value={budgetForm.ingredients}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, ingredients: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment (R)
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
                    Utilities (R)
                  </label>
                  <Input
                    type="number"
                    value={budgetForm.utilities}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, utilities: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplies (R)
                  </label>
                  <Input
                    type="number"
                    value={budgetForm.supplies}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, supplies: parseFloat(e.target.value) || 0 }))}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
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

          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
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

          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Usage</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
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

        {/* Charts and User Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ExpenseChartFirebase />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-500" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="font-medium text-purple-800">HODs</div>
                      <div className="text-2xl font-bold text-purple-600">{roleStats.HOD || 0}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-medium text-green-800">Chefs</div>
                      <div className="text-2xl font-bold text-green-600">{roleStats.Chef || 0}</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="font-medium text-blue-800">Managers</div>
                      <div className="text-2xl font-bold text-blue-600">{roleStats.Manager || 0}</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="font-medium text-orange-800">Storekeepers</div>
                      <div className="text-2xl font-bold text-orange-600">{roleStats.Storekeeper || 0}</div>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-8">
          <RecentTransactionsFirebase />
        </div>

        {/* HOD Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-purple-500" />
              HOD Management Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Users className="h-5 w-5 mb-1" />
                <span className="text-xs">Role Management</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <DollarSign className="h-5 w-5 mb-1" />
                <span className="text-xs">Budget Analytics</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <TrendingUp className="h-5 w-5 mb-1" />
                <span className="text-xs">Financial Reports</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Settings className="h-5 w-5 mb-1" />
                <span className="text-xs">System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HODDashboard;