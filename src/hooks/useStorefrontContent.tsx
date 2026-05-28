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
import { generateDeviceFingerprint } from "@/lib/fingerprint";
import { categories as defaultCategories } from "@/data/categories";
import { homePageContent } from "@/data/homepage";
import { products } from "@/data/products";
import { promos } from "@/data/promos";
import { reviews as defaultReviews } from "@/data/reviews";
import type {
  CategoryItem,
  ElementStyleOverrides,
  HomepageContent,
  ManagedOffer,
  ManagedProduct,
  OfferRules,
  PageLayout,
  ProductQuantityOption,
  Review,
  StorefrontConfig,
} from "@/types";

const STORAGE_KEY = "syracuse-exoticz-storefront-content-v1";
const LEGACY_STORAGE_KEY = "elevate-storefront-content-v1";

interface StorefrontState {
  products: ManagedProduct[];
  offers: ManagedOffer[];
  config: StorefrontConfig;
  homepage: HomepageContent;
  categories: CategoryItem[];
  testimonials: Review[];
  pageLayout: PageLayout;
  styleOverrides: Record<string, ElementStyleOverrides>;
}

interface StorefrontContentContextValue extends StorefrontState {
  loaded: boolean;
  addProduct: () => void;
  updateProduct: (id: string, updates: Partial<ManagedProduct>) => void;
  deleteProduct: (id: string) => void;
  addOffer: () => void;
  updateOffer: (id: string, updates: Partial<ManagedOffer>) => void;
  deleteOffer: (id: string) => void;
  updateConfig: (updates: Partial<StorefrontConfig>) => void;
  updateHomepage: (updates: Partial<HomepageContent>) => void;
  updateCategories: (next: CategoryItem[]) => void;
  updateTestimonials: (next: Review[]) => void;
  updatePageLayout: (next: PageLayout) => void;
  persistContent: () => Promise<boolean>;
  refreshFromServer: () => Promise<void>;
  resetDefaults: () => void;
}

const defaultState: StorefrontState = {
  products: products.map((product) => ({ ...product, isActive: true })),
  offers: promos.map((offer) => ({ ...offer, isActive: true })),
  config: {
    pageTitle: "Syracuse Exoticz Main Storefront",
    pageSubtitle: "Browse every available product and active deals in one place.",
    showProducts: true,
    showOffers: true,
  },
  homepage: {
    hero: {
      ...homePageContent.hero,
      primaryCtaHref: "/",
      secondaryCtaHref: "#deals",
      highlights: ["PREMIUM QUALITY", "EXPERTLY CURATED", "100% SATISFACTION"],
    },
    fulfillment: {
      items: homePageContent.fulfillment.items.map((item) => ({ ...item })),
      rating: homePageContent.fulfillment.rating,
      reviewsLabel: homePageContent.fulfillment.reviewsLabel,
    },
    topBar: {
      text: "FREE EXPRESS DELIVERY ON ORDERS $75+",
    },
    header: {
      brandLine1: "SYRACUSE",
      brandLine2: "EXOTICZ",
      logoHref: "/",
      accountHref: "/admin",
    },
    footer: {
      tagline: "PREMIUM CANNABIS. UNMATCHED VIBES.",
      columnTitle: "SHOP",
      links: [
        { label: "All Products", href: "#" },
        { label: "Flower", href: "#" },
        { label: "Edibles", href: "#" },
        { label: "Vapes", href: "#" },
        { label: "Concentrates", href: "#" },
      ],
      disclaimer: "18+ | For adults 21+ only. Keep out of reach of children. Follow all local laws.",
      copyright: "© 2024 Syracuse Exoticz. All rights reserved.",
    },
    testimonials: {
      viewAllLabel: "VIEW ALL",
      viewAllHref: "#reviews",
      prevLabel: "Prev",
      nextLabel: "Next",
    },
    categories: {
      viewAllLabel: "VIEW ALL",
    },
  },
  categories: defaultCategories.map((category) => ({ ...category })),
  testimonials: defaultReviews.map((review) => ({ ...review })),
  pageLayout: {
    sections: [
      { id: "hero", type: "hero", visible: true, order: 0 },
      { id: "fulfillment", type: "fulfillment", visible: true, order: 1 },
      { id: "products", type: "products", visible: true, order: 2 },
      { id: "promos", type: "promos", visible: true, order: 3 },
      { id: "testimonials", type: "testimonials", visible: true, order: 4 },
    ],
  },
  styleOverrides: {},
};

const StorefrontContentContext = createContext<StorefrontContentContextValue | null>(null);

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

