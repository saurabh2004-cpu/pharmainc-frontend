
import { baseApi } from "@/lib/api/axios/api";

export type ImageType = 'profileImage' | 'coverImage';

export interface ImageUploadResponse {
    profileImage?: string;
    coverImage?: string;
    message?: string;
}

// User Image Services
export const uploadUserImages = async (file: File, type: ImageType): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append(type, file);

    const response = await baseApi.post("/user-images/upload-images", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteUserImage = async (type: ImageType): Promise<void> => {
    await baseApi.delete(`/user-images/delete-user-image/${type}`);
};

// Institute Image Services
export const uploadInstituteImages = async (file: File, type: ImageType): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append(type, file);

    const response = await baseApi.post("/institute-images/upload", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteInstituteImage = async (type: ImageType): Promise<void> => {
    await baseApi.delete(`/institute-images/${type}`);
};
