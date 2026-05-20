"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useSiteStore } from "@/hooks/useSiteStore";

export function Toast() {
  const { toastMessage, closeToast } = useSiteStore();

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const timer = window.setTimeout(() => closeToast(), 2200);
    return () => window.clearTimeout(timer);
  }, [closeToast, toastMessage]);

  if (!toastMessage) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-[95] w-[92%] max-w-sm -translate-x-1/2 rounded-xl border border-lime-300/40 bg-[#0f1714] px-4 py-3 text-sm text-lime-100 shadow-[0_0_30px_rgba(156,255,46,0.2)]">
      <p className="flex items-center gap-2 font-medium">
        <CheckCircle2 className="h-4 w-4 text-lime-300" />
        {toastMessage}
      </p>
    </div>
  );
}
