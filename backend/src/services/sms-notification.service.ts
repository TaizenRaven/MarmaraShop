export class SMSNotificationService {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor(
    accountSid: string = process.env.TWILIO_ACCOUNT_SID || '',
    authToken: string = process.env.TWILIO_AUTH_TOKEN || '',
    fromNumber: string = process.env.TWILIO_PHONE_NUMBER || '+1234567890'
  ) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Simple validation - check if it starts with + and has 10+ digits
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Send order confirmation SMS
   */
  async sendOrderConfirmationSMS(
    phoneNumber: string,
    orderData: {
      orderNumber: string;
      total: number;
    }
  ): Promise<boolean> {
    try {
      if (!this.validatePhoneNumber(phoneNumber)) {
        console.error('Invalid phone number:', phoneNumber);
        return false;
      }

      const message = `Order Confirmation: Your order ${orderData.orderNumber} has been placed. Total: $${orderData.total.toFixed(2)}. Track it at: marmara.shop/track`;
      await this.sendSMS(phoneNumber, message);
      return true;
    } catch (error) {
      console.error('Failed to send order confirmation SMS:', error);
      return false;
    }
  }

  /**
   * Send shipping update SMS
   */
  async sendShippingUpdateSMS(
    phoneNumber: string,
    shipmentData: {
      trackingNumber: string;
      orderNumber: string;
      status: string;
      estimatedDelivery: string;
    }
  ): Promise<boolean> {
    try {
      if (!this.validatePhoneNumber(phoneNumber)) {
        console.error('Invalid phone number:', phoneNumber);
        return false;
      }

      const message = `Shipping Update: Order ${shipmentData.orderNumber} is ${shipmentData.status}. Estimated delivery: ${shipmentData.estimatedDelivery}. Track: marmara.shop/track`;
      await this.sendSMS(phoneNumber, message);
      return true;
    } catch (error) {
      console.error('Failed to send shipping update SMS:', error);
      return false;
    }
  }

  /**
   * Send delivery confirmation SMS
   */
  async sendDeliveryConfirmationSMS(
    phoneNumber: string,
    deliveryData: {
      trackingNumber: string;
      orderNumber: string;
    }
  ): Promise<boolean> {
    try {
      if (!this.validatePhoneNumber(phoneNumber)) {
        console.error('Invalid phone number:', phoneNumber);
        return false;
      }

      const message = `Delivery Confirmed: Order ${deliveryData.orderNumber} (${deliveryData.trackingNumber}) has been delivered. Thank you for shopping with MarmaraShop!`;
      await this.sendSMS(phoneNumber, message);
      return true;
    } catch (error) {
      console.error('Failed to send delivery confirmation SMS:', error);
      return false;
    }
  }

  /**
   * Send generic SMS
   */
  private async sendSMS(phoneNumber: string, message: string): Promise<void> {
    // Mock implementation - in production, integrate with Twilio
    console.log(`[SMS] To: ${phoneNumber}`);
    console.log(`[SMS] Message: ${message}`);

    // TODO: Integrate with Twilio API
    // const twilio = require('twilio');
    // const client = twilio(this.accountSid, this.authToken);
    // await client.messages.create({
    //   body: message,
    //   from: this.fromNumber,
    //   to: phoneNumber,
    // });
  }
}
