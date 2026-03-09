import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User, type IUser } from "./model.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      res.status(403).json({
        message: "Please login",
      });
      return;
    }

    const decodedValue = jwt.verify(
      token,
      process.env.JWT_SEC as string,
    ) as JwtPayload;

    if (!decodedValue || !decodedValue._id) {
      res.status(403).json({
        message: "Invalid token",
      });
      return;
    }

    const UserID = decodedValue._id;
    const user = await User.findById(UserID).select("-password");

    if (!user) {
      res.status(403).json({
        message: "User not found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({
      message: "Please login",
    });
  }
};
