import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { twitterChirp, figtree, poppins, nunito } from "@/lib/fonts";
import { WelcomeProvider } from "@/components/WelcomeProvider";
import { EntityProvider } from "@/components/EntityProvider";
import Script from "next/script";

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
      <body className={`${twitterChirp.variable} ${figtree.variable} ${poppins.variable} ${nunito.variable} min-h-screen flex flex-col font-chirp overflow-y-scroll`}>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
        <div className="flex flex-col grow">{children}</div>
        <Toaster />
        <WelcomeProvider />
        <EntityProvider />
      </body>
    </html>
  );
}
