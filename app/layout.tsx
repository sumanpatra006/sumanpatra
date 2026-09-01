import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CRTOverlay } from "@/app/components/CRTOverlay";
import { SmoothScrollProvider } from "@/app/components/providers/SmoothScrollProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "K. Suman Patra — Software Engineer | human.exe",
  description:
    "Backend-leaning Software Engineer. B.Tech IT student building backend systems — currently shipping at JPMorgan Chase. Portfolio as a running software system.",
  keywords: [
    "software engineer",
    "backend developer",
    "Java",
    "Spring Boot",
    "Node.js",
    "portfolio",
    "K. Suman Patra",
  ],
  authors: [{ name: "K. Suman Patra" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${plusJakarta.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased bg-bg-primary text-text-primary">
        <CRTOverlay />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
