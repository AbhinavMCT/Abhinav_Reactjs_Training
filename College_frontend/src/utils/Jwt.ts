import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  id: number;
  username: string;
  role: string;
  exp: number;
}

export const decodeToken = (
  token: string
): JwtPayload => {

  return jwtDecode<JwtPayload>(token);
};