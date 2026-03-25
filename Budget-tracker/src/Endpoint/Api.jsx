import axios from "axios";

export const createApi = ({ getAccessToken, getRefreshToken, setTokens, logout }) => {
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: { "Content-Type": "application/json" },
  });

  api.interceptors.request.use((config) => {
    const access = getAccessToken();
    if (access) config.headers.Authorization = `Bearer ${access}`;
    return config;
  });

  let isRefreshing = false;
  let pendingRequests = [];

  const processQueue = (error, token = null) => {
    pendingRequests.forEach((p) => {
      if (error) p.reject(error);
      else p.resolve(token);
    });
    pendingRequests = [];
  };

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;
      const status = err?.response?.status;


      if (!originalRequest || status !== 401) {
        return Promise.reject(err);
      }

      if (originalRequest._retry) {
        return Promise.reject(err)
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("No refresh token available");

        const refreshResp = await axios.post(
          `${api.defaults.baseURL}token/refresh/`,
          { refresh },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccess = refreshResp.data.access;
        const newRefresh = refreshResp.data.refresh || refresh;

        setTokens({ access: newAccess, refresh: newRefresh });

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        processQueue(null, newAccess);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        try {
          logout();
        } catch (e) {
          console.warn("logout error after refresh failure:", e);
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return api;
};
