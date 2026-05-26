import React from "react";
import { Zap, ArrowRight } from "lucide-react";

export default function RegionSelector({
  regions,
  targetRegion,
  onSelectRegion,
  profileData,
  selectedRegion,
  onInitialize,
}) {
  return (
    <div
      style={{
        background: "#090d17",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 20,
        padding: "26px 28px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: 3,
          marginBottom: 16,
        }}
      >
        Step 2 — Destination Cluster
      </div>

      {regions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "24px 0",
            color: "#334155",
            fontSize: 12,
          }}
        >
          No regions configured.{" "}
          <a href="/admin" style={{ color: "#25F4EE", textDecoration: "none" }}>
            Add via Admin →
          </a>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
            gap: 10,
          }}
        >
          {regions.map((region) => {
            const active = targetRegion === region.code;
            return (
              <button
                key={region.code}
                onClick={() => onSelectRegion(region)}
                className={active ? "region-active" : ""}
                style={{
                  padding: "14px 8px",
                  borderRadius: 14,
                  border: active
                    ? "1.5px solid rgba(37,244,238,0.5)"
                    : "1.5px solid rgba(255,255,255,0.05)",
                  background: active
                    ? "rgba(37,244,238,0.06)"
                    : "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.12)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.05)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }
                }}
              >
                <span style={{ fontSize: 24, lineHeight: 1 }}>
                  {region.flag || "🌐"}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: active ? "#25F4EE" : "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {region.name}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    color: active ? "#25F4EE" : "#334155",
                    fontWeight: 700,
                  }}
                >
                  ${parseFloat(region.conversion_fee || 0).toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Initialize button */}
      {profileData && (
        <button
          onClick={onInitialize}
          disabled={!targetRegion}
          style={{
            marginTop: 18,
            width: "100%",
            height: 52,
            borderRadius: 14,
            border: "none",
            background: !targetRegion
              ? "rgba(255,255,255,0.04)"
              : "linear-gradient(135deg,#FE2C55 0%,#c0006d 40%,#25F4EE 100%)",
            color: !targetRegion ? "#334155" : "#fff",
            fontSize: 12,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: !targetRegion ? "not-allowed" : "pointer",
            boxShadow: !targetRegion
              ? "none"
              : "0 8px 28px rgba(254,44,85,0.3)",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            if (targetRegion) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 36px rgba(37,244,238,0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (targetRegion) {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow =
                "0 8px 28px rgba(254,44,85,0.3)";
            }
          }}
        >
          {!targetRegion ? (
            "Select a destination first"
          ) : (
            <>
              <Zap size={15} /> Initialize Migration · {selectedRegion?.flag}{" "}
              {selectedRegion?.name} <ArrowRight size={15} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
