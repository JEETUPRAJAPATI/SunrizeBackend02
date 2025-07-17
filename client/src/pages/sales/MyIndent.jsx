import { useState, useMemo } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  ChevronUp,
  Package,
  Upload,
  X,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';

const MyOrders = () => {
  const { hasFeatureAccess, canPerformAction } = usePermissions();
  const [, setLocation] = useLocation();
  
  // Check if user has access to myIndent feature
  if (!hasFeatureAccess('sales', 'myIndent', 'view')) {
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
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [orderDate, setOrderDate] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Form data state
  const [formData, setFormData] = useState({
    customerName: '',
    orderDate: new Date().toISOString().split('T')[0],
    remarks: '',
    selectedProduct: '',
    productQuantity: '',
    products: [{ productId: '', productName: '', quantity: '' }] // Array of products with quantities
  });

  // Product categories matching the reference design exactly
  const productCategories = [
    {
      id: 'buns',
      name: 'Buns',
      products: [
        { id: 'cream-bun-chocolate', name: 'Cream Bun - Chocolate', unitPrice: 15 },
        { id: 'cream-bun-strawberry', name: 'Cream Bun - Strawberry', unitPrice: 15 },
        { id: 'cream-bun-vanilla', name: 'Cream Bun - Vanilla', unitPrice: 15 }
      ]
    },
    {
      id: 'cakes',
      name: 'Cakes & Cookies',
      products: [
        { id: 'chocolate-cup-cakes', name: 'Chocolate Cup Cakes - 6 Nos', unitPrice: 45 },
        { id: 'fruit-cup-cakes', name: 'Fruit Cup Cakes - 6 Nos', unitPrice: 45 },
        { id: 'vanilla-cup-cakes', name: 'Vanilla Cup Cakes - 6 Nos', unitPrice: 45 },
        { id: 'coconut-cookies', name: 'Coconut Cookies 200g', unitPrice: 30 },
        { id: 'osmania-biscuits', name: 'Osmania Biscuits 200g', unitPrice: 25 },
        { id: 'fruit-cookies', name: 'Fruit Cookies 200g', unitPrice: 32 },
        { id: 'butter-cookies', name: 'Butter Cookies 200g', unitPrice: 35 },
        { id: 'ragi-cookies', name: 'Ragi Cookies 200g', unitPrice: 28 }
      ]
    }
  ];

  // Customer dummy data for the dropdown
  const customers = [
    { id: 'padmavathi-bakery', name: 'Padmavathi Bakery' },
    { id: 'royal-sweets', name: 'Royal Sweets & Bakery' },
    { id: 'golden-bread', name: 'Golden Bread House' },
    { id: 'fresh-bakes', name: 'Fresh Bakes Corner' },
    { id: 'sunrise-bakery', name: 'Sunrise Bakery' }
  ];

  // Manufacturing orders with steel products and images
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2025-001',
      customerName: 'ABC Manufacturing Ltd',
      orderDate: '2025-01-17',
      status: 'Pending',
      totalQuantity: 450,
      orderAmount: '₹82,450',
      address: '123 Industrial Area, Mumbai, Maharashtra',
      items: [
        {
          id: 1,
          name: 'MS Round Bar - 12mm',
          category: 'Steel',
          quantity: 200,
          unitCost: 85.50,
          totalCost: 17100.00,
          image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=100&h=100&fit=crop'
        },
        {
          id: 2,
          name: 'MS Angle - 40x40x5mm',
          category: 'Steel',
          quantity: 150,
          unitCost: 92.00,
          totalCost: 13800.00,
          image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=100&h=100&fit=crop'
        },
        {
          id: 3,
          name: 'MS Plate - 10mm',
          category: 'Steel',
          quantity: 100,
          unitCost: 125.00,
          totalCost: 12500.00,
          image: 'https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=100&h=100&fit=crop'
        }
      ],
      createdAt: '2025-01-17'
    },
    {
      id: 'ORD-2025-002',
      customerName: 'XYZ Industries',
      orderDate: '2025-01-16',
      status: 'Approved',
      totalQuantity: 320,
      orderAmount: '₹65,750',
      address: '456 Commercial Street, Delhi, India',
      items: [
        {
          id: 1,
          name: 'SS Round Bar - 10mm (304)',
          category: 'Stainless Steel',
          quantity: 180,
          unitCost: 185.00,
          totalCost: 33300.00,
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=100&h=100&fit=crop'
        },
        {
          id: 2,
          name: 'Aluminum Sheet - 2mm',
          category: 'Aluminum',
          quantity: 140,
          unitCost: 95.00,
          totalCost: 13300.00,
          image: 'https://images.unsplash.com/photo-1607400201515-c97c0f3532b2?w=100&h=100&fit=crop'
        }
      ],
      createdAt: '2025-01-16'
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

  // Manufacturing Product List for Orders
  const productsList = [
    // Steel Products
    { id: 'P001', name: 'MS Round Bar - 8mm', code: 'MSR-8', unit: 'Kg', category: 'Steel' },
    { id: 'P002', name: 'MS Round Bar - 10mm', code: 'MSR-10', unit: 'Kg', category: 'Steel' },
    { id: 'P003', name: 'MS Round Bar - 12mm', code: 'MSR-12', unit: 'Kg', category: 'Steel' },
    { id: 'P004', name: 'MS Round Bar - 16mm', code: 'MSR-16', unit: 'Kg', category: 'Steel' },
    { id: 'P005', name: 'MS Round Bar - 20mm', code: 'MSR-20', unit: 'Kg', category: 'Steel' },
    { id: 'P006', name: 'MS Square Bar - 10x10mm', code: 'MSS-10', unit: 'Kg', category: 'Steel' },
    { id: 'P007', name: 'MS Square Bar - 12x12mm', code: 'MSS-12', unit: 'Kg', category: 'Steel' },
    { id: 'P008', name: 'MS Flat Bar - 25x5mm', code: 'MSF-25x5', unit: 'Kg', category: 'Steel' },
    { id: 'P009', name: 'MS Flat Bar - 40x6mm', code: 'MSF-40x6', unit: 'Kg', category: 'Steel' },
    { id: 'P010', name: 'MS Angle - 25x25x3mm', code: 'MSA-25x25', unit: 'Kg', category: 'Steel' },
    { id: 'P011', name: 'MS Angle - 40x40x5mm', code: 'MSA-40x40', unit: 'Kg', category: 'Steel' },
    { id: 'P012', name: 'MS Channel - 75x40x4.8mm', code: 'MSC-75x40', unit: 'Kg', category: 'Steel' },
    { id: 'P013', name: 'MS Channel - 100x50x5mm', code: 'MSC-100x50', unit: 'Kg', category: 'Steel' },
    { id: 'P014', name: 'MS Plate - 6mm', code: 'MSP-6', unit: 'Kg', category: 'Steel' },
    { id: 'P015', name: 'MS Plate - 8mm', code: 'MSP-8', unit: 'Kg', category: 'Steel' },
    { id: 'P016', name: 'MS Plate - 10mm', code: 'MSP-10', unit: 'Kg', category: 'Steel' },
    { id: 'P017', name: 'MS Plate - 12mm', code: 'MSP-12', unit: 'Kg', category: 'Steel' },
    { id: 'P018', name: 'MS Sheet - 1mm', code: 'MSS-1', unit: 'Kg', category: 'Steel' },
    { id: 'P019', name: 'MS Sheet - 2mm', code: 'MSS-2', unit: 'Kg', category: 'Steel' },
    { id: 'P020', name: 'MS Sheet - 3mm', code: 'MSS-3', unit: 'Kg', category: 'Steel' },
    
    // Stainless Steel Products
    { id: 'P021', name: 'SS Round Bar - 8mm (304)', code: 'SSR-8-304', unit: 'Kg', category: 'Stainless Steel' },
    { id: 'P022', name: 'SS Round Bar - 10mm (304)', code: 'SSR-10-304', unit: 'Kg', category: 'Stainless Steel' },
    { id: 'P023', name: 'SS Round Bar - 12mm (316)', code: 'SSR-12-316', unit: 'Kg', category: 'Stainless Steel' },
    { id: 'P024', name: 'SS Plate - 6mm (304)', code: 'SSP-6-304', unit: 'Kg', category: 'Stainless Steel' },
    { id: 'P025', name: 'SS Plate - 8mm (316)', code: 'SSP-8-316', unit: 'Kg', category: 'Stainless Steel' },
    { id: 'P026', name: 'SS Sheet - 1mm (304)', code: 'SSS-1-304', unit: 'Kg', category: 'Stainless Steel' },
    { id: 'P027', name: 'SS Sheet - 2mm (316)', code: 'SSS-2-316', unit: 'Kg', category: 'Stainless Steel' },
    
    // Aluminum Products
    { id: 'P028', name: 'Aluminum Round Bar - 10mm', code: 'ALR-10', unit: 'Kg', category: 'Aluminum' },
    { id: 'P029', name: 'Aluminum Round Bar - 12mm', code: 'ALR-12', unit: 'Kg', category: 'Aluminum' },
    { id: 'P030', name: 'Aluminum Sheet - 1mm', code: 'ALS-1', unit: 'Kg', category: 'Aluminum' },
    { id: 'P031', name: 'Aluminum Sheet - 2mm', code: 'ALS-2', unit: 'Kg', category: 'Aluminum' },
    { id: 'P032', name: 'Aluminum Plate - 6mm', code: 'ALP-6', unit: 'Kg', category: 'Aluminum' },
    { id: 'P033', name: 'Aluminum Angle - 25x25x3mm', code: 'ALA-25x25', unit: 'Kg', category: 'Aluminum' },
    
    // Copper Products
    { id: 'P034', name: 'Copper Wire - 2.5 sq mm', code: 'CW-2.5', unit: 'Meter', category: 'Copper' },
    { id: 'P035', name: 'Copper Wire - 4 sq mm', code: 'CW-4', unit: 'Meter', category: 'Copper' },
    { id: 'P036', name: 'Copper Wire - 6 sq mm', code: 'CW-6', unit: 'Meter', category: 'Copper' },
    { id: 'P037', name: 'Copper Rod - 8mm', code: 'CR-8', unit: 'Kg', category: 'Copper' },
    { id: 'P038', name: 'Copper Rod - 10mm', code: 'CR-10', unit: 'Kg', category: 'Copper' },
    { id: 'P039', name: 'Copper Sheet - 1mm', code: 'CS-1', unit: 'Kg', category: 'Copper' },
    
    // Pipes & Tubes
    { id: 'P040', name: 'MS Pipe - 1 inch (25mm)', code: 'MSP-25', unit: 'Meter', category: 'Pipes' },
    { id: 'P041', name: 'MS Pipe - 1.5 inch (40mm)', code: 'MSP-40', unit: 'Meter', category: 'Pipes' },
    { id: 'P042', name: 'MS Pipe - 2 inch (50mm)', code: 'MSP-50', unit: 'Meter', category: 'Pipes' },
    { id: 'P043', name: 'MS Pipe - 3 inch (80mm)', code: 'MSP-80', unit: 'Meter', category: 'Pipes' },
    { id: 'P044', name: 'MS Pipe - 4 inch (100mm)', code: 'MSP-100', unit: 'Meter', category: 'Pipes' },
    { id: 'P045', name: 'SS Pipe - 1 inch (304)', code: 'SSP-25-304', unit: 'Meter', category: 'Pipes' },
    { id: 'P046', name: 'SS Pipe - 2 inch (304)', code: 'SSP-50-304', unit: 'Meter', category: 'Pipes' },
    { id: 'P047', name: 'PVC Pipe - 2 inch', code: 'PVC-50', unit: 'Meter', category: 'Pipes' },
    { id: 'P048', name: 'PVC Pipe - 4 inch', code: 'PVC-100', unit: 'Meter', category: 'Pipes' },
    { id: 'P049', name: 'HDPE Pipe - 2 inch', code: 'HDPE-50', unit: 'Meter', category: 'Pipes' },
    
    // Fasteners & Hardware
    { id: 'P050', name: 'Hex Bolt M8x25', code: 'HB-M8x25', unit: 'Pcs', category: 'Fasteners' },
    { id: 'P051', name: 'Hex Bolt M10x30', code: 'HB-M10x30', unit: 'Pcs', category: 'Fasteners' },
    { id: 'P052', name: 'Hex Bolt M12x40', code: 'HB-M12x40', unit: 'Pcs', category: 'Fasteners' },
    { id: 'P053', name: 'Hex Nut M8', code: 'HN-M8', unit: 'Pcs', category: 'Fasteners' },
    { id: 'P054', name: 'Hex Nut M10', code: 'HN-M10', unit: 'Pcs', category: 'Fasteners' },
    { id: 'P055', name: 'Hex Nut M12', code: 'HN-M12', unit: 'Pcs', category: 'Fasteners' },
    { id: 'P056', name: 'Washer M8', code: 'W-M8', unit: 'Pcs', category: 'Fasteners' },
    { id: 'P057', name: 'Washer M10', code: 'W-M10', unit: 'Pcs', category: 'Fasteners' },
    { id: 'P058', name: 'Washer M12', code: 'W-M12', unit: 'Pcs', category: 'Fasteners' },
    
    // Electrical Components
    { id: 'P059', name: 'Cable 3 Core - 2.5 sq mm', code: 'C3-2.5', unit: 'Meter', category: 'Electrical' },
    { id: 'P060', name: 'Cable 3 Core - 4 sq mm', code: 'C3-4', unit: 'Meter', category: 'Electrical' },
    { id: 'P061', name: 'Cable 4 Core - 2.5 sq mm', code: 'C4-2.5', unit: 'Meter', category: 'Electrical' },
    { id: 'P062', name: 'Cable Tray - 100mm', code: 'CT-100', unit: 'Meter', category: 'Electrical' },
    { id: 'P063', name: 'Cable Tray - 200mm', code: 'CT-200', unit: 'Meter', category: 'Electrical' },
    { id: 'P064', name: 'Conduit Pipe - 20mm', code: 'CP-20', unit: 'Meter', category: 'Electrical' },
    { id: 'P065', name: 'Conduit Pipe - 25mm', code: 'CP-25', unit: 'Meter', category: 'Electrical' }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.remarks.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesCategory = categoryFilter === 'All Categories' || 
      (order.items && order.items.some(item => item.category === categoryFilter));
    
    const matchesDate = !orderDate || order.orderDate === orderDate;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
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

  const handleUpdate = () => {
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

  // New Order Form Component (Based on Reference Design)
  const CreateOrderForm = () => {
    const [localFormData, setLocalFormData] = useState({
      customerName: '',
      orderDate: new Date().toISOString().split('T')[0],
      products: {}  // Product quantities keyed by product ID
    });
    const [localCustomerOpen, setLocalCustomerOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState({
      buns: false,
      cakes: true  // Cakes & Cookies expanded by default as shown in reference
    });

    // Toggle category expansion
    const toggleCategory = (categoryId) => {
      setExpandedCategories(prev => ({
        ...prev,
        [categoryId]: !prev[categoryId]
      }));
    };

    // Update product quantity
    const updateProductQuantity = (productId, quantity) => {
      const numQuantity = parseInt(quantity) || 0;
      setLocalFormData(prev => ({
        ...prev,
        products: {
          ...prev.products,
          [productId]: numQuantity > 0 ? numQuantity : undefined
        }
      }));
    };

    // Calculate total quantity for each category
    const getTotalQuantity = () => {
      return Object.values(localFormData.products).reduce((total, qty) => {
        return total + (parseInt(qty) || 0);
      }, 0);
    };

    // Handle form submission
    const handleLocalSubmit = () => {
      if (!localFormData.customerName || !localFormData.orderDate) {
        return;
      }
      
      // Convert products object to array format for storage
      const validProducts = Object.entries(localFormData.products)
        .filter(([productId, quantity]) => productId && quantity > 0)
        .map(([productId, quantity]) => {
          const product = productCategories
            .flatMap(cat => cat.products)
            .find(p => p.id === productId);
          return {
            productId,
            productName: product?.name || '',
            quantity: quantity,
            category: product?.category || '',
            unitPrice: product?.unitPrice || 0,
            totalPrice: (product?.unitPrice || 0) * quantity
          };
        });
        
      if (validProducts.length === 0) {
        return;
      }
      
      const totalQuantity = validProducts.reduce((sum, product) => sum + product.quantity, 0);
      const totalAmount = validProducts.reduce((sum, product) => sum + product.totalPrice, 0);
      
      const newOrder = {
        id: `ORD-2025-${(orders.length + 1).toString().padStart(3, '0')}`,
        customerName: localFormData.customerName,
        orderDate: localFormData.orderDate,
        products: validProducts,
        status: 'Pending',
        totalQuantity: totalQuantity,
        orderAmount: `₹${totalAmount.toFixed(2)}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setOrders([...orders, newOrder]);
      setIsCreateModalOpen(false);
      setLocalFormData({
        customerName: '',
        orderDate: new Date().toISOString().split('T')[0],
        products: {}
      });
    };

    return (
      <div className="bg-white dark:bg-gray-900">
        {/* Header with Close Button and Submit */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">New Order</h2>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleLocalSubmit}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              disabled={!localFormData.customerName || !localFormData.orderDate}
            >
              Submit
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)] overflow-y-auto">
          {/* Customer and Date Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Select Customer
              </Label>
              <Popover open={localCustomerOpen} onOpenChange={setLocalCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={localCustomerOpen}
                    className="w-full justify-between h-10 px-3 text-left bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  >
                    <span className="truncate text-sm">
                      {localFormData.customerName || "Padmavathi Ba..."}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search customer..." className="h-9" />
                    <CommandEmpty>No customer found.</CommandEmpty>
                    <CommandGroup>
                      {customers.map((customer) => (
                        <CommandItem
                          key={customer.id}
                          value={customer.name}
                          onSelect={(currentValue) => {
                            const selectedCustomer = customers.find(c => c.name.toLowerCase() === currentValue.toLowerCase());
                            if (selectedCustomer) {
                              setLocalFormData({ 
                                ...localFormData, 
                                customerName: selectedCustomer.name
                              });
                            }
                            setLocalCustomerOpen(false);
                          }}
                          className="cursor-pointer"
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
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Order Date
              </Label>
              <Input
                type="date"
                value={localFormData.orderDate}
                onChange={(e) => setLocalFormData({ ...localFormData, orderDate: e.target.value })}
                className="h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-sm"
              />
            </div>
          </div>

          {/* Product Categories Section - Mobile Optimized */}
          <div className="space-y-2 flex-1 min-h-0">
            {productCategories.map((category) => (
              <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded">
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
                    <div className="bg-white dark:bg-gray-900 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                      {/* Table Header */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase border-b sticky top-0">
                        <div>ITEM NAME</div>
                        <div className="text-right">QUANTITY</div>
                      </div>
                      
                      {/* Products */}
                      <div className="space-y-0">
                        {category.products.map((product) => (
                          <div key={product.id} className="grid grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-3 border-b border-gray-100 dark:border-gray-700 items-center">
                            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center text-xs flex-shrink-0">
                                {category.id === 'breads' ? '🍞' : 
                                 category.id === 'buns' ? '🥖' : 
                                 category.id === 'cakes' ? '🧁' : '🍞'}
                              </div>
                              <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                                {product.name}
                              </span>
                            </div>
                            <div className="flex justify-end">
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={localFormData.products[product.id] || ''}
                                onChange={(e) => updateProductQuantity(product.id, e.target.value)}
                                className="w-12 h-7 sm:w-16 sm:h-8 text-center text-xs sm:text-sm border-gray-300 dark:border-gray-600"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals Row */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 font-medium border-t sticky bottom-0">
                        <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100">Totals</div>
                        <div className="text-right text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                          {getTotalQuantity()}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Edit Order Form Component (Simplified for now)

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

  const EditOrderForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Customer Name *</Label>
          <Popover open={customerSearchOpen} onOpenChange={setCustomerSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={customerSearchOpen}
                className="w-full justify-between"
              >
                {editFormData.customerName || "Select customer..."}
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
                        setEditFormData({ ...editFormData, customerName: currentValue });
                        setCustomerSearchOpen(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          editFormData.customerName === customer.name ? "opacity-100" : "opacity-0"
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
            value={editFormData.orderDate}
            onChange={(e) => setEditFormData({ ...editFormData, orderDate: e.target.value })}
          />
        </div>
      </div>

      {/* Multiple Products Section for Edit */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Products *</Label>
        
        {editFormData.products.map((product, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <Label>Product Selection *</Label>
              <Popover open={editProductDropdownStates[index]} onOpenChange={(isOpen) => toggleEditProductDropdown(index, isOpen)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={editProductDropdownStates[index]}
                    className="w-full justify-between"
                  >
                    {product.productId
                      ? productsList.find((prod) => prod.id === product.productId)?.name
                      : "Select product..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" side="bottom" align="start" sideOffset={4}>
                  <Command>
                    <CommandInput placeholder="Search products..." />
                    <CommandEmpty>No product found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {productsList.map((prod) => (
                        <CommandItem
                          key={prod.id}
                          value={prod.name}
                          onSelect={() => {
                            updateEditProductRow(index, 'productId', prod.id);
                            toggleEditProductDropdown(index, false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              product.productId === prod.id ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{prod.name}</span>
                            <span className="text-sm text-gray-500">Code: {prod.code} | Unit: {prod.unit}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="md:col-span-1">
              <Label>Quantity *</Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={product.quantity}
                onChange={(e) => updateEditProductRow(index, 'quantity', e.target.value)}
                className="w-full min-w-[120px]"
              />
            </div>
            <div className="md:col-span-1 flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={addEditProductRow}
                className="px-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
              {editFormData.products.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeEditProductRow(index)}
                  className="px-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={editFormData.remarks}
          onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
          placeholder="Enter any remarks or special instructions"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={handleUpdate}>
          Update Indent
        </Button>
      </div>
    </div>
  );

  // Edit Order Modal Component
  const EditOrderModal = ({ order }) => {
    const [editQuantities, setEditQuantities] = useState({});
    const [openCategories, setOpenCategories] = useState(new Set(['Steel', 'Stainless Steel', 'Aluminum']));

    // Initialize quantities when order is passed
    useState(() => {
      const quantities = {};
      order.items?.forEach(item => {
        quantities[item.id] = item.quantity;
      });
      setEditQuantities(quantities);
    }, [order]);

    // Group items by category
    const groupedItems = useMemo(() => {
      const groups = {};
      order.items?.forEach(item => {
        if (!groups[item.category]) {
          groups[item.category] = [];
        }
        groups[item.category].push(item);
      });
      return groups;
    }, [order]);

    const updateQuantity = (itemId, quantity) => {
      setEditQuantities(prev => ({
        ...prev,
        [itemId]: Math.max(0, parseInt(quantity) || 0)
      }));
    };

    const toggleCategory = (category) => {
      setOpenCategories(prev => {
        const newSet = new Set(prev);
        if (newSet.has(category)) {
          newSet.delete(category);
        } else {
          newSet.add(category);
        }
        return newSet;
      });
    };

    const getTotalQuantity = () => {
      return Object.values(editQuantities).reduce((sum, qty) => sum + (qty || 0), 0);
    };

    return (
      <div className="space-y-4">
        {/* Order Header Info */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <Label className="text-xs text-gray-500">Order#</Label>
            <p className="font-medium">{order.id}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Order Date</Label>
            <p className="font-medium">{order.orderDate}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Order Status</Label>
            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {order.status}
            </Badge>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Customer Name</Label>
            <p className="font-medium">{order.customerName}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Order Amount</Label>
            <p className="font-medium">{order.orderAmount}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Total Items</Label>
            <p className="font-medium">{getTotalQuantity() || order.totalQuantity}</p>
          </div>
        </div>

        {/* Address */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Label className="text-xs text-gray-500">Address</Label>
          <p className="text-sm">{order.address}</p>
        </div>

        {/* Items by Category */}
        <div className="space-y-3">
          {Object.entries(groupedItems).map(([category, items]) => (
            <Collapsible
              key={category}
              open={openCategories.has(category)}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                <div className="flex items-center space-x-2">
                  <ChevronDown className={`h-4 w-4 transition-transform ${openCategories.has(category) ? 'rotate-180' : ''}`} />
                  <span className="font-medium text-sm">{category}</span>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="pt-2">
                <div className="space-y-2">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                    <div className="col-span-6">Item Name</div>
                    <div className="col-span-6 text-center">Quantity</div>
                  </div>
                  
                  {/* Items */}
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="col-span-1">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded border"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkMyMC40MTgzIDE2IDI0IDE5LjU4MTcgMjQgMjRTMjAuNDE4MyAzMiAxNiAzMlM4IDI4LjQxODMgOCAyNFMxMS41ODE3IDE2IDE2IDE2WiIgZmlsbD0iI0Q1RDNEOCI+Cjwvc3ZnPgo=';
                          }}
                        />
                      </div>
                      <div className="col-span-8">
                        <p className="font-medium text-sm">{item.name}</p>
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          min="0"
                          value={editQuantities[item.id] !== undefined ? editQuantities[item.id] : item.quantity}
                          onChange={(e) => updateQuantity(item.id, e.target.value)}
                          className="text-center"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg font-medium">
          <span>Totals</span>
          <span>{getTotalQuantity() || order.totalQuantity}</span>
          <span>{order.orderAmount}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 sm:px-6 py-4 rounded-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
            <h1 className="text-lg sm:text-xl font-semibold">My Orders</h1>
            <span className="hidden lg:inline text-blue-100 text-sm">Manage and track your sales orders</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {canPerformAction('sales', 'myIndent', 'add') && (
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 text-sm px-3 py-2">
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Create Order</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl mx-4 max-h-[90vh] overflow-y-auto" key="create-indent-modal">
                  <DialogHeader>
                    <DialogTitle>Create New Order</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new production order.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateOrderForm />
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm px-3 py-2">
              <RefreshCw className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{orders.length}</p>
            </div>
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {orders.filter(o => o.status === 'Pending').length}
              </p>
            </div>
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {orders.filter(o => o.status === 'Approved').length}
              </p>
            </div>
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {orders.filter(o => o.status === 'Completed').length}
              </p>
            </div>
            <FileCheck className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Header with Orders title and New Order button */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Orders</h2>
          </div>
          {canPerformAction('sales', 'myIndent', 'add') && (
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2"
              onClick={() => setLocation('/sales/new-order')}
            >
              <Edit className="h-4 w-4 mr-2" />
              New Order
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Steel">Steel</SelectItem>
                <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                <SelectItem value="Aluminum">Aluminum</SelectItem>
                <SelectItem value="Copper">Copper</SelectItem>
                <SelectItem value="Pipes">Pipes</SelectItem>
                <SelectItem value="Fasteners">Fasteners</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Order Date</Label>
            <Input
              type="date"
              placeholder="DD/MM/YYYY"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter By Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">None</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* My Orders List Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">My Orders List</h3>
          <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
            <Upload className="h-4 w-4 mr-2" />
            EXPORT
          </Button>
        </div>

        {/* Clean Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 py-3 px-6 bg-gray-50 dark:bg-gray-900 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <div>ORDER #</div>
            <div>ORDER DATE</div>
            <div>CUST. NAME</div>
            <div className="text-center">MORE</div>
          </div>

          {/* Orders List */}
          {filteredOrders.map((order) => (
            <div key={order.id} className="grid grid-cols-4 gap-4 py-4 px-6 items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-750">
              <div className="font-medium text-gray-900 dark:text-gray-100">{order.id}</div>
              <div className="text-gray-600 dark:text-gray-400">{order.orderDate}</div>
              <div className="text-gray-600 dark:text-gray-400 truncate">{order.customerName}</div>
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(order)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm px-4 py-1"
                >
                  MORE
                </Button>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-gray-500 dark:text-gray-400">No orders found</div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal - Enhanced Order Details */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-red-600" />
              <span>Order Details</span>
            </DialogTitle>
            <DialogDescription>
              Complete details and product information for the selected order.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Header Information */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Order ID</Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Customer</Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Order Date</Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">{selectedOrder.orderDate}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</Label>
                    <Badge variant={getStatusVariant(selectedOrder.status)} className="mt-1">
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1">{selectedOrder.status}</span>
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Total Quantity</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-2">{selectedOrder.totalQuantity || 0}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900 dark:text-green-300">Order Amount</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-2">{selectedOrder.orderAmount || '₹0'}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900 dark:text-orange-300">Created On</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-300 mt-2">{selectedOrder.createdAt || selectedOrder.orderDate}</p>
                </div>
              </div>

              {/* Products List */}
              {selectedOrder.products && selectedOrder.products.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-red-600" />
                    <span>Products Ordered ({selectedOrder.products.length} items)</span>
                  </h3>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-4 p-3 bg-gray-50 dark:bg-gray-900 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      <div className="col-span-2">Product Name</div>
                      <div>Category</div>
                      <div className="text-center">Quantity</div>
                      <div className="text-right">Unit Price</div>
                      <div className="text-right">Total</div>
                    </div>
                    
                    {/* Products */}
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="grid grid-cols-6 gap-4 p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 items-center">
                        <div className="col-span-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-sm">
                              🍞
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {product.productName || product.name || 'Unknown Product'}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {product.category || 'General'}
                        </div>
                        <div className="text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {product.quantity || 0}
                          </span>
                        </div>
                        <div className="text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                          ₹{(product.unitPrice || 0).toFixed(2)}
                        </div>
                        <div className="text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                          ₹{(product.totalPrice || (product.unitPrice || 0) * (product.quantity || 0)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                {canPerformAction('sales', 'myIndent', 'edit') && (
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      setSelectedOrder(selectedOrder);
                      setIsViewModalOpen(false);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Order
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrders;
