import { Utensils, ChefHat, DollarSign, ShoppingBag, Wrench } from 'lucide-react';
import { useMemo } from 'react';
import { useExpenses, useBudget } from '@/hooks/useFirestore';

interface BudgetCardFirebaseProps {
  category: 'equipment' | 'support' | 'ingredients' | 'utilities' | 'supplies';
  name: string;
  color: string;
  icon: string;
}

const BudgetCardFirebase = ({ category, name, color, icon }: BudgetCardFirebaseProps) => {
  const { expenses } = useExpenses();
  const { budget } = useBudget();

  const { spent, budgetAmount, percentage, remaining } = useMemo(() => {
    const categoryExpenses = expenses.filter(expense => expense.category === category);
    const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    let budgetAmount = 0;
    if (budget) {
      switch (category) {
        case 'equipment':
          budgetAmount = budget.equipment;
          break;
        case 'support':
          budgetAmount = budget.support;
          break;
        default:
          // For other categories, allocate remaining budget proportionally
          const allocatedBudget = budget.equipment + budget.support;
          const remainingBudget = budget.total - allocatedBudget;
          budgetAmount = remainingBudget / 3; // Divide among ingredients, utilities, supplies
      }
    }

    const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
    const remaining = budgetAmount - spent;

    return { spent, budgetAmount, percentage, remaining };
  }, [expenses, budget, category]);
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'utensils':
        return <Utensils className="h-5 w-5 text-white" />;
      case 'chef-hat':
        return <ChefHat className="h-5 w-5 text-white" />;
      case 'dollar-sign':
        return <DollarSign className="h-5 w-5 text-white" />;
      case 'shopping-bag':
        return <ShoppingBag className="h-5 w-5 text-white" />;
      case 'wrench':
        return <Wrench className="h-5 w-5 text-white" />;
      default:
        return <DollarSign className="h-5 w-5 text-white" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-lg`}>
          {getIcon(icon)}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Budget</p>
          <p className="text-lg font-semibold text-gray-900">R{budgetAmount.toLocaleString()}</p>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Spent: R{spent.toLocaleString()}</span>
          <span className="text-gray-600">{percentage.toFixed(1)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Remaining: R{remaining.toLocaleString()}
          </span>
          {percentage > 90 && (
            <span className="text-red-500 font-medium">⚠️ Almost over budget!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetCardFirebase;