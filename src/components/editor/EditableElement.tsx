"use client";

import { useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import { useLongPress } from "@/hooks/useLongPress";
import { useEditor } from "@/hooks/useEditor";
import type { EditorElementType } from "@/types";

interface EditableElementProps {
  children: ReactNode;
  elementId: string;
  elementType: EditorElementType;
  sectionId: string;
  path: string;
  className?: string;
}

export function EditableElement({
  children,
  elementId,
  elementType,
  sectionId,
  path,
  className = "",
}: EditableElementProps) {
  const { select, selectedElement, isPreview, content } = useEditor();
  const ref = useRef<HTMLDivElement>(null);

  const isSelected = selectedElement?.id === elementId;

  const handleSelect = (e?: React.TouchEvent | React.MouseEvent) => {
    e?.stopPropagation();
    const rect = ref.current?.getBoundingClientRect();
    select({
      id: elementId,
      type: elementType,
      sectionId,
      path,
      rect: rect ?? undefined,
    });
  };

  const longPressHandlers = useLongPress({
    threshold: 400,
    onLongPress: handleSelect,
    onClick: handleSelect,
  });

  const style = useMemo<CSSProperties>(() => {
    const overrides = content.styleOverrides?.[elementId];
    if (!overrides) {
      return {};
    }

    return {
      fontSize: overrides.fontSize,
      fontFamily: overrides.fontFamily,
      fontWeight: overrides.fontWeight as CSSProperties["fontWeight"],
      color: overrides.color,
      textAlign: overrides.textAlign as CSSProperties["textAlign"],
      letterSpacing: overrides.letterSpacing,
      lineHeight: overrides.lineHeight,
      backgroundColor: overrides.backgroundColor,
      padding: overrides.padding,
      border: overrides.border,
      borderRadius: overrides.borderRadius,
      opacity: overrides.opacity,
      boxShadow: overrides.boxShadow,
    };
  }, [content.styleOverrides, elementId]);

  if (isPreview) {
    return <>{children}</>;
  }

  const hasPositionClass = /\b(absolute|fixed|sticky)\b/.test(className);

  return (
    <div
      ref={ref}
      className={`${hasPositionClass ? "" : "relative "}cursor-pointer transition-all ${
        isSelected
          ? "ring-2 ring-blue-400 ring-offset-1 ring-offset-transparent rounded-md"
          : "hover:ring-1 hover:ring-white/20 rounded-md"
      } ${className}`}
      style={style}
      onMouseDown={(e) => { e.stopPropagation(); longPressHandlers.onMouseDown(e); }}
      onMouseUp={(e) => { e.stopPropagation(); longPressHandlers.onMouseUp(e); }}
      onMouseLeave={longPressHandlers.onMouseLeave}
      onTouchStart={(e) => { e.stopPropagation(); longPressHandlers.onTouchStart(e); }}
      onTouchMove={longPressHandlers.onTouchMove}
      onTouchEnd={(e) => { e.stopPropagation(); longPressHandlers.onTouchEnd(e); }}
      data-editor-element={elementId}
      data-editor-type={elementType}
    >
      {children}
      {isSelected && (
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-blue-400 rounded-lg pointer-events-none animate-pulse opacity-40" />
      )}
    </div>
  );
}
