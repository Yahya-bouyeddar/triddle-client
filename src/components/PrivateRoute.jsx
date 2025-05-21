import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";



export function PrivateRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    
    return <Navigate to="/login" replace />;
  }

  return children;
}