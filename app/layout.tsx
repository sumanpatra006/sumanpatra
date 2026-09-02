import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CRTOverlay } from "@/app/components/CRTOverlay";
import { SmoothScrollProvider } from "@/app/components/providers/SmoothScrollProvider";
import { Analytics } from "@vercel/analytics/next";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sumanpatra.vercel.app";

export const viewport: Viewport = {
  themeColor: "#0a0e14",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "K. Suman Patra — Software Engineer | human.exe",
    template: "%s | K. Suman Patra",
  },
  description:
    "Backend Software Engineer & B.Tech IT student at VSSUT Burla (CGPA 9.36). Previous SWE Intern at JPMorgan Chase (CCB Wealth Management) & GramIQ. Led JPMC Code for Good 1st place team. Building scalable distributed systems and backend architectures.",
  applicationName: "K. Suman Patra Portfolio",
  authors: [{ name: "K. Suman Patra", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "K. Suman Patra",
    "Suman Patra",
    "Software Engineer",
    "Backend Engineer",
    "Java",
    "Spring Boot",
    "Node.js",
    "Express.js",
    "TypeScript",
    "PostgreSQL",
    "Redis",
    "Prisma ORM",
    "Distributed Systems",
    "JPMorgan Chase",
    "Code For Good",
    "VSSUT Burla",
    "Portfolio",
    "Full-Stack Developer",
  ],
  creator: "K. Suman Patra",
  publisher: "K. Suman Patra",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "K. Suman Patra — Software Engineer | human.exe",
    description:
      "Backend Software Engineer & B.Tech IT student at VSSUT Burla (CGPA 9.36). Previous SWE Intern at JPMorgan Chase & GramIQ. 1st place winner at JPMC Code for Good.",
    siteName: "K. Suman Patra Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "K. Suman Patra — Software Engineer | human.exe",
    description:
      "Backend Software Engineer & B.Tech IT student at VSSUT Burla (CGPA 9.36). Previous SWE Intern at JPMorgan Chase & GramIQ.",
    creator: "@ksumanpatra",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "K. Suman Patra",
      url: siteUrl,
      jobTitle: "Software Engineer",
      description:
        "Backend Software Engineer & B.Tech IT student at VSSUT Burla. Previous SWE Intern at JPMorgan Chase and GramIQ.",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Veer Surendra Sai University of Technology (VSSUT), Burla",
      },
      email: "mailto:ksumanpatra06@gmail.com",
      telephone: "+91-7855925132",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Berhampur",
        addressRegion: "Odisha",
        addressCountry: "IN",
      },
      sameAs: [
        "https://www.linkedin.com/in/ksumanpatra",
        "https://github.com/sumanpatra006",
      ],
      knowsAbout: [
        "Java",
        "Spring Boot",
        "Node.js",
        "Express.js",
        "PostgreSQL",
        "Prisma ORM",
        "Redis",
        "TypeScript",
        "React.js",
        "Distributed Systems",
        "AWS",
        "Splunk",
        "Control-M",
        "Docker",
        "Jenkins CI/CD",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "K. Suman Patra — Portfolio",
      description: "Interactive portfolio and system architecture of K. Suman Patra.",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "K. Suman Patra — Software Engineer | human.exe",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#person`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.ico`,
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${plusJakarta.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-bg-primary text-text-primary">
        <CRTOverlay />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}
