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
import { Trash2, Plus, X } from "lucide-react";
import {
  SocialMediaLink,
  getInstituteSocialMediaLinks,
  createInstituteSocialMediaLink,
  deleteInstituteSocialMediaLink,
  fetchCountries as fetchCountriesService,
  fetchCitiesByCountry,
  LocationOption
} from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface EditInstituteModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: Institution;
  onUpdate: (updatedInstitution: Institution) => void;
  onLinksChange?: () => void;
}

export function EditInstituteModal({ isOpen, onClose, institution, onUpdate, onLinksChange }: EditInstituteModalProps) {
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
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { updateCurrentInstitution, currentInstitution, setInstitution } = useInstitutionStore();

  // Social Links state
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
  const [newPlatform, setNewPlatform] = useState<string>("");
  const [newSocialLinkUrl, setNewSocialLinkUrl] = useState<string>("");
  const [isManagingLinks, setIsManagingLinks] = useState(false);

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

  const fetchCities = async (countryName: string) => {
    if (!countryName) {
      setCities([]);
      return;
    }
    setIsLoadingCities(true);
    const data = await fetchCitiesByCountry(countryName);
    setCities(data);
    setIsLoadingCities(false);
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
      const initialCountry = institution.country || "India";
      setFormData({
        name: institution.name || "",
        contactNumber: institution.contactNumber || institution.contact_number || "",
        bedsCount: institution.bedsCount || 0,
        staffCount: institution.staffCount || (institution.employees_count ? parseInt(institution.employees_count) : 0) || 0,
        telephone: institution.telephone || "",
        services: institution.services || [],
        headline: institution.headline || "",
        about: institution.about || "",
        country: initialCountry,
        city: institution.city || "",
      });

      if (initialCountry && isOpen) {
        fetchCities(initialCountry);
      }
    }
  }, [institution, isOpen]);

  // Fetch Social Links when modal opens
  useEffect(() => {
    if (isOpen && institution?.id) {
      const fetchLinks = async () => {
        try {
          const links = await getInstituteSocialMediaLinks(institution.id);
          setSocialLinks(links);
        } catch (error) {
          console.error("Error fetching social links:", error);
        }
      };
      fetchLinks();
    }
  }, [isOpen, institution?.id]);

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

  const handleAddSocialLink = async () => {
    if (!newPlatform || !newSocialLinkUrl.trim()) {
      toast.error("Platform and Link are required");
      return;
    }
    setIsManagingLinks(true);
    try {
      const newLinkResp = await createInstituteSocialMediaLink({
        platform: newPlatform,
        link: newSocialLinkUrl.trim()
      });
      setSocialLinks(prev => [...prev, newLinkResp]);
      setNewPlatform("");
      setNewSocialLinkUrl("");
      onLinksChange?.();
      toast.success("Social media link added!");
    } catch (error) {
      console.error("Error adding social link:", error);
      toast.error("Failed to add social media link.");
    } finally {
      setIsManagingLinks(false);
    }
  };

  const handleDeleteSocialLink = async (linkId: string) => {
    setIsManagingLinks(true);
    try {
      await deleteInstituteSocialMediaLink(linkId);
      setSocialLinks(prev => prev.filter(l => l.id !== linkId));
      onLinksChange?.();
      toast.success("Social media link deleted!");
    } catch (error) {
      console.error("Error deleting social link:", error);
      toast.error("Failed to delete social media link.");
    } finally {
      setIsManagingLinks(false);
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
              <SearchableSelect
                options={countries}
                value={formData.country || ""}
                onValueChange={handleCountryChange}
                placeholder={isLoadingCountries ? "Loading..." : "Select Country"}
                searchPlaceholder="Search country..."
                emptyMessage="No country found."
                disabled={isLoadingCountries}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <SearchableSelect
                options={cities}
                value={formData.city || ""}
                onValueChange={handleCityChange}
                placeholder={isLoadingCities ? "Loading..." : "Select City"}
                searchPlaceholder="Search city..."
                emptyMessage="No city found."
                disabled={!formData.country || isLoadingCities}
              />
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

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-lg font-semibold block">Social Media Links</Label>

            {/* Existing Links */}
            {socialLinks.length > 0 && (
              <div className="space-y-2 mb-4">
                {socialLinks.map(link => (
                  <div key={link.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-100">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="font-medium text-sm text-gray-700 w-24 shrink-0">
                        {link.platform.charAt(0) + link.platform.slice(1).toLowerCase()}
                      </span>
                      <span className="text-sm text-gray-500 truncate" title={link.link}>
                        {link.link}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSocialLink(link.id)}
                      disabled={isManagingLinks}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Link */}
            <div className=" gap-3 items-end">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select
                  value={newPlatform}
                  onValueChange={setNewPlatform}
                  disabled={isManagingLinks}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                    <SelectItem value="FACEBOOK">Facebook</SelectItem>
                    <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                    <SelectItem value="TWITTER">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Link</Label>
                <Input
                  value={newSocialLinkUrl}
                  onChange={(e) => setNewSocialLinkUrl(e.target.value)}
                  placeholder="https://..."
                  disabled={isManagingLinks}
                />
              </div>
              <Button
                type="button"
                onClick={handleAddSocialLink}
                disabled={isManagingLinks || !newPlatform || !newSocialLinkUrl}
                className="w-full md:w-auto mt-4"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t ">
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
