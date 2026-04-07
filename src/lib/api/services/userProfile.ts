
import { baseApi } from "@/lib/api/axios/api";
import {
    Experience,
    ExperienceParams,
    Education,
    EducationParams,
    Skills,
    SkillsParams
} from "@/lib/api/types";

// Experience Endpoints
export const getExperiences = async (userId?: string): Promise<Experience[]> => {
    const url = userId ? `/user/get-experience?id=${userId}` : "/user/get-experience";
    const response = await baseApi.get(url);
    return response.data;
};

export const createExperience = async (data: ExperienceParams): Promise<Experience> => {
    const response = await baseApi.post("/user/create-experience", data);
    return response.data;
};

export const updateExperience = async (id: string, data: Partial<ExperienceParams>): Promise<Experience> => {
    const response = await baseApi.put(`/user/update-experience/${id}`, data);
    return response.data;
};

export const deleteExperience = async (id: string): Promise<void> => {
    await baseApi.delete(`/user/delete-experience/${id}`);
};

// Education Endpoints
export const getEducation = async (userId?: string): Promise<Education[]> => {
    const url = userId ? `/user/get-education?id=${userId}` : "/user/get-education";
    const response = await baseApi.get(url);
    console.log("Education response:", response.data);
    return response.data;
};

export const createEducation = async (data: EducationParams): Promise<Education> => {
    const response = await baseApi.post("/user/create-education", data);
    return response.data;
};

export const updateEducation = async (id: string, data: Partial<EducationParams>): Promise<Education> => {
    const response = await baseApi.put(`/user/update-education/${id}`, data);
    return response.data;
};

export const deleteEducation = async (id: string): Promise<void> => {
    await baseApi.delete(`/user/delete-education/${id}`);
};

// Skills Endpoints
export const getSkills = async (userId?: string): Promise<Skills | { skills: string[] } | string[]> => {
    const url = userId ? `/user/get-skills?id=${userId}` : "/user/get-skills";
    const response = await baseApi.get(url);
    return response.data;
};

export const createSkills = async (data: SkillsParams): Promise<Skills> => {
    const response = await baseApi.post("/user/create-skills", data);
    return response.data;
};

export const deleteSkills = async (data?: { skills: string[] }): Promise<void> => {
    await baseApi.delete("/user/delete-skills", { data });
};

// Specialties Endpoints
export const getSpecialities = async (userId?: string): Promise<{ specialities: string[] } | string[]> => {
    const url = userId ? `/user/get-specialities?id=${userId}` : "/user/get-specialities";
    const response = await baseApi.get(url);
    return response.data;
};

export const createSpecialities = async (data: { specialities: string[] }): Promise<{ specialities: string[] }> => {
    const response = await baseApi.post("/user/create-specialities", data);
    return response.data;
};

export const deleteSpecialities = async (data?: { specialities: string[] }): Promise<void> => {
    await baseApi.delete("/user/delete-specialities", { data });
};

// Current Organization Endpoint
export const getCurrentOrganization = async (): Promise<{ organizationName: string | null; role: string | null }> => {
    const response = await baseApi.get("/user/get-current-organization");
    return response.data;
};

// Links Endpoints
export const getLinks = async (): Promise<{ links: string[] } | string[]> => {
    const response = await baseApi.get("/user/get-links");
    return response.data;
};

export const createLinks = async (data: { links: string[] }): Promise<{ links: string[] }> => {
    const response = await baseApi.post("/user/create-links", data);
    return response.data;
};

export const deleteLinks = async (data?: { links: string[] }): Promise<void> => {
    await baseApi.delete("/user/delete-links", { data });
};
