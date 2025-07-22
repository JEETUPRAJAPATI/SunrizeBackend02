import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ActionButton, useActionPermissions } from '@/components/permissions/ActionButton';
import { customerApi } from '@/api/customerService';
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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // API Integration - Fetch customers
  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ['/api/customers'],
    enabled: permissions.canView
  });
  
  const customers = apiResponse?.customers || dummyCustomers;
  const apiStats = apiResponse?.stats || {};
  

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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

  // Form state - Updated to match API requirements
  const [formData, setFormData] = useState({
    customerName: '',
    contactName: '',
    mobile: '',
    email: '', // Optional
    addressLine1: '',
    city: '',
    state: '',
    country: 'India',
    pin: '',
    gstin: '', // Optional
    customerType: 'Retail',
    status: 'Active',
    notes: ''
  });

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: (customerData) => customerApi.create(customerData),
    onSuccess: (result) => {
      queryClient.invalidateQueries(['/api/customers']);
      toast({
        title: "Success",
        description: result.message || "Customer created successfully",
      });
      // Close modal on success - form resets in handleSubmit
      setIsCreateModalOpen(false);
    }
    // Let form handleSubmit handle all errors
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, customerData }) => customerApi.update(id, customerData),
    onSuccess: (result) => {
      queryClient.invalidateQueries(['/api/customers']);
      toast({
        title: "Success",
        description: result.message || "Customer updated successfully",
      });
      // Close modal and clear selected customer
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
    },
    onError: (error) => {
      // Only show generic errors, validation errors are handled in the form
      if (!error.validationErrors) {
        toast({
          title: "Error",
          description: error.message || "Failed to update customer",
          variant: "destructive",
        });
      }
    }
  });

  // Delete customer mutation
  const deleteCustomerMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete customer');
      }
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries(['/api/customers']);
      toast({
        title: "Success", 
        description: result.message || "Customer deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete customer",
        variant: "destructive",
      });
    }
  });

  // Get unique values for filters (fallback to dummy data while loading)
  const displayCustomers = customers.length > 0 ? customers : dummyCustomers;



  const filteredCustomers = displayCustomers.filter(customer => {
    const matchesSearch = 
      (customer.customerName || customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.contactName || customer.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.mobile || customer.phone || '').includes(searchTerm) ||
      (customer.addressLine1 || customer.address || customer.area || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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
      customerName: '',
      contactName: '',
      mobile: '',
      email: '',
      addressLine1: '',
      city: '',
      state: '',
      country: 'India',
      pin: '',
      gstin: '',
      customerType: 'Retail',
      status: 'Active',

    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.customerName.trim()) {
      errors.customerName = "Customer name is required";
    }
    
    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.mobile)) {
      errors.mobile = "Please enter a valid mobile number";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = "Address is required";
    }
    
    if (!formData.city.trim()) {
      errors.city = "City is required";
    }
    
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }
    
    return errors;
  };

  const handleCreate = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      // Show validation errors
      const errorMessages = Object.values(errors).join(', ');
      toast({
        title: "Validation Error",
        description: errorMessages,
        variant: "destructive"
      });
      return;
    }
    
    createCustomerMutation.mutate(formData);
  };

  // Handle modal close to ensure form cleanup
  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    // Additional cleanup will be handled by useEffect in CreateCustomerForm
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
    // Additional cleanup will be handled by useEffect in EditCustomerForm
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      customerName: customer.customerName || customer.name || '',
      contactName: customer.contactName || customer.contactPerson || '',
      mobile: customer.mobile || customer.phone || '',
      email: customer.email || '',
      addressLine1: customer.addressLine1 || customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      country: customer.country || 'India',
      pin: customer.pin || customer.pincode || '',
      gstin: customer.gstin || customer.gst || '',
      customerType: customer.customerType || customer.category || 'Retail',
      status: customer.status || 'Active',

    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    updateCustomerMutation.mutate({ 
      id: selectedCustomer._id || selectedCustomer.id, 
      customerData: formData 
    });
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomerMutation.mutate(customerId);
    }
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  // Reusable Form Field Components
  const CategorySelect = ({ value, onValueChange, id = "category", className = "mt-1" }) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Distributor">Distributor</SelectItem>
        <SelectItem value="Retailer">Retailer</SelectItem>
        <SelectItem value="Wholesaler">Wholesaler</SelectItem>
        <SelectItem value="End User">End User</SelectItem>
      </SelectContent>
    </Select>
  );

  const ActiveStatusSelect = ({ value, onValueChange, id = "active", className = "mt-1" }) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Yes">Yes</SelectItem>
        <SelectItem value="No">No</SelectItem>
      </SelectContent>
    </Select>
  );

  // Create form with isolated state to fix input focus issue
  const CreateCustomerForm = () => {
    const [localFormData, setLocalFormData] = useState({
      name: '',
      contactPerson: '',
      designation: '',
      category: 'Distributor',
      categoryNote: '',
      active: 'Yes',
      mobile: '',
      email: '',
      gstin: '',
      address1: '',
      googlePin: '',
      city: '',
      state: '',
      country: 'India',
      pin: '',
      salesContact: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form only when modal closes (on cancel or success)
    const resetForm = () => {
      setLocalFormData({
        name: '',
        contactPerson: '',
        designation: '',
        category: 'Distributor',
        categoryNote: '',
        active: 'Yes',
        mobile: '',
        email: '',
        gstin: '',
        address1: '',
        googlePin: '',
        city: '',
        state: '',
        country: 'India',
        pin: '',
        salesContact: ''
      });
      setErrors({});
      setIsSubmitting(false);
    };
    
    // Reset form when modal closes
    useEffect(() => {
      if (!isCreateModalOpen) {
        resetForm();
      }
    }, [isCreateModalOpen]);

    // No real-time validation to avoid interference with form data

    const validateForm = () => {
      const newErrors = {};

      // Required fields
      if (!localFormData.name?.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!localFormData.mobile?.trim()) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!/^[0-9]{10}$/.test(localFormData.mobile.trim())) {
        newErrors.mobile = 'Mobile number must be 10 digits';
      }
      if (!localFormData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localFormData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }

      // Optional field validations
      if (localFormData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(localFormData.gstin)) {
        newErrors.gstin = 'Please enter a valid 15-character GST number';
      }
      if (localFormData.pin && !/^[0-9]{6}$/.test(localFormData.pin)) {
        newErrors.pin = 'PIN code must be 6 digits';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('=== CREATE CUSTOMER SUBMIT ===');
      console.log('Current localFormData state:', localFormData);
      console.log('Current errors state:', errors);
      
      setIsSubmitting(true);
      // Don't clear errors before API call
      
      const customerData = {
        name: localFormData.name || '',
        contactPerson: localFormData.contactPerson || '',
        designation: localFormData.designation || '',
        category: localFormData.category || 'Distributor',
        categoryNote: localFormData.categoryNote || '',
        active: localFormData.active || 'Yes',
        mobile: localFormData.mobile || '',
        email: localFormData.email || '',
        gstin: localFormData.gstin || '',
        address1: localFormData.address1 || '',
        googlePin: localFormData.googlePin || '',
        city: localFormData.city || '',
        state: localFormData.state || '',
        country: localFormData.country || 'India',
        pin: localFormData.pin || '',
        salesContact: localFormData.salesContact || ''
      };
      
      console.log('Sending to API:', customerData);
      
      try {
        const result = await createCustomerMutation.mutateAsync(customerData);
        console.log('API SUCCESS:', result);
        
        // Form will be reset when modal closes via useEffect
        
      } catch (error) {
        console.log('API ERROR:', error);
        
        // Handle server validation errors - preserve form data
        if (error.validationErrors) {
          console.log('Setting validation errors:', error.validationErrors);
          setErrors(error.validationErrors);
          toast({
            title: "Validation Error",
            description: "Please fix the highlighted errors",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to create customer",
            variant: "destructive",
          });
        }
        // Form data stays intact for validation errors
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="space-y-6">
        {/* Primary Details Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Primary Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
              <Input
                id="name"
                value={localFormData.name}
                onChange={(e) => {
                  setLocalFormData({ ...localFormData, name: e.target.value });
                  // Clear error when user starts typing
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: null }));
                  }
                }}
                placeholder="Enter customer name"
                className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700">Contact Person</Label>
              <Input
                id="contactPerson"
                value={localFormData.contactPerson}
                onChange={(e) => setLocalFormData({ ...localFormData, contactPerson: e.target.value })}
                placeholder="Mr"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="designation" className="text-sm font-medium text-gray-700">Designation</Label>
              <Input
                id="designation"
                value={localFormData.designation}
                onChange={(e) => setLocalFormData({ ...localFormData, designation: e.target.value })}
                placeholder="Enter designation"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
              <CategorySelect 
                value={localFormData.category} 
                onValueChange={(value) => setLocalFormData({ ...localFormData, category: value })}
              />
            </div>
            <div>
              <Label htmlFor="categoryNote" className="text-sm font-medium text-gray-700">Category Note</Label>
              <Input
                id="categoryNote"
                value={localFormData.categoryNote}
                onChange={(e) => setLocalFormData({ ...localFormData, categoryNote: e.target.value })}
                placeholder="Enter category note"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="active" className="text-sm font-medium text-gray-700">Active</Label>
              <ActiveStatusSelect 
                value={localFormData.active} 
                onValueChange={(value) => setLocalFormData({ ...localFormData, active: value })}
              />
            </div>
            <div>
              <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile *</Label>
              <Input
                id="mobile"
                value={localFormData.mobile}
                onChange={(e) => {
                  setLocalFormData({ ...localFormData, mobile: e.target.value });
                  // Clear error when user starts typing
                  if (errors.mobile) {
                    setErrors(prev => ({ ...prev, mobile: null }));
                  }
                }}
                placeholder="Enter mobile number"
                className={`mt-1 ${errors.mobile ? 'border-red-500' : ''}`}
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
              <Input
                id="email"
                type="email"
                value={localFormData.email}
                onChange={(e) => {
                  setLocalFormData({ ...localFormData, email: e.target.value });
                  // Clear error when user starts typing
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: null }));
                  }
                }}
                placeholder="Enter email address"
                className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="gstin" className="text-sm font-medium text-gray-700">GSTIN</Label>
              <Input
                id="gstin"
                value={localFormData.gstin}
                onChange={(e) => {
                  setLocalFormData({ ...localFormData, gstin: e.target.value });
                  // Clear error when user starts typing
                  if (errors.gstin) {
                    setErrors(prev => ({ ...prev, gstin: null }));
                  }
                }}
                placeholder="Enter GSTIN"
                className={`mt-1 ${errors.gstin ? 'border-red-500' : ''}`}
              />
              {errors.gstin && <p className="text-red-500 text-xs mt-1">{errors.gstin}</p>}
            </div>
            <div>
              <Label htmlFor="address1" className="text-sm font-medium text-gray-700">Address 1</Label>
              <Input
                id="address1"
                value={localFormData.address1}
                onChange={(e) => setLocalFormData({ ...localFormData, address1: e.target.value })}
                placeholder="Enter address"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="googlePin" className="text-sm font-medium text-gray-700">Google Pin</Label>
              <Input
                id="googlePin"
                value={localFormData.googlePin}
                onChange={(e) => setLocalFormData({ ...localFormData, googlePin: e.target.value })}
                placeholder="Enter Google Pin"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
              <Input
                id="city"
                value={localFormData.city}
                onChange={(e) => setLocalFormData({ ...localFormData, city: e.target.value })}
                placeholder="Enter city"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
              <Input
                id="state"
                value={localFormData.state}
                onChange={(e) => setLocalFormData({ ...localFormData, state: e.target.value })}
                placeholder="Enter state"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
              <Input
                value="India"
                disabled
                className="mt-1 bg-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="pin" className="text-sm font-medium text-gray-700">PIN</Label>
              <Input
                id="pin"
                value={localFormData.pin}
                onChange={(e) => {
                  setLocalFormData({ ...localFormData, pin: e.target.value });
                  // Clear error when user starts typing
                  if (errors.pin) {
                    setErrors(prev => ({ ...prev, pin: null }));
                  }
                }}
                placeholder="Enter PIN code"
                className={`mt-1 ${errors.pin ? 'border-red-500' : ''}`}
              />
              {errors.pin && <p className="text-red-500 text-xs mt-1">{errors.pin}</p>}
            </div>
            <div>
              <Label htmlFor="salesContact" className="text-sm font-medium text-gray-700">Sales Contact</Label>
              <Input
                id="salesContact"
                value={localFormData.salesContact}
                onChange={(e) => setLocalFormData({ ...localFormData, salesContact: e.target.value })}
                placeholder="Enter sales contact name"
                className="mt-1"
              />
            </div>
          </div>
        </div>


        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setIsCreateModalOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Submit'}
          </Button>
        </div>
      </div>
    );
  };

  // Edit Customer Form Component
  const EditCustomerForm = () => {
    const [localFormData, setLocalFormData] = useState({
      name: '',
      contactPerson: '',
      designation: '',
      category: 'Distributor',
      categoryNote: '',
      active: 'Yes',
      mobile: '',
      email: '',
      gstin: '',
      address1: '',
      googlePin: '',
      city: '',
      state: '',
      country: 'India',
      pin: '',
      salesContact: ''
    });

    // Update form data when selectedCustomer changes
    useEffect(() => {
      if (selectedCustomer) {
        setLocalFormData({
          name: selectedCustomer.name || '',
          contactPerson: selectedCustomer.contactPerson || '',
          designation: selectedCustomer.designation || '',
          category: selectedCustomer.category || 'Distributor',
          categoryNote: selectedCustomer.categoryNote || '',
          active: selectedCustomer.active || 'Yes',
          mobile: selectedCustomer.mobile || '',
          email: selectedCustomer.email || '',
          gstin: selectedCustomer.gstin || '',
          address1: selectedCustomer.address1 || '',
          googlePin: selectedCustomer.googlePin || '',
          city: selectedCustomer.city || '',
          state: selectedCustomer.state || '',
          country: 'India',
          pin: selectedCustomer.pin || '',
          salesContact: selectedCustomer.salesContact || ''
        });
        setErrors({});
      }
    }, [selectedCustomer]);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
      const newErrors = {};

      // Required fields
      if (!localFormData.name?.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!localFormData.mobile?.trim()) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!/^[0-9]{10}$/.test(localFormData.mobile.trim())) {
        newErrors.mobile = 'Mobile number must be 10 digits';
      }
      if (!localFormData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localFormData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }

      // Optional field validations
      if (localFormData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(localFormData.gstin)) {
        newErrors.gstin = 'Please enter a valid 15-character GST number';
      }
      if (localFormData.pin && !/^[0-9]{6}$/.test(localFormData.pin)) {
        newErrors.pin = 'PIN code must be 6 digits';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        toast({
          title: "Validation Error",
          description: "Please fix the errors before submitting",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      
      const updatedCustomerData = {
        name: localFormData.name.trim(),
        contactPerson: localFormData.contactPerson?.trim() || '',
        designation: localFormData.designation?.trim() || '',
        category: localFormData.category,
        categoryNote: localFormData.categoryNote?.trim() || '',
        active: localFormData.active,
        mobile: localFormData.mobile.trim(),
        email: localFormData.email.trim(),
        gstin: localFormData.gstin?.trim() || '',
        address1: localFormData.address1?.trim() || '',
        googlePin: localFormData.googlePin?.trim() || '',
        city: localFormData.city?.trim() || '',
        state: localFormData.state?.trim() || '',
        country: 'India',
        pin: localFormData.pin?.trim() || '',
        salesContact: localFormData.salesContact?.trim() || ''
      };
      
      try {
        await updateCustomerMutation.mutateAsync({ 
          id: selectedCustomer._id || selectedCustomer.id, 
          customerData: updatedCustomerData 
        });
        // Form reset and modal close is handled by mutation success handler
      } catch (error) {
        // Handle server validation errors
        if (error.validationErrors) {
          const serverErrors = {};
          // Map server validation errors to form field names
          Object.keys(error.validationErrors).forEach(field => {
            serverErrors[field] = error.validationErrors[field];
          });
          setErrors(prevErrors => ({ ...prevErrors, ...serverErrors }));
          
          toast({
            title: "Validation Error",
            description: "Please fix the highlighted errors",
            variant: "destructive",
          });
        }
        // Don't reset form on error - preserve user input
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="space-y-6">
        {/* Primary Details Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Primary Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">Customer Name</Label>
              <Input
                id="edit-name"
                value={localFormData.name}
                onChange={(e) => {
                  setLocalFormData({ ...localFormData, name: e.target.value });
                  // Clear error when user starts typing
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: null }));
                  }
                }}
                placeholder="Enter customer name"
                className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="edit-contactPerson" className="text-sm font-medium text-gray-700">Contact Person</Label>
              <Input
                id="edit-contactPerson"
                value={localFormData.contactPerson}
                onChange={(e) => setLocalFormData({ ...localFormData, contactPerson: e.target.value })}
                placeholder="Enter contact person name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-designation" className="text-sm font-medium text-gray-700">Designation</Label>
              <Input
                id="edit-designation"
                value={localFormData.designation}
                onChange={(e) => setLocalFormData({ ...localFormData, designation: e.target.value })}
                placeholder="Enter designation"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-category" className="text-sm font-medium text-gray-700">Category</Label>
              <CategorySelect 
                value={localFormData.category} 
                onValueChange={(value) => setLocalFormData({ ...localFormData, category: value })}
                id="edit-category"
              />
            </div>
            <div>
              <Label htmlFor="edit-categoryNote" className="text-sm font-medium text-gray-700">Category Note</Label>
              <Input
                id="edit-categoryNote"
                value={localFormData.categoryNote}
                onChange={(e) => setLocalFormData({ ...localFormData, categoryNote: e.target.value })}
                placeholder="Enter category note"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-active" className="text-sm font-medium text-gray-700">Active</Label>
              <ActiveStatusSelect 
                value={localFormData.active} 
                onValueChange={(value) => setLocalFormData({ ...localFormData, active: value })}
                id="edit-active"
              />
            </div>

          </div>
        </div>

        {/* Contact Details Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-mobile" className="text-sm font-medium text-gray-700">Mobile *</Label>
              <Input
                id="edit-mobile"
                value={localFormData.mobile}
                onChange={(e) => {
                  setLocalFormData({ ...localFormData, mobile: e.target.value });
                  if (errors.mobile) {
                    setErrors(prev => ({ ...prev, mobile: null }));
                  }
                }}
                placeholder="Enter mobile number"
                className={`mt-1 ${errors.mobile ? 'border-red-500' : ''}`}
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>
            <div>
              <Label htmlFor="edit-email" className="text-sm font-medium text-gray-700">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={localFormData.email}
                onChange={(e) => {
                  setLocalFormData({ ...localFormData, email: e.target.value });
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: null }));
                  }
                }}
                placeholder="Enter email address"
                className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="edit-gstin" className="text-sm font-medium text-gray-700">GSTIN</Label>
              <Input
                id="edit-gstin"
                value={localFormData.gstin}
                onChange={(e) => {
                  setLocalFormData({ ...localFormData, gstin: e.target.value });
                  if (errors.gstin) {
                    setErrors(prev => ({ ...prev, gstin: null }));
                  }
                }}
                placeholder="Enter GSTIN"
                className={`mt-1 ${errors.gstin ? 'border-red-500' : ''}`}
              />
              {errors.gstin && <p className="text-red-500 text-xs mt-1">{errors.gstin}</p>}
            </div>
            <div>
              <Label htmlFor="edit-address1" className="text-sm font-medium text-gray-700">Address 1</Label>
              <Input
                id="edit-address1"
                value={localFormData.address1}
                onChange={(e) => setLocalFormData({ ...localFormData, address1: e.target.value })}
                placeholder="Enter address"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-googlePin" className="text-sm font-medium text-gray-700">Google Pin</Label>
              <Input
                id="edit-googlePin"
                value={localFormData.googlePin}
                onChange={(e) => setLocalFormData({ ...localFormData, googlePin: e.target.value })}
                placeholder="Enter Google Pin"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-city" className="text-sm font-medium text-gray-700">City</Label>
              <Input
                id="edit-city"
                value={localFormData.city}
                onChange={(e) => setLocalFormData({ ...localFormData, city: e.target.value })}
                placeholder="Enter city"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-state" className="text-sm font-medium text-gray-700">State</Label>
              <Input
                id="edit-state"
                value={localFormData.state}
                onChange={(e) => setLocalFormData({ ...localFormData, state: e.target.value })}
                placeholder="Enter state"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-country" className="text-sm font-medium text-gray-700">Country</Label>
              <Input
                id="edit-country"
                value={localFormData.country}
                onChange={(e) => setLocalFormData({ ...localFormData, country: e.target.value })}
                placeholder="India"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-pin" className="text-sm font-medium text-gray-700">PIN</Label>
              <Input
                id="edit-pin"
                value={localFormData.pin}
                onChange={(e) => {
                  setLocalFormData({ ...localFormData, pin: e.target.value });
                  if (errors.pin) {
                    setErrors(prev => ({ ...prev, pin: null }));
                  }
                }}
                placeholder="Enter PIN code"
                className={`mt-1 ${errors.pin ? 'border-red-500' : ''}`}
              />
              {errors.pin && <p className="text-red-500 text-xs mt-1">{errors.pin}</p>}
            </div>
            <div>
              <Label htmlFor="edit-salesContact" className="text-sm font-medium text-gray-700">Sales Contact</Label>
              <Input
                id="edit-salesContact"
                value={localFormData.salesContact}
                onChange={(e) => setLocalFormData({ ...localFormData, salesContact: e.target.value })}
                placeholder="Enter sales contact name"
                className="mt-1"
              />
            </div>
          </div>
        </div>


        
        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setIsEditModalOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !localFormData.name?.trim() || !localFormData.mobile?.trim() || !localFormData.email?.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Submit'}
          </Button>
        </div>
      </div>
    );
  };

  // Calculate stats (use API stats if available, otherwise calculate from local data)
  const displayStats = apiStats.total ? apiStats : {
    total: customers.length,
    active: customers.filter(c => c.status === 'Active').length,
    premium: customers.filter(c => (c.customerType || c.category) === 'Premium').length
  };

  return (
    <div className="px-2 py-2 sm:p-4 lg:p-6 space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="bg-green-600 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-md mx-0 sm:mx-0">
        {/* Mobile Layout */}
        <div className="flex sm:hidden items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <h1 className="text-lg font-semibold">My Customers</h1>
          </div>
          <div className="flex items-center space-x-2">
            {permissions.canAdd && (
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="bg-white text-green-600 hover:bg-green-50 text-sm px-3 py-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto" key="create-customer-modal">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Create New Customer</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new customer.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateCustomerForm />
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm px-3 py-2">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6" />
            <h1 className="text-xl font-semibold">My Customers</h1>
            <span className="hidden lg:inline text-green-100 text-sm">Manage customer relationships</span>
          </div>
          <div className="flex items-center space-x-3">
            {permissions.canAdd && (
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="bg-white text-green-600 hover:bg-green-50 text-sm px-3 py-2">
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Create Customer</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto" key="create-customer-modal-desktop">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Create New Customer</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new customer.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateCustomerForm />
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm px-3 py-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Refresh</span>
            </Button>
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
                placeholder="Search customers..."
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
              <SelectItem value="Yes">Active</SelectItem>
              <SelectItem value="No">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-lg p-3 sm:p-6 mx-0 sm:mx-0">
        <h3 className="text-lg font-medium mb-3 sm:mb-4 px-0 sm:px-0">Customer List</h3>
        
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
            {paginatedCustomers.map((customer, index) => (
              <div key={customer._id || customer.id} className={`p-2 ${index !== paginatedCustomers.length - 1 ? 'border-b border-gray-200 dark:border-gray-600' : ''} bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700`}>
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
                      {customer.customerName || customer.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {customer.contactName || customer.contactPerson} • {customer.mobile || customer.phone}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {customer.city}, {customer.state}
                    </div>
                  </div>
                  <div className="w-20 flex justify-center">
                    <Badge 
                      variant={customer.active === 'Yes' ? 'default' : 'destructive'}
                      className="text-xs px-2 py-1"
                    >
                      {customer.active === 'Yes' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="w-24 flex justify-center space-x-1">
                    {permissions.canView && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-600"
                        onClick={() => handleView(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {permissions.canEdit && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 hover:bg-green-100 hover:text-green-600"
                        onClick={() => handleEdit(customer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {permissions.canDelete && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600"
                        onClick={() => handleDelete(customer._id || customer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  {(permissions.canView || permissions.canEdit || permissions.canDelete) && (
                    <TableHead className="text-center">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.map((customer) => (
                  <TableRow key={customer._id || customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer._id || customer.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.contactPerson || 'N/A'}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {customer.mobile}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.city || 'N/A'}, {customer.state || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{customer.address1 || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.active === 'Yes' ? 'default' : 'secondary'} className={customer.active === 'Yes' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}>
                        {customer.active === 'Yes' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    {(permissions.canView || permissions.canEdit || permissions.canDelete) && (
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-1">
                          {permissions.canView && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 hover:bg-gray-100 hover:text-gray-600"
                              onClick={() => handleView(customer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {permissions.canEdit && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 hover:bg-gray-100 hover:text-gray-600"
                              onClick={() => handleEdit(customer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {permissions.canDelete && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 hover:bg-gray-100 hover:text-gray-600"
                              onClick={() => handleDelete(customer._id || customer.id)}
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
      </div>

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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View complete customer information and contact details.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4 sm:space-y-6">
              {/* Customer Details Section */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Customer Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Name</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Contact Person</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.contactPerson || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Designation</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.designation || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Category</Label>
                    <div className="mt-1">
                      <Badge variant={getCategoryVariant(selectedCustomer.category)}>
                        {selectedCustomer.category}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Category Note</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.categoryNote || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Active</Label>
                    <div className="mt-1">
                      <Badge variant={selectedCustomer.active === 'Yes' ? 'default' : 'secondary'}>
                        {selectedCustomer.active}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Mobile</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.mobile}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">GSTIN</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.gstin || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.address1 || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Google Pin</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.googlePin || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">City</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.city || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">State</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.state || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Country</Label>
                    <p className="text-sm font-semibold text-gray-900">India</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">PIN</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.pin || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Sales Contact</Label>
                    <p className="text-sm font-semibold text-gray-900">{selectedCustomer.salesContact || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {selectedCustomer.notes && (
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Notes</h3>
                  </div>
                  <p className="text-sm text-gray-900">{selectedCustomer.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">{startIndex + 1}</span>
                {' '}-{' '}
                <span className="font-medium">
                  {Math.min(endIndex, totalItems)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{totalItems}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="ml-1"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="ml-1"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}