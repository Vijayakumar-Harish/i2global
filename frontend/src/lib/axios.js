import axios from "axios";

const instance = axios.create({
 baseURL: "http://localhost:8007",
  withCredentials: false, // cookies if you switch to sessions later
});

instance.interceptors.request.use((config) => {
    const t = localStorage.getItem("token");
    console.log("🔑 interceptor sees:", t, "for", config.url);
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});


export default instance;
