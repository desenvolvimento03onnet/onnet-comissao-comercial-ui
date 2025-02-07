import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem(0);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); // Redireciona se não estiver autenticado
    }
    }, [navigate]);
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;