const DEFAULT_QUANTITY_TEMPLATES = [
  { label: "1 oz", price: 0 },
  { label: "2 oz", price: 0 },
  { label: "1/4 lb", price: 0 },
];

function createDefaultQuantityOption(label = "1 oz", price = 0): ProductQuantityOption {
  return {
    id: generateId("qty"),
    label,
    price,
    isActive: true,
  };
}

function createDefaultQuantities(): ProductQuantityOption[] {
  return DEFAULT_QUANTITY_TEMPLATES.map((option) =>
    createDefaultQuantityOption(option.label, option.price),
  );
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
    quantities: normalized.length > 0 ? normalized : maybeLegacy.size ? [derivedFallback] : createDefaultQuantities(),
  };
}

function ensureOfferRules(offer: ManagedOffer): ManagedOffer {
  const rules: OfferRules = {
    autoApply: offer.rules?.autoApply ?? false,
    allowManualApply: offer.rules?.allowManualApply ?? true,
    discountType: offer.rules?.discountType ?? "percent",
    discountValue: typeof offer.rules?.discountValue === "number" ? offer.rules.discountValue : 0,
    minSubtotal: typeof offer.rules?.minSubtotal === "number" ? offer.rules.minSubtotal : undefined,
    startDate: offer.rules?.startDate || undefined,
    endDate: offer.rules?.endDate || undefined,
    startTime: offer.rules?.startTime || undefined,
    endTime: offer.rules?.endTime || undefined,
    daysOfWeek: Array.isArray(offer.rules?.daysOfWeek)
      ? offer.rules?.daysOfWeek.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
      : undefined,
  };

  return {
    ...offer,
    rules,
  };
}

