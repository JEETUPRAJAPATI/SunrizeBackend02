import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus, Search, MapPin, X, Menu } from 'lucide-react';

export default function CustomerList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerType: '',
    status: '',
    gstin: '',
    contactName: '',
    mobile: '',
    email: '',
    addressLine1: '',
    city: '',
    state: '',
    country: 'India',
    pin: '',
    notes: ''
  });

  // Customer data matching the reference images
  const customers = [
    {
      id: 'D-401',
      customerName: 'Sri Venkateswara Enterprises',
      customerType: 'Distributor',
      status: 'Active',
      gstin: '22AAAAA0000A1Z5',
      contactName: 'Manohar Byreddy',
      mobile: '9395133107',
      email: 'mbyreddy@gmail.com',
      addressLine1: '8/2/15 Opp. Bus Station',
      city: 'Renigunta',
      state: 'Andhra Pradesh',
      country: 'India',
      pin: '512586',
      createdDate: '21/04/2025',
      notes: 'Category notes show up here. An example of multi-line comments if needed.'
    },
    {
      id: 'C-123',
      customerName: 'Padmavathi Bakery',
      customerType: 'Retailer',
      status: 'Active',
      gstin: '22BBBBB0000B1Z5',
      contactName: 'Padmavathi Reddy',
      mobile: '9876543210',
      email: 'padmavathi@gmail.com',
      addressLine1: 'Main Road, Near Temple',
      city: 'Tirupati',
      state: 'Andhra Pradesh',
      country: 'India',
      pin: '517501',
      createdDate: '15/03/2025',
      notes: 'Regular customer with good payment history.'
    },
    {
      id: 'C-112',
      customerName: 'Tirumala Tiffins',
      customerType: 'Restaurant',
      status: 'Active',
      gstin: '22CCCCC0000C1Z5',
      contactName: 'Venkatesh Kumar',
      mobile: '9123456789',
      email: 'tirumala@gmail.com',
      addressLine1: 'Temple Street',
      city: 'Tirumala',
      state: 'Andhra Pradesh',
      country: 'India',
      pin: '517504',
      createdDate: '10/02/2025',
      notes: 'Bulk orders on weekends.'
    },
    {
      id: 'B-206',
      customerName: 'Sri Vidya Nikethan Canteen',
      customerType: 'Institution',
      status: 'Active',
      gstin: '22DDDDD0000D1Z5',
      contactName: 'Rajesh Sharma',
      mobile: '9234567890',
      email: 'canteen@svidya.edu.in',
      addressLine1: 'College Campus',
      city: 'Tirupati',
      state: 'Andhra Pradesh',
      country: 'India',
      pin: '517502',
      createdDate: '05/01/2025',
      notes: 'Educational institution canteen.'
    },
    {
      id: 'C-001',
      customerName: 'Lorven Eatery',
      customerType: 'Restaurant',
      status: 'Inactive',
      gstin: '22EEEEE0000E1Z5',
      contactName: 'Suresh Babu',
      mobile: '9345678901',
      email: 'lorven@gmail.com',
      addressLine1: 'Bus Stand Road',
      city: 'Chandragiri',
      state: 'Andhra Pradesh',
      country: 'India',
      pin: '517101',
      createdDate: '20/12/2024',
      notes: 'Payment issues - follow up required.'
    },
    {
      id: 'S-273',
      customerName: 'SV Food Court',
      customerType: 'Food Court',
      status: 'Active',
      gstin: '22FFFFF0000F1Z5',
      contactName: 'Prasad Rao',
      mobile: '9456789012',
      email: 'svfood@gmail.com',
      addressLine1: 'Shopping Mall, 2nd Floor',
      city: 'Tirupati',
      state: 'Andhra Pradesh',
      country: 'India',
      pin: '517501',
      createdDate: '18/11/2024',
      notes: 'Monthly billing preferred.'
    },
    {
      id: 'S-287',
      customerName: 'Sri Renuka Sweets',
      customerType: 'Sweet Shop',
      status: 'Active',
      gstin: '22GGGGG0000G1Z5',
      contactName: 'Renuka Devi',
      mobile: '9567890123',
      email: 'renuka@gmail.com',
      addressLine1: 'Gandhi Road',
      city: 'Tirupati',
      state: 'Andhra Pradesh',
      country: 'India',
      pin: '517501',
      createdDate: '25/10/2024',
      notes: 'Festival season bulk orders.'
    },
    {
      id: 'C-107',
      customerName: 'Saranya Bhawan',
      customerType: 'Restaurant',
      status: 'Active',
      gstin: '22HHHHH0000H1Z5',
      contactName: 'Saranya Reddy',
      mobile: '9678901234',
      email: 'saranya@gmail.com',
      addressLine1: 'Railway Station Road',
      city: 'Renigunta',
      state: 'Andhra Pradesh',
      country: 'India',
      pin: '517520',
      createdDate: '12/09/2024',
      notes: 'Daily orders, good customer.'
    },
    {
      id: 'D-413',
      customerName: 'Raheem Kova Buns & More',
      customerType: 'Bakery',
      status: 'Active',
      gstin: '22IIIII0000I1Z5',
      contactName: 'Abdul Raheem',
      mobile: '9789012345',
      email: 'raheem@gmail.com',
      addressLine1: 'Market Street',
      city: 'Puttur',
      state: 'Andhra Pradesh',
      country: 'India',
      pin: '517583',
      createdDate: '08/08/2024',
      notes: 'Specializes in traditional items.'
    },
    {
      id: 'B-213',
      customerName: 'Meeting Point 2 Eat',
      customerType: 'Cafe',
      status: 'Active',
      gstin: '22JJJJJ0000J1Z5',
      contactName: 'Vamsi Krishna',
      mobile: '9890123456',
      email: 'meetingpoint@gmail.com',
      addressLine1: 'IT Park, Ground Floor',
      city: 'Tirupati',
      state: 'Andhra Pradesh',
      country: 'India',
      pin: '517507',
      createdDate: '30/07/2024',
      notes: 'Corporate cafe with regular orders.'
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm) return true;
    
    const searchField = selectedColumn === 'name' ? customer.customerName :
                       selectedColumn === 'id' ? customer.id :
                       selectedColumn === 'email' ? customer.email :
                       selectedColumn === 'phone' ? customer.mobile :
                       customer.customerName;
    
    return searchField.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleMoreClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleAddCustomer = () => {
    console.log('Adding customer:', formData);
    setShowAddModal(false);
    setFormData({
      customerName: '',
      customerType: '',
      status: '',
      gstin: '',
      contactName: '',
      mobile: '',
      email: '',
      addressLine1: '',
      city: '',
      state: '',
      country: 'India',
      pin: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header with Logo and Menu */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6 text-gray-800" />
            <div className="flex items-center space-x-2">
              <div className="bg-red-600 text-white rounded-full px-3 py-1 text-sm font-bold">
                EveryDay
              </div>
              <span className="text-gray-800 font-medium">Sunrise Foods.</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-black text-xs font-bold">👤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">👤</span>
            </div>
            <h1 className="text-lg font-medium text-gray-900">Customers</h1>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-sm font-medium rounded-full"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm text-gray-600 mb-2">
                Select Search Column
              </label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger className="w-full h-10 border-gray-300">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Customer Name</SelectItem>
                  <SelectItem value="id">Customer ID</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-sm text-gray-600 mb-2">
                Search
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 pr-10 border-gray-300"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white">
        {/* Table Header */}
        <div className="border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4 px-4 py-3">
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">CUS #</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">CUSTOMER NAME</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">STATUS</div>
            <div></div>
          </div>
        </div>

        {/* Customer Rows */}
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
            <div className="grid grid-cols-4 gap-4 px-4 py-4 items-center">
              <div className="text-sm font-medium text-gray-900">
                {customer.id}
              </div>
              <div className="text-sm text-gray-900">
                {customer.customerName}
              </div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  customer.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="ghost"
                  onClick={() => handleMoreClick(customer)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium uppercase p-0 h-auto"
                >
                  MORE
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="border-t border-gray-200">
          <div className="flex items-center justify-center py-4">
            <div className="text-sm text-gray-600">
              Showing 1 - 10 of 10
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-sm p-0 max-h-[90vh] overflow-y-auto">
          {selectedCustomer && (
            <div className="bg-white">
              {/* Modal Header - Customer Row Style */}
              <div className="border-b border-gray-100">
                <div className="grid grid-cols-4 gap-4 px-4 py-4 items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {selectedCustomer.id}
                  </div>
                  <div className="text-sm text-gray-900">
                    {selectedCustomer.customerName}
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      selectedCustomer.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 text-sm font-medium uppercase p-0 h-auto"
                    >
                      LESS
                    </Button>
                  </div>
                </div>
              </div>

              {/* Customer Details - Exactly as shown in screenshot */}
              <div className="px-4 py-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Customer Type</div>
                    <div className="text-sm font-medium text-gray-900">{selectedCustomer.customerType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Account Status</div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        selectedCustomer.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div className="text-sm text-gray-900">{selectedCustomer.status}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Created Date</div>
                    <div className="text-sm text-gray-900">{selectedCustomer.createdDate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">GSTIN</div>
                    <div className="text-sm text-gray-900">{selectedCustomer.gstin}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Contact Name</div>
                    <div className="text-sm text-gray-900">{selectedCustomer.contactName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">E-mail</div>
                    <div className="text-sm text-red-600">{selectedCustomer.email}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Mobile</div>
                    <div className="text-sm text-gray-900">{selectedCustomer.mobile}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Address</div>
                    <div className="text-sm text-gray-900">{selectedCustomer.addressLine1}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">City</div>
                    <div className="text-sm text-gray-900">{selectedCustomer.city}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">State</div>
                    <div className="text-sm text-gray-900">{selectedCustomer.state}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">PIN</div>
                    <div className="text-sm text-gray-900">{selectedCustomer.pin}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Country</div>
                    <div className="text-sm text-gray-900">{selectedCustomer.country}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 mb-1">Google Pin</div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-sm text-red-600 underline cursor-pointer">Google Map Link</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 mb-1">Category Note</div>
                  <div className="text-sm text-gray-900">{selectedCustomer.notes}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Customer Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md p-0 max-h-[90vh] overflow-y-auto">
          <div className="bg-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-900">Add Customer</h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={handleAddCustomer}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded"
                >
                  Submit
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-6 py-4 space-y-6">
              {/* Primary Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  ▼ Primary Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Customer Name</label>
                    <Input
                      type="text"
                      placeholder="Enter business name"
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      className="h-10 border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Customer Type</label>
                    <Select value={formData.customerType} onValueChange={(value) => setFormData(prev => ({ ...prev, customerType: value }))}>
                      <SelectTrigger className="h-10 border-gray-300">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distributor">Distributor</SelectItem>
                        <SelectItem value="retailer">Retailer</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="institution">Institution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Status</label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="h-10 border-gray-300">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">GSTIN</label>
                    <Input
                      type="text"
                      placeholder="22AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={(e) => setFormData(prev => ({ ...prev, gstin: e.target.value }))}
                      className="h-10 border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  ▼ Contact Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Contact Name</label>
                    <Input
                      type="text"
                      placeholder="Enter Contact Name"
                      value={formData.contactName}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                      className="h-10 border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Mobile</label>
                    <Input
                      type="tel"
                      placeholder="9005861923"
                      value={formData.mobile}
                      onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                      className="h-10 border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">E-mail</label>
                    <Input
                      type="email"
                      placeholder="youremail@domain.in"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-10 border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Address Line 1</label>
                    <Input
                      type="text"
                      placeholder="8/2/15 Opposite to Central Bus Station"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
                      className="h-10 border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">City</label>
                    <Input
                      type="text"
                      placeholder="8/2/15 Opposite to Central Bus Station"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="h-10 border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">State</label>
                    <Input
                      type="text"
                      placeholder="8/2/15 Opposite to Central Bus Station"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      className="h-10 border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Country</label>
                      <Input
                        type="text"
                        placeholder="India"
                        value={formData.country}
                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        className="h-10 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">PIN</label>
                      <Input
                        type="text"
                        placeholder="512356"
                        value={formData.pin}
                        onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value }))}
                        className="h-10 border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Notes</label>
                <textarea
                  placeholder="Any added notes show up here. An example of multi-line comments if needed."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 resize-none"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}