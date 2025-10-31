'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, Shield, User, Check } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  active: boolean;
  created_at: string;
  last_login: string | null;
}

const MOCK_USERS: AdminUser[] = [
  {
    id: 'admin_001',
    email: 'admin@marmara.shop',
    name: 'Admin User',
    role: 'admin',
    active: true,
    created_at: '2024-10-01',
    last_login: new Date().toISOString(),
  },
  {
    id: 'manager_001',
    email: 'manager@marmara.shop',
    name: 'Manager User',
    role: 'manager',
    active: true,
    created_at: '2024-10-15',
    last_login: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'viewer_001',
    email: 'viewer@marmara.shop',
    name: 'Viewer User',
    role: 'viewer',
    active: true,
    created_at: '2024-10-20',
    last_login: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['View Dashboard', 'Manage Products', 'Manage Categories', 'Manage Orders', 'Manage Users', 'Manage Settings'],
  manager: ['View Dashboard', 'Manage Products', 'Manage Orders', 'View Reports'],
  viewer: ['View Dashboard', 'View Products', 'View Orders', 'View Reports'],
};

export default function UsersSettingsPage() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({ email: '', name: '', role: 'viewer' });

  const handleAddUser = () => {
    if (formData.email && formData.name && formData.role) {
      const newUser: AdminUser = {
        id: `user_${Date.now()}`,
        email: formData.email,
        name: formData.name,
        role: formData.role as any,
        active: true,
        created_at: new Date().toISOString().split('T')[0],
        last_login: null,
      };
      setUsers([...users, newUser]);
      setFormData({ email: '', name: '', role: 'viewer' });
      setShowForm(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield size={16} />;
      case 'manager':
        return <User size={16} />;
      default:
        return <User size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/settings"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Settings
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage admin users and their roles</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus size={20} />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add User Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New User</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="viewer">Viewer</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddUser}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Add User
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Last Login
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
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${user.active ? 'bg-green-600' : 'bg-gray-400'}`}
                      ></div>
                      <span className={user.active ? 'text-green-700' : 'text-gray-600'}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.created_at}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Role Permissions Reference */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
            <div key={role} className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                role === 'admin'
                  ? 'text-red-800'
                  : role === 'manager'
                    ? 'text-blue-800'
                    : 'text-gray-800'
              }`}>
                {role === 'admin' ? (
                  <Shield size={20} />
                ) : (
                  <User size={20} />
                )}
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </h3>
              <ul className="space-y-2">
                {permissions.map((perm, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <Check size={16} className="text-green-600" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
