import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
              <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0a",
          }}
        >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -1,
            }}
          >
            Last Legs
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#ffffff",
              opacity: 0.92,
            }}
          >
            AI Ironman Training — From First Step to Finish Line
          </div>
          <div
            style={{
              marginTop: 16,
              padding: "8px 16px",
              borderRadius: 9999,
              background: "#DC143C",
              color: "#fff",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Join the First Wave
          </div>
        </div>
      </div>
    ),
    size
  );
}
