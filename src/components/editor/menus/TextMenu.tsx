"use client";

import { useState } from "react";
import { useEditor } from "@/hooks/useEditor";

const FONT_FAMILIES = [
  { label: "Inter", value: "var(--font-inter)" },
  { label: "Space Grotesk", value: "var(--font-space-grotesk)" },
  { label: "Satisfy", value: "var(--font-satisfy)" },
  { label: "Orbitron", value: "var(--font-orbitron)" },
  { label: "System", value: "system-ui" },
];

const COLOR_SWATCHES = [
  "#ffffff", "#e2e8f0", "#94a3b8", "#64748b",
  "#84cc16", "#22c55e", "#06b6d4", "#3b82f6",
  "#8b5cf6", "#ec4899", "#f43f5e", "#ef4444",
  "#f97316", "#eab308", "#000000", "#1e293b",
];

const FONT_SIZES = [
  "10px", "11px", "12px", "14px", "16px", "18px", "20px", "24px",
  "28px", "32px", "36px", "40px", "48px", "56px", "64px", "72px",
];

const POPULAR_EMOJIS = [
  "🔥", "⚡", "💎", "🌿", "✨", "🎉", "💯", "🚀",
  "💨", "🍃", "🌟", "👑", "💪", "🎯", "❤️", "⭐",
  "🏆", "💰", "🎁", "🌈", "🍀", "💫", "🔮", "🎊",
];

export function TextMenu() {
  const { selectedElement, setFieldValue, content } = useEditor();
  const [showEmojis, setShowEmojis] = useState(false);
  const [customColor, setCustomColor] = useState("#ffffff");

  if (!selectedElement) return null;

  const currentValue = getValueAtPath(content, selectedElement.path);
  const textValue = typeof currentValue === "string" ? currentValue : "";
  const style = content.styleOverrides?.[selectedElement.id] ?? {};

  const setStyle = (key: string, value: string | number) => {
    setFieldValue(`styleOverrides.${selectedElement.id}.${key}`, value);
  };

  const handleTextChange = (value: string) => {
    setFieldValue(selectedElement.path, value);
  };

  const insertEmoji = (emoji: string) => {
    handleTextChange(textValue + emoji);
  };

  return (
    <div className="space-y-4">
      {/* Text content */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Content</label>
        <textarea
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none resize-none min-h-[60px]"
          rows={2}
        />
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Font Family</label>
        <div className="grid grid-cols-2 gap-1.5">
          {FONT_FAMILIES.map((font) => (
            <button
              key={font.value}
              className={`px-3 py-2 rounded-lg text-xs border transition min-h-[44px] ${
                style.fontFamily === font.value
                  ? "border-blue-400 text-white bg-blue-400/10"
                  : "text-slate-300 border-white/10 hover:border-blue-400 hover:text-white"
              }`}
              style={{ fontFamily: font.value }}
              onClick={() => setStyle("fontFamily", font.value)}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Font Size</label>
        <div className="flex flex-wrap gap-1">
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              className={`px-2 py-1.5 rounded text-[10px] border transition min-w-[40px] min-h-[36px] ${
                style.fontSize === size
                  ? "text-white border-blue-400 bg-blue-400/10"
                  : "text-slate-400 border-white/10 hover:border-blue-400 hover:text-white"
              }`}
              onClick={() => setStyle("fontSize", size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Color</label>
        <div className="grid grid-cols-8 gap-1.5">
          {COLOR_SWATCHES.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-lg border hover:scale-110 transition min-w-[36px] min-h-[36px] ${
                style.color === color ? "border-blue-400" : "border-white/20"
              }`}
              style={{ backgroundColor: color }}
              title={color}
              onClick={() => setStyle("color", color)}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
            placeholder="#ffffff"
          />
          <button
            className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-300 hover:border-blue-400 hover:text-white"
            onClick={() => setStyle("color", customColor)}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Font Weight</label>
        <div className="flex flex-wrap gap-1">
          {["300", "400", "500", "600", "700", "800", "900"].map((weight) => (
            <button
              key={weight}
              className={`px-3 py-2 rounded-lg text-xs border transition min-h-[44px] ${
                style.fontWeight === weight
                  ? "border-blue-400 text-white bg-blue-400/10"
                  : "border-white/10 text-slate-300 hover:border-blue-400"
              }`}
              style={{ fontWeight: weight }}
              onClick={() => setStyle("fontWeight", weight)}
            >
              {weight}
            </button>
          ))}
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Alignment</label>
        <div className="flex gap-1">
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              className={`flex-1 px-3 py-2 rounded-lg text-xs border transition capitalize min-h-[44px] ${
                style.textAlign === align
                  ? "border-blue-400 text-white bg-blue-400/10"
                  : "text-slate-300 border-white/10 hover:border-blue-400 hover:text-white"
              }`}
              onClick={() => setStyle("textAlign", align)}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      {/* Emojis */}
      <div>
        <button
          onClick={() => setShowEmojis(!showEmojis)}
          className="text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          {showEmojis ? "Hide" : "Show"} Emojis
        </button>
        {showEmojis && (
          <div className="mt-2 grid grid-cols-8 gap-1">
            {POPULAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="text-lg p-1.5 rounded hover:bg-white/10 transition min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Letter Spacing */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Letter Spacing</label>
        <input
          type="range"
          min="-2"
          max="20"
          step="0.5"
          value={Number.parseFloat(style.letterSpacing ?? "0")}
          onChange={(e) => setStyle("letterSpacing", `${e.target.value}px`)}
          className="w-full accent-blue-400"
        />
      </div>

      {/* Line Height */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Line Height</label>
        <input
          type="range"
          min="0.8"
          max="3"
          step="0.1"
          value={Number.parseFloat(style.lineHeight ?? "1.5")}
          onChange={(e) => setStyle("lineHeight", e.target.value)}
          className="w-full accent-blue-400"
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
