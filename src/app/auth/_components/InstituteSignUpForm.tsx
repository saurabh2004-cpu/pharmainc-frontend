import { useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";

export const INSTITUTE_TYPES = [
    "Hospital",
    "Clinic",
    "LAB",
    "PHARMACY"
];

export const INSTITUTE_SERVICES = [
    "Emergency Services / Trauma Center",
    "Inpatient Surgical Services",
    "Outpatient Services",
    "Intensive Care Unit (ICU)",
    "Maternity Services",
    "Mental Health Services",
];

interface InstituteSignUpFormProps {
    // Form fields
    name: string;
    country: string;
    city: string;
    email: string; // contactEmail
    password: string;
    // location: string; // Removed per user request
    contactNumber: string;
    type: string;
    services: string[];
    bedsCount: string;
    staffCount: string;

    // Handlers
    onNameChange: (value: string) => void;
    onCountryChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    // onLocationChange: (value: string) => void; // Removed per user request
    onContactNumberChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onServicesChange: (value: string[]) => void;
    onBedsCountChange: (value: string) => void;
    onStaffCountChange: (value: string) => void;



    // Dropdown Data
    countryOptions: { label: string; value: string }[];
    cityOptions: { label: string; value: string }[];
    loadingCountries?: boolean;
    loadingCities?: boolean;

    onSubmit: () => void;
    loading?: boolean;
    errors?: Record<string, string>;
}

export function InstituteSignUpForm({
    name,
    country,
    city,
    email,
    password,
    // location,
    contactNumber,
    type,
    services,
    bedsCount,
    staffCount,
    onNameChange,
    onCountryChange,
    onCityChange,
    onEmailChange,
    onPasswordChange,
    // onLocationChange,
    onContactNumberChange,
    onTypeChange,
    onServicesChange,
    onBedsCountChange,
    onStaffCountChange,
    countryOptions,
    cityOptions,
    loadingCountries = false,
    loadingCities = false,
    onSubmit,
    loading = false,
    errors = {}
}: InstituteSignUpFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    const toggleService = (service: string) => {
        if (services.includes(service)) {
            onServicesChange(services.filter((s) => s !== service));
        } else {
            onServicesChange([...services, service]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="institute-name" className="text-gray-600">Institution Name *</Label>
                <Input
                    id="institute-name"
                    placeholder="e.g. City General Hospital"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    disabled={loading}
                    className={`h-11 bg-gray-50 border-gray-200 focus:bg-white ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="country" className="text-gray-600">Country *</Label>
                    <Select
                        value={country}
                        onValueChange={onCountryChange}
                        disabled={loading || loadingCountries}
                    >
                        <SelectTrigger className={`h-11 bg-gray-50 border-gray-200 focus:bg-white ${errors.country ? "border-red-500 focus:ring-red-500" : ""}`}>
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
                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city" className="text-gray-600">City *</Label>
                    <Select
                        value={city}
                        onValueChange={onCityChange}
                        disabled={loading || !country || loadingCities}
                    >
                        <SelectTrigger className={`h-11 bg-gray-50 border-gray-200 focus:bg-white ${errors.city ? "border-red-500 focus:ring-red-500" : ""}`}>
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
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="institute-type" className="text-gray-600">Institute Type *</Label>
                    <Select value={type} onValueChange={onTypeChange} disabled={loading}>
                        <SelectTrigger className={`h-11 bg-gray-50 border-gray-200 focus:bg-white ${errors.type ? "border-red-500 focus:ring-red-500" : ""}`}>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {INSTITUTE_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>
                                    {t}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-gray-600">Contact Email *</Label>
                <Input
                    id="contact-email"
                    type="email"
                    placeholder="contact@hospital.com"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    disabled={loading}
                    className={`h-11 bg-gray-50 border-gray-200 focus:bg-white ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="contact-number" className="text-gray-600">Contact Number *</Label>
                    <Input
                        id="contact-number"
                        placeholder="+1 234 567 8900"
                        value={contactNumber}
                        onChange={(e) => onContactNumberChange(e.target.value)}
                        disabled={loading}
                        className={`h-11 bg-gray-50 border-gray-200 focus:bg-white ${errors.contactNumber ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-600">Password *</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                            disabled={loading}
                            className={`h-11 bg-gray-50 border-gray-200 focus:bg-white pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="beds-count" className="text-gray-600">Beds Count</Label>
                    <Input
                        id="beds-count"
                        type="number"
                        placeholder="0"
                        value={bedsCount}
                        onChange={(e) => onBedsCountChange(e.target.value)}
                        disabled={loading}
                        className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="staff-count" className="text-gray-600">Staff Count</Label>
                    <Input
                        id="staff-count"
                        type="number"
                        placeholder="0"
                        value={staffCount}
                        onChange={(e) => onStaffCountChange(e.target.value)}
                        disabled={loading}
                        className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                    />
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <Label className="text-gray-600">Services Provided *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {INSTITUTE_SERVICES.map((service) => (
                        <div key={service} className="flex items-start space-x-2">
                            <Checkbox
                                id={`service-${service}`}
                                checked={services.includes(service)}
                                onCheckedChange={() => toggleService(service)}
                                disabled={loading}
                            />
                            <Label
                                htmlFor={`service-${service}`}
                                className="text-sm font-normal leading-tight cursor-pointer"
                            >
                                {service}
                            </Label>
                        </div>
                    ))}
                </div>
                {services.length === 0 && (
                    <p className="text-xs text-red-500">Please select at least one service.</p>
                )}
                {errors.services && <p className="text-red-500 text-xs mt-1">{errors.services}</p>}
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-purple-600 hover:underline">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-purple-600 hover:underline">
                        Privacy Policy
                    </a>
                </Label>
            </div>

            <Button
                onClick={onSubmit}
                className="w-full bg-[#233F64] hover:bg-[#169BA4] text-white font-semibold h-11 rounded-lg mt-2"
                disabled={loading}
            >
                {loading ? "Creating Institution Account..." : "Register Institution"}
            </Button>
        </div>
    );
}
