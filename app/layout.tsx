import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Women Safety Route System (WSRS) - Karur District",
  description:
    "AI-driven Women Safety Route System prototype for Karur District, Tamil Nadu, analyzing human activity and person density for safer destination routing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-navy-900 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
