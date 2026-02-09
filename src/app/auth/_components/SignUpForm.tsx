import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SignUpFormProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // location: string; // Removed
  country: string;
  city: string;

  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  // onLocationChange: (value: string) => void; // Removed

  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;

  countryOptions: { label: string; value: string }[];
  cityOptions: { label: string; value: string }[];
  loadingCountries?: boolean;
  loadingCities?: boolean;

  onSubmit: () => void;
  loading?: boolean;
  roleSpecificFields?: React.ReactNode;
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
  roleSpecificFields
}: SignUpFormProps) {
  const isFormValid = firstName && lastName && email && password && country && city;

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
            className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-600">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            disabled={loading}
            className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
          />
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
          className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-gray-600">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          disabled={loading}
          className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country" className="text-gray-600">Country</Label>
          <Select
            value={country}
            onValueChange={onCountryChange}
            disabled={loading || loadingCountries}
          >
            <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:bg-white">
              <SelectValue placeholder={loadingCountries ? "Loading..." : "Select Country"} />
            </SelectTrigger>
            <SelectContent>
              {countryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-gray-600">City</Label>
          <Select
            value={city}
            onValueChange={onCityChange}
            disabled={loading || !country || loadingCities}
          >
            <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:bg-white">
              <SelectValue placeholder={loadingCities ? "Loading..." : "Select City"} />
            </SelectTrigger>
            <SelectContent>
              {cityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {roleSpecificFields}

      <div className="flex items-center space-x-2">
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
      </div>

      <Button
        onClick={onSubmit}
        className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold h-11 rounded-lg"
        disabled={loading || !isFormValid}
      >
        {loading ? "Creating account..." : "Sign up"}
      </Button>
    </div>
  );
}

