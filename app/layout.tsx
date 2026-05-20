import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AICostLens | AI Spend Audit",
  description:
    "Find hidden waste across Cursor, Claude, ChatGPT, Copilot, Gemini, and AI API spend."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
