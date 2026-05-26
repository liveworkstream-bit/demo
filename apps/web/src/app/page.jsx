import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  DollarSign,
  Activity,
  Globe,
  ShoppingCart,
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  ShoppingBag,
  RefreshCw,
  Eye,
} from "lucide-react";

const FLAG_MAP = {
  UK: "🇬🇧",
  US: "🇺🇸",
  DE: "🇩🇪",
  FR: "🇫🇷",
  PK: "🇵🇰",
  SA: "🇸🇦",
  AE: "🇦🇪",
  TR: "🇹🇷",
  IN: "🇮🇳",
  CA: "🇨🇦",
  AU: "🇦🇺",
  BR: "🇧🇷",
  MX: "🇲🇽",
  JP: "🇯🇵",
  KR: "🇰🇷",
};

function getFlag(code) {
  return FLAG_MAP[(code || "").toUpperCase()] || "🌐";
}

// Live animated bar for mini chart
function MiniBar({ value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 20;
  return (
    <div
      style={{
        width: 6,
        height: 40,
        borderRadius: 3,
        background: "rgba(255,255,255,0.05)",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          width: "100%",
          borderRadius: 3,
          height: `${Math.max(pct, 8)}%`,
          background: color,
          transition: "height 1s cubic-bezier(0.23,1,0.32,1)",
        }}
      />
    </div>
  );
}

// Animated counter
function Counter({ target, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target && target !== 0) return;
    const num = typeof target === "number" ? target : 0;
    let start = 0;
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setVal(num);
        clearInterval(timer);
      } else setVal(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <span>
      {prefix}
      {typeof target === "string" ? target : val.toLocaleString()}
      {suffix}
    </span>
  );
}

// Live clock
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 11,
        color: "#64748b",
        letterSpacing: 2,
        display: "flex",
        gap: 8,
      }}
    >
      <span style={{ color: "#334155" }}>
        {time.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </span>
      <span style={{ color: "#25F4EE", fontWeight: 700 }}>
        {time.toLocaleTimeString("en-US", { hour12: false })}
      </span>
    </div>
  );
}

