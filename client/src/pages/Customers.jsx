import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useActionPermissions } from '@/components/permissions/ActionButton';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Building,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  TrendingUp,
  CreditCard,
  UserCheck,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

// Dummy customer data with comprehensive details
const dummyCustomers = [
  {
    id: 'C001',
    name: 'ABC Manufacturing Ltd',
    contactPerson: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@abcmfg.com',
    address: '123 Industrial Area, Phase 1, Mumbai, Maharashtra - 400001',
    gst: '27ABCDE1234F1Z5',
    category: 'Premium',
    creditLimit: 500000,
    outstandingAmount: 125000,
    status: 'Active',
    registrationDate: '2024-01-15',
    lastOrderDate: '2025-01-05',
    totalOrders: 45,
    totalValue: 2500000
  },
  {
    id: 'C002',
    name: 'XYZ Industries Corp',
    contactPerson: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya@xyzind.com',
    address: '456 Tech Park, Building B2, Pune, Maharashtra - 411001',
    gst: '27XYZAB5678G2W4',
    category: 'Standard',
    creditLimit: 300000,
    outstandingAmount: 75000,
    status: 'Active',
    registrationDate: '2024-02-20',
    lastOrderDate: '2025-01-03',
    totalOrders: 32,
    totalValue: 1800000
  },
  {
    id: 'C003',
    name: 'PQR Steel Works',
    contactPerson: 'Amit Patel',
    phone: '+91 76543 21098',
    email: 'amit@pqrsteel.com',
    address: '789 Steel Complex, Sector 5, Ahmedabad, Gujarat - 380001',
    gst: '24PQRST9012H3V6',
    category: 'Premium',
    creditLimit: 750000,
    outstandingAmount: 200000,
    status: 'Active',
    registrationDate: '2023-11-10',
    lastOrderDate: '2025-01-04',
    totalOrders: 58,
    totalValue: 3200000
  },
  {
    id: 'C004',
    name: 'Global Enterprises',
    contactPerson: 'Sunita Joshi',
    phone: '+91 65432 10987',
    email: 'sunita@globalent.com',
    address: '321 Business District, Zone 1, Delhi, Delhi - 110001',
    gst: '07GLOBAL345I9Z1',
    category: 'Standard',
    creditLimit: 400000,
    outstandingAmount: 0,
    status: 'Active',
    registrationDate: '2024-03-15',
    lastOrderDate: '2024-12-28',
    totalOrders: 28,
    totalValue: 1600000
  },
  {
    id: 'C005',
    name: 'Tech Solutions Pvt Ltd',
    contactPerson: 'Ravi Gupta',
    phone: '+91 54321 09876',
    email: 'ravi@techsol.com',
    address: '654 IT Hub, Area 4, Gurgaon, Haryana - 122001',
    gst: '06TECHSO678K2L3',
    category: 'Standard',
    creditLimit: 250000,
    outstandingAmount: 45000,
    status: 'Inactive',
    registrationDate: '2024-05-20',
    lastOrderDate: '2024-11-15',
    totalOrders: 15,
    totalValue: 850000
  },
  {
    id: 'C006',
    name: 'Prime Industries Ltd',
    contactPerson: 'Kavita Singh',
    phone: '+91 43210 98765',
    email: 'kavita@primeind.com',
    address: '987 Industrial Zone, Sector 5, Noida, Uttar Pradesh - 201301',
    gst: '09PRIMEI234M5N6',
    category: 'Premium',
    creditLimit: 600000,
    outstandingAmount: 150000,
    status: 'Active',
    registrationDate: '2023-09-12',
    lastOrderDate: '2025-01-02',
    totalOrders: 42,
    totalValue: 2800000
  },
  {
    id: 'C007',
    name: 'GHI Chemicals Corp',
    contactPerson: 'Rahul Mehta',
    phone: '+91 32109 87654',
    email: 'rahul@ghichem.com',
    address: '147 Chemical Complex, Wing A, Vadodara, Gujarat - 390001',
    gst: '24GHICHE567O8P9',
    category: 'Standard',
    creditLimit: 350000,
    outstandingAmount: 80000,
    status: 'Active',
    registrationDate: '2024-01-30',
    lastOrderDate: '2025-01-01',
    totalOrders: 25,
    totalValue: 1400000
  },
  {
    id: 'C008',
    name: 'JKL Food Processing',
    contactPerson: 'Anita Reddy',
    phone: '+91 21098 76543',
    email: 'anita@jklfood.com',
    address: '258 Food Park, Unit 8, Indore, Madhya Pradesh - 452001',
    gst: '23JKLFOO890Q1R2',
    category: 'Standard',
    creditLimit: 200000,
    outstandingAmount: 25000,
    status: 'Suspended',
    registrationDate: '2024-04-10',
    lastOrderDate: '2024-12-10',
    totalOrders: 18,
    totalValue: 950000
  },
  {
    id: 'C009',
    name: 'MNO Pharmaceuticals',
    contactPerson: 'Suresh Iyer',
    phone: '+91 10987 65432',
    email: 'suresh@mnopharma.com',
    address: '369 Pharma City, Tower B, Hyderabad, Telangana - 500038',
    gst: '36MNOPHI123S4T5',
    category: 'Premium',
    creditLimit: 800000,
    outstandingAmount: 300000,
    status: 'Active',
    registrationDate: '2023-08-25',
    lastOrderDate: '2024-12-30',
    totalOrders: 52,
    totalValue: 3500000
  },
  {
    id: 'C010',
    name: 'RST Construction Ltd',
    contactPerson: 'Meera Nair',
    phone: '+91 09876 54321',
    email: 'meera@rstconstruction.com',
    address: '741 Construction Hub, Block 7, Chennai, Tamil Nadu - 600001',
    gst: '33RSTCON456U7V8',
    category: 'Standard',
    creditLimit: 450000,
    outstandingAmount: 120000,
    status: 'Active',
    registrationDate: '2024-06-05',
    lastOrderDate: '2024-12-25',
    totalOrders: 30,
    totalValue: 1750000
  }
];

