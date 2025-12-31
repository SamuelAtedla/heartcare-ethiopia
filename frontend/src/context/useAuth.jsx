import { useContext } from "react";
import { AuthProvider } from "./AuthContext";
// Custom hook for easy access
export const useAuth = () => useContext(AuthProvider);