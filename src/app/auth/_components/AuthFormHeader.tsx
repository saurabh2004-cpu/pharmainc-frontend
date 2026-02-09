import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { BackButton } from "@/components/auth/BackButton";

interface AuthFormHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

export function AuthFormHeader({ icon: Icon, title, subtitle, showBackButton = true }: AuthFormHeaderProps) {
  return (
    <div className="mb-8 w-full">
      <div className="mb-12">
        {showBackButton ? (
          <div className="flex items-center gap-4">
            <BackButton />
            <Link href="/" className="inline-flex items-center">
              <img
                src="/logo.png"
                alt="PharmInc Logo"
                className="h-10 w-auto rounded-md"
              />
            </Link>
          </div>
        ) : (
          <Link href="/" className="inline-flex items-center">
            <img
              src="/logo.png"
              alt="PharmInc Logo"
              className="h-10 w-auto rounded-md"
            />
          </Link>
        )}
      </div>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}
