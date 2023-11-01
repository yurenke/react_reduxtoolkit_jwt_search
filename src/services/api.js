import axios from "axios";
import TokenService from "services/token.service";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        if(!config._isrefreshing) {
            config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
        // config.headers["x-access-token"] = token; // for Node.js Express back-end
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== "/v1/auth/signin" && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const rs = await instance.post("/v1/auth/refreshtoken", {}, {
                        headers: {Authorization: "Bearer " + TokenService.getLocalRefreshToken()},
                        _retry: true,
                        _isrefreshing: true
                        // refreshToken: TokenService.getLocalRefreshToken(),
                    });

                    const { accessToken } = rs.data;
                    TokenService.updateLocalAccessToken(accessToken);

                    return instance(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    }
);
  
export default instance;