import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// AGREGAMOS EL TOKEN A LA PETICION
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // SEPARAMOS 401 DE LOS OTROS ERRORES
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // EVITAMOS LOOP INFINITO
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // SI YA HAY REFRESH EN CURSO → ESPERAR
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    // INTENTAMOS REFRESH
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      const { data } = await axios.post(
        "http://localhost:3000/api/auth/refresh",
        { refreshToken }
      );

      const newToken = data.token;

      localStorage.setItem("token", newToken);

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);

      // REFRESH FALLÓ → LOGOUT 
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      window.location.href = "/login";

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
export default api;
