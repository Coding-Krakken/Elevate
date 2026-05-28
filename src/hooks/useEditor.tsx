"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { generateDeviceFingerprint } from "@/lib/fingerprint";
import type {
  CategoryItem,
  EditorElementType,
  HomepageContent,
  ManagedOffer,
  ManagedProduct,
  PageLayout,
  Review,
  SelectedElement,
  StorefrontConfig,
  StorefrontContent,
} from "@/types";

const DRAFT_KEY = "syracuse-exoticz-editor-draft-v1";

interface EditorState {
  content: StorefrontContent;
  selectedElement: SelectedElement | null;
  activeMenu: string | null;
  isDirty: boolean;
  isSaving: boolean;
  isPreview: boolean;
}

interface EditorContextValue extends EditorState {
  select: (element: SelectedElement) => void;
  deselect: () => void;
  openMenu: (menu: string) => void;
  closeMenu: () => void;
  updateContent: (updater: (content: StorefrontContent) => StorefrontContent) => void;
  updateHomepage: (updates: Partial<HomepageContent>) => void;
  updateConfig: (updates: Partial<StorefrontConfig>) => void;
  updateProduct: (id: string, updates: Partial<ManagedProduct>) => void;
  addProduct: () => void;
  deleteProduct: (id: string) => void;
  updateOffer: (id: string, updates: Partial<ManagedOffer>) => void;
  addOffer: () => void;
  deleteOffer: (id: string) => void;
  updateTestimonial: (id: string, updates: Partial<Review>) => void;
  addTestimonial: () => void;
  deleteTestimonial: (id: string) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  updatePageLayout: (layout: PageLayout) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  toggleSectionVisibility: (sectionId: string) => void;
  deleteSection: (sectionId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  save: () => Promise<void>;
  discard: () => void;
  togglePreview: () => void;
  setFieldValue: (path: string, value: unknown) => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split(".");
  const result = { ...obj };
  let current: Record<string, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (Array.isArray(current[key])) {
      current[key] = [...(current[key] as unknown[])];
    } else {
      current[key] = { ...(current[key] as Record<string, unknown>) };
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

export function EditorProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent: StorefrontContent;
}) {
  const [content, setContent] = useState<StorefrontContent>(initialContent);
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const historyRef = useRef<{ past: StorefrontContent[]; future: StorefrontContent[] }>({
    past: [],
    future: [],
  });
  const savedContentRef = useRef<StorefrontContent>(initialContent);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        try {
          window.localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
        } catch {}
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [content, isDirty]);