export function StorefrontContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StorefrontState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  const normalizeState = useCallback((raw: Partial<StorefrontState>): StorefrontState => {
    return {
      products: Array.isArray(raw.products)
        ? raw.products.map((product) => ensureProductQuantities(product as ManagedProduct))
        : defaultState.products,
      offers: Array.isArray(raw.offers)
        ? raw.offers.map((offer) => ensureOfferRules(offer as ManagedOffer))
        : defaultState.offers,
      config: raw.config ? { ...defaultState.config, ...raw.config } : defaultState.config,
      homepage: {
        hero: {
          ...defaultState.homepage.hero,
          ...(raw.homepage?.hero ?? {}),
          primaryCtaHref:
            raw.homepage?.hero?.primaryCtaHref ?? defaultState.homepage.hero.primaryCtaHref,
          secondaryCtaHref:
            raw.homepage?.hero?.secondaryCtaHref ?? defaultState.homepage.hero.secondaryCtaHref,
          highlights:
            Array.isArray(raw.homepage?.hero?.highlights) && raw.homepage!.hero.highlights.length > 0
              ? raw.homepage!.hero.highlights.map((item) => `${item}`)
              : defaultState.homepage.hero.highlights,
        },
        fulfillment: {
          items: Array.isArray(raw.homepage?.fulfillment?.items)
            ? raw.homepage!.fulfillment.items.map((item) => ({ ...item }))
            : defaultState.homepage.fulfillment.items,
          rating: raw.homepage?.fulfillment?.rating ?? defaultState.homepage.fulfillment.rating,
          reviewsLabel:
            raw.homepage?.fulfillment?.reviewsLabel ?? defaultState.homepage.fulfillment.reviewsLabel,
        },
        topBar: {
          text: raw.homepage?.topBar?.text ?? defaultState.homepage.topBar.text,
        },
        header: {
          brandLine1: raw.homepage?.header?.brandLine1 ?? defaultState.homepage.header.brandLine1,
          brandLine2: raw.homepage?.header?.brandLine2 ?? defaultState.homepage.header.brandLine2,
          logoHref: raw.homepage?.header?.logoHref ?? defaultState.homepage.header.logoHref,
          accountHref: raw.homepage?.header?.accountHref ?? defaultState.homepage.header.accountHref,
        },
        footer: {
          tagline: raw.homepage?.footer?.tagline ?? defaultState.homepage.footer.tagline,
          columnTitle: raw.homepage?.footer?.columnTitle ?? defaultState.homepage.footer.columnTitle,
          links: Array.isArray(raw.homepage?.footer?.links)
            ? raw.homepage!.footer.links.map((link) => ({
                label: link.label || "Link",
                href: link.href || "#",
              }))
            : defaultState.homepage.footer.links,
          disclaimer: raw.homepage?.footer?.disclaimer ?? defaultState.homepage.footer.disclaimer,
          copyright: raw.homepage?.footer?.copyright ?? defaultState.homepage.footer.copyright,
        },
        testimonials: {
          viewAllLabel:
            raw.homepage?.testimonials?.viewAllLabel ?? defaultState.homepage.testimonials.viewAllLabel,
          viewAllHref:
            raw.homepage?.testimonials?.viewAllHref ?? defaultState.homepage.testimonials.viewAllHref,
          prevLabel:
            raw.homepage?.testimonials?.prevLabel ?? defaultState.homepage.testimonials.prevLabel,
          nextLabel:
            raw.homepage?.testimonials?.nextLabel ?? defaultState.homepage.testimonials.nextLabel,
        },
        categories: {
          viewAllLabel:
            raw.homepage?.categories?.viewAllLabel ?? defaultState.homepage.categories.viewAllLabel,
        },
      },
      categories: Array.isArray(raw.categories)
        ? raw.categories.map((category) => ({ ...category }))
        : defaultState.categories,
      testimonials: Array.isArray(raw.testimonials)
        ? raw.testimonials.map((review) => ({ ...review }))
        : defaultState.testimonials,
      pageLayout: {
        sections: Array.isArray(raw.pageLayout?.sections)
          ? raw.pageLayout!.sections
              .map((section) => ({ ...section }))
              .sort((a, b) => a.order - b.order)
          : defaultState.pageLayout.sections,
      },
      styleOverrides:
        raw.styleOverrides && typeof raw.styleOverrides === "object"
          ? { ...(raw.styleOverrides as Record<string, ElementStyleOverrides>) }
          : {},
    };
  }, []);

  const loadFromServer = useCallback(async () => {
    const res = await fetch("/api/content");
    if (!res.ok) {
      throw new Error("Failed to fetch storefront content");
    }
    const data = (await res.json()) as Partial<StorefrontState>;
    return normalizeState(data);
  }, [normalizeState]);

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        const serverState = await loadFromServer();
        if (!cancelled) {
          setState(serverState);
          setLoaded(true);
          return;
        }
      } catch {}

      // Fallback: try localStorage (legacy support)
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (!raw || cancelled) {
          setLoaded(true);
          return;
        }
        const parsed = JSON.parse(raw) as Partial<StorefrontState>;
        if (!parsed.products || !parsed.offers || !parsed.config) {
          setLoaded(true);
          return;
        }
        const migrated = normalizeState(parsed);
        if (!cancelled) {
          setState(migrated);
        }
      } catch {}
      if (!cancelled) {
        setLoaded(true);
      }
    }

    loadContent();
    return () => { cancelled = true; };
  }, []);

  // Keep localStorage in sync as a backup
  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, loaded]);

  const addProduct = useCallback(() => {
    const newProduct: ManagedProduct = {
      id: generateId("product"),
      name: "New Product",
      brand: "Brand",
      category: "flower",
      strain: "HYBRID",
      description: "Product description",
      thc: "THC 20%",
      quantities: createDefaultQuantities(),
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
      rules: {
        autoApply: false,
        allowManualApply: true,
        discountType: "percent",
        discountValue: 15,
      },
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

  const updateHomepage = useCallback((updates: Partial<HomepageContent>) => {
    setState((prev) => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        ...updates,
      },
    }));
  }, []);

  const updateCategories = useCallback((next: CategoryItem[]) => {
    setState((prev) => ({ ...prev, categories: next }));
  }, []);

  const updateTestimonials = useCallback((next: Review[]) => {
    setState((prev) => ({ ...prev, testimonials: next }));
  }, []);

  const updatePageLayout = useCallback((next: PageLayout) => {
    setState((prev) => ({ ...prev, pageLayout: next }));
  }, []);

  const persistContent = useCallback(async () => {
    try {
      const fingerprint = await generateDeviceFingerprint();
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-fingerprint": fingerprint,
        },
        body: JSON.stringify(state),
      });
      return response.ok;
    } catch {
      return false;
    }
  }, [state]);

  const refreshFromServer = useCallback(async () => {
    try {
      const serverState = await loadFromServer();
      setState(serverState);
    } catch {}
  }, [loadFromServer]);

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
      updateHomepage,
      updateCategories,
      updateTestimonials,
      updatePageLayout,
      persistContent,
      refreshFromServer,
      loaded,
      resetDefaults,
    }),
    [
      addOffer,
      addProduct,
      deleteOffer,
      deleteProduct,
      resetDefaults,
      state,
      loaded,
      persistContent,
      refreshFromServer,
      updateCategories,
      updateConfig,
      updateHomepage,
      updateOffer,
      updatePageLayout,
      updateProduct,
      updateTestimonials,
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
