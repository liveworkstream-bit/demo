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
} from "lucide-react";
import CreditCard from "./CreditCard";
import playSound from "../utils/sounds";

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

function SecurityBadge({ label, icon: Icon }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.6 }}
    >
      <Icon size={12} color="#25F4EE" />
      <span
        style={{
          fontSize: 9,
          color: "#94a3b8",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function StepDot({ n, current }) {
  const done = current > n;
  const active = current === n;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: active ? 32 : 24,
          height: active ? 32 : 24,
          borderRadius: "50%",
          background: done
            ? "#10b981"
            : active
              ? "linear-gradient(135deg,#FE2C55,#25F4EE)"
              : "rgba(255,255,255,0.05)",
          border: done
            ? "2px solid #10b981"
            : active
              ? "none"
              : "2px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
          boxShadow: active ? "0 0 20px rgba(37,244,238,0.3)" : "none",
          fontSize: 11,
          fontWeight: 900,
          color: "#fff",
        }}
      >
        {done ? <CheckCircle2 size={13} /> : n}
      </div>
    </div>
  );
}

export default function CheckoutModal({
  isOpen,
  onClose,
  item,
  type,
  onComplete,
}) {
  const [step, setStep] = useState(1);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [surcharges, setSurcharges] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  const [focused, setFocused] = useState("");
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [loadingStep, setLoadingStep] = useState(0);
  const errorRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setCurrentAttempt(1);
        setSurcharges(0);
        setError(null);
        setOrderResult(null);
        setCardData({ number: "", name: "", expiry: "", cvv: "" });
        setLoadingStep(0);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  if (!isOpen) return null;

  const basePrice = parseFloat(item?.price || item?.conversion_fee || 0);
  const totalAmount = basePrice + surcharges;

  const simulateLoading = async () => {
    const steps = [
      "Encrypting card data...",
      "Connecting to secure gateway...",
      "Verifying with bank...",
    ];
    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(i);
      await new Promise((r) => setTimeout(r, 700));
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
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_type: type,
          item_id: item?.id,
          base_price: basePrice,
          current_attempt: currentAttempt,
          card_details: cardData,
          tax_paid: surcharges,
        }),
      });
      const result = await response.json();

      if (result.success) {
        playSound("success");
        setOrderResult(result.order);
        setStep(3);
        if (onComplete) onComplete(result.order);
      } else {
        playSound("error");
        setError(result.error_msg);
        setSurcharges((prev) => prev + parseFloat(result.surcharge || 0));
        setCurrentAttempt(result.next_attempt);
      }
    } catch (err) {
      setError("Network encryption error. Reconnect and retry.");
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const loadingMessages = [
    "Encrypting card data...",
    "Connecting to secure gateway...",
    "Verifying with bank...",
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes cko-in {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes cko-shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-5px); }
          80%      { transform: translateX(5px); }
        }
        @keyframes cko-success-pop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes cko-scan {
          0%   { transform: translateY(0); opacity: 0.8; }
          50%  { opacity: 0.3; }
          100% { transform: translateY(80px); opacity: 0; }
        }
        @keyframes cko-glow {
          0%,100% { box-shadow: 0 0 20px rgba(37,244,238,0.2); }
          50%      { box-shadow: 0 0 40px rgba(37,244,238,0.5); }
        }
        @keyframes cko-confetti {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-60px) rotate(720deg); opacity: 0; }
        }
        .cko-modal    { animation: cko-in 0.4s cubic-bezier(0.23,1,0.32,1) forwards; }
        .cko-shake    { animation: cko-shake 0.5s ease; }
        .cko-success  { animation: cko-success-pop 0.6s cubic-bezier(0.23,1,0.32,1) forwards; }
        .cko-scan-bar { animation: cko-scan 1.6s ease-in-out infinite; }
        .cko-glow     { animation: cko-glow 2s ease-in-out infinite; }
        .cko-input {
          width: 100%; background: rgba(30,41,59,0.5); border: 1.5px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 14px 16px; color: #fff;
          font-size: 14px; font-weight: 600; outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          box-sizing: border-box;
        }
        .cko-input:focus {
          border-color: rgba(37,244,238,0.5);
          background: rgba(37,244,238,0.04);
          box-shadow: 0 0 0 3px rgba(37,244,238,0.08);
        }
        .cko-input::placeholder { color: #334155; }
        .cko-label {
          display: block; font-size: 10px; font-weight: 800;
          color: #64748b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;
        }
        .cko-btn-pay {
          width: 100%; height: 56px; border-radius: 14px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #FE2C55 0%, #c0006d 50%, #25F4EE 100%);
          background-size: 200% 200%; background-position: 0% 50%;
          color: #fff; font-size: 13px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 3px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 30px rgba(254,44,85,0.35);
        }
        .cko-btn-pay:hover:not(:disabled) {
          background-position: 100% 50%;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(37,244,238,0.3);
        }
        .cko-btn-pay:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .cko-divider-line {
          flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }
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
            background: "rgba(3,7,20,0.92)",
            backdropFilter: "blur(20px)",
          }}
        />

        {/* Modal */}
        <div
          className="cko-modal"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 860,
            maxHeight: "95vh",
            overflowY: "auto",
            background:
              "linear-gradient(160deg, #0a0f1e 0%, #090d17 60%, #0c1120 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 28,
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 300,
              height: 300,
              background:
                "radial-gradient(circle, rgba(37,244,238,0.06) 0%, transparent 70%)",
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
                "radial-gradient(circle, rgba(254,44,85,0.05) 0%, transparent 70%)",
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

          {step < 3 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {/* LEFT PANEL — Order Summary */}
              <div
                style={{
                  width: "clamp(260px, 38%, 300px)",
                  minWidth: 260,
                  background:
                    "linear-gradient(160deg, rgba(37,244,238,0.04) 0%, rgba(254,44,85,0.03) 100%)",
                  borderRight: "1px solid rgba(255,255,255,0.05)",
                  padding: "36px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 28,
                  flex: "0 0 auto",
                }}
              >
                {/* Header */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #FE2C55, #25F4EE)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 15px rgba(37,244,238,0.3)",
                      }}
                    >
                      <Zap size={16} color="#fff" />
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#25F4EE",
                        textTransform: "uppercase",
                        letterSpacing: 3,
                      }}
                    >
                      TokVault
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: "#fff",
                      lineHeight: 1.2,
                      margin: 0,
                    }}
                  >
                    {type === "account"
                      ? "Node Acquisition"
                      : "Region Migration"}
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginTop: 6,
                      margin: "6px 0 0",
                    }}
                  >
                    Secure{" "}
                    {type === "account"
                      ? "account transfer"
                      : "cluster conversion"}{" "}
                    protocol
                  </p>
                </div>

                {/* Item card */}
                {item && (
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 16,
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: "#64748b",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: 10,
                      }}
                    >
                      {type === "account" ? "Target Profile" : "Destination"}
                    </div>
                    {type === "account" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #FE2C55, #25F4EE)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 900,
                            color: "#fff",
                            overflow: "hidden",
                            border: "2px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          {item.profile_image ? (
                            <img
                              src={item.profile_image}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              alt=""
                            />
                          ) : (
                            (item.username || "??").slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 800,
                              color: "#fff",
                            }}
                          >
                            @{item.username}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>
                            {item.region || "Unknown Region"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div style={{ fontSize: 28 }}>{item.flag || "🌐"}</div>
                        <div>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 800,
                              color: "#fff",
                            }}
                          >
                            {item.name}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>
                            International Cluster
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Invoice breakdown */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 0 }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: "#64748b",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 2,
                      marginBottom: 12,
                    }}
                  >
                    Invoice Breakdown
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>
                      Base Fee
                    </span>
                    <span
                      style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}
                    >
                      ${basePrice.toFixed(2)}
                    </span>
                  </div>

                  {surcharges > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          color: "#FE2C55",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <AlertTriangle size={11} /> Bank Surcharge
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#FE2C55",
                        }}
                      >
                        +${surcharges.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      height: 1,
                      background: "rgba(255,255,255,0.06)",
                      margin: "8px 0 12px",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#25F4EE",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Total Due
                    </span>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 900,
                          color: "#fff",
                          lineHeight: 1,
                        }}
                      >
                        ${totalAmount.toFixed(2)}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>USD</div>
                    </div>
                  </div>
                </div>

                {/* Security badges */}
                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    paddingTop: 20,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <SecurityBadge label="256-bit SSL Encrypted" icon={Lock} />
                  <SecurityBadge label="PCI DSS Compliant" icon={ShieldCheck} />
                  <SecurityBadge label="Proxy-Secure Gateway" icon={Globe} />
                </div>
              </div>

              {/* RIGHT PANEL — Payment Form */}
              <div
                style={{
                  flex: 1,
                  minWidth: 300,
                  padding: "36px 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                {/* Step indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <StepDot n={1} current={step} />
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background:
                        step >= 2
                          ? "linear-gradient(90deg,#25F4EE,rgba(255,255,255,0.05))"
                          : "rgba(255,255,255,0.05)",
                      borderRadius: 4,
                      transition: "background 0.5s",
                    }}
                  />
                  <StepDot n={2} current={step} />
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background:
                        step >= 3 ? "#10b981" : "rgba(255,255,255,0.05)",
                      borderRadius: 4,
                    }}
                  />
                  <StepDot n={3} current={step} />
                  <div
                    style={{
                      marginLeft: 4,
                      fontSize: 11,
                      color: "#64748b",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step === 1
                      ? "Card Details"
                      : step === 2
                        ? "Verifying"
                        : "Done"}
                  </div>
                </div>

                {/* Card visual */}
                <div style={{ maxWidth: 340, margin: "0 auto", width: "100%" }}>
                  <CreditCard {...cardData} focused={focused} />
                </div>

                {/* Bank error alert */}
                {error && (
                  <div
                    ref={errorRef}
                    className="cko-shake"
                    key={error}
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(254,44,85,0.08) 0%, rgba(254,44,85,0.04) 100%)",
                      border: "1px solid rgba(254,44,85,0.35)",
                      borderRadius: 16,
                      padding: "16px 18px",
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      boxShadow:
                        "0 0 30px rgba(254,44,85,0.1), inset 0 1px 0 rgba(254,44,85,0.1)",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        flexShrink: 0,
                        background: "rgba(254,44,85,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AlertTriangle size={18} color="#FE2C55" />
                    </div>
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
                            marginTop: 8,
                            fontSize: 11,
                            color: "#64748b",
                          }}
                        >
                          Cumulative surcharge applied:{" "}
                          <span style={{ color: "#FE2C55", fontWeight: 700 }}>
                            +${surcharges.toFixed(2)}
                          </span>{" "}
                          — Re-enter your card details to retry.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Form */}
                <form
                  onSubmit={handlePayment}
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div>
                    <label className="cko-label">Card Number</label>
                    <div style={{ position: "relative" }}>
                      <input
                        className="cko-input"
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
                          fontFamily: "'JetBrains Mono', monospace",
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
                    <label className="cko-label">Cardholder Name</label>
                    <input
                      className="cko-input"
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
                      <label className="cko-label">Expiry Date</label>
                      <input
                        className="cko-input"
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
                      <label
                        className="cko-label"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        CVV{" "}
                        <span style={{ fontSize: 8, color: "#334155" }}>
                          (flip card to see)
                        </span>
                      </label>
                      <input
                        className="cko-input"
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

                  {/* Loading state */}
                  {loading && (
                    <div
                      style={{
                        background: "rgba(37,244,238,0.04)",
                        border: "1px solid rgba(37,244,238,0.15)",
                        borderRadius: 14,
                        padding: "14px 18px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {loadingMessages.map((msg, i) => (
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
                            <CheckCircle2 size={14} color="#10b981" />
                          ) : i === loadingStep ? (
                            <Loader2
                              size={14}
                              color="#25F4EE"
                              style={{ animation: "spin 1s linear infinite" }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 14,
                                height: 14,
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

                  <button
                    className="cko-btn-pay"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={18}
                          style={{ animation: "spin 1s linear infinite" }}
                        />{" "}
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={16} /> Authorize Payment · $
                        {totalAmount.toFixed(2)}
                      </>
                    )}
                  </button>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div className="cko-divider-line" />
                    <span
                      style={{
                        fontSize: 10,
                        color: "#334155",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Powered by TokVault Secure
                    </span>
                    <div className="cko-divider-line" />
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* SUCCESS SCREEN */
            <div
              style={{
                padding: "60px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
              }}
            >
              {/* Confetti dots */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 8,
                    height: 8,
                    borderRadius: i % 2 === 0 ? "50%" : 2,
                    background:
                      i % 3 === 0
                        ? "#25F4EE"
                        : i % 3 === 1
                          ? "#FE2C55"
                          : "#ffd700",
                    left: `${15 + i * 10}%`,
                    top: `${20 + (i % 3) * 10}%`,
                    animation: `cko-confetti ${0.8 + i * 0.15}s ease-out ${i * 0.1}s forwards`,
                    pointerEvents: "none",
                  }}
                />
              ))}

              {/* Icon */}
              <div
                className="cko-success"
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
                  border: "2px solid rgba(16,185,129,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  boxShadow: "0 0 50px rgba(16,185,129,0.2)",
                }}
              >
                <CheckCircle2 size={44} color="#10b981" />
              </div>

              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h3
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#fff",
                    margin: "0 0 8px",
                  }}
                >
                  Transaction Authorized
                </h3>
                <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                  Your {type === "account" ? "node acquisition" : "migration"}{" "}
                  has been finalized successfully.
                </p>
              </div>

              {/* Receipt */}
              <div
                style={{
                  width: "100%",
                  maxWidth: 420,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20,
                  overflow: "hidden",
                  marginBottom: 28,
                }}
              >
                {/* Receipt header */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(37,244,238,0.08), rgba(254,44,85,0.06))",
                    padding: "16px 24px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: "#25F4EE",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: 2,
                    }}
                  >
                    Payment Receipt
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    #TR-
                    {orderResult
                      ? String(orderResult.id).padStart(5, "0")
                      : "00000"}
                  </span>
                </div>

                {/* Scan line animation */}
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    padding: "20px 24px",
                  }}
                >
                  <div
                    className="cko-scan-bar"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      height: 2,
                      background:
                        "linear-gradient(90deg, transparent, #25F4EE, transparent)",
                    }}
                  />

                  {[
                    [
                      "Date",
                      new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }),
                    ],
                    [
                      "Protocol",
                      type === "account"
                        ? "Node Acquisition"
                        : "Cluster Migration",
                    ],
                    ["Base Fee", `$${basePrice.toFixed(2)}`],
                    ...(surcharges > 0
                      ? [["Bank Surcharge", `+$${surcharges.toFixed(2)}`]]
                      : []),
                  ].map(([k, v], i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#64748b" }}>
                        {k}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: k === "Bank Surcharge" ? "#FE2C55" : "#94a3b8",
                          fontWeight: 600,
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}

                  <div
                    style={{
                      height: 1,
                      background: "rgba(255,255,255,0.05)",
                      margin: "12px 0 16px",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        color: "#fff",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Total Charged
                    </span>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 28,
                          fontWeight: 900,
                          color: "#fff",
                          lineHeight: 1,
                        }}
                      >
                        ${totalAmount.toFixed(2)}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#10b981",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 2,
                          marginTop: 3,
                        }}
                      >
                        ✓ Settled
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dotted separator */}
                <div
                  style={{
                    height: 1,
                    background:
                      "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 6px, transparent 6px, transparent 12px)",
                  }}
                />
                <div
                  style={{
                    padding: "12px 24px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: "#334155",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 3,
                    }}
                  >
                    TokVault Secure · Encrypted
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  maxWidth: 420,
                  height: 52,
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #25F4EE, #0ea5e9)",
                  color: "#000",
                  fontSize: 12,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 30px rgba(37,244,238,0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(37,244,238,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow =
                    "0 8px 30px rgba(37,244,238,0.25)";
                }}
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
