'use client';

import Link from 'next/link';
import { Users, Settings, Bell, Lock } from 'lucide-react';

export default function SettingsPage() {
  const settingsMenus = [
    {
      title: 'User Management',
      description: 'Manage admin users and assign roles',
      icon: <Users className="text-blue-600" size={24} />,
      href: '/settings/users',
      badge: '3 users',
    },
    {
      title: 'General Settings',
      description: 'Store name, logo, contact information',
      icon: <Settings className="text-purple-600" size={24} />,
      href: '/settings/general',
      badge: null,
    },
    {
      title: 'Notifications',
      description: 'Email and SMS notification preferences',
      icon: <Bell className="text-yellow-600" size={24} />,
      href: '/settings/notifications',
      badge: null,
    },
    {
      title: 'Security',
      description: 'Change password and security settings',
      icon: <Lock className="text-red-600" size={24} />,
      href: '/settings/security',
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your store and account settings</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsMenus.map((menu, index) => (
            <Link
              key={index}
              href={menu.href}
              className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">{menu.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-bold text-gray-900">{menu.title}</h2>
                    {menu.badge && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {menu.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{menu.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
