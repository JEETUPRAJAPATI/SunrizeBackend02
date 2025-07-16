import { useState } from 'react';
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
  ChevronsUpDown
} from 'lucide-react';

const MyIndent = () => {
  const { hasFeatureAccess, canPerformAction } = usePermissions();
  
  // Check if user has access to myIndent feature
  if (!hasFeatureAccess('sales', 'myIndent', 'view')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to view My Indent.</p>
        </div>
      </div>
    );
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState(null);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [productSearchOpen, setProductSearchOpen] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    customerName: '',
    orderDate: new Date().toISOString().split('T')[0],
    remarks: '',
    selectedProduct: '',
    productQuantity: '',
    products: [{ productId: '', productName: '', quantity: '' }] // Array of products with quantities
  });

  // Simplified dummy indent data with only essential fields
  const [indents, setIndents] = useState([
    {
      id: 'IND-2025-001',
      customerName: 'ABC Manufacturing Ltd',
      orderDate: '2025-01-05',
      status: 'Approved',
      totalQuantity: 75,
      remarks: 'Urgent delivery required',
      createdAt: '2025-01-05'
    },
    {
      id: 'IND-2025-002',
      customerName: 'XYZ Industries',
      orderDate: '2025-01-04',
      status: 'Pending',
      totalQuantity: 120,
      remarks: 'Standard delivery terms',
      createdAt: '2025-01-04'
    },
    {
      id: 'IND-2025-003',
      customerName: 'Global Enterprises',
      orderDate: '2025-01-03',
      status: 'Processing',
      totalQuantity: 50,
      remarks: 'Quality check required',
      createdAt: '2025-01-03'
    },
    {
      id: 'IND-2025-004',
      customerName: 'Tech Solutions Inc',
      orderDate: '2025-01-02',
      status: 'Completed',
      totalQuantity: 200,
      remarks: 'Express delivery completed',
      createdAt: '2025-01-02'
    },
    {
      id: 'IND-2025-005',
      customerName: 'Manufacturing Co',
      orderDate: '2025-01-01',
      status: 'Cancelled',
      totalQuantity: 85,
      remarks: 'Customer request cancellation',
      createdAt: '2025-01-01'
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

  // Manufacturing Product List for Indents
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

  const filteredIndents = indents.filter(indent => {
    const matchesSearch = 
      indent.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.remarks.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || indent.status === statusFilter;
    
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
    const newIndent = {
      id: `IND-2025-${(indents.length + 1).toString().padStart(3, '0')}`,
      customerName: formData.customerName,
      orderDate: formData.orderDate,
      remarks: formData.remarks,
      products: formData.products.filter(p => p.productId && p.quantity), // Only include products with ID and quantity
      status: 'Pending', // Default status for new indents
      totalQuantity: totalQuantity,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setIndents([...indents, newIndent]);
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

  const handleEdit = (indent) => {
    setSelectedIndent(indent);
    
    // Check if the indent has multiple products stored, otherwise create from legacy single product format
    let productsToEdit = [];
    
    if (indent.products && indent.products.length > 0) {
      // New format with multiple products
      productsToEdit = indent.products.map(product => ({
        productId: product.productId || '',
        quantity: product.quantity || ''
      }));
    } else {
      // Legacy format with single product - convert to new format
      productsToEdit = [{
        productId: indent.selectedProduct ? productsList.find(p => p.name === indent.selectedProduct)?.id || '' : '',
        quantity: indent.productQuantity || indent.totalQuantity || ''
      }];
    }
    
    setEditFormData({
      customerName: indent.customerName,
      orderDate: indent.orderDate,
      remarks: indent.remarks,
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
    const updatedIndent = {
      ...selectedIndent,
      customerName: editFormData.customerName,
      orderDate: editFormData.orderDate,
      remarks: editFormData.remarks,
      products: validProducts,
      totalQuantity: totalQuantity,
      // Update for display purposes - showing first product
      selectedProduct: validProducts[0] ? productsList.find(p => p.id === validProducts[0].productId)?.name : '',
      productQuantity: totalQuantity
    };
    
    const updatedIndents = indents.map(indent => 
      indent.id === selectedIndent.id ? updatedIndent : indent
    );
    setIndents(updatedIndents);
    setIsEditModalOpen(false);
    setEditFormData({
      customerName: '',
      orderDate: '',
      remarks: '',
      products: [{ productId: '', quantity: '' }]
    });
    setEditProductDropdownStates([false]);
  };

  const handleView = (indent) => {
    setSelectedIndent(indent);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this indent?')) {
      setIndents(indents.filter(indent => indent.id !== id));
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

  // Create new form component to fix input focus issues and support multiple products
  const CreateIndentForm = () => {
    const [localFormData, setLocalFormData] = useState({
      customerName: '',
      orderDate: new Date().toISOString().split('T')[0],
      remarks: '',
      products: [{ productId: '', productName: '', quantity: '' }]
    });
    const [localCustomerOpen, setLocalCustomerOpen] = useState(false);
    const [productDropdownStates, setProductDropdownStates] = useState([false]);

    // Add new product row
    const addLocalProductRow = () => {
      setLocalFormData({
        ...localFormData,
        products: [...localFormData.products, { productId: '', productName: '', quantity: '' }]
      });
      setProductDropdownStates([...productDropdownStates, false]);
    };

    // Remove product row
    const removeLocalProductRow = (index) => {
      if (localFormData.products.length > 1) {
        const updatedProducts = localFormData.products.filter((_, i) => i !== index);
        const updatedDropdownStates = productDropdownStates.filter((_, i) => i !== index);
        setLocalFormData({ ...localFormData, products: updatedProducts });
        setProductDropdownStates(updatedDropdownStates);
      }
    };

    // Helper function to toggle specific dropdown
    const toggleProductDropdown = (index, isOpen) => {
      const updatedStates = [...productDropdownStates];
      updatedStates[index] = isOpen;
      setProductDropdownStates(updatedStates);
    };

    // Update product in specific row
    const updateLocalProductRow = (index, field, value) => {
      const updatedProducts = localFormData.products.map((product, i) => {
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
      setLocalFormData({ ...localFormData, products: updatedProducts });
    };

    const handleSubmit = () => {
      if (!localFormData.customerName || !localFormData.orderDate) {
        return;
      }
      
      const validProducts = localFormData.products.filter(p => p.productId && p.quantity);
      if (validProducts.length === 0) {
        return;
      }
      
      const totalQuantity = validProducts.reduce((sum, product) => sum + (parseInt(product.quantity) || 0), 0);
      const newIndent = {
        id: `IND-2025-${(indents.length + 1).toString().padStart(3, '0')}`,
        customerName: localFormData.customerName,
        orderDate: localFormData.orderDate,
        remarks: localFormData.remarks,
        products: validProducts,
        status: 'Pending',
        totalQuantity: totalQuantity,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setIndents([...indents, newIndent]);
      setIsCreateModalOpen(false);
      setLocalFormData({
        customerName: '',
        orderDate: new Date().toISOString().split('T')[0],
        remarks: '',
        products: [{ productId: '', productName: '', quantity: '' }]
      });
      setProductDropdownStates([false]);
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

        {/* Products Section */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Products *</Label>
          
          {localFormData.products.map((product, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <Label>Product Selection *</Label>
                <Popover open={productDropdownStates[index]} onOpenChange={(isOpen) => toggleProductDropdown(index, isOpen)}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={productDropdownStates[index]}
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
                              updateLocalProductRow(index, 'productId', prod.id);
                              toggleProductDropdown(index, false);
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
                  onChange={(e) => updateLocalProductRow(index, 'quantity', e.target.value)}
                  className="w-full min-w-[120px]"
                />
              </div>
              <div className="md:col-span-1 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={addLocalProductRow}
                  className="px-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                {localFormData.products.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLocalProductRow(index)}
                    className="px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Remarks Section */}
        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            placeholder="Enter any remarks or special instructions"
            value={localFormData.remarks}
            onChange={(e) => setLocalFormData({ ...localFormData, remarks: e.target.value })}
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setIsCreateModalOpen(false);
              setLocalFormData({
                customerName: '',
                orderDate: new Date().toISOString().split('T')[0],
                remarks: '',
                products: [{ productId: '', productName: '', quantity: '' }]
              });
              setProductDropdownStates([false]);
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!localFormData.customerName || !localFormData.orderDate || localFormData.products.filter(p => p.productId && p.quantity).length === 0}
          >
            Create Indent
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

  const EditIndentForm = () => (
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



  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 sm:px-6 py-4 rounded-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
            <h1 className="text-lg sm:text-xl font-semibold">My Indent</h1>
            <span className="hidden lg:inline text-blue-100 text-sm">Manage and track your sales indents</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {canPerformAction('sales', 'myIndent', 'add') && (
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 text-sm px-3 py-2">
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Create Indent</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl mx-4" key="create-indent-modal">
                  <DialogHeader>
                    <DialogTitle>Create New Indent</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new production indent.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateIndentForm />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Indents</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{indents.length}</p>
            </div>
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {indents.filter(i => i.status === 'Pending').length}
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
                {indents.filter(i => i.status === 'Approved').length}
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
                {indents.filter(i => i.status === 'Completed').length}
              </p>
            </div>
            <FileCheck className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search indents..."
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
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Indent List</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Indent ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Product Quantity</TableHead>
              <TableHead>Remarks</TableHead>
              {(canPerformAction('sales', 'myIndent', 'edit') || canPerformAction('sales', 'myIndent', 'delete')) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIndents.map((indent) => (
              <TableRow key={indent.id}>
                <TableCell className="font-medium">{indent.id}</TableCell>
                <TableCell>{indent.customerName}</TableCell>
                <TableCell>{indent.orderDate}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(indent.status)} className="flex items-center gap-1 w-fit">
                    {getStatusIcon(indent.status)}
                    {indent.status}
                  </Badge>
                </TableCell>
              <TableCell>{indent.productQuantity || indent.totalQuantity}</TableCell>
                <TableCell className="max-w-xs truncate">{indent.remarks}</TableCell>
                {(canPerformAction('sales', 'myIndent', 'edit') || canPerformAction('sales', 'myIndent', 'delete')) && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(indent)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        {canPerformAction('sales', 'myIndent', 'edit') && (
                          <DropdownMenuItem onClick={() => handleEdit(indent)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {canPerformAction('sales', 'myIndent', 'delete') && (
                          <DropdownMenuItem onClick={() => handleDelete(indent.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Indent</DialogTitle>
            <DialogDescription>
              Update the indent details below.
            </DialogDescription>
          </DialogHeader>
          <EditIndentForm />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Indent Details</DialogTitle>
            <DialogDescription>
              Complete details of the selected indent.
            </DialogDescription>
          </DialogHeader>
          {selectedIndent && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Indent ID</Label>
                  <p className="text-sm font-medium">{selectedIndent.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Customer Name</Label>
                  <p className="text-sm font-medium">{selectedIndent.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Order Date</Label>
                  <p className="text-sm font-medium">{selectedIndent.orderDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge variant={getStatusVariant(selectedIndent.status)} className="flex items-center gap-1 w-fit">
                    {getStatusIcon(selectedIndent.status)}
                    {selectedIndent.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created Date</Label>
                  <p className="text-sm font-medium">{selectedIndent.createdAt}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Total Quantity</Label>
                  <p className="text-sm font-medium">{selectedIndent.productQuantity || selectedIndent.totalQuantity}</p>
                </div>
              </div>

              {/* Products Information */}
              <div>
                <Label className="text-sm font-medium text-gray-500 mb-3 block">Product Details</Label>
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-400">Product Name</Label>
                      <p className="text-sm font-medium">{selectedIndent.selectedProduct || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-400">Quantity</Label>
                      <p className="text-sm font-medium">{selectedIndent.productQuantity || selectedIndent.totalQuantity || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <Label className="text-sm font-medium text-gray-500">Remarks</Label>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm">{selectedIndent.remarks || 'No remarks provided'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyIndent;