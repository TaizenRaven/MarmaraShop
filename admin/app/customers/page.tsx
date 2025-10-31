'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Filter, MoreVertical, Mail, Phone } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  joinedDate: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    totalOrders: 5,
    totalSpent: 2450.50,
    lastOrderDate: '2024-10-30',
    joinedDate: '2024-09-15',
  },
  {
    id: 'cust_2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 345 678 9012',
    totalOrders: 12,
    totalSpent: 5892.75,
    lastOrderDate: '2024-10-29',
    joinedDate: '2024-08-20',
  },
  {
    id: 'cust_3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1 456 789 0123',
    totalOrders: 3,
    totalSpent: 892.00,
    lastOrderDate: '2024-10-28',
    joinedDate: '2024-10-10',
  },
  {
    id: 'cust_4',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    phone: '+1 567 890 1234',
    totalOrders: 8,
    totalSpent: 3456.25,
    lastOrderDate: '2024-10-27',
    joinedDate: '2024-07-05',
  },
  {
    id: 'cust_5',
    name: 'Charlie Wilson',
    email: 'charlie.w@example.com',
    phone: '+1 678 901 2345',
    totalOrders: 2,
    totalSpent: 567.00,
    lastOrderDate: '2024-10-25',
    joinedDate: '2024-10-15',
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());

  const filteredCustomers = customers.filter((customer) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.phone.includes(term)
    );
  });

  const toggleCustomerSelect = (id: string) => {
    const newSelected = new Set(selectedCustomers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCustomers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.size === filteredCustomers.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(filteredCustomers.map((c) => c.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">Manage and view all customers</p>
          </div>
          <button className="flex items-center gap-2 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium transition-colors">
            <Mail size={20} />
            Send Email Campaign
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-900"
              />
            </div>

            {/* Filter */}
            <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium transition-colors">
              <Filter size={20} />
              Filter
            </button>

            {/* Results */}
            <div className="flex items-center justify-end">
              <p className="text-sm text-gray-600">
                {filteredCustomers.length} of {customers.length} customers
              </p>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.size === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Total Orders
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Last Order
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.has(customer.id)}
                        onChange={() => toggleCustomerSelect(customer.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} />
                          <a href={`mailto:${customer.email}`} className="hover:text-blue-600">
                            {customer.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={16} />
                          <a href={`tel:${customer.phone}`} className="hover:text-blue-600">
                            {customer.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">{customer.totalOrders}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">
                        ${customer.totalSpent.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{customer.lastOrderDate}</td>
                    <td className="px-6 py-4 text-gray-600">{customer.joinedDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="View customer"
                        >
                          <Eye size={18} className="text-gray-600" />
                        </Link>
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                          <MoreVertical size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-600">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bulk Actions */}
        {selectedCustomers.size > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-blue-900 font-medium">
              {selectedCustomers.size} customer{selectedCustomers.size > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-3">
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Send Email
              </button>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Export
              </button>
              <button
                onClick={() => setSelectedCustomers(new Set())}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
