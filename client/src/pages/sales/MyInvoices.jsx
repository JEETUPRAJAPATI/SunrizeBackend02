import React, { useState } from 'react';
import { ActionButton, useActionPermissions } from '@/components/permissions/ActionButton';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  DollarSign,
  Calendar,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  FileCheck,
  ChevronsUpDown,
  Check
} from 'lucide-react';

// Dummy invoice data
const dummyInvoices = [
  {
    id: 'INV-2025-001',
    customerName: 'ABC Manufacturing Ltd',
    customerEmail: 'rajesh@abcmfg.com',
    orderNo: 'ORD-2025-001',
    invoiceDate: '2025-01-07',
    dueDate: '2025-02-06',
    amount: 125000,
    paidAmount: 125000,
    balanceAmount: 0,
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    items: [
      { name: 'Steel Rods', quantity: 50, rate: 2000, amount: 100000 },
      { name: 'Iron Sheets', quantity: 25, rate: 1000, amount: 25000 }
    ],
    gstAmount: 22500,
    totalAmount: 147500,
    paymentDate: '2025-01-15',
    notes: 'Payment received on time',
    createdAt: '2025-01-07'
  },
  {
    id: 'INV-2025-002',
    customerName: 'XYZ Industries Corp',
    customerEmail: 'priya@xyzind.com',
    orderNo: 'ORD-2025-002',
    invoiceDate: '2025-01-08',
    dueDate: '2025-02-07',
    amount: 85000,
    paidAmount: 50000,
    balanceAmount: 35000,
    status: 'Partially Paid',
    paymentMethod: 'Cheque',
    items: [
      { name: 'Electronic Components', quantity: 100, rate: 750, amount: 75000 },
      { name: 'Circuit Boards', quantity: 15, rate: 667, amount: 10000 }
    ],
    gstAmount: 15300,
    totalAmount: 100300,
    paymentDate: null,
    notes: 'Partial payment received',
    createdAt: '2025-01-08'
  },
  {
    id: 'INV-2025-003',
    customerName: 'PQR Steel Works',
    customerEmail: 'amit@pqrsteel.com',
    orderNo: 'ORD-2025-003',
    invoiceDate: '2025-01-09',
    dueDate: '2025-02-08',
    amount: 250000,
    paidAmount: 0,
    balanceAmount: 250000,
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
    items: [
      { name: 'Heavy Machinery Parts', quantity: 8, rate: 25000, amount: 200000 },
      { name: 'Steel Pipes', quantity: 200, rate: 250, amount: 50000 }
    ],
    gstAmount: 45000,
    totalAmount: 295000,
    paymentDate: null,
    notes: 'Awaiting payment',
    createdAt: '2025-01-09'
  },
  {
    id: 'INV-2025-004',
    customerName: 'LMN Auto Parts',
    customerEmail: 'sneha@lmnauto.com',
    orderNo: 'ORD-2025-004',
    invoiceDate: '2025-01-08',
    dueDate: '2025-02-07',
    amount: 75000,
    paidAmount: 75000,
    balanceAmount: 0,
    status: 'Paid',
    paymentMethod: 'UPI',
    items: [
      { name: 'Car Engine Parts', quantity: 30, rate: 2000, amount: 60000 },
      { name: 'Brake Pads', quantity: 60, rate: 250, amount: 15000 }
    ],
    gstAmount: 13500,
    totalAmount: 88500,
    paymentDate: '2025-01-12',
    notes: 'Quick payment via UPI',
    createdAt: '2025-01-08'
  },
  {
    id: 'INV-2025-005',
    customerName: 'RST Electronics',
    customerEmail: 'vikram@rstelectronics.com',
    orderNo: 'ORD-2025-005',
    invoiceDate: '2025-01-10',
    dueDate: '2025-02-09',
    amount: 45000,
    paidAmount: 0,
    balanceAmount: 45000,
    status: 'Overdue',
    paymentMethod: 'Bank Transfer',
    items: [
      { name: 'LED Displays', quantity: 20, rate: 2000, amount: 40000 },
      { name: 'Control Panels', quantity: 10, rate: 500, amount: 5000 }
    ],
    gstAmount: 8100,
    totalAmount: 53100,
    paymentDate: null,
    notes: 'Payment overdue',
    createdAt: '2025-01-10'
  },
  {
    id: 'INV-2025-006',
    customerName: 'DEF Textiles Ltd',
    customerEmail: 'kavya@deftextiles.com',
    orderNo: 'ORD-2025-006',
    invoiceDate: '2025-01-09',
    dueDate: '2025-02-08',
    amount: 195000,
    paidAmount: 100000,
    balanceAmount: 95000,
    status: 'Partially Paid',
    paymentMethod: 'Bank Transfer',
    items: [
      { name: 'Textile Machinery', quantity: 3, rate: 60000, amount: 180000 },
      { name: 'Raw Materials', quantity: 500, rate: 30, amount: 15000 }
    ],
    gstAmount: 35100,
    totalAmount: 230100,
    paymentDate: null,
    notes: 'First installment received',
    createdAt: '2025-01-09'
  },
  {
    id: 'INV-2025-007',
    customerName: 'GHI Chemicals',
    customerEmail: 'rahul@ghichem.com',
    orderNo: 'ORD-2025-007',
    invoiceDate: '2025-01-11',
    dueDate: '2025-02-10',
    amount: 180000,
    paidAmount: 0,
    balanceAmount: 180000,
    status: 'Pending',
    paymentMethod: 'Cheque',
    items: [
      { name: 'Chemical Containers', quantity: 25, rate: 6000, amount: 150000 },
      { name: 'Safety Equipment', quantity: 40, rate: 750, amount: 30000 }
    ],
    gstAmount: 32400,
    totalAmount: 212400,
    paymentDate: null,
    notes: 'Cheque expected this week',
    createdAt: '2025-01-11'
  },
  {
    id: 'INV-2025-008',
    customerName: 'JKL Food Processing',
    customerEmail: 'anita@jklfood.com',
    orderNo: 'ORD-2025-008',
    invoiceDate: '2025-01-10',
    dueDate: '2025-02-09',
    amount: 120000,
    paidAmount: 0,
    balanceAmount: 120000,
    status: 'Cancelled',
    paymentMethod: 'Bank Transfer',
    items: [
      { name: 'Food Processing Equipment', quantity: 5, rate: 20000, amount: 100000 },
      { name: 'Packaging Materials', quantity: 1000, rate: 20, amount: 20000 }
    ],
    gstAmount: 21600,
    totalAmount: 141600,
    paymentDate: null,
    notes: 'Invoice cancelled due to order cancellation',
    createdAt: '2025-01-10'
  },
  {
    id: 'INV-2025-009',
    customerName: 'MNO Pharmaceuticals',
    customerEmail: 'suresh@mnopharma.com',
    orderNo: 'ORD-2025-009',
    invoiceDate: '2025-01-12',
    dueDate: '2025-02-11',
    amount: 220000,
    paidAmount: 0,
    balanceAmount: 220000,
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
    items: [
      { name: 'Medical Equipment', quantity: 12, rate: 15000, amount: 180000 },
      { name: 'Lab Supplies', quantity: 200, rate: 200, amount: 40000 }
    ],
    gstAmount: 39600,
    totalAmount: 259600,
    paymentDate: null,
    notes: 'Corporate payment process initiated',
    createdAt: '2025-01-12'
  },
  {
    id: 'INV-2025-010',
    customerName: 'PQR Construction',
    customerEmail: 'meera@pqrconstruction.com',
    orderNo: 'ORD-2025-010',
    invoiceDate: '2025-01-09',
    dueDate: '2025-02-08',
    amount: 95000,
    paidAmount: 95000,
    balanceAmount: 0,
    status: 'Paid',
    paymentMethod: 'RTGS',
    items: [
      { name: 'Construction Materials', quantity: 100, rate: 800, amount: 80000 },
      { name: 'Tools', quantity: 25, rate: 600, amount: 15000 }
    ],
    gstAmount: 17100,
    totalAmount: 112100,
    paymentDate: '2025-01-11',
    notes: 'RTGS payment received',
    createdAt: '2025-01-09'
  }
];

