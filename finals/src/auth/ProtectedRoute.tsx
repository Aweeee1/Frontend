import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/auth/AuthContext";
import { LoadingState } from "@/components/PagePrimitives";

export default function ProtectedRoute({ role }: { role?: "donor" | "collector" }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to="/drives" replace />;

  return <Outlet />;
}
