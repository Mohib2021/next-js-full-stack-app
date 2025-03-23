import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "TodoApp",
    });
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};
