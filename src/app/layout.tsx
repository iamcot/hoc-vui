import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/lib/store";
import { AppShell } from "@/components/AppShell";

const nunito = Nunito({ subsets: ["latin", "vietnamese"], variable: "--font-nunito", display: "swap" });
const baloo = Baloo_2({ subsets: ["latin", "vietnamese"], variable: "--font-baloo", weight: ["600", "700", "800"], display: "swap" });

export const metadata: Metadata = {
  title: "Học Vui",
  description: "Học vui mỗi ngày: bài học trực quan, bài tập, kiểm tra, thi đấu cùng bạn bè.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Học Vui", statusBarStyle: "default" },
  icons: { icon: "/icons/icon.svg", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#fffaf3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${nunito.variable} ${baloo.variable}`}>
      <body className="font-sans antialiased">
        <ProgressProvider>
          <AppShell>{children}</AppShell>
        </ProgressProvider>
      </body>
    </html>
  );
}
