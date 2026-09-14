import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Italianno } from "next/font/google";
import { weddingData } from "@/data/wedding";
import { asset } from "@/lib/assets";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
  preload: false,
});

const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italianno",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#5B0F22",
};

export const metadata: Metadata = {
  title: `${weddingData.bride} & ${weddingData.groom}`,
  description: `A wedding invitation for ${weddingData.bride} and ${weddingData.groom}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${greatVibes.variable} ${italianno.variable}`}
      style={{
        background: "#5B0F22",
        ["--tex-paper" as string]: `url("${asset("/textures/paper.png")}")`,
        ["--tex-envelope" as string]: `url("${asset("/textures/envelope-closed.png")}")`,
        ["--tex-burgundy" as string]: `url("${asset("/textures/burgundy.png")}")`,
        ["--tex-grain" as string]: `url("${asset("/textures/grain.png")}")`,
      }}
    >
      <body style={{ background: "#5B0F22", margin: 0 }}>{children}</body>
    </html>
  );
}
