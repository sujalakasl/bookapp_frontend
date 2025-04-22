import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
//Create a Global Store with Zustand
// Zustand is a small, fast, and scalable bearbones state-management solution
// that is easy to use and has a small footprint.
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, password, email) => {
    set({ isLoading: true });
    try {
      // Call the API from backend to register the user
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);
      set({ token: data.token, user: data.user, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
}));
