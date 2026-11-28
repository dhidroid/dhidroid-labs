"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LiveContent() {
  const router = useRouter();

  useEffect(() => {
    const stream = new EventSource("/api/content/live");
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let connected = false;
    const refresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => router.refresh(), 350);
    };
    stream.onmessage = refresh;
    stream.addEventListener("restart", refresh);
    stream.addEventListener("welcome", () => {
      if (connected) refresh();
      connected = true;
    });

    return () => {
      clearTimeout(refreshTimer);
      stream.close();
    };
  }, [router]);
  return null;
}
