import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import ToastContainer from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalCountdown from "@/components/GlobalCountdown";
import ClickBurst from "@/components/ClickBurst";
import StartupIntro from "@/components/StartupIntro";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-ibm-plex-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ธิติ แซ่ลี้ - ผู้สมัครหมายเลข 2",
  description:
    "เว็บไซต์หาเสียงสภานักเรียนของ ธิติ แซ่ลี้ ผู้สมัครหมายเลข 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={ibmPlexSansThai.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 leading-relaxed">
        <AppProvider>
          <StartupIntro />
          <Navbar />
          <GlobalCountdown />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastContainer />
          <ClickBurst />
        </AppProvider>
      </body>
    </html>
  );
}
