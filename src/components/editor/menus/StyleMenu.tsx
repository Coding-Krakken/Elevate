"use client";

import { useEditor } from "@/hooks/useEditor";

const BG_COLORS = [
  "transparent", "#000000", "#0a0e13", "#0d1117", "#111827",
  "#1e293b", "#1a1a2e", "#16213e", "#0f3460", "#1b4332",
  "#14532d", "#3f0f40", "#4a1942", "#2d1b69",
];

const PADDING_OPTIONS = ["0px", "4px", "8px", "12px", "16px", "20px", "24px", "32px"];
const BORDER_OPTIONS = ["none", "1px solid rgba(255,255,255,0.1)", "1px solid rgba(255,255,255,0.2)", "2px solid rgba(132,204,22,0.4)"];
const RADIUS_OPTIONS = ["0px", "4px", "8px", "12px", "16px", "24px", "9999px"];
const OPACITY_OPTIONS = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];

export function StyleMenu() {
  const { selectedElement, content, setFieldValue } = useEditor();

  if (!selectedElement) return null;

  const style = content.styleOverrides?.[selectedElement.id] ?? {};
  const setStyle = (key: string, value: string | number) => {
    setFieldValue(`styleOverrides.${selectedElement.id}.${key}`, value);
  };

  return (
    <div className="space-y-4">
      {/* Background Color */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Background Color</label>
        <div className="grid grid-cols-7 gap-1.5">
          {BG_COLORS.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-lg border hover:scale-110 transition min-w-[36px] min-h-[36px] ${
                (style.backgroundColor ?? "transparent") === color ? "border-blue-400" : "border-white/20"
              }`}
              style={{ backgroundColor: color === "transparent" ? undefined : color }}
              title={color}
              onClick={() => setStyle("backgroundColor", color)}
            >
              {color === "transparent" && (
                <span className="text-[8px] text-slate-500">None</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Padding */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Padding</label>
        <div className="flex flex-wrap gap-1">
          {PADDING_OPTIONS.map((padding) => (
            <button
              key={padding}
              className={`px-3 py-2 rounded-lg text-[10px] border transition min-h-[40px] ${
                style.padding === padding
                  ? "text-white border-blue-400 bg-blue-400/10"
                  : "text-slate-400 border-white/10 hover:border-blue-400 hover:text-white"
              }`}
              onClick={() => setStyle("padding", padding)}
            >
              {padding}
            </button>
          ))}
        </div>
      </div>

      {/* Border */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Border</label>
        <div className="space-y-1">
          {BORDER_OPTIONS.map((border) => (
            <button
              key={border}
              className={`w-full px-3 py-2 rounded-lg text-[10px] border transition text-left min-h-[40px] ${
                (style.border ?? "none") === border
                  ? "text-white border-blue-400 bg-blue-400/10"
                  : "text-slate-400 border-white/10 hover:border-blue-400 hover:text-white"
              }`}
              onClick={() => setStyle("border", border)}
            >
              {border === "none" ? "None" : border}
            </button>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Border Radius</label>
        <div className="flex flex-wrap gap-1">
          {RADIUS_OPTIONS.map((radius) => (
            <button
              key={radius}
              className={`px-3 py-2 rounded-lg text-[10px] border transition min-h-[40px] ${
                style.borderRadius === radius
                  ? "text-white border-blue-400 bg-blue-400/10"
                  : "text-slate-400 border-white/10 hover:border-blue-400 hover:text-white"
              }`}
              onClick={() => setStyle("borderRadius", radius)}
            >
              {radius}
            </button>
          ))}
        </div>
      </div>

      {/* Opacity */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Opacity</label>
        <div className="flex flex-wrap gap-1">
          {OPACITY_OPTIONS.map((opacity) => (
            <button
              key={opacity}
              className={`px-3 py-2 rounded-lg text-[10px] border transition min-h-[40px] ${
                Math.round((style.opacity ?? 1) * 100) === opacity
                  ? "text-white border-blue-400 bg-blue-400/10"
                  : "text-slate-400 border-white/10 hover:border-blue-400 hover:text-white"
              }`}
              onClick={() => setStyle("opacity", opacity / 100)}
            >
              {opacity}%
            </button>
          ))}
        </div>
      </div>

      {/* Shadow */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Shadow</label>
        <div className="space-y-1">
          {[
            { label: "none", value: "none" },
            { label: "sm", value: "0 1px 2px rgba(0,0,0,0.25)" },
            { label: "md", value: "0 6px 12px rgba(0,0,0,0.3)" },
            { label: "lg", value: "0 12px 28px rgba(0,0,0,0.35)" },
            { label: "xl", value: "0 20px 40px rgba(0,0,0,0.4)" },
            { label: "glow", value: "0 0 24px rgba(132,204,22,0.45)" },
          ].map((shadow) => (
            <button
              key={shadow.label}
              className={`w-full px-3 py-2 rounded-lg text-[10px] border transition text-left capitalize min-h-[40px] ${
                (style.boxShadow ?? "none") === shadow.value
                  ? "text-white border-blue-400 bg-blue-400/10"
                  : "text-slate-400 border-white/10 hover:border-blue-400 hover:text-white"
              }`}
              onClick={() => setStyle("boxShadow", shadow.value)}
            >
              {shadow.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
