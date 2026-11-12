import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin, profileLoading, profileError } = useAuth();
  const location = useLocation();

  if (loading || (requireAdmin && user && profileLoading)) return <div className="route-loader">Loading RÉDWÍNE…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  if (requireAdmin && !isAdmin) {
    return (
      <div className="route-loader" style={{ textAlign: "center", padding: 24, gap: 14 }}>
        <div>
          <p style={{ fontSize: "1.1rem", color: "#f7f4ef", margin: "0 0 8px" }}>
            {profileError ? "We couldn't reach the server." : "This workspace is restricted."}
          </p>
          <p style={{ margin: "0 0 20px", letterSpacing: 0 }}>
            {profileError ? profileError : "Your account doesn't have administrator access."}
          </p>
          <Link to="/" style={{ color: "#c27a8b" }}>← Back to website</Link>
        </div>
      </div>
    );
  }
  return children;
}