// Live terminal log with auto-scrolling new entries
function LiveTerminal({ orders, accounts }) {
  const bottomRef = useRef(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const base = [];
    if (orders?.length > 0) {
      orders.slice(0, 3).forEach((o) => {
        base.push({
          type: "success",
          time: new Date(o.created_at).toLocaleTimeString("en-US", {
            hour12: false,
          }),
          msg: `Order #TR-${String(o.id).padStart(5, "0")} finalized · $${parseFloat(o.total_paid).toFixed(2)} deducted`,
        });
      });
    }
    if (accounts?.length > 0) {
      accounts.slice(0, 2).forEach((a) => {
        base.push({
          type: "info",
          time: new Date(a.created_at).toLocaleTimeString("en-US", {
            hour12: false,
          }),
          msg: `Node @${a.username} indexed · ${a.region} cluster`,
        });
      });
    }
    const static_logs = [
      {
        type: "cyan",
        time: "SYS",
        msg: "Proxy-Secure gateway handshake complete · Node-42 (EAST)",
      },
      {
        type: "warn",
        time: "SYS",
        msg: "SSL certificate renewed · 365d validity confirmed",
      },
      {
        type: "success",
        time: "SYS",
        msg: "Database sync complete · 0 anomalies detected",
      },
      {
        type: "cyan",
        time: "SYS",
        msg: "Rumi converter engine loaded · v2.4.1",
      },
      { type: "muted", time: "SYS", msg: "Awaiting agent command input..." },
    ];
    setLogs([...static_logs, ...base]);
  }, [orders, accounts]);

  useEffect(() => {
    // Add a ticking live log entry every 8s
    const t = setInterval(() => {
      const live_msgs = [
        { type: "cyan", msg: "Proxy heartbeat · latency 12ms" },
        { type: "success", msg: "Health check passed · all nodes nominal" },
        { type: "warn", msg: "Rate-limit monitor active · 0 flags" },
        { type: "muted", msg: "Telemetry stream synchronized..." },
        { type: "info", msg: "Cluster rotation triggered · EU-WEST standby" },
      ];
      const pick = live_msgs[Math.floor(Math.random() * live_msgs.length)];
      const now = new Date().toLocaleTimeString("en-US", { hour12: false });
      setLogs((prev) => [
        ...prev.slice(-30),
        { ...pick, time: now, live: true },
      ]);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const colors = {
    success: "#10b981",
    warn: "#f59e0b",
    info: "#8b5cf6",
    cyan: "#25F4EE",
    muted: "#334155",
  };

  return (
    <div
      style={{
        background: "#050810",
        border: "1px solid rgba(255,255,255,0.04)",
        borderRadius: 16,
        padding: "16px",
        height: 320,
        overflowY: "auto",
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        scrollbarWidth: "thin",
        scrollbarColor: "#1e293b #050810",
      }}
    >
      {logs.map((log, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 8,
            opacity: log.live ? 0 : 1,
            animation: log.live ? "termEntry 0.4s ease forwards" : "none",
          }}
        >
          <span
            style={{
              color: colors[log.type],
              fontSize: 10,
              minWidth: 72,
              opacity: 0.7,
              paddingTop: 1,
            }}
          >
            [{log.time}]
          </span>
          <span
            style={{
              fontSize: 11,
              color: log.type === "muted" ? "#334155" : "#94a3b8",
              lineHeight: 1.6,
            }}
          >
            {log.msg}
          </span>
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "#25F4EE", fontSize: 10, minWidth: 72 }}>
          [LIVE]
        </span>
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
      <div ref={bottomRef} />
    </div>
  );
}

export default function Dashboard() {
  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => fetch("/api/accounts").then((r) => r.json()),
  });
  const { data: regions = [] } = useQuery({
    queryKey: ["regions"],
    queryFn: () => fetch("/api/regions").then((r) => r.json()),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetch("/api/orders").then((r) => r.json()),
  });

  const totalRevenue = orders.reduce(
    (s, o) => s + parseFloat(o.total_paid || 0),
    0,
  );
  const maxFollowers =
    accounts.length > 0
      ? Math.max(...accounts.map((a) => a.followers || 0))
      : 1;

  const stats = [
    {
      label: "Live Inventory",
      value: accounts.length,
      sub: "Available nodes",
      icon: ShoppingBag,
      color: "#25F4EE",
      glow: "rgba(37,244,238,0.12)",
      trend: "+8%",
    },
    {
      label: "Active Regions",
      value: regions.length,
      sub: "Migration clusters",
      icon: Globe,
      color: "#FE2C55",
      glow: "rgba(254,44,85,0.12)",
      trend: "+3",
    },
    {
      label: "Orders Closed",
      value: orders.length,
      sub: "Total transactions",
      icon: Activity,
      color: "#10b981",
      glow: "rgba(16,185,129,0.12)",
      trend: "+12%",
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(0)}`,
      sub: "All-time earnings",
      icon: DollarSign,
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.12)",
      trend: "+18%",
    },
  ];

  const quickActions = [
    {
      label: "Browse Marketplace",
      icon: ShoppingCart,
      href: "/marketplace",
      color: "#25F4EE",
      desc: "Acquire TikTok accounts",
    },
    {
      label: "Rumi Converter",
      icon: RefreshCw,
      href: "/converter",
      color: "#FE2C55",
      desc: "Migrate account regions",
    },
    {
      label: "View Orders",
      icon: Eye,
      href: "/orders",
      color: "#10b981",
      desc: "Transaction history",
    },
    {
      label: "Admin Panel",
      icon: Shield,
      href: "/admin",
      color: "#f59e0b",
      desc: "Manage system config",
    },
  ];

  return (
    <Layout>
      <style jsx global>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes termEntry { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        @keyframes statFadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes orbitPulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.5);opacity:0} }
        @keyframes shimmerMove { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .stat-card { animation: statFadeUp 0.5s ease forwards; opacity: 0; }
        .stat-card:nth-child(1){animation-delay:0.05s}
        .stat-card:nth-child(2){animation-delay:0.12s}
        .stat-card:nth-child(3){animation-delay:0.19s}
        .stat-card:nth-child(4){animation-delay:0.26s}
        .hover-lift { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .hover-lift:hover { transform: translateY(-3px); }
        .quick-action { transition: all 0.25s ease; cursor: pointer; }
        .quick-action:hover { transform: translateY(-2px); }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* ── HERO HEADER ─────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #0a0f1e 0%, #0d1526 50%, #0a0f1e 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            padding: "32px 36px",
          }}
        >
          {/* Background grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage:
                "linear-gradient(rgba(37,244,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(37,244,238,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Glow blobs */}
          <div
            style={{
              position: "absolute",
              top: -60,
              right: 80,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(37,244,238,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -40,
              left: 120,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(254,44,85,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 20,
            }}
          >
            <div>
              {/* Status pill */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 99,
                  padding: "5px 14px",
                  marginBottom: 16,
                }}
              >
                <div style={{ position: "relative", width: 8, height: 8 }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: "#10b981",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: -3,
                      borderRadius: "50%",
                      border: "2px solid #10b981",
                      animation: "orbitPulse 2s ease-out infinite",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#10b981",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  }}
                >
                  All Systems Operational
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(22px, 3vw, 32px)",
                  fontWeight: 900,
                  color: "#fff",
                  margin: "0 0 8px",
                  lineHeight: 1.1,
                }}
              >
                Welcome back,{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #25F4EE, #FE2C55)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Agent
                </span>
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  margin: 0,
                  maxWidth: 420,
                }}
              >
                TokVault command center is live. Monitor inventory, process
                migrations, and manage your TikTok node clusters.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                alignItems: "flex-end",
              }}
            >
              <LiveClock />
              <div style={{ display: "flex", gap: 8 }}>
                <div
                  style={{
                    background: "rgba(37,244,238,0.06)",
                    border: "1px solid rgba(37,244,238,0.15)",
                    borderRadius: 10,
                    padding: "8px 14px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: "#25F4EE",
                      fontFamily: "monospace",
                    }}
                  >
                    {accounts.length}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: 2,
                      fontWeight: 700,
                    }}
                  >
                    Nodes
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(254,44,85,0.06)",
                    border: "1px solid rgba(254,44,85,0.15)",
                    borderRadius: 10,
                    padding: "8px 14px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: "#FE2C55",
                      fontFamily: "monospace",
                    }}
                  >
                    {regions.length}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: 2,
                      fontWeight: 700,
                    }}
                  >
                    Regions
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(16,185,129,0.06)",
                    border: "1px solid rgba(16,185,129,0.15)",
                    borderRadius: 10,
                    padding: "8px 14px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: "#10b981",
                      fontFamily: "monospace",
                    }}
                  >
                    {orders.length}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: 2,
                      fontWeight: 700,
                    }}
                  >
                    Orders
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ───────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-card hover-lift"
              style={{
                background: `linear-gradient(145deg, #090d17 0%, #0a1020 100%)`,
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 20,
                padding: "22px 24px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Glow accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: `${stat.glow}`,
                    border: `1px solid ${stat.color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <stat.icon size={20} color={stat.color} />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.15)",
                    borderRadius: 99,
                    padding: "3px 9px",
                  }}
                >
                  <ArrowUpRight size={11} color="#10b981" />
                  <span
                    style={{ fontSize: 10, fontWeight: 800, color: "#10b981" }}
                  >
                    {stat.trend}
                  </span>
                </div>
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 6,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                <Counter target={stat.value} />
              </div>
              <div style={{ fontSize: 11, color: "#334155", fontWeight: 600 }}>
                {stat.sub}
              </div>

              {/* Bottom bar */}
              <div
                style={{
                  marginTop: 16,
                  height: 2,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.04)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "65%",
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${stat.color}, ${stat.color}44)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── QUICK ACTIONS ────────────────────────────────────── */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: 3,
                margin: 0,
              }}
            >
              Quick Access
            </h3>
            <div
              style={{
                height: 1,
                flex: 1,
                marginLeft: 16,
                background: "rgba(255,255,255,0.04)",
              }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            {quickActions.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="quick-action"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "#090d17",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 16,
                  padding: "16px 18px",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${a.color}30`;
                  e.currentTarget.style.background = `${a.color}06`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.background = "#090d17";
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: `${a.color}12`,
                    border: `1px solid ${a.color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <a.icon size={17} color={a.color} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#fff",
                      marginBottom: 2,
                    }}
                  >
                    {a.label}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{a.desc}</div>
                </div>
                <ArrowRight
                  size={14}
                  color="#334155"
                  style={{ marginLeft: "auto", flexShrink: 0 }}
                />
              </a>
            ))}
          </div>
        </div>

        {/* ── MAIN GRID ─────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)",
              gap: 20,
              flexWrap: "wrap",
            }}
            className="dash-grid"
          >
            {/* LEFT: Live Inventory Table */}
            <div
              style={{
                background: "#090d17",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "20px 24px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#10b981",
                      boxShadow: "0 0 8px #10b981",
                    }}
                  />
                  <span
                    style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}
                  >
                    Live Inventory
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      background: "rgba(37,244,238,0.08)",
                      border: "1px solid rgba(37,244,238,0.15)",
                      color: "#25F4EE",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 99,
                      letterSpacing: 1,
                    }}
                  >
                    {accounts.length} NODES
                  </span>
                </div>
                <a
                  href="/marketplace"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#25F4EE",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    opacity: 0.8,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.8)}
                >
                  View All <ArrowRight size={12} />
                </a>
              </div>

              {accounts.length === 0 ? (
                <div
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    color: "#334155",
                  }}
                >
                  <ShoppingBag
                    size={40}
                    style={{ margin: "0 auto 12px", opacity: 0.3 }}
                  />
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 2,
                      opacity: 0.5,
                    }}
                  >
                    No inventory yet
                  </div>
                  <a
                    href="/admin"
                    style={{
                      display: "inline-block",
                      marginTop: 12,
                      fontSize: 12,
                      color: "#25F4EE",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    Add via Admin Panel →
                  </a>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        {[
                          "Profile",
                          "Region",
                          "Authority",
                          "Price",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "10px 20px",
                              fontSize: 9,
                              fontWeight: 800,
                              color: "#334155",
                              textTransform: "uppercase",
                              letterSpacing: 2,
                              textAlign: "left",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.slice(0, 6).map((acc, i) => (
                        <tr
                          key={acc.id}
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.03)",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(255,255,255,0.02)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <td style={{ padding: "13px 20px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                              }}
                            >
                              <div
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, #1e293b, #0f172a)",
                                  border: "1.5px solid rgba(255,255,255,0.08)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                  fontWeight: 900,
                                  color: "#fff",
                                  overflow: "hidden",
                                  flexShrink: 0,
                                }}
                              >
                                {acc.profile_image ? (
                                  <img
                                    src={acc.profile_image}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                    alt=""
                                  />
                                ) : (
                                  (acc.username || "??")
                                    .slice(0, 2)
                                    .toUpperCase()
                                )}
                              </div>
                              <div>
                                <div
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 800,
                                    color: "#fff",
                                  }}
                                >
                                  @{acc.username}
                                </div>
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#64748b",
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    fontWeight: 700,
                                  }}
                                >
                                  {acc.niche || "General"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "13px 20px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <span style={{ fontSize: 16 }}>
                                {getFlag(acc.region_code)}
                              </span>
                              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                                {acc.region || "—"}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "13px 20px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <MiniBar
                                value={acc.followers || 0}
                                max={maxFollowers}
                                color="#25F4EE"
                              />
                              <span
                                style={{
                                  fontFamily: "monospace",
                                  fontSize: 12,
                                  color: "#fff",
                                  fontWeight: 700,
                                }}
                              >
                                {acc.followers >= 1000
                                  ? (acc.followers / 1000).toFixed(1) + "k"
                                  : acc.followers || 0}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "13px 20px" }}>
                            <span
                              style={{
                                fontFamily: "monospace",
                                fontSize: 14,
                                fontWeight: 900,
                                color: "#fff",
                              }}
                            >
                              ${parseFloat(acc.price).toFixed(2)}
                            </span>
                          </td>
                          <td style={{ padding: "13px 20px" }}>
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                background: "rgba(16,185,129,0.08)",
                                border: "1px solid rgba(16,185,129,0.2)",
                                borderRadius: 99,
                                padding: "4px 10px",
                              }}
                            >
                              <div
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: "50%",
                                  background: "#10b981",
                                }}
                              />
                              <span
                                style={{
                                  fontSize: 9,
                                  fontWeight: 800,
                                  color: "#10b981",
                                  textTransform: "uppercase",
                                  letterSpacing: 2,
                                }}
                              >
                                Available
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* RIGHT: Terminal + Recent Orders */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Terminal */}
              <div
                style={{
                  background: "#090d17",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div style={{ display: "flex", gap: 5 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#FE2C55",
                      }}
                    />
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#f59e0b",
                      }}
                    />
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#10b981",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#334155",
                      fontFamily: "monospace",
                      letterSpacing: 1,
                    }}
                  >
                    tokvault@proxy-secure:~$
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
                <div style={{ padding: "0 4px 4px" }}>
                  <LiveTerminal orders={orders} accounts={accounts} />
                </div>
              </div>

              {/* Recent Orders mini */}
              <div
                style={{
                  background: "#090d17",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 20,
                  padding: "18px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}
                  >
                    Recent Orders
                  </span>
                  <a
                    href="/orders"
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#25F4EE",
                      textDecoration: "none",
                      textTransform: "uppercase",
                      letterSpacing: 2,
                    }}
                  >
                    All →
                  </a>
                </div>
                {orders.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px 0",
                      color: "#334155",
                      fontSize: 12,
                    }}
                  >
                    No orders yet
                  </div>
                ) : (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {orders.slice(0, 4).map((o) => (
                      <div
                        key={o.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          background: "rgba(255,255,255,0.02)",
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.03)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 8,
                              background:
                                o.item_type === "account"
                                  ? "rgba(37,244,238,0.08)"
                                  : "rgba(254,44,85,0.08)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {o.item_type === "account" ? (
                              <ShoppingBag size={13} color="#25F4EE" />
                            ) : (
                              <Globe size={13} color="#FE2C55" />
                            )}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 800,
                                color: "#fff",
                                fontFamily: "monospace",
                              }}
                            >
                              #TR-{String(o.id).padStart(5, "0")}
                            </div>
                            <div style={{ fontSize: 10, color: "#64748b" }}>
                              {o.item_type === "account"
                                ? "Node Acquisition"
                                : "Migration"}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 900,
                              color: "#fff",
                              fontFamily: "monospace",
                            }}
                          >
                            ${parseFloat(o.total_paid).toFixed(2)}
                          </div>
                          <div
                            style={{
                              fontSize: 9,
                              color: "#10b981",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: 1,
                            }}
                          >
                            Settled
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BANNER ─────────────────────────────────────── */}
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            position: "relative",
            background:
              "linear-gradient(135deg, #0a0f1e 0%, #0f1a2e 50%, #0a0f1e 100%)",
            border: "1px solid rgba(37,244,238,0.1)",
            padding: "24px 32px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(37,244,238,0.04) 0%, transparent 50%, rgba(254,44,85,0.04) 100%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <Zap size={18} color="#25F4EE" />
              <span style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>
                Rumi Converter Ready
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#64748b",
                margin: 0,
                maxWidth: 400,
              }}
            >
              High-fidelity account migrations across {regions.length}{" "}
              international TikTok clusters — initiate your next transfer now.
            </p>
          </div>
          <a
            href="/converter"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "linear-gradient(135deg, #FE2C55, #25F4EE)",
              color: "#fff",
              fontWeight: 900,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 3,
              padding: "14px 28px",
              borderRadius: 14,
              textDecoration: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 8px 30px rgba(37,244,238,0.2)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 14px 40px rgba(37,244,238,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(37,244,238,0.2)";
            }}
          >
            Launch Converter <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
