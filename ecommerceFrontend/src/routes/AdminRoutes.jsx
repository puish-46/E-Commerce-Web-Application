import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/authStore";

const AdminRoutes = () => {
  const user = useAuthStore((state) => state.user);

  // NOT LOGGED IN
  if (!user) {
    return <Navigate to="/login" />;
  }

  // NOT ADMIN
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  // ADMIN ACCESS — render child routes
  return <Outlet />;
};

export default AdminRoutes;