  // Load draft on mount
  useEffect(() => {
    try {
      const draft = window.localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft) as StorefrontContent;
        if (parsed.config && parsed.products && parsed.offers) {
          setContent(parsed);
          setIsDirty(true);
        }
      }
    } catch {}
  }, []);

  // Warn before tab close or navigation when there are unsaved changes.
  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const pushHistory = useCallback((prevContent: StorefrontContent) => {
    historyRef.current.past = [...historyRef.current.past.slice(-49), prevContent];
    historyRef.current.future = [];
  }, []);

  const select = useCallback((element: SelectedElement) => {
    setSelectedElement(element);
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, []);

  const deselect = useCallback(() => {
    setSelectedElement(null);
    setActiveMenu(null);
  }, []);

  const openMenu = useCallback((menu: string) => {
    setActiveMenu(menu);
  }, []);

  const closeMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const updateContent = useCallback(
    (updater: (content: StorefrontContent) => StorefrontContent) => {
      setContent((prev) => {
        pushHistory(prev);
        const next = updater(prev);
        setIsDirty(true);
        return next;
      });
    },
    [pushHistory],
  );

  const updateHomepage = useCallback(
    (updates: Partial<HomepageContent>) => {
      updateContent((c) => ({ ...c, homepage: { ...c.homepage, ...updates } }));
    },
    [updateContent],
  );

  const updateConfig = useCallback(
    (updates: Partial<StorefrontConfig>) => {
      updateContent((c) => ({ ...c, config: { ...c.config, ...updates } }));
    },
    [updateContent],
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<ManagedProduct>) => {
      updateContent((c) => ({
        ...c,
        products: c.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
    },
    [updateContent],
  );

  const addProduct = useCallback(() => {
    const newProduct: ManagedProduct = {
      id: generateId("product"),
      name: "New Product",
      brand: "Brand",
      category: "flower",
      strain: "HYBRID",
      description: "Product description",
      thc: "THC 20%",
      quantities: [
        { id: generateId("qty"), label: "1g", price: 0, isActive: true },
        { id: generateId("qty"), label: "1/8 oz", price: 0, isActive: true },
        { id: generateId("qty"), label: "1/4 oz", price: 0, isActive: true },
      ],
      image: "/images/product-neon-runtz.jpg",
      imagePosition: "center",
      isActive: true,
    };
    updateContent((c) => ({ ...c, products: [newProduct, ...c.products] }));
  }, [updateContent]);

  const deleteProduct = useCallback(
    (id: string) => {
      updateContent((c) => ({ ...c, products: c.products.filter((p) => p.id !== id) }));
    },
    [updateContent],
  );

  const updateOffer = useCallback(
    (id: string, updates: Partial<ManagedOffer>) => {
      updateContent((c) => ({
        ...c,
        offers: c.offers.map((o) => (o.id === id ? { ...o, ...updates } : o)),
      }));
    },
    [updateContent],
  );

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
    updateContent((c) => ({ ...c, offers: [newOffer, ...c.offers] }));
  }, [updateContent]);

  const deleteOffer = useCallback(
    (id: string) => {
      updateContent((c) => ({ ...c, offers: c.offers.filter((o) => o.id !== id) }));
    },
    [updateContent],
  );

  const updateTestimonial = useCallback(
    (id: string, updates: Partial<Review>) => {
      updateContent((c) => ({
        ...c,
        testimonials: c.testimonials.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));
    },
    [updateContent],
  );

  const addTestimonial = useCallback(() => {
    const newReview: Review = {
      id: generateId("review"),
      name: "New Customer",
      quote: "Amazing experience!",
      rating: 5,
    };
    updateContent((c) => ({ ...c, testimonials: [...c.testimonials, newReview] }));
  }, [updateContent]);

  const deleteTestimonial = useCallback(
    (id: string) => {
      updateContent((c) => ({ ...c, testimonials: c.testimonials.filter((t) => t.id !== id) }));
    },
    [updateContent],
  );

  const updateCategory = useCallback(
    (id: string, updates: Partial<CategoryItem>) => {
      updateContent((c) => ({
        ...c,
        categories: c.categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)),
      }));
    },
    [updateContent],
  );

  const updatePageLayout = useCallback(
    (layout: PageLayout) => {
      updateContent((c) => ({ ...c, pageLayout: layout }));
    },
    [updateContent],
  );

  const moveSection = useCallback(
    (sectionId: string, direction: "up" | "down") => {
      updateContent((c) => {
        const sections = [...c.pageLayout.sections].sort((a, b) => a.order - b.order);
        const idx = sections.findIndex((s) => s.id === sectionId);
        if (idx === -1) return c;
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= sections.length) return c;
        const temp = sections[idx].order;
        sections[idx] = { ...sections[idx], order: sections[swapIdx].order };
        sections[swapIdx] = { ...sections[swapIdx], order: temp };
        return { ...c, pageLayout: { sections } };
      });
    },
    [updateContent],
  );

  const toggleSectionVisibility = useCallback(
    (sectionId: string) => {
      updateContent((c) => ({
        ...c,
        pageLayout: {
          sections: c.pageLayout.sections.map((s) =>
            s.id === sectionId ? { ...s, visible: !s.visible } : s,
          ),
        },
      }));
    },
    [updateContent],
  );

  const deleteSection = useCallback(
    (sectionId: string) => {
      updateContent((c) => ({
        ...c,
        pageLayout: {
          sections: c.pageLayout.sections.filter((s) => s.id !== sectionId),
        },
      }));
    },
    [updateContent],
  );

  const undo = useCallback(() => {
    const { past } = historyRef.current;
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    historyRef.current = {
      past: past.slice(0, -1),
      future: [content, ...historyRef.current.future],
    };
    setContent(prev);
    setIsDirty(true);
  }, [content]);

  const redo = useCallback(() => {
    const { future } = historyRef.current;
    if (future.length === 0) return;
    const next = future[0];
    historyRef.current = {
      past: [...historyRef.current.past, content],
      future: future.slice(1),
    };
    setContent(next);
    setIsDirty(true);
  }, [content]);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      const fingerprint = await generateDeviceFingerprint();
      const res = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-fingerprint": fingerprint,
        },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        savedContentRef.current = content;
        setIsDirty(false);
        window.localStorage.removeItem(DRAFT_KEY);
        if (navigator.vibrate) {
          navigator.vibrate([30, 50, 30]);
        }
      }
    } finally {
      setIsSaving(false);
    }
  }, [content]);

  const discard = useCallback(() => {
    setContent(savedContentRef.current);
    setIsDirty(false);
    historyRef.current = { past: [], future: [] };
    window.localStorage.removeItem(DRAFT_KEY);
  }, []);

  const togglePreview = useCallback(() => {
    setIsPreview((p) => !p);
    setSelectedElement(null);
    setActiveMenu(null);
  }, []);

  const setFieldValue = useCallback(
    (path: string, value: unknown) => {
      updateContent((c) => {
        return setNestedValue(c as unknown as Record<string, unknown>, path, value) as unknown as StorefrontContent;
      });
    },
    [updateContent],
  );

  const canUndo = historyRef.current.past.length > 0;
  const canRedo = historyRef.current.future.length > 0;

  const value = useMemo(
    (): EditorContextValue => ({
      content,
      selectedElement,
      activeMenu,
      isDirty,
      isSaving,
      isPreview,
      select,
      deselect,
      openMenu,
      closeMenu,
      updateContent,
      updateHomepage,
      updateConfig,
      updateProduct,
      addProduct,
      deleteProduct,
      updateOffer,
      addOffer,
      deleteOffer,
      updateTestimonial,
      addTestimonial,
      deleteTestimonial,
      updateCategory,
      updatePageLayout,
      moveSection,
      toggleSectionVisibility,
      deleteSection,
      undo,
      redo,
      canUndo,
      canRedo,
      save,
      discard,
      togglePreview,
      setFieldValue,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [content, selectedElement, activeMenu, isDirty, isSaving, isPreview, canUndo, canRedo],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}
