import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutContent from "../../components/LayoutContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pharminc",
  description: "", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <LayoutContent>{children}</LayoutContent>
    </div>
  );
}
