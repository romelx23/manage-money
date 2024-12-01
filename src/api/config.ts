import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// const api_url = "https://quiz-english-back.vercel.app";
const api_url = "https://0xh3m6qc-8080.brs.devtunnels.ms";
// const api_url = "http://localhost:8080";
// const api_url = "http://192.168.1.7:8080";

export const serverApi = axios.create({
  baseURL: `${api_url}/api`,
});

serverApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("x-token"); // Obtener el token desde AsyncStorage
    console.log(token);
    // No establecer Content-Type, Axios lo hará automáticamente cuando uses FormData
    return config;
  },
  (error) => {
    console.log({ error });
    // Handle request errors if needed
    return Promise.reject(error);
  }
);
