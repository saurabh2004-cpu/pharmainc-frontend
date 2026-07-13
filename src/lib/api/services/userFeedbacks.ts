
import { baseApi, baseApiServer } from "@/lib/api/axios/api";
import {
    UserFeedback
} from "@/lib/api/types";

export const createUserFeedback = async (userData: UserFeedback): Promise<UserFeedback> => {
    console.log("Creating user feedback with data:", userData);
    const response = await baseApi.post("/messages/feedback", userData);
    return response.data;
};

