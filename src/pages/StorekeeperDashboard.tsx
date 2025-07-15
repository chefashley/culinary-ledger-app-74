import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupplyExpenses, useInventory } from '@/hooks/useFirestore';
import { Package, Plus, TrendingDown, AlertTriangle, LogOut, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const StorekeeperDashboard = () => {
  const { userProfile, logout } = useAuth();
  const { supplyExpenses, addSupplyExpense, updateSupplyExpense, deleteSupplyExpense } = useSupplyExpenses();
  const { inventory, updateInventoryItem } = useInventory();
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [expenseForm, setExpenseForm] = useState({
    supplier: '',
    items: '',
    amount: 0,
    category: 'supplies',
    description: '',
    invoiceNumber: ''
  });

  const categories = ['supplies', 'ingredients', 'equipment', 'utilities'];

  const { totalSpent, monthlySpent, lowStockItems } = useMemo(() => {
    const totalSpent = supplyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const currentMonth = new Date().getMonth();
    const monthlySpent = supplyExpenses
      .filter(expense => expense.createdAt?.toDate().getMonth() === currentMonth)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
    
    return { totalSpent, monthlySpent, lowStockItems };
  }, [supplyExpenses, inventory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemsArray = expenseForm.items.split(',').map(i => i.trim()).filter(i => i);
    
    const expenseData = {
      supplier: expenseForm.supplier,
      items: itemsArray,
      amount: expenseForm.amount,
      category: expenseForm.category as 'supplies' | 'ingredients' | 'equipment' | 'utilities',
      description: expenseForm.description,
      invoiceNumber: expenseForm.invoiceNumber
    };

    try {
      if (editingExpense) {
        await updateSupplyExpense(editingExpense.id, expenseData);
        setEditingExpense(null);
      } else {
        await addSupplyExpense(expenseData);
        setIsAddingExpense(false);
      }
      
      // Reset form
      setExpenseForm({
        supplier: '',
        items: '',
        amount: 0,
        category: 'supplies',
        description: '',
        invoiceNumber: ''
      });
    } catch (error) {
      console.error('Error saving supply expense:', error);
    }
  };

  const handleEdit = (expense: any) => {
    setExpenseForm({
      supplier: expense.supplier,
      items: expense.items.join(', '),
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      invoiceNumber: expense.invoiceNumber || ''
    });
    setEditingExpense(expense);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this supply expense?')) {
      try {
        await deleteSupplyExpense(id);
      } catch (error) {
        console.error('Error deleting supply expense:', error);
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
      case 'supplies': return 'bg-blue-100 text-blue-800';
      case 'ingredients': return 'bg-orange-100 text-orange-800';
      case 'equipment': return 'bg-purple-100 text-purple-800';
      case 'utilities': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Storekeeper Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {userProfile?.name} (Storekeeper)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsAddingExpense(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Log Supply Expense
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
          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">R{totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">R{monthlySpent.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Supply Orders</p>
                <p className="text-2xl font-bold text-green-600">{supplyExpenses.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockItems.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Supply Expenses and Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Supply Expenses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Supply Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {supplyExpenses.map((expense) => (
                    <div key={expense.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{expense.supplier}</h4>
                          <p className="text-sm text-gray-600">{expense.description}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCategoryColor(expense.category)}`}>
                            {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className="font-bold text-red-600">R{expense.amount.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">
                              {expense.createdAt?.toDate().toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(expense)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(expense.id!)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>Items:</strong> {expense.items.join(', ')}</p>
                        {expense.invoiceNumber && (
                          <p><strong>Invoice:</strong> {expense.invoiceNumber}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alerts */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                  Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      All items are well stocked
                    </div>
                  ) : (
                    lowStockItems.map((item) => (
                      <div key={item.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-orange-900">{item.name}</h4>
                            <p className="text-sm text-orange-700">
                              Current: {item.currentStock} {item.unit}
                            </p>
                            <p className="text-xs text-orange-600">
                              Min required: {item.minStock} {item.unit}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={() => {
                              // Handle reorder logic
                            }}
                          >
                            Reorder
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add/Edit Supply Expense Dialog */}
        <Dialog open={isAddingExpense || editingExpense !== null} onOpenChange={(open) => {
          if (!open) {
            setIsAddingExpense(false);
            setEditingExpense(null);
            setExpenseForm({
              supplier: '',
              items: '',
              amount: 0,
              category: 'supplies',
              description: '',
              invoiceNumber: ''
            });
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? 'Edit Supply Expense' : 'Log New Supply Expense'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplier">Supplier Name</Label>
                  <Input
                    id="supplier"
                    value={expenseForm.supplier}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, supplier: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={expenseForm.invoiceNumber}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount (R)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="items">Items (comma-separated)</Label>
                <Input
                  id="items"
                  value={expenseForm.items}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, items: e.target.value }))}
                  placeholder="e.g., Paper towels, Cleaning supplies, Gloves"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Additional details about the purchase..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingExpense(false);
                    setEditingExpense(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                  {editingExpense ? 'Update Expense' : 'Log Expense'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StorekeeperDashboard;