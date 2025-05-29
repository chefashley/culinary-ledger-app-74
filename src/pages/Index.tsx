
import BudgetCard from '../components/BudgetCard';
import ExpenseChart from '../components/ExpenseChart';
import QuickExpense from '../components/QuickExpense';
import RecentTransactions from '../components/RecentTransactions';
import SupplierList from '../components/SupplierList';
import MenuCreator from '../components/MenuCreator';
import EventManager from '../components/EventManager';
import RecordsManager from '../components/RecordsManager';
import { ChefHat, TrendingUp, DollarSign, AlertCircle, Users, Menu, Calendar, FileText } from 'lucide-react';
import { useState } from 'react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

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

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'suppliers', name: 'Suppliers', icon: Users },
    { id: 'menu', name: 'Menu', icon: Menu },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'records', name: 'Records', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
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
              <div className="lg:col-span-2">
                <ExpenseChart />
              </div>
              <div>
                <QuickExpense />
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="mt-8">
              <RecentTransactions />
            </div>
          </>
        );
      case 'suppliers':
        return <SupplierList />;
      case 'menu':
        return <MenuCreator />;
      case 'events':
        return <EventManager />;
      case 'records':
        return <RecordsManager />;
      default:
        return <div>Content not found</div>;
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
                <h1 className="text-2xl font-bold text-gray-900">Chef Management System</h1>
                <p className="text-sm text-gray-600">Complete business management for chefs</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">R{totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Index;
