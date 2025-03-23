import mongoose from "mongoose";
import { IUserSession } from "../interfaces/userSession.interface";

const UserSessionSchema = new mongoose.Schema<IUserSession>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  refreshToken: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
});

export const UserSession =
  mongoose.models.UserSession ||
  mongoose.model("UserSession", UserSessionSchema);
