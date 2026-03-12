import { toast } from "sonner";

export const countryCodes: Record<string, string> = {
    "India": "+91",
    "United Arab Emirates": "+971",
    "United States": "+1",
    "United Kingdom": "+44",
    "Canada": "+1",
    "Australia": "+61",
    "Saudi Arabia": "+966",
    "Qatar": "+974",
    "Oman": "+968",
    "Kuwait": "+965",
    "Bahrain": "+973",
    "Singapore": "+65",
    "Malaysia": "+60",
    "Pakistan": "+92",
    "Bangladesh": "+880",
    "Sri Lanka": "+94",
    "Nepal": "+977",
    "Germany": "+49",
    "France": "+33",
    "Italy": "+39",
    "Spain": "+34",
    "Netherlands": "+31",
    "Switzerland": "+41",
    "Ireland": "+353",
    "New Zealand": "+64",
    "South Africa": "+27",
};

export interface LocationOption {
    label: string;
    value: string;
}

export const fetchCountries = async (): Promise<LocationOption[]> => {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
        const data = await response.json();
        if (!data.error) {
            return data.data.map((c: any) => ({
                label: c.name,
                value: c.name,
            }));
        }
        return [];
    } catch (error) {
        console.error("Failed to load countries:", error);
        toast.error("Failed to load countries");
        return [];
    }
};

export const fetchCitiesByCountry = async (countryName: string): Promise<LocationOption[]> => {
    if (!countryName) return [];
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
            return data.data.map((c: string) => ({
                label: c,
                value: c,
            }));
        }
        return [];
    } catch (error) {
        console.error("Failed to load cities:", error);
        toast.error("Failed to load cities");
        return [];
    }
};
