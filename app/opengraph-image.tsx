import { ImageResponse } from "next/og";

// Statically generated at build time (output: export emits a real PNG).
export const dynamic = "force-static";
export const alt = "Loop Engineering — Crash Course";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0E14",
          color: "#E8E6E1",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9999,
              background: "#99744A",
            }}
          />
          <div style={{ fontSize: 30, color: "#9AA3B2" }}>Loop Engineering</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.05 }}>
            Stop prompting.
          </div>
          <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.05 }}>
            Start looping.
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#9AA3B2" }}>
            A hands-on crash course in loop engineering · MIT
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#99744A" }}>
          6 parts · 20 starter kits · 11 projects
        </div>
      </div>
    ),
    { ...size },
  );
}
