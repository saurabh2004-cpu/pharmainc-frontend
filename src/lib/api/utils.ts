import { AuthResponse } from "./types";

const API_BASE_URLS = {
  auth: process.env.NEXT_PUBLIC_API_AUTH!,
  user: process.env.NEXT_PUBLIC_API_USER!,
  network: process.env.NEXT_PUBLIC_API_NETWORK!,
  background: process.env.NEXT_PUBLIC_API_BACKGROUND!,
  institute: process.env.NEXT_PUBLIC_API_INSTITUTE!,
  job: process.env.NEXT_PUBLIC_API_JOB!,
  content: process.env.NEXT_PUBLIC_API_CONTENT!,
};

export const setAuthToken = (token: string, userType?: string) => {
  if (typeof window !== "undefined") {
    // Set cookie with httpOnly flag for security
    // document.cookie = `accessToken=${token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`; // 7 days

    // if (userType) {
    //   document.cookie = `userType=${userType}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`; // 7 days
    // }
    document.cookie = `accessToken=${token}; path=/; samesite=strict; max-age=${7 * 24 * 60 * 60}`; // 7 days

    if (userType) {
      document.cookie = `userType=${userType}; path=/; samesite=strict; max-age=${7 * 24 * 60 * 60}`; // 7 days
    }
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'accessToken') {
        return value;
      }
    }
  }
  return null;
};

export const getUserType = (): string | null => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'userType') {
        return value;
      }
    }
  }
  return null;
};

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "userType=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const apiRequest = async <T>(
  service: keyof typeof API_BASE_URLS,
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, unknown>
): Promise<T> => {
  // Add query params if they exist
  let url = `${API_BASE_URLS[service]}${endpoint}`;
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    url += `?${queryParams.toString()}`;
  }

  // Add auth header if token exists
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (getAuthToken() !== null) {
    headers["Authorization"] = `Bearer ${getAuthToken()}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API request failed with status ${response.status}`
    );
  }

  // Handle cases where response might be empty (e.g., 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  const responseText = await response.text();

  // First try to parse as JSON
  try {
    const data = responseText ? JSON.parse(responseText) : {};
    if (!response.ok) {
      throw new Error(
        data.message || `API request failed with status ${response.status}`
      );
    }
    return data as T;
  } catch (error) {
    // If JSON parsing fails but we got a successful response
    if (response.ok) {
      // For successful plain text responses, return an object with the message
      return { message: responseText } as T;
    }
    // For error responses, throw the text as error
    throw new Error(responseText);
  }
};

export const handleLogin = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>("auth", "/public/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  setAuthToken(response.token);
  return response;
};

export const handleRegister = async (credentials: {
  email: string;
  password: string;
  type?: string;
}): Promise<void> => {
  await apiRequest<void>("auth", "/public/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};
