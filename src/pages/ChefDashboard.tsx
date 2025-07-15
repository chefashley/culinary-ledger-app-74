import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMenuItems } from '@/hooks/useFirestore';
import { ChefHat, Plus, Edit, Trash2, DollarSign, Percent, LogOut, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MenuItem {
  id?: string;
  name: string;
  category: string;
  costPrice: number;
  markupPercentage: number;
  sellingPrice: number;
  ingredients: string[];
  description: string;
  prepTime: number;
  createdBy: string;
  createdAt: any;
}

const ChefDashboard = () => {
  const { userProfile, logout } = useAuth();
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, loading } = useMenuItems();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    costPrice: 0,
    markupPercentage: 25,
    ingredients: '',
    description: '',
    prepTime: 30
  });

  const categories = ['Starter', 'Main Course', 'Dessert', 'Beverage', 'Side Dish'];

  const calculateSellingPrice = (costPrice: number, markupPercentage: number) => {
    return costPrice + (costPrice * markupPercentage / 100);
  };

  const profitMargins = useMemo(() => {
    return menuItems.map(item => ({
      ...item,
      profit: item.sellingPrice - item.costPrice,
      profitMargin: ((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100
    }));
  }, [menuItems]);

  const totalProfit = useMemo(() => {
    return profitMargins.reduce((sum, item) => sum + item.profit, 0);
  }, [profitMargins]);

  const averageMargin = useMemo(() => {
    if (profitMargins.length === 0) return 0;
    return profitMargins.reduce((sum, item) => sum + item.profitMargin, 0) / profitMargins.length;
  }, [profitMargins]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sellingPrice = calculateSellingPrice(formData.costPrice, formData.markupPercentage);
    const ingredientsArray = formData.ingredients.split(',').map(i => i.trim()).filter(i => i);
    
    const menuItemData = {
      name: formData.name,
      category: formData.category,
      costPrice: formData.costPrice,
      markupPercentage: formData.markupPercentage,
      sellingPrice,
      ingredients: ingredientsArray,
      description: formData.description,
      prepTime: formData.prepTime
    };

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id!, menuItemData);
        setEditingItem(null);
      } else {
        await addMenuItem(menuItemData);
        setIsAddingItem(false);
      }
      
      // Reset form
      setFormData({
        name: '',
        category: 'Main Course',
        costPrice: 0,
        markupPercentage: 25,
        ingredients: '',
        description: '',
        prepTime: 30
      });
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      costPrice: item.costPrice,
      markupPercentage: item.markupPercentage,
      ingredients: item.ingredients.join(', '),
      description: item.description,
      prepTime: item.prepTime
    });
    setEditingItem(item);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItem(id);
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Starter': return 'bg-green-100 text-green-800';
      case 'Main Course': return 'bg-blue-100 text-blue-800';
      case 'Dessert': return 'bg-purple-100 text-purple-800';
      case 'Beverage': return 'bg-yellow-100 text-yellow-800';
      case 'Side Dish': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chef Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {userProfile?.name} (Chef)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsAddingItem(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
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
          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menu Items</p>
                <p className="text-2xl font-bold text-green-600">{menuItems.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <ChefHat className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-blue-600">R{totalProfit.toFixed(2)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Margin</p>
                <p className="text-2xl font-bold text-purple-600">{averageMargin.toFixed(1)}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(menuItems.map(item => item.category)).size}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calculator className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id!)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{item.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Cost Price:</span>
                      <div className="font-medium text-red-600">R{item.costPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Selling Price:</span>
                      <div className="font-medium text-green-600">R{item.sellingPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Markup:</span>
                      <div className="font-medium text-blue-600">{item.markupPercentage}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Prep Time:</span>
                      <div className="font-medium text-gray-800">{item.prepTime} min</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Profit:</span>
                      <span className="font-bold text-green-600">
                        R{(item.sellingPrice - item.costPrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Margin:</span>
                      <span className="font-bold text-purple-600">
                        {(((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-gray-500 mb-1">Ingredients:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.slice(0, 3).map((ingredient, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {ingredient}
                        </span>
                      ))}
                      {item.ingredients.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          +{item.ingredients.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Menu Item Dialog */}
        <Dialog open={isAddingItem || editingItem !== null} onOpenChange={(open) => {
          if (!open) {
            setIsAddingItem(false);
            setEditingItem(null);
            setFormData({
              name: '',
              category: 'Main Course',
              costPrice: 0,
              markupPercentage: 25,
              ingredients: '',
              description: '',
              prepTime: 30
            });
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="costPrice">Cost Price (R)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, costPrice: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="markupPercentage">Markup (%)</Label>
                  <Input
                    id="markupPercentage"
                    type="number"
                    value={formData.markupPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, markupPercentage: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>
                <div>
                  <Label>Selling Price (R)</Label>
                  <div className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm">
                    {calculateSellingPrice(formData.costPrice, formData.markupPercentage).toFixed(2)}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                <Input
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                  placeholder="e.g., Chicken breast, Herbs, Olive oil"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the dish..."
                />
              </div>

              <div>
                <Label htmlFor="prepTime">Preparation Time (minutes)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  value={formData.prepTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingItem(false);
                    setEditingItem(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChefDashboard;