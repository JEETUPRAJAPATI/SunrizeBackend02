import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User, 
  Calendar, 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useLocation } from 'wouter';

const SalesDashboard = () => {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Mock salesman data
  const salesmanData = {
    name: user?.fullName || 'Sales Person',
    salesmanNumber: 'TPT-Sales-8489',
    lastLogin: '11:23 AM IST',
    profileStatus: 'Active'
  };

  // Order summary stats
  const orderSummary = {
    totalOrders: 36,
    delivered: 29,
    inProgress: 4,
    preparation: 3
  };

  // Recent orders (indents) data
  const recentOrders = [
    {
      id: '986673639',
      orderDate: '21/04/2025',
      status: 'Created',
      statusColor: 'blue',
      customer: 'ABC Corporation',
      items: 3,
      totalQuantity: 150
    },
    {
      id: '986673638',
      orderDate: '21/04/2025',
      status: 'Cancelled',
      statusColor: 'red',
      customer: 'XYZ Industries',
      items: 2,
      totalQuantity: 75
    },
    {
      id: '986673637',
      orderDate: '21/04/2025',
      status: 'Processing',
      statusColor: 'yellow',
      customer: 'Tech Solutions',
      items: 5,
      totalQuantity: 200
    },
    {
      id: '932567120',
      orderDate: '18/04/2025',
      status: 'Out For Delivery',
      statusColor: 'green',
      customer: 'Global Corp',
      items: 4,
      totalQuantity: 120
    },
    {
      id: '919619617',
      orderDate: '10/04/2025',
      status: 'Delivered',
      statusColor: 'green',
      customer: 'Prime Industries',
      items: 6,
      totalQuantity: 300
    }
  ];

  // Recent invoices data
  const recentInvoices = [
    {
      id: 'INV-2025-001',
      customerName: 'ABC Manufacturing Ltd',
      invoiceDate: '2025-01-07',
      dueDate: '2025-02-06',
      totalAmount: 147500,
      status: 'Paid',
      statusColor: 'green'
    },
    {
      id: 'INV-2025-002',
      customerName: 'XYZ Industries Corp',
      invoiceDate: '2025-01-08',
      dueDate: '2025-02-07',
      totalAmount: 98750,
      status: 'Partially Paid',
      statusColor: 'yellow'
    },
    {
      id: 'INV-2025-003',
      customerName: 'PQR Steel Works',
      invoiceDate: '2025-01-09',
      dueDate: '2025-02-08',
      totalAmount: 125000,
      status: 'Pending',
      statusColor: 'blue'
    },
    {
      id: 'INV-2025-004',
      customerName: 'LMN Auto Parts',
      invoiceDate: '2025-01-08',
      dueDate: '2025-02-07',
      totalAmount: 87500,
      status: 'Paid',
      statusColor: 'green'
    }
  ];

  const getStatusBadgeVariant = (color) => {
    switch (color) {
      case 'green': return 'default';
      case 'blue': return 'secondary';
      case 'yellow': return 'outline';
      case 'red': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'out for delivery':
        return <CheckCircle className="h-3 w-3" />;
      case 'processing':
      case 'created':
        return <Clock className="h-3 w-3" />;
      case 'cancelled':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleNewOrder = () => {
    setLocation('/sales/orders');
  };

  const handleViewAll = () => {
    setLocation('/sales/orders');
  };

  const handleViewAllInvoices = () => {
    setLocation('/sales/my-invoices');
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Salesman: {salesmanData.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Last logged in at {salesmanData.lastLogin}</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleNewOrder}
            className="bg-white text-blue-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Order Summary Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                  {orderSummary.totalOrders}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {orderSummary.delivered}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {orderSummary.inProgress}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {orderSummary.preparation}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Preparation</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-500" />
              <CardTitle>Recent Orders</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewAll}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(order.statusColor)}
                      className="flex items-center gap-1 w-fit"
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      VIEW
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Invoices Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-500" />
              <CardTitle>Recent Invoices</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewAllInvoices}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>₹{invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(invoice.statusColor)}
                      className="flex items-center gap-1 w-fit"
                    >
                      {invoice.status === 'Paid' ? <CheckCircle className="h-3 w-3" /> :
                       invoice.status === 'Pending' ? <Clock className="h-3 w-3" /> :
                       invoice.status === 'Partially Paid' ? <AlertTriangle className="h-3 w-3" /> :
                       <Package className="h-3 w-3" />}
                      {invoice.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Order Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Number</label>
                  <p className="text-sm font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Date</label>
                  <p className="text-sm font-medium">{selectedOrder.orderDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer</label>
                  <p className="text-sm font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge 
                    variant={getStatusBadgeVariant(selectedOrder.statusColor)}
                    className="flex items-center gap-1 w-fit"
                  >
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Items</label>
                  <p className="text-sm font-medium">{selectedOrder.items} items</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Quantity</label>
                  <p className="text-sm font-medium">{selectedOrder.totalQuantity} units</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-2">Order Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Order created on {selectedOrder.orderDate}</span>
                  </div>
                  {selectedOrder.status !== 'Created' && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Status updated to {selectedOrder.status}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesDashboard;