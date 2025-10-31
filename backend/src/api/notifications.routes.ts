import { Router, Request, Response } from 'express';
import { handleError, ValidationError } from '../utils/errors';
import { EmailNotificationService } from '../services/email-notification.service';
import { SMSNotificationService } from '../services/sms-notification.service';

const router = Router();
const emailService = new EmailNotificationService();
const smsService = new SMSNotificationService();

// In-memory storage for notification preferences
const notificationPreferences: Map<string, any> = new Map();

// In-memory storage for notification logs
const notificationLogs: any[] = [];

/**
 * GET /api/notifications/preferences
 * Get customer notification preferences
 * Query: { email }
 */
router.get('/api/notifications/preferences', async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      throw new ValidationError('Missing email parameter', {
        email: ['Email is required'],
      });
    }

    const prefs = notificationPreferences.get(email as string) || {
      email: email as string,
      emailNotifications: {
        orderConfirmation: true,
        shippingUpdates: true,
        deliveryConfirmation: true,
        promotions: false,
      },
      smsNotifications: {
        orderConfirmation: false,
        shippingUpdates: false,
        deliveryConfirmation: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    res.json({
      success: true,
      data: prefs,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * POST /api/notifications/preferences
 * Save customer notification preferences
 * Body: { email, emailNotifications, smsNotifications }
 */
router.post('/api/notifications/preferences', async (req: Request, res: Response) => {
  try {
    const { email, emailNotifications, smsNotifications } = req.body;

    if (!email) {
      throw new ValidationError('Missing required fields', {
        email: ['Email is required'],
      });
    }

    const prefs = {
      email,
      emailNotifications: emailNotifications || {
        orderConfirmation: true,
        shippingUpdates: true,
        deliveryConfirmation: true,
        promotions: false,
      },
      smsNotifications: smsNotifications || {
        orderConfirmation: false,
        shippingUpdates: false,
        deliveryConfirmation: false,
      },
      createdAt: notificationPreferences.get(email)?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    notificationPreferences.set(email, prefs);

    res.json({
      success: true,
      data: prefs,
      message: 'Notification preferences updated successfully',
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/admin/notifications/logs
 * Get notification delivery logs (admin only)
 * Query: { status, type, page, limit }
 */
router.get('/api/admin/notifications/logs', async (req: Request, res: Response) => {
  try {
    const { status, type, page = '1', limit = '20' } = req.query;

    let filtered = [...notificationLogs];

    if (status) {
      filtered = filtered.filter((log) => log.status === status);
    }

    if (type) {
      filtered = filtered.filter((log) => log.type === type);
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;

    const paginatedLogs = filtered.slice(start, end);

    res.json({
      success: true,
      data: paginatedLogs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limitNum),
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/admin/notifications/logs/:id
 * Get specific notification log detail
 */
router.get('/api/admin/notifications/logs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const log = notificationLogs.find((l) => l.id === id);

    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Notification log not found',
        code: 'NOT_FOUND',
      });
    }

    res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * POST /api/notifications/send-test
 * Send test notification (admin only)
 * Body: { email, phone, type }
 */
router.post('/api/notifications/send-test', async (req: Request, res: Response) => {
  try {
    const { email, phone, type } = req.body;

    if (!email || !type) {
      throw new ValidationError('Missing required fields', {
        email: !email ? ['Email is required'] : [],
        type: !type ? ['Type is required'] : [],
      });
    }

    const validTypes = ['order_confirmation', 'shipping_update', 'delivery_confirmation'];
    if (!validTypes.includes(type)) {
      throw new ValidationError('Invalid notification type', {
        type: ['Type must be one of: order_confirmation, shipping_update, delivery_confirmation'],
      });
    }

    // Log the notification
    const logEntry = {
      id: `notif_${Date.now()}`,
      type,
      channel: 'email',
      recipient: email,
      status: 'sent',
      retries: 0,
      createdAt: new Date(),
      sentAt: new Date(),
      content: `Test notification: ${type}`,
    };

    notificationLogs.push(logEntry);

    // Send based on type
    if (type === 'order_confirmation') {
      await emailService.sendOrderConfirmation(email, {
        orderId: 'test_order',
        orderNumber: 'TEST-001',
        customerName: 'Test Customer',
        total: 99.99,
        items: [{ name: 'Test Product', quantity: 1 }],
      });
    } else if (type === 'shipping_update') {
      await emailService.sendShippingUpdate(email, {
        trackingNumber: 'TEST123456',
        orderNumber: 'TEST-001',
        status: 'in_transit',
        estimatedDelivery: '2024-11-05',
      });
    } else if (type === 'delivery_confirmation') {
      await emailService.sendDeliveryConfirmation(email, {
        trackingNumber: 'TEST123456',
        orderNumber: 'TEST-001',
        deliveryDate: new Date().toISOString().split('T')[0],
      });
    }

    res.json({
      success: true,
      message: 'Test notification sent successfully',
      data: logEntry,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

export default router;
