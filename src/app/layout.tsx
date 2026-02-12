import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Heebo } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kprestige.com'),
  title: "K PRESTIGE | Pessah 2026 - Cabogata Beach Hotel 5★",
  description: "Séjour Pessah 2026 au Cabogata Beach Hotel 5★ en Espagne. Glatt Kasher Laméhadrine. 31 Mars - 10 Avril 2026.",
  openGraph: {
    siteName: 'K Prestige',
    type: 'website',
    images: [
      {
        url: '/images/hero/PANORAMIC.jpg',
        width: 1200,
        height: 630,
        alt: 'K Prestige - Pessah 2026',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7BFTQ835K0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7BFTQ835K0');
          `}
        </Script>
      </head>
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${heebo.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
