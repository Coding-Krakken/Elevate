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
import { useStorefrontContent } from "@/hooks/useStorefrontContent";
import type { AppliedCartDeal, CartItem, ManagedOffer, Product, ProductQuantityOption } from "@/types";

function parseMinutes(value?: string) {
  if (!value) {
    return null;
  }
  const [hoursRaw, minutesRaw] = value.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }
  return hours * 60 + minutes;
}

function isOfferEligible(offer: ManagedOffer, subtotal: number, now: Date) {
  const rules = offer.rules;
  if (!rules) {
    return false;
  }

  if (subtotal <= 0) {
    return false;
  }

  if (typeof rules.minSubtotal === "number" && subtotal < rules.minSubtotal) {
    return false;
  }

  if (rules.startDate && now < new Date(`${rules.startDate}T00:00:00`)) {
    return false;
  }

  if (rules.endDate && now > new Date(`${rules.endDate}T23:59:59`)) {
    return false;
  }

  if (Array.isArray(rules.daysOfWeek) && rules.daysOfWeek.length > 0) {
    if (!rules.daysOfWeek.includes(now.getDay())) {
      return false;
    }
  }

  const startMinutes = parseMinutes(rules.startTime);
  const endMinutes = parseMinutes(rules.endTime);
  if (startMinutes !== null || endMinutes !== null) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const start = startMinutes ?? 0;
    const end = endMinutes ?? 24 * 60;
    if (start <= end) {
      if (currentMinutes < start || currentMinutes > end) {
        return false;
      }
    } else {
      // Time window crossing midnight.
      if (currentMinutes < start && currentMinutes > end) {
        return false;
      }
    }
  }

  return rules.discountValue > 0;
}

function getOfferDiscountAmount(offer: ManagedOffer, subtotal: number) {
  const rules = offer.rules;
  if (!rules || rules.discountValue <= 0) {
    return 0;
  }

  if (rules.discountType === "fixed") {
    return rules.discountValue;
  }

  return (subtotal * rules.discountValue) / 100;
}

interface SiteStore {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  discountTotal: number;
  total: number;
  autoAppliedDeals: AppliedCartDeal[];
  manualAppliedDeals: AppliedCartDeal[];
  availableManualDeals: ManagedOffer[];
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
  applyManualDeal: (offerId: string) => void;
  removeManualDeal: (offerId: string) => void;
  closeToast: () => void;
}

const SiteStoreContext = createContext<SiteStore | null>(null);

export function SiteStoreProvider({ children }: { children: ReactNode }) {
  const { offers } = useStorefrontContent();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [manualAppliedOfferIds, setManualAppliedOfferIds] = useState<string[]>([]);

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
    setManualAppliedOfferIds([]);
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

  const applyManualDeal = useCallback((offerId: string) => {
    setManualAppliedOfferIds((prev) => (prev.includes(offerId) ? prev : [...prev, offerId]));
  }, []);

  const removeManualDeal = useCallback((offerId: string) => {
    setManualAppliedOfferIds((prev) => prev.filter((id) => id !== offerId));
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems],
  );

  const now = useMemo(() => new Date(), [cartItems, offers]);
  const eligibleOffers = useMemo(
    () => offers.filter((offer) => offer.isActive && isOfferEligible(offer, subtotal, now)),
    [offers, subtotal, now],
  );

  const autoEligibleOffers = useMemo(
    () => eligibleOffers.filter((offer) => offer.rules?.autoApply),
    [eligibleOffers],
  );

  const manualEligibleOffers = useMemo(
    () => eligibleOffers.filter((offer) => offer.rules?.allowManualApply),
    [eligibleOffers],
  );

  useEffect(() => {
    setManualAppliedOfferIds((prev) => prev.filter((id) => manualEligibleOffers.some((offer) => offer.id === id)));
  }, [manualEligibleOffers]);

  const manualAppliedOffers = useMemo(
    () => manualEligibleOffers.filter((offer) => manualAppliedOfferIds.includes(offer.id)),
    [manualAppliedOfferIds, manualEligibleOffers],
  );

  const availableManualDeals = useMemo(
    () => manualEligibleOffers.filter((offer) => !manualAppliedOfferIds.includes(offer.id)),
    [manualAppliedOfferIds, manualEligibleOffers],
  );

  const autoAppliedDeals = useMemo<AppliedCartDeal[]>(
    () =>
      autoEligibleOffers.map((offer) => ({
        id: offer.id,
        title: offer.title,
        amount: getOfferDiscountAmount(offer, subtotal),
        source: "auto",
      })),
    [autoEligibleOffers, subtotal],
  );

  const manualAppliedDeals = useMemo<AppliedCartDeal[]>(
    () =>
      manualAppliedOffers.map((offer) => ({
        id: offer.id,
        title: offer.title,
        amount: getOfferDiscountAmount(offer, subtotal),
        source: "manual",
      })),
    [manualAppliedOffers, subtotal],
  );

  const discountTotal = useMemo(
    () => [...autoAppliedDeals, ...manualAppliedDeals].reduce((acc, deal) => acc + deal.amount, 0),
    [autoAppliedDeals, manualAppliedDeals],
  );

  const total = useMemo(() => Math.max(0, subtotal - discountTotal), [discountTotal, subtotal]);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      subtotal,
      discountTotal,
      total,
      autoAppliedDeals,
      manualAppliedDeals,
      availableManualDeals,
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
      applyManualDeal,
      removeManualDeal,
      closeToast,
    }),
    [
      addToCart,
      applyManualDeal,
      autoAppliedDeals,
      cartCount,
      cartItems,
      clearCart,
      closeCart,
      closeRewards,
      closeToast,
      discountTotal,
      isCartOpen,
      isRewardsOpen,
      manualAppliedDeals,
      openRewards,
      availableManualDeals,
      removeFromCart,
      removeManualDeal,
      subtotal,
      total,
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
