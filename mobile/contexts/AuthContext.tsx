import api from "@/services/api";
import { LoginResponse, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  async function signIn(email: string, password: string) {
    try {
      setLoading(true);

      const response = await api.post<LoginResponse>("/session", {
        email,
        password,
      });

      const { token, ...userData } = response.data;

      await AsyncStorage.setItem("@restaurant-token", token);
      await AsyncStorage.setItem("@restaurant-user", JSON.stringify(userData));

      setUser(userData);
      setSigned(true);
    } catch (error: any) {
      if (error.response?.data?.error) {
        console.log(error.response.data.error);
        throw new Error(error.response.data.error);
      }
      console.log(error);
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed,
        loading,
        signIn,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
