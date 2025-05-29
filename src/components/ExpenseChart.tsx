
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

const ExpenseChart = () => {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  const monthlyData = [
    { month: 'Jan', ingredients: 4800, equipment: 1200, utilities: 1100, supplies: 600 },
    { month: 'Feb', ingredients: 5200, equipment: 800, utilities: 1150, supplies: 700 },
    { month: 'Mar', ingredients: 4900, equipment: 1500, utilities: 1200, supplies: 650 },
    { month: 'Apr', ingredients: 3200, equipment: 1800, utilities: 1200, supplies: 650 },
  ];

  const pieData = [
    { name: 'Ingredients', value: 3200, color: '#f97316' },
    { name: 'Equipment', value: 1800, color: '#f59e0b' },
    { name: 'Utilities', value: 1200, color: '#eab308' },
    { name: 'Supplies', value: 650, color: '#ea580c' },
  ];

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
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
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
              />
              <Bar dataKey="ingredients" fill="#f97316" name="Ingredients" />
              <Bar dataKey="equipment" fill="#f59e0b" name="Equipment" />
              <Bar dataKey="utilities" fill="#eab308" name="Utilities" />
              <Bar dataKey="supplies" fill="#ea580c" name="Supplies" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
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

export default ExpenseChart;
