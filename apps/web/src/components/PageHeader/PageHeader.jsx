import React from "react";
import {
  Globe,
  ArrowRight,
  ShieldCheck,
  Terminal,
  AlertCircle,
  CheckCircle2,
  User,
  Heart,
  Users,
  Video,
  Loader2,
  Search,
  Zap,
  Lock,
  MapPin,
  TrendingUp,
  Wifi,
  Activity,
} from "lucide-react";

export default function PageHeader({ regions }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 22,
        overflow: "hidden",
        background: "linear-gradient(135deg, #0a0f1e 0%, #0d1526 100%)",
        border: "1px solid rgba(255,255,255,0.05)",
        padding: "28px 32px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(37,244,238,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(37,244,238,0.025) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -50,
          right: 60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(37,244,238,0.07) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -30,
          left: 100,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(254,44,85,0.05) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(37,244,238,0.07)",
              border: "1px solid rgba(37,244,238,0.15)",
              borderRadius: 99,
              padding: "4px 14px",
              marginBottom: 12,
            }}
          >
            <Globe size={12} color="#25F4EE" />
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#25F4EE",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              Rumi Migration Engine v2.4.1
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(20px,3vw,30px)",
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 6px",
              lineHeight: 1.1,
            }}
          >
            Region{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#25F4EE,#FE2C55)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Converter
            </span>
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            High-fidelity TikTok account migration across {regions.length}{" "}
            international node clusters.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Clusters", value: regions.length, color: "#25F4EE" },
            { label: "Uptime", value: "99.9%", color: "#10b981" },
            { label: "Avg Speed", value: "~15s", color: "#f59e0b" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: `${s.color}08`,
                border: `1px solid ${s.color}18`,
                borderRadius: 12,
                padding: "10px 16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: s.color,
                  fontFamily: "monospace",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
