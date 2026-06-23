import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import { SplashScreen } from "@/components/splash-screen";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

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
  title: "Expert Listing · Property Feed",
  description:
    "A fast, mobile-first property feed for Nigeria. Browse listings, stories, and conversations  built to stay usable on slow networks.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Expert Listing" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
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
      </body>
    </html>
  );
}
