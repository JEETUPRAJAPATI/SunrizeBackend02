import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search, 
  Plus, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  FileCheck,
  Check,
  ChevronsUpDown,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const MyOrders = () => {
  const { hasFeatureAccess, canPerformAction } = usePermissions();
  
  // Check if user has access to orders feature (check sales.orders, sales.myIndent, and orders.indent)
  const hasOrdersAccess = hasFeatureAccess('sales', 'orders', 'view') || hasFeatureAccess('sales', 'myIndent', 'view') || hasFeatureAccess('orders', 'indent', 'view');
  
  if (!hasOrdersAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to view My Orders.</p>
        </div>
      </div>
    );
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [editCustomerOpen, setEditCustomerOpen] = useState(false);
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Form data state
  const [formData, setFormData] = useState({
    customerName: '',
    orderDate: new Date().toISOString().split('T')[0],
    selectedProduct: '',
    productQuantity: '',
    products: [{ productId: '', productName: '', quantity: '', brandId: '' }] // Array of products with quantities and brand
  });

  // Brand list for bakery products
  const brandsList = [
    { id: 'BRITANNIA', name: 'Britannia' },
    { id: 'PARLE', name: 'Parle' },
    { id: 'SUNFEAST', name: 'Sunfeast' },
    { id: 'GOODDAY', name: 'Good Day' },
    { id: 'OREO', name: 'Oreo' },
    { id: 'MCVITIES', name: 'McVities' },
    { id: 'UNIBIC', name: 'Unibic' }
  ];

  // Dummy order data with products
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2025-001',
      customerName: 'ABC Manufacturing Ltd',
      orderDate: '2025-01-05',
      status: 'Approved',
      totalQuantity: 75,
      remarks: 'Urgent delivery required',
      createdAt: '2025-01-05',
      products: [
        { id: 'CC001', productId: 'CC001', productName: 'Chocolate Cup Cakes - 6 Nos', quantity: '20' },
        { id: 'CC002', productId: 'CC002', productName: 'Fruit Cup Cakes - 6 Nos', quantity: '25' },
        { id: 'BR001', productId: 'BR001', productName: 'White Bread Loaf', quantity: '30' }
      ]
    },
    {
      id: 'ORD-2025-002',
      customerName: 'XYZ Industries',
      orderDate: '2025-01-04',
      status: 'Pending',
      totalQuantity: 120,
      remarks: 'Standard delivery terms',
      createdAt: '2025-01-04',
      products: [
        { id: 'BN001', productId: 'BN001', productName: 'Burger Buns', quantity: '50' },
        { id: 'CC004', productId: 'CC004', productName: 'Coconut Cookies 200g', quantity: '40' },
        { id: 'BR002', productId: 'BR002', productName: 'Brown Bread Loaf', quantity: '30' }
      ]
    },
    {
      id: 'ORD-2025-003',
      customerName: 'Global Enterprises',
      orderDate: '2025-01-03',
      status: 'Processing',
      totalQuantity: 50,
      remarks: 'Quality check required',
      createdAt: '2025-01-03',
      products: [
        { id: 'CC005', productId: 'CC005', productName: 'Osmania Biscuits 200g', quantity: '25' },
        { id: 'CC003', productId: 'CC003', productName: 'Vanilla Cup Cakes - 6 Nos', quantity: '25' }
      ]
    },
    {
      id: 'ORD-2025-004',
      customerName: 'Tech Solutions Inc',
      orderDate: '2025-01-02',
      status: 'Completed',
      totalQuantity: 200,
      remarks: 'Express delivery completed',
      createdAt: '2025-01-02',
      products: [
        { id: 'BR003', productId: 'BR003', productName: 'Multigrain Bread', quantity: '80' },
        { id: 'BN002', productId: 'BN002', productName: 'Hot Dog Buns', quantity: '60' },
        { id: 'CC008', productId: 'CC008', productName: 'Chocolate Chip Cookies 200g', quantity: '60' }
      ]
    },
    {
      id: 'ORD-2025-005',
      customerName: 'Manufacturing Co',
      orderDate: '2025-01-01',
      status: 'Cancelled',
      totalQuantity: 85,
      remarks: 'Customer request cancellation',
      createdAt: '2025-01-01',
      products: [
        { id: 'BN003', productId: 'BN003', productName: 'Dinner Rolls', quantity: '45' },
        { id: 'CC009', productId: 'CC009', productName: 'Strawberry Cake 500g', quantity: '40' }
      ]
    }
  ]);

  // Dummy customer data
  const customersList = [
    { id: 'C001', name: 'ABC Manufacturing Ltd' },
    { id: 'C002', name: 'XYZ Industries' },
    { id: 'C003', name: 'Global Enterprises' },
    { id: 'C004', name: 'Tech Solutions Inc' },
    { id: 'C005', name: 'Manufacturing Co' },
    { id: 'C006', name: 'Industrial Systems' },
    { id: 'C007', name: 'Quality Products Ltd' },
    { id: 'C008', name: 'Premium Manufacturing' }
  ];

  // Bakery Product List organized by categories with pricing and brand information
  const productsList = [
    // Breads
    { id: 'BR001', name: 'White Bread Loaf', code: 'WBL-400', unit: 'Loaves', category: 'Breads', price: 45, brand: 'Britannia', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&h=150&fit=crop' },
    { id: 'BR002', name: 'Brown Bread Loaf', code: 'BBL-400', unit: 'Loaves', category: 'Breads', price: 50, brand: 'Britannia', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=150&h=150&fit=crop' },
    { id: 'BR003', name: 'Multigrain Bread', code: 'MGB-350', unit: 'Loaves', category: 'Breads', price: 65, brand: 'Sunfeast', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=150&h=150&fit=crop' },
    { id: 'BR004', name: 'Garlic Bread', code: 'GB-200', unit: 'Pieces', category: 'Breads', price: 35, brand: 'McVities', image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=150&h=150&fit=crop' },
    
    // Buns
    { id: 'BN001', name: 'Burger Buns', code: 'BB-6', unit: 'Packs', category: 'Buns', price: 25, brand: 'Britannia', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=150&h=150&fit=crop' },
    { id: 'BN002', name: 'Hot Dog Buns', code: 'HDB-6', unit: 'Packs', category: 'Buns', price: 30, brand: 'Parle', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop' },
    { id: 'BN003', name: 'Dinner Rolls', code: 'DR-8', unit: 'Packs', category: 'Buns', price: 40, brand: 'Good Day', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&h=150&fit=crop' },
    { id: 'BN004', name: 'Sesame Buns', code: 'SB-4', unit: 'Packs', category: 'Buns', price: 35, brand: 'Sunfeast', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=150&h=150&fit=crop' },
    
    // Cakes & Cookies
    { id: 'CC001', name: 'Chocolate Cup Cakes - 6 Nos', code: 'CCC-6', unit: 'Packs', category: 'Cakes & Cookies', price: 120, brand: 'Britannia', image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=150&h=150&fit=crop' },
    { id: 'CC002', name: 'Fruit Cup Cakes - 6 Nos', code: 'FCC-6', unit: 'Packs', category: 'Cakes & Cookies', price: 110, brand: 'Sunfeast', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=150&h=150&fit=crop' },
    { id: 'CC003', name: 'Vanilla Cup Cakes - 6 Nos', code: 'VCC-6', unit: 'Packs', category: 'Cakes & Cookies', price: 115, brand: 'Good Day', image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=150&h=150&fit=crop' },
    { id: 'CC004', name: 'Coconut Cookies 200g', code: 'COC-200', unit: 'Packs', category: 'Cakes & Cookies', price: 80, brand: 'Parle', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=150&h=150&fit=crop' },
    { id: 'CC005', name: 'Osmania Biscuits 200g', code: 'OB-200', unit: 'Packs', category: 'Cakes & Cookies', price: 60, brand: 'Unibic', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&h=150&fit=crop' },
    { id: 'CC006', name: 'Fruit Cookies 200g', code: 'FC-200', unit: 'Packs', category: 'Cakes & Cookies', price: 75, brand: 'McVities', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=150&h=150&fit=crop' },
    { id: 'CC007', name: 'Butter Cookies 200g', code: 'BC-200', unit: 'Packs', category: 'Cakes & Cookies', price: 85, brand: 'Oreo', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&h=150&fit=crop' },
    { id: 'CC008', name: 'Chocolate Chip Cookies 200g', code: 'CCC-200', unit: 'Packs', category: 'Cakes & Cookies', price: 90, brand: 'Good Day', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=150&h=150&fit=crop' },
    { id: 'CC009', name: 'Strawberry Cake 500g', code: 'SC-500', unit: 'Pieces', category: 'Cakes & Cookies', price: 250, brand: 'Britannia', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=150&h=150&fit=crop' },
    { id: 'CC010', name: 'Chocolate Cake 500g', code: 'CHC-500', unit: 'Pieces', category: 'Cakes & Cookies', price: 280, brand: 'Sunfeast', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop' }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.remarks.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      customerName: '',
      orderDate: new Date().toISOString().split('T')[0],
      remarks: '',
      products: [{ productId: '', productName: '', quantity: '' }]
    });
  };

  const handleCreate = () => {
    const totalQuantity = formData.products.reduce((sum, product) => sum + (parseInt(product.quantity) || 0), 0);
    const newOrder = {
      id: `ORD-2025-${(orders.length + 1).toString().padStart(3, '0')}`,
      customerName: formData.customerName,
      orderDate: formData.orderDate,
      remarks: formData.remarks,
      products: formData.products.filter(p => p.productId && p.quantity), // Only include products with ID and quantity
      status: 'Pending', // Default status for new orders
      totalQuantity: totalQuantity,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setOrders([...orders, newOrder]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  // Add new product row
  const addProductRow = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { productId: '', productName: '', quantity: '' }]
    });
  };

  // Remove product row
  const removeProductRow = (index) => {
    if (formData.products.length > 1) {
      const updatedProducts = formData.products.filter((_, i) => i !== index);
      setFormData({ ...formData, products: updatedProducts });
    }
  };

  // Update product in specific row
  const updateProductRow = (index, field, value) => {
    const updatedProducts = formData.products.map((product, i) => {
      if (i === index) {
        if (field === 'productId') {
          const selectedProduct = productsList.find(p => p.id === value);
          return {
            ...product,
            productId: value,
            productName: selectedProduct ? selectedProduct.name : ''
          };
        } else {
          return { ...product, [field]: value };
        }
      }
      return product;
    });
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    
    // Check if the order has multiple products stored, otherwise create from legacy single product format
    let productsToEdit = [];
    
    if (order.products && order.products.length > 0) {
      // New format with multiple products
      productsToEdit = order.products.map(product => ({
        productId: product.productId || '',
        quantity: product.quantity || ''
      }));
    } else {
      // Legacy format with single product - convert to new format
      productsToEdit = [{
        productId: order.selectedProduct ? productsList.find(p => p.name === order.selectedProduct)?.id || '' : '',
        quantity: order.productQuantity || order.totalQuantity || ''
      }];
    }
    
    setEditFormData({
      customerName: order.customerName,
      orderDate: order.orderDate,
      remarks: order.remarks,
      products: productsToEdit
    });
    
    // Initialize dropdown states for all products
    setEditProductDropdownStates(productsToEdit.map(() => false));
    setIsEditModalOpen(true);
  };

  const handleUpdateOld = () => {
    if (!editFormData.customerName || !editFormData.orderDate) {
      return;
    }
    
    const validProducts = editFormData.products.filter(p => p.productId && p.quantity);
    if (validProducts.length === 0) {
      return;
    }
    
    const totalQuantity = validProducts.reduce((sum, product) => sum + (parseInt(product.quantity) || 0), 0);
    const updatedOrder = {
      ...selectedOrder,
      customerName: editFormData.customerName,
      orderDate: editFormData.orderDate,
      remarks: editFormData.remarks,
      products: validProducts,
      totalQuantity: totalQuantity,
      // Update for display purposes - showing first product
      selectedProduct: validProducts[0] ? productsList.find(p => p.id === validProducts[0].productId)?.name : '',
      productQuantity: totalQuantity
    };
    
    const updatedOrders = orders.map(order => 
      order.id === selectedOrder.id ? updatedOrder : order
    );
    setOrders(updatedOrders);
    setIsEditModalOpen(false);
    setEditFormData({
      customerName: '',
      orderDate: '',
      remarks: '',
      products: [{ productId: '', quantity: '' }]
    });
    setEditProductDropdownStates([false]);
    setSelectedOrder(null);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Draft': return 'secondary';
      case 'Pending': return 'default';
      case 'Approved': return 'success';
      case 'Processing': return 'default';
      case 'Completed': return 'success';
      case 'Rejected': return 'destructive';
      case 'Cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Draft': return <FileCheck className="h-3 w-3" />;
      case 'Pending': return <Clock className="h-3 w-3" />;
      case 'Approved': return <CheckCircle className="h-3 w-3" />;
      case 'Processing': return <Clock className="h-3 w-3" />;
      case 'Completed': return <CheckCircle className="h-3 w-3" />;
      case 'Rejected': return <XCircle className="h-3 w-3" />;
      case 'Cancelled': return <XCircle className="h-3 w-3" />;
      default: return <FileCheck className="h-3 w-3" />;
    }
  };

  // Create new form component with category-based product organization
  const CreateOrderForm = () => {
    const [localFormData, setLocalFormData] = useState({
      customerName: '',
      orderDate: new Date().toISOString().split('T')[0],
      products: []
    });
    const [localCustomerOpen, setLocalCustomerOpen] = useState(false);
    const [productQuantities, setProductQuantities] = useState({});
    const [expandedCategories, setExpandedCategories] = useState({
      'Cakes & Cookies': true // Default expanded category
    });

    // Get unique categories
    const categories = [...new Set(productsList.map(product => product.category))];

    // Group products by category
    const groupedProducts = categories.reduce((acc, category) => {
      acc[category] = productsList.filter(product => product.category === category);
      return acc;
    }, {});

    // Toggle category expansion
    const toggleCategory = (category) => {
      setExpandedCategories(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    };

    // Handle product quantity change
    const handleQuantityChange = (productId, quantity) => {
      const numQuantity = parseInt(quantity) || 0;
      setProductQuantities(prev => ({
        ...prev,
        [productId]: numQuantity
      }));
      
      // Update products list
      if (numQuantity > 0) {
        if (!localFormData.products.find(p => p.productId === productId)) {
          const product = productsList.find(p => p.id === productId);
          setLocalFormData(prev => ({
            ...prev,
            products: [...prev.products, {
              productId: productId,
              productName: product?.name || '',
              quantity: numQuantity
            }]
          }));
        } else {
          setLocalFormData(prev => ({
            ...prev,
            products: prev.products.map(p => 
              p.productId === productId ? { ...p, quantity: numQuantity } : p
            )
          }));
        }
      } else {
        setLocalFormData(prev => ({
          ...prev,
          products: prev.products.filter(p => p.productId !== productId)
        }));
      }
    };

    const handleSubmit = () => {
      if (!localFormData.customerName || !localFormData.orderDate) {
        return;
      }
      
      const validProducts = localFormData.products.filter(p => p.productId && p.quantity > 0);
      if (validProducts.length === 0) {
        return;
      }
      
      const totalQuantity = validProducts.reduce((sum, product) => sum + (parseInt(product.quantity) || 0), 0);
      const newOrder = {
        id: `ORD-2025-${(orders.length + 1).toString().padStart(3, '0')}`,
        customerName: localFormData.customerName,
        orderDate: localFormData.orderDate,
        products: validProducts,
        status: 'Pending',
        totalQuantity: totalQuantity,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setOrders([...orders, newOrder]);
      setIsCreateModalOpen(false);
      setLocalFormData({
        customerName: '',
        orderDate: new Date().toISOString().split('T')[0],
        products: []
      });
      setProductQuantities({});
      setExpandedCategories({ 'Cakes & Cookies': true });
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Popover open={localCustomerOpen} onOpenChange={setLocalCustomerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={localCustomerOpen}
                  className="w-full justify-between"
                >
                  {localFormData.customerName || "Select customer..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search customer..." />
                  <CommandEmpty>No customer found.</CommandEmpty>
                  <CommandGroup>
                    {customersList.map((customer) => (
                      <CommandItem
                        key={customer.id}
                        value={customer.name}
                        onSelect={(currentValue) => {
                          const selectedCustomer = customersList.find(c => c.name.toLowerCase() === currentValue.toLowerCase());
                          if (selectedCustomer) {
                            setLocalFormData({ 
                              ...localFormData, 
                              customerName: selectedCustomer.name
                            });
                          }
                          setLocalCustomerOpen(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            localFormData.customerName?.toLowerCase() === customer.name.toLowerCase() ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {customer.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="orderDate">Order Date *</Label>
            <Input
              id="orderDate"
              type="date"
              value={localFormData.orderDate}
              onChange={(e) => setLocalFormData({ ...localFormData, orderDate: e.target.value })}
            />
          </div>
        </div>

        {/* Product Categories */}
        <div className="space-y-4">
          <div className="mb-4">
            <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Select Products by Category</Label>
            <p className="text-sm text-gray-500 mt-1">Choose from our bakery categories and add quantities</p>
          </div>
          <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="border rounded-lg">
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg"
              >
                <div className="flex items-center gap-2">
                  {expandedCategories[category] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className="font-medium text-sm">{category}</span>
                </div>
              </button>
              
              {/* Category Products */}
              {expandedCategories[category] && (
                <div className="border-t">
                  {/* Header Row */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                    <span>ITEM NAME</span>
                    <span className="w-16 text-center">QUANTITY</span>
                  </div>
                  
                  {/* Product Rows */}
                  <div className="divide-y">
                    {groupedProducts[category]?.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&h=150&fit=crop';
                            }}
                          />
                        </div>
                        
                        {/* Product Name */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{product.name}</h4>
                        </div>
                        
                        {/* Quantity Input */}
                        <div className="w-16">
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={productQuantities[product.id] || ''}
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                            className="text-center text-sm h-8 w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </div>

        {/* Order Summary */}
        {localFormData.products.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Order Summary</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{localFormData.products.length} product types selected</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  {localFormData.products.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Units</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setIsCreateModalOpen(false);
              setLocalFormData({
                customerName: '',
                orderDate: new Date().toISOString().split('T')[0],
                products: []
              });
              setProductQuantities({});
              setExpandedCategories({ 'Cakes & Cookies': true });
            }}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!localFormData.customerName || !localFormData.orderDate || localFormData.products.length === 0}
            className="w-full sm:w-auto"
          >
            Create Order
          </Button>
        </div>
      </div>
    );
  };

  // Edit form component with multiple products support
  const [editFormData, setEditFormData] = useState({
    customerName: '',
    orderDate: '',
    remarks: '',
    products: [{ productId: '', quantity: '' }]
  });
  const [editProductDropdownStates, setEditProductDropdownStates] = useState([false]);

  // Helper functions for edit form
  const updateEditProductRow = (index, field, value) => {
    const updatedProducts = [...editFormData.products];
    updatedProducts[index][field] = value;
    setEditFormData({ ...editFormData, products: updatedProducts });
  };

  const addEditProductRow = () => {
    setEditFormData({
      ...editFormData,
      products: [...editFormData.products, { productId: '', quantity: '' }]
    });
    setEditProductDropdownStates([...editProductDropdownStates, false]);
  };

  const removeEditProductRow = (index) => {
    const updatedProducts = editFormData.products.filter((_, i) => i !== index);
    const updatedDropdownStates = editProductDropdownStates.filter((_, i) => i !== index);
    setEditFormData({ ...editFormData, products: updatedProducts });
    setEditProductDropdownStates(updatedDropdownStates);
  };

  // Helper function for edit dropdown
  const toggleEditProductDropdown = (index, isOpen) => {
    const updatedStates = [...editProductDropdownStates];
    updatedStates[index] = isOpen;
    setEditProductDropdownStates(updatedStates);
  };

  // Handle update function
  const handleUpdate = (updatedData) => {
    const updatedOrders = orders.map(order => 
      order.id === selectedOrder.id ? { ...order, ...updatedData } : order
    );
    setOrders(updatedOrders);
    setIsEditModalOpen(false);
    setSelectedOrder(null);
  };

  // Isolated Edit Form Component
  const EditOrderFormComponent = ({ initialData, onUpdate, onCancel }) => {
    const [localFormData, setLocalFormData] = useState({
      customerName: initialData?.customerName || '',
      orderDate: initialData?.orderDate || new Date().toISOString().split('T')[0],
      products: initialData?.products || []
    });
    const [localCustomerOpen, setLocalCustomerOpen] = useState(false);
    const [editExpandedCategories, setEditExpandedCategories] = useState({ 'Cakes & Cookies': true });
    const [editProductQuantities, setEditProductQuantities] = useState({});

    // Get unique categories
    const categories = [...new Set(productsList.map(product => product.category))];

    // Group products by category
    const groupedProducts = categories.reduce((acc, category) => {
      acc[category] = productsList.filter(product => product.category === category);
      return acc;
    }, {});

    // Initialize edit product quantities from existing order data
    useEffect(() => {
      if (initialData && initialData.products) {
        const initialQuantities = {};
        initialData.products.forEach(product => {
          initialQuantities[product.id] = product.quantity;
        });
        setEditProductQuantities(initialQuantities);
      }
    }, [initialData]);

    const toggleEditCategory = (category) => {
      setEditExpandedCategories(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    };

    const handleEditQuantityChange = (productId, quantity) => {
      const numericQuantity = parseInt(quantity) || 0;
      
      setEditProductQuantities(prev => ({
        ...prev,
        [productId]: quantity
      }));

      // Update localFormData.products
      const selectedProduct = productsList.find(p => p.id === productId);
      if (selectedProduct && numericQuantity > 0) {
        setLocalFormData(prev => {
          const existingProductIndex = prev.products.findIndex(p => p.id === productId);
          const updatedProducts = [...prev.products];
          
          if (existingProductIndex >= 0) {
            updatedProducts[existingProductIndex] = {
              ...selectedProduct,
              quantity: numericQuantity
            };
          } else {
            updatedProducts.push({
              ...selectedProduct,
              quantity: numericQuantity
            });
          }
          
          return { ...prev, products: updatedProducts };
        });
      } else {
        // Remove product if quantity is 0
        setLocalFormData(prev => ({
          ...prev,
          products: prev.products.filter(p => p.id !== productId)
        }));
      }
    };

    const handleEditSubmit = () => {
      if (!localFormData.customerName || !localFormData.orderDate || localFormData.products.length === 0) {
        return;
      }
      
      onUpdate(localFormData);
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="editCustomerName">Customer Name *</Label>
            <Popover open={localCustomerOpen} onOpenChange={setLocalCustomerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={localCustomerOpen}
                  className="w-full justify-between"
                >
                  {localFormData.customerName || "Select customer..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" side="bottom" align="start">
                <Command>
                  <CommandInput placeholder="Search customers..." />
                  <CommandEmpty>No customer found.</CommandEmpty>
                  <CommandGroup>
                    {customersList.map((customer) => (
                      <CommandItem
                        key={customer.id}
                        value={customer.name}
                        onSelect={(currentValue) => {
                          setLocalFormData({
                            ...localFormData,
                            customerName: currentValue === localFormData.customerName?.toLowerCase() ? "" : currentValue
                          });
                          setLocalCustomerOpen(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            localFormData.customerName?.toLowerCase() === customer.name.toLowerCase() ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {customer.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="editOrderDate">Order Date *</Label>
            <Input
              id="editOrderDate"
              type="date"
              value={localFormData.orderDate}
              onChange={(e) => setLocalFormData({ ...localFormData, orderDate: e.target.value })}
            />
          </div>
        </div>

        {/* Product Categories */}
        <div className="space-y-4">
          <div className="mb-4">
            <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Select Products by Category</Label>
            <p className="text-sm text-gray-500 mt-1">Choose from our bakery categories and add quantities</p>
          </div>
          <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="border rounded-lg">
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleEditCategory(category)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg"
              >
                <div className="flex items-center gap-2">
                  {editExpandedCategories[category] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className="font-medium text-sm">{category}</span>
                </div>
              </button>
              
              {/* Category Products */}
              {editExpandedCategories[category] && (
                <div className="border-t">
                  {/* Header Row */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                    <span>ITEM NAME</span>
                    <span className="w-16 text-center">QUANTITY</span>
                  </div>
                  
                  {/* Product Rows */}
                  <div className="divide-y">
                    {groupedProducts[category]?.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&h=150&fit=crop';
                            }}
                          />
                        </div>
                        
                        {/* Product Name */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{product.name}</h4>
                        </div>
                        
                        {/* Quantity Input */}
                        <div className="w-16">
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={editProductQuantities[product.id] || ''}
                            onChange={(e) => handleEditQuantityChange(product.id, e.target.value)}
                            className="text-center text-sm h-8 w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </div>

        {/* Order Summary */}
        {localFormData.products.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Order Summary</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{localFormData.products.length} product types selected</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  {localFormData.products.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Units</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit}
            disabled={!localFormData.customerName || !localFormData.orderDate || localFormData.products.length === 0}
            className="w-full sm:w-auto"
          >
            Update Order
          </Button>
        </div>
      </div>
    );
  };



  return (
    <div className="px-2 py-2 sm:p-4 lg:p-6 space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="bg-blue-600 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-md mx-0 sm:mx-0">
        {/* Mobile Layout */}
        <div className="flex sm:hidden items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <h1 className="text-lg font-semibold">My Orders</h1>
          </div>
          <div className="flex items-center space-x-2">
            {(canPerformAction('sales', 'orders', 'add') || canPerformAction('sales', 'myIndent', 'add') || canPerformAction('orders', 'indent', 'add')) && (
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-blue-50 text-sm px-3 py-2"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm px-3 py-2">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6" />
            <h1 className="text-xl font-semibold">My Orders</h1>
            <span className="hidden lg:inline text-blue-100 text-sm">Manage and track your sales orders</span>
          </div>
          <div className="flex items-center space-x-3">
            {(canPerformAction('sales', 'orders', 'add') || canPerformAction('sales', 'myIndent', 'add') || canPerformAction('orders', 'indent', 'add')) && (
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-blue-50 text-sm px-3 py-2"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Create Order</span>
              </Button>
            )}
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm px-3 py-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 px-0 sm:px-0">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-lg p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{orders.length}</p>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center">
              <FileText className="h-3 w-3 sm:h-8 sm:w-8 text-gray-500" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-lg p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {orders.filter(o => o.status === 'Pending').length}
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center">
              <Clock className="h-3 w-3 sm:h-8 sm:w-8 text-gray-500" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-lg p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {orders.filter(o => o.status === 'Approved').length}
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center">
              <CheckCircle className="h-3 w-3 sm:h-8 sm:w-8 text-gray-500" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-lg p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {orders.filter(o => o.status === 'Completed').length}
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center">
              <FileCheck className="h-3 w-3 sm:h-8 sm:w-8 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-lg p-3 sm:p-6 mx-0 sm:mx-0">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-lg p-3 sm:p-6 mx-0 sm:mx-0">
        <h3 className="text-lg font-medium mb-3 sm:mb-4 px-0 sm:px-0">Order List</h3>
        
        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {/* Mobile Table Header */}
          <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-t-lg border-b border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-400">
            <span className="flex-1">CUSTOMER</span>
            <span className="w-20 text-center">STATUS</span>
            <span className="w-24 text-center">ACTIONS</span>
          </div>
          
          {/* Mobile Cards */}
          <div className="space-y-0 border border-gray-200 dark:border-gray-700 border-t-0 rounded-b-lg overflow-hidden">
            {filteredOrders.map((order, index) => (
              <div key={order.id} className={`p-2 ${index !== filteredOrders.length - 1 ? 'border-b border-gray-200 dark:border-gray-600' : ''} bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700`}>
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-gray-500 font-mono mb-1">
                      {order.id}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.orderDate} • Qty: {order.totalQuantity}
                    </div>
                  </div>
                  <div className="w-20 flex justify-center">
                    <Badge variant={getStatusVariant(order.status)} className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                  <div className="w-24 flex justify-center items-center gap-0.5">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => handleView(order)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    {(canPerformAction('sales', 'orders', 'edit') || canPerformAction('sales', 'myIndent', 'edit') || canPerformAction('orders', 'indent', 'edit')) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => handleEdit(order)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    {(canPerformAction('sales', 'orders', 'delete') || canPerformAction('sales', 'myIndent', 'delete') || canPerformAction('orders', 'indent', 'delete')) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(order.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Order ID</TableHead>
                <TableHead className="min-w-[150px]">Customer</TableHead>
                <TableHead className="min-w-[120px]">Date</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="min-w-[80px]">Qty</TableHead>
                {(canPerformAction('sales', 'orders', 'edit') || canPerformAction('sales', 'myIndent', 'edit') || canPerformAction('orders', 'indent', 'edit') || canPerformAction('sales', 'orders', 'delete') || canPerformAction('sales', 'myIndent', 'delete') || canPerformAction('orders', 'indent', 'delete')) && (
                  <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell className="font-medium text-sm font-mono">{order.id}</TableCell>
                  <TableCell className="text-sm">
                    <div className="font-medium">{order.customerName}</div>
                  </TableCell>
                  <TableCell className="text-sm">{order.orderDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)} className="text-xs">
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{order.totalQuantity}</TableCell>
                  {(canPerformAction('sales', 'orders', 'edit') || canPerformAction('sales', 'myIndent', 'edit') || canPerformAction('orders', 'indent', 'edit') || canPerformAction('sales', 'orders', 'delete') || canPerformAction('sales', 'myIndent', 'delete') || canPerformAction('orders', 'indent', 'delete')) && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleView(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(canPerformAction('sales', 'orders', 'edit') || canPerformAction('sales', 'myIndent', 'edit') || canPerformAction('orders', 'indent', 'edit')) && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEdit(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {(canPerformAction('sales', 'orders', 'delete') || canPerformAction('sales', 'myIndent', 'delete') || canPerformAction('orders', 'indent', 'delete')) && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(order.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Order</DialogTitle>
            <DialogDescription>
              Update the order details below.
            </DialogDescription>
          </DialogHeader>
          <EditOrderFormComponent 
            initialData={selectedOrder}
            onUpdate={handleUpdate}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedOrder(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">View Order Details</DialogTitle>
            <DialogDescription>
              Complete details of the selected order.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Customer Name</Label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{selectedOrder.customerName}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Order Date</Label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{selectedOrder.orderDate}</span>
                  </div>
                </div>
              </div>

              {/* Product Details - Organized by Categories like Add Order Form */}
              {selectedOrder.products && selectedOrder.products.length > 0 && (
                <div>
                  <div className="mb-4">
                    <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Selected Products by Category</Label>
                    <p className="text-sm text-gray-500 mt-1">Products ordered from our bakery categories</p>
                  </div>
                  
                  {/* Group products by category */}
                  {(() => {
                    const groupedOrderProducts = selectedOrder.products.reduce((acc, orderProduct) => {
                      const fullProduct = productsList.find(p => p.id === orderProduct.id || p.id === orderProduct.productId);
                      if (fullProduct) {
                        if (!acc[fullProduct.category]) {
                          acc[fullProduct.category] = [];
                        }
                        acc[fullProduct.category].push({
                          ...fullProduct,
                          quantity: orderProduct.quantity
                        });
                      }
                      return acc;
                    }, {});

                    const toggleCategory = (category) => {
                      setExpandedCategories(prev => ({
                        ...prev,
                        [category]: !prev[category]
                      }));
                    };

                    return Object.keys(groupedOrderProducts).map((category) => {
                      const isExpanded = expandedCategories[category] ?? true; // Default expanded
                      return (
                        <div key={category} className="border rounded-lg mb-4 overflow-hidden">
                          {/* Category Header */}
                          <button 
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              )}
                              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{category}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {groupedOrderProducts[category].length} items
                            </Badge>
                          </button>
                          
                          {/* Category Products - Collapsible */}
                          {isExpanded && (
                            <div className="border-t">
                              {/* Header Row */}
                              <div className="hidden sm:flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                                <span>ITEM NAME</span>
                                <span className="w-16 text-center">QUANTITY</span>
                              </div>
                              
                              {/* Product Rows */}
                              <div className="divide-y">
                                {groupedOrderProducts[category].map((product) => (
                                  <div key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    {/* Product Image */}
                                    <div className="flex-shrink-0">
                                      <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg object-cover"
                                        onError={(e) => {
                                          e.target.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&h=150&fit=crop';
                                        }}
                                      />
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                                      <h4 className="text-sm font-medium mb-1">{product.name}</h4>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          {product.brand}
                                        </Badge>
                                        <span className="text-xs text-gray-500">₹{product.price} each</span>
                                      </div>
                                    </div>
                                    
                                    {/* Quantity and Total - Mobile/Desktop responsive */}
                                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-4">
                                      {/* Quantity Display */}
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 sm:hidden">Qty:</span>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1 border border-blue-200 dark:border-blue-800">
                                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{product.quantity}</span>
                                        </div>
                                      </div>
                                      
                                      {/* Total Price */}
                                      <div className="text-right">
                                        <div className="text-sm font-medium">₹{(product.price * parseInt(product.quantity)).toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">total</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                  
                  {/* Order Summary */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Order Summary</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{selectedOrder.products.length} product types selected</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                          {selectedOrder.products.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Units</div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Order Value:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          ₹{selectedOrder.products.reduce((sum, p) => {
                            const fullProduct = productsList.find(fp => fp.id === p.id || fp.id === p.productId);
                            return sum + (fullProduct ? fullProduct.price * parseInt(p.quantity) : 0);
                          }, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Order ID</Label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{selectedOrder.id}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <Badge variant={getStatusVariant(selectedOrder.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created Date</Label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{selectedOrder.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {selectedOrder.remarks && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Remarks</Label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <p className="text-sm text-gray-900 dark:text-gray-100">{selectedOrder.remarks}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Order Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Create New Order</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new production order.
            </DialogDescription>
          </DialogHeader>
          <CreateOrderForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrders;