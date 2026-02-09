import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialAuthButtons } from "@/components/auth/SocialButtons";
import { ReactNode } from "react";

interface AuthFormTabsProps {
  signInContent: ReactNode;
  signUpContent: ReactNode;
  defaultTab?: "signin" | "signup";
  hideSignup?: boolean;
}

export function AuthFormTabs({ signInContent, signUpContent, defaultTab = "signin" , hideSignup = false }: AuthFormTabsProps) {
  if (hideSignup) {
    return (
      <div className="w-full">
        <div className="space-y-4">
          {signInContent}
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="signin" className="space-y-4">
        {/* <SocialAuthButtons />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div> */}

        {signInContent}
      </TabsContent>

      <TabsContent value="signup" className="space-y-4">
        {signUpContent}
      </TabsContent>
      </Tabs>
  );
}
