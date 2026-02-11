"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { login, register, RoleEnum } from "@/lib/api";
import { useEntityStore } from "@/store/entityStore";
import { EntityType } from "@/lib/api/types";
import { AuthFormHeader, AuthFormTabs, SignInForm, SignUpForm } from "../_components";
import healthcareRoles from "@/lib/constants/healthcareRoles.json";
// import { toast } from "sonner";
import { SearchableSelect } from "@/components/ui/searchable-select";

// Type assertion for the JSON data
const rolesData = healthcareRoles as Record<string, Record<string, string[]>>;

import { toast } from "sonner";

// ... existing imports

function DoctorAuthContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [location, setLocation] = useState(""); // Removed

  // Country & City State
  const [country, setCountry] = useState("India"); // Default to India
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Role, Speciality, Sub-Speciality
  const [role, setRole] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [speciality, setSpeciality] = useState<string>("");
  const [subSpeciality, setSubSpeciality] = useState<string>("");

  const [experience, setExperience] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Derived options
  const specialityOptions = role ? Object.keys(rolesData[role] || {}) : [];
  const subSpecialityOptions = (role && speciality) ? (rolesData[role][speciality] || []) : [];

  // Reset logic
  useEffect(() => {
    setSpeciality("");
    setSubSpeciality("");
  }, [role]);

  useEffect(() => {
    setSubSpeciality("");
  }, [speciality]);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
        const data = await response.json();
        if (!data.error) {
          const countryOptions = data.data.map((c: any) => ({
            label: c.name,
            value: c.name,
          }));
          setCountries(countryOptions);
          // Ensure "India" is in the list or just defer to default state
        }
      } catch (error) {
        toast.error("Failed to load countries");
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch cities when country changes (or on mount if default is set)
  useEffect(() => {
    if (!country) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ country: country }),
        });
        const data = await response.json();
        if (!data.error) {
          const cityOptions = data.data.map((c: string) => ({
            label: c,
            value: c,
          }));
          setCities(cityOptions);
        } else {
          setCities([]);
        }
      } catch (error) {
        toast.error("Failed to load cities");
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
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

      router.push("/find-jobs");
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
    if (!role) newErrors.role = "Required field";
    if (!gender) newErrors.gender = "Required field";
    // Optional checks? depending on requirements

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
        specialization,
        speciality,
        subSpeciality,
        gender,
        role: role as RoleEnum,
        experience,
      });

      if (status === 200) {
        const { token } = await login({
          email: email,
          password: password,
        });

        await loginEntity(token, EntityType.USER);

        router.push("/find-jobs");
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

  const doctorSpecificFields = (
    <>
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger>
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            type="number"
            placeholder="Years of practice"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            disabled={loading}
          />
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
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DOCTOR">Doctor</SelectItem>
              <SelectItem value="NURSE">Nurse</SelectItem>
              <SelectItem value="OTHER">Other Healthcare Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}

        <div className="space-y-2">
          <Label htmlFor="speciality">Speciality</Label>
          <Select
            value={speciality}
            onValueChange={setSpeciality}
            disabled={!role || loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select speciality" />
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
          <Label htmlFor="subSpeciality">Sub-Speciality</Label>
          <Select
            value={subSpeciality}
            onValueChange={setSubSpeciality}
            disabled={!speciality || loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub-speciality" />
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
      </div>
    </>
  );

  return (
    <div className="w-full max-w-md">
      <AuthFormHeader
        icon={Stethoscope}
        title="Healthcare Professional Portal"
        subtitle="Join our community of medical professionals"
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
            roleSpecificFields={doctorSpecificFields}
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

export default function DoctorAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DoctorAuthContent />
    </Suspense>
  );
}
