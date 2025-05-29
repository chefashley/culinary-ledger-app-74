
import { Calendar, DollarSign } from 'lucide-react';

const RecentTransactions = () => {
  const transactions = [
    {
      id: 1,
      description: 'Premium Wagyu Beef',
      category: 'Ingredients',
      amount: 450,
      date: '2024-01-15',
      type: 'expense'
    },
    {
      id: 2,
      description: 'Commercial Stand Mixer',
      category: 'Equipment',
      amount: 1200,
      date: '2024-01-14',
      type: 'expense'
    },
    {
      id: 3,
      description: 'Organic Vegetables',
      category: 'Ingredients',
      amount: 125,
      date: '2024-01-14',
      type: 'expense'
    },
    {
      id: 4,
      description: 'Electricity Bill',
      category: 'Utilities',
      amount: 380,
      date: '2024-01-13',
      type: 'expense'
    },
    {
      id: 5,
      description: 'Disposable Gloves (Box)',
      category: 'Supplies',
      amount: 45,
      date: '2024-01-13',
      type: 'expense'
    },
    {
      id: 6,
      description: 'Fresh Seafood',
      category: 'Ingredients',
      amount: 285,
      date: '2024-01-12',
      type: 'expense'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Ingredients':
        return 'bg-orange-100 text-orange-800';
      case 'Equipment':
        return 'bg-amber-100 text-amber-800';
      case 'Utilities':
        return 'bg-yellow-100 text-yellow-800';
      case 'Supplies':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
        <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <DollarSign className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </span>
                  <span className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-red-600">
                -${transaction.amount.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
