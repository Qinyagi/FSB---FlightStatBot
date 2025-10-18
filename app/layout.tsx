import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "FlightStat Bot 2025 - Professional Flight Monitoring",
  description: "State-of-the-art flight monitoring application with real-time FlightAware integration, glassmorphism UI, and advanced micro-interactions.",
  keywords: ["flight tracking", "aviation", "FlightAware", "real-time", "monitoring"],
  authors: [{ name: "FlightStat Bot Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00d4ff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}