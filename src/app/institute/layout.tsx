import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import InstituteLayoutContent from "./_components/InstituteLayoutContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Institution - Pharminc",
  description: "View and manage institution profiles", 
};

export default function InstituteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <InstituteLayoutContent>{children}</InstituteLayoutContent>
    </div>
  );
}
