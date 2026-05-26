import React, { useRef } from "react";

export default function TelemetryTerminal({ teleLogs, teleBottomRef }) {
  const teleColors = {
    ok: "#10b981",
    warn: "#f59e0b",
    cyan: "#25F4EE",
    muted: "#334155",
    error: "#FE2C55",
  };

  return (
    <div
      style={{
        flex: 1,
        background: "#090d17",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#FE2C55",
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#f59e0b",
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10b981",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: "#334155",
            letterSpacing: 1,
          }}
        >
          rumi@tokvault — migration-telemetry
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 6px #10b981",
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: "#10b981",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Live
          </span>
        </div>
      </div>

      {/* Logs */}
      <div
        style={{
          flex: 1,
          padding: "16px 20px",
          minHeight: 280,
          maxHeight: 400,
          overflowY: "auto",
          fontFamily: "'JetBrains Mono','Courier New',monospace",
          scrollbarWidth: "thin",
          scrollbarColor: "#1e293b #090d17",
        }}
      >
        {teleLogs.map((log, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
            {log.time && (
              <span
                style={{
                  fontSize: 10,
                  color: "#1e293b",
                  minWidth: 70,
                  flexShrink: 0,
                  paddingTop: 1,
                }}
              >
                [{log.time}]
              </span>
            )}
            <span
              style={{
                fontSize: 11,
                color: teleColors[log.type] || "#94a3b8",
                lineHeight: 1.6,
              }}
            >
              {log.text}
            </span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10 }}>
          {teleLogs[teleLogs.length - 1]?.time && (
            <span style={{ fontSize: 10, color: "#1e293b", minWidth: 70 }}>
              [
              {new Date().toLocaleTimeString("en-US", {
                hour12: false,
              })}
              ]
            </span>
          )}
          <span
            style={{
              color: "#25F4EE",
              fontSize: 13,
              animation: "blink 1s step-end infinite",
            }}
          >
            █
          </span>
        </div>
        <div ref={teleBottomRef} />
      </div>
    </div>
  );
}
