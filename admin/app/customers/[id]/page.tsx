'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Package, ShoppingCart, Edit2 } from 'lucide-react';

interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  lastActive: string;
  totalOrders: number;
  totalSpent: number;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

const MOCK_CUSTOMER: CustomerDetail = {
  id: 'cust_1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 8900',
  joinedDate: '2024-09-15',
  lastActive: '2024-10-30',
  totalOrders: 5,
  totalSpent: 2450.50,
  address: '123 Main Street',
  city: 'New York',
  postalCode: '10001',
  country: 'United States',
  notes: 'VIP customer, prefers express shipping',
};

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord_1',
    orderNumber: 'ORD-1701000001',
    date: '2024-10-30',
    total: 425.50,
    status: 'processing',
    items: 3,
  },
  {
    id: 'ord_2',
    orderNumber: 'ORD-1701000005',
    date: '2024-10-25',
    total: 892.75,
    status: 'delivered',
    items: 5,
  },
  {
    id: 'ord_3',
    orderNumber: 'ORD-1701000010',
    date: '2024-10-15',
    total: 234.00,
    status: 'delivered',
    items: 2,
  },
  {
    id: 'ord_4',
    orderNumber: 'ORD-1701000015',
    date: '2024-10-05',
    total: 567.25,
    status: 'delivered',
    items: 4,
  },
  {
    id: 'ord_5',
    orderNumber: 'ORD-1701000020',
    date: '2024-09-25',
    total: 331.00,
    status: 'delivered',
    items: 2,
  },
];

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer] = useState<CustomerDetail>(MOCK_CUSTOMER);
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [notes, setNotes] = useState(customer.notes);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/customers"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Customers
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-gray-600 mt-1">Customer ID: {customer.id}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Info */}
          <div className="lg:col-span-1">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={16} className="text-gray-400" />
                    <a
                      href={`mailto:${customer.email}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {customer.email}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone size={16} className="text-gray-400" />
                    <a href={`tel:${customer.phone}`} className="text-blue-600 hover:text-blue-700">
                      {customer.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900 font-medium">{customer.address}</p>
                    <p className="text-gray-600">
                      {customer.city}, {customer.postalCode}
                    </p>
                    <p className="text-gray-600">{customer.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Stats */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Joined Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <p className="text-gray-900 font-medium">{customer.joinedDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 text-sm mb-1">Last Active</p>
                  <p className="text-gray-900 font-medium">{customer.lastActive}</p>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="text-xl font-bold text-blue-600">{customer.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="text-xl font-bold text-green-600">
                      ${customer.totalSpent.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Orders & Notes */}
          <div className="lg:col-span-2">
            {/* Customer Notes */}
            <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Internal Notes</h2>
                <button
                  onClick={() => setIsEditingNotes(!isEditingNotes)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Edit2 size={16} />
                  {isEditingNotes ? 'Done' : 'Edit'}
                </button>
              </div>

              <div className="p-6">
                {isEditingNotes ? (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700">{notes || 'No notes added yet'}</p>
                )}
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-6 border-b">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Order History
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{order.date}</td>
                        <td className="px-6 py-4 text-gray-900">{order.items}</td>
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
