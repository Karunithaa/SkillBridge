import jwt from "jsonwebtoken";
import Users from "../model/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "skillbridge-dev-secret-change-in-production";

export function signToken(user) {
  return jwt.sign(
    { id: user._id, studentName: user.studentName, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }
  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET);
    const user = await Users.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Account not found. Please sign in again." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired. Please sign in again." });
  }
}

export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();
  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET);
    const user = await Users.findById(decoded.id).select("-password");
    if (user) req.user = user;
  } catch {
    /* ignore invalid token */
  }
  next();
}
