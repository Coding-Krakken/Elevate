"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product, ProductQuantityOption } from "@/types";

interface SiteStore {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  isRewardsOpen: boolean;
  toastMessage: string | null;
  addToCart: (product: Product, option: ProductQuantityOption) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openRewards: () => void;
  closeRewards: () => void;
  closeToast: () => void;
}

const SiteStoreContext = createContext<SiteStore | null>(null);

export function SiteStoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const addToCart = useCallback((product: Product, option: ProductQuantityOption) => {
    const cartItemId = `${product.id}:${option.id}`;

    setCartItems((prev) => {
      const found = prev.find((item) => item.id === cartItemId);
      if (found) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          quantityId: option.id,
          name: product.name,
          optionLabel: option.label,
          price: option.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
    setToastMessage(`${product.name} (${option.label}) added to cart`);
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const openRewards = useCallback(() => {
    setIsRewardsOpen(true);
  }, []);

  const closeRewards = useCallback(() => {
    setIsRewardsOpen(false);
  }, []);

  const closeToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      subtotal,
      isCartOpen,
      isRewardsOpen,
      toastMessage,
      addToCart,
      removeFromCart,
      clearCart,
      toggleCart,
      closeCart,
      openRewards,
      closeRewards,
      closeToast,
    }),
    [
      addToCart,
      cartCount,
      cartItems,
      clearCart,
      closeCart,
      closeRewards,
      closeToast,
      isCartOpen,
      isRewardsOpen,
      openRewards,
      removeFromCart,
      subtotal,
      toastMessage,
      toggleCart,
    ],
  );

  return <SiteStoreContext.Provider value={value}>{children}</SiteStoreContext.Provider>;
}

export function useSiteStore() {
  const context = useContext(SiteStoreContext);
  if (!context) {
    throw new Error("useSiteStore must be used within SiteStoreProvider");
  }

  return context;
}
