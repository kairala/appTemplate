import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { jwtDecode } from "jwt-decode";

// Define the shape of our auth state
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

// Define the auth context value shape
interface AuthContextValue extends AuthState {
  setAccessToken: (accessToken: string) => Promise<boolean>;
  setRefreshToken: (refreshToken: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAccessExpired: boolean;
  isRefreshExpired: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  setAccessToken: (accessToken: string) => Promise<boolean>;
  setRefreshToken: (refreshToken: string) => Promise<boolean>;
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
  logout: () => Promise<void>;
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  getAccessToken,
  getRefreshToken,
  logout,
  setAccessToken,
  setRefreshToken,
}) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
  });

  // Load stored auth state on startup
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();

        if (accessToken && refreshToken) {
          setState({
            isAuthenticated: accessToken !== null,
            accessToken,
            refreshToken,
            user: null,
          });
        }
      } catch (error) {
        console.error("Failed to load auth state", error);
      }
    };

    loadStoredAuth();
  }, []);

  const isAccessExpired = useMemo(() => {
    if (!state.accessToken) {
      return true;
    }

    const payload = jwtDecode(state.accessToken);
    const { exp, iat } = payload as { exp: number; iat: number };
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const isExpired = exp < currentTime - 60 * 5; // 5 minutes

    return isExpired;
  }, [state.accessToken]);

  const isRefreshExpired = useMemo(() => {
    if (!state.refreshToken) {
      return true;
    }

    const payload = jwtDecode(state.refreshToken);
    const { exp, iat } = payload as { exp: number; iat: number };
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = exp < currentTime;

    return isExpired;
  }, [state.refreshToken]);

  const value: AuthContextValue = {
    ...state,
    logout,
    setAccessToken,
    setRefreshToken,
    isAccessExpired,
    isRefreshExpired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for accessing auth context
export const useAuthSession = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthSession must be used within an AuthProvider");
  }

  return context;
};

export default useAuthSession;
