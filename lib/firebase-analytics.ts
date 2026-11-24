"use client";

import { getApps, initializeApp } from "firebase/app";
import {
  getAnalytics,
  isSupported,
  logEvent,
  type Analytics,
} from "firebase/analytics";

const appName = "dhidroid-labs-analytics";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let analyticsPromise: Promise<Analytics | null> | undefined;

export function initializeFirebaseAnalytics(): Promise<Analytics | null> {
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.projectId ||
    !firebaseConfig.appId ||
    !firebaseConfig.measurementId
  ) {
    return Promise.resolve(null);
  }

  analyticsPromise ??= isSupported().then((supported) => {
    if (!supported) return null;
    const app =
      getApps().find((candidate) => candidate.name === appName) ??
      initializeApp(firebaseConfig, appName);
    return getAnalytics(app);
  });

  return analyticsPromise;
}

export async function trackSiteEvent(
  name: "sign_up" | "generate_lead",
  method: "newsletter" | "contact_form",
): Promise<void> {
  const analytics = await initializeFirebaseAnalytics();
  if (!analytics) return;
  if (name === "sign_up") {
    logEvent(analytics, "sign_up", { method });
  } else {
    logEvent(analytics, "generate_lead", { method });
  }
}
