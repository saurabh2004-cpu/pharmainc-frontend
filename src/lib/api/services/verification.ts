import { baseApi } from "@/lib/api/axios/api";

export const submitVerification = async (formData: FormData) => {
    const response = await baseApi.post("/user-verifications/create-verification", formData, {
        transformRequest: [(data) => data],
    });
    return response.data;
};

export const submitInstituteVerification = async (formData: FormData) => {
    const response = await baseApi.post("/institute-verifications/create-verification", formData, {
        transformRequest: [(data) => data],
    });
    return response.data;
};

export const getVerificationByUserId = async (userId: string) => {
    try {
        const response = await baseApi.get(`/user-verifications/get-verification-by-user-id/${userId}`);
        console.log("get verification response", response)
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
};

export const getInstituteVerificationByInstituteId = async (instituteId: string) => {
    const response = await baseApi.get(`/institute-verifications/get-verification/${instituteId}`);
    console.log("get institute verification response", response)
    return response.data;
};
