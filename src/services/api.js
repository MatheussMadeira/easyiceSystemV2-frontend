import axios from "axios";

const api = axios.create({
  baseURL: "https://easyicesystemv2-backend.onrender.com/api", // Endereço do seu Node.js
  //baseURL: "http://localhost:3001/api",
});

export default api;
