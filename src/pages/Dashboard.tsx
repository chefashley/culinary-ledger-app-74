import BudgetCardFirebase from '../components/BudgetCardFirebase';
import ExpenseChartFirebase from '../components/ExpenseChartFirebase';
import QuickExpenseFirebase from '../components/QuickExpenseFirebase';
import RecentTransactionsFirebase from '../components/RecentTransactionsFirebase';
import SupplierList from '../components/SupplierList';
import MenuCreator from '../components/MenuCreator';
import EventManager from '../components/EventManager';
import RecordsManager from '../components/RecordsManager';
import { ChefHat, TrendingUp, DollarSign, AlertCircle, Users, Menu, Calendar, FileText, LogOut, Settings } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses, useBudget } from '@/hooks/useFirestore';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { userProfile, logout, isAdmin, isChef, isStaff } = useAuth();
  const { expenses } = useExpenses();
  const { budget } = useBudget();

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
      color: 'bg-orange-600',
      icon: 'shopping-bag'
    }
  ];

  const { totalBudget, totalSpent, remainingBudget } = useMemo(() => {
    const totalBudget = budget?.total || 0;
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = totalBudget - totalSpent;

    return { totalBudget, totalSpent, remainingBudget };
  }, [expenses, budget]);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp, roles: ['admin', 'chef', 'staff'] },
    { id: 'suppliers', name: 'Suppliers', icon: Users, roles: ['admin', 'chef', 'staff'] },
    { id: 'menu', name: 'Menu', icon: Menu, roles: ['admin', 'chef'] },
    { id: 'events', name: 'Events', icon: Calendar, roles: ['admin', 'chef'] },
    { id: 'records', name: 'Records', icon: FileText, roles: ['admin', 'chef', 'staff'] },
    { id: 'settings', name: 'Settings', icon: Settings, roles: ['admin'] }
  ];

  const availableTabs = tabs.filter(tab => 
    tab.roles.includes(userProfile?.role || 'staff')
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Admin settings panel coming soon...</p>
          </div>
        );
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
                <p className="text-sm text-gray-600">
                  Welcome back, {userProfile?.name} ({userProfile?.role})
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

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {availableTabs.map((tab) => {
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

export default Dashboard;