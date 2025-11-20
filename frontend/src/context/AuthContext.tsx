"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  firstName?: string;
}

interface AuthResponse {
  token: string;
  email: string;
  firstName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

const _rawBackend = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const backendUrl = `${_rawBackend.replace(/\/$/, "")}/api`;

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const firstName = localStorage.getItem("firstName");
    if (token && email) {
      setUser({ email, firstName: firstName || undefined });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data: AuthResponse = await res.json();

    if (!res.ok) {
      throw new Error(
        data?.token ? "Login failed" : data?.email || "Login failed"
      );
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    if (data.firstName) localStorage.setItem("firstName", data.firstName);

    setUser({ email: data.email, firstName: data.firstName });
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
