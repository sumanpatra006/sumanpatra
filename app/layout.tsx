import type { Metadata } from "next";
import { Chakra_Petch, Fira_Code, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CRTOverlay } from "@/app/components/CRTOverlay";
import { SmoothScrollProvider } from "@/app/components/providers/SmoothScrollProvider";

const chakraPetch = Chakra_Petch({
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${chakraPetch.variable} ${firaCode.variable} ${plusJakarta.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <CRTOverlay />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
