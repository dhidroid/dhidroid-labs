import { afterEach, describe, expect, it, vi } from "vitest";

const firebaseMocks = vi.hoisted(() => ({
  getApps: vi.fn(),
  initializeApp: vi.fn(),
  getAnalytics: vi.fn(),
  isSupported: vi.fn(),
  logEvent: vi.fn(),
}));

vi.mock("firebase/app", () => ({
  getApps: firebaseMocks.getApps,
  initializeApp: firebaseMocks.initializeApp,
}));

vi.mock("firebase/analytics", () => ({
  getAnalytics: firebaseMocks.getAnalytics,
  isSupported: firebaseMocks.isSupported,
  logEvent: firebaseMocks.logEvent,
}));

afterEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("Firebase Analytics", () => {
  it("stays disabled when required public Firebase configuration is missing", async () => {
    const { initializeFirebaseAnalytics } = await import("./firebase-analytics");

    await expect(initializeFirebaseAnalytics()).resolves.toBeNull();
    expect(firebaseMocks.isSupported).not.toHaveBeenCalled();
  });

  it("records generic conversion events without form data", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "public-api-key");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "project-id");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "app-id");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID", "measurement-id");
    const analytics = {};
    const app = { name: "dhidroid-labs-analytics" };
    firebaseMocks.isSupported.mockResolvedValue(true);
    firebaseMocks.getApps.mockReturnValue([]);
    firebaseMocks.initializeApp.mockReturnValue(app);
    firebaseMocks.getAnalytics.mockReturnValue(analytics);

    const { trackSiteEvent } = await import("./firebase-analytics");
    await trackSiteEvent("sign_up", "newsletter");

    expect(firebaseMocks.initializeApp).toHaveBeenCalledWith(
      expect.objectContaining({ measurementId: "measurement-id" }),
      "dhidroid-labs-analytics",
    );
    expect(firebaseMocks.logEvent).toHaveBeenCalledWith(analytics, "sign_up", {
      method: "newsletter",
    });
  });
});
