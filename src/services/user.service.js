// import axios from "axios";
// import authHeader from "services/auth-header";

// const API_URL = "http://localhost:5000/posts/";
import api from "services/api";

const getPosts = (params) => {
    // console.log('service received params: ' + params)
    // return axios.get(API_URL + 'all', { params: { page: page }, headers: authHeader() });
    return api.get("/posts/all", {params});
};

const createPost = (inputs) => {
    // return axios.post(API_URL + 'create', inputs, { headers: authHeader() });
    return api.post("/posts/create", inputs);
};

const viewPost = (id) => {
    // return axios.get(API_URL + id, { headers: authHeader() });
    return api.get("/posts/" + id);
};

const editPost = (id, inputs) => {
    // return axios.put(API_URL + id, inputs, { headers: authHeader() });
    return api.put("/posts/" + id, inputs);
};

const deletePost = (id) => {
    // return axios.delete(API_URL + id, { headers: authHeader() });
    return api.delete("/posts/" + id);
};

const UserService = {
  getPosts,
  createPost,
  viewPost,
  editPost,
  deletePost
};

export default UserService;