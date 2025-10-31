'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

// Mock data - replace with API calls
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    price: 79.99,
    stock: 45,
    status: 'active',
  },
  {
    id: '2',
    name: 'Laptop Stand',
    sku: 'LS-001',
    category: 'Accessories',
    price: 49.99,
    stock: 120,
    status: 'active',
  },
  {
    id: '3',
    name: 'USB-C Cable',
    sku: 'USB-001',
    category: 'Cables',
    price: 19.99,
    stock: 0,
    status: 'inactive',
  },
  {
    id: '4',
    name: '4K Webcam',
    sku: 'WC-001',
    category: 'Electronics',
    price: 129.99,
    stock: 23,
    status: 'active',
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
      setSelectedProducts((prev) => {
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
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <Link
            href="/products/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus size={20} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      selectedProducts.size === filteredProducts.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">${product.price}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.stock > 20
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.status === 'active'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
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
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-600">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
}
