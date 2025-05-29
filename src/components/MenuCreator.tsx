
import { Plus, Trash2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MenuCreator = () => {
  const menuItems = [
    {
      id: 1,
      name: 'Grilled Salmon with Herbs',
      category: 'Main Course',
      costPrice: 85,
      sellingPrice: 165,
      ingredients: ['Salmon fillet', 'Fresh herbs', 'Lemon', 'Olive oil'],
      prepTime: 25,
      difficulty: 'Medium'
    },
    {
      id: 2,
      name: 'Chocolate Lava Cake',
      category: 'Dessert',
      costPrice: 35,
      sellingPrice: 95,
      ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour'],
      prepTime: 30,
      difficulty: 'Hard'
    },
    {
      id: 3,
      name: 'Caesar Salad',
      category: 'Starter',
      costPrice: 25,
      sellingPrice: 65,
      ingredients: ['Romaine lettuce', 'Parmesan', 'Croutons', 'Caesar dressing'],
      prepTime: 10,
      difficulty: 'Easy'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Starter':
        return 'bg-green-100 text-green-800';
      case 'Main Course':
        return 'bg-orange-100 text-orange-800';
      case 'Dessert':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Menu Management</CardTitle>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Create New Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Menu Items List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Menu Items</h3>
            {menuItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1 text-red-500" />
                    <span>Cost: R{item.costPrice}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1 text-green-500" />
                    <span>Price: R{item.sellingPrice}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Prep: {item.prepTime}min</span>
                  </div>
                  <div>
                    <span className={`font-medium ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Ingredients:</p>
                  <p>{item.ingredients.join(', ')}</p>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Profit Margin:</span>
                    <span className="font-medium text-green-600">
                      R{item.sellingPrice - item.costPrice} ({Math.round(((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Add Item</h3>
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input id="itemName" placeholder="Enter dish name" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="costPrice">Cost Price (R)</Label>
                  <Input id="costPrice" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="sellingPrice">Selling Price (R)</Label>
                  <Input id="sellingPrice" type="number" placeholder="0" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prepTime">Prep Time (min)</Label>
                  <Input id="prepTime" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select id="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="Starter">Starter</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
              </div>
              
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Add to Menu
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCreator;
