"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateUser } from "@/lib/api";
import { User, UserUpdateParams } from "@/lib/api/types";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    headline: "",
    about: "",
    role: "",
    country: "",
    city: "",
  });

  // State for dynamic location fields
  const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

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

  const fetchCities = async (countryName: string) => {
    if (!countryName) {
      setCities([]);
      return;
    }
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

  const handleCountryChange = (countryName: string) => {
    setFormData(prev => ({ ...prev, country: countryName, city: "" })); // Reset city
    fetchCities(countryName);
  };

  const handleCityChange = (cityName: string) => {
    setFormData(prev => ({ ...prev, city: cityName }));
  };

  // Populate form when modal opens or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        headline: user.headline || "",
        about: user.about || "",
        role: user.role || "",
        country: user.country || "",
        city: user.city || "",
      });

      if (user.country && isOpen) {
        fetchCities(user.country);
      }
    }
  }, [user, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData: UserUpdateParams = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        headline: formData.headline,
        about: formData.about,
        role: formData.role,
        country: formData.country,
        city: formData.city,
      };

      const updatedUser = await updateUser(user.id, updateData);
      onUpdate(updatedUser);
      onClose();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Enter your role"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={handleCountryChange}
                disabled={isLoadingCountries}
              >
                <SelectTrigger id="country" className="bg-white">
                  <SelectValue placeholder={isLoadingCountries ? "Loading..." : "Select Country"} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select
                value={formData.city}
                onValueChange={handleCityChange}
                disabled={!formData.country || isLoadingCities}
              >
                <SelectTrigger id="city" className="bg-white">
                  <SelectValue placeholder={isLoadingCities ? "Loading..." : "Select City"} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Textarea
              id="headline"
              name="headline"
              value={formData.headline}
              onChange={handleInputChange}
              placeholder="Enter a short bio"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Tell us more about yourself"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
