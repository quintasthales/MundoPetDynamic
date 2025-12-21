// src/lib/wishlist.ts - Wishlist Management System
import { Product } from './products';

const WISHLIST_STORAGE_KEY = 'mundopetzen_wishlist';

// Get wishlist from localStorage
export function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  
  const wishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
  return wishlist ? JSON.parse(wishlist) : [];
}

// Add product to wishlist
export function addToWishlist(productId: string): void {
  const wishlist = getWishlist();
  
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    
    // Dispatch event for UI updates
    window.dispatchEvent(new Event('wishlistUpdated'));
  }
}

// Remove product from wishlist
export function removeFromWishlist(productId: string): void {
  let wishlist = getWishlist();
  wishlist = wishlist.filter(id => id !== productId);
  
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  
  // Dispatch event for UI updates
  window.dispatchEvent(new Event('wishlistUpdated'));
}

// Toggle product in wishlist
export function toggleWishlist(productId: string): boolean {
  const wishlist = getWishlist();
  const isInWishlist = wishlist.includes(productId);
  
  if (isInWishlist) {
    removeFromWishlist(productId);
    return false;
  } else {
    addToWishlist(productId);
    return true;
  }
}

// Check if product is in wishlist
export function isInWishlist(productId: string): boolean {
  const wishlist = getWishlist();
  return wishlist.includes(productId);
}

// Get wishlist count
export function getWishlistCount(): number {
  return getWishlist().length;
}

// Clear entire wishlist
export function clearWishlist(): void {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new Event('wishlistUpdated'));
}
