import { Calendar, DollarSign, Trash2, Edit } from 'lucide-react';
import { useExpenses } from '@/hooks/useFirestore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const RecentTransactionsFirebase = () => {
  const { expenses, loading, deleteExpense } = useExpenses();
  const { canEditUsers, userProfile } = useAuth();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ingredients':
        return 'bg-orange-100 text-orange-800';
      case 'equipment':
        return 'bg-amber-100 text-amber-800';
      case 'utilities':
        return 'bg-yellow-100 text-yellow-800';
      case 'supplies':
        return 'bg-red-100 text-red-800';
      case 'support':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recentExpenses = expenses.slice(0, 6);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
        <span className="text-sm text-gray-500">
          {expenses.length} total expenses
        </span>
      </div>

      <div className="space-y-4">
        {recentExpenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No expenses recorded yet
          </div>
        ) : (
          recentExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <DollarSign className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                      {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </span>
                    <span className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {expense.createdAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    -R{expense.amount.toLocaleString()}
                  </p>
                </div>
                {(canEditUsers() || expense.createdBy === userProfile?.uid) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(expense.id!)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactionsFirebase;