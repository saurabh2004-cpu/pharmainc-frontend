
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { fetchCountries, fetchCitiesByCountry, LocationOption } from "@/lib/api";

export interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'date' | 'textarea' | 'checkbox' | 'select' | 'country' | 'city';
    placeholder?: string;
    required?: boolean;
    options?: { label: string; value: string }[]; // For select or autocomplete
    disabled?: boolean | ((formData: any) => boolean);
}

interface ProfileSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fields: FieldConfig[];
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
}

export const ProfileSectionModal: React.FC<ProfileSectionModalProps> = ({
    isOpen,
    onClose,
    title,
    fields,
    initialData,
    onSubmit,
    isLoading = false,
}) => {
    const [formData, setFormData] = React.useState<any>(initialData || {});
    const [countries, setCountries] = useState<LocationOption[]>([]);
    const [cities, setCities] = useState<LocationOption[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    React.useEffect(() => {
        setFormData(initialData || {});
    }, [initialData, isOpen]);

    // Load countries on mount
    useEffect(() => {
        if (isOpen) {
            const loadCountries = async () => {
                setLoadingCountries(true);
                const data = await fetchCountries();
                setCountries(data);
                setLoadingCountries(false);
            };
            loadCountries();
        }
    }, [isOpen]);

    // Load cities when country changes
    useEffect(() => {
        const country = formData.country;
        if (isOpen && country) {
            const loadCities = async () => {
                setLoadingCities(true);
                const data = await fetchCitiesByCountry(country);
                setCities(data);
                setLoadingCities(false);
            };
            loadCities();
        } else {
            setCities([]);
        }
    }, [formData.country, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev: any) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev: any) => ({ ...prev, [name]: checked }));
    }

    const handleValueChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));

        // If country changes, clear the city
        if (name === 'country') {
            setFormData((prev: any) => ({ ...prev, city: '' }));
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.name} className={field.type === 'checkbox' ? "flex items-center space-x-2" : "space-y-2"}>
                            {field.type !== 'checkbox' && <Label htmlFor={field.name}>{field.label}</Label>}

                            {field.type === 'textarea' ? (
                                <Textarea
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    disabled={typeof field.disabled === 'function' ? field.disabled(formData) : field.disabled}
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required={field.required}
                                    disabled={typeof field.disabled === 'function' ? field.disabled(formData) : field.disabled}
                                >
                                    <option value="" disabled>Select {field.label}</option>
                                    {field.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : field.type === 'country' ? (
                                <SearchableSelect
                                    options={countries}
                                    value={formData[field.name] || ""}
                                    onValueChange={(val) => handleValueChange(field.name, val)}
                                    placeholder={loadingCountries ? "Loading countries..." : `Select ${field.label}`}
                                    disabled={loadingCountries || (typeof field.disabled === 'function' ? field.disabled(formData) : field.disabled)}
                                />
                            ) : field.type === 'city' ? (
                                <SearchableSelect
                                    options={cities}
                                    value={formData[field.name] || ""}
                                    onValueChange={(val) => handleValueChange(field.name, val)}
                                    placeholder={loadingCities ? "Loading cities..." : !formData.country ? "Select country first" : `Select ${field.label}`}
                                    disabled={loadingCities || !formData.country || (typeof field.disabled === 'function' ? field.disabled(formData) : field.disabled)}
                                />
                            ) : field.type === 'checkbox' ? (
                                <>
                                    <input
                                        type="checkbox"
                                        id={field.name}
                                        name={field.name}
                                        checked={!!formData[field.name]}
                                        onChange={(e) => handleCheckboxChange(field.name, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        disabled={typeof field.disabled === 'function' ? field.disabled(formData) : field.disabled}
                                    />
                                    <Label htmlFor={field.name} className="font-normal">{field.label}</Label>
                                </>
                            ) : (
                                <Input
                                    id={field.name}
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    disabled={typeof field.disabled === 'function' ? field.disabled(formData) : field.disabled}
                                />
                            )}
                        </div>
                    ))}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" type="button" onClick={onClose} disabled={isLoading} className='bg-[#233F64] text-white hover:bg-[#169BA4] hover:text-white'>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className='bg-[#233F64] hover:bg-[#169BA4] hover:text-white'>
                            {isLoading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
