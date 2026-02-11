"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { login, createInstitution, register, loginInstitute, registerInstitute } from "@/lib/api";
import { useEntityStore } from "@/store/entityStore";
import { EntityType } from "@/lib/api/types";
import { AuthFormHeader, AuthFormTabs, SignInForm, SignUpForm, InstituteSignUpForm } from "../_components";

function InstitutionAuthContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Institute Signup State
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  // const [location, setLocation] = useState(""); // removed
  const [contactNumber, setContactNumber] = useState("");
  const [bedsCount, setBedsCount] = useState("");
  const [staffCount, setStaffCount] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [services, setServices] = useState<string[]>([]);

  // Location Fetching State
  const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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
        }
      } catch (error) {
        toast.error("Failed to load countries");
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = async (countryName: string) => {
    setCountry(countryName);
    setCity(""); // Reset city
    setCities([]);

    if (!countryName) return;

    setIsLoadingCities(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country: countryName }),
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

  const router = useRouter();
  const { login: loginEntity } = useEntityStore();
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") ?? "";

  const handleSignIn = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { token } = await loginInstitute({
        email: email,
        password: password,
      });

      await loginEntity(token, EntityType.INSTITUTE);
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Required field";
    if (!email) newErrors.email = "Required field";
    if (!password) newErrors.password = "Required field";
    if (!country) newErrors.country = "Required field";
    if (!city) newErrors.city = "Required field";
    if (!contactNumber) newErrors.contactNumber = "Required field";
    if (!institutionType) newErrors.type = "Required field";
    if (services.length === 0) newErrors.services = "Select at least one service";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (loading) return;

    setLoading(true);

    // Map generic type to RoleEnum
    let role = "HOSPITAL";
    const typeLower = institutionType.toLowerCase();
    if (typeLower.includes("clinic")) role = "CLINIC";
    else if (typeLower.includes("lab")) role = "LAB";
    else if (typeLower.includes("pharmacy")) role = "PHARMACY";
    // Default or other mapping as needed

    try {
      const status = await registerInstitute({
        name,
        contactEmail: email, // Map email state to contactEmail
        password,
        // location, // removed per user request
        country,
        city,
        contactNumber,
        telephone: contactNumber, // duplicate
        role,
        type: institutionType,
        services,
        bedsCount: parseInt(bedsCount) || 0,
        staffCount: parseInt(staffCount) || 0,
        verified: false,
      });

      if (status === 201 || status === 200) {
        // Auto-login after signup
        const { token } = await loginInstitute({
          email: email,
          password: password,
        });

        await loginEntity(token, EntityType.INSTITUTE);
        router.push("/dashboard");
      } else {
        alert("Institution registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Institution registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const signUpContent = (
    <InstituteSignUpForm
      name={name}
      country={country}
      city={city}
      email={email}
      password={password}
      // location={location} // removed
      contactNumber={contactNumber}
      type={institutionType}
      services={services}
      bedsCount={bedsCount}
      staffCount={staffCount}
      onNameChange={(val) => {
        setName(val);
        if (errors.name) setErrors({ ...errors, name: "" });
      }}
      onCountryChange={(val) => {
        handleCountryChange(val);
        if (errors.country) setErrors({ ...errors, country: "" });
      }}
      onCityChange={(val) => {
        setCity(val);
        if (errors.city) setErrors({ ...errors, city: "" });
      }}
      onEmailChange={(val) => {
        setEmail(val);
        if (errors.email) setErrors({ ...errors, email: "" });
      }}
      onPasswordChange={(val) => {
        setPassword(val);
        if (errors.password) setErrors({ ...errors, password: "" });
      }}
      countryOptions={countries}
      cityOptions={cities}
      loadingCountries={isLoadingCountries}
      loadingCities={isLoadingCities}
      // onLocationChange={setLocation} // removed
      onContactNumberChange={(val) => {
        setContactNumber(val);
        if (errors.contactNumber) setErrors({ ...errors, contactNumber: "" });
      }}
      onTypeChange={(val) => {
        setInstitutionType(val);
        if (errors.type) setErrors({ ...errors, type: "" });
      }}
      onServicesChange={(val) => {
        setServices(val);
        if (errors.services) setErrors({ ...errors, services: "" });
      }}
      onBedsCountChange={setBedsCount}
      onStaffCountChange={setStaffCount}
      onSubmit={handleSignUp}
      loading={loading}
      errors={errors}
    />
  );

  return (
    <div className="w-full max-w-md">
      <AuthFormHeader
        icon={Building}
        title="Institution Portal"
        subtitle="Register your medical institution"
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
        signUpContent={signUpContent}
        defaultTab={type === "signup" ? "signup" : "signin"}
        hideSignup={false}
      />
    </div>
  );
}

export default function InstitutionAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InstitutionAuthContent />
    </Suspense>
  );
}
