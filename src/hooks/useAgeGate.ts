"use client";

import { useState } from "react";

const STORAGE_KEY = "syracuse-exoticz.ageGateAccepted";
const LEGACY_STORAGE_KEY = "elevate.ageGateAccepted";

export function useAgeGate() {
  const [accepted, setAccepted] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const current = window.localStorage.getItem(STORAGE_KEY) === "true";
    if (current) {
      return true;
    }

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY) === "true";
    if (legacy) {
      window.localStorage.setItem(STORAGE_KEY, "true");
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    return legacy;
  });

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setAccepted(true);
  };

  const decline = () => {
    window.location.href = "https://www.google.com";
  };

  return {
    accepted,
    accept,
    decline,
  };
}
