import jwt from "jsonwebtoken";
import AdminModel from "../models/AdminModel.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN || "your_jwt_secretjvdjhdpppp";

export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET_ADMIN);
      req.admin = await AdminModel.findById(decoded.id).select("-password");
      if (!req.admin) {
        return res.status(401).json({ message: "Not authorized" });
      }

      next(); 
    } catch (error) {
      console.error("Admin auth error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
