"use client";

import { useEffect } from "react";
import { initializeFirebaseAnalytics } from "../lib/firebase-analytics";

export function SiteAnalytics() {
  useEffect(() => {
    void initializeFirebaseAnalytics().catch((error: unknown) => {
      console.error("Firebase Analytics initialization failed.", error);
    });
  }, []);

  return null;
}
