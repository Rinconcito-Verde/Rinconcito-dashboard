import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthService } from "../services/authService";

interface AuthContextType {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar token desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !isTokenExpired(storedToken)) {
      const { username } = decodeToken(storedToken);
      setToken(storedToken);
      setUsername(username);
    } else {
      logout();
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const jwt = await AuthService.login(username, password);
    if (jwt) {
      const decoded = decodeToken(jwt);
      localStorage.setItem("token", jwt);
      setToken(jwt);
      setUsername(decoded.username);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      username: payload.username || null,
      exp: payload.exp * 1000,
    };
  } catch (error) {
    return { username: null, exp: 0 };
  }
}

function isTokenExpired(token: string): boolean {
  const { exp } = decodeToken(token);
  return exp < Date.now();
}