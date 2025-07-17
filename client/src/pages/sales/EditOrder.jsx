import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function EditOrder() {
  const [, setLocation] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState({
    breads: true,
    buns: false,
    cakes: false
  });

  // Sample order data matching reference
  const [orderData, setOrderData] = useState({
    orderNumber: '986673639',
    orderDate: '21/04/2025',
    customerName: 'Sri Venkateshwara Enterprises',
    orderAmount: 'INR 1,280.00',
    address: 'SV University Campus Canteen\nTirupathi, AP - 518326',
    totalItems: 26,
    status: 'Created',
    products: {
      'premium-sandwich': 4,
      'premium-milk': 5,
      'whole-wheat': 5,
      'premium-brown': 0,
      'zero-maida-ragi': 3,
      'multi-grain': 0,
      'fruit-bread': 0,
      'kulcha-bread': 4,
      'pizza-bases': 5,
      'atta-pav': 4,
      'premium-bombay-pav': 8,
      'burger': 0,
      'cream-bun-chocolate': 5,
      'cream-bun-strawberry': 5
    }
  });

  const productCategories = [
    {
      id: 'breads',
      name: 'Breads',
      products: [
        { id: 'premium-sandwich', name: 'Premium Sandwich 400g', image: '/api/placeholder/40/40' },
        { id: 'premium-milk', name: 'Premium Milk 400g', image: '/api/placeholder/40/40' },
        { id: 'whole-wheat', name: '100% Whole Wheat 400g', image: '/api/placeholder/40/40' },
        { id: 'premium-brown', name: 'Premium Brown 400 g', image: '/api/placeholder/40/40' },
        { id: 'zero-maida-ragi', name: 'Zero Maida Ragi', image: '/api/placeholder/40/40' },
        { id: 'multi-grain', name: 'Multi-Grain Zero Maida 400 g', image: '/api/placeholder/40/40' },
        { id: 'fruit-bread', name: 'Fruit Bread', image: '/api/placeholder/40/40' },
        { id: 'kulcha-bread', name: 'Kulcha Bread', image: '/api/placeholder/40/40' },
        { id: 'pizza-bases', name: 'Fresh Pizza Bases - Twin Pack', image: '/api/placeholder/40/40' }
      ]
    },
    {
      id: 'buns',
      name: 'Buns',
      products: [
        { id: 'atta-pav', name: 'Atta Pav 6 Nos', image: '/api/placeholder/40/40' },
        { id: 'premium-bombay-pav', name: 'Premium Bombay Pav 6 Nos', image: '/api/placeholder/40/40' },
        { id: 'burger', name: 'Burger 4 Nos', image: '/api/placeholder/40/40' },
        { id: 'cream-bun-chocolate', name: 'Cream Bun - Chocolate', image: '/api/placeholder/40/40' },
        { id: 'cream-bun-strawberry', name: 'Cream Bun - Strawberry', image: '/api/placeholder/40/40' },
        { id: 'cream-bun-vanilla', name: 'Cream Bun - Vanilla', image: '/api/placeholder/40/40' }
      ]
    },
    {
      id: 'cakes',
      name: 'Cakes & Cookies',
      products: [
        { id: 'chocolate-cup-cakes', name: 'Chocolate Cup Cakes - 6 Nos', image: '/api/placeholder/40/40' },
        { id: 'fruit-cup-cakes', name: 'Fruit Cup Cakes - 6 Nos', image: '/api/placeholder/40/40' },
        { id: 'vanilla-cup-cakes', name: 'Vanilla Cup Cakes - 6 Nos', image: '/api/placeholder/40/40' },
        { id: 'coconut-cookies', name: 'Coconut Cookies 200g', image: '/api/placeholder/40/40' },
        { id: 'osmania-biscuits', name: 'Osmania Biscuits 200g', image: '/api/placeholder/40/40' }
      ]
    }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const updateProductQuantity = (productId, quantity) => {
    const numQuantity = parseInt(quantity) || 0;
    setOrderData(prev => ({
      ...prev,
      products: {
        ...prev.products,
        [productId]: numQuantity
      }
    }));
  };

  const getTotalQuantity = () => {
    return Object.values(orderData.products).reduce((total, qty) => {
      return total + (parseInt(qty) || 0);
    }, 0);
  };

  const handleSaveChanges = () => {
    console.log('Order saved:', orderData);
    setLocation('/sales/orders');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Edit className="h-5 w-5 text-red-600" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Edit Order</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleSaveChanges}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 text-sm"
            >
              Save Changes
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setLocation('/sales/orders')}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Order Info Section */}
        <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Order#</span>
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">{orderData.orderNumber}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Order Date</span>
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">{orderData.orderDate}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Order Status</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-base font-medium text-green-600">{orderData.status}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Customer Name</span>
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">{orderData.customerName}</span>
              <div className="mt-4">
                <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Address</span>
                <span className="text-base text-gray-900 dark:text-gray-100 whitespace-pre-line">{orderData.address}</span>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Order Amount</span>
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">{orderData.orderAmount}</span>
              <div className="mt-4">
                <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Total Items</span>
                <span className="text-base font-medium text-gray-900 dark:text-gray-100">{getTotalQuantity()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="space-y-6">
          {productCategories.map((category) => (
            <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <Collapsible
                open={expandedCategories[category.id]}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      {expandedCategories[category.id] ? (
                        <ChevronDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                        {category.name}
                      </span>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="bg-white dark:bg-gray-900">
                    {/* Table Header */}
                    <div className="grid grid-cols-2 gap-6 px-6 py-4 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700">
                      <div>ITEM NAME</div>
                      <div className="text-right">QUANTITY</div>
                    </div>
                    
                    {/* Products */}
                    <div>
                      {category.products.map((product) => (
                        <div key={product.id} className="grid grid-cols-2 gap-6 px-6 py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 items-center">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-10 h-10 rounded" />
                            </div>
                            <span className="text-base text-gray-900 dark:text-gray-100">
                              {product.name}
                            </span>
                          </div>
                          <div className="flex justify-end">
                            <Input
                              type="number"
                              min="0"
                              value={orderData.products[product.id] || 0}
                              onChange={(e) => updateProductQuantity(product.id, e.target.value)}
                              className="w-16 h-8 text-center text-sm border-gray-300 dark:border-gray-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Category Totals */}
                    <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 font-medium border-t">
                      <div className="text-sm text-gray-900 dark:text-gray-100">Totals</div>
                      <div className="text-right text-sm text-gray-900 dark:text-gray-100">
                        {category.products.reduce((total, product) => {
                          return total + (parseInt(orderData.products[product.id]) || 0);
                        }, 0)}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>

        {/* Overall Totals */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">Grand Total</span>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{getTotalQuantity()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}