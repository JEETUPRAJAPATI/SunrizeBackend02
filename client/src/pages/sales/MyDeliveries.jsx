import React, { useState } from 'react';
import { ActionButton, useActionPermissions } from '@/components/permissions/ActionButton';
import { useAuth } from '@/hooks/useAuth';
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
  Truck,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  Calendar,
  MapPin,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  ChevronsUpDown,
  Check
} from 'lucide-react';

// Dummy delivery data
const dummyDeliveries = [
  {
    id: 'D001',
    orderNo: 'ORD-2025-001',
    customerName: 'ABC Manufacturing Ltd',
    customerAddress: '123 Industrial Area, Phase 1, Mumbai, Maharashtra - 400001',
    deliveryDate: '2025-01-07',
    timeSlot: '09:00 AM - 12:00 PM',
    driverName: 'Ramesh Kumar',
    vehicleNo: 'MH-01-AB-1234',
    contactNumber: '+91 98765 43210',
    items: [
      { name: 'Steel Rods', quantity: 50, unit: 'Pcs' },
      { name: 'Iron Sheets', quantity: 25, unit: 'Sheets' }
    ],
    status: 'Delivered',
    priority: 'High',
    notes: 'Delivery completed successfully',
    deliveredAt: '2025-01-07 10:30 AM',
    createdAt: '2025-01-05'
  },
  {
    id: 'D002',
    orderNo: 'ORD-2025-002',
    customerName: 'XYZ Industries Corp',
    customerAddress: '456 Tech Park, Building B2, Pune, Maharashtra - 411001',
    deliveryDate: '2025-01-08',
    timeSlot: '02:00 PM - 05:00 PM',
    driverName: 'Suresh Patel',
    vehicleNo: 'MH-12-CD-5678',
    contactNumber: '+91 87654 32109',
    items: [
      { name: 'Electronic Components', quantity: 100, unit: 'Pcs' },
      { name: 'Circuit Boards', quantity: 15, unit: 'Boards' }
    ],
    status: 'In Transit',
    priority: 'Medium',
    notes: 'Handle with care - fragile items',
    deliveredAt: null,
    createdAt: '2025-01-06'
  },
  {
    id: 'D003',
    orderNo: 'ORD-2025-003',
    customerName: 'PQR Steel Works',
    customerAddress: '789 Steel Complex, Sector 5, Ahmedabad, Gujarat - 380001',
    deliveryDate: '2025-01-09',
    timeSlot: '10:00 AM - 01:00 PM',
    driverName: 'Vikram Singh',
    vehicleNo: 'GJ-01-EF-9012',
    contactNumber: '+91 76543 21098',
    items: [
      { name: 'Heavy Machinery Parts', quantity: 8, unit: 'Units' },
      { name: 'Steel Pipes', quantity: 200, unit: 'Meters' }
    ],
    status: 'Scheduled',
    priority: 'High',
    notes: 'Requires crane for unloading',
    deliveredAt: null,
    createdAt: '2025-01-07'
  },
  {
    id: 'D004',
    orderNo: 'ORD-2025-004',
    customerName: 'LMN Auto Parts',
    customerAddress: '321 Auto Hub, Unit 12, Hyderabad, Telangana - 500001',
    deliveryDate: '2025-01-08',
    timeSlot: '08:00 AM - 11:00 AM',
    driverName: 'Anil Kumar',
    vehicleNo: 'TS-09-GH-3456',
    contactNumber: '+91 65432 10987',
    items: [
      { name: 'Car Engine Parts', quantity: 30, unit: 'Parts' },
      { name: 'Brake Pads', quantity: 60, unit: 'Sets' }
    ],
    status: 'Delivered',
    priority: 'Medium',
    notes: 'Customer satisfied with delivery',
    deliveredAt: '2025-01-08 09:45 AM',
    createdAt: '2025-01-06'
  },
  {
    id: 'D005',
    orderNo: 'ORD-2025-005',
    customerName: 'RST Electronics',
    customerAddress: '654 Electronics Mall, Floor 3, Bangalore, Karnataka - 560001',
    deliveryDate: '2025-01-10',
    timeSlot: '01:00 PM - 04:00 PM',
    driverName: 'Manoj Sharma',
    vehicleNo: 'KA-03-IJ-7890',
    contactNumber: '+91 54321 09876',
    items: [
      { name: 'LED Displays', quantity: 20, unit: 'Units' },
      { name: 'Control Panels', quantity: 10, unit: 'Panels' }
    ],
    status: 'Pending',
    priority: 'Low',
    notes: 'Awaiting customer confirmation',
    deliveredAt: null,
    createdAt: '2025-01-07'
  },
  {
    id: 'D006',
    orderNo: 'ORD-2025-006',
    customerName: 'DEF Textiles Ltd',
    customerAddress: '987 Textile Park, Block C, Coimbatore, Tamil Nadu - 641001',
    deliveryDate: '2025-01-09',
    timeSlot: '11:00 AM - 02:00 PM',
    driverName: 'Rajesh Nair',
    vehicleNo: 'TN-11-KL-2468',
    contactNumber: '+91 43210 98765',
    items: [
      { name: 'Textile Machinery', quantity: 3, unit: 'Machines' },
      { name: 'Raw Materials', quantity: 500, unit: 'Kg' }
    ],
    status: 'In Transit',
    priority: 'High',
    notes: 'Priority delivery for production line',
    deliveredAt: null,
    createdAt: '2025-01-07'
  },
  {
    id: 'D007',
    orderNo: 'ORD-2025-007',
    customerName: 'GHI Chemicals',
    customerAddress: '147 Chemical Complex, Wing A, Vadodara, Gujarat - 390001',
    deliveryDate: '2025-01-11',
    timeSlot: '09:00 AM - 12:00 PM',
    driverName: 'Deepak Joshi',
    vehicleNo: 'GJ-06-MN-1357',
    contactNumber: '+91 32109 87654',
    items: [
      { name: 'Chemical Containers', quantity: 25, unit: 'Containers' },
      { name: 'Safety Equipment', quantity: 40, unit: 'Sets' }
    ],
    status: 'Scheduled',
    priority: 'High',
    notes: 'Handle chemicals with extreme care',
    deliveredAt: null,
    createdAt: '2025-01-08'
  },
  {
    id: 'D008',
    orderNo: 'ORD-2025-008',
    customerName: 'JKL Food Processing',
    customerAddress: '258 Food Park, Unit 8, Indore, Madhya Pradesh - 452001',
    deliveryDate: '2025-01-10',
    timeSlot: '07:00 AM - 10:00 AM',
    driverName: 'Satish Gupta',
    vehicleNo: 'MP-09-OP-9753',
    contactNumber: '+91 21098 76543',
    items: [
      { name: 'Food Processing Equipment', quantity: 5, unit: 'Units' },
      { name: 'Packaging Materials', quantity: 1000, unit: 'Pieces' }
    ],
    status: 'Cancelled',
    priority: 'Medium',
    notes: 'Cancelled due to customer request',
    deliveredAt: null,
    createdAt: '2025-01-07'
  },
  {
    id: 'D009',
    orderNo: 'ORD-2025-009',
    customerName: 'MNO Pharmaceuticals',
    customerAddress: '369 Pharma City, Tower B, Hyderabad, Telangana - 500038',
    deliveryDate: '2025-01-12',
    timeSlot: '02:00 PM - 05:00 PM',
    driverName: 'Ravi Kumar',
    vehicleNo: 'TS-07-QR-8642',
    contactNumber: '+91 10987 65432',
    items: [
      { name: 'Medical Equipment', quantity: 12, unit: 'Units' },
      { name: 'Lab Supplies', quantity: 200, unit: 'Items' }
    ],
    status: 'Scheduled',
    priority: 'High',
    notes: 'Temperature-controlled delivery required',
    deliveredAt: null,
    createdAt: '2025-01-08'
  },
  {
    id: 'D010',
    orderNo: 'ORD-2025-010',
    customerName: 'PQR Construction',
    customerAddress: '741 Construction Hub, Block 7, Chennai, Tamil Nadu - 600001',
    deliveryDate: '2025-01-09',
    timeSlot: '06:00 AM - 09:00 AM',
    driverName: 'Karthik Iyer',
    vehicleNo: 'TN-01-ST-1975',
    contactNumber: '+91 09876 54321',
    items: [
      { name: 'Construction Materials', quantity: 100, unit: 'Bags' },
      { name: 'Tools', quantity: 25, unit: 'Sets' }
    ],
    status: 'Delivered',
    priority: 'Medium',
    notes: 'Early morning delivery completed',
    deliveredAt: '2025-01-09 07:30 AM',
    createdAt: '2025-01-07'
  }
];

