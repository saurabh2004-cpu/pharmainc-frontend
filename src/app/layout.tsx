import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { twitterChirp } from "@/lib/fonts";
import { WelcomeProvider } from "@/components/WelcomeProvider";
import { EntityProvider } from "@/components/EntityProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pharminc",
  description: "", // TODO
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${twitterChirp.variable} min-h-screen flex flex-col font-chirp overflow-y-scroll`}>
        <div className="flex flex-col grow">{children}</div>
        <Toaster />
        <WelcomeProvider />
        <EntityProvider />
      </body>
    </html>
  );
}
