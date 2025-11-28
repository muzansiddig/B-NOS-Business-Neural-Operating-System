import { createContext, useContext, useEffect, useState } from "react";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
    timezone?: string;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem("bnos_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("bnos_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Get user's geolocation and timezone
  const getLocationInfo = async (): Promise<UserProfile["location"]> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Get timezone from latitude/longitude
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            // In production, you would use a geolocation API to get city/country
            resolve({
              latitude,
              longitude,
              timezone,
              city: "Unknown",
              country: "Unknown",
            });
          },
          () => {
            // Fallback if geolocation fails
            resolve({
              latitude: 0,
              longitude: 0,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });
          }
        );
      } else {
        resolve({
          latitude: 0,
          longitude: 0,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }
    });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In production, this would call your backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await response.json();
      const location = await getLocationInfo();
      
      const userProfile: UserProfile = {
        ...userData,
        location,
      };
      
      setUser(userProfile);
      localStorage.setItem("bnos_user", JSON.stringify(userProfile));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // In production, this would call your backend
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const userData = await response.json();
      const location = await getLocationInfo();
      
      const userProfile: UserProfile = {
        ...userData,
        location,
      };
      
      setUser(userProfile);
      localStorage.setItem("bnos_user", JSON.stringify(userProfile));
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bnos_user");
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Profile update failed");
      }

      const updated = await response.json();
      const userProfile: UserProfile = {
        ...user,
        ...updated,
      };
      
      setUser(userProfile);
      localStorage.setItem("bnos_user", JSON.stringify(userProfile));
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
