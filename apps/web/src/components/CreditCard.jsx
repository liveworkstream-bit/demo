import React, { useMemo } from "react";

function getCardBrand(number) {
  if (number.startsWith("4")) return "VISA";
  if (number.startsWith("5")) return "MASTERCARD";
  if (number.startsWith("3")) return "AMEX";
  return "DEFAULT";
}

const brandConfig = {
  VISA: {
    gradient: "linear-gradient(135deg, #1a1f71 0%, #0a2d8f 40%, #1565c0 100%)",
    accent: "#c8a84b",
    logo: VisaLogo,
    shimmer: "rgba(200,168,75,0.15)",
  },
  MASTERCARD: {
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d1a00 50%, #3e2000 100%)",
    accent: "#ff6b35",
    logo: MastercardLogo,
    shimmer: "rgba(255,107,53,0.15)",
  },
  AMEX: {
    gradient: "linear-gradient(135deg, #004d40 0%, #00695c 50%, #a0833a 100%)",
    accent: "#ffd700",
    logo: AmexLogo,
    shimmer: "rgba(255,215,0,0.15)",
  },
  DEFAULT: {
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
    accent: "#25F4EE",
    logo: DefaultLogo,
    shimmer: "rgba(37,244,238,0.12)",
  },
};

function VisaLogo() {
  return (
    <div
      style={{
        fontFamily: "serif",
        fontStyle: "italic",
        fontWeight: 900,
        fontSize: 26,
        color: "#fff",
        letterSpacing: -1,
        lineHeight: 1,
        textShadow: "0 2px 8px rgba(0,0,0,0.4)",
      }}
    >
      VISA
    </div>
  );
}

function MastercardLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: -8 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#eb001b",
          opacity: 0.95,
        }}
      />
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#f79e1b",
          opacity: 0.95,
          marginLeft: -12,
        }}
      />
    </div>
  );
}

function AmexLogo() {
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        fontWeight: 900,
        fontSize: 13,
        color: "#ffd700",
        letterSpacing: 2,
        lineHeight: 1,
        textShadow: "0 2px 8px rgba(0,0,0,0.4)",
      }}
    >
      AMEX
    </div>
  );
}

function DefaultLogo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 1,
      }}
    >
      <div
        style={{ width: 22, height: 2, background: "#25F4EE", borderRadius: 2 }}
      />
      <div
        style={{ width: 16, height: 2, background: "#FE2C55", borderRadius: 2 }}
      />
      <div
        style={{ width: 20, height: 2, background: "#25F4EE", borderRadius: 2 }}
      />
    </div>
  );
}

function CardChip() {
  return (
    <div
      style={{
        width: 42,
        height: 32,
        borderRadius: 6,
        background:
          "linear-gradient(135deg, #d4a843 0%, #f5d080 30%, #c8942b 60%, #f0c060 100%)",
        border: "1px solid rgba(255,255,255,0.3)",
        position: "relative",
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr",
          padding: 4,
          gap: 2,
        }}
      >
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            style={{ background: "rgba(0,0,0,0.12)", borderRadius: 1 }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          background: "rgba(0,0,0,0.15)",
          transform: "translateY(-50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(0,0,0,0.15)",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
}

export default function CreditCard({
  number = "",
  name = "",
  expiry = "",
  cvv = "",
  focused = "",
}) {
  const brand = useMemo(() => getCardBrand(number), [number]);
  const config = brandConfig[brand];
  const isFlipped = focused === "cvv";

  const formattedNumber = number
    .replace(/\D/g, "")
    .padEnd(16, "•")
    .replace(/(.{4})/g, "$1 ")
    .trim();

  return (
    <div style={{ perspective: 1000, width: "100%", aspectRatio: "1.586" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: 18,
            overflow: "hidden",
            background: config.gradient,
            boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}
        >
          {/* Shimmer overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at 30% 20%, ${config.shimmer} 0%, transparent 60%)`,
              pointerEvents: "none",
            }}
          />
          {/* Gloss streak */}
          <div
            style={{
              position: "absolute",
              top: -60,
              left: -40,
              width: "180%",
              height: "60%",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%)",
              transform: "rotate(-8deg)",
              pointerEvents: "none",
            }}
          />
          {/* Contactless waves */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.35,
            }}
          >
            {[10, 18, 26].map((r, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: r,
                  height: r,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(255,255,255,0.8)",
                  clipPath: "inset(0 0 0 50%)",
                }}
              />
            ))}
          </div>

          <div
            style={{
              position: "relative",
              height: "100%",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Top row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <CardChip />
              <config.logo />
            </div>

            {/* Card number */}
            <div
              style={{
                transition: "transform 0.2s ease",
                transform: focused === "number" ? "scale(1.04)" : "scale(1)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Card Number
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  fontSize: 19,
                  color: "#fff",
                  letterSpacing: "0.2em",
                  fontWeight: 700,
                  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                {formattedNumber}
              </div>
            </div>

            {/* Bottom row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  transition: "transform 0.2s ease",
                  transform: focused === "name" ? "scale(1.04)" : "scale(1)",
                  flex: 1,
                  marginRight: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Card Holder
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#fff",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {name || "FULL NAME"}
                </div>
              </div>
              <div
                style={{
                  transition: "transform 0.2s ease",
                  transform: focused === "expiry" ? "scale(1.04)" : "scale(1)",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Expires
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#fff",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    letterSpacing: 2,
                  }}
                >
                  {expiry || "MM/YY"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: 18,
            overflow: "hidden",
            background: config.gradient,
            transform: "rotateY(180deg)",
            boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at 70% 80%, ${config.shimmer} 0%, transparent 60%)`,
              pointerEvents: "none",
            }}
          />
          {/* Magnetic stripe */}
          <div
            style={{
              height: 46,
              background: "linear-gradient(180deg, #111 0%, #000 100%)",
              marginTop: 32,
              width: "100%",
            }}
          />
          {/* Signature strip */}
          <div
            style={{
              margin: "16px 24px 0",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 36,
                borderRadius: 4,
                background:
                  "repeating-linear-gradient(90deg, #e8e8d8 0px, #e8e8d8 2px, #f5f5ec 2px, #f5f5ec 6px)",
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
              }}
            >
              <span
                style={{
                  fontFamily: "cursive",
                  color: "#333",
                  fontSize: 13,
                  opacity: 0.7,
                }}
              >
                Authorized Signature
              </span>
            </div>
            <div
              style={{
                width: 56,
                height: 36,
                borderRadius: 4,
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: 2,
                }}
              >
                {cvv || "•••"}
              </span>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 16, right: 24 }}>
            <config.logo />
          </div>
          <div style={{ position: "absolute", bottom: 16, left: 24 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: config.accent,
                    opacity: 0.4,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
