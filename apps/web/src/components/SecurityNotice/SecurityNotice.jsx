import React from "react";
import { AlertCircle } from "lucide-react";

export default function SecurityNotice() {
  return (
    <div
      style={{
        background: "rgba(245,158,11,0.04)",
        border: "1px solid rgba(245,158,11,0.12)",
        borderRadius: 16,
        padding: "16px 20px",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "rgba(245,158,11,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <AlertCircle size={18} color="#f59e0b" />
      </div>
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#f59e0b",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          Security Protocol Notice
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#64748b",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Migration fees are non-refundable once the SSL handshake is completed.
          International clusters may trigger banking security protocols
          resulting in surcharges.
        </p>
      </div>
    </div>
  );
}
