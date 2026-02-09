"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Institution, InstitutionUpdateParams } from "@/lib/api/types";
import { useInstitutionStore } from "@/store";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditInstituteModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: Institution;
  onUpdate: (updatedInstitution: Institution) => void;
}

export function EditInstituteModal({ isOpen, onClose, institution, onUpdate }: EditInstituteModalProps) {
  // Initialize form data with controlled components.
  // Using explicit fields as requested.
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    bedsCount: 0,
    staffCount: 0,
    telephone: "",
    services: [] as string[],
    headline: "",
    about: "",
    country: "",
    city: "",
  });

  const [serviceInput, setServiceInput] = useState("");
  // State for dynamic location fields
  const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { updateCurrentInstitution, currentInstitution, setInstitution } = useInstitutionStore();

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

  // Populate form when modal opens or institution changes
  useEffect(() => {
    if (institution) {
      setFormData({
        name: institution.name || "",
        contactNumber: institution.contactNumber || institution.contact_number || "",
        bedsCount: institution.bedsCount || 0,
        staffCount: institution.staffCount || (institution.employees_count ? parseInt(institution.employees_count) : 0) || 0,
        telephone: institution.telephone || "",
        services: institution.services || [],
        headline: institution.headline || "",
        about: institution.about || "",
        country: institution.country || "",
        city: institution.city || "",
      });

      if (institution.country && isOpen) {
        fetchCities(institution.country);
      }
    }
  }, [institution, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      // Convert number inputs immediately for state, or keep as string and convert on submit?
      // Better to keep as string in input to allow empty deletion, but strict requirement says "Convert... before sending".
      // We will handle numeric inputs as string to allow typing, then parse on submit, 
      // OR use type="number" which gives strings mostly anyway in React unless valueAsNumber is used.
      // Let's stick to standard handling:
      [name]: value,
    }));
  };

  const handleAddService = () => {
    if (serviceInput.trim()) {
      if (!formData.services.includes(serviceInput.trim())) {
        setFormData(prev => ({
          ...prev,
          services: [...prev.services, serviceInput.trim()]
        }));
      }
      setServiceInput("");
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== serviceToRemove)
    }));
  };

  const handleServiceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddService();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare payload with only editable fields
      // Convert numeric fields
      const payload: InstitutionUpdateParams = {
        name: formData.name,
        contactNumber: formData.contactNumber,
        // contact_number: formData.contactNumber, // Backwards compatibility if backend needs snake_case
        bedsCount: Number(formData.bedsCount) || 0,
        staffCount: Number(formData.staffCount) || 0,
        telephone: formData.telephone,
        services: formData.services,
        headline: formData.headline,
        about: formData.about,
      };

      if (formData.country) payload.country = formData.country;
      if (formData.city) payload.city = formData.city;

      // Ensure the store has the current institution data before updating
      if (!currentInstitution && institution) {
        setInstitution(institution);
      }

      const updatedInstitution = await updateCurrentInstitution(payload);
      onUpdate(updatedInstitution);
      toast.success("Institution profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating institution:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Institute Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2">
            <Label htmlFor="name">Institute Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Telephone</Label>
              <Input
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedsCount">Beds Count</Label>
              <Input
                id="bedsCount"
                name="bedsCount"
                type="number"
                min="0"
                value={formData.bedsCount}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="staffCount">Staff Count</Label>
              <Input
                id="staffCount"
                name="staffCount"
                type="number"
                min="0"
                value={formData.staffCount}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              name="headline"
              value={formData.headline}
              onChange={handleInputChange}
              placeholder="A short headline for your institute"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              rows={4}
              placeholder="Detailed description of your institute"
            />
          </div>

          <div className="space-y-2">
            <Label>Services</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.services.map((service, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1">
                  {service}
                  <button
                    type="button"
                    onClick={() => handleRemoveService(service)}
                    className="hover:text-destructive focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={handleServiceKeyDown}
                placeholder="Type a service and press Enter"
              />
              <Button type="button" variant="outline" onClick={handleAddService} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
