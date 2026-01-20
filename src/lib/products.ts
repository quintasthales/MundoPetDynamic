"use client";

// Import Dropet products and wellness products
import dropetProducts from '@/data/dropet-products.json';
import wellnessProducts from '@/data/wellness-products.json';

// Types matching Dropet product structure
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceWithPix: number;
  retailPrice: number;
  originalPrice?: number;
  compareAtPrice?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  image: string;
  images?: string[];
  stock: number;
  sku: string;
  tags: string[];
  supplier: string;
  supplierUrl: string;
  featured?: boolean;
  rating?: number;
  reviews?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

// Convert Dropet products to our Product interface
const convertDropetProduct = (dropetProduct: any): Product => {
  return {
    ...dropetProduct,
    price: dropetProduct.retailPrice,
    originalPrice: dropetProduct.price,
    images: [dropetProduct.image],
    featured: dropetProduct.stock > 100, // Mark high-stock items as featured
    rating: 4.5,
    reviews: Math.floor(Math.random() * 50) + 10
  };
};

// Convert wellness products to Product interface
const convertWellnessProduct = (wellnessProduct: any): Product => {
  return {
    ...wellnessProduct,
    priceWithPix: wellnessProduct.price * 0.95,
    retailPrice: wellnessProduct.price,
    sku: wellnessProduct.id.toUpperCase(),
    supplier: 'Aromalife / YogaPro',
    supplierUrl: 'https://www.aromalife.com.br',
    rating: 4.7,
    reviews: Math.floor(Math.random() * 80) + 20
  };
};

// Get all products (Dropet + Wellness)
export const getAllProducts = (): Product[] => {
  const dropet = dropetProducts.map(convertDropetProduct);
  const wellness = wellnessProducts.map(convertWellnessProduct);
  return [...dropet, ...wellness];
};

// Get featured products (high stock items)
export const getFeaturedProducts = (): Product[] => {
  return getAllProducts()
    .filter(p => p.stock > 100)
    .slice(0, 4);
};

// Get product by ID
export const getProductById = (id: string): Product | undefined => {
  return getAllProducts().find(product => product.id === id);
};

// Get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return getAllProducts().filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  );
};

// Get products by brand
export const getProductsByBrand = (brand: string): Product[] => {
  return getAllProducts().filter(p => 
    p.brand?.toLowerCase() === brand.toLowerCase()
  );
};

// Search products
export const searchProducts = (query: string): Product[] => {
  const searchLower = query.toLowerCase();
  return getAllProducts().filter(p =>
    p.name.toLowerCase().includes(searchLower) ||
    p.description.toLowerCase().includes(searchLower) ||
    p.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
    p.brand?.toLowerCase().includes(searchLower)
  );
};

// Get all categories
export const getAllCategories = (): string[] => {
  return [...new Set(dropetProducts.map(p => p.category))];
};

// Get all brands
export const getAllBrands = (): string[] => {
  return [...new Set(dropetProducts.map(p => p.brand).filter(Boolean))];
};

// Cart functions
const CART_STORAGE_KEY = 'cart';

export const getCart = (): Cart => {
  if (typeof window === 'undefined') {
    return { items: [], subtotal: 0, shipping: 0, total: 0 };
  }

  const cartData = localStorage.getItem(CART_STORAGE_KEY);
  if (!cartData) {
    return { items: [], subtotal: 0, shipping: 0, total: 0 };
  }

  try {
    const cart: Cart = JSON.parse(cartData);
    return cart;
  } catch {
    return { items: [], subtotal: 0, shipping: 0, total: 0 };
  }
};

export const addToCart = (product: Product, quantity: number = 1): void => {
  if (typeof window === 'undefined') return;

  const cart = getCart();
  const existingItemIndex = cart.items.findIndex(
    item => item.product.id === product.id
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ product, quantity });
  }

  updateCartTotals(cart);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const removeFromCart = (productId: string): void => {
  if (typeof window === 'undefined') return;

  const cart = getCart();
  cart.items = cart.items.filter(item => item.product.id !== productId);

  updateCartTotals(cart);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const updateCartItemQuantity = (productId: string, quantity: number): void => {
  if (typeof window === 'undefined') return;

  const cart = getCart();
  const item = cart.items.find(item => item.product.id === productId);

  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
  }

  updateCartTotals(cart);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const clearCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_STORAGE_KEY);
};

const updateCartTotals = (cart: Cart): void => {
  cart.subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  // Free shipping over R$ 150
  cart.shipping = cart.subtotal >= 150 ? 0 : 15;
  cart.total = cart.subtotal + cart.shipping;
};

// Wishlist functions
const WISHLIST_STORAGE_KEY = 'wishlist';

export const getWishlist = (): Product[] => {
  if (typeof window === 'undefined') return [];

  const wishlistData = localStorage.getItem(WISHLIST_STORAGE_KEY);
  if (!wishlistData) return [];

  try {
    return JSON.parse(wishlistData);
  } catch {
    return [];
  }
};

export const addToWishlist = (product: Product): void => {
  if (typeof window === 'undefined') return;

  const wishlist = getWishlist();
  if (!wishlist.find(p => p.id === product.id)) {
    wishlist.push(product);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }
};

export const removeFromWishlist = (productId: string): void => {
  if (typeof window === 'undefined') return;

  const wishlist = getWishlist();
  const filtered = wishlist.filter(p => p.id !== productId);
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(filtered));
};

export const isInWishlist = (productId: string): boolean => {
  const wishlist = getWishlist();
  return wishlist.some(p => p.id === productId);
};
