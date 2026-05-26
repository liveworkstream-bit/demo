import React from "react";
import { CheckCircle2, Users, Heart, Video } from "lucide-react";

export default function ProfileCard({ profileData, username }) {
  if (!profileData) return null;

  return (
    <div
      className="profile-card"
      style={{
        marginTop: 20,
        paddingTop: 20,
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "2px solid rgba(37,244,238,0.3)",
              overflow: "hidden",
              background: "#1e293b",
            }}
          >
            <img
              src={profileData.profile_image}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          {profileData.verified && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#25F4EE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #090d17",
              }}
            >
              <CheckCircle2 size={11} color="#000" />
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            {profileData.nickname}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#25F4EE",
              fontFamily: "monospace",
              marginTop: 2,
            }}
          >
            @{username}
          </div>
          {profileData.signature && (
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                marginTop: 6,
                fontStyle: "italic",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {profileData.signature}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginTop: 16,
        }}
      >
        {[
          {
            label: "Followers",
            value: profileData.followers,
            icon: Users,
            color: "#25F4EE",
          },
          {
            label: "Hearts",
            value: profileData.hearts,
            icon: Heart,
            color: "#FE2C55",
          },
          {
            label: "Videos",
            value: profileData.video_count,
            icon: Video,
            color: "#8b5cf6",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: 12,
              padding: "10px 8px",
              textAlign: "center",
            }}
          >
            <s.icon
              size={13}
              color={s.color}
              style={{ margin: "0 auto 4px" }}
            />
            <div
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              {s.value >= 1000 ? (s.value / 1000).toFixed(1) + "k" : s.value}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#64748b",
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
    </div>
  );
}
