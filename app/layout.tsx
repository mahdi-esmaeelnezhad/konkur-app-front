import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "کنکور ترکر",
  description: "اپ موبایل ردیابی مطالعه و کنکور",
  applicationName: "کنکور ترکر",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "کنکور ترکر",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#020617",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className="min-h-dvh bg-slate-950 text-slate-100 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
