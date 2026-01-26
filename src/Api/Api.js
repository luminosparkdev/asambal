import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// AGREGAMOS EL TOKEN A LA PETICION
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const clubId = localStorage.getItem("activeClubId");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (clubId) {
    config.headers["X-club-id"] = clubId;
  }

  return config;
});

let isRefreshing = false;
let failedQueue = [];

//PROCESAMOS LAS PETICIONES QUE QUEDARON EN ESPERA MIENTRAS SE REFRESCABA EL TOKEN
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
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    //ERROR 401 EN LA RUTA /refresh, TOKEN EXPIRADO
    if (originalRequest.url === "/auth/refresh") {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // EVITAMOS LOOP INFINITO
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // SI YA HAY REFRESH EN CURSO, PONEMOS LA PETICION EN COLA
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
      .then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      })
      .catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    // INTENTAMOS REFRESH
    try {

      const { data } = await api.post("/auth/refresh", {}, { withCredentials: true });

      const newToken = data.token;

      localStorage.setItem("token", newToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

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
