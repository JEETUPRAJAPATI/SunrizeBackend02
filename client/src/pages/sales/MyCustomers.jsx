import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Dummy customer data
const dummyCustomers = [
  {
    id: 'C001',
    name: 'ABC Manufacturing Ltd',
    contactPerson: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@abcmfg.com',
    address: '123 Industrial Area, Phase 1',
    area: 'Industrial Zone A',
    route: 'Route 1',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    gst: '27ABCDE1234F1Z5',
    category: 'Premium',
    creditLimit: 500000,
    outstandingAmount: 125000,
    status: 'Active',
    registrationDate: '2024-01-15',
    lastOrderDate: '2025-01-05'
  },
  {
    id: 'C002',
    name: 'XYZ Industries Corp',
    contactPerson: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya@xyzind.com',
    address: '456 Tech Park, Building B2',
    area: 'Tech Park B',
    route: 'Route 2',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    gst: '27XYZAB5678G2W4',
    category: 'Standard',
    creditLimit: 300000,
    outstandingAmount: 75000,
    status: 'Active',
    registrationDate: '2024-02-20',
    lastOrderDate: '2025-01-03'
  },
  {
    id: 'C003',
    name: 'PQR Steel Works',
    contactPerson: 'Amit Patel',
    phone: '+91 76543 21098',
    email: 'amit@pqrsteel.com',
    address: '789 Steel Complex, Sector 5',
    area: 'Industrial Sector 5',
    route: 'Route 3',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380001',
    gst: '24PQRST9012H3Y6',
    category: 'Premium',
    creditLimit: 750000,
    outstandingAmount: 200000,
    status: 'Active',
    registrationDate: '2024-03-10',
    lastOrderDate: '2025-01-01'
  },
  {
    id: 'C004',
    name: 'LMN Auto Parts',
    contactPerson: 'Sneha Reddy',
    phone: '+91 65432 10987',
    email: 'sneha@lmnauto.com',
    address: '321 Auto Hub, Unit 12',
    area: 'Auto Hub',
    route: 'Route 1',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    gst: '36LMNOP3456K1U8',
    category: 'Standard',
    creditLimit: 400000,
    outstandingAmount: 150000,
    status: 'Active',
    registrationDate: '2024-04-05',
    lastOrderDate: '2024-12-30'
  },
  {
    id: 'C005',
    name: 'RST Electronics',
    contactPerson: 'Vikram Singh',
    phone: '+91 54321 09876',
    email: 'vikram@rstelectronics.com',
    address: '654 Electronics Mall, Floor 3',
    area: 'Electronics District',
    route: 'Route 2',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    gst: '29RSTUV6789L2V9',
    category: 'Basic',
    creditLimit: 200000,
    outstandingAmount: 45000,
    status: 'Active',
    registrationDate: '2024-05-12',
    lastOrderDate: '2024-12-28'
  },
  {
    id: 'C006',
    name: 'DEF Textiles Ltd',
    contactPerson: 'Kavya Nair',
    phone: '+91 43210 98765',
    email: 'kavya@deftextiles.com',
    address: '987 Textile Park, Block C',
    area: 'Textile Zone',
    route: 'Route 3',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641001',
    gst: '33DEFGH7890M3X1',
    category: 'Standard',
    creditLimit: 350000,
    outstandingAmount: 95000,
    status: 'Active',
    registrationDate: '2024-06-18',
    lastOrderDate: '2024-12-29'
  },
  {
    id: 'C007',
    name: 'GHI Chemicals',
    contactPerson: 'Rahul Joshi',
    phone: '+91 32109 87654',
    email: 'rahul@ghichem.com',
    address: '147 Chemical Complex, Wing A',
    area: 'Chemical Zone',
    route: 'Route 1',
    city: 'Vadodara',
    state: 'Gujarat',
    pincode: '390001',
    gst: '24GHIJK8901N4Y2',
    category: 'Premium',
    creditLimit: 600000,
    outstandingAmount: 180000,
    status: 'Active',
    registrationDate: '2024-07-25',
    lastOrderDate: '2024-12-31'
  },
  {
    id: 'C008',
    name: 'JKL Food Processing',
    contactPerson: 'Anita Gupta',
    phone: '+91 21098 76543',
    email: 'anita@jklfood.com',
    address: '258 Food Park, Unit 8',
    area: 'Food Processing Zone',
    route: 'Route 2',
    city: 'Indore',
    state: 'Madhya Pradesh',
    pincode: '452001',
    gst: '23JKLMN9012O5Z3',
    category: 'Standard',
    creditLimit: 280000,
    outstandingAmount: 65000,
    status: 'Active',
    registrationDate: '2024-08-30',
    lastOrderDate: '2024-12-27'
  },
  {
    id: 'C009',
    name: 'MNO Pharmaceuticals',
    contactPerson: 'Dr. Suresh Kumar',
    phone: '+91 10987 65432',
    email: 'suresh@mnopharma.com',
    address: '369 Pharma City, Tower B',
    area: 'Pharma District',
    route: 'Route 3',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500038',
    gst: '36MNOPQ0123P6A4',
    category: 'Premium',
    creditLimit: 550000,
    outstandingAmount: 220000,
    status: 'Inactive',
    registrationDate: '2024-09-15',
    lastOrderDate: '2024-12-25'
  },
  {
    id: 'C010',
    name: 'PQR Construction',
    contactPerson: 'Meera Iyer',
    phone: '+91 09876 54321',
    email: 'meera@pqrconstruction.com',
    address: '741 Construction Hub, Block 7',
    area: 'Construction Zone',
    route: 'Route 1',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    gst: '33PQRST1234Q7B5',
    category: 'Standard',
    creditLimit: 450000,
    outstandingAmount: 175000,
    status: 'Active',
    registrationDate: '2024-10-30',
    lastOrderDate: '2024-12-26'
  }
];

