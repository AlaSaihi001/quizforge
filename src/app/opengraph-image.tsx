import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "QuizForge AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "60px",
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, #f5f3ff 0%, #ffffff 50%, #eff6ff 100%)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "40px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            background: "#7c3aed",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            color: "white",
          }}
        >
          ⚡
        </div>
        <span
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          QuizForge AI
        </span>
      </div>

      {/* Titre */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 800,
          color: "#0f172a",
          textAlign: "center",
          lineHeight: 1.2,
          marginBottom: 24,
          position: "relative",
          maxWidth: 900,
        }}
      >
        Turn your notes into{" "}
        <span style={{ color: "#7c3aed" }}>perfect quizzes</span>
      </div>

      {/* Sous-titre */}
      <div
        style={{
          fontSize: 24,
          color: "#64748b",
          textAlign: "center",
          position: "relative",
        }}
      >
        MCQ · Flashcards · Summaries · Free to start
      </div>
    </div>,
    size,
  );
}
