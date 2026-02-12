''
import { baseApi } from "@/lib/api/axios/api";


export const requestNextRound = async (applicationId: string): Promise<any> => {
    // Note: The prompt specifically requested 'request-next-round' for the accept action.
    // This naming might be specific to the backend implementation provided.
    const response = await baseApi.put(`/application/${applicationId}/request-next-round`, { status: 'accept' });
    return response.data;
};

export const respondToNextRound = async (applicationId: string, status: 'accept' | 'reject'): Promise<any> => {
    const response = await baseApi.put(`/application/${applicationId}/respond-next-round`, { status });
    return response.data;
};

export const getApplicationsByJob = async (jobId: string): Promise<any> => {
    const response = await baseApi.get(`/application/get-applications-by-job/${jobId}`);
    console.log("applications by job id ", response.data);
    return response.data;
};

export const getApplicationByUserAndJob = async (userId: string, jobId: string): Promise<any> => {
    const response = await baseApi.get(`/application/get-application-by-user-and-job/${userId}/${jobId}`);
    return response.data;
};

export const getApplicationById = async (id: string): Promise<any> => {
    const response = await baseApi.get(`/application/get-application/${id}`);
    return response.data;
};

export const getMyApplications = async (status?: string): Promise<any> => {
    const params = status && status !== 'all' ? { status } : {};
    const response = await baseApi.get(`/application/my-applications`, { params });
    return response.data;
};


export const scheduleInterview = async (
    applicationId: string,
    data: {
        interviewType: string;
        interviewDate: string;
        interviewTime: string;
        interviewLink?: string;
    }
): Promise<any> => {
    const response = await baseApi.put(`/application/${applicationId}/schedule-interview`, data);
    return response.data;
};

export const interviewDecision = async (applicationId: string, decision: 'accept' | 'reject'): Promise<any> => {
    const response = await baseApi.put(`/application/${applicationId}/interview-decision`, { decision });
    return response.data;
};

export const hire = async (applicationId: string): Promise<any> => {
    const response = await baseApi.put(`/application/${applicationId}/hire`);
    return response.data;
};

export const shortlistApplication = async (applicationId: string): Promise<any> => {
    const response = await baseApi.put(`/application/${applicationId}/shortlist`);
    return response.data;
};

export const rejectApplication = async (applicationId: string): Promise<any> => {
    const response = await baseApi.put(`/application/${applicationId}/reject`);
    return response.data;
};

export const getUserApplicationStats = async (): Promise<any> => {
    const response = await baseApi.get('/application/my-stats');
    return response.data;
};
