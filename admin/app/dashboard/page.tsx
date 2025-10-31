'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, Package, ShoppingCart, AlertCircle, ArrowRight } from 'lucide-react';

interface Metric {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: string;
  date: string;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setMetrics([
        {
          title: 'Total Revenue',
          value: '$45,230',
          icon: <TrendingUp className="text-green-600" size={24} />,
          color: 'bg-green-50',
          trend: '+12.5% from last month',
        },
        {
          title: 'Total Orders',
          value: '284',
          icon: <ShoppingCart className="text-blue-600" size={24} />,
          color: 'bg-blue-50',
          trend: '+8.2% from last month',
        },
        {
          title: 'Pending Orders',
          value: '23',
          icon: <Package className="text-yellow-600" size={24} />,
          color: 'bg-yellow-50',
          trend: '2 awaiting confirmation',
        },
        {
          title: 'Shipped Today',
          value: '42',
          icon: <BarChart3 className="text-purple-600" size={24} />,
          color: 'bg-purple-50',
          trend: '+5 from yesterday',
        },
      ]);

      setRecentOrders([
        {
          id: 'ord_1',
          orderNumber: 'ORD-1701000001',
          customer: 'John Doe',
          total: 425.50,
          status: 'processing',
          date: '2024-10-31',
        },
        {
          id: 'ord_2',
          orderNumber: 'ORD-1701000002',
          customer: 'Jane Smith',
          total: 892.75,
          status: 'shipped',
          date: '2024-10-30',
        },
        {
          id: 'ord_3',
          orderNumber: 'ORD-1701000003',
          customer: 'Bob Johnson',
          total: 234.00,
          status: 'delivered',
          date: '2024-10-29',
        },
        {
          id: 'ord_4',
          orderNumber: 'ORD-1701000004',
          customer: 'Alice Brown',
          status: 'pending',
          total: 156.25,
          date: '2024-10-28',
        },
        {
          id: 'ord_5',
          orderNumber: 'ORD-1701000005',
          customer: 'Charlie Wilson',
          status: 'processing',
          total: 567.00,
          date: '2024-10-27',
        },
      ]);

      setLowStockProducts([
        { id: 'prod_1', name: 'Wireless Headphones', sku: 'WH-001', stock: 3 },
        { id: 'prod_2', name: 'USB-C Cable', sku: 'USB-C-001', stock: 5 },
        { id: 'prod_3', name: 'Phone Case', sku: 'CASE-001', stock: 2 },
      ]);

      setIsLoading(false);
    }, 500);
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your store overview.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`${metric.color} rounded-lg shadow p-6 border border-gray-200`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  {metric.trend && (
                    <p className="text-xs text-gray-500 mt-2">{metric.trend}</p>
                  )}
                </div>
                <div className="text-gray-400">{metric.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <Link
                href="/orders"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Order #
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{order.customer}</td>
                      <td className="px-6 py-4 text-gray-900">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b flex items-center gap-2">
              <AlertCircle className="text-red-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Low Stock Alert</h2>
            </div>

            <div className="p-6 space-y-4">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="pb-4 border-b last:pb-0 last:border-b-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                      {product.stock} left
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${(product.stock / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <Link
                href="/products"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All Products →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/products/new"
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <Package className="text-blue-600" size={20} />
              <span className="font-medium text-gray-900">Add Product</span>
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
            >
              <ShoppingCart className="text-purple-600" size={20} />
              <span className="font-medium text-gray-900">View Orders</span>
            </Link>
            <Link
              href="/categories"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <BarChart3 className="text-green-600" size={20} />
              <span className="font-medium text-gray-900">Categories</span>
            </Link>
            <Link
              href="/shipments"
              className="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors"
            >
              <TrendingUp className="text-yellow-600" size={20} />
              <span className="font-medium text-gray-900">Shipments</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
