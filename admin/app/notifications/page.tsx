'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Filter, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';

interface NotificationLog {
  id: string;
  type: 'order_confirmation' | 'shipping_update' | 'delivery_confirmation';
  channel: 'email' | 'sms';
  recipient: string;
  customerName: string;
  status: 'sent' | 'failed' | 'pending';
  retries: number;
  createdAt: string;
  sentAt: string | null;
}

const MOCK_LOGS: NotificationLog[] = [
  {
    id: 'notif_1',
    type: 'order_confirmation',
    channel: 'email',
    recipient: 'john.doe@example.com',
    customerName: 'John Doe',
    status: 'sent',
    retries: 0,
    createdAt: '2024-10-31T10:30:00Z',
    sentAt: '2024-10-31T10:30:15Z',
  },
  {
    id: 'notif_2',
    type: 'shipping_update',
    channel: 'email',
    recipient: 'jane.smith@example.com',
    customerName: 'Jane Smith',
    status: 'sent',
    retries: 0,
    createdAt: '2024-10-31T09:15:00Z',
    sentAt: '2024-10-31T09:15:20Z',
  },
  {
    id: 'notif_3',
    type: 'delivery_confirmation',
    channel: 'sms',
    recipient: '+1 234 567 8900',
    customerName: 'Bob Johnson',
    status: 'sent',
    retries: 1,
    createdAt: '2024-10-30T14:45:00Z',
    sentAt: '2024-10-30T14:45:45Z',
  },
  {
    id: 'notif_4',
    type: 'shipping_update',
    channel: 'email',
    recipient: 'alice.brown@example.com',
    customerName: 'Alice Brown',
    status: 'failed',
    retries: 3,
    createdAt: '2024-10-30T12:00:00Z',
    sentAt: null,
  },
  {
    id: 'notif_5',
    type: 'order_confirmation',
    channel: 'sms',
    recipient: '+1 345 678 9012',
    customerName: 'Charlie Wilson',
    status: 'pending',
    retries: 0,
    createdAt: '2024-10-31T11:00:00Z',
    sentAt: null,
  },
];

export default function NotificationsPage() {
  const [logs, setLogs] = useState<NotificationLog[]>(MOCK_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (
      searchTerm &&
      !log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !log.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (typeFilter && log.type !== typeFilter) {
      return false;
    }
    if (statusFilter && log.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'failed':
        return <AlertCircle className="text-red-600" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'bg-blue-100 text-blue-800';
      case 'sms':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'order_confirmation':
        return 'Order Confirmation';
      case 'shipping_update':
        return 'Shipping Update';
      case 'delivery_confirmation':
        return 'Delivery Confirmation';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Notification Logs</h1>
          <p className="text-gray-600 mt-1">View and monitor all sent notifications</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by recipient or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-900"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter || ''}
              onChange={(e) => setTypeFilter(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="order_confirmation">Order Confirmation</option>
              <option value="shipping_update">Shipping Update</option>
              <option value="delivery_confirmation">Delivery Confirmation</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>

            {/* Results */}
            <div className="flex items-center justify-end">
              <p className="text-sm text-gray-600">
                {filteredLogs.length} of {logs.length} notifications
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Sent</p>
                <p className="text-3xl font-bold text-green-600">
                  {logs.filter((l) => l.status === 'sent').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-600">
                  {logs.filter((l) => l.status === 'failed').length}
                </p>
              </div>
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {logs.filter((l) => l.status === 'pending').length}
                </p>
              </div>
              <Clock className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>

        {/* Notification Logs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Retries
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{log.customerName}</p>
                        <p className="text-sm text-gray-500">{log.recipient}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{getTypeLabel(log.type)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getChannelColor(
                          log.channel
                        )}`}
                      >
                        {log.channel.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            log.status
                          )}`}
                        >
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-900">
                        {log.retries > 0 && (
                          <>
                            <RefreshCw size={16} className="text-gray-400" />
                            {log.retries}
                          </>
                        )}
                        {log.retries === 0 && <span className="text-gray-500">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.sentAt ? new Date(log.sentAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/notifications/${log.id}`}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-600">
                    No notifications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
