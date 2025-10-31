'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductFilter, { FilterState } from '@/components/ProductFilter';

// Mock data - replace with API calls
const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Wireless Headphones',
    price: 79.99,
    image: 'https://via.placeholder.com/300x300?text=Headphones',
    category: 'Electronics',
    inStock: true,
  },
  {
    id: '2',
    title: 'Laptop Stand',
    price: 49.99,
    image: 'https://via.placeholder.com/300x300?text=Laptop+Stand',
    category: 'Accessories',
    inStock: true,
  },
  {
    id: '3',
    title: 'USB-C Cable',
    price: 19.99,
    image: 'https://via.placeholder.com/300x300?text=USB+Cable',
    category: 'Cables',
    inStock: false,
  },
  {
    id: '4',
    title: '4K Webcam',
    price: 129.99,
    image: 'https://via.placeholder.com/300x300?text=Webcam',
    category: 'Electronics',
    inStock: true,
  },
  {
    id: '5',
    title: 'Desk Lamp',
    price: 39.99,
    image: 'https://via.placeholder.com/300x300?text=Desk+Lamp',
    category: 'Lighting',
    inStock: true,
  },
  {
    id: '6',
    title: 'Mouse Pad',
    price: 14.99,
    image: 'https://via.placeholder.com/300x300?text=Mouse+Pad',
    category: 'Accessories',
    inStock: true,
  },
];

const MOCK_CATEGORIES = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Accessories' },
  { id: '3', name: 'Cables' },
  { id: '4', name: 'Lighting' },
];

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    minPrice: null,
    maxPrice: null,
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Apply filters
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false;
      }
      if (filters.search && !product.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [filters]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Browse our complete product catalog</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="md:col-span-1">
            <ProductFilter
              categories={MOCK_CATEGORIES}
              onFilterChange={setFilters}
            />
          </aside>

          {/* Main Content - Products */}
          <main className="md:col-span-3">
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {paginatedProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                {' '}to {' '}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
                {filteredProducts.length} products
              </p>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                      inStock={product.inStock}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found matching your filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
