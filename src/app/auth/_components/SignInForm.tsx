import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface SignInFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  errors?: Record<string, string>;
}

export function SignInForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading = false,
  errors = {}
}: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="signin-email" className="text-gray-600">Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="Johndoe@gmail.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={loading}
          className={`h-11 bg-gray-50 border-gray-200 focus:bg-white ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signin-password" className="text-gray-600">Password</Label>
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            disabled={loading}
            className={`h-11 bg-gray-50 border-gray-200 focus:bg-white pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm text-gray-600">
            Remember me
          </Label>
        </div>
        <a href="#" className="text-sm text-[#7C3AED] hover:underline font-medium">
          Forgot Password
        </a>
      </div>

      <Button
        onClick={onSubmit}
        className="w-full bg-[#233F64] hover:bg-[#169BA4] text-white font-semibold h-11 rounded-lg mt-2"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </div>
  );
}