// Dummy customer data for searchable dropdown
const dummyCustomers = [
  { id: 'C001', name: 'ABC Manufacturing Ltd', email: 'rajesh@abcmfg.com' },
  { id: 'C002', name: 'XYZ Industries', email: 'priya@xyzind.com' },
  { id: 'C003', name: 'DEF Electronics', email: 'amit@defelec.com' },
  { id: 'C004', name: 'Global Enterprises', email: 'sunita@globalent.com' },
  { id: 'C005', name: 'Tech Solutions', email: 'ravi@techsol.com' },
  { id: 'C006', name: 'Prime Industries', email: 'kavita@primeind.com' },
  { id: 'C007', name: 'GHI Chemicals', email: 'rahul@ghichem.com' },
  { id: 'C008', name: 'JKL Food Processing', email: 'anita@jklfood.com' },
  { id: 'C009', name: 'MNO Pharmaceuticals', email: 'suresh@mnopharma.com' },
  { id: 'C010', name: 'PQR Construction', email: 'meera@pqrconstruction.com' }
];

export default function MyInvoices() {
  // Permission hooks
  const permissions = useActionPermissions('sales', 'myInvoices');
  
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Early return if no view permission
  if (!permissions.canView) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Access Denied
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have permission to view My Invoices module.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    orderNo: '',
    invoiceDate: '',
    dueDate: '',
    amount: '',
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
    notes: ''
  });

  // Searchable dropdown state
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.orderNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || invoice.paymentMethod === paymentMethodFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const today = new Date();
      const invoiceDate = new Date(invoice.invoiceDate);
      
      switch (dateFilter) {
        case 'today':
          matchesDate = invoiceDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          matchesDate = invoiceDate >= weekAgo && invoiceDate <= today;
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          matchesDate = invoiceDate >= monthAgo && invoiceDate <= today;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDate;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Partially Paid': return 'secondary';
      case 'Pending': return 'outline';
      case 'Overdue': return 'destructive';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="h-4 w-4" />;
      case 'Partially Paid': return <Clock className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Overdue': return <AlertCircle className="h-4 w-4" />;
      case 'Cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      orderNo: '',
      invoiceDate: '',
      dueDate: '',
      amount: '',
      paymentMethod: 'Bank Transfer',
      status: 'Pending',
      notes: ''
    });
  };

  const handleCreate = () => {
    const newInvoice = {
      id: `INV-2025-${(invoices.length + 1).toString().padStart(3, '0')}`,
      ...formData,
      status: 'Pending', // Default status for new invoices
      amount: parseFloat(formData.amount) || 0,
      paidAmount: 0,
      balanceAmount: parseFloat(formData.amount) || 0,
      items: [],
      gstAmount: (parseFloat(formData.amount) || 0) * 0.18,
      totalAmount: (parseFloat(formData.amount) || 0) * 1.18,
      paymentDate: null,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInvoices([...invoices, newInvoice]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail,
      orderNo: invoice.orderNo,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      amount: invoice.amount.toString(),
      paymentMethod: invoice.paymentMethod,
      status: invoice.status,
      notes: invoice.notes
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    const updatedInvoices = invoices.map(invoice =>
      invoice.id === selectedInvoice.id
        ? {
            ...invoice,
            ...formData,
            amount: parseFloat(formData.amount) || 0,
            balanceAmount: parseFloat(formData.amount) - invoice.paidAmount,
            gstAmount: (parseFloat(formData.amount) || 0) * 0.18,
            totalAmount: (parseFloat(formData.amount) || 0) * 1.18
          }
        : invoice
    );
    setInvoices(updatedInvoices);
    setIsEditModalOpen(false);
    setSelectedInvoice(null);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(invoice => invoice.id !== id));
    }
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  // Create form with isolated state to fix input focus issue
  const CreateInvoiceForm = () => {
    const [localFormData, setLocalFormData] = useState({
      customerName: '',
      customerEmail: '',
      orderNo: '',
      amount: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      paymentMethod: 'Bank Transfer',
      notes: ''
    });

    const handleSubmit = () => {
      if (!localFormData.customerName || !localFormData.orderNo || !localFormData.amount) {
        return;
      }
      
      const newInvoice = {
        id: `INV${(invoices.length + 1).toString().padStart(3, '0')}`,
        ...localFormData,
        status: 'Pending',
        totalAmount: parseFloat(localFormData.amount),
        paidAmount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setInvoices([...invoices, newInvoice]);
      setIsCreateModalOpen(false);
    };

    return <InvoiceFormUI formData={localFormData} setFormData={setLocalFormData} onSubmit={handleSubmit} onCancel={() => setIsCreateModalOpen(false)} submitText="Create Invoice" />;
  };

  // Edit form using existing formData state
  const EditInvoiceForm = () => (
    <InvoiceFormUI formData={formData} setFormData={setFormData} onSubmit={handleUpdate} onCancel={() => { setIsEditModalOpen(false); resetForm(); }} submitText="Update Invoice" />
  );

  const InvoiceFormUI = ({ formData, setFormData, onSubmit, onCancel, submitText }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Customer Name *</Label>
          <Popover open={customerSearchOpen} onOpenChange={setCustomerSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={customerSearchOpen}
                className="w-full justify-between"
              >
                {formData.customerName || "Select customer..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search customers..." />
                <CommandEmpty>No customer found.</CommandEmpty>
                <CommandGroup>
                  {dummyCustomers.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={customer.name}
                      onSelect={(currentValue) => {
                        const selectedCustomer = dummyCustomers.find(c => c.name.toLowerCase() === currentValue.toLowerCase());
                        if (selectedCustomer) {
                          setFormData({ 
                            ...formData, 
                            customerName: selectedCustomer.name,
                            customerEmail: selectedCustomer.email
                          });
                        }
                        setCustomerSearchOpen(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          formData.customerName === customer.name ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{customer.name}</span>
                        <span className="text-sm text-muted-foreground">{customer.email}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="customerEmail">Customer Email</Label>
          <Input
            id="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            placeholder="Enter customer email"
          />
        </div>
        <div>
          <Label htmlFor="orderNo">Order Number *</Label>
          <Input
            id="orderNo"
            value={formData.orderNo}
            onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
            placeholder="Enter order number"
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="Enter invoice amount"
          />
        </div>
        <div>
          <Label htmlFor="invoiceDate">Invoice Date *</Label>
          <Input
            id="invoiceDate"
            type="date"
            value={formData.invoiceDate}
            onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Cheque">Cheque</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="RTGS">RTGS</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Partially Paid">Partially Paid</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Enter invoice notes"
            rows={3}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onSubmit} disabled={!formData.customerName || !formData.orderNo || !formData.amount}>
          {submitText}
        </Button>
      </div>
    </div>
  );

  // Calculate stats
  const stats = {
    total: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    paid: invoices.filter(inv => inv.status === 'Paid').length,
    pending: invoices.filter(inv => inv.status === 'Pending').length,
    overdue: invoices.filter(inv => inv.status === 'Overdue').length
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Responsive Header */}
      <div className="bg-purple-600 text-white px-4 sm:px-6 py-4 rounded-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
            <h1 className="text-lg sm:text-xl font-semibold">My Invoices</h1>
            <span className="hidden lg:inline text-purple-100 text-sm">Generate and track invoices</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm px-3 py-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <ActionButton 
                  module="sales" 
                  feature="myInvoices" 
                  action="add"
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-purple-50 text-sm px-3 py-2"
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Create Invoice</span>
                </ActionButton>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>
                    Create a new invoice with customer details and payment information.
                  </DialogDescription>
                </DialogHeader>
                <CreateInvoiceForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoices</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">₹{(stats.totalAmount / 100000).toFixed(1)}L</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="RTGS">RTGS</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Details</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order Info</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  {(permissions.canView || permissions.canEdit || permissions.canDelete) && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.id}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {invoice.invoiceDate}
                        </div>
                        <div className="text-sm text-gray-500">
                          Due: {invoice.dueDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.customerName}</div>
                        <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.orderNo}</div>
                        <div className="text-sm text-gray-500">{invoice.items?.length || 0} items</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">₹{invoice.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Base: ₹{invoice.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">GST: ₹{invoice.gstAmount.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-green-600">₹{invoice.paidAmount.toLocaleString()}</div>
                        <div className="text-sm text-orange-600">Balance: ₹{invoice.balanceAmount.toLocaleString()}</div>
                        <Badge variant="outline" className="mt-1">{invoice.paymentMethod}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(invoice.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    {(permissions.canView || permissions.canEdit || permissions.canDelete) && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {permissions.canView && (
                              <DropdownMenuItem onClick={() => handleView(invoice)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            )}
                            {permissions.canView && (
                              <DropdownMenuItem onClick={() => console.log('Download invoice:', invoice.id)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                            )}
                            {permissions.canEdit && (
                              <DropdownMenuItem onClick={() => handleEdit(invoice)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {permissions.canDelete && (
                              <DropdownMenuItem 
                                onClick={() => handleDelete(invoice.id)}
                                className="text-destructive"
                              >
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
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Invoice - {selectedInvoice?.id}</DialogTitle>
            <DialogDescription>
              Update invoice details and modify payment information.
            </DialogDescription>
          </DialogHeader>
          <EditInvoiceForm />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              View complete invoice information and payment status.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Invoice ID</Label>
                  <p className="text-sm font-medium">{selectedInvoice.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Order Number</Label>
                  <p className="text-sm font-medium">{selectedInvoice.orderNo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Customer</Label>
                  <p className="text-sm font-medium">{selectedInvoice.customerName}</p>
                  <p className="text-sm text-gray-500">{selectedInvoice.customerEmail}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Payment Method</Label>
                  <Badge variant="outline">{selectedInvoice.paymentMethod}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Invoice Date</Label>
                  <p className="text-sm font-medium">{selectedInvoice.invoiceDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Due Date</Label>
                  <p className="text-sm font-medium">{selectedInvoice.dueDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Base Amount</Label>
                  <p className="text-sm font-medium">₹{selectedInvoice.amount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">GST Amount</Label>
                  <p className="text-sm font-medium">₹{selectedInvoice.gstAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                  <p className="text-sm font-medium text-lg">₹{selectedInvoice.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Paid Amount</Label>
                  <p className="text-sm font-medium text-green-600">₹{selectedInvoice.paidAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Balance Amount</Label>
                  <p className="text-sm font-medium text-orange-600">₹{selectedInvoice.balanceAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge variant={getStatusVariant(selectedInvoice.status)} className="flex items-center gap-1 w-fit">
                    {getStatusIcon(selectedInvoice.status)}
                    {selectedInvoice.status}
                  </Badge>
                </div>
                {selectedInvoice.paymentDate && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">Payment Date</Label>
                    <p className="text-sm font-medium text-green-600">{selectedInvoice.paymentDate}</p>
                  </div>
                )}
                {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">Items</Label>
                    <div className="space-y-1">
                      {selectedInvoice.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} ({item.quantity})</span>
                          <span>₹{item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedInvoice.notes && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">Notes</Label>
                    <p className="text-sm">{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}