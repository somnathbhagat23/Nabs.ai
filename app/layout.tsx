import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nabs.ai",
  description: "AI-guided human-to-human connection"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
