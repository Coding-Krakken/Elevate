"use client";

import {
  Check,
  Eye,
  EyeOff,
  ImageIcon,
  Palette,
  Link2,
  Redo2,
  Save,
  Trash2,
  Type,
  Undo2,
  LayoutGrid,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { useEditor } from "@/hooks/useEditor";
import { TextMenu } from "./menus/TextMenu";
import { ImageMenu } from "./menus/ImageMenu";
import { SectionMenu } from "./menus/SectionMenu";
import { ProductMenu } from "./menus/ProductMenu";
import { OfferMenu } from "./menus/OfferMenu";
import { StyleMenu } from "./menus/StyleMenu";
import { HistoryMenu } from "./menus/HistoryMenu";
import { TestimonialMenu } from "./menus/TestimonialMenu";
import { CategoryMenu } from "./menus/CategoryMenu";
import { FooterMenu } from "./menus/FooterMenu";
import { ActionMenu } from "./menus/ActionMenu";
import { BottomSheet } from "./BottomSheet";

export function Toolbar() {
  const {
    selectedElement,
    activeMenu,
    isDirty,
    isSaving,
    isPreview,
    openMenu,
    closeMenu,
    deselect,
    undo,
    redo,
    canUndo,
    canRedo,
    save,
    discard,
    togglePreview,
    deleteProduct,
    deleteOffer,
    deleteTestimonial,
    deleteSection,
  } = useEditor();

  const handleDelete = () => {
    if (!selectedElement) return;
    const { type, id, sectionId } = selectedElement;
    if (type === "product") deleteProduct(id);
    else if (type === "offer") deleteOffer(id);
    else if (type === "testimonial") deleteTestimonial(id);
    else if (type === "section") deleteSection(sectionId);
    deselect();
  };

  // Floating control bar (always visible at bottom on mobile)
  return (
    <>
      {/* Main control bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[150] safe-area-bottom">
        <div className="mx-2 mb-2 rounded-2xl border border-white/15 bg-[#0a0e13]/95 backdrop-blur-xl shadow-2xl">
          {/* Top row: context actions */}
          {selectedElement && !isPreview && (
            <div className="flex items-center gap-1 px-3 py-2 border-b border-white/10 overflow-x-auto">
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mr-2 whitespace-nowrap">
                {selectedElement.type}
              </span>

              {(selectedElement.type === "text" || selectedElement.type === "product" || selectedElement.type === "offer" || selectedElement.type === "testimonial") && (
                <ToolbarButton icon={Type} label="Text" active={activeMenu === "text"} onClick={() => openMenu(activeMenu === "text" ? "" : "text")} />
              )}

              {(selectedElement.type === "image" || selectedElement.type === "product" || selectedElement.type === "offer") && (
                <ToolbarButton icon={ImageIcon} label="Image" active={activeMenu === "image"} onClick={() => openMenu(activeMenu === "image" ? "" : "image")} />
              )}

              {selectedElement.type === "section" && (
                <ToolbarButton icon={LayoutGrid} label="Section" active={activeMenu === "section"} onClick={() => openMenu(activeMenu === "section" ? "" : "section")} />
              )}

              {selectedElement.type === "product" && (
                <ToolbarButton icon={Plus} label="Product" active={activeMenu === "product"} onClick={() => openMenu(activeMenu === "product" ? "" : "product")} />
              )}

              {selectedElement.type === "offer" && (
                <ToolbarButton icon={Plus} label="Offer" active={activeMenu === "offer"} onClick={() => openMenu(activeMenu === "offer" ? "" : "offer")} />
              )}

              {selectedElement.type === "testimonial" && (
                <ToolbarButton icon={Plus} label="Review" active={activeMenu === "testimonial"} onClick={() => openMenu(activeMenu === "testimonial" ? "" : "testimonial")} />
              )}

              {selectedElement.type === "category" && (
                <ToolbarButton icon={LayoutGrid} label="Category" active={activeMenu === "category"} onClick={() => openMenu(activeMenu === "category" ? "" : "category")} />
              )}

              {(selectedElement.id.startsWith("footer-link-") || selectedElement.id.startsWith("footer-link-href-")) && (
                <ToolbarButton icon={LayoutGrid} label="Footer" active={activeMenu === "footer"} onClick={() => openMenu(activeMenu === "footer" ? "" : "footer")} />
              )}

              {(["hero-cta1", "hero-cta2", "header-logo", "header-account", "testimonials-view-all"].includes(selectedElement.id)) && (
                <ToolbarButton icon={Link2} label="Action" active={activeMenu === "action"} onClick={() => openMenu(activeMenu === "action" ? "" : "action")} />
              )}

              <ToolbarButton icon={Palette} label="Style" active={activeMenu === "style"} onClick={() => openMenu(activeMenu === "style" ? "" : "style")} />

              <ToolbarButton icon={Trash2} label="Delete" onClick={handleDelete} variant="danger" />

              <button
                onClick={deselect}
                className="ml-auto p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Bottom row: global actions */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-1">
              <ToolbarButton icon={Undo2} label="Undo" onClick={undo} disabled={!canUndo} />
              <ToolbarButton icon={Redo2} label="Redo" onClick={redo} disabled={!canRedo} />
              <ToolbarButton icon={RotateCcw} label="History" active={activeMenu === "history"} onClick={() => openMenu(activeMenu === "history" ? "" : "history")} />
            </div>

            <div className="flex items-center gap-1">
              <ToolbarButton
                icon={isPreview ? EyeOff : Eye}
                label={isPreview ? "Edit" : "Preview"}
                onClick={togglePreview}
              />

              {isDirty && !isPreview && (
                <button
                  onClick={discard}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition min-h-[44px]"
                >
                  Discard
                </button>
              )}

              <button
                onClick={save}
                disabled={!isDirty || isSaving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed bg-lime-400 text-black hover:bg-lime-300"
              >
                {isSaving ? (
                  <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : isDirty ? (
                  <Save className="w-3.5 h-3.5" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                {isSaving ? "Saving..." : isDirty ? "Save" : "Saved"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menus as bottom sheets */}
      <BottomSheet open={activeMenu === "text"} onClose={closeMenu} title="Text Editor">
        <TextMenu />
      </BottomSheet>

      <BottomSheet open={activeMenu === "image"} onClose={closeMenu} title="Image Editor">
        <ImageMenu />
      </BottomSheet>

      <BottomSheet open={activeMenu === "section"} onClose={closeMenu} title="Section Options">
        <SectionMenu />
      </BottomSheet>

      <BottomSheet open={activeMenu === "product"} onClose={closeMenu} title="Product Editor">
        <ProductMenu />
      </BottomSheet>

      <BottomSheet open={activeMenu === "offer"} onClose={closeMenu} title="Offer Editor">
        <OfferMenu />
      </BottomSheet>

      <BottomSheet open={activeMenu === "style"} onClose={closeMenu} title="Style Editor">
        <StyleMenu />
      </BottomSheet>

      <BottomSheet open={activeMenu === "history"} onClose={closeMenu} title="Restore History">
        <HistoryMenu />
      </BottomSheet>

      <BottomSheet open={activeMenu === "testimonial"} onClose={closeMenu} title="Review Editor">
        <TestimonialMenu />
      </BottomSheet>

      <BottomSheet open={activeMenu === "category"} onClose={closeMenu} title="Category Editor">
        <CategoryMenu />
      </BottomSheet>

      <BottomSheet open={activeMenu === "footer"} onClose={closeMenu} title="Footer Link Editor">
        <FooterMenu />
      </BottomSheet>

      <BottomSheet open={activeMenu === "action"} onClose={closeMenu} title="Action Link Editor">
        <ActionMenu />
      </BottomSheet>
    </>
  );
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  disabled = false,
  variant = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  variant?: "default" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition min-w-[44px] min-h-[44px] justify-center ${
        active
          ? "bg-blue-500/20 text-blue-400"
          : variant === "danger"
            ? "text-slate-400 hover:text-red-400 hover:bg-red-400/10"
            : "text-slate-400 hover:text-white hover:bg-white/10"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
      title={label}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[9px] leading-none">{label}</span>
    </button>
  );
}
