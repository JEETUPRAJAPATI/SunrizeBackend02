import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileText, Search, X } from 'lucide-react';

export default function MyInvoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    invoiceDate: '',
    dueDate: '',
    totalAmount: '',
    paidAmount: '',
    status: '',
    items: '',
    notes: ''
  });

  // Invoice data matching the customer UI style
  const invoices = [
    {
      id: 'INV-001',
      invoiceNumber: 'INV-001',
      customerName: 'Sri Venkateswara Enterprises',
      invoiceDate: '21/04/2025',
      dueDate: '05/05/2025',
      totalAmount: 'INR 1,280.00',
      paidAmount: 'INR 1,280.00',
      status: 'Paid',
      items: 'Buns - 5 pcs (4), Premium Milk 400 gms (5), Fruit Cup Cakes 6 Pcs (6)',
      notes: 'Payment received on time.'
    },
    {
      id: 'INV-002',
      invoiceNumber: 'INV-002',
      customerName: 'Padmavathi Bakery',
      invoiceDate: '15/04/2025',
      dueDate: '30/04/2025',
      totalAmount: 'INR 950.00',
      paidAmount: 'INR 950.00',
      status: 'Paid',
      items: 'Bread (10), Sweet Buns (5), Cookies (3)',
      notes: 'Regular customer with good payment history.'
    },
    {
      id: 'INV-003',
      invoiceNumber: 'INV-003',
      customerName: 'Tirumala Tiffins',
      invoiceDate: '10/04/2025',
      dueDate: '25/04/2025',
      totalAmount: 'INR 2,150.00',
      paidAmount: 'INR 1,000.00',
      status: 'Partial',
      items: 'Tiffin Items (15), Snacks (8), Beverages (5)',
      notes: 'Partial payment received, balance pending.'
    },
    {
      id: 'INV-004',
      invoiceNumber: 'INV-004',
      customerName: 'Sri Vidya Nikethan Canteen',
      invoiceDate: '05/04/2025',
      dueDate: '20/04/2025',
      totalAmount: 'INR 3,500.00',
      paidAmount: 'INR 3,500.00',
      status: 'Paid',
      items: 'Bulk Canteen Supplies (20), Snacks (12), Beverages (8)',
      notes: 'Educational institution canteen order.'
    },
    {
      id: 'INV-005',
      invoiceNumber: 'INV-005',
      customerName: 'Lorven Eatery',
      invoiceDate: '01/04/2025',
      dueDate: '16/04/2025',
      totalAmount: 'INR 1,750.00',
      paidAmount: 'INR 0.00',
      status: 'Pending',
      items: 'Restaurant Supplies (8), Breads (6), Sweets (4)',
      notes: 'Payment pending - follow up required.'
    },
    {
      id: 'INV-006',
      invoiceNumber: 'INV-006',
      customerName: 'SV Food Court',
      invoiceDate: '28/03/2025',
      dueDate: '12/04/2025',
      totalAmount: 'INR 2,800.00',
      paidAmount: 'INR 2,800.00',
      status: 'Paid',
      items: 'Food Court Items (18), Beverages (10), Snacks (7)',
      notes: 'Monthly billing completed.'
    },
    {
      id: 'INV-007',
      invoiceNumber: 'INV-007',
      customerName: 'Sri Renuka Sweets',
      invoiceDate: '25/03/2025',
      dueDate: '09/04/2025',
      totalAmount: 'INR 4,200.00',
      paidAmount: 'INR 2,500.00',
      status: 'Partial',
      items: 'Festival Sweets (25), Traditional Items (15), Snacks (10)',
      notes: 'Festival season order - partial payment.'
    },
    {
      id: 'INV-008',
      invoiceNumber: 'INV-008',
      customerName: 'Saranya Bhawan',
      invoiceDate: '20/03/2025',
      dueDate: '04/04/2025',
      totalAmount: 'INR 1,650.00',
      paidAmount: 'INR 1,650.00',
      status: 'Paid',
      items: 'Daily Order Items (12), Breads (8), Sweets (5)',
      notes: 'Daily orders, good customer.'
    },
    {
      id: 'INV-009',
      invoiceNumber: 'INV-009',
      customerName: 'Raheem Kova Buns & More',
      invoiceDate: '15/03/2025',
      dueDate: '30/03/2025',
      totalAmount: 'INR 2,300.00',
      paidAmount: 'INR 2,300.00',
      status: 'Paid',
      items: 'Traditional Buns (20), Kova Items (10), Special Breads (8)',
      notes: 'Specializes in traditional items.'
    },
    {
      id: 'INV-010',
      invoiceNumber: 'INV-010',
      customerName: 'Meeting Point 2 Eat',
      invoiceDate: '10/03/2025',
      dueDate: '25/03/2025',
      totalAmount: 'INR 1,950.00',
      paidAmount: 'INR 1,950.00',
      status: 'Paid',
      items: 'Cafe Items (15), Beverages (12), Snacks (8)',
      notes: 'Corporate cafe with regular orders.'
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    if (!searchTerm) return true;
    
    const searchField = selectedColumn === 'customer' ? invoice.customerName :
                       selectedColumn === 'id' ? invoice.id :
                       selectedColumn === 'amount' ? invoice.totalAmount :
                       selectedColumn === 'status' ? invoice.status :
                       invoice.customerName;
    
    return searchField.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleMoreClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleAddInvoice = () => {
    console.log('Adding invoice:', formData);
    setShowAddModal(false);
    setFormData({
      customerName: '',
      invoiceDate: '',
      dueDate: '',
      totalAmount: '',
      paidAmount: '',
      status: '',
      items: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6">
        {/* Invoice Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <FileText className="h-3 w-3 text-white" />
              </div>
              <h1 className="text-lg font-medium text-gray-900">Invoices</h1>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-sm font-medium rounded-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Add Invoice
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
                    <SelectItem value="customer">Customer Name</SelectItem>
                    <SelectItem value="id">Invoice ID</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
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

        {/* Invoice List */}
        <div className="bg-white">
          {/* Table Header */}
          <div className="border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4 px-4 py-3">
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">INV #</div>
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">CUSTOMER NAME</div>
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">STATUS</div>
              <div></div>
            </div>
          </div>

          {/* Invoice Rows */}
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
              <div className="grid grid-cols-4 gap-4 px-4 py-4 items-center">
                <div className="text-sm font-medium text-gray-900">
                  {invoice.id}
                </div>
                <div className="text-sm text-gray-900">
                  {invoice.customerName}
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    invoice.status === 'Paid' ? 'bg-green-500' : 
                    invoice.status === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="ghost"
                    onClick={() => handleMoreClick(invoice)}
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
      </div>

      {/* Invoice Details Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-sm p-0 max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Invoice Details</DialogTitle>
          <DialogDescription className="sr-only">View invoice information and details</DialogDescription>
          {selectedInvoice && (
            <div className="bg-white">
              {/* Modal Header - Invoice Row Style */}
              <div className="border-b border-gray-100">
                <div className="grid grid-cols-3 gap-4 px-4 py-4 items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {selectedInvoice.id}
                  </div>
                  <div className="text-sm text-gray-900">
                    {selectedInvoice.customerName}
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      selectedInvoice.status === 'Paid' ? 'bg-green-500' : 
                      selectedInvoice.status === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="px-4 py-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Invoice Date</div>
                    <div className="text-sm font-medium text-gray-900">{selectedInvoice.invoiceDate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Due Date</div>
                    <div className="text-sm text-gray-900">{selectedInvoice.dueDate}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Total Amount</div>
                    <div className="text-sm font-medium text-gray-900">{selectedInvoice.totalAmount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Paid Amount</div>
                    <div className="text-sm text-gray-900">{selectedInvoice.paidAmount}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Payment Status</div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        selectedInvoice.status === 'Paid' ? 'bg-green-500' : 
                        selectedInvoice.status === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div className="text-sm text-gray-900">{selectedInvoice.status}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Invoice Number</div>
                    <div className="text-sm text-gray-900">{selectedInvoice.invoiceNumber}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 mb-1">Items</div>
                  <div className="text-sm text-gray-900">{selectedInvoice.items}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 mb-1">Notes</div>
                  <div className="text-sm text-gray-900">{selectedInvoice.notes}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Invoice Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md p-0 max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Add Invoice</DialogTitle>
          <DialogDescription className="sr-only">Add a new invoice to the system</DialogDescription>
          <div className="bg-white">
            {/* Modal Header */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-900">Add Invoice</h2>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-6 py-4 space-y-6">
              {/* Invoice Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  ▼ Invoice Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Customer Name</label>
                    <Input
                      type="text"
                      placeholder="Select customer"
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      className="h-10 border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Invoice Date</label>
                      <Input
                        type="date"
                        value={formData.invoiceDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                        className="h-10 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Due Date</label>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="h-10 border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Total Amount</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.totalAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: e.target.value }))}
                        className="h-10 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Paid Amount</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.paidAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, paidAmount: e.target.value }))}
                        className="h-10 border-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Status</label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="h-10 border-gray-300">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Items</label>
                <textarea
                  placeholder="List of items in this invoice..."
                  value={formData.items}
                  onChange={(e) => setFormData(prev => ({ ...prev, items: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Notes</label>
                <textarea
                  placeholder="Any additional notes for this invoice..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 resize-none"
                />
              </div>
            </div>
            
            {/* Modal Footer with Submit Button */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddInvoice}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}