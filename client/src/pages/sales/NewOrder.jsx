import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, X, FileText } from 'lucide-react';

export default function NewOrder() {
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    customerName: 'Padmavathi Ba...',
    orderDate: '15/05/2025',
    products: {}
  });
  
  const [expandedCategories, setExpandedCategories] = useState({
    breads: false,
    buns: true,
    cakes: false
  });

  // Product categories exactly matching your reference images
  const productCategories = [
    {
      id: 'breads',
      name: 'Breads',
      products: [
        { id: 'premium-sandwich', name: 'Premium Sandwich 400g', image: '/api/placeholder/40/40' },
        { id: 'premium-milk', name: 'Premium Milk 400g', image: '/api/placeholder/40/40' },
        { id: 'whole-wheat', name: '100% Whole Wheat 400g', image: '/api/placeholder/40/40' },
        { id: 'premium-brown', name: 'Premium Brown 400 g', image: '/api/placeholder/40/40' },
        { id: 'zero-maida', name: 'Zero Maida Ragi', image: '/api/placeholder/40/40' },
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
        { id: 'burger-4', name: 'Burger 4 Nos', image: '/api/placeholder/40/40' },
        { id: 'cream-bun-chocolate', name: 'Cream Bun - Chocolate', image: '/api/placeholder/40/40' },
        { id: 'cream-bun-strawberry', name: 'Cream Bun - Strawberry', image: '/api/placeholder/40/40' },
        { id: 'cream-bun-vanilla', name: 'Cream Bun - Vanilla', image: '/api/placeholder/40/40' },
        { id: 'fruit-buns', name: 'Fruit Buns 2 Nos', image: '/api/placeholder/40/40' },
        { id: 'roti-buns', name: 'Roti Buns', image: '/api/placeholder/40/40' },
        { id: 'milk-buns', name: 'Milk Buns - 5 Pack', image: '/api/placeholder/40/40' }
      ]
    },
    {
      id: 'cakes',
      name: 'Cakes & Cookies',
      products: [
        { id: 'fruit-cup-cakes', name: 'Fruit Cup Cakes - 6 Pcs', image: '/api/placeholder/40/40' },
        { id: 'coconut-cookies', name: 'Coconut', image: '/api/placeholder/40/40' },
        { id: 'butter-cookies', name: 'Butter Cookies', image: '/api/placeholder/40/40' }
      ]
    }
  ];

  const customers = [
    'Padmavathi Bakery',
    'Royal Sweets & Bakery', 
    'Golden Bread House',
    'Fresh Bakes Corner'
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const updateProductQuantity = (productId, quantity) => {
    setFormData(prev => ({
      ...prev,
      products: {
        ...prev.products,
        [productId]: quantity
      }
    }));
  };

  const getTotalQuantity = () => {
    return Object.values(formData.products).reduce((total, qty) => {
      return total + (parseInt(qty) || 0);
    }, 0);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    setLocation('/sales/orders');
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-red-600" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">New Order</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-sm"
            >
              Submit
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation('/sales/orders')}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-md mx-auto p-4 pb-20">
        {/* Customer and Date Selection */}
        <div className="space-y-4 mb-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Select Customer
            </Label>
            <Select value={formData.customerName} onValueChange={(value) => setFormData({...formData, customerName: value})}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select customer..." />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer} value={customer}>
                    {customer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Order Date
            </Label>
            <Input
              type="text"
              value={formData.orderDate}
              onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
              className="w-full"
            />
          </div>
        </div>

        {/* Product Categories */}
        <div className="space-y-3">
          {productCategories.map((category) => (
            <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <Collapsible
                open={expandedCategories[category.id]}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      {expandedCategories[category.id] ? (
                        <ChevronDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {category.name}
                      </span>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="bg-white dark:bg-gray-900">
                    {/* Table Header */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase border-b">
                      <div>ITEM NAME</div>
                      <div className="text-right">QUANTITY</div>
                    </div>
                    
                    {/* Products */}
                    {category.products.map((product) => (
                      <div key={product.id} className="grid grid-cols-2 gap-4 p-3 border-b border-gray-100 dark:border-gray-700 items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-6 h-6 rounded"
                            />
                          </div>
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {product.name}
                          </span>
                        </div>
                        <div className="flex justify-end">
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={formData.products[product.id] || ''}
                            onChange={(e) => updateProductQuantity(product.id, e.target.value)}
                            className="w-16 h-8 text-center text-sm"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Totals Row */}
                    {expandedCategories[category.id] && (
                      <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 font-medium border-t">
                        <div className="text-sm text-gray-900 dark:text-gray-100">Totals</div>
                        <div className="text-right text-sm text-gray-900 dark:text-gray-100">
                          {Object.entries(formData.products)
                            .filter(([productId]) => 
                              category.products.some(p => p.id === productId)
                            )
                            .reduce((total, [, qty]) => total + (parseInt(qty) || 0), 0)
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}