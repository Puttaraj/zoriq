import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ZORIQ — Fast, Private, Free Online Tools";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090B",
        position: "relative",
        fontFamily: "sans-serif",
        color: "#ffffff",
      }}
    >
      {/* Soft glowing ambient circle backdrops */}
      <div
        style={{
          position: "absolute",
          top: "-150px",
          left: "-150px",
          width: "500px",
          height: "500px",
          borderRadius: "500px",
          background:
            "radial-gradient(circle, rgba(108,58,237,0.12) 0%, rgba(0,0,0,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          right: "-150px",
          width: "500px",
          height: "500px",
          borderRadius: "500px",
          background:
            "radial-gradient(circle, rgba(6,214,160,0.06) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Central Logo Container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Custom brand SVG */}
        <svg
          viewBox="0 0 32 32"
          width="80"
          height="80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 6h18v4l-11 11.5H25V26H7v-4l11-11.5H7V6z" fill="#ffffff" />
          <circle cx="23.5" cy="7.5" r="2.5" fill="#06D6A0" />
        </svg>

        <span
          style={{
            fontSize: "64px",
            fontWeight: 900,
            letterSpacing: "-2px",
          }}
        >
          ZORIQ
        </span>
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "28px",
          fontWeight: 500,
          color: "#a1a1aa",
          textAlign: "center",
          maxWidth: "700px",
          margin: "0 0 40px 0",
          lineHeight: 1.4,
        }}
      >
        Fast. Private. Free. Online Tools.
      </p>

      {/* Badge list row */}
      <div
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        <span
          style={{
            background: "rgba(108, 58, 237, 0.15)",
            color: "#8B5CF6",
            border: "1px solid rgba(108, 58, 237, 0.3)",
            borderRadius: "30px",
            padding: "8px 20px",
            fontSize: "14px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          100% Client-Side
        </span>
        <span
          style={{
            background: "rgba(6, 214, 160, 0.15)",
            color: "#06D6A0",
            border: "1px solid rgba(6, 214, 160, 0.3)",
            borderRadius: "30px",
            padding: "8px 20px",
            fontSize: "14px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Zero Sign Up
        </span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
