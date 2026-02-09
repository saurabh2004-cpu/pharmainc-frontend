import type { Metadata } from "next";
import { SidePanel } from "@/components/auth/SidePanel";

export const metadata: Metadata = {
  title: "Pharminc - Login",
  description: "Join the PharmInc medical network",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen bg-white overflow-y-auto">
      <div className="min-h-screen flex">
        <div className="w-full lg:flex-1">
          <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-8 bg-white">
            {children}
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2 sticky top-0 h-screen">
          <SidePanel />
        </div>
      </div>
    </div>
  );
}
