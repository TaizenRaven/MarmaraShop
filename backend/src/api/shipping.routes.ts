import { Router, Request, Response } from 'express';
import { OzonExpressService } from '../services/ozonexpress.service';
import { handleError, ValidationError } from '../utils/errors';

const router = Router();
const ozonExpressService = new OzonExpressService(
  process.env.OZONEXPRESS_API_KEY || '',
  process.env.OZONEXPRESS_API_SECRET || '',
  process.env.OZONEXPRESS_ACCOUNT_ID || '',
  process.env.OZONEXPRESS_API_URL || ''
);

/**
 * POST /api/store/shipping/calculate
 * Calculate shipping rates based on destination
 * Body: { city, postalCode, country, weight, value }
 */
router.post('/api/store/shipping/calculate', async (req: Request, res: Response) => {
  try {
    const { city, postalCode, country, weight = 1, value = 0 } = req.body;

    if (!city || !postalCode || !country) {
      throw new ValidationError('Missing required fields', {
        city: city ? [] : ['City is required'],
        postalCode: postalCode ? [] : ['Postal code is required'],
        country: country ? [] : ['Country is required'],
      });
    }

    // Get shipping rates from OzonExpress
    const shippingRates = await ozonExpressService.getShippingRates(
      `${city}, ${country}`,
      weight
    );

    res.json({
      success: true,
      data: {
        destination: {
          city,
          postalCode,
          country,
        },
        weight,
        rates: shippingRates,
        calculated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/store/shipments/track/:trackingNumber
 * Track shipment status
 */
router.get('/api/store/shipments/track/:trackingNumber', async (req: Request, res: Response) => {
  try {
    const { trackingNumber } = req.params;

    const trackingData = await ozonExpressService.trackShipment(trackingNumber);

    res.json({
      success: true,
      data: trackingData,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * POST /api/admin/shipments/create
 * Create shipment in OzonExpress (Admin only)
 * Body: { orderId, items, shippingAddress, shippingCity, shippingPostalCode, shippingCountry, customerPhone, customerEmail }
 */
router.post('/api/admin/shipments/create', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    const {
      orderId,
      items,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      shippingCountry,
      customerPhone,
      customerEmail,
      weight = 1,
    } = req.body;

    if (!orderId || !shippingAddress || !shippingCity || !shippingPostalCode) {
      throw new ValidationError('Missing required shipment fields', {
        orderId: orderId ? [] : ['Order ID is required'],
        shippingAddress: shippingAddress ? [] : ['Shipping address is required'],
        shippingCity: shippingCity ? [] : ['City is required'],
        shippingPostalCode: shippingPostalCode ? [] : ['Postal code is required'],
      });
    }

    const shipmentData = {
      order_id: orderId,
      items,
      delivery_address: shippingAddress,
      delivery_city: shippingCity,
      delivery_postal_code: shippingPostalCode,
      delivery_country: shippingCountry || 'USA',
      customer_phone: customerPhone,
      customer_email: customerEmail,
      weight,
    };

    // Create shipment in OzonExpress
    const shipment = await ozonExpressService.createShipment(orderId, shipmentData);

    res.status(201).json({
      success: true,
      data: {
        shipmentId: shipment.id,
        trackingNumber: shipment.tracking_number,
        status: shipment.status,
        estimatedDelivery: shipment.estimated_delivery,
        message: 'Shipment created successfully',
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/admin/shipments
 * List all shipments (Admin only)
 * Query: status, page, limit
 */
router.get('/api/admin/shipments', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    // TODO: Implement shipment listing from database
    res.json({
      success: true,
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/admin/shipments/:trackingNumber
 * Get shipment details (Admin only)
 */
router.get('/api/admin/shipments/:trackingNumber', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    const { trackingNumber } = req.params;

    const shipment = await ozonExpressService.trackShipment(trackingNumber);

    res.json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * POST /api/webhooks/ozonexpress
 * Webhook receiver for OzonExpress shipment updates
 */
router.post('/api/webhooks/ozonexpress', async (req: Request, res: Response) => {
  try {
    const { event, shipment_id, status, tracking_number, location, timestamp } = req.body;

    // TODO: Verify webhook signature
    // const isValid = ozonExpressService.validateWebhookSignature(signature, payload);

    // TODO: Update order status based on shipment status
    // Map OzonExpress status to order status
    const statusMap: Record<string, string> = {
      'accepted': 'processing',
      'in_transit': 'shipped',
      'out_for_delivery': 'shipped',
      'delivered': 'delivered',
      'failed': 'cancelled',
      'returned': 'cancelled',
    };

    const orderStatus = statusMap[status] || 'processing';

    // TODO: Update order in database
    // TODO: Trigger notifications

    res.json({
      success: true,
      message: 'Webhook received and processed',
      data: {
        shipment_id,
        status,
        order_status: orderStatus,
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

export default router;
