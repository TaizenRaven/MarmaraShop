'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ProductFilterProps {
  onFilterChange: (filters: FilterState) => void;
  categories: Array<{ id: string; name: string }>;
}

export interface FilterState {
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  search: string;
}

export default function ProductFilter({ onFilterChange, categories }: ProductFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    minPrice: null,
    maxPrice: null,
    search: '',
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['price', 'category'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'min' | 'max'
  ) => {
    const value = e.target.value ? parseFloat(e.target.value) : null;
    handleFilterChange(
      type === 'min'
        ? { minPrice: value }
        : { maxPrice: value }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Price Filter */}
      <div className="mb-6 border-b pb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3 font-semibold text-gray-900"
        >
          <span>Price Range</span>
          <ChevronDown
            size={18}
            className={`transform transition-transform ${
              expandedSections.has('price') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.has('price') && (
          <div className="space-y-2">
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Min Price ($)</label>
              <input
                type="number"
                min="0"
                value={filters.minPrice ?? ''}
                onChange={(e) => handlePriceChange(e, 'min')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Max Price ($)</label>
              <input
                type="number"
                min="0"
                value={filters.maxPrice ?? ''}
                onChange={(e) => handlePriceChange(e, 'max')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full mb-3 font-semibold text-gray-900"
          >
            <span>Category</span>
            <ChevronDown
              size={18}
              className={`transform transition-transform ${
                expandedSections.has('category') ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedSections.has('category') && (
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === null}
                  onChange={() => handleFilterChange({ category: null })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">All Categories</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat.id}
                    onChange={() => handleFilterChange({ category: cat.id })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">{cat.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          const cleared = {
            category: null,
            minPrice: null,
            maxPrice: null,
            search: '',
          };
          setFilters(cleared);
          onFilterChange(cleared);
        }}
        className="w-full py-2 px-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-medium transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}
