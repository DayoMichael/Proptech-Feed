import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import { SplashScreen } from "@/components/splash-screen";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { JsonLd } from "@/components/json-ld";
import {
  BRAND_COLOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  siteJsonLd,
} from "@/lib/seo";

const openRunde = localFont({
  variable: "--font-sans",
  display: "swap",
  fallback: [
    "ui-rounded",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "sans-serif",
  ],
  src: [
    { path: "./fonts/OpenRunde-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/OpenRunde-Medium.woff2", weight: "500", style: "normal" },
    {
      path: "./fonts/OpenRunde-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    { path: "./fonts/OpenRunde-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · Real estate listings, simplified`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: "/site.webmanifest",
  appleWebApp: { capable: true, title: SITE_NAME },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} · Real estate listings, simplified`,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · Real estate listings, simplified`,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_COLOR,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${openRunde.variable} h-full`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://i.pravatar.cc" crossOrigin="" />
      </head>
      <body className="min-h-full">
        <JsonLd data={siteJsonLd()} />
        <ServiceWorkerRegister />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SplashScreen />
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
