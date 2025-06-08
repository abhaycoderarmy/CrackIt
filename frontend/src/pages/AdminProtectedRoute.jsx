import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login"); // Or redirect to /login if needed
    }
  }, [user, navigate]);

  return <>{user?.role === "admin" ? children : null}</>;
};

export default AdminProtectedRoute;
