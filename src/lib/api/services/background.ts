import { apiRequest } from "@/lib/api/utils";
import {
  Education,
  EducationParams,
  Experience,
  ExperienceParams,
} from "@/lib/api/types";

// Education endpoints
export const createEducation = async (educationData: {
  institution_id: string; // camelCase
  title: string;
  description?: string;
  start_date: string; // YYYY-MM-DD
  end_date?: string | null; // YYYY-MM-DD or null
}): Promise<Education> => {
  return apiRequest<Education>("background", "/private/education", {
    method: "POST",
    body: JSON.stringify(educationData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const updateEducation = async (
  id: string,
  educationData: Partial<EducationParams>
): Promise<Education> => {
  return apiRequest<Education>("background", `/private/education/${id}`, {
    method: "PUT",
    body: JSON.stringify(educationData),
  });
};

export const deleteEducation = async (id: string): Promise<void> => {
  return apiRequest<void>("background", `/private/education/${id}`, {
    method: "DELETE",
  });
};

export const getUserEducations = async (
  userId: string
): Promise<Education[]> => {
  return apiRequest<Education[]>(
    "background",
    `/public/education/user/${userId}`,
    { method: "GET" }
  );
};

export const getEducation = async (id: string): Promise<Education> => {
  return apiRequest<Education>("background", `/public/education/${id}`, {
    method: "GET",
  });
};

// Experience endpoints
export const createExperience = async (
  experienceData: ExperienceParams
): Promise<Experience> => {
  return apiRequest<Experience>("background", "/private/experience", {
    method: "POST",
    body: JSON.stringify(experienceData),
  });
};

export const updateExperience = async (
  id: string,
  experienceData: Partial<ExperienceParams>
): Promise<Experience> => {
  return apiRequest<Experience>("background", `/private/experience/${id}`, {
    method: "PUT",
    body: JSON.stringify(experienceData),
  });
};

export const deleteExperience = async (id: string): Promise<void> => {
  return apiRequest<void>("background", `/private/experience/${id}`, {
    method: "DELETE",
  });
};

export const getUserExperiences = async (
  userId: string
): Promise<Experience[]> => {
  return apiRequest<Experience[]>(
    "background",
    `/public/experience/user/${userId}`,
    { method: "GET" }
  );
};

export const getExperience = async (id: string): Promise<Experience> => {
  return apiRequest<Experience>("background", `/public/experience/${id}`, {
    method: "GET",
  });
};
