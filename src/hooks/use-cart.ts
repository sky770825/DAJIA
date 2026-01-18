import { useState, useEffect } from 'react';
import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'dajia-mazu-cart';

export function useCart() {
  // Initialize state from localStorage immediately (during SSR-safe way)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Only access localStorage on client side
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const items = JSON.parse(stored);
        // Validate that items is an array
        if (Array.isArray(items)) {
          return items;
        }
        return [];
      } catch (error) {
        console.error('Failed to load cart from localStorage', error);
        return [];
      }
    }
    return [];
  });

  // Load cart from localStorage on mount (as fallback)
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const items = JSON.parse(stored);
        if (Array.isArray(items)) {
          // Only update if different (avoid unnecessary re-renders)
          setCartItems((prev) => {
            if (prev.length !== items.length) {
              return items;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          // Don't exceed stock
          return prevItems;
        }
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Add new item
        if (quantity > product.stock) {
          return prevItems;
        }
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) => {
      const item = prevItems.find((item) => item.product.id === productId);
      if (!item) return prevItems;

      // Don't exceed stock
      if (quantity > item.product.stock) {
        return prevItems;
      }

      return prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      if (item?.product?.price && item?.quantity) {
        return total + item.product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const getTotalItems = () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      if (item?.quantity) {
        return total + item.quantity;
      }
      return total;
    }, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
}
