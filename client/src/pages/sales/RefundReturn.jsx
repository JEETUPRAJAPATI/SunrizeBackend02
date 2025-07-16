import React, { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Plus, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  FileText,
  ArrowLeftRight,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Check,
  ChevronsUpDown
} from 'lucide-react';

const RefundReturn = () => {
  const { hasFeatureAccess, canPerformAction } = usePermissions();
  const { toast } = useToast();
  
  // Check if user has access to refund return feature
  if (!hasFeatureAccess('sales', 'refundReturn', 'view')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to view Refund & Return.</p>
        </div>
      </div>
    );
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    invoiceNumber: '',
    products: [{ productId: '', unitPrice: '', quantity: '', reason: '' }],
    type: 'refund', // refund or return
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  // Dummy data for refund/return entries
  const [entries, setEntries] = useState([
    {
      id: 'RR001',
      customerName: 'ABC Corporation',
      invoiceNumber: 'INV-2024-001',
      productName: 'Widget A',
      quantity: 5,
      unitPrice: 100,
      totalAmount: 500,
      type: 'refund',
      reason: 'Product defect',
      status: 'pending',
      date: '2024-01-15',
      remarks: 'Customer reported manufacturing defect',
      processedDate: null
    },
    {
      id: 'RR002',
      customerName: 'XYZ Industries',
      invoiceNumber: 'INV-2024-002',
      productName: 'Widget B',
      quantity: 3,
      unitPrice: 150,
      totalAmount: 450,
      type: 'return',
      reason: 'Excess inventory',
      status: 'approved',
      date: '2024-01-14',
      remarks: 'Customer ordered excess quantity',
      processedDate: '2024-01-16'
    },
    {
      id: 'RR003',
      customerName: 'Tech Solutions Ltd',
      invoiceNumber: 'INV-2024-003',
      productName: 'Widget C',
      quantity: 2,
      unitPrice: 200,
      totalAmount: 400,
      type: 'refund',
      reason: 'Wrong item delivered',
      status: 'completed',
      date: '2024-01-13',
      remarks: 'Delivered wrong product model',
      processedDate: '2024-01-17'
    },
    {
      id: 'RR004',
      customerName: 'Global Enterprises',
      invoiceNumber: 'INV-2024-004',
      productName: 'Widget D',
      quantity: 1,
      unitPrice: 300,
      totalAmount: 300,
      type: 'return',
      reason: 'Customer cancelled order',
      status: 'rejected',
      date: '2024-01-12',
      remarks: 'Order cancellation after delivery',
      processedDate: '2024-01-18'
    }
  ]);

  // Dummy customer and product data
  const customersList = [
    { id: 'C001', name: 'ABC Corporation' },
    { id: 'C002', name: 'XYZ Industries' },
    { id: 'C003', name: 'Tech Solutions Ltd' },
    { id: 'C004', name: 'Global Enterprises' }
  ];

  // Manufacturing Product List for Refund & Return
  const productsList = [
    // Steel Products
    { id: 'P001', name: 'MS Round Bar - 8mm', code: 'MSR-8', unit: 'Kg', category: 'Steel', price: 55 },
    { id: 'P002', name: 'MS Round Bar - 10mm', code: 'MSR-10', unit: 'Kg', category: 'Steel', price: 58 },
    { id: 'P003', name: 'MS Round Bar - 12mm', code: 'MSR-12', unit: 'Kg', category: 'Steel', price: 60 },
    { id: 'P004', name: 'MS Round Bar - 16mm', code: 'MSR-16', unit: 'Kg', category: 'Steel', price: 62 },
    { id: 'P005', name: 'MS Round Bar - 20mm', code: 'MSR-20', unit: 'Kg', category: 'Steel', price: 65 },
    { id: 'P006', name: 'MS Square Bar - 10x10mm', code: 'MSS-10', unit: 'Kg', category: 'Steel', price: 60 },
    { id: 'P007', name: 'MS Square Bar - 12x12mm', code: 'MSS-12', unit: 'Kg', category: 'Steel', price: 62 },
    { id: 'P008', name: 'MS Flat Bar - 25x5mm', code: 'MSF-25x5', unit: 'Kg', category: 'Steel', price: 58 },
    { id: 'P009', name: 'MS Flat Bar - 40x6mm', code: 'MSF-40x6', unit: 'Kg', category: 'Steel', price: 60 },
    { id: 'P010', name: 'MS Angle - 25x25x3mm', code: 'MSA-25x25', unit: 'Kg', category: 'Steel', price: 56 },
    { id: 'P011', name: 'MS Angle - 40x40x5mm', code: 'MSA-40x40', unit: 'Kg', category: 'Steel', price: 58 },
    { id: 'P012', name: 'MS Channel - 75x40x4.8mm', code: 'MSC-75x40', unit: 'Kg', category: 'Steel', price: 62 },
    { id: 'P013', name: 'MS Channel - 100x50x5mm', code: 'MSC-100x50', unit: 'Kg', category: 'Steel', price: 65 },
    { id: 'P014', name: 'MS Plate - 6mm', code: 'MSP-6', unit: 'Kg', category: 'Steel', price: 60 },
    { id: 'P015', name: 'MS Plate - 8mm', code: 'MSP-8', unit: 'Kg', category: 'Steel', price: 62 },
    { id: 'P016', name: 'MS Plate - 10mm', code: 'MSP-10', unit: 'Kg', category: 'Steel', price: 65 },
    { id: 'P017', name: 'MS Plate - 12mm', code: 'MSP-12', unit: 'Kg', category: 'Steel', price: 68 },
    { id: 'P018', name: 'MS Sheet - 1mm', code: 'MSS-1', unit: 'Kg', category: 'Steel', price: 52 },
    { id: 'P019', name: 'MS Sheet - 2mm', code: 'MSS-2', unit: 'Kg', category: 'Steel', price: 55 },
    { id: 'P020', name: 'MS Sheet - 3mm', code: 'MSS-3', unit: 'Kg', category: 'Steel', price: 58 },
    
    // Stainless Steel Products
    { id: 'P021', name: 'SS Round Bar - 8mm (304)', code: 'SSR-8-304', unit: 'Kg', category: 'Stainless Steel', price: 185 },
    { id: 'P022', name: 'SS Round Bar - 10mm (304)', code: 'SSR-10-304', unit: 'Kg', category: 'Stainless Steel', price: 190 },
    { id: 'P023', name: 'SS Round Bar - 12mm (316)', code: 'SSR-12-316', unit: 'Kg', category: 'Stainless Steel', price: 220 },
    { id: 'P024', name: 'SS Plate - 6mm (304)', code: 'SSP-6-304', unit: 'Kg', category: 'Stainless Steel', price: 195 },
    { id: 'P025', name: 'SS Plate - 8mm (316)', code: 'SSP-8-316', unit: 'Kg', category: 'Stainless Steel', price: 225 },
    { id: 'P026', name: 'SS Sheet - 1mm (304)', code: 'SSS-1-304', unit: 'Kg', category: 'Stainless Steel', price: 180 },
    { id: 'P027', name: 'SS Sheet - 2mm (316)', code: 'SSS-2-316', unit: 'Kg', category: 'Stainless Steel', price: 210 },
    
    // Aluminum Products
    { id: 'P028', name: 'Aluminum Round Bar - 10mm', code: 'ALR-10', unit: 'Kg', category: 'Aluminum', price: 145 },
    { id: 'P029', name: 'Aluminum Round Bar - 12mm', code: 'ALR-12', unit: 'Kg', category: 'Aluminum', price: 148 },
    { id: 'P030', name: 'Aluminum Sheet - 1mm', code: 'ALS-1', unit: 'Kg', category: 'Aluminum', price: 140 },
    { id: 'P031', name: 'Aluminum Sheet - 2mm', code: 'ALS-2', unit: 'Kg', category: 'Aluminum', price: 142 },
    { id: 'P032', name: 'Aluminum Plate - 6mm', code: 'ALP-6', unit: 'Kg', category: 'Aluminum', price: 150 },
    { id: 'P033', name: 'Aluminum Angle - 25x25x3mm', code: 'ALA-25x25', unit: 'Kg', category: 'Aluminum', price: 145 },
    
    // Copper Products
    { id: 'P034', name: 'Copper Wire - 2.5 sq mm', code: 'CW-2.5', unit: 'Meter', category: 'Copper', price: 12 },
    { id: 'P035', name: 'Copper Wire - 4 sq mm', code: 'CW-4', unit: 'Meter', category: 'Copper', price: 18 },
    { id: 'P036', name: 'Copper Wire - 6 sq mm', code: 'CW-6', unit: 'Meter', category: 'Copper', price: 25 },
    { id: 'P037', name: 'Copper Rod - 8mm', code: 'CR-8', unit: 'Kg', category: 'Copper', price: 650 },
    { id: 'P038', name: 'Copper Rod - 10mm', code: 'CR-10', unit: 'Kg', category: 'Copper', price: 655 },
    { id: 'P039', name: 'Copper Sheet - 1mm', code: 'CS-1', unit: 'Kg', category: 'Copper', price: 645 },
    
    // Pipes & Tubes
    { id: 'P040', name: 'MS Pipe - 1 inch (25mm)', code: 'MSP-25', unit: 'Meter', category: 'Pipes', price: 85 },
    { id: 'P041', name: 'MS Pipe - 1.5 inch (40mm)', code: 'MSP-40', unit: 'Meter', category: 'Pipes', price: 125 },
    { id: 'P042', name: 'MS Pipe - 2 inch (50mm)', code: 'MSP-50', unit: 'Meter', category: 'Pipes', price: 165 },
    { id: 'P043', name: 'MS Pipe - 3 inch (80mm)', code: 'MSP-80', unit: 'Meter', category: 'Pipes', price: 245 },
    { id: 'P044', name: 'MS Pipe - 4 inch (100mm)', code: 'MSP-100', unit: 'Meter', category: 'Pipes', price: 325 },
    { id: 'P045', name: 'SS Pipe - 1 inch (304)', code: 'SSP-25-304', unit: 'Meter', category: 'Pipes', price: 285 },
    { id: 'P046', name: 'SS Pipe - 2 inch (304)', code: 'SSP-50-304', unit: 'Meter', category: 'Pipes', price: 465 },
    { id: 'P047', name: 'PVC Pipe - 2 inch', code: 'PVC-50', unit: 'Meter', category: 'Pipes', price: 45 },
    { id: 'P048', name: 'PVC Pipe - 4 inch', code: 'PVC-100', unit: 'Meter', category: 'Pipes', price: 85 },
    { id: 'P049', name: 'HDPE Pipe - 2 inch', code: 'HDPE-50', unit: 'Meter', category: 'Pipes', price: 55 },
    
    // Fasteners & Hardware
    { id: 'P050', name: 'Hex Bolt M8x25', code: 'HB-M8x25', unit: 'Pcs', category: 'Fasteners', price: 2.50 },
    { id: 'P051', name: 'Hex Bolt M10x30', code: 'HB-M10x30', unit: 'Pcs', category: 'Fasteners', price: 3.25 },
    { id: 'P052', name: 'Hex Bolt M12x40', code: 'HB-M12x40', unit: 'Pcs', category: 'Fasteners', price: 4.50 },
    { id: 'P053', name: 'Hex Nut M8', code: 'HN-M8', unit: 'Pcs', category: 'Fasteners', price: 1.25 },
    { id: 'P054', name: 'Hex Nut M10', code: 'HN-M10', unit: 'Pcs', category: 'Fasteners', price: 1.75 },
    { id: 'P055', name: 'Hex Nut M12', code: 'HN-M12', unit: 'Pcs', category: 'Fasteners', price: 2.25 },
    { id: 'P056', name: 'Washer M8', code: 'W-M8', unit: 'Pcs', category: 'Fasteners', price: 0.75 },
    { id: 'P057', name: 'Washer M10', code: 'W-M10', unit: 'Pcs', category: 'Fasteners', price: 1.00 },
    { id: 'P058', name: 'Washer M12', code: 'W-M12', unit: 'Pcs', category: 'Fasteners', price: 1.25 },
    
    // Electrical Components
    { id: 'P059', name: 'Cable 3 Core - 2.5 sq mm', code: 'C3-2.5', unit: 'Meter', category: 'Electrical', price: 35 },
    { id: 'P060', name: 'Cable 3 Core - 4 sq mm', code: 'C3-4', unit: 'Meter', category: 'Electrical', price: 48 },
    { id: 'P061', name: 'Cable 4 Core - 2.5 sq mm', code: 'C4-2.5', unit: 'Meter', category: 'Electrical', price: 42 },
    { id: 'P062', name: 'Cable Tray - 100mm', code: 'CT-100', unit: 'Meter', category: 'Electrical', price: 125 },
    { id: 'P063', name: 'Cable Tray - 200mm', code: 'CT-200', unit: 'Meter', category: 'Electrical', price: 185 },
    { id: 'P064', name: 'Conduit Pipe - 20mm', code: 'CP-20', unit: 'Meter', category: 'Electrical', price: 15 },
    { id: 'P065', name: 'Conduit Pipe - 25mm', code: 'CP-25', unit: 'Meter', category: 'Electrical', price: 18 }
  ];

  const reasonOptions = [
    'Product defect',
    'Wrong item delivered',
    'Excess inventory',
    'Customer cancelled order',
    'Quality issues',
    'Damaged during shipping',
    'Not as described',
    'Other'
  ];

  // Filter entries based on search and status
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesType = typeFilter === 'all' || entry.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Create form component with multiple products support
  const CreateEntryForm = () => {
    const [localFormData, setLocalFormData] = useState({
      customerId: '',
      invoiceNumber: '',
      products: [{ productId: '', unitPrice: '', quantity: '', reason: '' }],
      type: 'refund',
      date: new Date().toISOString().split('T')[0],
      remarks: ''
    });
    const [localCustomerOpen, setLocalCustomerOpen] = useState(false);
    const [productDropdownStates, setProductDropdownStates] = useState([false]);

    // Add new product row
    const addLocalProductRow = () => {
      setLocalFormData({
        ...localFormData,
        products: [...localFormData.products, { productId: '', unitPrice: '', quantity: '', reason: '' }]
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
              unitPrice: selectedProduct ? selectedProduct.price : ''
            };
          } else {
            return { ...product, [field]: value };
          }
        }
        return product;
      });
      setLocalFormData({ ...localFormData, products: updatedProducts });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!localFormData.customerId || !localFormData.invoiceNumber) {
        return;
      }
      
      const validProducts = localFormData.products.filter(p => p.productId && p.quantity && p.unitPrice && p.reason);
      if (validProducts.length === 0) {
        return;
      }
      
      const totalAmount = validProducts.reduce((sum, product) => sum + (parseFloat(product.quantity) * parseFloat(product.unitPrice)), 0);
      const newEntry = {
        id: `RR${String(entries.length + 1).padStart(3, '0')}`,
        customerId: localFormData.customerId,
        customerName: customersList.find(c => c.id === localFormData.customerId)?.name || '',
        invoiceNumber: localFormData.invoiceNumber,
        products: validProducts,
        // For display compatibility - showing first product
        productName: validProducts[0] ? productsList.find(p => p.id === validProducts[0].productId)?.name : '',
        quantity: validProducts.reduce((sum, product) => sum + parseInt(product.quantity), 0),
        unitPrice: validProducts[0]?.unitPrice || 0,
        totalAmount: totalAmount,
        type: localFormData.type,
        reason: validProducts[0]?.reason || '',
        status: 'pending',
        date: localFormData.date,
        remarks: localFormData.remarks,
        processedDate: null
      };
      
      setEntries([...entries, newEntry]);
      setIsCreateModalOpen(false);
      setLocalFormData({
        customerId: '',
        invoiceNumber: '',
        products: [{ productId: '', unitPrice: '', quantity: '', reason: '' }],
        type: 'refund',
        date: new Date().toISOString().split('T')[0],
        remarks: ''
      });
      setProductDropdownStates([false]);
      
      // Show success toast
      toast({
        title: "Success",
        description: `${newEntry.type === 'refund' ? 'Refund' : 'Return'} entry created successfully for ${newEntry.customerName}`,
        variant: "default",
      });
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerId">Customer *</Label>
            <Popover open={localCustomerOpen} onOpenChange={setLocalCustomerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={localCustomerOpen}
                  className="w-full justify-between"
                >
                  {localFormData.customerId 
                    ? customersList.find(c => c.id === localFormData.customerId)?.name 
                    : "Select customer..."}
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
                        onSelect={() => {
                          setLocalFormData({ ...localFormData, customerId: customer.id });
                          setLocalCustomerOpen(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            localFormData.customerId === customer.id ? "opacity-100" : "opacity-0"
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
            <Label htmlFor="invoiceNumber">Invoice Number *</Label>
            <Input
              id="invoiceNumber"
              value={localFormData.invoiceNumber}
              onChange={(e) => setLocalFormData({...localFormData, invoiceNumber: e.target.value})}
              placeholder="Enter invoice number"
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Type *</Label>
            <Select value={localFormData.type} onValueChange={(value) => setLocalFormData({...localFormData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="return">Return</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={localFormData.date}
              onChange={(e) => setLocalFormData({...localFormData, date: e.target.value})}
              required
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Products *</Label>
          
          {localFormData.products.map((product, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end border p-4 rounded-lg">
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
                  placeholder="Qty"
                  value={product.quantity}
                  onChange={(e) => updateLocalProductRow(index, 'quantity', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-1">
                <Label>Unit Price *</Label>
                <Input
                  type="number"
                  placeholder="Price"
                  value={product.unitPrice}
                  onChange={(e) => updateLocalProductRow(index, 'unitPrice', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-1">
                <Label>Reason *</Label>
                <Select value={product.reason} onValueChange={(value) => updateLocalProductRow(index, 'reason', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasonOptions.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Input
            id="remarks"
            value={localFormData.remarks}
            onChange={(e) => setLocalFormData({...localFormData, remarks: e.target.value})}
            placeholder="Enter remarks"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setIsCreateModalOpen(false);
              setLocalFormData({
                customerId: '',
                invoiceNumber: '',
                products: [{ productId: '', unitPrice: '', quantity: '', reason: '' }],
                type: 'refund',
                date: new Date().toISOString().split('T')[0],
                remarks: ''
              });
              setProductDropdownStates([false]);
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!localFormData.customerId || !localFormData.invoiceNumber || localFormData.products.filter(p => p.productId && p.quantity && p.unitPrice && p.reason).length === 0}
          >
            Add Entry
          </Button>
        </div>
      </div>
    );
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      customerName: '',
      invoiceNumber: '',
      products: [{ productId: '', unitPrice: '', quantity: '', reason: '' }],
      type: 'refund',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      remarks: ''
    });
  };

  const handleView = (entry) => {
    setSelectedEntry(entry);
    setIsViewModalOpen(true);
  };

  // Edit form component with multiple products support
  const EditEntryForm = ({ selectedEntry }) => {
    // Initialize products array based on entry format
    const initializeProducts = (entry) => {
      if (!entry) return [{ productId: '', unitPrice: '', quantity: '', reason: '' }];
      
      console.log('Initializing products for entry:', entry); // Debug log
      
      if (entry.products && entry.products.length > 0) {
        // New format with multiple products
        console.log('Found multiple products:', entry.products); // Debug log
        return entry.products.map(product => ({
          productId: product.productId || '',
          unitPrice: product.unitPrice || '',
          quantity: product.quantity || '',
          reason: product.reason || ''
        }));
      } else {
        // Legacy format with single product - convert to new format
        console.log('Converting legacy single product format'); // Debug log
        const productId = entry.productName ? productsList.find(p => p.name === entry.productName)?.id || '' : '';
        return [{
          productId: productId,
          unitPrice: entry.unitPrice || '',
          quantity: entry.quantity || '',
          reason: entry.reason || ''
        }];
      }
    };

    const [editFormData, setEditFormData] = useState({
      customerId: '',
      invoiceNumber: '',
      products: [{ productId: '', unitPrice: '', quantity: '', reason: '' }],
      type: 'refund',
      date: '',
      remarks: ''
    });
    const [editCustomerOpen, setEditCustomerOpen] = useState(false);
    const [editProductDropdownStates, setEditProductDropdownStates] = useState([false]);

    // Initialize form data when selectedEntry changes
    useEffect(() => {
      if (selectedEntry) {
        const initialProducts = initializeProducts(selectedEntry);
        console.log('Setting initial products:', initialProducts); // Debug log
        
        setEditFormData({
          customerId: selectedEntry.customerId || (selectedEntry.customerName ? customersList.find(c => c.name === selectedEntry.customerName)?.id || '' : ''),
          invoiceNumber: selectedEntry.invoiceNumber || '',
          products: initialProducts,
          type: selectedEntry.type || 'refund',
          date: selectedEntry.date || '',
          remarks: selectedEntry.remarks || ''
        });
        setEditProductDropdownStates(initialProducts.map(() => false));
      }
    }, [selectedEntry]);

    // Add new product row
    const addEditProductRow = () => {
      setEditFormData({
        ...editFormData,
        products: [...editFormData.products, { productId: '', unitPrice: '', quantity: '', reason: '' }]
      });
      setEditProductDropdownStates([...editProductDropdownStates, false]);
    };

    // Remove product row
    const removeEditProductRow = (index) => {
      if (editFormData.products.length > 1) {
        const updatedProducts = editFormData.products.filter((_, i) => i !== index);
        const updatedDropdownStates = editProductDropdownStates.filter((_, i) => i !== index);
        setEditFormData({ ...editFormData, products: updatedProducts });
        setEditProductDropdownStates(updatedDropdownStates);
      }
    };

    // Helper function to toggle specific dropdown
    const toggleEditProductDropdown = (index, isOpen) => {
      const updatedStates = [...editProductDropdownStates];
      updatedStates[index] = isOpen;
      setEditProductDropdownStates(updatedStates);
    };

    // Update product in specific row
    const updateEditProductRow = (index, field, value) => {
      const updatedProducts = editFormData.products.map((product, i) => {
        if (i === index) {
          if (field === 'productId') {
            const selectedProduct = productsList.find(p => p.id === value);
            return {
              ...product,
              productId: value,
              unitPrice: selectedProduct ? selectedProduct.price : ''
            };
          } else {
            return { ...product, [field]: value };
          }
        }
        return product;
      });
      setEditFormData({ ...editFormData, products: updatedProducts });
    };

    const handleUpdate = (e) => {
      e.preventDefault();
      if (!editFormData.customerId || !editFormData.invoiceNumber) {
        return;
      }
      
      const validProducts = editFormData.products.filter(p => p.productId && p.quantity && p.unitPrice && p.reason);
      if (validProducts.length === 0) {
        return;
      }
      
      const totalAmount = validProducts.reduce((sum, product) => sum + (parseFloat(product.quantity) * parseFloat(product.unitPrice)), 0);
      const updatedEntry = {
        ...selectedEntry,
        customerId: editFormData.customerId,
        customerName: customersList.find(c => c.id === editFormData.customerId)?.name || '',
        invoiceNumber: editFormData.invoiceNumber,
        products: validProducts,
        // For display compatibility - showing first product
        productName: validProducts[0] ? productsList.find(p => p.id === validProducts[0].productId)?.name : '',
        quantity: validProducts.reduce((sum, product) => sum + parseInt(product.quantity), 0),
        unitPrice: validProducts[0]?.unitPrice || 0,
        totalAmount: totalAmount,
        type: editFormData.type,
        reason: validProducts[0]?.reason || '',
        date: editFormData.date,
        remarks: editFormData.remarks
      };
      
      const updatedEntries = entries.map(entry => 
        entry.id === selectedEntry.id ? updatedEntry : entry
      );
      setEntries(updatedEntries);
      setIsEditModalOpen(false);
      setEditFormData({
        customerId: '',
        invoiceNumber: '',
        products: [{ productId: '', unitPrice: '', quantity: '', reason: '' }],
        type: 'refund',
        date: '',
        remarks: ''
      });
      setEditProductDropdownStates([false]);
      
      // Show update success toast
      toast({
        title: "Updated",
        description: `${updatedEntry.type === 'refund' ? 'Refund' : 'Return'} entry updated successfully`,
        variant: "default",
      });
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerId">Customer *</Label>
            <Popover open={editCustomerOpen} onOpenChange={setEditCustomerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={editCustomerOpen}
                  className="w-full justify-between"
                >
                  {editFormData.customerId 
                    ? customersList.find(c => c.id === editFormData.customerId)?.name 
                    : "Select customer..."}
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
                        onSelect={() => {
                          setEditFormData({ ...editFormData, customerId: customer.id });
                          setEditCustomerOpen(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            editFormData.customerId === customer.id ? "opacity-100" : "opacity-0"
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
            <Label htmlFor="invoiceNumber">Invoice Number *</Label>
            <Input
              id="invoiceNumber"
              value={editFormData.invoiceNumber}
              onChange={(e) => setEditFormData({...editFormData, invoiceNumber: e.target.value})}
              placeholder="Enter invoice number"
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Type *</Label>
            <Select value={editFormData.type} onValueChange={(value) => setEditFormData({...editFormData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="return">Return</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={editFormData.date}
              onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
              required
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Products *</Label>
          
          {editFormData.products.map((product, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end border p-4 rounded-lg">
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
                  placeholder="Qty"
                  value={product.quantity}
                  onChange={(e) => updateEditProductRow(index, 'quantity', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-1">
                <Label>Unit Price *</Label>
                <Input
                  type="number"
                  placeholder="Price"
                  value={product.unitPrice}
                  onChange={(e) => updateEditProductRow(index, 'unitPrice', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-1">
                <Label>Reason *</Label>
                <Select value={product.reason} onValueChange={(value) => updateEditProductRow(index, 'reason', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasonOptions.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          <Input
            id="remarks"
            value={editFormData.remarks}
            onChange={(e) => setEditFormData({...editFormData, remarks: e.target.value})}
            placeholder="Enter remarks"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setIsEditModalOpen(false);
              setEditFormData({
                customerId: '',
                invoiceNumber: '',
                products: [{ productId: '', unitPrice: '', quantity: '', reason: '' }],
                type: 'refund',
                date: '',
                remarks: ''
              });
              setEditProductDropdownStates([false]);
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate}
            disabled={!editFormData.customerId || !editFormData.invoiceNumber || editFormData.products.filter(p => p.productId && p.quantity && p.unitPrice && p.reason).length === 0}
          >
            Update Entry
          </Button>
        </div>
      </div>
    );
  };

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const entryToDelete = entries.find(entry => entry.id === id);
      setEntries(entries.filter(entry => entry.id !== id));
      
      // Show delete success toast
      toast({
        title: "Deleted",
        description: `${entryToDelete?.type === 'refund' ? 'Refund' : 'Return'} entry deleted successfully`,
        variant: "destructive",
      });
    }
  };



  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'completed': return 'success';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'rejected': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getTypeIcon = (type) => {
    return type === 'refund' ? <DollarSign className="h-4 w-4" /> : <ArrowLeftRight className="h-4 w-4" />;
  };



  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-purple-600 text-white px-4 sm:px-6 py-4 rounded-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <ArrowLeftRight className="h-5 w-5 sm:h-6 sm:w-6" />
            <h1 className="text-lg sm:text-xl font-semibold">Refund & Return</h1>
            <span className="hidden lg:inline text-purple-100 text-sm">Manage refunds and returns</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {canPerformAction('sales', 'refundReturn', 'add') && (
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50 text-sm px-3 py-2">
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Entry</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Refund/Return Entry</DialogTitle>
                    <DialogDescription>
                      Create a new refund or return entry with customer and multiple product details.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateEntryForm />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Entries</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{entries.length}</p>
            </div>
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {entries.filter(e => e.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {entries.filter(e => e.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {entries.filter(e => e.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-gray-500" />
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
                placeholder="Search entries..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
              <SelectItem value="return">Return</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Refund & Return Entries</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entry ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              {(canPerformAction('sales', 'refundReturn', 'edit') || canPerformAction('sales', 'refundReturn', 'delete')) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.id}</TableCell>
                <TableCell>{entry.customerName}</TableCell>
                <TableCell>{entry.invoiceNumber}</TableCell>
                <TableCell>{entry.productName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    {getTypeIcon(entry.type)}
                    {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>${entry.totalAmount}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(entry.status)} className="flex items-center gap-1 w-fit">
                    {getStatusIcon(entry.status)}
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{entry.date}</TableCell>
                {(canPerformAction('sales', 'refundReturn', 'edit') || canPerformAction('sales', 'refundReturn', 'delete')) && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(entry)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        {canPerformAction('sales', 'refundReturn', 'edit') && (
                          <DropdownMenuItem onClick={() => handleEdit(entry)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {canPerformAction('sales', 'refundReturn', 'delete') && (
                          <DropdownMenuItem onClick={() => handleDelete(entry.id)}>
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
        <DialogContent className="max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Refund/Return Entry</DialogTitle>
            <DialogDescription>
              Edit the refund or return entry with customer and multiple product details.
            </DialogDescription>
          </DialogHeader>
          <EditEntryForm selectedEntry={selectedEntry} />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Entry Details</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Entry ID</Label>
                  <p className="text-sm font-medium">{selectedEntry.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Customer</Label>
                  <p className="text-sm font-medium">{selectedEntry.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Invoice Number</Label>
                  <p className="text-sm font-medium">{selectedEntry.invoiceNumber}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-500">Products</Label>
                  {selectedEntry.products && selectedEntry.products.length > 0 ? (
                    <div className="space-y-2 mt-1">
                      {selectedEntry.products.map((product, index) => {
                        const productInfo = productsList.find(p => p.id === product.productId);
                        return (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm">
                            <p className="font-medium">{productInfo?.name || 'Unknown Product'}</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              Qty: {product.quantity} | Price: ${product.unitPrice} | Reason: {product.reason}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm font-medium">{selectedEntry.productName}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Type</Label>
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    {getTypeIcon(selectedEntry.type)}
                    {selectedEntry.type.charAt(0).toUpperCase() + selectedEntry.type.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge variant={getStatusVariant(selectedEntry.status)} className="flex items-center gap-1 w-fit">
                    {getStatusIcon(selectedEntry.status)}
                    {selectedEntry.status.charAt(0).toUpperCase() + selectedEntry.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Quantity</Label>
                  <p className="text-sm font-medium">{selectedEntry.quantity}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Unit Price</Label>
                  <p className="text-sm font-medium">${selectedEntry.unitPrice}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                  <p className="text-sm font-medium">${selectedEntry.totalAmount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date</Label>
                  <p className="text-sm font-medium">{selectedEntry.date}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Reason</Label>
                  <p className="text-sm font-medium">{selectedEntry.reason}</p>
                </div>
                {selectedEntry.processedDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Processed Date</Label>
                    <p className="text-sm font-medium">{selectedEntry.processedDate}</p>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Remarks</Label>
                <p className="text-sm">{selectedEntry.remarks}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RefundReturn;