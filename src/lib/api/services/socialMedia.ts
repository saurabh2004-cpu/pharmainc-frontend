import { baseApi } from "@/lib/api/axios/api";

export interface SocialMediaLink {
    id: string;
    link: string;
    platform: 'TWITTER' | 'LINKEDIN' | 'INSTAGRAM' | 'FACEBOOK';
    userId?: string;
    instituteId?: string;
}

export const createUserSocialMediaLink = async (data: { link: string; platform: string }): Promise<SocialMediaLink> => {
    const response = await baseApi.post("/social-media/user", data);
    return response.data;
};

export const deleteUserSocialMediaLink = async (id: string): Promise<void> => {
    await baseApi.delete(`/social-media/user/${id}`);
};

export const getUserSocialMediaLinks = async (userId: string): Promise<SocialMediaLink[]> => {
    const response = await baseApi.get(`/social-media/user/${userId}`);
    return response.data;
};

export const createInstituteSocialMediaLink = async (data: { link: string; platform: string }): Promise<SocialMediaLink> => {
    const response = await baseApi.post("/social-media/institute", data);
    return response.data;
};

export const deleteInstituteSocialMediaLink = async (id: string): Promise<void> => {
    await baseApi.delete(`/social-media/institute/${id}`);
};

export const getInstituteSocialMediaLinks = async (instituteId: string): Promise<SocialMediaLink[]> => {
    const response = await baseApi.get(`/social-media/institute/${instituteId}`);
    return response.data;
};