// Dummy customer data for searchable dropdown
const dummyCustomers = [
  { id: 'C001', name: 'ABC Manufacturing Ltd', address: '123 Industrial Area, Phase 1, Mumbai, Maharashtra - 400001' },
  { id: 'C002', name: 'XYZ Industries', address: '456 Tech Park, Sector 2, Pune, Maharashtra - 411001' },
  { id: 'C003', name: 'DEF Electronics', address: '789 Electronic City, Phase 3, Bangalore, Karnataka - 560001' },
  { id: 'C004', name: 'Global Enterprises', address: '321 Business District, Zone 1, Delhi, Delhi - 110001' },
  { id: 'C005', name: 'Tech Solutions', address: '654 IT Hub, Area 4, Gurgaon, Haryana - 122001' },
  { id: 'C006', name: 'Prime Industries', address: '987 Industrial Zone, Sector 5, Noida, Uttar Pradesh - 201301' },
  { id: 'C007', name: 'GHI Chemicals', address: '147 Chemical Complex, Wing A, Vadodara, Gujarat - 390001' },
  { id: 'C008', name: 'JKL Food Processing', address: '258 Food Park, Unit 8, Indore, Madhya Pradesh - 452001' },
  { id: 'C009', name: 'MNO Pharmaceuticals', address: '369 Pharma City, Tower B, Hyderabad, Telangana - 500038' },
  { id: 'C010', name: 'PQR Construction', address: '741 Construction Hub, Block 7, Chennai, Tamil Nadu - 600001' }
];

