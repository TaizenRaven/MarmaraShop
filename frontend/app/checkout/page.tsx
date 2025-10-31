'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Check, Package, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useRouter } from 'next/navigation';

type CheckoutStep = 'review' | 'shipping' | 'payment' | 'confirmation';

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getCartSubtotal());
  const tax = subtotal * 0.1;
  const shippingCost = 10; // Flat rate for demo
  const total = subtotal + tax + shippingCost;
  const clearCart = useCartStore((state) => state.clearCart);

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('review');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const [shippingData, setShippingData] = useState<ShippingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if cart is empty
  if (cartItems.length === 0 && currentStep === 'review') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Add products to your cart before checking out.</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Back to Shopping
          </Link>
        </div>
      </div>
    );
  }

  const validateShippingData = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingData.email.trim()) newErrors.email = 'Email is required';
    if (!shippingData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingData.address.trim()) newErrors.address = 'Address is required';
    if (!shippingData.city.trim()) newErrors.city = 'City is required';
    if (!shippingData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!shippingData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = () => {
    if (validateShippingData()) {
      setCurrentStep('payment');
    }
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call to create order
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newOrderNumber = `ORD-${Date.now()}`;
      setOrderNumber(newOrderNumber);
      setCurrentStep('confirmation');
      clearCart();
    } catch (error) {
      console.error('Order creation failed:', error);
      setErrors({ submit: 'Failed to create order. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: keyof ShippingData, value: string) => {
    setShippingData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Confirmation Page
  if (currentStep === 'confirmation' && orderNumber) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Order Confirmation</h1>
          </div>
        </div>

        {/* Confirmation Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 text-lg mb-8">
              Thank you for your purchase. Your order has been received.
            </p>

            {/* Order Number */}
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <p className="text-gray-600 mb-2">Order Number</p>
              <p className="text-3xl font-bold text-gray-900 font-mono">{orderNumber}</p>
            </div>

            {/* Order Details */}
            <div className="text-left mb-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900 font-medium">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-gray-900 font-semibold">Total:</span>
                  <span className="text-gray-900 font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="text-left mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Information</h3>
              <p className="text-gray-700">
                <strong>{shippingData.firstName} {shippingData.lastName}</strong>
              </p>
              <p className="text-gray-700">{shippingData.address}</p>
              <p className="text-gray-700">
                {shippingData.city}, {shippingData.postalCode} {shippingData.country}
              </p>
              <p className="text-gray-700 mt-2">Phone: {shippingData.phone}</p>
              <p className="text-gray-700">Email: {shippingData.email}</p>
            </div>

            {/* Payment Method */}
            <div className="text-left mb-8 bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Method</h3>
              <p className="text-gray-700">
                <strong>Cash on Delivery (COD)</strong>
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Please pay when the package is delivered to your address.
              </p>
            </div>

            {/* Next Steps */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
              <ol className="text-left space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    1
                  </span>
                  <span className="text-gray-700">
                    You will receive an order confirmation email shortly
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    2
                  </span>
                  <span className="text-gray-700">
                    Your order will be processed and prepared for shipment
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    3
                  </span>
                  <span className="text-gray-700">
                    You will receive a tracking number via email
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    4
                  </span>
                  <span className="text-gray-700">
                    Pay the delivery driver when package arrives
                  </span>
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 font-medium text-center"
              >
                Continue Shopping
              </Link>
              <Link
                href={`/account/orders/${orderNumber}`}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium text-center"
              >
                View Order Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-1">Complete your purchase</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Step 1: Review */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 'review' || ['shipping', 'payment', 'confirmation'].includes(currentStep)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {['shipping', 'payment', 'confirmation'].includes(currentStep) ? (
                  <Check size={20} />
                ) : (
                  <Package size={20} />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Review</p>
                <p className="text-sm text-gray-600">Your cart</p>
              </div>
            </div>

            <div className="flex-1 h-1 bg-gray-200 mx-2"></div>

            {/* Step 2: Shipping */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 'shipping' || ['payment', 'confirmation'].includes(currentStep)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {['payment', 'confirmation'].includes(currentStep) ? (
                  <Check size={20} />
                ) : (
                  <Truck size={20} />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Shipping</p>
                <p className="text-sm text-gray-600">Address</p>
              </div>
            </div>

            <div className="flex-1 h-1 bg-gray-200 mx-2"></div>

            {/* Step 3: Payment */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 'payment' || currentStep === 'confirmation'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep === 'confirmation' ? (
                  <Check size={20} />
                ) : (
                  <CreditCard size={20} />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Payment</p>
                <p className="text-sm text-gray-600">Method</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Checkout Form */}
          <div className="lg:col-span-2">
            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="space-y-6">
                {/* Cart Items Review */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Review</h2>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center border-b pb-4">
                        <div>
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={() => setCurrentStep('shipping')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                >
                  Continue to Shipping <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  {/* Name Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={shippingData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={shippingData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={shippingData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* City, Postal Code, Country */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={shippingData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="New York"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.postalCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="10001"
                      />
                      {errors.postalCode && (
                        <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={shippingData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.country ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="USA"
                      />
                      {errors.country && (
                        <p className="text-red-600 text-sm mt-1">{errors.country}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setCurrentStep('review')}
                    className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleShippingSubmit}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

                {/* COD Option (Only Option) */}
                <div className="mb-6 p-4 border-2 border-blue-600 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      checked
                      readOnly
                      className="w-4 h-4 text-blue-600"
                    />
                    <label htmlFor="cod" className="font-semibold text-gray-900 cursor-pointer">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                  <p className="text-gray-600 ml-7 text-sm">
                    Pay when the package is delivered to your address. This is the only payment method
                    available.
                  </p>
                </div>

                {/* Order Review */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (10%):</span>
                      <span className="text-gray-900">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="text-gray-900">${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900 text-lg">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ By placing this order, you agree to our Terms of Service and acknowledge that you
                    will pay the delivery driver in cash upon delivery.
                  </p>
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{errors.submit}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep('shipping')}
                    disabled={isProcessing}
                    className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 font-semibold disabled:opacity-50"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-4 border-b pb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.title}
                      <span className="text-gray-400"> x{item.quantity}</span>
                    </span>
                    <span className="text-gray-900 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
