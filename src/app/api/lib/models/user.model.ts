import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User =
  mongoose.models.Users || mongoose.model<IUser>("Users", UserSchema);
