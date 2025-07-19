import React, { useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Plus, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2, 
  FileText,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Minus,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Settings
} from 'lucide-react';

// Bakery brands and products data
const bakeryData = {
  "Britannia": [
    { id: 1, name: "Good Day Cashew Cookies", price: 25, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&h=100&fit=crop" },
    { id: 2, name: "Marie Gold Biscuits", price: 15, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 3, name: "Milk Bikis", price: 20, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 4, name: "Bourbon Chocolate Cream", price: 35, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 5, name: "50-50 Maska Chaska", price: 30, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" }
  ],
  "Parle": [
    { id: 6, name: "Parle-G Gold", price: 10, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 7, name: "Hide & Seek Chocolate Chip", price: 40, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 8, name: "Monaco Classic Salted", price: 20, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 9, name: "Krackjack Sweet & Salty", price: 25, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 10, name: "Melody Chocolaty", price: 15, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" }
  ],
  "Sunfeast": [
    { id: 11, name: "Dark Fantasy Choco Fills", price: 50, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 12, name: "Mom's Magic Rich Butter", price: 45, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&h=100&fit=crop" },
    { id: 13, name: "Dream Cream Vanilla", price: 35, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 14, name: "Bounce Cake Bar", price: 55, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=100&h=100&fit=crop" },
    { id: 15, name: "Farmlite Digestive Oats", price: 40, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" }
  ],
  "Oreo": [
    { id: 16, name: "Oreo Original Sandwich", price: 30, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 17, name: "Oreo Chocolate Creme", price: 35, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 18, name: "Oreo Strawberry Creme", price: 35, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 19, name: "Oreo Vanilla Creme", price: 35, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" }
  ],
  "McVitie's": [
    { id: 20, name: "Digestive Original", price: 65, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 21, name: "Dark Chocolate Digestive", price: 75, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 22, name: "Hobnobs Oats", price: 80, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 23, name: "Rich Tea Classic", price: 60, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" }
  ]
};

// Customer data
// Customer order history data
const customerOrderHistory = {
  "ABC Corporation": [
    { orderId: "ORD-001", brand: "Britannia", product: "Good Day Cashew Cookies", quantity: 5, price: 25, date: "2024-01-15" },
    { orderId: "ORD-001", brand: "Parle", product: "Parle-G Gold", quantity: 10, price: 10, date: "2024-01-15" },
    { orderId: "ORD-002", brand: "Sunfeast", product: "Dark Fantasy Choco Fills", quantity: 3, price: 50, date: "2024-01-10" }
  ],
  "XYZ Bakery": [
    { orderId: "ORD-003", brand: "Britannia", product: "Marie Gold Biscuits", quantity: 8, price: 15, date: "2024-01-14" },
    { orderId: "ORD-003", brand: "Oreo", product: "Oreo Original Cookies", quantity: 6, price: 40, date: "2024-01-14" },
    { orderId: "ORD-004", brand: "McVities", product: "Digestive Original", quantity: 4, price: 35, date: "2024-01-12" }
  ],
  "Fresh Foods Ltd": [
    { orderId: "ORD-005", brand: "Parle", product: "Hide & Seek Chocolate Chip", quantity: 7, price: 40, date: "2024-01-13" },
    { orderId: "ORD-005", brand: "Sunfeast", product: "Mom's Magic Rich Butter", quantity: 5, price: 30, date: "2024-01-13" }
  ],
  "City Mart": [
    { orderId: "ORD-006", brand: "Britannia", product: "Bourbon Chocolate Cream", quantity: 12, price: 35, date: "2024-01-11" },
    { orderId: "ORD-006", brand: "Parle", product: "Monaco Classic Salted", quantity: 8, price: 20, date: "2024-01-11" },
    { orderId: "ORD-007", brand: "Oreo", product: "Oreo Chocolate Cookies", quantity: 6, price: 45, date: "2024-01-09" }
  ],
  "Sweet Corner": [
    { orderId: "ORD-008", brand: "Sunfeast", product: "Bounce Cake Chocolate", quantity: 4, price: 25, date: "2024-01-08" },
    { orderId: "ORD-008", brand: "McVities", product: "Hobnobs Oats Cookies", quantity: 3, price: 45, date: "2024-01-08" }
  ],
  "Royal Bakery": [
    { orderId: "ORD-009", brand: "Britannia", product: "50-50 Maska Chaska", quantity: 15, price: 30, date: "2024-01-07" },
    { orderId: "ORD-009", brand: "Parle", product: "Krackjack Sweet & Salty", quantity: 9, price: 25, date: "2024-01-07" }
  ],
  "Golden Foods": [
    { orderId: "ORD-010", brand: "Oreo", product: "Oreo Strawberry Cookies", quantity: 5, price: 45, date: "2024-01-06" },
    { orderId: "ORD-010", brand: "Sunfeast", product: "Dream Cream Vanilla", quantity: 7, price: 35, date: "2024-01-06" }
  ],
  "Metro Store": [
    { orderId: "ORD-011", brand: "McVities", product: "Rich Tea Classic", quantity: 6, price: 30, date: "2024-01-05" },
    { orderId: "ORD-011", brand: "Britannia", product: "Milk Bikis", quantity: 10, price: 20, date: "2024-01-05" }
  ],
  "Tasty Treats": [
    { orderId: "ORD-012", brand: "Parle", product: "Melody Chocolaty", quantity: 8, price: 15, date: "2024-01-04" },
    { orderId: "ORD-012", brand: "Sunfeast", product: "Farmlite Digestive High Fibre", quantity: 4, price: 40, date: "2024-01-04" }
  ],
  "Sunrise Cafe": [
    { orderId: "ORD-013", brand: "Unibic", product: "Butter Cookies", quantity: 6, price: 50, date: "2024-01-03" },
    { orderId: "ORD-013", brand: "Oreo", product: "Oreo Vanilla Cookies", quantity: 4, price: 45, date: "2024-01-03" }
  ]
};

const customers = Object.keys(customerOrderHistory);

// Enhanced form component with customer order-based product selection
const CreateEntryForm = ({ onClose, editData = null }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customer: editData?.customerName || '',
    date: editData?.date || new Date().toISOString().split('T')[0],
    reason: editData?.reason || '',
    products: []
  });

  const [productQuantities, setProductQuantities] = useState({});
  const [expandedBrands, setExpandedBrands] = useState({});

  // Bakery products organized by brand
  const bakeryProducts = [
    { id: 1, brand: 'Britannia', name: 'Marie Gold Biscuits', price: 15, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&h=150&fit=crop' },
    { id: 2, brand: 'Britannia', name: 'Good Day Cashew Cookies', price: 25, image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=150&h=150&fit=crop' },
    { id: 3, brand: 'Britannia', name: 'Milk Bikis Biscuits', price: 20, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=150&h=150&fit=crop' },
    { id: 4, brand: 'Oreo', name: 'Oreo Original Cookies', price: 40, image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=150&h=150&fit=crop' },
    { id: 5, brand: 'Oreo', name: 'Oreo Chocolate Cream', price: 45, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop' },
    { id: 6, brand: 'McVities', name: 'Digestive Original', price: 35, image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=150&h=150&fit=crop' },
    { id: 7, brand: 'McVities', name: 'Dark Chocolate Digestive', price: 42, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=150&h=150&fit=crop' }
  ];



  // Sample customers
  const customers = [
    'ABC Corporation',
    'XYZ Bakery',  
    'Fresh Foods Ltd',
    'City Restaurant',
    'Hotel Paradise',
    'Corner Cafe',
    'Sweet Treats',
    'Daily Bread Co'
  ];

  // Initialize data for edit mode
  React.useEffect(() => {
    if (editData?.products) {
      const quantities = {};
      editData.products.forEach(product => {
        const bakeryProduct = bakeryProducts.find(p => p.name === product.product && p.brand === product.brand);
        if (bakeryProduct) {
          quantities[bakeryProduct.id] = product.returnQuantity || 0;
        }
      });
      setProductQuantities(quantities);
    }
  }, [editData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value) || 0;
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, numValue)
    }));
  };

  const toggleBrand = (brand) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brand]: !prev[brand]
    }));
  };



  const getSelectedProducts = () => {
    return bakeryProducts
      .filter(product => (productQuantities[product.id] || 0) > 0)
      .map(product => ({
        ...product,
        returnQuantity: productQuantities[product.id]
      }));
  };

  const getSelectedUnits = () => {
    return Object.values(productQuantities).reduce((total, quantity) => total + (quantity || 0), 0);
  };

  const calculateTotal = () => {
    return getSelectedProducts().reduce((total, product) => {
      return total + (product.returnQuantity * product.price);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customer) {
      toast({
        title: "Validation Error",
        description: "Please select a customer",
        variant: "destructive"
      });
      return;
    }

    const selectedProducts = getSelectedProducts();
    if (selectedProducts.length === 0) {
      toast({
        title: "Validation Error", 
        description: "Please enter return quantities for at least one product",
        variant: "destructive"
      });
      return;
    }

    // Check if reason is provided
    if (!formData.reason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for the return",
        variant: "destructive"
      });
      return;
    }

    // Generate or use existing entry ID
    const entryId = editData?.id || `RT${String(Date.now()).slice(-4)}`;
    
    const entry = {
      id: entryId,
      type: 'return',
      customerName: formData.customer,
      date: formData.date,
      reason: formData.reason,
      products: selectedProducts.map(p => ({
        brand: p.brand,
        product: p.name,
        returnQuantity: p.returnQuantity,
        unitPrice: p.price
      })),
      totalAmount: calculateTotal(),
      status: editData?.status || 'pending'
    };

    // Save to localStorage
    const existingEntries = JSON.parse(localStorage.getItem('refundDamageEntries') || '[]');
    
    if (editData) {
      // Update existing entry
      const index = existingEntries.findIndex(e => e.id === editData.id);
      if (index !== -1) {
        existingEntries[index] = entry;
      }
    } else {
      // Add new entry
      existingEntries.push(entry);
    }
    
    localStorage.setItem('refundDamageEntries', JSON.stringify(existingEntries));

    toast({
      title: "Success",
      description: `Return entry ${editData ? 'updated' : 'created'} successfully with ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}`,
    });

    onClose();
    window.location.reload();
  };

  return (
    <div className="space-y-4">

      {/* Customer Selection */}
      <div>
        <Label className="text-sm font-medium">Customer *</Label>
        <Select value={formData.customer} onValueChange={(value) => handleInputChange('customer', value)}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer} value={customer}>{customer}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date */}
      <div>
        <Label className="text-sm font-medium">Date</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className="h-11"
        />
      </div>

      {/* Products Section - Collapsible by Brand */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Products for Return</h3>
          {getSelectedUnits() > 0 && (
            <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full">
              {getSelectedUnits()} units
            </span>
          )}
        </div>

        {/* Products by Brand - Collapsible */}
        {['Britannia', 'Oreo', 'McVities'].map((brand) => {
          const brandProducts = bakeryProducts.filter(product => product.brand === brand);
          const isExpanded = expandedBrands[brand];
          return (
            <div key={brand} className="border border-gray-200 dark:border-gray-700 rounded-lg">
              {/* Brand Header - Clickable */}
              <button
                type="button"
                onClick={() => toggleBrand(brand)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{brand}</h4>
                  <span className="text-xs text-gray-500">
                    ({brandProducts.length} products)
                  </span>
                </div>
              </button>
              
              {/* Brand Products - Expandable */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {brandProducts.map((product) => (
                      <div key={product.id} className="p-3">
                        <div className="flex items-center gap-3">
                          {/* Product Image */}
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&h=150&fit=crop';
                            }}
                          />
                          
                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{product.name}</h4>
                            <p className="text-xs text-gray-500">₹{product.price} per unit</p>
                          </div>
                          
                          {/* Return Quantity Input */}
                          <div className="w-24">
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={productQuantities[product.id] || ''}
                              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                              className="text-center text-sm h-9 w-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Return/Damage Summary */}
      {getSelectedProducts().length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-sm text-red-700 dark:text-red-300">Return/Damage Summary</h4>
              <p className="text-xs text-red-500 dark:text-red-400">{getSelectedProducts().length} product types • {getSelectedUnits()} total units</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-red-600 dark:text-red-400">
                {getSelectedUnits()}
              </div>
              <div className="text-xs text-red-500 dark:text-red-400">Items to Return</div>
            </div>
          </div>
        </div>
      )}

      {/* Reason Field - Always Visible */}
      <div className="mt-4">
        <Label className="text-sm font-medium">Reason for Return/Damage</Label>
        <Input
          placeholder="Specify return/damage reason (e.g., damaged during transit, quality defect, wrong product, expired items, packaging issues)"
          value={formData.reason || ''}
          onChange={(e) => handleInputChange('reason', e.target.value)}
          className="h-11 mt-1"
        />
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="h-11 order-2 sm:order-1">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!formData.customer || getSelectedProducts().length === 0}
          className="h-11 order-1 sm:order-2"
        >
          {editData ? 'Update Return/Damage Entry' : 'Create Return/Damage Entry'}
        </Button>
      </div>
    </div>
  );
};

const RefundDamage = () => {
  const { hasFeatureAccess } = usePermissions();
  const { toast } = useToast();
  
  // Check permissions
  const permissions = {
    canView: hasFeatureAccess('sales', 'refundReturn', 'view'),
    canAdd: hasFeatureAccess('sales', 'refundReturn', 'add'),
    canEdit: hasFeatureAccess('sales', 'refundReturn', 'edit'),
    canDelete: hasFeatureAccess('sales', 'refundReturn', 'delete')
  };

  if (!permissions.canView) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to view Return/Damage.</p>
        </div>
      </div>
    );
  }

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Dummy data
  const [entries] = useState([
    {
      id: 'RD001',
      customerName: 'ABC Corporation',
      invoiceNumber: 'INV-2024-001',
      productName: 'Fresh Bread Loaf',
      quantity: 5,
      unitPrice: 45.00,
      totalAmount: 225.00,
      type: 'refund',
      status: 'pending',
      reason: 'Quality issue',
      date: '2024-01-15',
      remarks: 'Customer reported stale product'
    },
    {
      id: 'RD002', 
      customerName: 'XYZ Bakery',
      invoiceNumber: 'INV-2024-002',
      productName: 'Chocolate Cake',
      quantity: 2,
      unitPrice: 350.00,
      totalAmount: 700.00,
      type: 'damage',
      status: 'approved',
      reason: 'Transport damage',
      date: '2024-01-14',
      remarks: 'Damaged during delivery'
    },
    {
      id: 'RD003',
      customerName: 'Fresh Foods Ltd',
      invoiceNumber: 'INV-2024-003',
      productName: 'Burger Buns',
      quantity: 50,
      unitPrice: 8.00,
      totalAmount: 400.00,
      type: 'refund',
      status: 'completed',
      reason: 'Wrong specifications',
      date: '2024-01-13',
      remarks: 'Delivered wrong size buns'
    },
    {
      id: 'RD004',
      customerName: 'City Restaurant',
      invoiceNumber: 'INV-2024-004',
      productName: 'Croissants',
      quantity: 24,
      unitPrice: 15.00,
      totalAmount: 360.00,
      type: 'damage',
      status: 'rejected',
      reason: 'Manufacturing defect',
      date: '2024-01-12',
      remarks: 'Claim rejected - no defect found'
    }
  ]);

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesType = typeFilter === 'all' || entry.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Stats calculation
  const stats = {
    total: entries.length,
    pending: entries.filter(e => e.status === 'pending').length,
    approved: entries.filter(e => e.status === 'approved').length,
    completed: entries.filter(e => e.status === 'completed').length
  };

  // Badge variants
  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'completed': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeVariant = (type) => {
    return type === 'refund' ? 'default' : 'outline';
  };

  // Handle actions
  const handleView = (entry) => {
    setSelectedEntry(entry);
    setIsViewModalOpen(true);
  };

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleStatusUpdate = (entry) => {
    setSelectedEntry(entry);
    setIsStatusModalOpen(true);
  };

  const updateStatus = (newStatus) => {
    const existingEntries = JSON.parse(localStorage.getItem('refundDamageEntries') || '[]');
    const updatedEntries = existingEntries.map(entry => 
      entry.id === selectedEntry.id 
        ? { ...entry, status: newStatus }
        : entry
    );
    localStorage.setItem('refundDamageEntries', JSON.stringify(updatedEntries));
    
    toast({
      title: "Success",
      description: `Status updated to ${newStatus}`,
    });
    
    setIsStatusModalOpen(false);
    window.location.reload();
  };

  const handleDelete = (id) => {
    toast({
      title: "Deleted",
      description: "Return/Damage entry deleted successfully",
      variant: "destructive",
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshed",
      description: "Data has been refreshed",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with blue gradient matching Orders pattern */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <FileText className="h-8 w-8 mr-3 text-white" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Return/Damage</h1>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            {permissions.canAdd && (
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                size="sm"
                className="bg-white text-blue-600 hover:bg-blue-50 h-9 w-9 p-0 rounded-md"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <Button 
              onClick={handleRefresh}
              size="sm"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 h-9 w-9 p-0 rounded-md"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      {/* Entry List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Entry List</h2>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CUSTOMER</TableHead>
                  <TableHead className="text-center">STATUS</TableHead>
                  {(permissions.canView || permissions.canEdit || permissions.canDelete) && (
                    <TableHead className="text-center w-32">ACTIONS</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Package className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No entries found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{entry.customerName}</span>
                          <span className="text-sm text-gray-500">{entry.id}</span>
                          <span className="text-sm text-gray-500">
                            {entry.type === 'refund' ? 'Return' : 'Damage'} • {entry.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusVariant(entry.status)}>
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </Badge>
                      </TableCell>
                      {(permissions.canView || permissions.canEdit || permissions.canDelete) && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-0">
                            {permissions.canView && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleView(entry)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {permissions.canEdit && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEdit(entry)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusUpdate(entry)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            {permissions.canDelete && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDelete(entry.id)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Return/Damage Entry - {selectedEntry?.quantity || 0} Units
            </DialogTitle>
            <DialogDescription>
              View complete refund/damage entry information with quantities and damage details.
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Entry Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Entry ID:</span> {selectedEntry.id}</p>
                    <p><span className="font-medium">Type:</span> {selectedEntry.type === 'refund' ? 'Refund' : 'Damage'}</p>
                    <p><span className="font-medium">Status:</span> {selectedEntry.status}</p>
                    <p><span className="font-medium">Date:</span> {selectedEntry.date}</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Customer Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Customer:</span> {selectedEntry.customerName}</p>
                    <p><span className="font-medium">Invoice:</span> {selectedEntry.invoiceNumber}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Product & Amount</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><span className="font-medium">Product:</span> {selectedEntry.productName}</p>
                    <p><span className="font-medium">Quantity:</span> {selectedEntry.quantity}</p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="font-medium">Unit Price:</span> ₹{selectedEntry.unitPrice}</p>
                    <p><span className="font-medium">Total Amount:</span> ₹{selectedEntry.totalAmount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Reason & Remarks</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Reason:</span> {selectedEntry.reason}</p>
                  <p><span className="font-medium">Remarks:</span> {selectedEntry.remarks}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Modal - Mobile Optimized */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto mx-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-lg">Create Return/Damage Entry</DialogTitle>
            <DialogDescription className="text-sm">
              Record return or damage items with product quantities, pricing details, and specific damage reasons.
            </DialogDescription>
          </DialogHeader>
          <CreateEntryForm onClose={() => setIsCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal - Mobile Optimized */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto mx-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-lg">
              Edit Return/Damage Entry - {selectedEntry?.quantity || 0} Units
            </DialogTitle>
            <DialogDescription className="text-sm">
              Update product quantities, unit pricing, return/damage reasons, and processing status.
            </DialogDescription>
          </DialogHeader>
          <CreateEntryForm onClose={() => setIsEditModalOpen(false)} editData={selectedEntry} />
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Change the status of this refund/damage entry.
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">Entry Details</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Customer:</span> {selectedEntry.customerName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Type:</span> {selectedEntry.type === 'refund' ? 'Refund' : 'Damage'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Current Status:</span> 
                  <Badge variant={getStatusVariant(selectedEntry.status)} className="ml-2">
                    {selectedEntry.status.charAt(0).toUpperCase() + selectedEntry.status.slice(1)}
                  </Badge>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Select New Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'approved', 'completed', 'rejected'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedEntry.status === status ? "default" : "outline"}
                      onClick={() => updateStatus(status)}
                      className="w-full"
                      disabled={selectedEntry.status === status}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsStatusModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RefundDamage;