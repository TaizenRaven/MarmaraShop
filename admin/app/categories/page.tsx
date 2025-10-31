'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react';

// Mock data - replace with API calls
const MOCK_CATEGORIES = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    parentId: null,
    productCount: 45,
    status: 'active',
  },
  {
    id: '2',
    name: 'Accessories',
    slug: 'accessories',
    parentId: null,
    productCount: 120,
    status: 'active',
  },
  {
    id: '3',
    name: 'Cables',
    slug: 'cables',
    parentId: '2',
    productCount: 35,
    status: 'active',
  },
  {
    id: '4',
    name: 'Adapters',
    slug: 'adapters',
    parentId: '2',
    productCount: 28,
    status: 'active',
  },
  {
    id: '5',
    name: 'Lighting',
    slug: 'lighting',
    parentId: null,
    productCount: 12,
    status: 'inactive',
  },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const handleSelectCategory = (id: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCategories(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCategories.size === categories.length) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories(new Set(categories.map((c) => c.id)));
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((c) => c.id !== id));
      setSelectedCategories((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const getCategoryHierarchy = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category || !category.parentId) {
      return category?.name || '';
    }
    const parent = categories.find((c) => c.id === category.parentId);
    return parent ? `${parent.name} > ${category.name}` : category.name;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Manage product categories and hierarchy</p>
          </div>
          <Link
            href="/categories/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus size={20} />
            Add Category
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      categories.length > 0 && selectedCategories.size === categories.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Slug</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Hierarchy
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(category.id)}
                        onChange={() => handleSelectCategory(category.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/categories/${category.id}/edit`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {category.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        {category.parentId && (
                          <>
                            <span className="text-gray-400">
                              {getCategoryHierarchy(category.id)}
                            </span>
                          </>
                        )}
                        {!category.parentId && <span>—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {category.productCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          category.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/categories/${category.id}/edit`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-sm text-gray-600">
          Total: {categories.length} categories
        </div>
      </div>
    </div>
  );
}
