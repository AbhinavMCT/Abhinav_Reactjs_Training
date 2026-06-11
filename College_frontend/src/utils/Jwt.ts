import { jwtDecode } from "jwt-decode";
import {JwtPayload} from "../types/Datatypes.ts"

export const decodeToken = (
  token: string
): JwtPayload => {

  return jwtDecode<JwtPayload>(token);
};