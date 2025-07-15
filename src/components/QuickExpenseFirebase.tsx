import { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { useExpenses } from '@/hooks/useFirestore';
import { useAuth } from '@/contexts/AuthContext';

const QuickExpenseFirebase = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'equipment' | 'support' | 'ingredients' | 'utilities' | 'supplies'>('ingredients');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addExpense } = useExpenses();
  const { canAddExpenses } = useAuth();

  const categories = [
    { value: 'ingredients' as const, label: 'Ingredients' },
    { value: 'equipment' as const, label: 'Equipment' },
    { value: 'utilities' as const, label: 'Utilities' },
    { value: 'supplies' as const, label: 'Supplies' },
    { value: 'support' as const, label: 'Support' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addExpense({
        amount: parseFloat(amount),
        category,
        description
      });

      // Reset form
      setAmount('');
      setDescription('');
      setIsOpen(false);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canAddExpenses()) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Expense</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">You don't have permission to add expenses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Quick Expense</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {isOpen ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (R)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              step="0.01"
              min="0"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Premium olive oil"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Expense'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Track your expenses quickly</p>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg font-medium transition-colors"
          >
            Add New Expense
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickExpenseFirebase;