const API_BASE_URL: string = import.meta.env.VITE_SHOP_API_URL || "http://localhost:8787/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const AuthService = {
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(API_BASE_URL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Error en login:", error);
      return null;
    }
  },

  register: async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in registration:", error);
      throw new Error("Error in registration:"+ error);
    }
  },

  changePassword: async (username:string, oldPassword:string, newPassword:string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ username, oldPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      return true
    } catch (error) {
      console.error("Error changing password:", error);
      throw new Error(error.message || "Failed to change password");
    }
  },

  deleteUser: async (username: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/${username}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      return true;
    } catch (error) {
      console.error("Error deleting user: ", error);
      throw new Error("Failed to delete user");
    }
  },
};