// Dummy order data for searchable dropdown  
const dummyOrders = [
  { id: 'ORD-2025-001', customerName: 'ABC Manufacturing Ltd', amount: 125000, items: 'Steel Rods, Iron Sheets' },
  { id: 'ORD-2025-002', customerName: 'XYZ Industries', amount: 89000, items: 'Aluminum Parts, Connectors' },
  { id: 'ORD-2025-003', customerName: 'DEF Electronics', amount: 156000, items: 'Circuit Boards, Components' },
  { id: 'ORD-2025-004', customerName: 'Global Enterprises', amount: 234000, items: 'Machinery Parts, Tools' },
  { id: 'ORD-2025-005', customerName: 'Tech Solutions', amount: 67000, items: 'Software Licenses, Hardware' },
  { id: 'ORD-2025-006', customerName: 'Prime Industries', amount: 198000, items: 'Raw Materials, Equipment' },
  { id: 'ORD-2025-007', customerName: 'GHI Chemicals', amount: 145000, items: 'Chemical Containers, Safety Equipment' },
  { id: 'ORD-2025-008', customerName: 'JKL Food Processing', amount: 76000, items: 'Food Processing Equipment, Packaging' },
  { id: 'ORD-2025-009', customerName: 'MNO Pharmaceuticals', amount: 189000, items: 'Medical Equipment, Lab Supplies' },
  { id: 'ORD-2025-010', customerName: 'PQR Construction', amount: 98000, items: 'Construction Materials, Tools' }
];

