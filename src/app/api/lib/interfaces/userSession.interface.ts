import mongoose from "mongoose";

export interface IUserSession {
  userId: mongoose.Schema.Types.ObjectId;
  refreshToken: string;
  ip: string;
  userAgent: string;
}
