import axios from 'axios';

const baseURL = process.env.REACT_APP_API_KEY;

const apiClient = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const refreshTokenEndpoint = 'auth/jwt/refresh';

// Function to get a new token
const getNewToken = async () => {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
        throw new Error('Refresh token not available');
    }

    try {
        const response = await axios.post(`${baseURL}${refreshTokenEndpoint}`, {
          refresh: refreshToken,
        });
        const { access } = response.data;

        // Update tokens in localStorage
        localStorage.setItem('access', access);

        return access;
    } catch (error) {
        console.error('Token refresh failed:', error);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        throw error;
    }
};

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `JWT ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        // Prevent infinite retry loops
        originalRequest._retry = true; 

        try {
            const newToken = await getNewToken();
            originalRequest.headers.Authorization = `JWT ${newToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            console.error('Token refresh failed, logging out...');
            throw refreshError;
        }
    }

    return Promise.reject(error);
  }
);

const ApiService = {
    get: (url, params = {}) => apiClient.get(url, { params }),
    post: (url, data) => apiClient.post(url, data),
    put: (url, data) => apiClient.put(url, data),
    delete: (url) => apiClient.delete(url),
};

export default ApiService;