import { baseApi } from "@/lib/api/axios/api";
import {
  Job,
  JobCreateParams,
  JobUpdateParams,
  JobSearchParams,
  GetJobResponse,
  PaginatedResponse,
  Application,
  ApplicationCreateParams,
  JobStats,
} from "@/lib/api/types";

export const createJob = async (jobData: JobCreateParams): Promise<Job> => {
  const response = await baseApi.post("/job/create-job", jobData);
  console.log("response of create job in services", response)
  return response.data;
};

export const updateJob = async (
  id: string,
  jobData: JobUpdateParams
): Promise<Job> => {
  const response = await baseApi.put(`/job/update-job/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id: string): Promise<void> => {
  await baseApi.delete(`/job/${id}`);
};

export const renewJob = async (id: string): Promise<any> => {
  const response = await baseApi.put(`/job/renew-job/${id}`);
  return response.data;
};

export const toggleJobStatus = async (id: string): Promise<any> => {
  const response = await baseApi.patch(`/job/toggle-job-status/${id}`);
  return response.data;
};

export const getSavedJobs = async (userId: string): Promise<any[]> => {
  const response = await baseApi.get(`/saved-job/get-saved-jobs/${userId}`);
  return response.data;
};

export const saveJob = async (jobId: string): Promise<any> => {
  const response = await baseApi.post(`/saved-job/add`, { jobId });
  return response.data;
};

export const unsaveJob = async (jobId: string): Promise<any> => {
  const response = await baseApi.delete(`/saved-job/remove/${jobId}`);
  return response.data;
};

export const getJob = async (id: string): Promise<GetJobResponse> => {
  const response = await baseApi.get(`/job/get-job/${id}`);
  console.log("getJob by id ", response.data);
  return response.data;
};

export const getJobInstitute = async (id: string): Promise<any> => {
  const response = await baseApi.get(`/job/get-job-institute/${id}`);
  console.log("getJobInstitute by id ", response.data);
  return response.data;
};

export const searchJobs = async (
  params: JobSearchParams
): Promise<PaginatedResponse<Job>> => {
  const response = await baseApi.get("/job/search", { params });

  const apiResponse = response.data;
  return {
    data: apiResponse.jobs || apiResponse.data || [],
    pagination: {
      page: apiResponse.page || 1,
      limit: apiResponse.pageSize || apiResponse.limit || 20,
      total: apiResponse.total || 0,
      totalPages: Math.ceil((apiResponse.total || 0) / (apiResponse.pageSize || apiResponse.limit || 20)),
      hasNext: (apiResponse.page || 1) < Math.ceil((apiResponse.total || 0) / (apiResponse.pageSize || apiResponse.limit || 20)),
      hasPrevious: (apiResponse.page || 1) > 1,
    },
  };
};

export const listJobs = async (
  page: number = 1,
  pageSize: number = 20,
  jobType?: string,
  location?: string,
  experienceLevel?: string,
  status?: string
): Promise<PaginatedResponse<Job>> => {
  const response = await baseApi.get("/job/all-jobs", {
    params: { page, pageSize, jobType, location, experienceLevel, status },
  });
  console.log("listJobs", response.data);

  const apiResponse = response.data;
  return {
    data: apiResponse.jobs,
    pagination: {
      page: apiResponse.page,
      limit: apiResponse.pageSize,
      total: apiResponse.total,
      totalPages: Math.ceil(apiResponse.total / apiResponse.pageSize),
      hasNext: apiResponse.page < Math.ceil(apiResponse.total / apiResponse.pageSize),
      hasPrevious: apiResponse.page > 1,
    },
  };
};

export const getInstituteJobs = async (
  institute_id: string,
  page: number = 1,
  pageSize: number = 10,
  fields?: string,
  active?: boolean
): Promise<PaginatedResponse<Job>> => {
  const response = await baseApi.get(`/job/institute-jobs/${institute_id}`);

  const apiResponse = response.data;
  return {
    data: apiResponse.jobs || [],
    pagination: {
      page: apiResponse.page || 1,
      limit: apiResponse.pageSize || pageSize,
      total: apiResponse.total || 0,
      totalPages: Math.ceil((apiResponse.total || 0) / (apiResponse.pageSize || pageSize)),
      hasNext: (apiResponse.page || 1) < Math.ceil((apiResponse.total || 0) / (apiResponse.pageSize || pageSize)),
      hasPrevious: (apiResponse.page || 1) > 1,
    },
  };
};

export const getAllApplications = async (jobId: string): Promise<Application[]> => {
  const response = await baseApi.get(`/priv/application/job/${jobId}`);
  return response.data;
};

export const getAllUserApplications = async (userId: string): Promise<Application[]> => {
  const response = await baseApi.get(`/application/get-applications-by-user/${userId}`);
  return response.data;
}

export const getUserJobApplication = async (
  userId: string,
  jobId: string
): Promise<Application> => {
  const response = await baseApi.get(`/priv/application/user/${userId}/job/${jobId}`);
  return response.data;
};

export const applyForJob = async (
  applicationData: ApplicationCreateParams | FormData
): Promise<Application> => {
  const response = await baseApi.post("/application/create-application", applicationData);
  return response.data;
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: string
): Promise<Application> => {
  const response = await baseApi.patch(`/priv/application/${applicationId}/status`, { status });
  return response.data;
};

/**
 * @deprecated This endpoint is deprecated. Use getInstituteStats from institute service instead.
 * For overall institute statistics, use: import { getInstituteStats } from '@/lib/api/services/institute'
 */
export const getJobStats = async (jobId: string): Promise<JobStats> => {
  const response = await baseApi.get(`/priv/job/${jobId}/stats`);
  return response.data;
};

export const getRecommendedJobs = async (
  page: number = 1,
  pageSize: number = 5
): Promise<PaginatedResponse<Job>> => {
  const response = await baseApi.get("/job/recommended-jobs", {
    params: { page, pageSize },
  });

  const apiResponse = response.data;
  return {
    data: apiResponse.jobs || [],
    pagination: {
      page: apiResponse.page || 1,
      limit: apiResponse.pageSize || pageSize,
      total: apiResponse.total || 0,
      totalPages: Math.ceil((apiResponse.total || 0) / (apiResponse.pageSize || pageSize)),
      hasNext: (apiResponse.page || 1) < Math.ceil((apiResponse.total || 0) / (apiResponse.pageSize || pageSize)),
      hasPrevious: (apiResponse.page || 1) > 1,
    },
  };
};
