import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Edit, Calendar, Search, Upload, ChevronDown } from 'lucide-react';

export default function OrdersList() {
  const [, setLocation] = useLocation();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All Categories',
    status: 'None',
    orderDate: '',
    search: ''
  });

  // Sample orders data matching your reference
  const orders = [
    {
      id: '986673639',
      orderNumber: '986673639',
      orderDate: '21/04/2025',
      customerName: 'Sri Venkate...',
      fullCustomerName: 'Sri Venkateshwara Enterprises',
      status: 'Created',
      totalItems: 23,
      orderAmount: 'INR 1,280.00',
      address: 'SV University Campus Canteen\nTirupathi, AP - 518326',
      items: [
        {
          category: 'Buns / Sweet',
          name: 'Buns - 5 pcs',
          image: '/api/placeholder/40/40',
          qty: 4,
          unitCost: 25.00,
          totalCost: 100.00
        },
        {
          category: 'Bread',
          name: 'Premium Milk 400 gms',
          image: '/api/placeholder/40/40',
          qty: 5,
          unitCost: 50.00,
          totalCost: 250.00
        },
        {
          category: 'Cakes & Cookies',
          name: 'Fruit Cup Cakes 6 Pcs',
          image: '/api/placeholder/40/40',
          qty: 6,
          unitCost: 30.00,
          totalCost: 360.00
        },
        {
          category: 'Breads',
          name: 'Fruit Bread',
          image: '/api/placeholder/40/40',
          qty: 3,
          unitCost: 30.00,
          totalCost: 90.00
        },
        {
          category: 'Cakes & Cookies',
          name: 'Coconut',
          image: '/api/placeholder/40/40',
          qty: 2,
          unitCost: 50.00,
          totalCost: 180.00
        },
        {
          category: 'Cakes & Cookies',
          name: 'Butter Cookies',
          image: '/api/placeholder/40/40',
          qty: 3,
          unitCost: 50.00,
          totalCost: 300.00
        }
      ]
    },
    {
      id: '986673640',
      orderNumber: '986673640',
      orderDate: '21/04/2025',
      customerName: 'Padmavath...',
      fullCustomerName: 'Padmavathi Bakery',
      status: 'Created',
      totalItems: 15,
      orderAmount: 'INR 850.00'
    },
    {
      id: '986673641',
      orderNumber: '986673641',
      orderDate: '21/04/2025',
      customerName: 'Sri Venkate...',
      fullCustomerName: 'Sri Venkateshwara Enterprises',
      status: 'Created',
      totalItems: 18,
      orderAmount: 'INR 950.00'
    },
    {
      id: '986673642',
      orderNumber: '986673642',
      orderDate: '21/04/2025',
      customerName: 'Padmavath...',
      fullCustomerName: 'Padmavathi Bakery',
      status: 'Created',
      totalItems: 12,
      orderAmount: 'INR 720.00'
    },
    {
      id: '986673643',
      orderNumber: '986673643',
      orderDate: '21/04/2025',
      customerName: 'Sri Venkate...',
      fullCustomerName: 'Sri Venkateshwara Enterprises',
      status: 'Created',
      totalItems: 25,
      orderAmount: 'INR 1,450.00'
    },
    {
      id: '986673644',
      orderNumber: '986673644',
      orderDate: '21/04/2025',
      customerName: 'Padmavath...',
      fullCustomerName: 'Padmavathi Bakery',
      status: 'Created',
      totalItems: 20,
      orderAmount: 'INR 1,100.00'
    },
    {
      id: '986673645',
      orderNumber: '986673645',
      orderDate: '21/04/2025',
      customerName: 'Sri Venkate...',
      fullCustomerName: 'Sri Venkateshwara Enterprises',
      status: 'Created',
      totalItems: 14,
      orderAmount: 'INR 890.00'
    },
    {
      id: '986673646',
      orderNumber: '986673646',
      orderDate: '21/04/2025',
      customerName: 'Padmavath...',
      fullCustomerName: 'Padmavathi Bakery',
      status: 'Created',
      totalItems: 22,
      orderAmount: 'INR 1,350.00'
    },
    {
      id: '986673647',
      orderNumber: '986673647',
      orderDate: '21/04/2025',
      customerName: 'Sri Venkate...',
      fullCustomerName: 'Sri Venkateshwara Enterprises',
      status: 'Created',
      totalItems: 16,
      orderAmount: 'INR 980.00'
    }
  ];

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Simple Clean Header */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-red-600" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Orders</h1>
          </div>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 text-sm"
            onClick={() => setLocation('/sales/new-order')}
          >
            <Edit className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Simple Filters Section */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Select Category</label>
            <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
              <SelectTrigger className="w-full h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Breads">Breads</SelectItem>
                <SelectItem value="Buns">Buns</SelectItem>
                <SelectItem value="Cakes & Cookies">Cakes & Cookies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Order Date</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="DD/MM/YYYY"
                value={filters.orderDate}
                onChange={(e) => setFilters({...filters, orderDate: e.target.value})}
                className="w-full h-10 pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Filter By Status</label>
            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger className="w-full h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Search</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search orders..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full h-10 pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Clean Orders Container */}
      <div className="px-6 py-4 bg-white dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Orders List Header */}
          <div className="px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">My Orders List</h2>
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 text-sm">
                <Upload className="h-4 w-4 mr-2" />
                EXPORT
              </Button>
            </div>
          </div>

          {/* Table Header */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
              <div>ORDER #</div>
              <div className="flex items-center">
                ORDER DATE
                <ChevronDown className="h-3 w-3 ml-1" />
              </div>
              <div>CUST. NAME</div>
              <div></div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-gray-900">
        {orders.map((order) => (
          <div key={order.id}>
            {/* Simple Order Row */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="text-sm text-gray-900 dark:text-gray-100">{order.orderNumber}</div>
                <div className="text-sm text-gray-900 dark:text-gray-100">{order.orderDate}</div>
                <div className="text-sm text-gray-900 dark:text-gray-100">{order.customerName}</div>
                <div className="text-right">
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    {expandedOrder === order.id ? 'LESS' : 'MORE'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Simple Expanded Order Details */}
            {expandedOrder === order.id && order.items && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {/* Customer Info */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Customer Name</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">{order.fullCustomerName}</div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Order#</span>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{order.orderNumber}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Order Date</span>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{order.orderDate}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Order Status</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-600 font-medium">{order.status}</span>
                      </div>
                    </div>
                    <div></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Total Items</span>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{order.totalItems}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Order Amount</span>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{order.orderAmount}</div>
                    </div>
                  </div>
                </div>

                {/* Item Details Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Item Details</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-red-600 hover:text-red-700 text-sm"
                    onClick={() => setLocation('/sales/edit-order')}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    EDIT
                  </Button>
                </div>

                {/* Items Table */}
                <div className="bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700">
                    <div className="col-span-2">ITEM CATEGORY / NAME</div>
                    <div className="text-center">QTY</div>
                    <div className="text-center">UNIT COST</div>
                    <div className="text-center">TOTAL COST</div>
                  </div>

                  {/* Items */}
                  {order.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 items-center">
                      <div className="col-span-2 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.category}</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">{item.name}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-900 dark:text-gray-100 text-center">{item.qty}</div>
                      <div className="text-sm text-gray-900 dark:text-gray-100 text-center">{item.unitCost?.toFixed(2) || '0.00'}</div>
                      <div className="text-sm text-gray-900 dark:text-gray-100 text-center">{item.totalCost?.toFixed(2) || '0.00'}</div>
                    </div>
                  ))}

                  {/* Totals */}
                  <div className="grid grid-cols-5 gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 font-medium border-t border-gray-200 dark:border-gray-700">
                    <div className="col-span-2"></div>
                    <div className="text-sm text-gray-900 dark:text-gray-100 text-center">Totals</div>
                    <div className="text-sm text-gray-900 dark:text-gray-100 text-center">{order.totalItems}</div>
                    <div className="text-sm text-gray-900 dark:text-gray-100 text-center">{order.orderAmount}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
          </div>
        </div>
      </div>
    </div>
  );
}