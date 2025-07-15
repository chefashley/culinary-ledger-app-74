import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses, useBudget, usePendingExpenses } from '@/hooks/useFirestore';
import { ChefHat, TrendingUp, DollarSign, AlertCircle, LogOut, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BudgetCardFirebase from '../components/BudgetCardFirebase';
import ExpenseChartFirebase from '../components/ExpenseChartFirebase';

const ManagerDashboard = () => {
  const { userProfile, logout } = useAuth();
  const { expenses } = useExpenses();
  const { budget } = useBudget();
  const { pendingExpenses, approveExpense, rejectExpense } = usePendingExpenses();

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

  const handleApprove = async (expenseId: string) => {
    try {
      await approveExpense(expenseId);
    } catch (error) {
      console.error('Error approving expense:', error);
    }
  };

  const handleReject = async (expenseId: string) => {
    try {
      await rejectExpense(expenseId);
    } catch (error) {
      console.error('Error rejecting expense:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ingredients': return 'bg-orange-100 text-orange-800';
      case 'equipment': return 'bg-amber-100 text-amber-800';
      case 'utilities': return 'bg-yellow-100 text-yellow-800';
      case 'supplies': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {userProfile?.name} (Restaurant Manager)
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
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

          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
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

          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Usage</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-600">{pendingExpenses.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Categories - Read Only */}
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

        {/* Expense Approvals and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ExpenseChartFirebase />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-500" />
                  Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pendingExpenses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No pending approvals
                    </div>
                  ) : (
                    pendingExpenses.map((expense) => (
                      <div key={expense.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{expense.description}</h4>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCategoryColor(expense.category)}`}>
                              {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600">R{expense.amount.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">
                              {expense.createdAt?.toDate().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(expense.id!)}
                            className="bg-green-500 hover:bg-green-600 flex-1"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(expense.id!)}
                            className="text-red-500 border-red-500 hover:bg-red-50 flex-1"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Manager Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Manager Analytics & Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <TrendingUp className="h-5 w-5 mb-1" />
                <span className="text-xs">Expense Reports</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <DollarSign className="h-5 w-5 mb-1" />
                <span className="text-xs">Budget Analysis</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Clock className="h-5 w-5 mb-1" />
                <span className="text-xs">Approval History</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <AlertCircle className="h-5 w-5 mb-1" />
                <span className="text-xs">Budget Alerts</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;