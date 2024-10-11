import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PHProvider } from "./providers";
import dynamic from "next/dynamic";

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "ПРОЦЕНКА",
  description: "Все поставщики в одном месте.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PHProvider>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <PostHogPageView />
          {children}
        </body>
      </PHProvider>
    </html>
  );
}
