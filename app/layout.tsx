import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#6D35E8",
};

export const metadata: Metadata = {
  title: "SafeRoute Women — AI Urban Safety & Navigation Platform",
  description:
    "Travel safer. Stay connected. SafeRoute Women analyzes crowd activity, lighting corridors, and CCTV coverage to provide safety-aware navigation and emergency protection.",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SafeRoute",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-brand-soft text-brand-navy antialiased flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
