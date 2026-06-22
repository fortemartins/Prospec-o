import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const gantari = localFont({
  src: [
    {
      path: "../Familia Gantari/Gantari-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../Familia Gantari/Gantari-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-gantari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GFM Eventos - Prospecção",
  description: "App de prospecção para feiras corporativas - GFM Eventos",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GFM Prospecção",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#102a43",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${gantari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-gantari)]">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
