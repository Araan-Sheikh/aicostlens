import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
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
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
