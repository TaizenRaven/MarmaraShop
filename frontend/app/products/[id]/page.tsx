'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import ProductCard from '@/components/ProductCard';

// Mock data - replace with API calls
const MOCK_PRODUCTS: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Premium Wireless Headphones',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://via.placeholder.com/600x600?text=Headphones',
    category: 'Electronics',
    description:
      'Experience crystal-clear sound with our premium wireless headphones. Featuring noise cancellation, 30-hour battery life, and premium comfort padding.',
    inStock: true,
    rating: 4.5,
    reviews: 128,
    specifications: {
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Battery Life': 'Up to 30 hours',
      'Charging Time': '2 hours',
      'Bluetooth Version': '5.2',
    },
  },
};

const RELATED_PRODUCTS = [
  {
    id: '2',
    title: 'Laptop Stand',
    price: 49.99,
    image: 'https://via.placeholder.com/300x300?text=Laptop+Stand',
    category: 'Accessories',
    inStock: true,
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

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = MOCK_PRODUCTS[params.id];
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <ChevronRight size={16} />
            <Link href="/products" className="hover:text-blue-600">
              Products
            </Link>
            <ChevronRight size={16} />
            <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-blue-600">
              {product.category}
            </Link>
            <ChevronRight size={16} />
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div>
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Title & Rating */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <span className="text-green-600 font-semibold">In Stock</span>
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">{product.description}</p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    product.inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`py-3 px-6 rounded-lg border-2 font-semibold transition-colors ${
                    isWishlisted
                      ? 'border-red-600 text-red-600 bg-red-50'
                      : 'border-gray-300 text-gray-700 hover:border-red-600'
                  }`}
                >
                  <Heart size={20} className="inline mr-2" />
                  Wishlist
                </button>
                <button className="py-3 px-6 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-blue-600 font-semibold transition-colors">
                  <Share2 size={20} className="inline" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 border-t pt-6">
                <div className="text-center">
                  <Truck className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Secure Checkout</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">30-Day Return</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <div className="mt-8 bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-3">
                  <span className="text-gray-700 font-medium">{key}</span>
                  <span className="text-gray-900">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RELATED_PRODUCTS.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                title={relatedProduct.title}
                price={relatedProduct.price}
                image={relatedProduct.image}
                category={relatedProduct.category}
                inStock={relatedProduct.inStock}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
