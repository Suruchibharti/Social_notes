import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

export default function ProtectedRoute({ children }) {
  const { token, booting } = useAuth();
  if (booting) return <Loader label="Opening SocialBlog" />;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
