import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: "#09090B",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "36px",
      }}
    >
      <svg
        viewBox="0 0 32 32"
        width="110"
        height="110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 6h18v4l-11 11.5H25V26H7v-4l11-11.5H7V6z" fill="#ffffff" />
        <circle cx="23.5" cy="7.5" r="2.5" fill="#06D6A0" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
