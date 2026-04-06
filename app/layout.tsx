import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { fetchTotalCaseCount } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "VisaPulse — Real visa outcomes from real people",
  description:
    "Crowdsourced visa approval and rejection statistics. Submit your case and explore real-world data.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const totalCases = await fetchTotalCaseCount();

  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-background antialiased`}
      >
        <Header totalCases={totalCases} />
        <main>{children}</main>
      </body>
    </html>
  );
}
