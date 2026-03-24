import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface SignUpFormProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
  country: string;
  city: string;

  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLocationChange: (value: string) => void; // Removed

  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;

  countryOptions: { label: string; value: string }[];
  cityOptions: { label: string; value: string }[];
  loadingCountries?: boolean;
  loadingCities?: boolean;

  onSubmit: () => void;
  loading?: boolean;
  roleSpecificFields?: React.ReactNode;
  errors?: Record<string, string>;
}

export function SignUpForm({
  firstName,
  lastName,
  email,
  password,
  country,
  city,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onCountryChange,
  onCityChange,
  countryOptions,
  cityOptions,
  loadingCountries = false,
  loadingCities = false,
  onSubmit,
  loading = false,
  roleSpecificFields,
  errors = {}
}: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-600">First Name</Label>
          <Input
            id="firstName"
            placeholder="First name"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            disabled={loading}
            className={`h-11 bg-gray-50 border-gray-200 focus:bg-white ${errors.firstName ? "border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-600">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            disabled={loading}
            className={`h-11 bg-gray-50 border-gray-200 focus:bg-white ${errors.lastName ? "border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-gray-600">Email</Label>
        <Input
          id="signup-email"
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
        <Label htmlFor="signup-password" className="text-gray-600">Password</Label>
        <div className="relative">
          <Input
            id="signup-password"
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country" className="text-gray-600">Country</Label>
          <SearchableSelect
            options={countryOptions}
            value={country || ""}
            onValueChange={onCountryChange}
            placeholder={loadingCountries ? "Loading..." : "Select Country"}
            searchPlaceholder="Search country..."
            emptyMessage="No country found."
            disabled={loading || loadingCountries}
            className={`h-11 bg-gray-50 border-gray-200 focus:bg-white ${errors.country ? "border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-gray-600">City</Label>
          <SearchableSelect
            options={cityOptions}
            value={city || ""}
            onValueChange={onCityChange}
            placeholder={loadingCities ? "Loading..." : "Select City"}
            searchPlaceholder="Search city..."
            emptyMessage="No city found."
            disabled={loading || !country || loadingCities}
            className={`h-11 bg-gray-50 border-gray-200 focus:bg-white ${errors.city ? "border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
      </div>


      {roleSpecificFields}

      < div className="flex items-center space-x-2" >
        <Checkbox id="terms" />
        <Label htmlFor="terms" className="text-sm">
          I agree to the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div >

      <Button
        onClick={onSubmit}
        className="w-full bg-[#233F64] hover:bg-[#169BA4] text-white font-semibold h-11 rounded-lg"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Sign up"}
      </Button>
    </div >
  );
}

