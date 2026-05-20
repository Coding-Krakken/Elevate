"use client";

import { useState } from "react";

const STORAGE_KEY = "elevate.ageGateAccepted";

export function useAgeGate() {
  const [accepted, setAccepted] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(STORAGE_KEY) === "true";
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
