import { baseApi } from "@/lib/api/axios/api";
import { Specialty, SpecialtySearchParams, SpecialtySearchResponse, SpecialtyCreateParams } from "@/lib/api/types";

export const searchSpecialties = async (
  params: SpecialtySearchParams
): Promise<SpecialtySearchResponse> => {
  const response = await baseApi.get("/pub/specialty/search", { params });
  return response.data;
};

export const createSpecialty = async (
  specialtyData: SpecialtyCreateParams
): Promise<Specialty> => {
  const response = await baseApi.post("/priv/specialty", specialtyData);
  return response.data;
};
