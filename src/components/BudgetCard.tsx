
import { Utensils, ChefHat, DollarSign, ShoppingBag } from 'lucide-react';

interface BudgetCategory {
  id: number;
  name: string;
  budget: number;
  spent: number;
  color: string;
  icon: string;
}

interface BudgetCardProps {
  category: BudgetCategory;
}

const BudgetCard = ({ category }: BudgetCardProps) => {
  const percentage = (category.spent / category.budget) * 100;
  const remaining = category.budget - category.spent;
  
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
      default:
        return <DollarSign className="h-5 w-5 text-white" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`${category.color} p-3 rounded-lg`}>
          {getIcon(category.icon)}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Budget</p>
          <p className="text-lg font-semibold text-gray-900">R{category.budget.toLocaleString()}</p>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Spent: R{category.spent.toLocaleString()}</span>
          <span className="text-gray-600">{percentage.toFixed(1)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${category.color}`}
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

export default BudgetCard;