export default function Customers() {
  // Permission hooks
  const permissions = useActionPermissions('customers', 'allCustomers');
  
  // Get user role from auth context
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [customers, setCustomers] = useState(dummyCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
                You don't have permission to view Customers module.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gst: '',
    category: 'Standard',
    creditLimit: '',
    status: 'Active'
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || customer.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Premium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Standard': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      gst: '',
      category: 'Standard',
      creditLimit: '',
      status: 'Active'
    });
  };

  const handleCreate = () => {
    const newCustomer = {
      id: `C${String(customers.length + 1).padStart(3, '0')}`,
      ...formData,
      creditLimit: parseFloat(formData.creditLimit) || 0,
      outstandingAmount: 0,
      registrationDate: new Date().toISOString().split('T')[0],
      lastOrderDate: null,
      totalOrders: 0,
      totalValue: 0
    };
    setCustomers([...customers, newCustomer]);
    setIsCreateModalOpen(false);
    resetForm();
    toast({
      title: "Success",
      description: "Customer created successfully",
    });
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      contactPerson: customer.contactPerson,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      gst: customer.gst,
      category: customer.category,
      creditLimit: customer.creditLimit.toString(),
      status: customer.status
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    const updatedCustomers = customers.map(customer =>
      customer.id === selectedCustomer.id
        ? { ...customer, ...formData, creditLimit: parseFloat(formData.creditLimit) || 0 }
        : customer
    );
    setCustomers(updatedCustomers);
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
    resetForm();
    toast({
      title: "Success",
      description: "Customer updated successfully",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    }
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  const handleStatusUpdate = (customerId, newStatus) => {
    const updatedCustomers = customers.map(customer =>
      customer.id === customerId
        ? { ...customer, status: newStatus }
        : customer
    );
    setCustomers(updatedCustomers);
    toast({
      title: "Success",
      description: `Customer status updated to ${newStatus}`,
    });
  };

  const CustomerForm = ({ title, onSubmit, submitText }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Company Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter company name"
          />
        </div>
        <div>
          <Label htmlFor="contactPerson">Contact Person *</Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            placeholder="Enter contact person name"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Enter complete address"
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="gst">GST Number</Label>
          <Input
            id="gst"
            value={formData.gst}
            onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
            placeholder="Enter GST number"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="creditLimit">Credit Limit</Label>
          <Input
            id="creditLimit"
            type="number"
            value={formData.creditLimit}
            onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
            placeholder="Enter credit limit"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => {
          if (title === 'Create Customer') {
            setIsCreateModalOpen(false);
          } else {
            setIsEditModalOpen(false);
          }
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>{submitText}</Button>
      </div>
    </div>
  );

  // Stats calculations
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const premiumCustomers = customers.filter(c => c.category === 'Premium').length;
  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstandingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold">Customers</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {permissions.canAdd && (
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Customer</DialogTitle>
                </DialogHeader>
                <CustomerForm
                  title="Create Customer"
                  onSubmit={handleCreate}
                  submitText="Create Customer"
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Premium</p>
                <p className="text-2xl font-bold">{premiumCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold">₹{totalOutstanding.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">GST</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Outstanding</TableHead>
                  {(permissions.canEdit || permissions.canDelete || permissions.canView) && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Building className="h-8 w-8 text-gray-400" />
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.contactPerson}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {customer.gst}
                      </code>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className={getCategoryColor(customer.category)}>
                        {customer.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(customer.status)}>
                        {customer.status === 'Active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {customer.status === 'Inactive' && <Clock className="w-3 h-3 mr-1" />}
                        {customer.status === 'Suspended' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className={customer.outstandingAmount > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                        ₹{customer.outstandingAmount.toLocaleString()}
                      </span>
                    </TableCell>
                    {(permissions.canEdit || permissions.canDelete || permissions.canView) && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {permissions.canView && (
                              <DropdownMenuItem onClick={() => handleView(customer)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            )}
                            {permissions.canEdit && (
                              <>
                                <DropdownMenuItem onClick={() => handleEdit(customer)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(customer.id, customer.status === 'Active' ? 'Inactive' : 'Active')}>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  {customer.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </DropdownMenuItem>
                              </>
                            )}
                            {permissions.canDelete && (
                              <DropdownMenuItem 
                                onClick={() => handleDelete(customer.id)}
                                className="text-red-600"
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
          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No customers found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Get started by creating your first customer.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm
            title="Edit Customer"
            onSubmit={handleUpdate}
            submitText="Update Customer"
          />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Company Name</Label>
                      <p className="text-sm">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Contact Person</Label>
                      <p className="text-sm">{selectedCustomer.contactPerson}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">GST Number</Label>
                      <p className="text-sm font-mono">{selectedCustomer.gst}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                      <Badge className={getCategoryColor(selectedCustomer.category)}>
                        {selectedCustomer.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="text-sm">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-sm">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                      <p className="text-sm">{selectedCustomer.address}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant={getStatusVariant(selectedCustomer.status)}>
                        {selectedCustomer.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Credit Limit</Label>
                      <p className="text-sm font-medium">₹{selectedCustomer.creditLimit.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Outstanding Amount</Label>
                      <p className={`text-sm font-medium ${selectedCustomer.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{selectedCustomer.outstandingAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Total Value</Label>
                      <p className="text-sm font-medium">₹{selectedCustomer.totalValue.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Total Orders</Label>
                      <p className="text-sm font-medium">{selectedCustomer.totalOrders}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Registration Date</Label>
                      <p className="text-sm">{new Date(selectedCustomer.registrationDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Last Order</Label>
                      <p className="text-sm">
                        {selectedCustomer.lastOrderDate 
                          ? new Date(selectedCustomer.lastOrderDate).toLocaleDateString()
                          : 'No orders yet'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}