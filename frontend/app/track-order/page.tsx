'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, MapPin, Calendar, Truck, CheckCircle, AlertCircle, Search } from 'lucide-react';

interface TrackingResult {
  trackingNumber: string;
  status: string;
  currentLocation: string;
  estimatedDelivery: string;
  history: Array<{
    status: string;
    timestamp: string;
    location: string;
  }>;
}

export default function TrackOrderPage() {
  const [searchType, setSearchType] = useState<'order' | 'tracking'>('order');
  const [searchValue, setSearchValue] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock tracking data
  const mockTrackingData: Record<string, TrackingResult> = {
    'OZ1701000001': {
      trackingNumber: 'OZ1701000001',
      status: 'in_transit',
      currentLocation: 'Distribution Center, New York',
      estimatedDelivery: '2024-11-03',
      history: [
        { status: 'Order Placed', timestamp: '2024-10-31 10:30 AM', location: 'Online' },
        { status: 'Order Confirmed', timestamp: '2024-10-31 10:35 AM', location: 'Warehouse' },
        { status: 'Processing', timestamp: '2024-10-31 2:00 PM', location: 'Warehouse' },
        { status: 'Shipped', timestamp: '2024-11-01 8:00 AM', location: 'Pickup Point' },
        { status: 'In Transit', timestamp: '2024-11-01 3:00 PM', location: 'Distribution Center, New York' },
      ],
    },
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);
    setTrackingResult(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (searchType === 'tracking') {
        // Search by tracking number
        const result = mockTrackingData[searchValue];
        if (result) {
          setTrackingResult(result);
        } else {
          setError('Tracking number not found. Please check and try again.');
        }
      } else {
        // Search by order number (requires email)
        if (!email) {
          setError('Email is required to search by order number.');
          setIsSearching(false);
          return;
        }
        // Mock search
        setTrackingResult(mockTrackingData['OZ1701000001']);
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'in_transit':
        return <Truck className="text-blue-600" size={20} />;
      case 'processing':
        return <Package className="text-yellow-600" size={20} />;
      default:
        return <MapPin className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-gray-600 mt-2">Enter your tracking number or order details</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {/* Search Type Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => {
                setSearchType('tracking');
                setSearchValue('');
                setEmail('');
                setError(null);
              }}
              className={`pb-3 px-4 font-medium transition-colors ${
                searchType === 'tracking'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Track by Tracking Number
            </button>
            <button
              onClick={() => {
                setSearchType('order');
                setSearchValue('');
                setEmail('');
                setError(null);
              }}
              className={`pb-3 px-4 font-medium transition-colors ${
                searchType === 'order'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Track by Order Number
            </button>
          </div>

          {/* Search Inputs */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {searchType === 'tracking' ? 'Tracking Number' : 'Order Number'}
              </label>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchType === 'tracking' ? 'e.g., OZ1701000001' : 'e.g., ORD-1701000001'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {searchType === 'order' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Search Failed</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchValue}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Search size={20} />
            {isSearching ? 'Searching...' : 'Track Order'}
          </button>
        </div>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="mt-8 space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-lg shadow p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status */}
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    {getStatusIcon(trackingResult.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Current Status</p>
                  <p className="text-lg font-bold text-gray-900">
                    {trackingResult.status.replace(/_/g, ' ').toUpperCase()}
                  </p>
                </div>

                {/* Location */}
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Current Location</p>
                  <p className="text-lg font-bold text-gray-900">{trackingResult.currentLocation}</p>
                </div>

                {/* Estimated Delivery */}
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <Calendar className="text-green-600" size={24} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                  <p className="text-lg font-bold text-gray-900">{trackingResult.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Tracking Number */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <p className="text-sm text-blue-600 mb-1">Tracking Number</p>
              <p className="text-2xl font-mono font-bold text-blue-900">{trackingResult.trackingNumber}</p>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Timeline</h2>
              <div className="space-y-6">
                {trackingResult.history.map((event, index) => (
                  <div key={index} className="flex gap-6">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                      {index < trackingResult.history.length - 1 && (
                        <div className="w-1 h-20 bg-gray-200 mt-4"></div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="pb-6">
                      <p className="font-bold text-gray-900">{event.status}</p>
                      <p className="text-sm text-gray-600 mt-1">{event.timestamp}</p>
                      <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">What Next?</h2>
              <p className="text-gray-600 mb-6">
                Your order is on its way! You'll receive updates via email when your package status changes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 font-medium text-center transition-colors"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={() => {
                    setSearchValue('');
                    setEmail('');
                    setTrackingResult(null);
                    setError(null);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Track Another Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!trackingResult && !error && (
          <div className="mt-12 bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Help & FAQs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Where do I find my tracking number?</h3>
                <p className="text-gray-600 text-sm">
                  Your tracking number is included in the order confirmation email. Look for the section labeled
                  "Tracking Number" or "Shipment Details".
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How often is tracking updated?</h3>
                <p className="text-gray-600 text-sm">
                  Tracking information is updated every time your package reaches a new location. Major updates
                  are typically every 12-24 hours.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What if I don't receive my order?</h3>
                <p className="text-gray-600 text-sm">
                  If your order shows delivered but you haven't received it, contact our support team within 48
                  hours with your tracking number.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I change my delivery address?</h3>
                <p className="text-gray-600 text-sm">
                  If your order hasn't shipped yet, contact support immediately. Once in transit, address changes
                  are not possible.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
