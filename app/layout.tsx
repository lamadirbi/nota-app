import { ServiceWorker } from "@/components/ServiceWorker";
import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "نوتة",
  description: "ملاحظات صفراء، مصاريف، وأزرار سريعة قابلة للتثبيت على الهاتف",
  applicationName: "نوتة",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "نوتة",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFD54F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--bg)] font-sans text-[var(--ink)]">
        <ServiceWorker />
        {children}
      </body>
    </html>
  );
}
