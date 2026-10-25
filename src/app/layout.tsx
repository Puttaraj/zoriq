import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/shared/command-palette";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.zoriq.co.in"),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  alternates: {
    canonical: "./",
  },
  keywords: [
    "online tools",
    "free tools",
    "image compressor",
    "pdf tools",
    "qr code generator",
    "password generator",
    "json formatter",
    "developer tools",
    "zoriq",
  ],
  authors: [{ name: "ZORIQ", url: siteConfig.url }],
  creator: "ZORIQ",
  publisher: "ZORIQ",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFBFC" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4140052534392830"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cn(
          inter.variable,
          jakarta.variable,
          "bg-background min-h-screen font-sans antialiased",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            {/* Soft Blurred Ambient circles for Premium Mesh Gradient */}
            <div
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
              aria-hidden="true"
            >
              <div className="bg-primary/10 dark:bg-primary/5 animate-float absolute -top-[20%] left-[10%] h-[500px] w-[500px] rounded-full blur-[130px]" />
              <div
                className="bg-secondary/8 dark:bg-secondary/4 animate-float absolute top-[25%] -right-[15%] h-[500px] w-[500px] rounded-full blur-[130px]"
                style={{ animationDelay: "-3s" }}
              />
              <div
                className="bg-accent-surface/5 dark:bg-accent-surface/2 animate-float absolute -bottom-[10%] left-[20%] h-[400px] w-[400px] rounded-full blur-[120px]"
                style={{ animationDelay: "-6s" }}
              />
            </div>
            <Header />
            <CommandPalette />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
