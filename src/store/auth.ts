import { create } from "zustand";
import {
  ResponseRenew,
  ResponseRegister,
  ResponseLogin,
  IUser,
} from "../interfaces/auth/register.type";
import { devtools } from "zustand/middleware";
import { serverApi } from "../api/config";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import axios from "axios";
// import { toast } from "sonner";
// interface ResponseLogin

interface AuthStore {
  isAuthenticated: boolean;
  user: IUser | null;
  loading: boolean;
  error: boolean | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  revalidate: () => void;
  loginWithGoogle: (idToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    isAuthenticated: false,
    loading: false,
    error: null,
    user: null,
    login: async (email, password) => {
      try {
        // Clear any existing token
        AsyncStorage.removeItem("x-token");

        const data = {
          email,
          password,
        };

        set({ loading: true });

        const resp = await serverApi
          .post<ResponseLogin>("/auth/login", data)
          .then((data) => {
            console.log("Login");
            set({ loading: false });
            // toast.success("Bienvenido");
            Toast.show({
              type: "success",
              text1: "Bienvenido",
              text2: "Has iniciado sesión correctamente",
            });
            return data;
          })
          .catch((error) => {
            console.log("Error");
            console.log({ error });
            set({
              error: true,
              loading: false,
            });
            return error;
          });

        console.log({ resp });

        if (resp?.data?.token) {
          AsyncStorage.setItem("x-token", resp?.data?.token);
          set({
            isAuthenticated: true,
            user: resp.data.user,
            error: false,
          });
          return;
        }

        set({
          isAuthenticated: false,
          user: null,
          error: true,
        });

        Alert.alert("Error", "Usuario o contraseña incorrectos");
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle form submission errors (e.g., display error messages)
        set({
          isAuthenticated: false,
          user: null,
          error: true,
        });
      }
    },

    register: async (name, email, password) => {
      try {
        // Clear any existing token
        AsyncStorage.removeItem("x-token");

        const data = {
          name,
          email,
          password,
        };

        console.log({ data });

        set({ loading: true });

        const resp = await serverApi
          .post<ResponseRegister>("/user", data)
          .then((data) => {
            console.log("Register");
            set({ loading: false });
            // toast.success("Usuario registrado correctamente");
            Toast.show({
              type: "success",
              text1: "Usuario registrado",
              text2: "Usuario registrado correctamente",
            });
            return data;
          })
          .catch((error) => {
            console.log("Error");
            set({
              error: true,
              loading: false,
            });
            return error;
          });

        console.log({ resp });

        if (resp?.data?.token) {
          await AsyncStorage.setItem("x-token", resp.data.token);

          set({
            isAuthenticated: true,
            user: resp.data.user,
            error: false,
          });
          return;
        }

        set({
          isAuthenticated: false,
          user: null,
          error: true,
        });

        Alert.alert("Error", "Error al registrar usuario");
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle form submission errors (e.g., display error messages)
        set({
          isAuthenticated: false,
          user: null,
          error: true,
        });
      }
    },

    revalidate: async () => {
      try {
        const token = await AsyncStorage.getItem("x-token");
        console.log({ token });
        if (token) {
          const resp = await serverApi.get<ResponseRenew>("/auth/renew", {
            headers: {
              "x-token": token,
            },
          });
          console.log({ resp });
          AsyncStorage.setItem("x-token", resp.data.token);
          set({ isAuthenticated: true, user: resp.data.user });
        } else {
          set({ isAuthenticated: false, user: null });
        }
      } catch (error) {
        // console.error("Error revalidating token:", error);
        // set({ isAuthenticated: false, user: null });
        // Manejo del error con Axios
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);

          // Verifica si el error es 401
          if (error.response?.status === 401) {
            console.warn("Token invalid or expired");
            await AsyncStorage.removeItem("x-token"); // Limpia el token inválido
            set({ isAuthenticated: false, user: null });
          }
        } else {
          console.error("Unexpected error:", error);
        }
      }
    },

    loginWithGoogle: async (idToken: string) => {
      try {
        const response = await serverApi.post("/auth/google", {
          id_token: idToken,
        });
        console.log({ response: response.data });
        AsyncStorage.setItem("x-token", response.data.token);
        set({ isAuthenticated: true, user: response.data.user });
      } catch (error) {
        console.error("Error signing in with Google:", error);
        set({ isAuthenticated: false, user: null });
      }
    },

    logout: () => {
      AsyncStorage.removeItem("x-token");
      set({ isAuthenticated: false, user: null });
    },
  }))
);

// import { create } from "zustand";

// interface User {
//   name: string;
//   //   password: string;
//   email: string;
// }

// interface AuthState {
//   user: User | null;
//   login: () => void;
//   logout: () => void;
// }

// const useAuthStore = create<AuthState>((set) => ({
//   user: {
//     name: "John Doe",
//     email: "",
//   },
//   login: () =>
//     set({
//       user: {
//         name: "John Doe",
//         email: "",
//         // password: "password",
//       },
//     }),
//   logout: () =>
//     set({
//       user: null,
//     }),
// }));

// export default useAuthStore;
