import React from "react";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import CheckoutModal from "@/components/CheckoutModal";
import MigrationTerminal from "@/components/MigrationTerminal/MigrationTerminal";
import PageHeader from "@/components/PageHeader/PageHeader";
import ProfileFetchPanel from "@/components/ProfileFetchPanel/ProfileFetchPanel";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import RegionSelector from "@/components/RegionSelector/RegionSelector";
import MigrationRouteVisualizer from "@/components/MigrationRouteVisualizer/MigrationRouteVisualizer";
import TelemetryTerminal from "@/components/TelemetryTerminal/TelemetryTerminal";
import SecurityNotice from "@/components/SecurityNotice/SecurityNotice";
import { useConverterState } from "@/utils/useConverterState";
import {
  handleScrape,
  handleInitialize,
  handlePaymentComplete,
  handleSelectRegion,
} from "@/utils/converterHandlers";

export default function RumiConverter() {
  const {
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
  } = useConverterState();

  const { data: regions = [] } = useQuery({
    queryKey: ["regions"],
    queryFn: () => fetch("/api/regions").then((r) => r.json()),
  });

  const selectedRegion = regions.find((r) => r.code === targetRegion);

  const onScrapeSubmit = (e) =>
    handleScrape(
      e,
      username,
      setScraperLoading,
      setProfileData,
      setTeleLogs,
      teleBottomRef,
    );

  const onInitialize = () =>
    handleInitialize(
      profileData,
      targetRegion,
      regions,
      setCheckoutItem,
      setTeleLogs,
      teleBottomRef,
    );

  const onPaymentComplete = (order) =>
    handlePaymentComplete(
      order,
      setCheckoutItem,
      setMigrationData,
      username,
      profileData,
      selectedRegion,
      setTeleLogs,
      teleBottomRef,
    );

  const onSelectRegion = (region) =>
    handleSelectRegion(region, setTargetRegion, setTeleLogs, teleBottomRef);

  return (
    <Layout>
      <style jsx global>{`
        @keyframes profileIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes regionPulse { 0%,100%{box-shadow:0 0 0 0 rgba(37,244,238,0.3)} 50%{box-shadow:0 0 0 6px rgba(37,244,238,0)} }
        @keyframes scanLine { 0%{top:0;opacity:0.6} 100%{top:100%;opacity:0} }
        .profile-card { animation: profileIn 0.4s cubic-bezier(0.23,1,0.32,1) forwards; }
        .region-active { animation: regionPulse 2s ease-in-out infinite; }
        .conv-input {
          width:100%; background:rgba(30,41,59,0.5); border:1.5px solid rgba(255,255,255,0.06);
          border-radius:14px; padding:14px 14px 14px 48px; color:#fff; font-size:14px;
          font-weight:700; outline:none; box-sizing:border-box;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        .conv-input:focus { border-color:rgba(37,244,238,0.5); box-shadow:0 0 0 3px rgba(37,244,238,0.08); }
        .conv-input::placeholder { color:#334155; font-weight:500; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <PageHeader regions={regions} />

        {/* ── MAIN GRID ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
            gap: 20,
          }}
          className="conv-grid"
        >
          {/* ── LEFT: Input + Profile ──────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ProfileFetchPanel
              username={username}
              setUsername={setUsername}
              scraperLoading={scraperLoading}
              onSubmit={onScrapeSubmit}
            />
            {profileData && !scraperLoading && (
              <ProfileCard profileData={profileData} username={username} />
            )}
            <RegionSelector
              regions={regions}
              targetRegion={targetRegion}
              onSelectRegion={onSelectRegion}
              profileData={profileData}
              selectedRegion={selectedRegion}
              onInitialize={onInitialize}
            />
          </div>

          {/* ── RIGHT: Telemetry Terminal ─────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <MigrationRouteVisualizer
              profileData={profileData}
              selectedRegion={selectedRegion}
              username={username}
            />
            <TelemetryTerminal
              teleLogs={teleLogs}
              teleBottomRef={teleBottomRef}
            />
            <SecurityNotice />
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={!!checkoutItem}
        onClose={() => setCheckoutItem(null)}
        item={checkoutItem || {}}
        type="conversion"
        onComplete={onPaymentComplete}
      />

      {/* Migration Terminal Overlay */}
      {migrationData && (
        <MigrationTerminal
          data={migrationData}
          onDone={() => {
            setMigrationData(null);
            setProfileData(null);
            setUsername("");
            setTargetRegion("");
            setTeleLogs([
              { type: "muted", text: "RUMI ENGINE READY · AWAITING TARGET..." },
            ]);
          }}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @media (max-width: 860px) {
          .conv-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
