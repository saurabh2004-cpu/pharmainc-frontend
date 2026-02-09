import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ProfileLayoutContent from "./_components/ProfileLayoutContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Profile - Pharminc",
  description: "View and manage user profiles", 
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <ProfileLayoutContent>{children}</ProfileLayoutContent>
    </div>
  );
}
