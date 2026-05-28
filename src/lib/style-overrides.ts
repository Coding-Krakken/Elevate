import type { CSSProperties } from "react";
import type { ElementStyleOverrides } from "@/types";

export function toElementStyle(overrides?: ElementStyleOverrides): CSSProperties {
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
    objectFit: overrides.objectFit,
    objectPosition: overrides.objectPosition,
  };
}
