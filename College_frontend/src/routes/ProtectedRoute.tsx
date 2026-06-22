import React from "react";
import { Navigate } from "react-router-dom";
import { decodeToken } from "../utils/Jwt.ts";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({
  children,
  allowedRoles,
}: Props) => {
  const token =
    localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const decoded = decodeToken(token);

  if (!decoded) {
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    return <Navigate to="/" replace />;
  }

  if (
    allowedRoles.includes(
      decoded.role
    )
  ) {
    return <>{children}</>;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;