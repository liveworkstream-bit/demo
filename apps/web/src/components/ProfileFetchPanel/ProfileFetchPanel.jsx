import React from "react";
import { User, Search, Loader2 } from "lucide-react";

export default function ProfileFetchPanel({
  username,
  setUsername,
  scraperLoading,
  onSubmit,
}) {
  return (
    <div
      style={{
        background: "#090d17",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 20,
        padding: "26px 28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(37,244,238,0.05) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />

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
        Step 1 — Target Profile
      </div>

      <form onSubmit={onSubmit}>
        <div style={{ position: "relative", marginBottom: 14 }}>
          <User
            size={18}
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
            className="conv-input"
            type="text"
            placeholder="Enter TikTok username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={scraperLoading || !username.trim()}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: scraperLoading
              ? "rgba(37,244,238,0.1)"
              : "linear-gradient(135deg,#25F4EE,#0ea5e9)",
            color: scraperLoading ? "#25F4EE" : "#000",
            fontSize: 12,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor:
              scraperLoading || !username.trim() ? "not-allowed" : "pointer",
            opacity: !username.trim() ? 0.4 : 1,
            transition: "all 0.2s ease",
            boxShadow: scraperLoading
              ? "none"
              : "0 6px 20px rgba(37,244,238,0.25)",
          }}
        >
          {scraperLoading ? (
            <>
              <Loader2
                size={16}
                style={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Scanning Profile...
            </>
          ) : (
            <>
              <Search size={15} /> Fetch Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
}
