'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Plus, Search, MapPin, Calendar, Package } from 'lucide-react';

// Mock data
const MOCK_SHIPMENTS = [
  {
    id: 'ship_1',
    trackingNumber: 'OZ1701000001',
    orderId: 'ord_1',
    orderNumber: 'ORD-1701000001',
    customerName: 'John Doe',
    status: 'in_transit',
    currentLocation: 'Distribution Center, New York',
    shippedDate: '2024-11-01',
    estimatedDelivery: '2024-11-03',
    createdAt: '2024-10-31',
  },
  {
    id: 'ship_2',
    trackingNumber: 'OZ1701000002',
    orderId: 'ord_2',
    orderNumber: 'ORD-1701000002',
    customerName: 'Jane Smith',
    status: 'out_for_delivery',
    currentLocation: 'Out for Delivery',
    shippedDate: '2024-11-01',
    estimatedDelivery: '2024-11-02',
    createdAt: '2024-10-30',
  },
  {
    id: 'ship_3',
    trackingNumber: 'OZ1701000003',
    orderId: 'ord_3',
    orderNumber: 'ORD-1701000003',
    customerName: 'Bob Johnson',
    status: 'delivered',
    currentLocation: 'Delivered',
    shippedDate: '2024-10-31',
    estimatedDelivery: '2024-11-02',
    createdAt: '2024-10-29',
  },
  {
    id: 'ship_4',
    trackingNumber: 'OZ1701000004',
    orderId: 'ord_4',
    orderNumber: 'ORD-1701000004',
    customerName: 'Alice Brown',
    status: 'pending',
    currentLocation: 'Warehouse',
    shippedDate: null,
    estimatedDelivery: '2024-11-05',
    createdAt: '2024-10-27',
  },
];

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState(MOCK_SHIPMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredShipments = shipments.filter((shipment) => {
    if (
      searchTerm &&
      !shipment.trackingNumber.includes(searchTerm) &&
      !shipment.orderNumber.includes(searchTerm) &&
      !shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter && shipment.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery':
        return 'bg-yellow-100 text-yellow-800';
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
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
            <p className="text-gray-600 mt-1">Track and manage shipments</p>
          </div>
          <Link
            href="/shipments/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus size={20} />
            Create Shipment
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by tracking or order..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-900"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Results */}
            <div className="flex items-center justify-end">
              <p className="text-sm text-gray-600">
                {filteredShipments.length} of {shipments.length} shipments
              </p>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Est. Delivery
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/shipments/${shipment.trackingNumber}`}
                        className="font-mono text-blue-600 hover:text-blue-700"
                      >
                        {shipment.trackingNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/orders/${shipment.orderId}`}
                        className="text-gray-900 hover:text-blue-600 font-medium"
                      >
                        {shipment.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{shipment.customerName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                          shipment.status
                        )}`}
                      >
                        {shipment.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={16} />
                        {shipment.currentLocation}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        {shipment.estimatedDelivery}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/shipments/${shipment.trackingNumber}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                    No shipments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Shipments</p>
            <p className="text-3xl font-bold text-gray-900">{shipments.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">In Transit</p>
            <p className="text-3xl font-bold text-purple-600">
              {shipments.filter((s) => s.status === 'in_transit').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Delivered</p>
            <p className="text-3xl font-bold text-green-600">
              {shipments.filter((s) => s.status === 'delivered').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {shipments.filter((s) => s.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
