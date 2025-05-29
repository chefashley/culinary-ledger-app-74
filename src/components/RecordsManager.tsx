
import { TrendingUp, TrendingDown, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RecordsManager = () => {
  const monthlyRecords = [
    {
      month: 'January 2024',
      revenue: 125000,
      expenses: 89000,
      profit: 36000,
      events: 8,
      avgOrderValue: 15625
    },
    {
      month: 'December 2023',
      revenue: 142000,
      expenses: 95000,
      profit: 47000,
      events: 12,
      avgOrderValue: 11833
    },
    {
      month: 'November 2023',
      revenue: 98000,
      expenses: 72000,
      profit: 26000,
      events: 6,
      avgOrderValue: 16333
    }
  ];

  const expenseBreakdown = [
    { category: 'Ingredients', amount: 45000, percentage: 51 },
    { category: 'Staff', amount: 25000, percentage: 28 },
    { category: 'Equipment', amount: 12000, percentage: 13 },
    { category: 'Utilities', amount: 5000, percentage: 6 },
    { category: 'Other', amount: 2000, percentage: 2 }
  ];

  const topPerformingDishes = [
    { dish: 'Grilled Salmon with Herbs', orders: 45, revenue: 7425, profit: 3600 },
    { dish: 'Beef Wellington', orders: 32, revenue: 9600, profit: 4800 },
    { dish: 'Chocolate Lava Cake', orders: 67, revenue: 6365, profit: 4020 },
    { dish: 'Caesar Salad', orders: 89, revenue: 5785, profit: 3560 }
  ];

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Financial Records & Reports</CardTitle>
            <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {monthlyRecords.map((record, index) => (
              <div key={record.month} className={`border rounded-lg p-4 ${index === 0 ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
                <h3 className="font-semibold text-gray-900 mb-3">{record.month}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue:</span>
                    <span className="font-medium text-green-600">R{record.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expenses:</span>
                    <span className="font-medium text-red-600">R{record.expenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium text-gray-900">Profit:</span>
                    <span className="font-bold text-green-600">R{record.profit.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
                    <div>Events: {record.events}</div>
                    <div>Avg Order: R{record.avgOrderValue.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
              Expense Breakdown (January)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseBreakdown.map((expense) => (
                <div key={expense.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{expense.category}</span>
                    <span className="text-gray-600">R{expense.amount.toLocaleString()} ({expense.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${expense.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Dishes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Top Performing Dishes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingDishes.map((dish, index) => (
                <div key={dish.dish} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{dish.dish}</div>
                      <div className="text-xs text-gray-500">{dish.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">R{dish.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Profit: R{dish.profit.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-orange-500" />
            Quick Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <FileText className="h-5 w-5 mb-1" />
              <span className="text-xs">Monthly P&L</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <TrendingUp className="h-5 w-5 mb-1" />
              <span className="text-xs">Sales Report</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <TrendingDown className="h-5 w-5 mb-1" />
              <span className="text-xs">Expense Report</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <Download className="h-5 w-5 mb-1" />
              <span className="text-xs">Tax Summary</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordsManager;
