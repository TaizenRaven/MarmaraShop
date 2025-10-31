'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image?: string;
  category?: string;
  inStock: boolean;
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  category,
  inStock,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: id,
      title,
      price,
      quantity: 1,
      image,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
            <span>No image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {category && (
          <p className="text-sm text-gray-500 mb-1">{category}</p>
        )}
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2 line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-gray-900">${price.toFixed(2)}</span>
          {!inStock && (
            <span className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded">
              Out of Stock
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-colors ${
            inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
