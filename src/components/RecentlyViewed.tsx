"use client";

import { useEffect, useState } from "react";
import { products } from "@/lib/products";
import Link from "next/link";

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      const productIds = JSON.parse(stored);
      const prods = productIds
        .map((id: string) => products.find((p) => p.id === id))
        .filter(Boolean)
        .slice(0, 4);
      setRecentProducts(prods);
    }
  }, []);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Vistos Recentemente
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProducts.map((product) => (
            <Link
              key={product.id}
              href={`/produto/${product.id}`}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">
                          {product.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to add product to recently viewed
export function addToRecentlyViewed(productId: string) {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("recentlyViewed");
  let recent: string[] = stored ? JSON.parse(stored) : [];

  // Remove if already exists
  recent = recent.filter((id) => id !== productId);

  // Add to beginning
  recent.unshift(productId);

  // Keep only last 10
  recent = recent.slice(0, 10);

  localStorage.setItem("recentlyViewed", JSON.stringify(recent));
}
