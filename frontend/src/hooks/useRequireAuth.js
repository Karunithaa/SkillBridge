import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const requireAuth = (message = "Please sign in to continue.") => {
    if (loading) return false;
    if (!isAuthenticated) {
      showToast(message, false);
      const redirect = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/login?redirect=${redirect}`);
      return false;
    }
    return true;
  };

  return { requireAuth, isAuthenticated, loading };
}
