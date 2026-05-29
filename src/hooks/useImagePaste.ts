"use client";

import { useCallback, useRef, useState } from "react";
import { generateDeviceFingerprint } from "@/lib/fingerprint";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Returns an onPaste handler that detects pasted images from clipboard,
 * uploads them via /api/admin/upload-image, and calls onUploaded with the URL.
 * Falls back to a data URL if the upload fails.
 */
export function useImagePaste(onUploaded: (url: string) => void) {
  const [pasting, setPasting] = useState(false);
  const callbackRef = useRef(onUploaded);
  callbackRef.current = onUploaded;

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLInputElement>) => {
      // Try clipboardData.files first (more reliable in some browsers)
      const files = e.clipboardData?.files;
      const items = e.clipboardData?.items;

      let imageFile: File | null = null;

      if (files && files.length > 0) {
        for (const file of Array.from(files)) {
          if (file.type.startsWith("image/")) {
            imageFile = file;
            break;
          }
        }
      }

      if (!imageFile && items) {
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            imageFile = item.getAsFile();
            break;
          }
        }
      }

      if (!imageFile) return; // No image — let default text paste proceed

      e.preventDefault();
      setPasting(true);
      try {
        const fingerprint = await generateDeviceFingerprint();
        const formData = new FormData();
        formData.append("file", imageFile);

        const response = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: { "x-device-fingerprint": fingerprint },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (typeof data?.url === "string") {
            callbackRef.current(data.url);
            return;
          }
        }

        // Fallback: convert to data URL for immediate use
        const dataUrl = await fileToDataUrl(imageFile);
        callbackRef.current(dataUrl);
      } catch {
        // Last resort: try data URL conversion
        try {
          const dataUrl = await fileToDataUrl(imageFile);
          callbackRef.current(dataUrl);
        } catch {
          // Truly failed
        }
      } finally {
        setPasting(false);
      }
    },
    [],
  );

  return { handlePaste, pasting };
}
