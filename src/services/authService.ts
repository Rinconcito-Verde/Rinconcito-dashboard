export const AuthService = {
  login: async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8787/api/auth/login", {
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

};
