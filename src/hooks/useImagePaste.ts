"use client";

import { useCallback, useState } from "react";
import { generateDeviceFingerprint } from "@/lib/fingerprint";

/**
 * Returns an onPaste handler that detects pasted images from clipboard,
 * uploads them via /api/admin/upload-image, and calls onUploaded with the URL.
 */
export function useImagePaste(onUploaded: (url: string) => void) {
  const [pasting, setPasting] = useState(false);

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLInputElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) return;

          setPasting(true);
          try {
            const fingerprint = await generateDeviceFingerprint();
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/admin/upload-image", {
              method: "POST",
              headers: { "x-device-fingerprint": fingerprint },
              body: formData,
            });

            if (!response.ok) return;

            const data = await response.json();
            if (typeof data?.url === "string") {
              onUploaded(data.url);
            }
          } catch {
            // Silent failure — user can still paste a URL manually
          } finally {
            setPasting(false);
          }
          return;
        }
      }
      // If no image in clipboard, let the default paste (text URL) proceed
    },
    [onUploaded],
  );

  return { handlePaste, pasting };
}
