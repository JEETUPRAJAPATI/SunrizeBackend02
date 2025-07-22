import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getSalesSummary,
  getSalesRecentOrders
} from '../controllers/orderController.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// POST /api/orders - Create new order
router.post('/', createOrder);

// GET /api/orders - Get all orders with filtering and pagination
router.get('/', getOrders);

// GET /api/orders/:id - Get single order by ID
router.get('/:id', getOrderById);

// PUT /api/orders/:id - Update order
router.put('/:id', updateOrder);

// PATCH /api/orders/:id/status - Update order status only
router.patch('/:id/status', updateOrderStatus);

// DELETE /api/orders/:id - Delete order
router.delete('/:id', deleteOrder);

export default router;

// Create separate sales router for sales dashboard endpoints
export const salesRouter = express.Router();

// Apply authentication to all sales routes
salesRouter.use(authenticateToken);

// GET /api/sales/summary - Get sales summary stats
salesRouter.get('/summary', getSalesSummary);

// GET /api/sales/recent-orders - Get recent orders
salesRouter.get('/recent-orders', getSalesRecentOrders);