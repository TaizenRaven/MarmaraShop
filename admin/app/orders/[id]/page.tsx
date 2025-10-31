'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Edit, Print, Mail } from 'lucide-react';

// Mock data - replace with API calls
const MOCK_ORDER = {
  id: 'ord_1',
  orderNumber: 'ORD-1701000001',
  status: 'processing',
  codStatus: 'confirmed',
  createdAt: '2024-10-31',
  updatedAt: '2024-10-31',
  trackingNumber: 'OZ1701000001',

  // Customer Info
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+1 (555) 123-4567',

  // Shipping Info
  shippingAddress: '123 Main Street',
  shippingCity: 'New York',
  shippingPostalCode: '10001',
  shippingCountry: 'USA',

  // Items
  items: [
    {
      id: 'prod_1',
      name: 'Wireless Headphones',
      price: 79.99,
      quantity: 1,
      image: 'https://via.placeholder.com/150x150?text=Headphones',
    },
    {
      id: 'prod_2',
      name: 'USB-C Cable',
      price: 19.99,
      quantity: 2,
      image: 'https://via.placeholder.com/150x150?text=Cable',
    },
  ],

  // Totals
  subtotal: 119.97,
  tax: 12.00,
  shipping: 18.02,
  total: 149.99,

  // Timeline
  timeline: [
    { status: 'Order Placed', date: '2024-10-31', time: '10:30 AM' },
    { status: 'Order Confirmed', date: '2024-10-31', time: '10:35 AM' },
    { status: 'Processing', date: '2024-10-31', time: '11:00 AM' },
  ],
};

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = MOCK_ORDER;
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);
  const [newCODStatus, setNewCODStatus] = useState(order.codStatus);

  const handleStatusUpdate = () => {
    // TODO: Make API call to update order
    console.log('Updating order status:', { newStatus, newCODStatus });
    setEditingStatus(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCODStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          <Link href="/orders" className="text-blue-600 hover:text-blue-700">
            Orders
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-900 font-medium">{order.orderNumber}</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
            <p className="text-gray-600 mt-1">Order placed on {order.createdAt}</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200">
              <Print size={18} />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Mail size={18} />
              Send Email
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
                {!editingStatus && (
                  <button
                    onClick={() => setEditingStatus(true)}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                )}
              </div>

              {editingStatus ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Status (COD)
                    </label>
                    <select
                      value={newCODStatus}
                      onChange={(e) => setNewCODStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingStatus(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStatusUpdate}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Order Status</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCODStatusColor(order.codStatus)}`}>
                      {order.codStatus.charAt(0).toUpperCase() + order.codStatus.slice(1)}
                    </span>
                  </div>
                </div>
              )}

              {/* Tracking Number */}
              {order.trackingNumber && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">{order.trackingNumber}</p>
                </div>
              )}
            </div>

            {/* Items Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Timeline</h2>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                      {index < order.timeline.length - 1 && (
                        <div className="w-1 h-12 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{event.status}</p>
                      <p className="text-sm text-gray-600">
                        {event.date} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{order.customerPhone}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h3>
              <div className="space-y-1 text-gray-900">
                <p className="font-semibold">{order.customerName}</p>
                <p>{order.shippingAddress}</p>
                <p>
                  {order.shippingCity}, {order.shippingPostalCode}
                </p>
                <p>{order.shippingCountry}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900 font-medium">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">${order.shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-800 font-semibold mb-2">Cash on Delivery (COD)</p>
                <p className="text-sm text-green-700">
                  Payment will be collected from the customer upon delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
