"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";
import type { ManagedOffer, ManagedProduct, ProductQuantityOption } from "@/types";
import ShareButton from "@/components/admin/ShareButton";
import { ProductCard } from "@/components/products/ProductCard";
import { PromoBannerCard } from "@/components/sections/PromoBanners";
import { categories } from "@/data/categories";
import { generateDeviceFingerprint } from "@/lib/fingerprint";

const inputClass = "w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-white";
const ADMIN_USERNAME = "admin@syracuseexoticz.com";
const ADMIN_PASSWORD = "admin420";
const AUTH_KEY = "syracuse-exoticz-admin-auth-v1";
const LEGACY_AUTH_KEY = "elevate-admin-auth-v1";

const productAccentThemes = [
  {
    card: "border-l-4 border-l-lime-300/70 bg-gradient-to-r from-lime-300/[0.06] via-[#091017] to-[#091017]",
    badge: "border-lime-300/45 bg-lime-300/20 text-lime-200",
  },
  {
    card: "border-l-4 border-l-cyan-300/70 bg-gradient-to-r from-cyan-300/[0.06] via-[#091017] to-[#091017]",
    badge: "border-cyan-300/45 bg-cyan-300/20 text-cyan-100",
  },
  {
    card: "border-l-4 border-l-amber-300/70 bg-gradient-to-r from-amber-300/[0.06] via-[#091017] to-[#091017]",
    badge: "border-amber-300/45 bg-amber-300/20 text-amber-100",
  },
  {
    card: "border-l-4 border-l-fuchsia-300/70 bg-gradient-to-r from-fuchsia-300/[0.06] via-[#091017] to-[#091017]",
    badge: "border-fuchsia-300/45 bg-fuchsia-300/20 text-fuchsia-100",
  },
];

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const {
    products,
    offers,
    config,
    addProduct,
    updateProduct,
    deleteProduct,
    addOffer,
    updateOffer,
    deleteOffer,
    updateConfig,
    resetDefaults,
  } = useStorefrontContent();

  useEffect(() => {
    const value = window.localStorage.getItem(AUTH_KEY);
    const legacyValue = window.localStorage.getItem(LEGACY_AUTH_KEY);
    if (!value && legacyValue === "true") {
      window.localStorage.setItem(AUTH_KEY, "true");
      window.localStorage.removeItem(LEGACY_AUTH_KEY);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthed(value === "true" || legacyValue === "true");
    setIsReady(true);
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      try {
        // Generate device fingerprint
        const fingerprint = await generateDeviceFingerprint();

        // Register admin device
        const response = await fetch('/api/devices/register-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fingerprint,
            email: username,
          }),
        });

        const data = await response.json();

        if (data.success) {
          window.localStorage.setItem(AUTH_KEY, "true");
          setIsAuthed(true);
          setAuthError(null);
          setPassword("");
        } else {
          setAuthError("Failed to register device. Please try again.");
        }
      } catch (error) {
        console.error('Error during admin login:', error);
        setAuthError("An error occurred during login. Please try again.");
      }
      return;
    }

    setAuthError("Invalid username or password.");
  };

  const handleLogout = () => {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(LEGACY_AUTH_KEY);
    setIsAuthed(false);
    setUsername("");
    setPassword("");
  };

  if (!isReady) {
    return null;
  }

  if (!isAuthed) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-11rem)] w-full max-w-[1540px] items-center px-4 py-6 md:px-8">
        <section className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1318] p-6">
          <h1 className="text-2xl font-black tracking-[0.1em] text-white">ADMIN LOGIN</h1>
          <p className="mt-2 text-sm text-slate-300">Sign in to manage products and offers.</p>

          <form className="mt-5 space-y-3" onSubmit={handleLogin}>
            <Field label="Username">
              <input
                className={inputClass}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </Field>
            <Field label="Password">
              <input
                className={inputClass}
                value={password}
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </Field>

            {authError ? <p className="text-sm text-red-300">{authError}</p> : null}

            <button
              type="submit"
              className="w-full rounded-md bg-lime-300 px-3 py-2 text-sm font-black tracking-[0.1em] text-black"
            >
              SIGN IN
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1540px] px-4 py-4 md:px-8 md:py-6">
      <section className="rounded-2xl border border-white/10 bg-[#0d1318] p-5 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-[0.1em] text-white md:text-3xl">ADMIN DASHBOARD</h1>
            <p className="mt-2 text-sm text-slate-300">
              Manage all content shown on the main page: products, offers, and page-level settings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShareButton />
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-semibold tracking-[0.1em] text-slate-200"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-white/10 bg-[#0d1318] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black tracking-[0.14em] text-white">PAGE SETTINGS</h2>
          <button
            type="button"
            onClick={resetDefaults}
            className="rounded-md border border-red-300/50 px-3 py-1.5 text-xs font-bold tracking-[0.1em] text-red-300"
          >
            RESET DEFAULTS
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Main title">
            <input
              className={inputClass}
              value={config.pageTitle}
              onChange={(event) => updateConfig({ pageTitle: event.target.value })}
            />
          </Field>
          <Field label="Subtitle">
            <input
              className={inputClass}
              value={config.pageSubtitle}
              onChange={(event) => updateConfig({ pageSubtitle: event.target.value })}
            />
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={config.showProducts}
              onChange={(event) => updateConfig({ showProducts: event.target.checked })}
            />
            Show products section
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={config.showOffers}
              onChange={(event) => updateConfig({ showOffers: event.target.checked })}
            />
            Show offers section
          </label>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-white/10 bg-[#0d1318] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black tracking-[0.14em] text-white">PRODUCTS</h2>
          <button
            type="button"
            onClick={addProduct}
            className="rounded-md bg-lime-300 px-3 py-1.5 text-xs font-black tracking-[0.1em] text-black"
          >
            ADD PRODUCT
          </button>
        </div>

        <div className="space-y-6">
          {products.map((product, index) => (
            <ProductEditor
              key={product.id}
              product={product}
              onUpdate={updateProduct}
              onDelete={deleteProduct}
              index={index}
              total={products.length}
            />
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-white/10 bg-[#0d1318] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black tracking-[0.14em] text-white">SPECIAL OFFERS</h2>
          <button
            type="button"
            onClick={addOffer}
            className="rounded-md bg-lime-300 px-3 py-1.5 text-xs font-black tracking-[0.1em] text-black"
          >
            ADD OFFER
          </button>
        </div>

        {(() => {
          const activeOfferIds = offers.filter((offer) => offer.isActive).map((offer) => offer.id);

          return (
            <div className="space-y-3">
              {offers.map((offer, index) => (
                <OfferEditor
                  key={offer.id}
                  offer={offer}
                  onUpdate={updateOffer}
                  onDelete={deleteOffer}
                  previewIndex={Math.max(0, activeOfferIds.indexOf(offer.id))}
                  fallbackIndex={index}
                />
              ))}
            </div>
          );
        })()}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-semibold tracking-[0.08em] text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function ProductEditor({
  product,
  onUpdate,
  onDelete,
  index,
  total,
}: {
  product: ManagedProduct;
  onUpdate: (id: string, updates: Partial<ManagedProduct>) => void;
  onDelete: (id: string) => void;
  index: number;
  total: number;
}) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);

  useEffect(() => {
    setPreviewFailed(false);
  }, [product.image]);

  const applyImage = (image: string) => {
    onUpdate(product.id, { image: image.trim() });
    setUploadError(null);
  };

  const readAndApplyFile = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === "string" ? reader.result : "";
      if (!value) {
        setUploadError("Unable to read this image. Try another file.");
        return;
      }
      applyImage(value);
    };
    reader.onerror = () => {
      setUploadError("Unable to read this image. Try another file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    readAndApplyFile(event.target.files?.[0] ?? null);
    event.target.value = "";
  };

  const handleImagePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const imageItem = Array.from(event.clipboardData.items).find((item) => item.type.startsWith("image/"));
    if (imageItem) {
      event.preventDefault();
      readAndApplyFile(imageItem.getAsFile());
      return;
    }

    const pastedText = event.clipboardData.getData("text").trim();
    if (pastedText) {
      event.preventDefault();
      applyImage(pastedText);
    }
  };

  const updateQuantities = (quantities: ProductQuantityOption[]) => {
    onUpdate(product.id, { quantities });
  };

  const quantityQuickFillOptions = [
    "1 oz",
    "2 oz",
    "1/4 lb",
    "1g",
    "1/8 oz",
    "1/4 oz",
    "1/2 oz",
    "0.5g",
    "2g",
    "3.5g",
    "7g",
    "14g",
    "28g",
  ];

  const addQuantityOption = () => {
    updateQuantities([
      ...product.quantities,
      {
        id: `qty-${Math.random().toString(36).slice(2, 9)}`,
        label: "New size",
        price: 0,
        isActive: true,
      },
    ]);
  };

  const setQuantityValue = (
    quantityId: string,
    key: "label" | "price" | "isActive",
    value: string | number | boolean,
  ) => {
    updateQuantities(
      product.quantities.map((quantity) =>
        quantity.id === quantityId ? { ...quantity, [key]: value } : quantity,
      ),
    );
  };

  const removeQuantity = (quantityId: string) => {
    updateQuantities(product.quantities.filter((quantity) => quantity.id !== quantityId));
  };

  const insertFractionLabel = (quantityId: string, fraction: string) => {
    setQuantityValue(quantityId, "label", fraction);
  };

  const parseImagePosition = (position?: string): { horizontal: string; vertical: string } => {
    if (!position || position === "center") {
      return { horizontal: "center", vertical: "center" };
    }
    const parts = position.split(" ");
    return {
      horizontal: parts[0] || "center",
      vertical: parts[1] || "center",
    };
  };

  const imagePos = parseImagePosition(product.imagePosition);

  const updateImagePosition = (horizontal: string, vertical: string) => {
    onUpdate(product.id, { imagePosition: `${horizontal} ${vertical}` });
  };

  const accent = productAccentThemes[index % productAccentThemes.length];
  const hasKnownCategory = categories.some((category) => category.slug === product.category);

  return (
    <article className={`rounded-xl border border-white/25 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_42px_rgba(0,0,0,0.35)] ${accent.card}`}>
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black tracking-[0.12em] ${accent.badge}`}>
            Product {index + 1} of {total}
          </span>
          <p className="text-xs font-semibold tracking-[0.08em] text-slate-300">{product.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={product.isActive}
              onChange={(event) => onUpdate(product.id, { isActive: event.target.checked })}
            />
            Active
          </label>
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="rounded-md border border-red-300/50 px-2 py-1 text-xs font-semibold text-red-300"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Name">
          <input
            className={inputClass}
            value={product.name}
            onChange={(event) => onUpdate(product.id, { name: event.target.value })}
          />
        </Field>
        <Field label="Brand">
          <input
            className={inputClass}
            value={product.brand}
            onChange={(event) => onUpdate(product.id, { brand: event.target.value })}
          />
        </Field>
        <Field label="Category">
          <select
            className={inputClass}
            value={hasKnownCategory ? product.category : ""}
            onChange={(event) => onUpdate(product.id, { category: event.target.value })}
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Strain (HYBRID/SATIVA/INDICA)">
          <input
            className={inputClass}
            value={product.strain}
            onChange={(event) =>
              onUpdate(product.id, {
                strain: (event.target.value.toUpperCase() || "HYBRID") as ManagedProduct["strain"],
              })
            }
          />
        </Field>
        <Field label="THC label">
          <input
            className={inputClass}
            value={product.thc}
            onChange={(event) => onUpdate(product.id, { thc: event.target.value })}
          />
        </Field>
      </div>

      <div className="mt-3 rounded-md border border-white/10 bg-black/25 p-3">
        <p className="text-xs font-semibold tracking-[0.08em] text-slate-300">Image configuration</p>

        <div className="mt-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Image URL or path">
            <input
              className={inputClass}
              value={product.image}
              placeholder="https://... or /images/..."
              onChange={(event) => applyImage(event.target.value)}
            />
          </Field>
          <Field label="Upload image from device">
            <input
              type="file"
              accept="image/*"
              className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-lime-300 file:px-2 file:py-1 file:text-xs file:font-black file:text-black`}
              onChange={handleFileUpload}
            />
          </Field>
          <Field label="Paste image or image URL">
            <textarea
              className={`${inputClass} min-h-[84px] resize-y`}
              placeholder="Paste an image (Ctrl/Cmd+V) or paste an image URL here"
              onPaste={handleImagePaste}
            />
          </Field>
          <Field label="Image horizontal position">
            <select
              className={inputClass}
              value={imagePos.horizontal}
              onChange={(event) => updateImagePosition(event.target.value, imagePos.vertical)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </Field>
          <Field label="Image vertical position">
            <select
              className={inputClass}
              value={imagePos.vertical}
              onChange={(event) => updateImagePosition(imagePos.horizontal, event.target.value)}
            >
              <option value="top">Top</option>
              <option value="center">Center</option>
              <option value="bottom">Bottom</option>
            </select>
          </Field>
        </div>

        <div className="mt-2">
          <p className="mb-1 text-xs font-semibold tracking-[0.08em] text-slate-300">Image preview</p>
          <div className="flex h-[150px] items-center justify-center overflow-hidden rounded-md border border-white/15 bg-black/35">
            {product.image && !previewFailed ? (
              <img
                src={product.image}
                alt={`${product.name} preview`}
                className="h-full w-full object-cover"
                onError={() => setPreviewFailed(true)}
              />
            ) : (
              <p className="px-3 text-center text-xs text-slate-400">
                {product.image ? "Preview unavailable for this image source." : "No image selected."}
              </p>
            )}
          </div>
        </div>

        {uploadError ? <p className="mt-2 text-xs text-red-300">{uploadError}</p> : null}
      </div>

      <div className="mt-3 rounded-md border border-white/10 bg-black/25 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-[0.08em] text-slate-300">Quantity options and pricing</p>
          <button
            type="button"
            onClick={addQuantityOption}
            className="rounded-md border border-lime-300/40 px-2 py-1 text-xs font-semibold text-lime-300"
          >
            Add quantity
          </button>
        </div>

        <div className="space-y-2">
          {product.quantities.map((quantity) => (
            <div
              key={quantity.id}
              className="space-y-2 rounded-md border border-white/10 bg-black/20 p-2"
            >
              <div className="grid gap-2 md:grid-cols-[1fr_130px_auto_auto]">
                <input
                  className={inputClass}
                  value={quantity.label}
                  placeholder="Quantity label (e.g. 1/8 oz)"
                  onChange={(event) => setQuantityValue(quantity.id, "label", event.target.value)}
                />
                <input
                  className={inputClass}
                  value={quantity.price}
                  type="number"
                  min={0}
                  step="0.01"
                  onChange={(event) =>
                    setQuantityValue(quantity.id, "price", Number(event.target.value) || 0)
                  }
                />
                <label className="inline-flex items-center gap-2 text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={quantity.isActive}
                    onChange={(event) => setQuantityValue(quantity.id, "isActive", event.target.checked)}
                  />
                  Enabled
                </label>
                <button
                  type="button"
                  onClick={() => removeQuantity(quantity.id)}
                  className="rounded-md border border-red-300/40 px-2 py-1 text-xs font-semibold text-red-300"
                >
                  Remove
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-400">Quick fill:</span>
                {quantityQuickFillOptions.map((fraction) => (
                  <button
                    key={fraction}
                    type="button"
                    onClick={() => insertFractionLabel(quantity.id, fraction)}
                    className="rounded border border-white/20 bg-black/30 px-2 py-0.5 text-[10px] text-slate-300 hover:border-lime-300/50 hover:text-lime-300"
                  >
                    {fraction}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {product.quantities.length === 0 ? (
            <p className="text-xs text-amber-200">
              This product has no quantities. Add one so shoppers can buy it.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 rounded-md border border-white/10 bg-black/25 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-[0.08em] text-slate-300">Main page preview</p>
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Featured products card</p>
        </div>

        <div className="pointer-events-none max-w-[255px]">
          <ProductCard product={product} />
        </div>
      </div>

      <div className="mt-2">
        <Field label="Description">
          <input
            className={inputClass}
            value={product.description}
            onChange={(event) => onUpdate(product.id, { description: event.target.value })}
          />
        </Field>
      </div>
    </article>
  );
}

function OfferEditor({
  offer,
  onUpdate,
  onDelete,
  previewIndex,
  fallbackIndex,
}: {
  offer: ManagedOffer;
  onUpdate: (id: string, updates: Partial<ManagedOffer>) => void;
  onDelete: (id: string) => void;
  previewIndex: number;
  fallbackIndex: number;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold tracking-[0.08em] text-slate-300">{offer.id}</p>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={offer.isActive}
              onChange={(event) => onUpdate(offer.id, { isActive: event.target.checked })}
            />
            Active
          </label>
          <button
            type="button"
            onClick={() => onDelete(offer.id)}
            className="rounded-md border border-red-300/50 px-2 py-1 text-xs font-semibold text-red-300"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Eyebrow">
          <input
            className={inputClass}
            value={offer.eyebrow}
            onChange={(event) => onUpdate(offer.id, { eyebrow: event.target.value })}
          />
        </Field>
        <Field label="Title">
          <input
            className={inputClass}
            value={offer.title}
            onChange={(event) => onUpdate(offer.id, { title: event.target.value })}
          />
        </Field>
        <Field label="Subtitle">
          <input
            className={inputClass}
            value={offer.subtitle}
            onChange={(event) => onUpdate(offer.id, { subtitle: event.target.value })}
          />
        </Field>
        <Field label="CTA text">
          <input
            className={inputClass}
            value={offer.cta}
            onChange={(event) => onUpdate(offer.id, { cta: event.target.value })}
          />
        </Field>
        <Field label="Code">
          <input
            className={inputClass}
            value={offer.code ?? ""}
            onChange={(event) => onUpdate(offer.id, { code: event.target.value })}
          />
        </Field>
        <Field label="Image path">
          <input
            className={inputClass}
            value={offer.image}
            onChange={(event) => onUpdate(offer.id, { image: event.target.value })}
          />
        </Field>
      </div>

      <div className="mt-3 rounded-md border border-white/10 bg-black/25 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-[0.08em] text-slate-300">Main page preview</p>
          {offer.isActive ? (
            <p className="text-[10px] uppercase tracking-[0.12em] text-lime-300">
              Uses active offer position {previewIndex + 1}
            </p>
          ) : (
            <p className="text-[10px] uppercase tracking-[0.12em] text-amber-300">
              Inactive on main page
            </p>
          )}
        </div>

        <div className="pointer-events-none max-w-[680px]">
          <PromoBannerCard
            promo={offer}
            index={offer.isActive ? previewIndex : fallbackIndex}
          />
        </div>
      </div>
    </article>
  );
}
