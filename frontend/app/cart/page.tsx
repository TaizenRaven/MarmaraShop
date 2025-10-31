'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

export default function CartPage() {
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = useCartStore((state) => state.getCartSubtotal());
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const itemCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">Your cart is currently empty</p>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Add some products to your cart to get started!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Continue Shopping
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">{itemCount} item(s) in your cart</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Cart Header */}
              <div className="bg-gray-50 px-6 py-4 border-b grid grid-cols-5 gap-4 text-sm font-semibold text-gray-900">
                <div>Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Total</div>
                <div></div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.productId} className="px-6 py-6 grid grid-cols-5 gap-4 items-center">
                    {/* Product */}
                    <div className="flex items-center gap-4 col-span-1">
                      {item.image && (
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <Link
                        href={`/products/${item.productId}`}
                        className="text-gray-900 hover:text-blue-600 font-medium line-clamp-2"
                      >
                        {item.title}
                      </Link>
                    </div>

                    {/* Price */}
                    <div className="text-gray-900 font-medium">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-gray-900 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove */}
                    <div className="text-right">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                href="/products"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Summary Items */}
              <div className="space-y-4 mb-6 border-b pb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">Calculated at checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold text-center block mb-3 transition-colors"
              >
                Proceed to Checkout
              </Link>

              {/* Clear Cart */}
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear your cart?')) {
                    clearCart();
                  }
                }}
                className="w-full py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 font-medium transition-colors"
              >
                Clear Cart
              </button>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✓ Free shipping on orders over $100
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  ✓ Cash on Delivery available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
