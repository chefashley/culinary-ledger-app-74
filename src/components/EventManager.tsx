
import { Calendar, Users, DollarSign, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EventManager = () => {
  const events = [
    {
      id: 1,
      name: 'Wedding Reception - Smith Family',
      date: '2024-02-15',
      time: '18:00',
      guests: 120,
      budget: 45000,
      spent: 32000,
      status: 'In Progress',
      venue: 'Vineyard Estate, Stellenbosch',
      menuItems: ['Salmon Starter', 'Beef Wellington', 'Chocolate Tart'],
      contact: 'Emma Smith - +27 82 123 4567'
    },
    {
      id: 2,
      name: 'Corporate Gala Dinner',
      date: '2024-02-20',
      time: '19:30',
      guests: 200,
      budget: 85000,
      spent: 15000,
      status: 'Planning',
      venue: 'Convention Centre, Cape Town',
      menuItems: ['Canapé Selection', 'Grilled Kingklip', 'Malva Pudding'],
      contact: 'James Wilson - +27 21 987 6543'
    },
    {
      id: 3,
      name: 'Birthday Celebration',
      date: '2024-02-10',
      time: '14:00',
      guests: 50,
      budget: 18000,
      spent: 18000,
      status: 'Completed',
      venue: 'Private Residence, Sandton',
      menuItems: ['Garden Salad', 'Roast Chicken', 'Birthday Cake'],
      contact: 'Sarah Davis - +27 11 555 0123'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Event Management</CardTitle>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Budget Usage</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round((event.spent / event.budget) * 100)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-sm text-gray-600">Date & Time</div>
                    <div className="font-medium">{new Date(event.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-sm text-gray-600">Guests</div>
                    <div className="font-medium">{event.guests} people</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-sm text-gray-600">Budget</div>
                    <div className="font-medium">R{event.budget.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Spent: R{event.spent.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-sm text-gray-600">Days Until</div>
                    <div className="font-medium">
                      {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Venue</div>
                  <div className="text-sm text-gray-600">{event.venue}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Contact</div>
                  <div className="text-sm text-gray-600">{event.contact}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-900 mb-1">Menu Items</div>
                <div className="flex flex-wrap gap-2">
                  {event.menuItems.map((item, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Remaining Budget: 
                    <span className={`ml-1 font-medium ${event.budget - event.spent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R{(event.budget - event.spent).toLocaleString()}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Edit Event
                    </Button>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventManager;
