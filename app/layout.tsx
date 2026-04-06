import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VisaPulse — Real visa outcomes from real people",
  description:
    "Crowdsourced visa approval and rejection statistics. Submit your case and explore real-world data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-background antialiased`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
