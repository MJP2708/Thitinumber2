import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import ToastContainer from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thiti Saelee - Candidate No. 2 | Students First, Future Forward",
  description:
    "Student Council Campaign Website for Thiti Saelee, Candidate Number 2. Students First, Future Forward.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
