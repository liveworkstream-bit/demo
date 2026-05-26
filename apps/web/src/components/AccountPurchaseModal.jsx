import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  CreditCard as CardIcon,
  Zap,
  Globe,
  ArrowRight,
  Users,
  Heart,
  Video,
  Star,
  Clock,
  TrendingUp,
  Eye,
  Mail,
  Phone,
  User,
  FileText,
  RotateCcw,
  Terminal,
  Info,
  ChevronRight,
  Badge,
  AlertCircle,
  Verified,
} from "lucide-react";
import CreditCard from "./CreditCard";
import playSound from "../utils/sounds";

function fmt(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function formatCardNumber(val) {
  return val
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}
function formatExpiry(val) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

const STEPS = [
  { id: 1, label: "Account Review" },
  { id: 2, label: "Requirements" },
  { id: 3, label: "Your Details" },
  { id: 4, label: "Payment" },
  { id: 5, label: "Transfer" },
];

function StepBar({ current }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        padding: "20px 28px 0",
      }}
    >
      {STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <React.Fragment key={s.id}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: active ? 34 : 26,
                  height: active ? 34 : 26,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: done
                    ? "#10b981"
                    : active
                      ? "linear-gradient(135deg,#FE2C55,#25F4EE)"
                      : "rgba(255,255,255,0.06)",
                  border: done
                    ? "2px solid #10b981"
                    : active
                      ? "none"
                      : "2px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
                  boxShadow: active ? "0 0 20px rgba(37,244,238,0.35)" : "none",
                  fontSize: 11,
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                {done ? <CheckCircle2 size={13} /> : s.id}
              </div>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: active ? "#25F4EE" : done ? "#10b981" : "#334155",
                  whiteSpace: "nowrap",
                  position: "absolute",
                  top: "100%",
                  marginTop: 6,
                }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  margin: "0 4px",
                  background: done
                    ? "linear-gradient(90deg,#10b981,rgba(16,185,129,0.3))"
                    : "rgba(255,255,255,0.06)",
                  transition: "background 0.5s",
                  marginBottom: 14,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Transfer Terminal ─────────────────────────────────────────────────────────
