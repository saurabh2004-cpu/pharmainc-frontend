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
  SocialMediaLink,
  getUserSocialMediaLinks,
  createUserSocialMediaLink,
  deleteUserSocialMediaLink,
  fetchCountries as fetchCountriesService,
  fetchCitiesByCountry,
  LocationOption
} from "@/lib/api";
import { Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (updatedUser: User) => void;
  onLinksChange?: () => void;
}

export function EditProfileModal({ isOpen, onClose, user, onUpdate, onLinksChange }: EditProfileModalProps) {

  console.log("user in profile page", user);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    headline: "",
    about: "",
    role: "",
    country: "",
    city: "",
    gender: "",
  });

  // State for dynamic location fields
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

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

  // Populate form when modal opens or user changes
  useEffect(() => {
    if (user) {
      const initialCountry = user.country || "India";
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        headline: user.headline || "",
        about: user.about || "",
        role: user.role || "",
        country: initialCountry,
        city: user.city || "",
        gender: user.gender || "",
      });

      if (initialCountry && isOpen) {
        fetchCities(initialCountry);
      }
    }
  }, [user, isOpen]);

  // Fetch Social Links when modal opens
  useEffect(() => {
    if (isOpen && user?.id) {
      const fetchLinks = async () => {
        try {
          const links = await getUserSocialMediaLinks(user.id);
          setSocialLinks(links);
        } catch (error) {
          console.error("Error fetching social links:", error);
        }
      };
      fetchLinks();
    }
  }, [isOpen, user?.id]);

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
        gender: formData.gender,
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

  const handleAddSocialLink = async () => {
    if (!newPlatform || !newSocialLinkUrl.trim()) {
      toast.error("Platform and Link are required");
      return;
    }
    setIsManagingLinks(true);
    try {
      const newLinkResp = await createUserSocialMediaLink({
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
      await deleteUserSocialMediaLink(linkId);
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

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger id="gender" className="bg-white">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
              <div className="  space-y-2">
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
                className="w-full md:w-auto mt-4 bg-[#233F64] text-white hover:bg-[#169BA4] hover:text-white"
              >
                <Plus className="h-4 w-4 mr-1 " />
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className='bg-[#233F64] text-white hover:bg-[#169BA4] hover:text-white'
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className='bg-[#233F64] text-white hover:bg-[#169BA4] hover:text-white'>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
