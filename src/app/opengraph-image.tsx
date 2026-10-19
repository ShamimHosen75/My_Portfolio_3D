import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "linear-gradient(135deg, #163A42 0%, #0F2A30 60%)",
        color: "#DCE7E2",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width="64" height="64" viewBox="0 0 32 32">
          <polygon points="16,2.5 28.5,9.5 16,16.5 3.5,9.5" fill="#F2A541" />
          <polygon points="3.5,9.5 16,16.5 16,30 3.5,23" fill="#C77F24" />
          <polygon points="28.5,9.5 16,16.5 16,30 28.5,23" fill="#F7C77A" />
        </svg>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 22px",
            borderRadius: 999,
            border: "2px solid rgba(220,231,226,0.18)",
            fontSize: 26,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#F2A541",
            }}
          />
          Open to work
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {site.name}
          <span style={{ color: "#F2A541" }}>.</span>
        </div>
        <div style={{ marginTop: 28, fontSize: 38, color: "#9FB5B0" }}>
          {site.tagline}
        </div>
      </div>
    </div>,
    size,
  );
}
