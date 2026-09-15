// src/lib/settingsCache.js
let cachedSettings = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30 * 1000; // 30 sekonda

export async function getCachedMaintenanceStatus() {
  const now = Date.now();

  // ✅ Kthe nga cache nëse është ende valid
  if (cachedSettings && now - cacheTimestamp < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    // ✅ Thirr API route (jo DB direkt, sepse proxy është Edge runtime)
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/settings/maintenance-status`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    // ✅ Cache
    cachedSettings = data;
    cacheTimestamp = now;

    return data;
  } catch (error) {
    console.error("Error fetching maintenance status:", error);
    // ✅ Fail-safe: kthe false nëse API fail
    return { maintenanceMode: false, maintenanceMessage: "" };
  }
}
