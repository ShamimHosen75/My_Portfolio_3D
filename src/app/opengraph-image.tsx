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
        justifyContent: "center",
        padding: "80px 90px",
        backgroundColor: "#0b080c",
        backgroundImage: "radial-gradient(circle at 105% 50%, rgba(127,64,255,0.55) 0%, rgba(127,64,255,0) 38%)",
        color: "#eae5ec",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 40, color: "#c2a4ff" }}>Hello! I&apos;m</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 10,
          fontSize: 104,
          fontWeight: 700,
          lineHeight: 1,
          textTransform: "uppercase",
        }}
      >
        <span>{site.heroName[0]}</span>
        <span>{site.heroName[1]}</span>
      </div>
      <div style={{ display: "flex", marginTop: 44, fontSize: 36, color: "#a29fa6" }}>
        A Creative <span style={{ color: "#c2a4ff", margin: "0 12px", fontWeight: 700 }}>FULL STACK</span> Developer · {site.role}
      </div>
    </div>,
    size,
  );
}
