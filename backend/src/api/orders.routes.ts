import { Router, Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { validateOrderData, formatValidationErrors } from '../utils/validation';
import { handleError, NotFoundError, ValidationError } from '../utils/errors';

const router = Router();
const orderService = new OrderService();

/**
 * GET /api/store/checkout/summary
 * Get current cart summary (for review before submission)
 */
router.get('/api/store/checkout/summary', async (req: Request, res: Response) => {
  try {
    // TODO: Get cart from session or request body
    res.json({
      success: true,
      data: {
        items: [],
        subtotal: 0,
        tax: 0,
        shippingCost: 0,
        total: 0,
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * POST /api/store/checkout/submit
 * Create order from cart (COD payment)
 * Body: { items, customerEmail, customerPhone, deliveryAddress, deliveryCity, deliveryPostalCode }
 */
router.post('/api/store/checkout/submit', async (req: Request, res: Response) => {
  try {
    const { error, value } = validateOrderData(req.body);

    if (error) {
      throw new ValidationError('Order validation failed', formatValidationErrors(error));
    }

    // Validate stock availability
    const stockValid = await orderService.validateStockAvailability(value.items);
    if (!stockValid) {
      throw new ValidationError('Some items are out of stock', {
        items: ['One or more items are no longer available'],
      });
    }

    // Calculate totals
    let subtotal = 0;
    value.items.forEach((item: any) => {
      subtotal += item.price * item.quantity;
    });

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    // Create order
    const orderData = {
      customer_id: req.body.customerId || `guest_${Date.now()}`,
      guest_email: req.body.customerEmail,
      guest_phone: req.body.customerPhone,
      delivery_address: value.deliveryAddress,
      delivery_city: value.deliveryCity,
      delivery_postal_code: value.deliveryPostalCode,
      subtotal,
      tax_amount: tax,
      shipping_cost: 0, // TODO: Calculate from OzonExpress
      total,
      status: 'pending',
      cod_status: 'pending',
    };

    const order = await orderService.createOrder(orderData);

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: `ORD-${Date.now()}`,
        status: 'pending',
        total: order.total,
        customerEmail: order.guest_email,
        message: 'Order created successfully. Please wait for confirmation.',
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/store/orders/:orderId
 * Get order details (authenticated users only)
 */
router.get('/api/store/orders/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await orderService.getOrderById(orderId);
    if (!order) {
      throw new NotFoundError('Order', orderId);
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/store/guest/track-order
 * Track order as guest (no authentication required)
 * Query params: email, tracking_code
 */
router.get('/api/store/guest/track-order', async (req: Request, res: Response) => {
  try {
    const { email, tracking_code } = req.query;

    if (!email || !tracking_code) {
      throw new ValidationError('Missing required parameters', {
        email: email ? [] : ['Email is required'],
        tracking_code: tracking_code ? [] : ['Tracking code is required'],
      });
    }

    // TODO: Find order by email and tracking code
    // For now, return mock order
    res.json({
      success: true,
      data: {
        orderId: 'order_123',
        orderNumber: 'ORD-1234567890',
        status: 'shipped',
        trackingNumber: `OZ${tracking_code}`,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        items: [],
        total: 0,
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/admin/orders
 * List all orders (Admin only)
 * Query params: status, page, limit, search
 */
router.get('/api/admin/orders', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    const { status, page = 1, limit = 20, search } = req.query;

    const filters = {
      status: status as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
    };

    const orders = await orderService.listOrders(filters);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: orders.length,
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/admin/orders/:orderId
 * Get order details (Admin only)
 */
router.get('/api/admin/orders/:orderId', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    const { orderId } = req.params;

    const order = await orderService.getOrderById(orderId);
    if (!order) {
      throw new NotFoundError('Order', orderId);
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * PATCH /api/admin/orders/:orderId
 * Update order status (Admin only)
 * Body: { status, codStatus, notes }
 */
router.patch('/api/admin/orders/:orderId', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    const { orderId } = req.params;
    const { status, codStatus, notes } = req.body;

    if (!status && !codStatus) {
      throw new ValidationError('No updates provided', {
        status: ['Provide status or codStatus to update'],
      });
    }

    let order = await orderService.getOrderById(orderId);
    if (!order) {
      throw new NotFoundError('Order', orderId);
    }

    // Update order status
    if (status) {
      order = await orderService.updateOrderStatus(orderId, status);
    }

    // Update COD status
    if (codStatus) {
      order = await orderService.updateCODStatus(orderId, codStatus);
    }

    res.json({
      success: true,
      data: order,
      message: 'Order updated successfully',
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/admin/orders/customer/:customerId
 * Get all orders for a customer (Admin only)
 */
router.get('/api/admin/orders/customer/:customerId', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    const { customerId } = req.params;

    const orders = await orderService.getOrdersByCustomer(customerId);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

export default router;
