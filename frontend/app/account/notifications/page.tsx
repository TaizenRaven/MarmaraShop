'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Save, CheckCircle, AlertCircle } from 'lucide-react';

interface NotificationPreferences {
  email: string;
  emailNotifications: {
    orderConfirmation: boolean;
    shippingUpdates: boolean;
    deliveryConfirmation: boolean;
    promotions: boolean;
  };
  smsNotifications: {
    orderConfirmation: boolean;
    shippingUpdates: boolean;
    deliveryConfirmation: boolean;
  };
}

export default function NotificationPreferencesPage() {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: '',
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Load user preferences
    // In a real app, this would fetch from the API
    const userEmail = localStorage.getItem('userEmail') || '';
    setEmail(userEmail);
    setPreferences((prev) => ({
      ...prev,
      email: userEmail,
    }));
  }, []);

  const handleEmailToggle = (key: keyof typeof preferences.emailNotifications) => {
    setPreferences((prev) => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: !prev.emailNotifications[key],
      },
    }));
  };

  const handleSmsToggle = (key: keyof typeof preferences.smsNotifications) => {
    setPreferences((prev) => ({
      ...prev,
      smsNotifications: {
        ...prev.smsNotifications,
        [key]: !prev.smsNotifications[key],
      },
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setShowSuccess(false);
    setShowError(false);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save preferences
      localStorage.setItem('notificationPreferences', JSON.stringify(preferences));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Link
            href="/account"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
          <p className="text-gray-600 mt-1">Manage how you receive order and shipping updates</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-green-800">Preferences Saved</p>
              <p className="text-green-700 text-sm">Your notification preferences have been updated successfully.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {showError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-red-700 text-sm">Failed to save preferences. Please try again.</p>
            </div>
          </div>
        )}

        {/* Email Preferences */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Email Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Order Confirmation</p>
                <p className="text-sm text-gray-600">Receive an email when your order is confirmed</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications.orderConfirmation}
                  onChange={() => handleEmailToggle('orderConfirmation')}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Shipping Updates</p>
                <p className="text-sm text-gray-600">Get notified when your shipment is on the way</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications.shippingUpdates}
                  onChange={() => handleEmailToggle('shippingUpdates')}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Delivery Confirmation</p>
                <p className="text-sm text-gray-600">Receive confirmation when your order arrives</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications.deliveryConfirmation}
                  onChange={() => handleEmailToggle('deliveryConfirmation')}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Promotions & Offers</p>
                <p className="text-sm text-gray-600">Receive special offers and promotional emails</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications.promotions}
                  onChange={() => handleEmailToggle('promotions')}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* SMS Preferences */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="text-green-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">SMS Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Order Confirmation</p>
                <p className="text-sm text-gray-600">Receive an SMS when your order is confirmed</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.smsNotifications.orderConfirmation}
                  onChange={() => handleSmsToggle('orderConfirmation')}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Shipping Updates</p>
                <p className="text-sm text-gray-600">Get notified when your shipment is on the way</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.smsNotifications.shippingUpdates}
                  onChange={() => handleSmsToggle('shippingUpdates')}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Delivery Confirmation</p>
                <p className="text-sm text-gray-600">Receive SMS when your order arrives</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.smsNotifications.deliveryConfirmation}
                  onChange={() => handleSmsToggle('deliveryConfirmation')}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </button>
          <Link
            href="/account"
            className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Cancel
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900 text-sm">
            <strong>Note:</strong> We respect your privacy. You can unsubscribe from any notifications at any time.
            Standard SMS rates may apply based on your mobile carrier.
          </p>
        </div>
      </div>
    </div>
  );
}
