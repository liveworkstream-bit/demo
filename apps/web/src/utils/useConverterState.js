import { useState, useRef } from "react";

export function useConverterState() {
  const [username, setUsername] = useState("");
  const [targetRegion, setTargetRegion] = useState("");
  const [scraperLoading, setScraperLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [migrationData, setMigrationData] = useState(null);
  const [teleLogs, setTeleLogs] = useState([
    { type: "muted", text: "RUMI ENGINE READY · AWAITING TARGET..." },
  ]);
  const teleBottomRef = useRef(null);

  return {
    username,
    setUsername,
    targetRegion,
    setTargetRegion,
    scraperLoading,
    setScraperLoading,
    profileData,
    setProfileData,
    checkoutItem,
    setCheckoutItem,
    migrationData,
    setMigrationData,
    teleLogs,
    setTeleLogs,
    teleBottomRef,
  };
}
