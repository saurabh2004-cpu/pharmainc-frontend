"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { login, createUser, setAuthToken, register } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { AuthFormHeader, AuthFormTabs, SignInForm, SignUpForm } from "../_components";

function HealthcareAuthContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { fetchCurrentUser } = useUserStore();
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") ?? "";

  const handleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const { token } = await login({
        email: email,
        password: password,
        type: "user",
      });
      
      setAuthToken(token, "user");
      await fetchCurrentUser();
      
      router.push("/find-jobs");
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const status = await register({
        email: email,
        password: password,
        name: `${firstName} ${lastName}`,
        type: "user",
      });

      if (status === 201) {
        const { token } = await login({
          email: email,
          password: password,
          type: "user",
        });

        setAuthToken(token, "user");

        const { id } = await createUser({
          name: `${firstName} ${lastName}`,
          location: location,
          role: "healthcare_professional",
        });

        await fetchCurrentUser();

        router.push(`/profile/${id}`);
      } else {
        alert("Account creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Account creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const healthcareSpecificFields = (
    <>
      <div className="space-y-2">
        <Label htmlFor="profession">Profession</Label>
        <Select value={profession} onValueChange={setProfession}>
          <SelectTrigger>
            <SelectValue placeholder="Select your profession" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nurse">Nurse</SelectItem>
            <SelectItem value="pharmacist">Pharmacist</SelectItem>
            <SelectItem value="physiotherapist">Physiotherapist</SelectItem>
            <SelectItem value="nutritionist">Nutritionist</SelectItem>
            <SelectItem value="medical-technician">Medical Technician</SelectItem>
            <SelectItem value="lab-technician">Lab Technician</SelectItem>
            <SelectItem value="radiologist">Radiologist</SelectItem>
            <SelectItem value="paramedic">Paramedic</SelectItem>
            <SelectItem value="researcher">Medical Researcher</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Years of Experience</Label>
        <Input
          id="experience"
          type="number"
          placeholder="Years in profession"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          disabled={loading}
        />
      </div>
    </>
  );

  return (
    <div className="w-full max-w-md">
      <AuthFormHeader
        icon={Users}
        title="Healthcare Professionals"
        subtitle="Join our network of healthcare experts"
      />

      <AuthFormTabs
        signInContent={
          <SignInForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSignIn}
            loading={loading}
          />
        }
        signUpContent={
          <SignUpForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            password={password}
            location={location}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onLocationChange={setLocation}
            onSubmit={handleSignUp}
            loading={loading}
            roleSpecificFields={healthcareSpecificFields}
          />
        }
        defaultTab={type === "signup" ? "signup" : "signin"}
      />
    </div>
  );
}

export default function HealthcareAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HealthcareAuthContent />
    </Suspense>
  );
}