export default function MyDeliveries() {
  // Permission hooks
  const permissions = useActionPermissions('sales', 'myDeliveries');
  
  // Get user role from auth context
  const { user } = useAuth();
  const userRole = user?.role || 'Sales';
  const isAdmin = userRole === 'Super User' || userRole === 'Unit Head';
  
  const [deliveries, setDeliveries] = useState(dummyDeliveries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

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
                You don't have permission to view My Deliveries module.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    orderNo: '',
    customerName: '',
    customerAddress: '',
    deliveryDate: '',
    timeSlot: '09:00 AM - 12:00 PM',
    driverName: '',
    vehicleNo: '',
    contactNumber: '',
    notes: ''
  });

  // Searchable dropdown states
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [orderSearchOpen, setOrderSearchOpen] = useState(false);

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || delivery.priority === priorityFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const today = new Date();
      const deliveryDate = new Date(delivery.deliveryDate);
      
      switch (dateFilter) {
        case 'today':
          matchesDate = deliveryDate.toDateString() === today.toDateString();
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          matchesDate = deliveryDate.toDateString() === tomorrow.toDateString();
          break;
        case 'week':
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);
          matchesDate = deliveryDate >= today && deliveryDate <= weekFromNow;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Delivered': return 'default';
      case 'In Transit': return 'secondary';
      case 'Scheduled': return 'outline';
      case 'Pending': return 'secondary';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="h-4 w-4" />;
      case 'In Transit': return <Truck className="h-4 w-4" />;
      case 'Scheduled': return <Clock className="h-4 w-4" />;
      case 'Pending': return <AlertCircle className="h-4 w-4" />;
      case 'Cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const resetForm = () => {
    setFormData({
      orderNo: '',
      customerName: '',
      customerAddress: '',
      deliveryDate: '',
      timeSlot: '09:00 AM - 12:00 PM',
      driverName: '',
      vehicleNo: '',
      contactNumber: '',
      notes: ''
    });
  };

  const handleCreate = () => {
    const newDelivery = {
      id: `D${(deliveries.length + 1).toString().padStart(3, '0')}`,
      ...formData,
      status: 'Scheduled', // Default status for new deliveries
      priority: 'Medium', // Default priority for new deliveries
      items: [],
      deliveredAt: null,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDeliveries([...deliveries, newDelivery]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEdit = (delivery) => {
    setSelectedDelivery(delivery);
    setFormData({
      orderNo: delivery.orderNo,
      customerName: delivery.customerName,
      customerAddress: delivery.customerAddress,
      deliveryDate: delivery.deliveryDate,
      timeSlot: delivery.timeSlot,
      driverName: delivery.driverName,
      vehicleNo: delivery.vehicleNo,
      contactNumber: delivery.contactNumber,
      status: delivery.status,
      priority: delivery.priority,
      notes: delivery.notes
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    const updatedDeliveries = deliveries.map(delivery =>
      delivery.id === selectedDelivery.id
        ? { ...delivery, ...formData }
        : delivery
    );
    setDeliveries(updatedDeliveries);
    setIsEditModalOpen(false);
    setSelectedDelivery(null);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      setDeliveries(deliveries.filter(delivery => delivery.id !== id));
    }
  };

  const handleView = (delivery) => {
    setSelectedDelivery(delivery);
    setIsViewModalOpen(true);
  };

  // Create form with isolated state to fix input focus issue
  const CreateDeliveryForm = () => {
    const [localFormData, setLocalFormData] = useState({
      orderNo: '',
      customerName: '',
      customerAddress: '',
      deliveryDate: '',
      timeSlot: '09:00 AM - 12:00 PM',
      driverName: '',
      vehicleNo: '',
      contactNumber: '',
      notes: ''
    });

    const handleSubmit = () => {
      if (!localFormData.orderNo || !localFormData.customerName || !localFormData.deliveryDate) {
        return;
      }
      
      const newDelivery = {
        id: `DEL${(deliveries.length + 1).toString().padStart(3, '0')}`,
        ...localFormData,
        status: 'Scheduled',
        estimatedDelivery: localFormData.deliveryDate,
        trackingCode: `TR${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setDeliveries([...deliveries, newDelivery]);
      setIsCreateModalOpen(false);
    };

    return <DeliveryFormUI formData={localFormData} setFormData={setLocalFormData} onSubmit={handleSubmit} onCancel={() => setIsCreateModalOpen(false)} submitText="Schedule Delivery" />;
  };

  // Edit form using existing formData state
  const EditDeliveryForm = () => (
    <DeliveryFormUI formData={formData} setFormData={setFormData} onSubmit={handleUpdate} onCancel={() => { setIsEditModalOpen(false); resetForm(); }} submitText="Update Delivery" />
  );

  const DeliveryFormUI = ({ formData, setFormData, onSubmit, onCancel, submitText }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Order Number *</Label>
          <Popover open={orderSearchOpen} onOpenChange={setOrderSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={orderSearchOpen}
                className="w-full justify-between"
              >
                {formData.orderNo || "Select order number..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search orders..." />
                <CommandEmpty>No order found.</CommandEmpty>
                <CommandGroup>
                  {dummyOrders.map((order) => (
                    <CommandItem
                      key={order.id}
                      value={order.id}
                      onSelect={(currentValue) => {
                        const selectedOrder = dummyOrders.find(o => o.id === currentValue);
                        if (selectedOrder) {
                          setFormData({ 
                            ...formData, 
                            orderNo: selectedOrder.id,
                            customerName: selectedOrder.customerName,
                            customerAddress: dummyCustomers.find(c => c.name === selectedOrder.customerName)?.address || ''
                          });
                        }
                        setOrderSearchOpen(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          formData.orderNo === order.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{order.id}</span>
                        <span className="text-sm text-muted-foreground">{order.customerName} - ₹{order.amount.toLocaleString()}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
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
                            customerAddress: selectedCustomer.address
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
                        <span className="text-sm text-muted-foreground">{customer.address}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="customerAddress">Customer Address *</Label>
          <Textarea
            id="customerAddress"
            value={formData.customerAddress}
            onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
            placeholder="Enter customer address"
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="deliveryDate">Delivery Date *</Label>
          <Input
            id="deliveryDate"
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="timeSlot">Time Slot</Label>
          <Select value={formData.timeSlot} onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="06:00 AM - 09:00 AM">06:00 AM - 09:00 AM</SelectItem>
              <SelectItem value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</SelectItem>
              <SelectItem value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</SelectItem>
              <SelectItem value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isAdmin && (
          <>
            <div>
              <Label htmlFor="driverName">Driver Name *</Label>
              <Input
                id="driverName"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                placeholder="Enter driver name"
              />
            </div>
            <div>
              <Label htmlFor="vehicleNo">Vehicle Number *</Label>
              <Input
                id="vehicleNo"
                value={formData.vehicleNo}
                onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                placeholder="Enter vehicle number"
              />
            </div>
          </>
        )}
        <div>
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input
            id="contactNumber"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            placeholder="Enter contact number"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Enter delivery notes"
            rows={3}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onSubmit} disabled={!formData.orderNo || !formData.customerName || !formData.deliveryDate}>
          {submitText}
        </Button>
      </div>
    </div>
  );

  // Calculate stats
  const stats = {
    total: deliveries.length,
    scheduled: deliveries.filter(d => d.status === 'Scheduled').length,
    inTransit: deliveries.filter(d => d.status === 'In Transit').length,
    delivered: deliveries.filter(d => d.status === 'Delivered').length
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Responsive Header */}
      <div className="bg-blue-600 text-white px-4 sm:px-6 py-4 rounded-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
            <h1 className="text-lg sm:text-xl font-semibold">My Deliveries</h1>
            <span className="hidden lg:inline text-blue-100 text-sm">Track and manage deliveries</span>
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
                  feature="myDeliveries" 
                  action="add"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-blue-50 text-sm px-3 py-2"
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Schedule Delivery</span>
                </ActionButton>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                <DialogHeader>
                  <DialogTitle>Schedule New Delivery</DialogTitle>
                  <DialogDescription>
                    Schedule a new delivery with customer information, timing, and driver details.
                  </DialogDescription>
                </DialogHeader>
                <CreateDeliveryForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deliveries</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Transit</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inTransit}</p>
              </div>
              <Truck className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
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
                placeholder="Search deliveries..."
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
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Deliveries ({filteredDeliveries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Details</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Delivery Info</TableHead>
                  {isAdmin && <TableHead>Driver & Vehicle</TableHead>}
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead>Priority</TableHead>}
                  {(permissions.canView || permissions.canEdit || permissions.canDelete) && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      <div>
                        <div className="font-medium">{delivery.orderNo}</div>
                        <div className="text-sm text-gray-500">{delivery.id}</div>
                        <div className="text-sm text-gray-500">{delivery.items.length} items</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{delivery.customerName}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate" title={delivery.customerAddress}>
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {delivery.customerAddress}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {delivery.deliveryDate}
                        </div>
                        <div className="text-sm text-gray-500">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {delivery.timeSlot}
                        </div>
                        {delivery.deliveredAt && (
                          <div className="text-sm text-green-600">
                            Delivered: {delivery.deliveredAt}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {delivery.driverName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Truck className="h-3 w-3 mr-1" />
                            {delivery.vehicleNo}
                          </div>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant={getStatusVariant(delivery.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(delivery.status)}
                        {delivery.status}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Badge variant={getPriorityVariant(delivery.priority)}>
                          {delivery.priority}
                        </Badge>
                      </TableCell>
                    )}
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
                              <DropdownMenuItem onClick={() => handleView(delivery)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            )}
                            {permissions.canEdit && (
                              <DropdownMenuItem onClick={() => handleEdit(delivery)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {permissions.canDelete && (
                              <DropdownMenuItem 
                                onClick={() => handleDelete(delivery.id)}
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
            <DialogTitle>Edit Delivery - {selectedDelivery?.orderNo}</DialogTitle>
            <DialogDescription>
              Update delivery information and modify delivery details.
            </DialogDescription>
          </DialogHeader>
          <EditDeliveryForm />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
            <DialogDescription>
              View complete delivery information and tracking details.
            </DialogDescription>
          </DialogHeader>
          {selectedDelivery && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Order Number</Label>
                  <p className="text-sm font-medium">{selectedDelivery.orderNo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Customer</Label>
                  <p className="text-sm font-medium">{selectedDelivery.customerName}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-500">Delivery Address</Label>
                  <p className="text-sm font-medium">{selectedDelivery.customerAddress}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Delivery Date</Label>
                  <p className="text-sm font-medium">{selectedDelivery.deliveryDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Time Slot</Label>
                  <p className="text-sm font-medium">{selectedDelivery.timeSlot}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Driver</Label>
                  <p className="text-sm font-medium">{selectedDelivery.driverName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Vehicle</Label>
                  <p className="text-sm font-medium">{selectedDelivery.vehicleNo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge variant={getStatusVariant(selectedDelivery.status)} className="flex items-center gap-1 w-fit">
                    {getStatusIcon(selectedDelivery.status)}
                    {selectedDelivery.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Priority</Label>
                  <Badge variant={getPriorityVariant(selectedDelivery.priority)}>
                    {selectedDelivery.priority}
                  </Badge>
                </div>
                {selectedDelivery.items && selectedDelivery.items.length > 0 && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">Items</Label>
                    <div className="space-y-1">
                      {selectedDelivery.items.map((item, index) => (
                        <p key={index} className="text-sm">
                          {item.name} - {item.quantity} {item.unit}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {selectedDelivery.notes && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">Notes</Label>
                    <p className="text-sm">{selectedDelivery.notes}</p>
                  </div>
                )}
                {selectedDelivery.deliveredAt && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">Delivered At</Label>
                    <p className="text-sm font-medium text-green-600">{selectedDelivery.deliveredAt}</p>
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