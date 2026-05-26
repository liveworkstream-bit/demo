import playSound from "@/utils/sounds";

export function addLog(setTeleLogs, teleBottomRef, type, text) {
  const now = new Date().toLocaleTimeString("en-US", { hour12: false });
  setTeleLogs((prev) => [...prev.slice(-40), { type, text, time: now }]);
  setTimeout(
    () => teleBottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    50,
  );
}

export async function handleScrape(
  e,
  username,
  setScraperLoading,
  setProfileData,
  setTeleLogs,
  teleBottomRef,
) {
  e.preventDefault();
  if (!username.trim()) return;
  setScraperLoading(true);
  setProfileData(null);
  playSound("beep");
  addLog(
    setTeleLogs,
    teleBottomRef,
    "warn",
    `Initiating handshake → @${username}`,
  );
  addLog(
    setTeleLogs,
    teleBottomRef,
    "cyan",
    "Proxy rotation active · Node-42 selected",
  );

  try {
    const response = await fetch(
      `/api/tiktok-scraper?username=${encodeURIComponent(username.trim())}`,
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    setProfileData(data);
    playSound("chime");
    addLog(setTeleLogs, teleBottomRef, "ok", `Profile synced · @${username}`);
    addLog(
      setTeleLogs,
      teleBottomRef,
      "ok",
      `Followers: ${(data.followers / 1000).toFixed(1)}k  ·  Hearts: ${(data.hearts / 1000).toFixed(1)}k`,
    );
    addLog(
      setTeleLogs,
      teleBottomRef,
      "ok",
      `Verified: ${data.verified ? "YES ✓" : "NO"}`,
    );
  } catch (err) {
    addLog(
      setTeleLogs,
      teleBottomRef,
      "error",
      `Scrape failed · ${err.message}`,
    );
    console.error(err);
  } finally {
    setScraperLoading(false);
  }
}

export function handleInitialize(
  profileData,
  targetRegion,
  regions,
  setCheckoutItem,
  setTeleLogs,
  teleBottomRef,
) {
  if (!profileData || !targetRegion) return;
  const region = regions.find((r) => r.code === targetRegion);
  if (!region) return;
  setCheckoutItem(region);
  playSound("beep");
  addLog(
    setTeleLogs,
    teleBottomRef,
    "warn",
    `Migration order opened → ${region.flag} ${region.name}`,
  );
}

export function handlePaymentComplete(
  order,
  setCheckoutItem,
  setMigrationData,
  username,
  profileData,
  selectedRegion,
  setTeleLogs,
  teleBottomRef,
) {
  setCheckoutItem(null);
  setMigrationData({
    username,
    profileData,
    targetRegion: selectedRegion,
    orderId: order?.id,
    totalPaid: order?.total_paid,
  });
  addLog(
    setTeleLogs,
    teleBottomRef,
    "ok",
    `Payment authorized · #TR-${String(order?.id || "00000").padStart(5, "0")}`,
  );
  addLog(setTeleLogs, teleBottomRef, "warn", "Launching migration engine...");
}

export function handleSelectRegion(
  region,
  setTargetRegion,
  setTeleLogs,
  teleBottomRef,
) {
  setTargetRegion(region.code);
  addLog(
    setTeleLogs,
    teleBottomRef,
    "cyan",
    `Destination set → ${region.flag} ${region.name} · Fee $${parseFloat(region.conversion_fee || 0).toFixed(2)}`,
  );
}
