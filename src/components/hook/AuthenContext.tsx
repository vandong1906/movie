import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define interface for User (aligned with App.tsx)
interface User {
  user_id: string | null;
  role: "admin" | "user";
}

// Define interface for AuthContext
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}

// Create Context with default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define Props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check login status when component mounts
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("user");

    if (loggedIn === "true" && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Validate parsed user object
        if (
          parsedUser &&
          typeof parsedUser === "object" &&
          "user_id" in parsedUser &&
          "role" in parsedUser
        ) {
          setIsLoggedIn(true);
          setUser(parsedUser);
        } else {
          // Clear invalid data
          console.warn("Invalid user data in localStorage, clearing...");
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  // Login function
  const login = (user: User) => {
    if (!user.user_id || !user.role) {
      console.error("Invalid user data provided to login:", user);
      return;
    }
    setUser(user);
    console.log(user);
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
