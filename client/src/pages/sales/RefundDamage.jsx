import React, { useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Plus, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2, 
  FileText,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Minus,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Settings
} from 'lucide-react';

// Bakery brands and products data
const bakeryData = {
  "Britannia": [
    { id: 1, name: "Good Day Cashew Cookies", price: 25, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&h=100&fit=crop" },
    { id: 2, name: "Marie Gold Biscuits", price: 15, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 3, name: "Milk Bikis", price: 20, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 4, name: "Bourbon Chocolate Cream", price: 35, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 5, name: "50-50 Maska Chaska", price: 30, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" }
  ],
  "Parle": [
    { id: 6, name: "Parle-G Gold", price: 10, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 7, name: "Hide & Seek Chocolate Chip", price: 40, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 8, name: "Monaco Classic Salted", price: 20, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 9, name: "Krackjack Sweet & Salty", price: 25, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 10, name: "Melody Chocolaty", price: 15, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" }
  ],
  "Sunfeast": [
    { id: 11, name: "Dark Fantasy Choco Fills", price: 50, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 12, name: "Mom's Magic Rich Butter", price: 45, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&h=100&fit=crop" },
    { id: 13, name: "Dream Cream Vanilla", price: 35, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 14, name: "Bounce Cake Bar", price: 55, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=100&h=100&fit=crop" },
    { id: 15, name: "Farmlite Digestive Oats", price: 40, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" }
  ],
  "Oreo": [
    { id: 16, name: "Oreo Original Sandwich", price: 30, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 17, name: "Oreo Chocolate Creme", price: 35, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 18, name: "Oreo Strawberry Creme", price: 35, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 19, name: "Oreo Vanilla Creme", price: 35, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" }
  ],
  "McVitie's": [
    { id: 20, name: "Digestive Original", price: 65, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 21, name: "Dark Chocolate Digestive", price: 75, image: "https://images.unsplash.com/photo-1558618047-b48ddb943bdf?w=100&h=100&fit=crop" },
    { id: 22, name: "Hobnobs Oats", price: 80, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 23, name: "Rich Tea Classic", price: 60, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" }
  ]
};

// Customer data
// Customer order history data
const customerOrderHistory = {
  "ABC Corporation": [
    { orderId: "ORD-001", brand: "Britannia", product: "Good Day Cashew Cookies", quantity: 5, price: 25, date: "2024-01-15" },
    { orderId: "ORD-001", brand: "Parle", product: "Parle-G Gold", quantity: 10, price: 10, date: "2024-01-15" },
    { orderId: "ORD-002", brand: "Sunfeast", product: "Dark Fantasy Choco Fills", quantity: 3, price: 50, date: "2024-01-10" }
  ],
  "XYZ Bakery": [
    { orderId: "ORD-003", brand: "Britannia", product: "Marie Gold Biscuits", quantity: 8, price: 15, date: "2024-01-14" },
    { orderId: "ORD-003", brand: "Oreo", product: "Oreo Original Cookies", quantity: 6, price: 40, date: "2024-01-14" },
    { orderId: "ORD-004", brand: "McVities", product: "Digestive Original", quantity: 4, price: 35, date: "2024-01-12" }
  ],
  "Fresh Foods Ltd": [
    { orderId: "ORD-005", brand: "Parle", product: "Hide & Seek Chocolate Chip", quantity: 7, price: 40, date: "2024-01-13" },
    { orderId: "ORD-005", brand: "Sunfeast", product: "Mom's Magic Rich Butter", quantity: 5, price: 30, date: "2024-01-13" }
  ],
  "City Mart": [
    { orderId: "ORD-006", brand: "Britannia", product: "Bourbon Chocolate Cream", quantity: 12, price: 35, date: "2024-01-11" },
    { orderId: "ORD-006", brand: "Parle", product: "Monaco Classic Salted", quantity: 8, price: 20, date: "2024-01-11" },
    { orderId: "ORD-007", brand: "Oreo", product: "Oreo Chocolate Cookies", quantity: 6, price: 45, date: "2024-01-09" }
  ],
  "Sweet Corner": [
    { orderId: "ORD-008", brand: "Sunfeast", product: "Bounce Cake Chocolate", quantity: 4, price: 25, date: "2024-01-08" },
    { orderId: "ORD-008", brand: "McVities", product: "Hobnobs Oats Cookies", quantity: 3, price: 45, date: "2024-01-08" }
  ],
  "Royal Bakery": [
    { orderId: "ORD-009", brand: "Britannia", product: "50-50 Maska Chaska", quantity: 15, price: 30, date: "2024-01-07" },
    { orderId: "ORD-009", brand: "Parle", product: "Krackjack Sweet & Salty", quantity: 9, price: 25, date: "2024-01-07" }
  ],
  "Golden Foods": [
    { orderId: "ORD-010", brand: "Oreo", product: "Oreo Strawberry Cookies", quantity: 5, price: 45, date: "2024-01-06" },
    { orderId: "ORD-010", brand: "Sunfeast", product: "Dream Cream Vanilla", quantity: 7, price: 35, date: "2024-01-06" }
  ],
  "Metro Store": [
    { orderId: "ORD-011", brand: "McVities", product: "Rich Tea Classic", quantity: 6, price: 30, date: "2024-01-05" },
    { orderId: "ORD-011", brand: "Britannia", product: "Milk Bikis", quantity: 10, price: 20, date: "2024-01-05" }
  ],
  "Tasty Treats": [
    { orderId: "ORD-012", brand: "Parle", product: "Melody Chocolaty", quantity: 8, price: 15, date: "2024-01-04" },
    { orderId: "ORD-012", brand: "Sunfeast", product: "Farmlite Digestive High Fibre", quantity: 4, price: 40, date: "2024-01-04" }
  ],
  "Sunrise Cafe": [
    { orderId: "ORD-013", brand: "Unibic", product: "Butter Cookies", quantity: 6, price: 50, date: "2024-01-03" },
    { orderId: "ORD-013", brand: "Oreo", product: "Oreo Vanilla Cookies", quantity: 4, price: 45, date: "2024-01-03" }
  ]
};

const customers = Object.keys(customerOrderHistory);

// Enhanced form component with customer order-based product selection
const CreateEntryForm = ({ onClose, editData = null }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: editData?.type || 'refund',
    customer: editData?.customerName || '',
    invoiceNumber: editData?.invoiceNumber || '',
    date: editData?.date || new Date().toISOString().split('T')[0],
    reason: editData?.reason || '',
    remarks: editData?.remarks || '',
    selectedProducts: editData?.products || []
  });

  const [customerOrders, setCustomerOrders] = useState([]);
  const [returnQuantities, setReturnQuantities] = useState({});

  // Load customer orders when customer is selected
  React.useEffect(() => {
    if (formData.customer && customerOrderHistory[formData.customer]) {
      setCustomerOrders(customerOrderHistory[formData.customer]);
      // Initialize return quantities
      const initialQuantities = {};
      customerOrderHistory[formData.customer].forEach((order, index) => {
        initialQuantities[index] = 0;
      });
      setReturnQuantities(initialQuantities);
    } else {
      setCustomerOrders([]);
      setReturnQuantities({});
    }
  }, [formData.customer]);

  // Initialize quantities for edit mode
  React.useEffect(() => {
    if (editData?.products) {
      const quantities = {};
      editData.products.forEach(product => {
        const key = `${product.brand}-${product.product}`;
        quantities[key] = product.quantity;
      });
      setReturnQuantities(quantities);
    }
  }, [editData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReturnQuantityChange = (orderIndex, quantity) => {
    const parsedQuantity = parseInt(quantity) || 0;
    const order = customerOrders[orderIndex];
    
    // Don't allow return quantity to exceed original order quantity
    const finalQuantity = Math.min(parsedQuantity, order.quantity);
    
    setReturnQuantities(prev => ({
      ...prev,
      [orderIndex]: finalQuantity
    }));
  };

  const calculateTotal = () => {
    return customerOrders.reduce((total, order, index) => {
      const returnQty = returnQuantities[index] || 0;
      return total + (returnQty * order.price);
    }, 0);
  };

  const getSelectedUnits = () => {
    return Object.values(returnQuantities).reduce((total, quantity) => total + (quantity || 0), 0);
  };

  const getSelectedProducts = () => {
    return customerOrders
      .map((order, index) => ({
        ...order,
        returnQuantity: returnQuantities[index] || 0
      }))
      .filter(order => order.returnQuantity > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customer || !formData.invoiceNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in customer and invoice number",
        variant: "destructive"
      });
      return;
    }

    const selectedProducts = getSelectedProducts();
    if (selectedProducts.length === 0) {
      toast({
        title: "Validation Error", 
        description: "Please enter return quantities for at least one product",
        variant: "destructive"
      });
      return;
    }

    // Generate or use existing entry ID
    const entryId = editData?.id || `${formData.type.toUpperCase().substring(0,2)}${String(Date.now()).slice(-4)}`;
    
    const entry = {
      id: entryId,
      type: formData.type,
      customerName: formData.customer,
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      reason: formData.reason,
      remarks: formData.remarks,
      products: selectedProducts.map(p => ({
        orderId: p.orderId,
        brand: p.brand,
        product: p.product,
        originalQuantity: p.quantity,
        returnQuantity: p.returnQuantity,
        unitPrice: p.price
      })),
      totalAmount: calculateTotal(),
      status: editData?.status || 'pending'
    };

    // Save to localStorage
    const existingEntries = JSON.parse(localStorage.getItem('refundDamageEntries') || '[]');
    
    if (editData) {
      // Update existing entry
      const index = existingEntries.findIndex(e => e.id === editData.id);
      if (index !== -1) {
        existingEntries[index] = entry;
      }
    } else {
      // Add new entry
      existingEntries.push(entry);
    }
    
    localStorage.setItem('refundDamageEntries', JSON.stringify(existingEntries));

    toast({
      title: "Success",
      description: `${formData.type === 'refund' ? 'Refund' : 'Damage'} entry ${editData ? 'updated' : 'created'} successfully`,
    });

    onClose();
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information - Mobile Optimized */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">Customer *</Label>
          <Select value={formData.customer} onValueChange={(value) => handleInputChange('customer', value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer} value={customer}>{customer}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Invoice Number *</Label>
          <Input
            placeholder="Enter invoice number"
            value={formData.invoiceNumber}
            onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
            className="h-11"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-medium">Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="damage">Damage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Customer Orders Display - Mobile Optimized */}
      {formData.customer && customerOrders.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-4 py-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Customer Orders</span>
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-300 font-medium">
                {getSelectedUnits()} units
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {customerOrders.map((order, index) => {
                const returnQty = returnQuantities[index] || 0;
                const productImage = bakeryData[order.brand]?.find(p => p.name === order.product)?.image;
                
                return (
                  <div key={index} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="p-3 space-y-2">
                      {/* Order Header - Mobile Optimized */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs font-medium">
                            {order.orderId}
                          </span>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{order.brand}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">₹{order.price}</div>
                          <div className="text-xs text-gray-500">per unit</div>
                        </div>
                      </div>

                      {/* Product Info - Mobile Layout */}
                      <div className="flex items-center space-x-3">
                        {productImage && (
                          <img 
                            src={productImage} 
                            alt={order.product}
                            className="w-10 h-10 rounded object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{order.product}</div>
                          <div className="text-xs text-gray-500">
                            Ordered: <span className="font-medium">{order.quantity}</span>
                          </div>
                        </div>
                      </div>

                      {/* Return Quantity Input - Mobile Optimized */}
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Return Quantity</span>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="0"
                            max={order.quantity}
                            value={returnQty}
                            onChange={(e) => handleReturnQuantityChange(index, e.target.value)}
                            className="w-16 h-8 text-center text-sm font-medium border-gray-300"
                            placeholder="0"
                          />
                          <span className="text-xs text-gray-500">/ {order.quantity}</span>
                        </div>
                      </div>

                      {/* Amount Display for Mobile */}
                      {returnQty > 0 && (
                        <div className="text-center">
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">
                            Return Amount: ₹{returnQty * order.price}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {formData.customer && customerOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No previous orders found for this customer</p>
            <p className="text-sm text-gray-400">Please select a different customer or check order history</p>
          </CardContent>
        </Card>
      )}

      {/* Return Summary - Mobile Optimized */}
      {getSelectedProducts().length > 0 && (
        <Card className="shadow-sm border-green-200 dark:border-green-800">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 px-4 py-3">
            <CardTitle className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">Return Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="space-y-2">
              {getSelectedProducts().map((product, index) => (
                <div key={index} className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {product.brand} - {product.product}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.orderId} • Qty: {product.returnQuantity}/{product.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-green-600">₹{product.returnQuantity * product.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                  Total {formData.type === 'refund' ? 'Refund' : 'Damage'}:
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ₹{calculateTotal()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information - Mobile Optimized */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">Reason</Label>
          <Input
            placeholder="Enter reason for refund/damage"
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            className="h-11"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Remarks</Label>
          <Textarea
            placeholder="Additional comments or notes"
            value={formData.remarks}
            onChange={(e) => handleInputChange('remarks', e.target.value)}
            rows={2}
            className="resize-none"
          />
        </div>
      </div>

      {/* Form Actions - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="h-11 order-2 sm:order-1">
          Cancel
        </Button>
        <Button type="submit" className="h-11 order-1 sm:order-2">
          {editData ? 'Update' : 'Create'} {formData.type === 'refund' ? 'Refund' : 'Damage'}
        </Button>
      </div>
    </form>
  );
};

const RefundDamage = () => {
  const { hasFeatureAccess } = usePermissions();
  const { toast } = useToast();
  
  // Check permissions
  const permissions = {
    canView: hasFeatureAccess('sales', 'refundReturn', 'view'),
    canAdd: hasFeatureAccess('sales', 'refundReturn', 'add'),
    canEdit: hasFeatureAccess('sales', 'refundReturn', 'edit'),
    canDelete: hasFeatureAccess('sales', 'refundReturn', 'delete')
  };

  if (!permissions.canView) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to view Refund/Damage.</p>
        </div>
      </div>
    );
  }

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Dummy data
  const [entries] = useState([
    {
      id: 'RD001',
      customerName: 'ABC Corporation',
      invoiceNumber: 'INV-2024-001',
      productName: 'Fresh Bread Loaf',
      quantity: 5,
      unitPrice: 45.00,
      totalAmount: 225.00,
      type: 'refund',
      status: 'pending',
      reason: 'Quality issue',
      date: '2024-01-15',
      remarks: 'Customer reported stale product'
    },
    {
      id: 'RD002', 
      customerName: 'XYZ Bakery',
      invoiceNumber: 'INV-2024-002',
      productName: 'Chocolate Cake',
      quantity: 2,
      unitPrice: 350.00,
      totalAmount: 700.00,
      type: 'damage',
      status: 'approved',
      reason: 'Transport damage',
      date: '2024-01-14',
      remarks: 'Damaged during delivery'
    },
    {
      id: 'RD003',
      customerName: 'Fresh Foods Ltd',
      invoiceNumber: 'INV-2024-003',
      productName: 'Burger Buns',
      quantity: 50,
      unitPrice: 8.00,
      totalAmount: 400.00,
      type: 'refund',
      status: 'completed',
      reason: 'Wrong specifications',
      date: '2024-01-13',
      remarks: 'Delivered wrong size buns'
    },
    {
      id: 'RD004',
      customerName: 'City Restaurant',
      invoiceNumber: 'INV-2024-004',
      productName: 'Croissants',
      quantity: 24,
      unitPrice: 15.00,
      totalAmount: 360.00,
      type: 'damage',
      status: 'rejected',
      reason: 'Manufacturing defect',
      date: '2024-01-12',
      remarks: 'Claim rejected - no defect found'
    }
  ]);

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesType = typeFilter === 'all' || entry.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Stats calculation
  const stats = {
    total: entries.length,
    pending: entries.filter(e => e.status === 'pending').length,
    approved: entries.filter(e => e.status === 'approved').length,
    completed: entries.filter(e => e.status === 'completed').length
  };

  // Badge variants
  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'completed': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeVariant = (type) => {
    return type === 'refund' ? 'default' : 'outline';
  };

  // Handle actions
  const handleView = (entry) => {
    setSelectedEntry(entry);
    setIsViewModalOpen(true);
  };

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleStatusUpdate = (entry) => {
    setSelectedEntry(entry);
    setIsStatusModalOpen(true);
  };

  const updateStatus = (newStatus) => {
    const existingEntries = JSON.parse(localStorage.getItem('refundDamageEntries') || '[]');
    const updatedEntries = existingEntries.map(entry => 
      entry.id === selectedEntry.id 
        ? { ...entry, status: newStatus }
        : entry
    );
    localStorage.setItem('refundDamageEntries', JSON.stringify(updatedEntries));
    
    toast({
      title: "Success",
      description: `Status updated to ${newStatus}`,
    });
    
    setIsStatusModalOpen(false);
    window.location.reload();
  };

  const handleDelete = (id) => {
    toast({
      title: "Deleted",
      description: "Refund/Damage entry deleted successfully",
      variant: "destructive",
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshed",
      description: "Data has been refreshed",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with blue gradient matching Orders pattern */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <FileText className="h-8 w-8 mr-3 text-white" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Refund/Damage</h1>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            {permissions.canAdd && (
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                size="sm"
                className="bg-white text-blue-600 hover:bg-blue-50 h-9 w-9 p-0 rounded-md"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <Button 
              onClick={handleRefresh}
              size="sm"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 h-9 w-9 p-0 rounded-md"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      {/* Entry List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Entry List</h2>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CUSTOMER</TableHead>
                  <TableHead className="text-center">STATUS</TableHead>
                  {(permissions.canView || permissions.canEdit || permissions.canDelete) && (
                    <TableHead className="text-center w-32">ACTIONS</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Package className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No entries found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{entry.customerName}</span>
                          <span className="text-sm text-gray-500">{entry.id}</span>
                          <span className="text-sm text-gray-500">
                            {entry.type === 'refund' ? 'Refund' : 'Damage'} • {entry.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusVariant(entry.status)}>
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </Badge>
                      </TableCell>
                      {(permissions.canView || permissions.canEdit || permissions.canDelete) && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-0">
                            {permissions.canView && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleView(entry)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {permissions.canEdit && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEdit(entry)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusUpdate(entry)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            {permissions.canDelete && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDelete(entry.id)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Entry Details</DialogTitle>
            <DialogDescription>
              View complete refund/damage entry information.
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Entry Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Entry ID:</span> {selectedEntry.id}</p>
                    <p><span className="font-medium">Type:</span> {selectedEntry.type === 'refund' ? 'Refund' : 'Damage'}</p>
                    <p><span className="font-medium">Status:</span> {selectedEntry.status}</p>
                    <p><span className="font-medium">Date:</span> {selectedEntry.date}</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Customer Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Customer:</span> {selectedEntry.customerName}</p>
                    <p><span className="font-medium">Invoice:</span> {selectedEntry.invoiceNumber}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Product & Amount</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><span className="font-medium">Product:</span> {selectedEntry.productName}</p>
                    <p><span className="font-medium">Quantity:</span> {selectedEntry.quantity}</p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="font-medium">Unit Price:</span> ₹{selectedEntry.unitPrice}</p>
                    <p><span className="font-medium">Total Amount:</span> ₹{selectedEntry.totalAmount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Reason & Remarks</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Reason:</span> {selectedEntry.reason}</p>
                  <p><span className="font-medium">Remarks:</span> {selectedEntry.remarks}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Modal - Mobile Optimized */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto mx-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-lg">Create New Entry</DialogTitle>
            <DialogDescription className="text-sm">
              Add a new refund or damage entry.
            </DialogDescription>
          </DialogHeader>
          <CreateEntryForm onClose={() => setIsCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal - Mobile Optimized */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto mx-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-lg">Edit Entry</DialogTitle>
            <DialogDescription className="text-sm">
              Modify refund or damage entry details.
            </DialogDescription>
          </DialogHeader>
          <CreateEntryForm onClose={() => setIsEditModalOpen(false)} editData={selectedEntry} />
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Change the status of this refund/damage entry.
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">Entry Details</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Customer:</span> {selectedEntry.customerName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Type:</span> {selectedEntry.type === 'refund' ? 'Refund' : 'Damage'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Current Status:</span> 
                  <Badge variant={getStatusVariant(selectedEntry.status)} className="ml-2">
                    {selectedEntry.status.charAt(0).toUpperCase() + selectedEntry.status.slice(1)}
                  </Badge>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Select New Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'approved', 'completed', 'rejected'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedEntry.status === status ? "default" : "outline"}
                      onClick={() => updateStatus(status)}
                      className="w-full"
                      disabled={selectedEntry.status === status}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsStatusModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RefundDamage;