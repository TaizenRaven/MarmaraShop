'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ProductFilter, { FilterState } from '@/components/ProductFilter';

// Mock data - replace with API calls
const MOCK_CATEGORIES: Record<string, any> = {
  electronics: {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic gadgets and devices',
    image: 'https://via.placeholder.com/1200x400?text=Electronics+Banner',
  },
  accessories: {
    id: '2',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Premium accessories for all your devices',
    image: 'https://via.placeholder.com/1200x400?text=Accessories+Banner',
  },
};

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
    category: 'Accessories',
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
];

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = MOCK_CATEGORIES[params.slug];
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    minPrice: null,
    maxPrice: null,
    search: '',
  });

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <a href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  // Get products for this category
  const categoryProducts = MOCK_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === category.name.toLowerCase()
  );

  // Apply filters
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">
              Home
            </a>
            <ChevronRight size={16} />
            <a href="/products" className="hover:text-blue-600">
              Products
            </a>
            <ChevronRight size={16} />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Category Banner */}
      <div className="relative h-96 bg-gray-900">
        {category.image && (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 text-white">
            <h1 className="text-5xl font-bold mb-2">{category.name}</h1>
            <p className="text-xl text-gray-200">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="md:col-span-1">
            <ProductFilter categories={[]} onFilterChange={setFilters} />
          </aside>

          {/* Main Content - Products */}
          <main className="md:col-span-3">
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-gray-600">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No products found in this category matching your filters.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
