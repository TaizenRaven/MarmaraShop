export interface NotificationTemplate {
  subject: string;
  body: string;
  html: string;
}

export class EmailNotificationService {
  private apiKey: string;
  private fromEmail: string;

  constructor(apiKey: string = process.env.SENDGRID_API_KEY || '', fromEmail: string = 'noreply@marmara.shop') {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(
    toEmail: string,
    orderData: {
      orderId: string;
      orderNumber: string;
      customerName: string;
      total: number;
      items: any[];
    }
  ): Promise<boolean> {
    try {
      const template = this.getOrderConfirmationTemplate(orderData);
      await this.sendEmail(toEmail, template);
      return true;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }
  }

  /**
   * Send shipping update email
   */
  async sendShippingUpdate(
    toEmail: string,
    shipmentData: {
      trackingNumber: string;
      orderNumber: string;
      status: string;
      estimatedDelivery: string;
    }
  ): Promise<boolean> {
    try {
      const template = this.getShippingUpdateTemplate(shipmentData);
      await this.sendEmail(toEmail, template);
      return true;
    } catch (error) {
      console.error('Failed to send shipping update email:', error);
      return false;
    }
  }

  /**
   * Send delivery confirmation email
   */
  async sendDeliveryConfirmation(
    toEmail: string,
    deliveryData: {
      trackingNumber: string;
      orderNumber: string;
      deliveryDate: string;
    }
  ): Promise<boolean> {
    try {
      const template = this.getDeliveryConfirmationTemplate(deliveryData);
      await this.sendEmail(toEmail, template);
      return true;
    } catch (error) {
      console.error('Failed to send delivery confirmation email:', error);
      return false;
    }
  }

  /**
   * Send generic email
   */
  private async sendEmail(toEmail: string, template: NotificationTemplate): Promise<void> {
    // Mock implementation - in production, integrate with SendGrid or similar service
    console.log(`[EMAIL] To: ${toEmail}`);
    console.log(`[EMAIL] Subject: ${template.subject}`);
    console.log(`[EMAIL] Body: ${template.body}`);

    // TODO: Integrate with SendGrid API
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(this.apiKey);
    // await sgMail.send({
    //   to: toEmail,
    //   from: this.fromEmail,
    //   subject: template.subject,
    //   text: template.body,
    //   html: template.html,
    // });
  }

  /**
   * Get order confirmation email template
   */
  private getOrderConfirmationTemplate(orderData: any): NotificationTemplate {
    return {
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      body: `
Hello ${orderData.customerName},

Thank you for your order! We've received your order and will start processing it right away.

Order Number: ${orderData.orderNumber}
Order ID: ${orderData.orderId}
Total: $${orderData.total.toFixed(2)}

Your order contains:
${orderData.items.map((item: any) => `- ${item.name} (Qty: ${item.quantity})`).join('\n')}

You can track your order status at: https://marmara.shop/track-order

If you have any questions, please don't hesitate to contact us.

Best regards,
MarmaraShop Team
      `,
      html: `
<html>
  <body style="font-family: Arial, sans-serif;">
    <h2>Order Confirmation</h2>
    <p>Hello ${orderData.customerName},</p>
    <p>Thank you for your order! We've received your order and will start processing it right away.</p>
    <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
    <p><strong>Total:</strong> $${orderData.total.toFixed(2)}</p>
    <h3>Items:</h3>
    <ul>
      ${orderData.items.map((item: any) => `<li>${item.name} (Qty: ${item.quantity})</li>`).join('')}
    </ul>
    <p><a href="https://marmara.shop/track-order?tracking=${orderData.orderNumber}">Track your order</a></p>
  </body>
</html>
      `,
    };
  }

  /**
   * Get shipping update email template
   */
  private getShippingUpdateTemplate(shipmentData: any): NotificationTemplate {
    return {
      subject: `Your order is ${shipmentData.status} - ${shipmentData.orderNumber}`,
      body: `
Your order ${shipmentData.orderNumber} is now ${shipmentData.status}!

Tracking Number: ${shipmentData.trackingNumber}
Estimated Delivery: ${shipmentData.estimatedDelivery}

Track your shipment: https://marmara.shop/track-order?tracking=${shipmentData.trackingNumber}

Thank you for shopping with MarmaraShop!
      `,
      html: `
<html>
  <body style="font-family: Arial, sans-serif;">
    <h2>Shipment Update</h2>
    <p>Your order <strong>${shipmentData.orderNumber}</strong> is now <strong>${shipmentData.status}</strong>!</p>
    <p><strong>Tracking Number:</strong> ${shipmentData.trackingNumber}</p>
    <p><strong>Estimated Delivery:</strong> ${shipmentData.estimatedDelivery}</p>
    <p><a href="https://marmara.shop/track-order?tracking=${shipmentData.trackingNumber}">Track your shipment</a></p>
  </body>
</html>
      `,
    };
  }

  /**
   * Get delivery confirmation email template
   */
  private getDeliveryConfirmationTemplate(deliveryData: any): NotificationTemplate {
    return {
      subject: `Delivery Confirmed - ${deliveryData.orderNumber}`,
      body: `
Your order has been delivered!

Order Number: ${deliveryData.orderNumber}
Tracking Number: ${deliveryData.trackingNumber}
Delivery Date: ${deliveryData.deliveryDate}

Thank you for shopping with MarmaraShop!
      `,
      html: `
<html>
  <body style="font-family: Arial, sans-serif;">
    <h2>Delivery Confirmed</h2>
    <p>Your order has been delivered!</p>
    <p><strong>Order Number:</strong> ${deliveryData.orderNumber}</p>
    <p><strong>Tracking Number:</strong> ${deliveryData.trackingNumber}</p>
    <p><strong>Delivery Date:</strong> ${deliveryData.deliveryDate}</p>
    <p>Thank you for shopping with MarmaraShop!</p>
  </body>
</html>
      `,
    };
  }
}
