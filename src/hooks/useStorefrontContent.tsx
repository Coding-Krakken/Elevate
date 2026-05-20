"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/data/products";
import { promos } from "@/data/promos";
import type { ManagedOffer, ManagedProduct, ProductQuantityOption, StorefrontConfig } from "@/types";

const STORAGE_KEY = "elevate-storefront-content-v1";

interface StorefrontState {
  products: ManagedProduct[];
  offers: ManagedOffer[];
  config: StorefrontConfig;
}

interface StorefrontContent extends StorefrontState {
  addProduct: () => void;
  updateProduct: (id: string, updates: Partial<ManagedProduct>) => void;
  deleteProduct: (id: string) => void;
  addOffer: () => void;
  updateOffer: (id: string, updates: Partial<ManagedOffer>) => void;
  deleteOffer: (id: string) => void;
  updateConfig: (updates: Partial<StorefrontConfig>) => void;
  resetDefaults: () => void;
}

const defaultState: StorefrontState = {
  products: products.map((product) => ({ ...product, isActive: true })),
  offers: promos.map((offer) => ({ ...offer, isActive: true })),
  config: {
    pageTitle: "Elevate Main Storefront",
    pageSubtitle: "Browse every available product and active deals in one place.",
    showProducts: true,
    showOffers: true,
  },
};

const StorefrontContentContext = createContext<StorefrontContent | null>(null);

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createDefaultQuantityOption(): ProductQuantityOption {
  return {
    id: generateId("qty"),
    label: "1 unit",
    price: 30,
    isActive: true,
  };
}

function ensureProductQuantities(product: ManagedProduct): ManagedProduct {
  const fallback = createDefaultQuantityOption();
  const maybeLegacy = product as ManagedProduct & { size?: string; price?: number };
  const derivedFallback: ProductQuantityOption = {
    ...fallback,
    label: maybeLegacy.size || fallback.label,
    price: typeof maybeLegacy.price === "number" ? maybeLegacy.price : fallback.price,
  };

  const normalized = Array.isArray(product.quantities)
    ? product.quantities
        .map((option, index) => ({
          id: option.id || generateId(`qty-${index}`),
          label: option.label || `Option ${index + 1}`,
          price: typeof option.price === "number" ? option.price : 0,
          isActive: option.isActive !== false,
        }))
        .filter((option) => option.label.trim().length > 0)
    : [];

  return {
    ...product,
    quantities: normalized.length > 0 ? normalized : [derivedFallback],
  };
}

export function StorefrontContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StorefrontState>(defaultState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as StorefrontState;
      if (!parsed.products || !parsed.offers || !parsed.config) {
        return;
      }
      const migrated: StorefrontState = {
        ...parsed,
        products: parsed.products.map((product) => ensureProductQuantities(product)),
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(migrated);
    } catch {}
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addProduct = useCallback(() => {
    const newProduct: ManagedProduct = {
      id: generateId("product"),
      name: "New Product",
      brand: "Brand",
      category: "flower",
      strain: "HYBRID",
      description: "Product description",
      thc: "THC 20%",
      quantities: [createDefaultQuantityOption()],
      image: "/images/product-neon-runtz.jpg",
      imagePosition: "center",
      isActive: true,
    };

    setState((prev) => ({ ...prev, products: [newProduct, ...prev.products] }));
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<ManagedProduct>) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === id ? { ...product, ...updates } : product,
      ),
    }));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setState((prev) => ({ ...prev, products: prev.products.filter((product) => product.id !== id) }));
  }, []);

  const addOffer = useCallback(() => {
    const newOffer: ManagedOffer = {
      id: generateId("offer"),
      eyebrow: "SPECIAL OFFER",
      title: "15% OFF",
      subtitle: "SELECT ITEMS",
      cta: "VIEW DEAL",
      code: "",
      image: "/images/promo-deal-week.jpg",
      isActive: true,
    };

    setState((prev) => ({ ...prev, offers: [newOffer, ...prev.offers] }));
  }, []);

  const updateOffer = useCallback((id: string, updates: Partial<ManagedOffer>) => {
    setState((prev) => ({
      ...prev,
      offers: prev.offers.map((offer) => (offer.id === id ? { ...offer, ...updates } : offer)),
    }));
  }, []);

  const deleteOffer = useCallback((id: string) => {
    setState((prev) => ({ ...prev, offers: prev.offers.filter((offer) => offer.id !== id) }));
  }, []);

  const updateConfig = useCallback((updates: Partial<StorefrontConfig>) => {
    setState((prev) => ({ ...prev, config: { ...prev.config, ...updates } }));
  }, []);

  const resetDefaults = useCallback(() => {
    setState(defaultState);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      addProduct,
      updateProduct,
      deleteProduct,
      addOffer,
      updateOffer,
      deleteOffer,
      updateConfig,
      resetDefaults,
    }),
    [
      addOffer,
      addProduct,
      deleteOffer,
      deleteProduct,
      resetDefaults,
      state,
      updateConfig,
      updateOffer,
      updateProduct,
    ],
  );

  return (
    <StorefrontContentContext.Provider value={value}>{children}</StorefrontContentContext.Provider>
  );
}

export function useStorefrontContent() {
  const context = useContext(StorefrontContentContext);
  if (!context) {
    throw new Error("useStorefrontContent must be used within StorefrontContentProvider");
  }

  return context;
}
