import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowLeftRight, Search, Plus, Trash2 } from 'lucide-react';

export default function RefundReturn() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    invoiceNumber: '',
    products: [{ productId: '', productName: '', unitPrice: '', quantity: '', damageQuantity: '', reason: '' }],
    type: 'refund',
    date: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  // Sample products for dropdown
  const products = [
    { id: 'P001', name: 'Premium Bread', unitPrice: 25 },
    { id: 'P002', name: 'Sweet Buns', unitPrice: 35 },
    { id: 'P003', name: 'Cake Mix', unitPrice: 120 },
    { id: 'P004', name: 'Cookies Pack', unitPrice: 80 },
    { id: 'P005', name: 'Fruit Juice', unitPrice: 45 }
  ];

  // Sample customers for dropdown
  const customers = [
    { id: 'C001', name: 'Sri Venkateswara Enterprises' },
    { id: 'C002', name: 'Padmavathi Bakery' },
    { id: 'C003', name: 'Tirumala Tiffins' },
    { id: 'C004', name: 'SV Food Court' },
    { id: 'C005', name: 'Lorven Eatery' }
  ];

  // Refund & Return entries matching Order Management style
  const entries = [
    {
      id: 'RR-001',
      refundReturnId: 'RR-001',
      customerName: 'Sri Venkateswara Enterprises',
      invoiceNumber: 'INV-001',
      type: 'Refund',
      totalQuantity: 15,
      damageQuantity: 3,
      status: 'Pending',
      date: '21/04/2025',
      reason: 'Quality issue with bread items'
    },
    {
      id: 'RR-002',
      refundReturnId: 'RR-002',
      customerName: 'Padmavathi Bakery',
      invoiceNumber: 'INV-002',
      type: 'Return',
      totalQuantity: 8,
      damageQuantity: 0,
      status: 'Approved',
      date: '20/04/2025',
      reason: 'Wrong items delivered'
    },
    {
      id: 'RR-003',
      refundReturnId: 'RR-003',
      customerName: 'Tirumala Tiffins',
      invoiceNumber: 'INV-003',
      type: 'Refund',
      totalQuantity: 12,
      damageQuantity: 5,
      status: 'Completed',
      date: '19/04/2025',
      reason: 'Damaged packaging'
    },
    {
      id: 'RR-004',
      refundReturnId: 'RR-004',
      customerName: 'SV Food Court',
      invoiceNumber: 'INV-004',
      type: 'Return',
      totalQuantity: 20,
      damageQuantity: 2,
      status: 'Pending',
      date: '18/04/2025',
      reason: 'Excess quantity ordered'
    },
    {
      id: 'RR-005',
      refundReturnId: 'RR-005',
      customerName: 'Lorven Eatery',
      invoiceNumber: 'INV-005',
      type: 'Refund',
      totalQuantity: 6,
      damageQuantity: 1,
      status: 'Rejected',
      date: '17/04/2025',
      reason: 'Late delivery complaint'
    }
  ];

  const filteredEntries = entries.filter(entry => {
    if (!searchTerm) return true;
    
    const searchField = selectedColumn === 'customer' ? entry.customerName :
                       selectedColumn === 'id' ? entry.id :
                       selectedColumn === 'invoice' ? entry.invoiceNumber :
                       selectedColumn === 'type' ? entry.type :
                       entry.customerName;
    
    return searchField.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleMoreClick = (entry) => {
    setSelectedEntry(entry);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    if (field === 'productId') {
      const selectedProduct = products.find(p => p.id === value);
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: value,
        productName: selectedProduct?.name || '',
        unitPrice: selectedProduct?.unitPrice || ''
      };
    } else {
      updatedProducts[index][field] = value;
    }
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { productId: '', productName: '', unitPrice: '', quantity: '', damageQuantity: '', reason: '' }]
    }));
  };

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      setFormData(prev => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotalQuantity = () => {
    return formData.products.reduce((total, product) => {
      return total + (parseInt(product.quantity) || 0);
    }, 0);
  };

  const handleAddEntry = () => {
    console.log('Adding refund/return entry:', formData);
    setShowAddModal(false);
    setFormData({
      customerId: '',
      invoiceNumber: '',
      products: [{ productId: '', productName: '', unitPrice: '', quantity: '', damageQuantity: '', reason: '' }],
      type: 'refund',
      date: new Date().toISOString().split('T')[0],
      remarks: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <ArrowLeftRight className="h-3 w-3 text-white" />
              </div>
              <h1 className="text-lg font-medium text-gray-900">Refund & Return</h1>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-sm font-medium rounded-full"
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Add Refund & Return
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
                    <SelectItem value="id">RR ID</SelectItem>
                    <SelectItem value="invoice">Invoice Number</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
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

        {/* Refund & Return List */}
        <div className="bg-white">
          {/* Table Header */}
          <div className="border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4 px-4 py-3">
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">RR #</div>
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">CUSTOMER NAME</div>
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">STATUS</div>
              <div></div>
            </div>
          </div>

          {/* Entry Rows */}
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
              <div className="grid grid-cols-4 gap-4 px-4 py-4 items-center">
                <div className="text-sm font-medium text-gray-900">
                  {entry.id}
                </div>
                <div className="text-sm text-gray-900">
                  {entry.customerName}
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    entry.status === 'Completed' || entry.status === 'Approved' ? 'bg-green-500' : 
                    entry.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="ghost"
                    onClick={() => handleMoreClick(entry)}
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
                Showing 1 - 5 of 5
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entry Details Modal */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-sm p-0 max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Refund & Return Details</DialogTitle>
          <DialogDescription className="sr-only">View refund and return entry information</DialogDescription>
          {selectedEntry && (
            <div className="bg-white">
              {/* Modal Header - Entry Row Style */}
              <div className="border-b border-gray-100">
                <div className="grid grid-cols-3 gap-4 px-4 py-4 items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {selectedEntry.id}
                  </div>
                  <div className="text-sm text-gray-900">
                    {selectedEntry.customerName}
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      selectedEntry.status === 'Completed' || selectedEntry.status === 'Approved' ? 'bg-green-500' : 
                      selectedEntry.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                </div>
              </div>

              {/* Entry Details */}
              <div className="px-4 py-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Date</div>
                    <div className="text-sm font-medium text-gray-900">{selectedEntry.date}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Invoice Number</div>
                    <div className="text-sm text-gray-900">{selectedEntry.invoiceNumber}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Type</div>
                    <div className="text-sm font-medium text-gray-900">{selectedEntry.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Status</div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        selectedEntry.status === 'Completed' || selectedEntry.status === 'Approved' ? 'bg-green-500' : 
                        selectedEntry.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div className="text-sm text-gray-900">{selectedEntry.status}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Total Quantity</div>
                    <div className="text-sm font-medium text-gray-900">{selectedEntry.totalQuantity}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Damage Quantity</div>
                    <div className="text-sm text-gray-900">{selectedEntry.damageQuantity}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 mb-1">Reason</div>
                  <div className="text-sm text-gray-900">{selectedEntry.reason}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Refund & Return Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl p-0 max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Add Refund & Return</DialogTitle>
          <DialogDescription className="sr-only">Add a new refund and return entry to the system</DialogDescription>
          <div className="bg-white">
            {/* Modal Header */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <ArrowLeftRight className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-900">Add Refund & Return</h2>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-6 py-4 space-y-6">
              {/* Basic Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  ▼ Basic Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Customer *</label>
                      <Select value={formData.customerId} onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}>
                        <SelectTrigger className="h-10 border-gray-300">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map(customer => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Invoice Number *</label>
                      <Input
                        type="text"
                        placeholder="INV-001"
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                        className="h-10 border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Type</label>
                      <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="h-10 border-gray-300">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="refund">Refund</SelectItem>
                          <SelectItem value="return">Return</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Date</label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="h-10 border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  ▼ Products *
                </h3>
                <div className="space-y-4">
                  {formData.products.map((product, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-medium text-gray-700">Product {index + 1}</h4>
                        {formData.products.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(index)}
                            className="text-red-600 hover:text-red-700 p-1 h-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Product *</label>
                          <Select 
                            value={product.productId} 
                            onValueChange={(value) => handleProductChange(index, 'productId', value)}
                          >
                            <SelectTrigger className="h-10 border-gray-300">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map(prod => (
                                <SelectItem key={prod.id} value={prod.id}>{prod.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Unit Price</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={product.unitPrice}
                            readOnly
                            className="h-10 border-gray-300 bg-gray-50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Total Quantity *</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                            className="h-10 border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Damage Quantity</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={product.damageQuantity}
                            onChange={(e) => handleProductChange(index, 'damageQuantity', e.target.value)}
                            className="h-10 border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Total: {calculateTotalQuantity()}</label>
                          <div className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-700 flex items-center">
                            Auto calculated
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Reason</label>
                        <Input
                          type="text"
                          placeholder="Enter reason for refund/return"
                          value={product.reason}
                          onChange={(e) => handleProductChange(index, 'reason', e.target.value)}
                          className="h-10 border-gray-300"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addProduct}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Product
                  </Button>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Additional Remarks</label>
                <textarea
                  placeholder="Any additional notes or remarks..."
                  value={formData.remarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
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
                  onClick={handleAddEntry}
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