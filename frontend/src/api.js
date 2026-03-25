import axios from "axios";

const API = axios.create({
  baseURL: "https://gyani-vxc9.onrender.com/api/courses",
});

export default API;