function TransferTerminal({ account, buyerInfo, orderId, totalPaid, onDone }) {
  const [lines, setLines] = useState([]);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const bottomRef = useRef(null);
  const nodeRef = useRef(Math.floor(Math.random() * 90 + 10));
  const completedAt = useRef(new Date());

  const script = [
    {
      delay: 0,
      type: "system",
      text: "TOKVAULT TRANSFER ENGINE v3.1.0 — INITIALIZING...",
    },
    {
      delay: 500,
      type: "info",
      text: `Order #TR-${String(orderId || "00000").padStart(5, "0")} · $${parseFloat(totalPaid || 0).toFixed(2)} cleared`,
    },
    {
      delay: 1000,
      type: "cyan",
      text: `Target account → @${account.username} · ${account.region}`,
    },
    {
      delay: 1600,
      type: "cyan",
      text: `Buyer email → ${buyerInfo.email || "***@***.com"}`,
    },
    {
      delay: 2200,
      type: "warn",
      text: "Establishing secure session with TikTok auth servers...",
    },
    {
      delay: 3000,
      type: "ok",
      text: "TikTok auth API connected · Session token issued",
    },
    {
      delay: 3600,
      type: "warn",
      text: `Authenticating @${account.username} · Fetching account session...`,
    },
    {
      delay: 4400,
      type: "ok",
      text: "Account session authenticated · Access level: FULL CONTROL",
    },
    {
      delay: 5000,
      type: "warn",
      text: "Scanning linked devices & active sessions...",
    },
    {
      delay: 5800,
      type: "ok",
      text: `Found ${Math.floor(Math.random() * 3) + 1} active devices · Preparing to terminate sessions`,
    },
    {
      delay: 6400,
      type: "warn",
      text: "Terminating all seller device sessions...",
    },
    {
      delay: 7200,
      type: "ok",
      text: "All seller sessions revoked · Device history cleared",
    },
    {
      delay: 7800,
      type: "warn",
      text: "Removing linked phone number from account...",
    },
    {
      delay: 8600,
      type: "ok",
      text: "Phone number detached · SIM binding removed",
    },
    {
      delay: 9200,
      type: "warn",
      text: `Updating registered email → ${buyerInfo.email || "buyer@***.com"}...`,
    },
    {
      delay: 10100,
      type: "ok",
      text: "Email updated · Verification link dispatched to buyer",
    },
    {
      delay: 10700,
      type: "warn",
      text: "Generating new secure password & 2FA seed...",
    },
    {
      delay: 11500,
      type: "ok",
      text: "Credentials rotated · 2FA codes invalidated for seller",
    },
    {
      delay: 12100,
      type: "warn",
      text: `Linking buyer phone → ${buyerInfo.phone ? buyerInfo.phone.replace(/\d(?=\d{4})/g, "*") : "+***-***-**00"}...`,
    },
    {
      delay: 12900,
      type: "ok",
      text: "Buyer phone bound · OTP recovery enabled",
    },
    {
      delay: 13500,
      type: "warn",
      text: "Running post-transfer security audit...",
    },
    {
      delay: 14300,
      type: "ok",
      text: `Security score: 98/100 · Account clean · No flags`,
    },
    {
      delay: 14900,
      type: "warn",
      text: "Packaging account credentials for secure delivery...",
    },
    {
      delay: 15700,
      type: "ok",
      text: `Encrypted credentials dispatched → ${buyerInfo.email || "buyer email"}`,
    },
    {
      delay: 16300,
      type: "warn",
      text: "Updating TokVault ownership registry...",
    },
    {
      delay: 17100,
      type: "ok",
      text: `Registry updated · @${account.username} → ${buyerInfo.name || "Buyer"}`,
    },
    {
      delay: 17700,
      type: "system",
      text: "────────────────────────────────────────────────────────────",
    },
    { delay: 18200, type: "success", text: "✦  ACCOUNT TRANSFER COMPLETE  ✦" },
    {
      delay: 18700,
      type: "success",
      text: `@${account.username} is now yours · Check your email for login details`,
    },
    {
      delay: 19200,
      type: "system",
      text: "────────────────────────────────────────────────────────────",
    },
  ];

  useEffect(() => {
    script.forEach(({ delay, type, text }) => {
      setTimeout(() => {
        setLines((prev) => [...prev, { type, text }]);
        setProgress(Math.min(100, Math.round((delay / 19200) * 100)));
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, delay);
    });
    setTimeout(() => {
      completedAt.current = new Date();
      setDone(true);
      setProgress(100);
      playSound("success");
    }, 19800);
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

  // ── RECEIPT ───────────────────────────────────────────────────────────────
  if (showReceipt) {
    const total = parseFloat(totalPaid || 0);
    const base = parseFloat(account.price || 0);
    const surcharge = Math.max(0, total - base);
    const rows = [
      {
        k: "Order ID",
        v: `#TR-${String(orderId || "00000").padStart(5, "0")}`,
        mono: true,
        w: true,
      },
      {
        k: "Date",
        v: completedAt.current.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
      {
        k: "Time (UTC)",
        v: completedAt.current.toLocaleTimeString("en-US", { hour12: false }),
        mono: true,
      },
      { k: "Protocol", v: "TokVault Account Transfer v3.1" },
      { div: true },
      { k: "TikTok Handle", v: `@${account.username}`, mono: true, cyan: true },
      { k: "Region", v: `${account.region || ""}` },
      { k: "Niche", v: account.niche || "General" },
      { k: "Followers", v: fmt(account.followers) },
      { k: "Likes", v: fmt(account.likes) },
      { k: "Videos", v: String(account.videos || 0) },
      { div: true },
      { k: "Buyer Name", v: buyerInfo.name || "—" },
      { k: "Delivery Email", v: buyerInfo.email || "—", cyan: true },
      { k: "WhatsApp", v: buyerInfo.phone || "—" },
      { div: true },
      { k: "Account Price", v: `$${base.toFixed(2)}`, w: true },
      ...(surcharge > 0
        ? [{ k: "Bank Surcharge", v: `+$${surcharge.toFixed(2)}`, red: true }]
        : []),
    ];

    return (
      <>
        <style>{`
          @keyframes rcIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
          @keyframes scanRC { 0%{top:0;opacity:0.6} 100%{top:100%;opacity:0} }
          .rc-card { animation: rcIn 0.45s cubic-bezier(0.23,1,0.32,1) forwards; }
        `}</style>
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10001,
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
            className="rc-card"
            style={{
              width: "100%",
              maxWidth: 560,
              margin: "auto",
              background: "linear-gradient(160deg,#050810 0%,#080d1a 100%)",
              border: "1px solid rgba(16,185,129,0.22)",
              borderRadius: 24,
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.8),0 0 50px rgba(16,185,129,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background:
                  "linear-gradient(135deg,rgba(16,185,129,0.09),rgba(37,244,238,0.04))",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                padding: "30px 32px",
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
                    animation: "scanRC 2.5s ease-in-out infinite",
                  }}
                />
              </div>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(16,185,129,0.1)",
                  border: "2px solid rgba(16,185,129,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 0 40px rgba(16,185,129,0.2)",
                }}
              >
                <CheckCircle2 size={28} color="#10b981" />
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
                Transfer Receipt
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#fff",
                  marginBottom: 6,
                }}
              >
                Account Delivered!
              </div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                @{account.username} has been successfully transferred.
                <br />
                <span style={{ color: "#10b981" }}>
                  Check your email for login credentials.
                </span>
              </div>
              {account.profile_image && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 16,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 50,
                    padding: "6px 16px 6px 6px",
                  }}
                >
                  <img
                    src={account.profile_image}
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
                    @{account.username}
                  </span>
                </div>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: "22px 32px" }}>
              {rows.map((row, i) => {
                if (row.div)
                  return (
                    <div
                      key={i}
                      style={{
                        height: 1,
                        background: "rgba(255,255,255,0.07)",
                        margin: "10px 0",
                      }}
                    />
                  );
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
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
                      {row.k}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        textAlign: "right",
                        maxWidth: "60%",
                        fontFamily: row.mono ? "monospace" : "inherit",
                        color: row.red
                          ? "#FE2C55"
                          : row.cyan
                            ? "#25F4EE"
                            : row.w
                              ? "#fff"
                              : "#94a3b8",
                      }}
                    >
                      {row.v}
                    </span>
                  </div>
                );
              })}

              {/* Total */}
              <div
                style={{
                  marginTop: 16,
                  background: "rgba(16,185,129,0.05)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 16,
                  padding: "16px 20px",
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
                    Total Paid
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                    Non-refundable · Transfer complete
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 28,
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

              {/* Notice */}
              <div
                style={{
                  marginTop: 14,
                  background: "rgba(37,244,238,0.04)",
                  border: "1px solid rgba(37,244,238,0.12)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <Mail
                  size={14}
                  color="#25F4EE"
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <div
                  style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}
                >
                  Account credentials have been sent to{" "}
                  <span style={{ color: "#25F4EE", fontWeight: 700 }}>
                    {buyerInfo.email}
                  </span>
                  . Please check your inbox & spam folder. Delivery may take up
                  to 15 minutes.
                </div>
              </div>

              <div
                style={{
                  height: 1,
                  margin: "18px 0 12px",
                  background:
                    "repeating-linear-gradient(90deg,rgba(255,255,255,0.07) 0,rgba(255,255,255,0.07) 6px,transparent 6px,transparent 12px)",
                }}
              />
              <div style={{ textAlign: "center", marginBottom: 18 }}>
                <span
                  style={{
                    fontSize: 9,
                    color: "#1e293b",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 3,
                  }}
                >
                  TokVault Secure · 256-bit SSL · Account Escrow Protected
                </span>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setShowReceipt(false)}
                  style={{
                    flex: 1,
                    height: 46,
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
                    height: 46,
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
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <RotateCcw size={13} /> Back to Market
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── TERMINAL ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes tIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tOvIn { from{opacity:0} to{opacity:1} }
        @keyframes sGlow { 0%,100%{text-shadow:0 0 10px #25F4EE} 50%{text-shadow:0 0 30px #25F4EE,0 0 60px #FE2C55} }
        @keyframes tBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        .t-line { animation: tIn 0.25s ease forwards; }
        .t-overlay { animation: tOvIn 0.4s ease forwards; }
      `}</style>
      <div
        className="t-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10001,
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
            maxWidth: 800,
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
                tokvault-transfer@escrow — account-delivery-daemon
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
                {done ? "Transfer Complete" : "Processing"}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div style={{ height: 3, background: "rgba(255,255,255,0.04)" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: done
                  ? "linear-gradient(90deg,#10b981,#25F4EE)"
                  : "linear-gradient(90deg,#FE2C55,#25F4EE)",
                transition: "width 0.8s ease",
                boxShadow: "0 0 12px rgba(37,244,238,0.4)",
              }}
            />
          </div>

          {/* Progress label */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 20px",
              background: "rgba(0,0,0,0.2)",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "#334155",
                fontFamily: "monospace",
              }}
            >
              Transfer Progress
            </span>
            <span
              style={{
                fontSize: 10,
                color: progress === 100 ? "#10b981" : "#25F4EE",
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              {progress}%
            </span>
          </div>

          {/* Terminal body */}
          <div
            style={{
              height: 340,
              overflowY: "auto",
              padding: "16px 24px",
              fontFamily: "'JetBrains Mono','Courier New',monospace",
              scrollbarWidth: "thin",
              scrollbarColor: "#1e293b #050810",
            }}
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className="t-line"
                style={{ display: "flex", gap: 10, marginBottom: 5 }}
              >
                <span
                  style={{
                    color: colors[line.type],
                    fontSize: 10,
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
                      ? { animation: "sGlow 2s ease-in-out infinite" }
                      : {}),
                  }}
                >
                  {line.text}
                </span>
              </div>
            ))}
            {!done && (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: "#25F4EE", fontSize: 10, minWidth: 30 }}>
                  […]
                </span>
                <span
                  style={{
                    color: "#25F4EE",
                    fontSize: 13,
                    animation: "tBlink 1s step-end infinite",
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
                {account.profile_image ? (
                  <img
                    src={account.profile_image}
                    alt=""
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(16,185,129,0.4)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#FE2C55,#25F4EE)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 900,
                      color: "#fff",
                    }}
                  >
                    {(account.username || "?").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>
                    @{account.username} → {buyerInfo.name || "You"}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}
                  >
                    Transfer complete · Credentials sent to {buyerInfo.email}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setShowReceipt(true)}
                  style={{
                    padding: "10px 18px",
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
                    padding: "10px 18px",
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
                  <RotateCcw size={13} /> Marketplace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function AccountPurchaseModal({
  isOpen,
  onClose,
  account,
  onComplete,
}) {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [surcharges, setSurcharges] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [loadingStep, setLoadingStep] = useState(0);
  const [transferData, setTransferData] = useState(null);
  const errorRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setAgreed(false);
        setError(null);
        setSurcharges(0);
        setCurrentAttempt(1);
        setTransferData(null);
        setLoadingStep(0);
        setCardData({ number: "", name: "", expiry: "", cvv: "" });
        setBuyerInfo({ name: "", email: "", phone: "", country: "" });
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (error && errorRef.current)
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  if (!isOpen || !account) return null;

  const basePrice = parseFloat(account.price || 0);
  const totalAmount = basePrice + surcharges;
  const engRate =
    account.followers > 0
      ? (
          ((account.likes || 0) / (account.videos || 1) / account.followers) *
          100
        ).toFixed(2)
      : "0.00";

  const simulateLoading = async () => {
    const msgs = [
      "Encrypting card data...",
      "Connecting to secure gateway...",
      "Verifying with bank...",
    ];
    for (let i = 0; i < msgs.length; i++) {
      setLoadingStep(i);
      await new Promise((r) => setTimeout(r, 750));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLoadingStep(0);
    playSound("beep");
    simulateLoading();
    try {
      const res = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_type: "account",
          item_id: account.id,
          base_price: basePrice,
          current_attempt: currentAttempt,
          card_details: cardData,
          tax_paid: surcharges,
        }),
      });
      const result = await res.json();
      if (result.success) {
        playSound("success");
        setTransferData({
          orderId: result.order?.id,
          totalPaid: result.order?.total_paid,
        });
        setStep(5);
        if (onComplete) onComplete(result.order);
      } else {
        playSound("error");
        setError(result.error_msg);
        setSurcharges((prev) => prev + parseFloat(result.surcharge || 0));
        setCurrentAttempt(result.next_attempt);
      }
    } catch {
      setError("Network error. Please retry.");
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const loadingMsgs = [
    "Encrypting card data...",
    "Connecting to secure gateway...",
    "Verifying with bank...",
  ];

  // ── Step 5: Transfer Terminal ─────────────────────────────────────────────
  if (step === 5 && transferData) {
    return (
      <TransferTerminal
        account={account}
        buyerInfo={buyerInfo}
        orderId={transferData.orderId}
        totalPaid={transferData.totalPaid}
        onDone={() => {
          onClose();
        }}
      />
    );
  }

  return (
    <>
      <style>{`
        @keyframes apm-in { from{opacity:0;transform:scale(0.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes apm-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .apm-modal { animation: apm-in 0.4s cubic-bezier(0.23,1,0.32,1) forwards; }
        .apm-shake { animation: apm-shake 0.45s ease; }
        .apm-input {
          width:100%; background:rgba(30,41,59,0.5); border:1.5px solid rgba(255,255,255,0.07);
          border-radius:12px; padding:13px 16px; color:#fff; font-size:14px; font-weight:600;
          outline:none; transition:border-color 0.2s,box-shadow 0.2s,background 0.2s; box-sizing:border-box;
        }
        .apm-input:focus { border-color:rgba(37,244,238,0.5); background:rgba(37,244,238,0.03); box-shadow:0 0 0 3px rgba(37,244,238,0.08); }
        .apm-input::placeholder { color:#334155; }
        .apm-label { display:block; font-size:10px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:2px; margin-bottom:7px; }
        .apm-check-box { width:20px; height:20px; border-radius:6px; border:2px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.03); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; flex-shrink:0; }
        .apm-check-box.checked { background:linear-gradient(135deg,#25F4EE,#0ea5e9); border-color:#25F4EE; }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(3,7,20,0.93)",
            backdropFilter: "blur(20px)",
          }}
        />

        {/* Modal */}
        <div
          className="apm-modal"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 940,
            maxHeight: "94vh",
            overflowY: "auto",
            background:
              "linear-gradient(160deg,#0a0f1e 0%,#090d17 60%,#0c1120 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 28,
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Ambient */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 300,
              height: 300,
              background:
                "radial-gradient(circle,rgba(37,244,238,0.06) 0%,transparent 70%)",
              pointerEvents: "none",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              left: -60,
              width: 250,
              height: 250,
              background:
                "radial-gradient(circle,rgba(254,44,85,0.05) 0%,transparent 70%)",
              pointerEvents: "none",
              borderRadius: "50%",
            }}
          />

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 10,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748b",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
          >
            <X size={16} />
          </button>

          {/* Step bar */}
          <StepBar current={step} />

          <div style={{ height: 40 }} />

          <div
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {/* ── LEFT SIDEBAR ────────────────────────────────────────── */}
            <div
              style={{
                width: "clamp(240px,34%,280px)",
                minWidth: 240,
                flexShrink: 0,
                background:
                  "linear-gradient(160deg,rgba(37,244,238,0.04) 0%,rgba(254,44,85,0.03) 100%)",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                padding: "24px 24px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Account mini card */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 18,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: 56,
                    background: "linear-gradient(135deg,#1a0826,#0a1a2e)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0.15,
                      backgroundImage:
                        "radial-gradient(rgba(37,244,238,0.6) 1px,transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                </div>
                <div style={{ padding: "0 16px 16px", position: "relative" }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      border: "3px solid #0a0f1e",
                      position: "absolute",
                      top: -26,
                      left: 16,
                      overflow: "hidden",
                      background: "linear-gradient(135deg,#FE2C55,#25F4EE)",
                    }}
                  >
                    {account.profile_image ? (
                      <img
                        src={account.profile_image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          fontWeight: 900,
                          color: "#fff",
                        }}
                      >
                        {(account.username || "?").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div style={{ paddingTop: 32 }}>
                    <div
                      style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}
                    >
                      @{account.username}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#25F4EE", marginTop: 2 }}
                    >
                      {account.region || "Unknown Region"}
                    </div>
                    {account.niche && (
                      <div
                        style={{
                          display: "inline-block",
                          marginTop: 6,
                          background: "rgba(139,92,246,0.12)",
                          border: "1px solid rgba(139,92,246,0.2)",
                          borderRadius: 6,
                          padding: "2px 8px",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#a78bfa",
                        }}
                      >
                        {account.niche}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  {
                    icon: Users,
                    label: "Followers",
                    val: fmt(account.followers),
                    color: "#25F4EE",
                  },
                  {
                    icon: Heart,
                    label: "Total Likes",
                    val: fmt(account.likes),
                    color: "#FE2C55",
                  },
                  {
                    icon: Video,
                    label: "Videos",
                    val: String(account.videos || 0),
                    color: "#8b5cf6",
                  },
                  {
                    icon: TrendingUp,
                    label: "Avg Eng. Rate",
                    val: `${engRate}%`,
                    color: "#10b981",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <s.icon size={13} color={s.color} />
                      <span
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          fontWeight: 600,
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                    <span
                      style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}
                    >
                      {s.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div
                style={{
                  background: "rgba(37,244,238,0.04)",
                  border: "1px solid rgba(37,244,238,0.12)",
                  borderRadius: 14,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    marginBottom: 4,
                  }}
                >
                  Acquisition Price
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  ${basePrice.toFixed(2)}
                </div>
                {surcharges > 0 && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#FE2C55",
                      fontWeight: 700,
                      marginTop: 4,
                    }}
                  >
                    + ${surcharges.toFixed(2)} surcharge
                  </div>
                )}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: "#25F4EE",
                    marginTop: 6,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    paddingTop: 8,
                  }}
                >
                  Total: ${totalAmount.toFixed(2)} USD
                </div>
              </div>

              {/* Security */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                  paddingTop: 4,
                }}
              >
                {[
                  [Lock, "256-bit SSL Encrypted"],
                  [ShieldCheck, "Escrow Protected"],
                  [Globe, "Verified Seller Account"],
                ].map(([Icon, label]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      opacity: 0.55,
                    }}
                  >
                    <Icon size={12} color="#25F4EE" />
                    <span
                      style={{
                        fontSize: 10,
                        color: "#94a3b8",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT CONTENT ──────────────────────────────────────── */}
            <div
              style={{
                flex: 1,
                minWidth: 300,
                padding: "24px 32px 36px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {/* ── STEP 1: Account Review ─────────────────────────── */}
              {step === 1 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#25F4EE",
                        textTransform: "uppercase",
                        letterSpacing: 3,
                        marginBottom: 6,
                      }}
                    >
                      Step 1 — Account Review
                    </div>
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#fff",
                        margin: "0 0 4px",
                      }}
                    >
                      Review Before You Buy
                    </h3>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                      Carefully review all account details. This is a final sale
                      — no refunds once transfer begins.
                    </p>
                  </div>

                  {/* Detailed stats grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    {[
                      {
                        label: "Followers",
                        val: fmt(account.followers),
                        sub: "Total audience",
                        color: "#25F4EE",
                        icon: Users,
                      },
                      {
                        label: "Total Likes",
                        val: fmt(account.likes),
                        sub: "All-time hearts",
                        color: "#FE2C55",
                        icon: Heart,
                      },
                      {
                        label: "Videos Posted",
                        val: String(account.videos || 0),
                        sub: "Content library",
                        color: "#8b5cf6",
                        icon: Video,
                      },
                      {
                        label: "Engagement",
                        val: `${engRate}%`,
                        sub: "Avg per video",
                        color: "#10b981",
                        icon: TrendingUp,
                      },
                      {
                        label: "Account Region",
                        val: account.region || "—",
                        sub: account.region_code || "",
                        color: "#f59e0b",
                        icon: Globe,
                      },
                      {
                        label: "Account Age",
                        val: account.age || "N/A",
                        sub: "Years active",
                        color: "#06b6d4",
                        icon: Clock,
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: 14,
                          padding: "14px 16px",
                          display: "flex",
                          gap: 12,
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: `${s.color}12`,
                            border: `1px solid ${s.color}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <s.icon size={16} color={s.color} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 900,
                              color: "#fff",
                              lineHeight: 1.2,
                            }}
                          >
                            {s.val}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: "#64748b",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: 1,
                              marginTop: 3,
                            }}
                          >
                            {s.label}
                          </div>
                          {s.sub && (
                            <div
                              style={{
                                fontSize: 10,
                                color: "#334155",
                                marginTop: 2,
                              }}
                            >
                              {s.sub}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* What's included */}
                  <div
                    style={{
                      background: "rgba(16,185,129,0.04)",
                      border: "1px solid rgba(16,185,129,0.14)",
                      borderRadius: 16,
                      padding: "18px 20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#10b981",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: 14,
                      }}
                    >
                      ✓ What's Included in This Transfer
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                      }}
                    >
                      {[
                        "Full account ownership",
                        "Email & password change",
                        "All existing followers",
                        "Content library (all videos)",
                        "Phone number detachment",
                        "Seller session termination",
                        "2FA reset for buyer",
                        "Encrypted credential delivery",
                      ].map((item) => (
                        <div
                          key={item}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <CheckCircle2
                            size={12}
                            color="#10b981"
                            style={{ flexShrink: 0 }}
                          />
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk notice */}
                  <div
                    style={{
                      background: "rgba(245,158,11,0.04)",
                      border: "1px solid rgba(245,158,11,0.14)",
                      borderRadius: 14,
                      padding: "14px 18px",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <AlertTriangle
                      size={16}
                      color="#f59e0b"
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    <div
                      style={{
                        fontSize: 12,
                        color: "#94a3b8",
                        lineHeight: 1.6,
                      }}
                    >
                      <span style={{ color: "#f59e0b", fontWeight: 800 }}>
                        Important:{" "}
                      </span>
                      TikTok accounts are tied to a region. Using this account
                      in a different country may trigger TikTok's security
                      system. We recommend using a VPN matching the account's
                      region for 30 days post-transfer.
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    style={{
                      width: "100%",
                      height: 52,
                      borderRadius: 14,
                      border: "none",
                      background:
                        "linear-gradient(135deg,#FE2C55 0%,#c0006d 40%,#25F4EE 100%)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: 3,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      boxShadow: "0 8px 28px rgba(254,44,85,0.3)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    I've Reviewed — Continue <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* ── STEP 2: Requirements ────────────────────────────── */}
              {step === 2 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#25F4EE",
                        textTransform: "uppercase",
                        letterSpacing: 3,
                        marginBottom: 6,
                      }}
                    >
                      Step 2 — Requirements
                    </div>
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#fff",
                        margin: "0 0 4px",
                      }}
                    >
                      Before We Proceed
                    </h3>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                      You must meet all requirements below to complete this
                      purchase safely.
                    </p>
                  </div>

                  {/* Requirements checklist */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {[
                      {
                        icon: Mail,
                        title: "Valid Email Address",
                        desc: "You need an email address to receive the transferred account credentials. Must not be linked to any existing TikTok account.",
                        color: "#25F4EE",
                        req: true,
                      },
                      {
                        icon: Phone,
                        title: "Active Phone Number",
                        desc: "A phone number for 2FA binding. This will be linked to the account as the new recovery number after transfer.",
                        color: "#10b981",
                        req: true,
                      },
                      {
                        icon: Globe,
                        title: "VPN (Recommended)",
                        desc:
                          "For best results, use a VPN with a server in the account's region (" +
                          (account.region || "seller's country") +
                          ") for the first 30 days to avoid security flags.",
                        color: "#f59e0b",
                        req: false,
                      },
                      {
                        icon: ShieldCheck,
                        title: "You Are 18+ Years Old",
                        desc: "You must be at least 18 years old to purchase and own a TikTok account through TokVault.",
                        color: "#8b5cf6",
                        req: true,
                      },
                      {
                        icon: AlertCircle,
                        title: "No Chargebacks Policy",
                        desc: "By proceeding you agree that all sales are final. Filing a chargeback will result in account recovery and legal action.",
                        color: "#FE2C55",
                        req: true,
                      },
                    ].map((r, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 14,
                          alignItems: "flex-start",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: 14,
                          padding: "14px 16px",
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 11,
                            background: `${r.color}12`,
                            border: `1px solid ${r.color}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <r.icon size={17} color={r.color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 4,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 800,
                                color: "#fff",
                              }}
                            >
                              {r.title}
                            </span>
                            {r.req ? (
                              <span
                                style={{
                                  fontSize: 9,
                                  fontWeight: 800,
                                  color: "#FE2C55",
                                  background: "rgba(254,44,85,0.1)",
                                  border: "1px solid rgba(254,44,85,0.2)",
                                  borderRadius: 4,
                                  padding: "1px 6px",
                                  textTransform: "uppercase",
                                  letterSpacing: 1,
                                }}
                              >
                                Required
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: 9,
                                  fontWeight: 800,
                                  color: "#f59e0b",
                                  background: "rgba(245,158,11,0.1)",
                                  border: "1px solid rgba(245,158,11,0.2)",
                                  borderRadius: 4,
                                  padding: "1px 6px",
                                  textTransform: "uppercase",
                                  letterSpacing: 1,
                                }}
                              >
                                Recommended
                              </span>
                            )}
                          </div>
                          <p
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              margin: 0,
                              lineHeight: 1.6,
                            }}
                          >
                            {r.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Agreement checkbox */}
                  <div
                    onClick={() => setAgreed(!agreed)}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      cursor: "pointer",
                      background: agreed
                        ? "rgba(37,244,238,0.04)"
                        : "rgba(255,255,255,0.02)",
                      border: `1px solid ${agreed ? "rgba(37,244,238,0.2)" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 14,
                      padding: "14px 16px",
                      transition: "all 0.2s",
                    }}
                  >
                    <div className={`apm-check-box ${agreed ? "checked" : ""}`}>
                      {agreed && <CheckCircle2 size={12} color="#000" />}
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#94a3b8",
                        margin: 0,
                        lineHeight: 1.7,
                        userSelect: "none",
                      }}
                    >
                      I confirm I meet all the requirements above. I understand
                      this is a{" "}
                      <span style={{ color: "#FE2C55", fontWeight: 700 }}>
                        final, non-refundable
                      </span>{" "}
                      purchase and agree to the TokVault Terms of Sale and
                      No-Chargeback Policy.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => setStep(1)}
                      style={{
                        flex: 1,
                        height: 50,
                        borderRadius: 13,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.03)",
                        color: "#94a3b8",
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        if (agreed) setStep(3);
                      }}
                      disabled={!agreed}
                      style={{
                        flex: 2,
                        height: 50,
                        borderRadius: 13,
                        border: "none",
                        background: !agreed
                          ? "rgba(255,255,255,0.05)"
                          : "linear-gradient(135deg,#FE2C55,#25F4EE)",
                        color: !agreed ? "#334155" : "#fff",
                        fontSize: 11,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: 3,
                        cursor: !agreed ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        transition: "all 0.2s",
                        boxShadow: !agreed
                          ? "none"
                          : "0 6px 24px rgba(254,44,85,0.25)",
                      }}
                    >
                      Accept & Continue <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Buyer Details ────────────────────────────── */}
              {step === 3 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#25F4EE",
                        textTransform: "uppercase",
                        letterSpacing: 3,
                        marginBottom: 6,
                      }}
                    >
                      Step 3 — Your Details
                    </div>
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#fff",
                        margin: "0 0 4px",
                      }}
                    >
                      Delivery Information
                    </h3>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                      Account credentials will be delivered to the email below
                      after transfer completes.
                    </p>
                  </div>

                  <div
                    style={{
                      background: "rgba(37,244,238,0.04)",
                      border: "1px solid rgba(37,244,238,0.1)",
                      borderRadius: 14,
                      padding: "12px 16px",
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Mail size={14} color="#25F4EE" />
                    <span
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        lineHeight: 1.5,
                      }}
                    >
                      Your login credentials for{" "}
                      <strong style={{ color: "#fff" }}>
                        @{account.username}
                      </strong>{" "}
                      will be sent to your email after the transfer is
                      processed.
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div>
                      <label className="apm-label">Full Name</label>
                      <div style={{ position: "relative" }}>
                        <User
                          size={15}
                          color="#334155"
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                          }}
                        />
                        <input
                          className="apm-input"
                          type="text"
                          placeholder="John Doe"
                          value={buyerInfo.name}
                          onChange={(e) =>
                            setBuyerInfo({ ...buyerInfo, name: e.target.value })
                          }
                          style={{ paddingLeft: 42 }}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="apm-label">
                        Email Address{" "}
                        <span style={{ color: "#FE2C55" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Mail
                          size={15}
                          color="#334155"
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                          }}
                        />
                        <input
                          className="apm-input"
                          type="email"
                          placeholder="your@email.com"
                          value={buyerInfo.email}
                          onChange={(e) =>
                            setBuyerInfo({
                              ...buyerInfo,
                              email: e.target.value,
                            })
                          }
                          style={{ paddingLeft: 42 }}
                          required
                        />
                      </div>
                      <div
                        style={{ fontSize: 10, color: "#334155", marginTop: 5 }}
                      >
                        ⚠ Make sure this email is NOT linked to any existing
                        TikTok account
                      </div>
                    </div>
                    <div>
                      <label className="apm-label">
                        WhatsApp / Phone Number{" "}
                        <span style={{ color: "#FE2C55" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Phone
                          size={15}
                          color="#334155"
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                          }}
                        />
                        <input
                          className="apm-input"
                          type="tel"
                          placeholder="+1 234 567 8900"
                          value={buyerInfo.phone}
                          onChange={(e) =>
                            setBuyerInfo({
                              ...buyerInfo,
                              phone: e.target.value,
                            })
                          }
                          style={{ paddingLeft: 42 }}
                          required
                        />
                      </div>
                      <div
                        style={{ fontSize: 10, color: "#334155", marginTop: 5 }}
                      >
                        Will be linked as new 2FA recovery number
                      </div>
                    </div>
                    <div>
                      <label className="apm-label">Your Country</label>
                      <div style={{ position: "relative" }}>
                        <Globe
                          size={15}
                          color="#334155"
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                          }}
                        />
                        <input
                          className="apm-input"
                          type="text"
                          placeholder="United States"
                          value={buyerInfo.country}
                          onChange={(e) =>
                            setBuyerInfo({
                              ...buyerInfo,
                              country: e.target.value,
                            })
                          }
                          style={{ paddingLeft: 42 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => setStep(2)}
                      style={{
                        flex: 1,
                        height: 50,
                        borderRadius: 13,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.03)",
                        color: "#94a3b8",
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        if (buyerInfo.email && buyerInfo.phone) setStep(4);
                      }}
                      disabled={!buyerInfo.email || !buyerInfo.phone}
                      style={{
                        flex: 2,
                        height: 50,
                        borderRadius: 13,
                        border: "none",
                        background:
                          !buyerInfo.email || !buyerInfo.phone
                            ? "rgba(255,255,255,0.05)"
                            : "linear-gradient(135deg,#FE2C55,#25F4EE)",
                        color:
                          !buyerInfo.email || !buyerInfo.phone
                            ? "#334155"
                            : "#fff",
                        fontSize: 11,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: 3,
                        cursor:
                          !buyerInfo.email || !buyerInfo.phone
                            ? "not-allowed"
                            : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        transition: "all 0.2s",
                        boxShadow:
                          !buyerInfo.email || !buyerInfo.phone
                            ? "none"
                            : "0 6px 24px rgba(254,44,85,0.25)",
                      }}
                    >
                      Proceed to Payment <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Payment ─────────────────────────────────── */}
              {step === 4 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#25F4EE",
                        textTransform: "uppercase",
                        letterSpacing: 3,
                        marginBottom: 6,
                      }}
                    >
                      Step 4 — Secure Payment
                    </div>
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#fff",
                        margin: "0 0 4px",
                      }}
                    >
                      Authorize Payment
                    </h3>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                      Your card details are encrypted and never stored. Payment
                      is held in escrow until transfer completes.
                    </p>
                  </div>

                  {/* Delivery summary */}
                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 14,
                      padding: "12px 16px",
                      display: "flex",
                      gap: 14,
                      alignItems: "center",
                    }}
                  >
                    <CheckCircle2
                      size={16}
                      color="#10b981"
                      style={{ flexShrink: 0 }}
                    />
                    <div>
                      <div
                        style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}
                      >
                        Delivery to: {buyerInfo.email}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>
                        After payment clears, account transfer begins
                        automatically
                      </div>
                    </div>
                  </div>

                  {/* Card visual */}
                  <div
                    style={{ maxWidth: 340, margin: "0 auto", width: "100%" }}
                  >
                    <CreditCard {...cardData} focused={focused} />
                  </div>

                  {/* Error */}
                  {error && (
                    <div
                      ref={errorRef}
                      className="apm-shake"
                      key={error}
                      style={{
                        background: "rgba(254,44,85,0.07)",
                        border: "1px solid rgba(254,44,85,0.3)",
                        borderRadius: 14,
                        padding: "14px 18px",
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <AlertTriangle
                        size={18}
                        color="#FE2C55"
                        style={{ flexShrink: 0 }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: "#FE2C55",
                            textTransform: "uppercase",
                            letterSpacing: 2,
                            marginBottom: 4,
                          }}
                        >
                          Bank Declined — Attempt {currentAttempt - 1}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#fda4af",
                            lineHeight: 1.5,
                          }}
                        >
                          {error}
                        </div>
                        {surcharges > 0 && (
                          <div
                            style={{
                              marginTop: 6,
                              fontSize: 11,
                              color: "#64748b",
                            }}
                          >
                            Surcharge applied:{" "}
                            <span style={{ color: "#FE2C55", fontWeight: 700 }}>
                              +${surcharges.toFixed(2)}
                            </span>{" "}
                            — retry with updated card details.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <form
                    onSubmit={handlePayment}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div>
                      <label className="apm-label">Card Number</label>
                      <div style={{ position: "relative" }}>
                        <input
                          className="apm-input"
                          type="text"
                          inputMode="numeric"
                          placeholder="0000  0000  0000  0000"
                          maxLength={19}
                          value={formatCardNumber(cardData.number)}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              number: e.target.value.replace(/\s/g, ""),
                            })
                          }
                          onFocus={() => setFocused("number")}
                          onBlur={() => setFocused("")}
                          style={{
                            fontFamily: "monospace",
                            paddingRight: 48,
                            fontSize: 15,
                          }}
                          required
                        />
                        <CardIcon
                          size={16}
                          color="#334155"
                          style={{
                            position: "absolute",
                            right: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="apm-label">Cardholder Name</label>
                      <input
                        className="apm-input"
                        type="text"
                        placeholder="FIRST LAST"
                        value={cardData.name}
                        onChange={(e) =>
                          setCardData({
                            ...cardData,
                            name: e.target.value.toUpperCase(),
                          })
                        }
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused("")}
                        style={{ textTransform: "uppercase", letterSpacing: 2 }}
                        required
                      />
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <div>
                        <label className="apm-label">Expiry Date</label>
                        <input
                          className="apm-input"
                          type="text"
                          inputMode="numeric"
                          placeholder="MM / YY"
                          maxLength={5}
                          value={cardData.expiry}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              expiry: formatExpiry(e.target.value),
                            })
                          }
                          onFocus={() => setFocused("expiry")}
                          onBlur={() => setFocused("")}
                          style={{ fontFamily: "monospace", letterSpacing: 3 }}
                          required
                        />
                      </div>
                      <div>
                        <label className="apm-label">CVV</label>
                        <input
                          className="apm-input"
                          type="password"
                          inputMode="numeric"
                          placeholder="•••"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              cvv: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          onFocus={() => setFocused("cvv")}
                          onBlur={() => setFocused("")}
                          style={{ fontFamily: "monospace", letterSpacing: 4 }}
                          required
                        />
                      </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                      <div
                        style={{
                          background: "rgba(37,244,238,0.03)",
                          border: "1px solid rgba(37,244,238,0.12)",
                          borderRadius: 12,
                          padding: "12px 16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {loadingMsgs.map((msg, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              opacity: i <= loadingStep ? 1 : 0.2,
                              transition: "opacity 0.4s",
                            }}
                          >
                            {i < loadingStep ? (
                              <CheckCircle2 size={13} color="#10b981" />
                            ) : i === loadingStep ? (
                              <Loader2
                                size={13}
                                color="#25F4EE"
                                style={{ animation: "spin 1s linear infinite" }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 13,
                                  height: 13,
                                  borderRadius: "50%",
                                  border: "1.5px solid rgba(255,255,255,0.1)",
                                }}
                              />
                            )}
                            <span
                              style={{
                                fontSize: 12,
                                color: i <= loadingStep ? "#94a3b8" : "#334155",
                                fontWeight: 600,
                              }}
                            >
                              {msg}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        style={{
                          flex: 1,
                          height: 52,
                          borderRadius: 13,
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(255,255,255,0.03)",
                          color: "#94a3b8",
                          fontSize: 11,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: 2,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          flex: 2,
                          height: 52,
                          borderRadius: 13,
                          border: "none",
                          background: loading
                            ? "rgba(37,244,238,0.1)"
                            : "linear-gradient(135deg,#FE2C55 0%,#c0006d 50%,#25F4EE 100%)",
                          color: loading ? "#25F4EE" : "#fff",
                          fontSize: 12,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: 3,
                          cursor: loading ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          boxShadow: loading
                            ? "none"
                            : "0 8px 30px rgba(254,44,85,0.35)",
                          transition: "all 0.3s",
                        }}
                      >
                        {loading ? (
                          <>
                            <Loader2
                              size={16}
                              style={{ animation: "spin 1s linear infinite" }}
                            />{" "}
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock size={15} /> Pay ${totalAmount.toFixed(2)} &
                            Transfer
                          </>
                        )}
                      </button>
                    </div>

                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: 1,
                          background:
                            "linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 9,
                          color: "#334155",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 2,
                        }}
                      >
                        Escrow Protected · TokVault Secure
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 1,
                          background:
                            "linear-gradient(90deg,rgba(255,255,255,0.06),transparent)",
                        }}
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
