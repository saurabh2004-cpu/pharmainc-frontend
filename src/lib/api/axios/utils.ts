import axios from "axios";

export function applyInterceptors(instance : ReturnType<typeof axios.create>){
    instance.interceptors.request.use(
        (config) => {
            // Read token from cookies
            if (typeof document !== 'undefined') {
                const token = getCookieValue('token') || getCookieValue('auth-token') || getCookieValue('authToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            // Add any response interceptors here if needed
            return response;
        },
        (error) => {
            if (error.response?.status === 401) {
                if (typeof document !== 'undefined') {
                    deleteCookie('token');
                    deleteCookie('auth-token');
                    deleteCookie('authToken');
                    
                    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
                        window.location.href = '/auth';
                    }
                }
            }
            return Promise.reject(error);
        }
    );
    
    return instance;
}

// Helper function to get cookie value by name
function getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
}

// Helper function to delete a cookie by name
function deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    
    // Delete cookie by setting it to expire in the past
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    // Also try with domain if it exists
    const domain = window.location.hostname;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
}