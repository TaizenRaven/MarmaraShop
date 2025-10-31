'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Edit, Trash2, Search, Download } from 'lucide-react';

// Mock data - replace with API calls
const MOCK_ORDERS = [
  {
    id: 'ord_1',
    orderNumber: 'ORD-1701000001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    totalAmount: 149.99,
    status: 'pending',
    codStatus: 'pending',
    createdAt: '2024-10-31',
    items: 3,
  },
  {
    id: 'ord_2',
    orderNumber: 'ORD-1701000002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    totalAmount: 99.99,
    status: 'processing',
    codStatus: 'confirmed',
    createdAt: '2024-10-30',
    items: 2,
  },
  {
    id: 'ord_3',
    orderNumber: 'ORD-1701000003',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    totalAmount: 249.98,
    status: 'shipped',
    codStatus: 'confirmed',
    createdAt: '2024-10-29',
    items: 4,
  },
  {
    id: 'ord_4',
    orderNumber: 'ORD-1701000004',
    customerName: 'Alice Brown',
    customerEmail: 'alice@example.com',
    totalAmount: 79.99,
    status: 'delivered',
    codStatus: 'completed',
    createdAt: '2024-10-28',
    items: 1,
  },
  {
    id: 'ord_5',
    orderNumber: 'ORD-1701000005',
    customerName: 'Charlie Wilson',
    customerEmail: 'charlie@example.com',
    totalAmount: 199.99,
    status: 'cancelled',
    codStatus: 'cancelled',
    createdAt: '2024-10-27',
    items: 3,
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  const filteredOrders = orders.filter((order) => {
    if (searchTerm && !order.orderNumber.includes(searchTerm) && !order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter && order.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusBadgeColor = (status: string) => {
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

  const getCODStatusBadgeColor = (status: string) => {
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

  const handleSelectOrder = (id: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter((o) => o.id !== id));
      setSelectedOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage customer orders</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            <Download size={20} />
            Export Orders
          </button>
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
                placeholder="Search by order ID or customer..."
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
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Results */}
            <div className="flex items-center justify-end">
              <p className="text-sm text-gray-600">
                {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filteredOrders.length > 0 && selectedOrders.size === filteredOrders.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Order Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      ${order.totalAmount.toFixed(2)}
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
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getCODStatusBadgeColor(
                          order.codStatus
                        )}`}
                      >
                        {order.codStatus.charAt(0).toUpperCase() + order.codStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {order.items}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-700"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/orders/${order.id}/edit`}
                          className="text-green-600 hover:text-green-700"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-600">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-sm text-gray-600">
          {selectedOrders.size > 0 && (
            <div>
              <p>{selectedOrders.size} orders selected</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium mt-2">
                Bulk Update Status
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
