import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../types/Datatypes.ts";

export const decodeToken = (
  token?: string | null
): JwtPayload | null => {
  try {
    if (!token) return null;

    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};