import React, { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Users,
  Heart,
  Video,
  MapPin,
  Tag,
  ShoppingBag,
  Star,
  TrendingUp,
  Clock,
  Filter,
  ChevronDown,
  Globe,
  Shield,
  Zap,
  Eye,
  CheckCircle2,
  BadgeCheck,
  ArrowUpDown,
  SlidersHorizontal,
  Flame,
  Award,
} from "lucide-react";
import AccountPurchaseModal from "@/components/AccountPurchaseModal";

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
  if (!code) return "🌐";
  return FLAG_MAP[code.toUpperCase()] || "🌐";
}

function fmt(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function engRate(acc) {
  if (!acc.followers || !acc.videos) return 0;
  return ((acc.likes || 0) / acc.videos / acc.followers) * 100;
}

function getScoreBadge(acc) {
  const f = acc.followers || 0;
  const e = engRate(acc);
  if (f > 100000 || e > 8)
    return {
      label: "Premium",
      color: "#ffd700",
      bg: "rgba(255,215,0,0.1)",
      border: "rgba(255,215,0,0.25)",
      icon: Award,
    };
  if (f > 10000 || e > 4)
    return {
      label: "Verified",
      color: "#25F4EE",
      bg: "rgba(37,244,238,0.08)",
      border: "rgba(37,244,238,0.2)",
      icon: BadgeCheck,
    };
  return {
    label: "Standard",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
    icon: Shield,
  };
}

const CARD_BG = [
  "linear-gradient(135deg,#1a0533 0%,#0d1a3a 100%)",
  "linear-gradient(135deg,#1a0a14 0%,#0a1a1a 100%)",
  "linear-gradient(135deg,#0a1a0d 0%,#0a1530 100%)",
  "linear-gradient(135deg,#1a1200 0%,#0d0a2a 100%)",
  "linear-gradient(135deg,#001a1a 0%,#10001a 100%)",
];

function AccountCard({ account, onBuy }) {
  const [hovered, setHovered] = useState(false);
  const badge = getScoreBadge(account);
  const er = engRate(account).toFixed(2);
  const bg = CARD_BG[(account.username || "a").charCodeAt(0) % CARD_BG.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#090d17",
        border: `1px solid ${hovered ? "rgba(37,244,238,0.18)" : "rgba(255,255,255,0.05)"}`,
        borderRadius: 22,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(37,244,238,0.06)"
          : "none",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
    >
      {/* Banner */}
      <div
        style={{
          height: 90,
          position: "relative",
          background: bg,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.05) 1px,transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(37,244,238,0.12) 0%,transparent 70%)",
          }}
        />

        {/* Badge top-right */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: badge.bg,
              border: `1px solid ${badge.border}`,
              borderRadius: 20,
              padding: "4px 10px",
            }}
          >
            <badge.icon size={10} color={badge.color} />
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: badge.color,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {badge.label}
            </span>
          </div>
        </div>

        {/* Niche bottom-left */}
        {account.niche && (
          <div style={{ position: "absolute", bottom: 10, left: 10 }}>
            <div
              style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "3px 10px",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Tag size={9} color="#8b5cf6" />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {account.niche}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Avatar row */}
      <div
        style={{
          padding: "0 18px",
          marginTop: -28,
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "3px solid #090d17",
            overflow: "hidden",
            background: "linear-gradient(135deg,#FE2C55,#25F4EE)",
            flexShrink: 0,
          }}
        >
          {account.profile_image ? (
            <img
              src={account.profile_image}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              {(account.username || "?").slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        {/* Region pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20,
            padding: "5px 10px",
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 13 }}>{getFlag(account.region_code)}</span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {account.region_code || "—"}
          </span>
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          padding: "10px 18px 18px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            @{account.username}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
            {account.region || "Unknown Region"}
          </div>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 6,
          }}
        >
          {[
            {
              icon: Users,
              val: fmt(account.followers),
              label: "Followers",
              color: "#25F4EE",
            },
            {
              icon: Heart,
              val: fmt(account.likes),
              label: "Likes",
              color: "#FE2C55",
            },
            {
              icon: Video,
              val: String(account.videos || 0),
              label: "Videos",
              color: "#8b5cf6",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                textAlign: "center",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: 10,
                padding: "8px 4px",
              }}
            >
              <s.icon
                size={11}
                color={s.color}
                style={{ margin: "0 auto 3px" }}
              />
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: "#334155",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontWeight: 700,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Engagement & Age */}
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              flex: 1,
              background: "rgba(16,185,129,0.05)",
              border: "1px solid rgba(16,185,129,0.12)",
              borderRadius: 10,
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <TrendingUp size={11} color="#10b981" />
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#10b981" }}>
                {er}%
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontWeight: 700,
                }}
              >
                Eng. Rate
              </div>
            </div>
          </div>
          {account.age && (
            <div
              style={{
                flex: 1,
                background: "rgba(6,182,212,0.05)",
                border: "1px solid rgba(6,182,212,0.12)",
                borderRadius: 10,
                padding: "8px 10px",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <Clock size={11} color="#06b6d4" />
              <div>
                <div
                  style={{ fontSize: 11, fontWeight: 900, color: "#06b6d4" }}
                >
                  {account.age}
                </div>
                <div
                  style={{
                    fontSize: 8,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    fontWeight: 700,
                  }}
                >
                  Account Age
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 10,
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9,
                color: "#64748b",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Price
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1,
                fontFamily: "monospace",
              }}
            >
              ${parseFloat(account.price || 0).toFixed(2)}
            </div>
            <div style={{ fontSize: 9, color: "#334155", marginTop: 2 }}>
              + applicable fees
            </div>
          </div>
          <button
            onClick={() => onBuy(account)}
            style={{
              padding: "12px 22px",
              borderRadius: 12,
              border: "none",
              background: hovered
                ? "linear-gradient(135deg,#FE2C55 0%,#c0006d 50%,#25F4EE 100%)"
                : "linear-gradient(135deg,rgba(254,44,85,0.8),rgba(37,244,238,0.8))",
              color: "#fff",
              fontSize: 11,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 2,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 7,
              boxShadow: hovered ? "0 8px 24px rgba(254,44,85,0.4)" : "none",
              transition: "all 0.25s",
            }}
          >
            <Zap size={13} /> Acquire
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceMax, setPriceMax] = useState("");
  const [followersMin, setFollowersMin] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => fetch("/api/accounts").then((r) => r.json()),
  });

  const niches = useMemo(
    () => [...new Set(accounts.map((a) => a.niche).filter(Boolean))],
    [accounts],
  );

  const filtered = useMemo(() => {
    let arr = accounts.filter((acc) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        (acc.username || "").toLowerCase().includes(q) ||
        (acc.region || "").toLowerCase().includes(q) ||
        (acc.niche || "").toLowerCase().includes(q);
      const matchNiche = !selectedNiche || acc.niche === selectedNiche;
      const matchPrice =
        !priceMax || parseFloat(acc.price) <= parseFloat(priceMax);
      const matchFollowers =
        !followersMin || (acc.followers || 0) >= parseInt(followersMin);
      return matchSearch && matchNiche && matchPrice && matchFollowers;
    });

    switch (sortBy) {
      case "price_asc":
        arr = arr.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price_desc":
        arr = arr.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "followers":
        arr = arr.sort((a, b) => (b.followers || 0) - (a.followers || 0));
        break;
      case "engagement":
        arr = arr.sort((a, b) => engRate(b) - engRate(a));
        break;
      default:
        arr = arr.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
    }
    return arr;
  }, [accounts, search, selectedNiche, sortBy, priceMax, followersMin]);

  const totalValue = accounts.reduce((s, a) => s + parseFloat(a.price || 0), 0);

  return (
    <Layout>
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes mkIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .mk-card { animation: mkIn 0.4s ease forwards; }
        .mk-filter-input {
          width:100%; background:rgba(30,41,59,0.5); border:1.5px solid rgba(255,255,255,0.07);
          border-radius:10px; padding:10px 14px; color:#fff; font-size:13px; font-weight:600;
          outline:none; transition:border-color 0.2s; box-sizing:border-box;
        }
        .mk-filter-input:focus { border-color:rgba(37,244,238,0.4); }
        .mk-filter-input::placeholder { color:#334155; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* ── HERO HEADER ──────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            borderRadius: 22,
            overflow: "hidden",
            background: "linear-gradient(135deg,#0a0f1e 0%,#0d1526 100%)",
            border: "1px solid rgba(255,255,255,0.05)",
            padding: "28px 32px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(37,244,238,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(37,244,238,0.02) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -60,
              right: 80,
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
              bottom: -40,
              left: 120,
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
              gap: 20,
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
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#25F4EE",
                    animation: "pulse-dot 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#25F4EE",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  }}
                >
                  Live Marketplace
                </span>
              </div>
              <h1
                style={{
                  fontSize: "clamp(22px,3vw,32px)",
                  fontWeight: 900,
                  color: "#fff",
                  margin: "0 0 6px",
                  lineHeight: 1.1,
                }}
              >
                TikTok{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg,#25F4EE,#FE2C55)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Account Marketplace
                </span>
              </h1>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                Acquire premium TikTok accounts with verified follower counts,
                engagement rates, and full ownership transfer.
              </p>
            </div>

            {/* Live stats */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                {
                  label: "Live Listings",
                  value: accounts.length,
                  color: "#25F4EE",
                },
                {
                  label: "Total Value",
                  value: `$${totalValue.toFixed(0)}`,
                  color: "#10b981",
                },
                { label: "Niches", value: niches.length, color: "#8b5cf6" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: `${s.color}08`,
                    border: `1px solid ${s.color}18`,
                    borderRadius: 14,
                    padding: "12px 18px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
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

          {/* Trust badges */}
          <div
            style={{
              position: "relative",
              display: "flex",
              gap: 20,
              marginTop: 20,
              flexWrap: "wrap",
            }}
          >
            {[
              [Shield, "Escrow Protected"],
              [CheckCircle2, "Verified Accounts"],
              [Zap, "Instant Transfer"],
              [Globe, "International Clusters"],
            ].map(([Icon, label]) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 7 }}
              >
                <Icon size={12} color="#25F4EE" />
                <span
                  style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEARCH + FILTER ROW ───────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search
                size={16}
                color="#334155"
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search username, region, niche..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  background: "#090d17",
                  border: "1.5px solid rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  paddingLeft: 44,
                  paddingRight: 16,
                  height: 48,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(37,244,238,0.4)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              />
            </div>

            {/* Sort */}
            <div style={{ position: "relative" }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  height: 48,
                  background: "#090d17",
                  border: "1.5px solid rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  padding: "0 40px 0 16px",
                  color: "#94a3b8",
                  fontSize: 13,
                  fontWeight: 700,
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                }}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="followers">Most Followers</option>
                <option value="engagement">Highest Engagement</option>
              </select>
              <ChevronDown
                size={14}
                color="#334155"
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                height: 48,
                padding: "0 18px",
                borderRadius: 14,
                border: `1.5px solid ${showFilters ? "rgba(37,244,238,0.3)" : "rgba(255,255,255,0.06)"}`,
                background: showFilters ? "rgba(37,244,238,0.06)" : "#090d17",
                color: showFilters ? "#25F4EE" : "#94a3b8",
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 2,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div
              style={{
                background: "#090d17",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "18px 20px",
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "flex-end",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  }}
                >
                  Max Price ($)
                </label>
                <input
                  className="mk-filter-input"
                  type="number"
                  placeholder="e.g. 500"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  style={{ width: 140 }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  }}
                >
                  Min Followers
                </label>
                <input
                  className="mk-filter-input"
                  type="number"
                  placeholder="e.g. 10000"
                  value={followersMin}
                  onChange={(e) => setFollowersMin(e.target.value)}
                  style={{ width: 160 }}
                />
              </div>
              <button
                onClick={() => {
                  setPriceMax("");
                  setFollowersMin("");
                  setSelectedNiche("");
                  setSearch("");
                }}
                style={{
                  height: 40,
                  padding: "0 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(254,44,85,0.2)",
                  background: "rgba(254,44,85,0.06)",
                  color: "#FE2C55",
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Clear All
              </button>
            </div>
          )}

          {/* Niche pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedNiche("")}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                border: `1.5px solid ${!selectedNiche ? "rgba(37,244,238,0.4)" : "rgba(255,255,255,0.07)"}`,
                background: !selectedNiche
                  ? "rgba(37,244,238,0.08)"
                  : "rgba(255,255,255,0.02)",
                color: !selectedNiche ? "#25F4EE" : "#64748b",
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              All Niches
            </button>
            {niches.map((n) => (
              <button
                key={n}
                onClick={() => setSelectedNiche(n === selectedNiche ? "" : n)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 20,
                  border: `1.5px solid ${selectedNiche === n ? "rgba(254,44,85,0.4)" : "rgba(255,255,255,0.07)"}`,
                  background:
                    selectedNiche === n
                      ? "rgba(254,44,85,0.08)"
                      : "rgba(255,255,255,0.02)",
                  color: selectedNiche === n ? "#FE2C55" : "#64748b",
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Result count */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 12, color: "#334155", fontWeight: 700 }}>
              Showing <span style={{ color: "#fff" }}>{filtered.length}</span>{" "}
              of {accounts.length} accounts
            </span>
            {(search || selectedNiche || priceMax || followersMin) && (
              <span
                style={{
                  fontSize: 11,
                  color: "#25F4EE",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSearch("");
                  setSelectedNiche("");
                  setPriceMax("");
                  setFollowersMin("");
                }}
              >
                Clear filters ×
              </span>
            )}
          </div>
        </div>

        {/* ── GRID ──────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))",
              gap: 18,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  background: "#090d17",
                  borderRadius: 22,
                  height: 380,
                  border: "1px solid rgba(255,255,255,0.04)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: 90,
                    background: "rgba(255,255,255,0.02)",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                <div
                  style={{
                    padding: "36px 18px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      height: 16,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 6,
                      width: "60%",
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 6,
                      width: "40%",
                    }}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 6,
                      marginTop: 8,
                    }}
                  >
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        style={{
                          height: 56,
                          background: "rgba(255,255,255,0.02)",
                          borderRadius: 10,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 16,
              opacity: 0.4,
            }}
          >
            <ShoppingBag size={56} color="#94a3b8" />
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                No Accounts Found
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                Try adjusting your filters
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))",
              gap: 18,
            }}
          >
            {filtered.map((account, i) => (
              <div
                key={account.id}
                className="mk-card"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <AccountCard account={account} onBuy={setSelectedAccount} />
              </div>
            ))}
          </div>
        )}

        {/* ── TRUST FOOTER ──────────────────────────────────────────────── */}
        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.01)",
            padding: "20px 28px",
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[
            [
              Shield,
              "Escrow Protection",
              "Funds held until transfer confirmed",
            ],
            [
              CheckCircle2,
              "Verified Accounts",
              "All accounts manually reviewed",
            ],
            [Zap, "Fast Delivery", "Transfer starts within minutes"],
            [Globe, "Global Support", "24/7 customer support"],
          ].map(([Icon, title, sub]) => (
            <div
              key={title}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: "rgba(37,244,238,0.07)",
                  border: "1px solid rgba(37,244,238,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={16} color="#25F4EE" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>
                  {title}
                </div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Modal */}
      <AccountPurchaseModal
        isOpen={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
        account={selectedAccount}
        onComplete={() => {
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
          setSelectedAccount(null);
        }}
      />
    </Layout>
  );
}
