import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development";

export const signToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; role: string };
  } catch (error) {
    return null;
  }
};

export const getUserFromCookie = () => {
  const token = cookies().get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
};
