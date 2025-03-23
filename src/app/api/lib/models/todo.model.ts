import { model, models, Schema } from "mongoose";
import { ITodos } from "../interfaces/todo.interface";

const todoSchema = new Schema<ITodos>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: false },
});

export const Todo = models.Todo || model("Todo", todoSchema);
