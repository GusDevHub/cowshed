import api from "@/services/api";
import { LoginResponse, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadData() {
      await loadStorageData();
    }
    loadData();
  }, []);

  async function loadStorageData() {
    try {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem("@restaurant-token");
      const storedUser = await AsyncStorage.getItem("@restaurant-user");
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

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

  async function signOut() {
    await AsyncStorage.multiRemove(["@restaurant-token", "@restaurant-user"]);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loading,
        signIn,
        user,
        signOut,
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
