
import { Phone, Mail, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SupplierList = () => {
  const suppliers = [
    {
      id: 1,
      name: 'Fresh Produce Co.',
      category: 'Vegetables & Fruits',
      contact: 'John Smith',
      phone: '+27 11 123 4567',
      email: 'orders@freshproduce.co.za',
      address: 'Johannesburg, Gauteng',
      rating: 4.8,
      paymentTerms: '30 days'
    },
    {
      id: 2,
      name: 'Premium Meats SA',
      category: 'Meat & Poultry',
      contact: 'Sarah Johnson',
      phone: '+27 21 987 6543',
      email: 'supply@premiummeats.co.za',
      address: 'Cape Town, Western Cape',
      rating: 4.9,
      paymentTerms: '15 days'
    },
    {
      id: 3,
      name: 'Ocean Fresh Seafood',
      category: 'Seafood',
      contact: 'Mike Wilson',
      phone: '+27 31 555 0123',
      email: 'fresh@oceanseafood.co.za',
      address: 'Durban, KwaZulu-Natal',
      rating: 4.7,
      paymentTerms: '7 days'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Vegetables & Fruits':
        return 'bg-green-100 text-green-800';
      case 'Meat & Poultry':
        return 'bg-red-100 text-red-800';
      case 'Seafood':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Supplier Directory</CardTitle>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCategoryColor(supplier.category)}`}>
                    {supplier.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-orange-600">★ {supplier.rating}</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-2" />
                  {supplier.phone}
                </div>
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-2" />
                  {supplier.email}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-2" />
                  {supplier.address}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Payment Terms:</span>
                  <span className="font-medium">{supplier.paymentTerms}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierList;
