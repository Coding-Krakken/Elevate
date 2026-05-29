"use client";

import { useState } from "react";
import { useEditor } from "@/hooks/useEditor";
import { useImagePaste } from "@/hooks/useImagePaste";
import { Upload } from "lucide-react";
import { generateDeviceFingerprint } from "@/lib/fingerprint";

const POSITION_GRID = [
  ["top left", "top center", "top right"],
  ["center left", "center", "center right"],
  ["bottom left", "bottom center", "bottom right"],
];

const BACKDROP_LIBRARY = [
  "/images/backdrop-bluesmoke.png",
  "/images/backdrop-botanical.jpg",
  "/images/backdrop-fire.jpg",
  "/images/backdrop-flower.jpg",
  "/images/backdrop-golden.jpg",
  "/images/backdrop-greenflower.png",
  "/images/backdrop-greenlivingroom.png",
  "/images/backdrop-ice.jpg",
  "/images/backdrop-neon.jpg",
  "/images/backdrop-party.jpg",
  "/images/backdrop-purple.jpg",
  "/images/backdrop-purplesky.png",
  "/images/backdrop-smoke.jpg",
  "/images/backdrop-sweets.jpg",
  "/images/backdrop-trippyclock.png",
];

export function ImageMenu() {
  const { selectedElement, setFieldValue, content } = useEditor();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const productIndex = selectedElement ? content.products.findIndex((p) => p.id === selectedElement.id) : -1;
  const offerIndex = selectedElement ? content.offers.findIndex((o) => o.id === selectedElement.id) : -1;

  const imagePath = !selectedElement
    ? ""
    : selectedElement.type === "product" && productIndex >= 0
      ? `products.${productIndex}.image`
      : selectedElement.type === "offer" && offerIndex >= 0
        ? `offers.${offerIndex}.image`
        : selectedElement.path;

  const { handlePaste, pasting } = useImagePaste((url) => {
    setFieldValue(imagePath, url);
    setImageUrl(url);
  });

  if (!selectedElement) return null;

  const isOfferImage = selectedElement.type === "offer" && offerIndex >= 0;

  const positionPath =
    selectedElement.type === "product" && productIndex >= 0
      ? `products.${productIndex}.imagePosition`
      : `styleOverrides.${selectedElement.id}.objectPosition`;

  const fitPath = `styleOverrides.${selectedElement.id}.objectFit`;
  const radiusPath = `styleOverrides.${selectedElement.id}.borderRadius`;
  const altPath = `styleOverrides.${selectedElement.id}.imageAlt`;
  const style = content.styleOverrides?.[selectedElement.id] ?? {};
  const currentPosition = getValueAtPath(content, positionPath);
  const positionValue = typeof currentPosition === "string" ? currentPosition : "center";

  const currentImage = getValueAtPath(content, imagePath);
  const imgValue = typeof currentImage === "string" ? currentImage : "";

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    if (url.startsWith("http") || url.startsWith("/")) {
      setFieldValue(imagePath, url);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fingerprint = await generateDeviceFingerprint();
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: {
          "x-device-fingerprint": fingerprint,
        },
        body: formData,
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      if (typeof data?.url === "string") {
        setFieldValue(imagePath, data.url);
        setImageUrl(data.url);
      }
    } catch {
      // Keep UX silent for now; menu still allows manual URL entry.
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current image preview */}
      {imgValue && (
        <div className="relative h-32 rounded-lg overflow-hidden border border-white/10 bg-black/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgValue}
            alt="Current"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Upload */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Upload Image</label>
        <label className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-white/20 hover:border-blue-400 cursor-pointer transition min-h-[50px]">
          <Upload className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">
            {uploading ? "Uploading..." : "Choose file or drop here"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Image URL</label>
        <input
          type="text"
          value={imageUrl || imgValue}
          onChange={(e) => handleUrlChange(e.target.value)}
          onPaste={handlePaste}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none min-h-[44px]"
          placeholder={pasting ? "Uploading pasted image..." : "https://... or /images/... (paste image)"}
        />
      </div>

      {/* Backdrop image library for specials/deals */}
      {isOfferImage && (
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Backdrop Image Library</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BACKDROP_LIBRARY.map((src) => {
              const active = imgValue === src;
              return (
                <button
                  key={src}
                  onClick={() => {
                    setFieldValue(imagePath, src);
                    setImageUrl(src);
                  }}
                  className={`overflow-hidden rounded-lg border transition ${
                    active
                      ? "border-lime-300/70 ring-1 ring-lime-300/60"
                      : "border-white/15 hover:border-blue-400/70"
                  }`}
                  title={src}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Backdrop option" className="h-16 w-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Position Grid */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Image Position</label>
        <div className="grid grid-cols-3 gap-1 max-w-[180px]">
          {POSITION_GRID.flat().map((pos) => (
            <button
              key={pos}
              onClick={() => setFieldValue(positionPath, pos)}
              className={`aspect-square rounded border transition flex items-center justify-center min-w-[44px] min-h-[44px] ${
                positionValue === pos ? "border-blue-400 bg-blue-500/15" : "border-white/10 hover:border-blue-400"
              }`}
              title={pos}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
            </button>
          ))}
        </div>
      </div>

      {/* Fit Mode */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Fit Mode</label>
        <div className="flex gap-1">
          {["cover", "contain", "fill"].map((mode) => (
            <button
              key={mode}
              className={`flex-1 px-3 py-2 rounded-lg text-xs border transition capitalize min-h-[44px] ${
                (style.objectFit ?? "cover") === mode
                  ? "text-white border-blue-400 bg-blue-500/15"
                  : "text-slate-300 border-white/10 hover:border-blue-400 hover:text-white"
              }`}
              onClick={() => setFieldValue(fitPath, mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Border Radius</label>
        <input
          type="range"
          min="0"
          max="32"
          step="1"
          value={Number.parseInt((style.borderRadius ?? "8px").replace("px", ""), 10) || 8}
          onChange={(e) => setFieldValue(radiusPath, `${e.target.value}px`)}
          className="w-full accent-blue-400"
        />
      </div>

      {/* Alt Text */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Alt Text</label>
        <input
          type="text"
          value={style.imageAlt ?? ""}
          onChange={(e) => setFieldValue(altPath, e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none min-h-[44px]"
          placeholder="Describe the image..."
        />
      </div>
    </div>
  );
}

function getValueAtPath(obj: unknown, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}
