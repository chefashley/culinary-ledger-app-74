
import BudgetCard from '../components/BudgetCard';
import ExpenseChart from '../components/ExpenseChart';
import QuickExpense from '../components/QuickExpense';
import RecentTransactions from '../components/RecentTransactions';
import { ChefHat, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

const Index = () => {
  const budgetCategories = [
    {
      id: 1,
      name: 'Ingredients',
      budget: 5000,
      spent: 3200,
      color: 'bg-orange-500',
      icon: 'utensils'
    },
    {
      id: 2,
      name: 'Equipment',
      budget: 2000,
      spent: 1800,
      color: 'bg-amber-500',
      icon: 'chef-hat'
    },
    {
      id: 3,
      name: 'Utilities',
      budget: 1500,
      spent: 1200,
      color: 'bg-yellow-500',
      icon: 'dollar-sign'
    },
    {
      id: 4,
      name: 'Supplies',
      budget: 800,
      spent: 650,
      color: 'bg-orange-600',
      icon: 'shopping-bag'
    }
  ];

  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

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
                <h1 className="text-2xl font-bold text-gray-900">Chef Budget Monitor</h1>
                <p className="text-sm text-gray-600">Track your kitchen expenses efficiently</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">${totalSpent.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-green-600">${remainingBudget.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-orange-600">{Math.round((totalSpent / totalBudget) * 100)}%</p>
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
            <BudgetCard key={category.id} category={category} />
          ))}
        </div>

        {/* Charts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Expense Chart */}
          <div className="lg:col-span-2">
            <ExpenseChart />
          </div>
          
          {/* Quick Expense Entry */}
          <div>
            <QuickExpense />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Index;
