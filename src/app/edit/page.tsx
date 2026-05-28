"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EditorProvider, useEditor } from "@/hooks/useEditor";
import { Toolbar } from "@/components/editor/Toolbar";
import { EditableTopBar } from "@/components/editor/sections/EditableTopBar";
import { EditableHeader } from "@/components/editor/sections/EditableHeader";
import { EditableHero } from "@/components/editor/sections/EditableHero";
import { EditableFulfillmentBar } from "@/components/editor/sections/EditableFulfillmentBar";
import { EditableFeaturedProducts } from "@/components/editor/sections/EditableFeaturedProducts";
import { EditableCategoryGrid } from "@/components/editor/sections/EditableCategoryGrid";
import { EditablePromoBanners } from "@/components/editor/sections/EditablePromoBanners";
import { EditableTestimonials } from "@/components/editor/sections/EditableTestimonials";
import { EditableFooter } from "@/components/editor/sections/EditableFooter";
import { generateDeviceFingerprint } from "@/lib/fingerprint";
import type { StorefrontContent } from "@/types";

// Auth state
const ADMIN_EMAIL = "admin@syracuseexoticz.com";
const ADMIN_PASSWORD = "admin420";
const AUTH_KEY = "syracuse-exoticz-admin-auth-v1";
const LEGACY_AUTH_KEY = "elevate-admin-auth-v1";

export default function EditPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [content, setContent] = useState<StorefrontContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const loadContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (!res.ok) {
        return false;
      }
      const data = await res.json();
      setContent(data as StorefrontContent);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Check auth and registered device on mount.
  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      const value = window.localStorage.getItem(AUTH_KEY);
      const legacyValue = window.localStorage.getItem(LEGACY_AUTH_KEY);
      if (!value && legacyValue === "true") {
        window.localStorage.setItem(AUTH_KEY, "true");
        window.localStorage.removeItem(LEGACY_AUTH_KEY);
      }

      const hasLocalAuth = value === "true" || legacyValue === "true";
      if (!hasLocalAuth) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      try {
        const fingerprint = await generateDeviceFingerprint();
        const verifyRes = await fetch("/api/devices/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fingerprint }),
        });
        const verifyData = await verifyRes.json();

        if (!cancelled && verifyData?.success && verifyData?.isRegistered) {
          const ok = await loadContent();
          if (ok) {
            setAuthenticated(true);
          }
          setLoading(false);
          return;
        }
      } catch {}

      window.localStorage.removeItem(AUTH_KEY);
      window.localStorage.removeItem(LEGACY_AUTH_KEY);
      if (!cancelled) {
        setAuthenticated(false);
        setLoading(false);
      }
    }

    initialize();
    return () => {
      cancelled = true;
    };
  }, [loadContent]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authEmail !== ADMIN_EMAIL || authPassword !== ADMIN_PASSWORD) {
      setAuthError("Invalid credentials");
      return;
    }

    setLoading(true);
    try {
      const fingerprint = await generateDeviceFingerprint();
      const response = await fetch("/api/devices/register-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fingerprint,
          email: authEmail,
        }),
      });

      const data = await response.json();
      if (data?.success) {
        const ok = await loadContent();
        if (ok) {
          window.localStorage.setItem(AUTH_KEY, "true");
          window.localStorage.removeItem(LEGACY_AUTH_KEY);
          setAuthenticated(true);
          setAuthError("");
          setAuthPassword("");
          return;
        }
        setAuthError("Failed to load storefront content.");
      } else {
        setAuthError("Failed to register device. Please try again.");
      }
    } catch {
      setAuthError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050708]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-lime-300/30 border-t-lime-300" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050708] p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-[#0a0e13] p-6">
          <h1 className="text-center text-lg font-black tracking-wider text-white">VISUAL EDITOR</h1>
          <p className="text-center text-xs text-slate-400">Sign in to edit the storefront</p>

          <input
            type="email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
          {authError && <p className="text-xs text-red-400">{authError}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-lime-400 py-3 text-sm font-black tracking-wider text-black hover:bg-lime-300 transition"
          >
            SIGN IN
          </button>
        </form>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050708]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-lime-300/30 border-t-lime-300" />
      </div>
    );
  }

  return (
    <EditorProvider initialContent={content}>
      <EditorLayout />
    </EditorProvider>
  );
}

function EditorLayout() {
  const { content, isPreview, deselect } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<string>("");

  const activeProducts = content.products.filter((p) => p.isActive);
  const availableCategories = useMemo(
    () => Array.from(new Set(activeProducts.map((p) => p.category))),
    [activeProducts],
  );

  useEffect(() => {
    if (selectedCategory && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory(null);
    }
  }, [availableCategories, selectedCategory]);

  useEffect(() => {
    const message = window.sessionStorage.getItem("editor-restore-success");
    if (!message) {
      return;
    }

    setRestoreMessage(message);
    window.sessionStorage.removeItem("editor-restore-success");
    const timer = window.setTimeout(() => setRestoreMessage(""), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  const sections = [...content.pageLayout.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-editor-element]") || target.closest("[data-editor-ui]")) {
        return;
      }
      deselect();
    },
    [deselect],
  );

  const renderSection = (sectionType: string) => {
    switch (sectionType) {
      case "hero":
        return <EditableHero key="hero" />;
      case "fulfillment":
        return <EditableFulfillmentBar key="fulfillment" />;
      case "products":
        return (
          <section key="products" className="mt-3 grid gap-3 xl:grid-cols-[1.68fr_0.98fr]">
            <EditableFeaturedProducts selectedCategory={selectedCategory} />
            <EditableCategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              availableCategories={availableCategories}
            />
          </section>
        );
      case "promos":
        return <EditablePromoBanners key="promos" />;
      case "testimonials":
        return <EditableTestimonials key="testimonials" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050708] text-white" onClick={handleBackgroundClick}>
      {/* Editor banner */}
      {!isPreview && (
        <>
          <div className="bg-blue-600/90 py-1 text-center text-[11px] font-semibold tracking-wider text-white">
            VISUAL EDITOR MODE — Long-press or tap elements to edit
          </div>
          {restoreMessage ? (
            <div className="bg-lime-500/90 py-1 text-center text-[11px] font-semibold tracking-wider text-black">
              {restoreMessage}
            </div>
          ) : null}
        </>
      )}

      <div className="mx-2 my-2 min-h-[calc(100vh-1rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#05080b] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_90px_rgba(0,0,0,0.45)]">
        <EditableTopBar />
        <EditableHeader />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1540px] px-4 py-3 md:px-8 md:py-3 pb-24">
            {sections.map((section) => renderSection(section.type))}
          </div>
        </main>
        <EditableFooter />
      </div>

      {/* Toolbar */}
      {!isPreview && <Toolbar />}
      {isPreview && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[150]">
          <ExitPreviewButton />
        </div>
      )}
    </div>
  );
}

function ExitPreviewButton() {
  const { togglePreview } = useEditor();
  return (
    <button
      onClick={togglePreview}
      className="rounded-full bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-xl hover:bg-blue-500 transition"
    >
      Exit Preview
    </button>
  );
}
