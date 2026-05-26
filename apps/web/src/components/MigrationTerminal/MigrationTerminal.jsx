import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, Terminal, FileText, RotateCcw } from "lucide-react";
import playSound from "@/utils/sounds";

export default function MigrationTerminal({ data, onDone }) {
  const { username, profileData, targetRegion, orderId, totalPaid } = data;

  const [lines, setLines] = useState([]);
  const [done, setDone] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [progress, setProgress] = useState(0);
  const bottomRef = useRef(null);
  const nodeNum = useRef(Math.floor(Math.random() * 90 + 10));
  const completedAt = useRef(new Date());

  const baseFee = parseFloat(targetRegion?.conversion_fee || 0);
  const total = parseFloat(totalPaid || 0);
  const surcharge = Math.max(0, total - baseFee);

  const script = [
    {
      delay: 0,
      type: "system",
      text: "RUMI MIGRATION ENGINE v2.4.1 — INITIALIZING...",
    },
    {
      delay: 400,
      type: "info",
      text: `Order authenticated · #TR-${String(orderId || "00000").padStart(5, "0")} · $${total.toFixed(2)} deducted`,
    },
    { delay: 900, type: "cyan", text: `Target profile locked → @${username}` },
    {
      delay: 1400,
      type: "cyan",
      text: `Followers: ${((profileData?.followers || 0) / 1000).toFixed(1)}k  ·  Hearts: ${((profileData?.hearts || 0) / 1000).toFixed(1)}k  ·  Videos: ${profileData?.video_count || 0}`,
    },
    {
      delay: 2000,
      type: "warn",
      text: "Initiating SSL handshake with proxy cluster...",
    },
    {
      delay: 2700,
      type: "ok",
      text: `Proxy-Node-${nodeNum.current} connected · Latency 11ms`,
    },
    {
      delay: 3300,
      type: "warn",
      text: `Resolving source cluster for @${username}...`,
    },
    { delay: 4000, type: "ok", text: "Source region identified → AUTO-DETECT" },
    {
      delay: 4600,
      type: "warn",
      text: "Disconnecting from AUTO-DETECT server pool...",
    },
    {
      delay: 5300,
      type: "ok",
      text: "Account session safely suspended · No data loss",
    },
    {
      delay: 5900,
      type: "warn",
      text: `Establishing encrypted tunnel → ${targetRegion?.flag || "🌐"} ${targetRegion?.name} datacenter...`,
    },
    {
      delay: 6700,
      type: "ok",
      text: `Tunnel established · ${targetRegion?.name} · Node-${nodeNum.current} (${targetRegion?.code})`,
    },
    {
      delay: 7400,
      type: "warn",
      text: "Migrating account metadata & session tokens...",
    },
    {
      delay: 8200,
      type: "ok",
      text: "Metadata migrated · Session tokens re-issued",
    },
    {
      delay: 8900,
      type: "warn",
      text: "Updating TikTok DNS routing tables...",
    },
    {
      delay: 9700,
      type: "ok",
      text: `DNS updated · Routing @${username} → ${targetRegion?.name}`,
    },
    {
      delay: 10400,
      type: "warn",
      text: "Verifying cluster assignment & region lock...",
    },
    {
      delay: 11200,
      type: "ok",
      text: `Region lock confirmed → ${targetRegion?.flag || "🌐"} ${targetRegion?.name} (${targetRegion?.code})`,
    },
    {
      delay: 11900,
      type: "warn",
      text: "Running post-migration integrity checks...",
    },
    {
      delay: 12600,
      type: "ok",
      text: "Profile integrity · 100% · All nodes synchronized",
    },
    {
      delay: 13200,
      type: "ok",
      text: "Content delivery re-routed to regional CDN",
    },
    {
      delay: 13800,
      type: "ok",
      text: "Language/currency metadata updated to destination",
    },
    {
      delay: 14400,
      type: "system",
      text: "──────────────────────────────────────────────────────────",
    },
    { delay: 14800, type: "success", text: "✦  MIGRATION COMPLETE  ✦" },
    {
      delay: 15200,
      type: "success",
      text: `@${username} is now live in ${targetRegion?.flag || "🌐"} ${targetRegion?.name}`,
    },
    {
      delay: 15600,
      type: "system",
      text: "──────────────────────────────────────────────────────────",
    },
  ];

  useEffect(() => {
    script.forEach(({ delay, type, text }) => {
      setTimeout(() => {
        setLines((prev) => [...prev, { type, text }]);
        setProgress(Math.min(100, Math.round((delay / 15600) * 100)));
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, delay);
    });
    setTimeout(() => {
      completedAt.current = new Date();
      setDone(true);
      setProgress(100);
      playSound("success");
    }, 16200);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const colors = {
    system: "#334155",
    info: "#8b5cf6",
    cyan: "#25F4EE",
    warn: "#f59e0b",
    ok: "#10b981",
    success: "#25F4EE",
  };
  const prefixes = {
    system: "   ",
    info: "[✓]",
    cyan: "[→]",
    warn: "[…]",
    ok: "[✓]",
    success: "[★]",
  };

  // ── RECEIPT VIEW ─────────────────────────────────────────────────────────
  if (showReceipt) {
    const receiptDate = completedAt.current.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const receiptTime = completedAt.current.toLocaleTimeString("en-US", {
      hour12: false,
    });

    const rows = [
      {
        key: "Order ID",
        val: `#TR-${String(orderId || "00000").padStart(5, "0")}`,
        mono: true,
        highlight: true,
      },
      { key: "Date", val: receiptDate },
      { key: "Time (UTC)", val: receiptTime, mono: true },
      { key: "Protocol", val: "Cluster Migration v2" },
      { key: "Account", val: `@${username}`, mono: true },
      { key: "Display Name", val: profileData?.nickname || username },
      {
        key: "Verified",
        val: profileData?.verified ? "✓ Yes" : "No",
        verified: true,
      },
      { key: "Source Cluster", val: "🌐 Auto-Detect" },
      {
        key: "Destination",
        val: `${targetRegion?.flag || ""} ${targetRegion?.name || ""} (${targetRegion?.code || ""})`,
        cyan: true,
      },
      { key: "Node Assigned", val: `Node-${nodeNum.current}`, mono: true },
      { divider: true },
      { key: "Base Fee", val: `$${baseFee.toFixed(2)}`, white: true },
      ...(surcharge > 0
        ? [
            {
              key: "Bank Surcharge",
              val: `+$${surcharge.toFixed(2)}`,
              red: true,
            },
          ]
        : []),
    ];

    return (
      <>
        <style>{`
          @keyframes receiptIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes scanR { 0%{top:0;opacity:0.6} 100%{top:100%;opacity:0} }
          .receipt-card { animation: receiptIn 0.5s cubic-bezier(0.23,1,0.32,1) forwards; }
        `}</style>
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "rgba(3,7,18,0.97)",
            backdropFilter: "blur(24px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            overflowY: "auto",
          }}
        >
          <div
            className="receipt-card"
            style={{
              width: "100%",
              maxWidth: 540,
              margin: "auto",
              background: "linear-gradient(160deg,#050810 0%,#080d1a 100%)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 24,
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.8),0 0 50px rgba(16,185,129,0.06)",
              overflow: "hidden",
            }}
          >
            {/* ── Header ──────────────────────────────────── */}
            <div
              style={{
                background:
                  "linear-gradient(135deg,rgba(16,185,129,0.08),rgba(37,244,238,0.04))",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                padding: "32px",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: "100%",
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg,transparent,rgba(37,244,238,0.4),transparent)",
                    animation: "scanR 2.5s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Confetti dots */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 6,
                    height: 6,
                    borderRadius: i % 2 === 0 ? "50%" : 2,
                    background:
                      i % 3 === 0
                        ? "#25F4EE"
                        : i % 3 === 1
                          ? "#FE2C55"
                          : "#ffd700",
                    left: `${15 + i * 13}%`,
                    top: `${20 + (i % 3) * 20}%`,
                    animation: `receiptIn 0.6s ease ${i * 0.08}s both`,
                    pointerEvents: "none",
                  }}
                />
              ))}

              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background: "rgba(16,185,129,0.1)",
                  border: "2px solid rgba(16,185,129,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                  boxShadow: "0 0 40px rgba(16,185,129,0.2)",
                }}
              >
                <CheckCircle2 size={30} color="#10b981" />
              </div>

              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#25F4EE",
                  textTransform: "uppercase",
                  letterSpacing: 4,
                  marginBottom: 8,
                }}
              >
                Migration Receipt
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#fff",
                  marginBottom: 6,
                }}
              >
                Region Change Confirmed
              </div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                @{username} has been successfully migrated
                <br />
                to {targetRegion?.flag}{" "}
                <strong style={{ color: "#94a3b8" }}>
                  {targetRegion?.name}
                </strong>
              </div>

              {/* Profile pill */}
              {profileData?.profile_image && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 18,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 50,
                    padding: "6px 16px 6px 6px",
                  }}
                >
                  <img
                    src={profileData.profile_image}
                    alt=""
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1.5px solid rgba(37,244,238,0.3)",
                    }}
                  />
                  <span
                    style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}
                  >
                    {profileData.nickname}
                  </span>
                  {profileData.verified && (
                    <CheckCircle2 size={13} color="#25F4EE" />
                  )}
                </div>
              )}
            </div>

            {/* ── Receipt Rows ─────────────────────────────── */}
            <div style={{ padding: "24px 32px" }}>
              {rows.map((row, i) => {
                if (row.divider) {
                  return (
                    <div
                      key={i}
                      style={{
                        height: 1,
                        background: "rgba(255,255,255,0.07)",
                        margin: "12px 0",
                      }}
                    />
                  );
                }
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "9px 0",
                      borderBottom:
                        i === rows.length - 1
                          ? "none"
                          : "1px solid rgba(255,255,255,0.03)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {row.key}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        textAlign: "right",
                        maxWidth: "60%",
                        fontFamily: row.mono
                          ? "'JetBrains Mono','Courier New',monospace"
                          : "inherit",
                        color: row.red
                          ? "#FE2C55"
                          : row.cyan
                            ? "#25F4EE"
                            : row.highlight
                              ? "#fff"
                              : row.white
                                ? "#fff"
                                : row.verified
                                  ? profileData?.verified
                                    ? "#10b981"
                                    : "#64748b"
                                  : "#94a3b8",
                      }}
                    >
                      {row.val}
                    </span>
                  </div>
                );
              })}

              {/* ── Total Block ────────────────────────────── */}
              <div
                style={{
                  marginTop: 18,
                  background: "rgba(16,185,129,0.05)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 16,
                  padding: "18px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: "#10b981",
                      textTransform: "uppercase",
                      letterSpacing: 2,
                    }}
                  >
                    Total Charged
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                    Non-refundable · Migration finalized
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 30,
                      fontWeight: 900,
                      color: "#fff",
                      lineHeight: 1,
                      fontFamily: "monospace",
                    }}
                  >
                    ${total.toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#10b981",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: 2,
                      marginTop: 4,
                    }}
                  >
                    ✓ Settled · USD
                  </div>
                </div>
              </div>

              {/* ── Dotted separator ──────────────────────── */}
              <div
                style={{
                  height: 1,
                  margin: "22px 0 14px",
                  background:
                    "repeating-linear-gradient(90deg,rgba(255,255,255,0.07) 0,rgba(255,255,255,0.07) 6px,transparent 6px,transparent 12px)",
                }}
              />
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 9,
                    color: "#1e293b",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 3,
                  }}
                >
                  TokVault Secure · 256-bit SSL · PCI DSS Compliant
                </span>
              </div>

              {/* ── Action Buttons ────────────────────────── */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setShowReceipt(false)}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    color: "#94a3b8",
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  <Terminal size={13} /> View Logs
                </button>
                <button
                  onClick={onDone}
                  style={{
                    flex: 2,
                    height: 48,
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg,#25F4EE,#0ea5e9)",
                    color: "#000",
                    fontSize: 11,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: 3,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    boxShadow: "0 6px 24px rgba(37,244,238,0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(37,244,238,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow =
                      "0 6px 24px rgba(37,244,238,0.3)";
                  }}
                >
                  <RotateCcw size={13} /> New Migration
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── TERMINAL VIEW ────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes termIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes termOverlayIn { from{opacity:0} to{opacity:1} }
        @keyframes successGlow { 0%,100%{text-shadow:0 0 10px #25F4EE} 50%{text-shadow:0 0 30px #25F4EE,0 0 60px #FE2C55} }
        @keyframes blinkCursor { 0%,100%{opacity:1} 50%{opacity:0} }
        .term-line { animation: termIn 0.25s ease forwards; }
        .term-overlay { animation: termOverlayIn 0.4s ease forwards; }
      `}</style>

      <div
        className="term-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(3,7,18,0.97)",
          backdropFilter: "blur(24px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 760,
            background: "linear-gradient(160deg,#050810 0%,#080d1a 100%)",
            border: "1px solid rgba(37,244,238,0.15)",
            borderRadius: 24,
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.8),0 0 60px rgba(37,244,238,0.05)",
            overflow: "hidden",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 5 }}>
                {["#FE2C55", "#f59e0b", "#10b981"].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: c,
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "#334155",
                  letterSpacing: 1,
                }}
              >
                rumi-engine@proxy-secure — migration-daemon
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: done ? "#10b981" : "#f59e0b",
                  boxShadow: `0 0 6px ${done ? "#10b981" : "#f59e0b"}`,
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: done ? "#10b981" : "#f59e0b",
                }}
              >
                {done ? "Complete" : "Processing"}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 2, background: "rgba(255,255,255,0.04)" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: done
                  ? "linear-gradient(90deg,#10b981,#25F4EE)"
                  : "linear-gradient(90deg,#FE2C55,#25F4EE)",
                transition: "width 0.6s ease",
                boxShadow: done
                  ? "0 0 10px rgba(37,244,238,0.4)"
                  : "0 0 10px rgba(254,44,85,0.4)",
              }}
            />
          </div>

          {/* Terminal body */}
          <div
            style={{
              height: 360,
              overflowY: "auto",
              padding: "20px 24px",
              fontFamily: "'JetBrains Mono','Courier New',monospace",
              scrollbarWidth: "thin",
              scrollbarColor: "#1e293b #050810",
            }}
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className="term-line"
                style={{ display: "flex", gap: 10, marginBottom: 6 }}
              >
                <span
                  style={{
                    color: colors[line.type],
                    fontSize: 11,
                    opacity: 0.7,
                    minWidth: 30,
                    flexShrink: 0,
                  }}
                >
                  {prefixes[line.type]}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    lineHeight: 1.7,
                    color:
                      line.type === "system"
                        ? "#334155"
                        : line.type === "success"
                          ? "#25F4EE"
                          : line.type === "ok"
                            ? "#94a3b8"
                            : colors[line.type],
                    fontWeight: line.type === "success" ? 900 : 500,
                    letterSpacing: line.type === "success" ? 3 : 0,
                    textTransform:
                      line.type === "success" ? "uppercase" : "none",
                    ...(line.type === "success" && done
                      ? { animation: "successGlow 2s ease-in-out infinite" }
                      : {}),
                  }}
                >
                  {line.text}
                </span>
              </div>
            ))}
            {!done && (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: "#25F4EE", fontSize: 11, minWidth: 30 }}>
                  […]
                </span>
                <span
                  style={{
                    color: "#25F4EE",
                    fontSize: 13,
                    animation: "blinkCursor 1s step-end infinite",
                  }}
                >
                  █
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Footer */}
          {done && (
            <div
              style={{
                padding: "18px 24px",
                borderTop: "1px solid rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 26 }}>{targetRegion?.flag || "🌐"}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>
                    @{username} → {targetRegion?.name}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}
                  >
                    Migration finalized · All systems green
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setShowReceipt(true)}
                  style={{
                    padding: "11px 20px",
                    borderRadius: 11,
                    border: "1px solid rgba(37,244,238,0.25)",
                    background: "rgba(37,244,238,0.06)",
                    color: "#25F4EE",
                    fontSize: 11,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(37,244,238,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(37,244,238,0.06)";
                  }}
                >
                  <FileText size={13} /> View Receipt
                </button>
                <button
                  onClick={onDone}
                  style={{
                    padding: "11px 20px",
                    borderRadius: 11,
                    border: "none",
                    background: "linear-gradient(135deg,#25F4EE,#0ea5e9)",
                    color: "#000",
                    fontSize: 11,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    boxShadow: "0 6px 24px rgba(37,244,238,0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <RotateCcw size={13} /> New Migration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
