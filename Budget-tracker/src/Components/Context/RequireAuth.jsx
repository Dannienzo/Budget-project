// src/Context/RequireAuth.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
  const { accessToken, tryRefresh } = useAuth();
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (accessToken) {
        if (mounted) setChecking(false);
        return;
      }
      const ok = await tryRefresh();
      if (mounted) setChecking(false);
      if (!ok) {
        // nothing else to do — component will redirect below
      }
    })();
    return () => {
      mounted = false;
    };
  }, [accessToken, tryRefresh]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400">Checking authentication...</div>
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
