import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SafeLens AI — AI-Powered Location Safety Intelligence",
  description:
    "See the Area. Understand the Risk. Choose Your Path. SafeLens AI analyzes crowd activity, location signals, and safety indicators to help you make informed travel decisions.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-brand-bg text-brand-navy antialiased`}>
        {children}
      </body>
    </html>
  );
}
