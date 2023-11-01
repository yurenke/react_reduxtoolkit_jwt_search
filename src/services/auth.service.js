// import axios from "axios";
import api from "services/api";
import TokenService from "services/token.service";

// const API_URL = "http://localhost:5000/auth/";

const register = (username, email, password) => {
  return api.post("/v1/auth/signup", {
    username: username,
    email: email,
    password: password,
  });
};

const login = (email, password) => {
  return api
    .post("/v1/auth/signin", {
        email: email,
        password: password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        // localStorage.setItem("user", JSON.stringify(response.data));
        TokenService.setUser(response.data);
      }

      return response.data;
    });
};

const logout = () => {
  // localStorage.removeItem("user");
  TokenService.removeUser();
};

const AuthService = {
  register,
  login,
  logout,
};

export default AuthService;