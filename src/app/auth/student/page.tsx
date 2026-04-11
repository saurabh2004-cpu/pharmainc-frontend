"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { login, register, RoleEnum, fetchCountries as fetchCountriesService, fetchCitiesByCountry, LocationOption } from "@/lib/api";
import { useEntityStore } from "@/store/entityStore";
import { EntityType } from "@/lib/api/types";
import { AuthFormHeader, AuthFormTabs, SignInForm, SignUpForm } from "../_components";
import { toast } from "sonner";
import healthcareRoles from "@/lib/constants/healthcareRoles.json";

// Type assertion for the JSON data
const rolesData = healthcareRoles as Record<string, Record<string, string[]>>;

// cleaned up imports

// ... existing imports

function StudentAuthContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [location, setLocation] = useState(""); // Removed

  // Country & City State
  const [country, setCountry] = useState("India"); // Default to India
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const [university, setUniversity] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");

  // Speciality & Sub-Speciality (Role is implicitly STUDENT)
  const [speciality, setSpeciality] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [subSpeciality, setSubSpeciality] = useState("");


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Derived options for Student
  const specialityOptions = Object.keys(rolesData["STUDENT"] || {});
  const subSpecialityOptions = speciality ? (rolesData["STUDENT"][speciality] || []) : [];

  // Reset logic
  useEffect(() => {
    setSubSpeciality("");
  }, [speciality]);

  // Fetch countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      setIsLoadingCountries(true);
      const data = await fetchCountriesService();
      setCountries(data);
      setIsLoadingCountries(false);
    };
    loadCountries();
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    if (!country) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      setIsLoadingCities(true);
      const data = await fetchCitiesByCountry(country);
      setCities(data);
      setIsLoadingCities(false);
    };

    loadCities();
  }, [country]);

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setCity("");
    if (errors.country) setErrors({ ...errors, country: "" });
  };

  const router = useRouter();
  const { login: loginEntity } = useEntityStore();
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") ?? "";
  const redirectTo = searchParams?.get("redirectTo");

  const handleSignIn = async () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Required field";
    if (!password) newErrors.password = "Required field";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const { token } = await login({
        email: email,
        password: password,
      });

      await loginEntity(token, EntityType.USER);

      // Expert role-based redirect
      if (redirectTo && redirectTo !== '/login') {
        router.push(redirectTo);
      } else {
        router.push("/find-jobs");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    const newErrors: Record<string, string> = {};
    if (!firstName) newErrors.firstName = "Required field";
    if (!lastName) newErrors.lastName = "Required field";
    if (!email) newErrors.email = "Required field";
    if (!password) newErrors.password = "Required field";
    if (!country) newErrors.country = "Required field";
    if (!city) newErrors.city = "Required field";
    if (!university) newErrors.university = "Required field";
    // if (!speciality) newErrors.speciality = "Required field"; // Optional?

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const status = await register({
        firstName,
        lastName,
        email,
        password,
        country,
        city,
        // location, // Removed
        university,
        // Using specialization and subSpecialization instead of simple degree
        speciality,
        specialization,
        subSpeciality,
        yearOfStudy,
        role: RoleEnum.STUDENT,
      });

      console.log("signup status", status);

      if (status === 200) {
        const { token } = await login({
          email: email,
          password: password,
        });

        await loginEntity(token, EntityType.USER);

        // Expert role-based redirect
        if (redirectTo && redirectTo !== '/login') {
          router.push(redirectTo);
        } else {
          router.push("/find-jobs");
        }
      } else {
        alert("Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const studentSpecificFields = (
    <>
      <div className="space-y-2">
        <Label htmlFor="university">University/Institution</Label>
        <Input
          id="university"
          type="text"
          placeholder="Enter your university name"
          value={university}
          onChange={(e) => {
            setUniversity(e.target.value);
            if (errors.university) setErrors({ ...errors, university: "" });
          }}
          disabled={loading}
          required
          className={`h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#169BA4] focus:ring-[#169BA4] ${errors.university ? "border-red-500 focus:ring-red-500" : ""}`}
        />
        {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="speciality">Category (Speciality)</Label>
        <Select
          value={speciality}
          onValueChange={setSpeciality}
          disabled={loading}
        >
          <SelectTrigger className="focus:border-[#169BA4] focus:ring-[#169BA4]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {specialityOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">Your Primary Specialization</Label>
        <Input
          id="specialization"
          type="text"
          placeholder="e.g. Cardiology, Pediatrics"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subSpeciality">Role (Sub-Speciality)</Label>
        <Select
          value={subSpeciality}
          onValueChange={setSubSpeciality}
          disabled={!speciality || loading}
        >
          <SelectTrigger className="focus:border-[#169BA4] focus:ring-[#169BA4]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {subSpecialityOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearOfStudy">Year of Study</Label>
        <Select value={yearOfStudy} onValueChange={setYearOfStudy}>
          <SelectTrigger className="focus:border-[#169BA4] focus:ring-[#169BA4]">
            <SelectValue placeholder="Select your year of study" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1st Year</SelectItem>
            <SelectItem value="2">2nd Year</SelectItem>
            <SelectItem value="3">3rd Year</SelectItem>
            <SelectItem value="4">4th Year</SelectItem>
            <SelectItem value="5">5th Year</SelectItem>
            <SelectItem value="6">6th Year</SelectItem>
            <SelectItem value="postgraduate">Postgraduate</SelectItem>
            <SelectItem value="phd">PhD</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="w-full max-w-md">
      <AuthFormHeader
        icon={GraduationCap}
        title="Student Portal"
        subtitle="Connect with peers and advance your medical education"
      />

      <AuthFormTabs
        signInContent={
          <SignInForm
            email={email}
            password={password}
            onEmailChange={(val) => {
              setEmail(val);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            onPasswordChange={(val) => {
              setPassword(val);
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            onSubmit={handleSignIn}
            loading={loading}
            errors={errors}
          />
        }
        signUpContent={
          <SignUpForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            password={password}

            country={country}
            city={city}
            onCountryChange={handleCountryChange}
            onCityChange={(val) => {
              setCity(val);
              if (errors.city) setErrors({ ...errors, city: "" });
            }}
            countryOptions={countries}
            cityOptions={cities}
            loadingCountries={isLoadingCountries}
            loadingCities={isLoadingCities}

            onFirstNameChange={(val) => {
              setFirstName(val);
              if (errors.firstName) setErrors({ ...errors, firstName: "" });
            }}
            onLastNameChange={(val) => {
              setLastName(val);
              if (errors.lastName) setErrors({ ...errors, lastName: "" });
            }}
            onEmailChange={(val) => {
              setEmail(val);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            onPasswordChange={(val) => {
              setPassword(val);
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            onSubmit={handleSignUp}
            loading={loading}
            roleSpecificFields={studentSpecificFields}
            location={'location'}
            onLocationChange={() => { }}
            errors={errors}
          />
        }
        defaultTab={type === "signup" ? "signup" : "signin"}
      />
    </div>
  );
}

export default function StudentAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentAuthContent />
    </Suspense>
  );
}