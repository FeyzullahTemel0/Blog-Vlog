import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SplashGate } from "@/components/ui/SplashGate";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yolcunundefteri.example.com"),
  title: {
    default: "Yolcunun Defteri · Deniz Arslan",
    template: "%s · Yolcunun Defteri",
  },
  description:
    "Gezgin Deniz Arslan'ın yolculuk notları, şehir rehberleri, yemek rotaları ve anlık konumu.",
  applicationName: "Yolcunun Defteri",
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Yolcunun Defteri",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF8F3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <ToastProvider>
          <SplashGate>{children}</SplashGate>
        </ToastProvider>
      </body>
    </html>
  );
}
