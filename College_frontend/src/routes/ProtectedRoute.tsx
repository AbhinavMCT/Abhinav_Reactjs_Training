import React from "react";
import { Navigate } from "react-router-dom";
import { decodeToken } from "../utils/Jwt.ts";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({children,allowedRoles,}: Props) => {

  const token = localStorage.getItem("access");

  if (!token) {
    return <Navigate to="/" replace />;
  }
  let decoded;
  try {
    decoded = decodeToken(token);

  } catch {

    return <Navigate to="/" replace />;
  }
  if (allowedRoles.includes(decoded.role)) {
      return children;
    }

    return <Navigate to="/" replace />;
};

export default ProtectedRoute;