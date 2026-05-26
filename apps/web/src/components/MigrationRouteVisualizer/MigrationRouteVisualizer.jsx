import React from "react";
import { ArrowRight } from "lucide-react";

export default function MigrationRouteVisualizer({
  profileData,
  selectedRegion,
  username,
}) {
  if (!profileData || !selectedRegion) return null;

  return (
    <div
      className="profile-card"
      style={{
        background: "#090d17",
        border: "1px solid rgba(37,244,238,0.12)",
        borderRadius: 20,
        padding: "20px 24px",
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
        Migration Route
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Source */}
        <div
          style={{
            flex: 1,
            background: "rgba(254,44,85,0.05)",
            border: "1px solid rgba(254,44,85,0.15)",
            borderRadius: 14,
            padding: "14px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            Source
          </div>
          <div style={{ fontSize: 20 }}>🌐</div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#94a3b8",
              marginTop: 4,
            }}
          >
            Auto-Detect
          </div>
          <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>
            @{username}
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#FE2C55,#25F4EE)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(37,244,238,0.3)",
            }}
          >
            <ArrowRight size={14} color="#fff" />
          </div>
          <div
            style={{
              fontSize: 8,
              color: "#334155",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            ${parseFloat(selectedRegion.conversion_fee || 0).toFixed(2)}
          </div>
        </div>

        {/* Destination */}
        <div
          style={{
            flex: 1,
            background: "rgba(37,244,238,0.05)",
            border: "1px solid rgba(37,244,238,0.2)",
            borderRadius: 14,
            padding: "14px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#25F4EE",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            Destination
          </div>
          <div style={{ fontSize: 20 }}>{selectedRegion.flag || "🌐"}</div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#fff",
              marginTop: 4,
            }}
          >
            {selectedRegion.name}
          </div>
          <div style={{ fontSize: 10, color: "#25F4EE", marginTop: 2 }}>
            {selectedRegion.code}
          </div>
        </div>
      </div>
    </div>
  );
}