export default function MyCustomers() {
  // Permission hooks
  const permissions = useActionPermissions('sales', 'myCustomers');
  
  const [customers, setCustomers] = useState(dummyCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [routeFilter, setRouteFilter] = useState('all');
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
                You don't have permission to view My Customers module.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form state - Updated to match new requirements
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '', // Not required anymore
    address: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    gst: '', // Not required anymore
    geoLocation: '', // New field added
    category: 'Standard'
  });

  // Get unique values for filters
  const categories = [...new Set(customers.map(c => c.category))];
  const routes = [...new Set(customers.map(c => c.route))];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || customer.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesRoute = routeFilter === 'all' || customer.route === routeFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesRoute;
  });

  const getCategoryVariant = (category) => {
    switch (category) {
      case 'Premium': return 'default';
      case 'Standard': return 'secondary';
      case 'Basic': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusVariant = (status) => {
    return status === 'Active' ? 'default' : 'destructive';
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      gst: '',
      geoLocation: '',
      category: 'Standard'
    });
  };

  const handleCreate = () => {
    const newCustomer = {
      id: `C${(customers.length + 1).toString().padStart(3, '0')}`,
      ...formData,
      status: 'Active', // Default status for new customers
      outstandingAmount: 0,
      registrationDate: new Date().toISOString().split('T')[0],
      lastOrderDate: null
    };
    setCustomers([...customers, newCustomer]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      contactPerson: customer.contactPerson,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address,
      area: customer.area,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      gst: customer.gst || '',
      geoLocation: customer.geoLocation || '',
      category: customer.category,
      status: customer.status
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    const updatedCustomers = customers.map(customer =>
      customer.id === selectedCustomer.id
        ? {
            ...customer,
            ...formData
          }
        : customer
    );
    setCustomers(updatedCustomers);
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  // Create form with isolated state to fix input focus issue
  const CreateCustomerForm = () => {
    const [localFormData, setLocalFormData] = useState({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      gst: '',
      geoLocation: ''
    });

    const handleSubmit = () => {
      if (!localFormData.name || !localFormData.contactPerson || !localFormData.phone) {
        return;
      }
      
      const newCustomer = {
        id: `C${(customers.length + 1).toString().padStart(3, '0')}`,
        ...localFormData,
        status: 'Active',
        category: 'Standard', // Default category
        route: 'Route 1', // Default route
        creditLimit: 100000, // Default credit limit
        outstandingAmount: 0,
        registrationDate: new Date().toISOString().split('T')[0],
        lastOrderDate: ''
      };
      
      setCustomers([...customers, newCustomer]);
      setIsCreateModalOpen(false);
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={localFormData.name}
              onChange={(e) => setLocalFormData({ ...localFormData, name: e.target.value })}
              placeholder="Enter company name"
            />
          </div>
          <div>
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input
              id="contactPerson"
              value={localFormData.contactPerson}
              onChange={(e) => setLocalFormData({ ...localFormData, contactPerson: e.target.value })}
              placeholder="Enter contact person name"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={localFormData.phone}
              onChange={(e) => setLocalFormData({ ...localFormData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={localFormData.email}
              onChange={(e) => setLocalFormData({ ...localFormData, email: e.target.value })}
              placeholder="Enter email address (optional)"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={localFormData.address}
              onChange={(e) => setLocalFormData({ ...localFormData, address: e.target.value })}
              placeholder="Enter full address"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="area">Area *</Label>
            <Input
              id="area"
              value={localFormData.area}
              onChange={(e) => setLocalFormData({ ...localFormData, area: e.target.value })}
              placeholder="Enter area/locality"
            />
          </div>
          <div>
            <Label htmlFor="geoLocation">Geo Location</Label>
            <Input
              id="geoLocation"
              value={localFormData.geoLocation}
              onChange={(e) => setLocalFormData({ ...localFormData, geoLocation: e.target.value })}
              placeholder="Enter GPS coordinates or location"
            />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={localFormData.city}
              onChange={(e) => setLocalFormData({ ...localFormData, city: e.target.value })}
              placeholder="Enter city"
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={localFormData.state}
              onChange={(e) => setLocalFormData({ ...localFormData, state: e.target.value })}
              placeholder="Enter state"
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              value={localFormData.pincode}
              onChange={(e) => setLocalFormData({ ...localFormData, pincode: e.target.value })}
              placeholder="Enter pincode"
            />
          </div>
          <div>
            <Label htmlFor="gst">GST Number</Label>
            <Input
              id="gst"
              value={localFormData.gst}
              onChange={(e) => setLocalFormData({ ...localFormData, gst: e.target.value })}
              placeholder="Enter GST number (optional)"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setIsCreateModalOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!localFormData.name || !localFormData.contactPerson || !localFormData.phone}
          >
            Add Customer
          </Button>
        </div>
      </div>
    );
  };

  // Edit form using existing formData state (category field removed as requested)
  const EditCustomerForm = () => (
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
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address (optional)"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Enter full address"
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="area">Area *</Label>
          <Input
            id="area"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            placeholder="Enter area/locality"
          />
        </div>
        <div>
          <Label htmlFor="geoLocation">Geo Location</Label>
          <Input
            id="geoLocation"
            value={formData.geoLocation}
            onChange={(e) => setFormData({ ...formData, geoLocation: e.target.value })}
            placeholder="Enter GPS coordinates or location"
          />
        </div>
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Enter city"
          />
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="Enter state"
          />
        </div>
        <div>
          <Label htmlFor="pincode">Pincode *</Label>
          <Input
            id="pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            placeholder="Enter pincode"
          />
        </div>
        <div>
          <Label htmlFor="gst">GST Number</Label>
          <Input
            id="gst"
            value={formData.gst}
            onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
            placeholder="Enter GST number (optional)"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={handleUpdate}>
          Update Customer
        </Button>
      </div>
    </div>
  );

  // Calculate stats
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'Active').length,
    totalCredit: customers.reduce((sum, c) => sum + c.creditLimit, 0),
    totalOutstanding: customers.reduce((sum, c) => sum + c.outstandingAmount, 0)
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Responsive Header */}
      <div className="bg-green-600 text-white px-4 sm:px-6 py-4 rounded-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            <h1 className="text-lg sm:text-xl font-semibold">My Customers</h1>
            <span className="hidden lg:inline text-green-100 text-sm">Manage customer relationships</span>
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
            {permissions.canAdd && (
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="bg-white text-green-600 hover:bg-green-50 text-sm px-3 py-2">
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Customer</span>
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Add a new customer to your database with complete contact and business information.
                  </DialogDescription>
                </DialogHeader>
                <CreateCustomerForm />
              </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Building className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Credit Limit</p>
                <p className="text-2xl font-bold text-purple-600">₹{(stats.totalCredit / 100000).toFixed(1)}L</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Outstanding Amount</p>
                <p className="text-2xl font-bold text-orange-600">₹{(stats.totalOutstanding / 100000).toFixed(1)}L</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
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
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {routes.map((route) => (
                  <SelectItem key={route} value={route}>{route}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Status</TableHead>
                  {(permissions.canView || permissions.canEdit || permissions.canDelete) && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.contactPerson}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {customer.phone}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.city}, {customer.state}</div>
                        <div className="text-sm text-gray-500">{customer.area}</div>
                        <Badge variant="outline" className="mt-1">{customer.route}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getCategoryVariant(customer.category)}>
                        {customer.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{customer.creditLimit.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-orange-600">₹{customer.outstandingAmount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(customer.status)}>
                        {customer.status}
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
                              <DropdownMenuItem onClick={() => handleView(customer)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            )}
                            {permissions.canEdit && (
                              <DropdownMenuItem onClick={() => handleEdit(customer)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {permissions.canDelete && (
                              <DropdownMenuItem 
                                onClick={() => handleDelete(customer.id)}
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
            <DialogTitle>Edit Customer - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Update customer information and business details.
            </DialogDescription>
          </DialogHeader>
          <EditCustomerForm />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View complete customer information and contact details.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Company Name</Label>
                  <p className="text-sm font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Contact Person</Label>
                  <p className="text-sm font-medium">{selectedCustomer.contactPerson}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p className="text-sm font-medium">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-sm font-medium">{selectedCustomer.email}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-500">Address</Label>
                  <p className="text-sm font-medium">{selectedCustomer.address}</p>
                  <p className="text-sm font-medium">{selectedCustomer.city}, {selectedCustomer.state} - {selectedCustomer.pincode}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Category</Label>
                  <Badge variant={getCategoryVariant(selectedCustomer.category)}>
                    {selectedCustomer.category}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge variant={getStatusVariant(selectedCustomer.status)}>
                    {selectedCustomer.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Credit Limit</Label>
                  <p className="text-sm font-medium">₹{selectedCustomer.creditLimit.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Outstanding Amount</Label>
                  <p className="text-sm font-medium text-orange-600">₹{selectedCustomer.outstandingAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Registration Date</Label>
                  <p className="text-sm font-medium">{selectedCustomer.registrationDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Order Date</Label>
                  <p className="text-sm font-medium">{selectedCustomer.lastOrderDate || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}