import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useMemo } from 'react';
import { useExpenses } from '@/hooks/useFirestore';

const ExpenseChartFirebase = () => {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const { expenses, loading } = useExpenses();

  const chartData = useMemo(() => {
    if (!expenses.length) return { monthlyData: [], pieData: [] };

    // Group expenses by month
    const monthlyGroups = expenses.reduce((acc, expense) => {
      const date = expense.createdAt?.toDate();
      if (!date) return acc;
      
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          ingredients: 0,
          equipment: 0,
          utilities: 0,
          supplies: 0,
          support: 0
        };
      }
      
      acc[monthKey][expense.category] += expense.amount;
      return acc;
    }, {} as Record<string, any>);

    const monthlyData = Object.values(monthlyGroups).slice(-4); // Last 4 months

    // Group expenses by category for pie chart
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryTotals).map(([category, value]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value,
      color: getCategoryColor(category)
    }));

    return { monthlyData, pieData };
  }, [expenses]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ingredients': return '#f97316';
      case 'equipment': return '#f59e0b';
      case 'utilities': return '#eab308';
      case 'supplies': return '#ea580c';
      case 'support': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Expense Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'bar' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'pie' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pie Chart
          </button>
        </div>
      </div>

      <div className="h-80">
        {chartData.monthlyData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No expense data available
          </div>
        ) : chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`R${value.toLocaleString()}`, 'Amount']}
              />
              <Bar dataKey="ingredients" fill="#f97316" name="Ingredients" />
              <Bar dataKey="equipment" fill="#f59e0b" name="Equipment" />
              <Bar dataKey="utilities" fill="#eab308" name="Utilities" />
              <Bar dataKey="supplies" fill="#ea580c" name="Supplies" />
              <Bar dataKey="support" fill="#3b82f6" name="Support" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`R${value.toLocaleString()}`, 'Amount']}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ExpenseChartFirebase;