import { NextRequest, NextResponse } from "next/server";
import { Todo } from "../lib/models/todo.model";
import { withAuthentication, getPaginationParams } from "../lib/helpers";
import { IError } from "../lib/interfaces/common.interface";

async function getTodo(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { page, limit } = getPaginationParams(searchParams);
    // Ensure page & limit are valid
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Invalid page or limit" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit; // Calculate how many items to skip
    const totalTodos = await Todo.countDocuments(); // Get total number of todos

    const todos = await Todo.find().skip(skip).limit(limit).exec();
    return NextResponse.json(
      {
        status: 200,
        data: todos,
        pagination: {
          total: totalTodos,
          totalPages: Math.ceil(totalTodos / limit),
          currentPage: page,
          pageSize: limit,
        },
      },
      {
        headers: {
          "x-next-cache-tags": "getTodos",
        },
      }
    );
  } catch (error: unknown) {
    const err = error as IError;
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

async function postTodo(req: NextRequest) {
  try {
    const text = await req.json();

    if (!text)
      return NextResponse.json({ error: "Text is required" }, { status: 400 });

    const newTodo = new Todo(text);
    await newTodo.save();

    return NextResponse.json(
      { message: "Todo is added successfully", data: newTodo },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as IError;
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

async function deleteTodo(req: Request) {
  try {
    const todoIds = await req.json(); // Extract IDs from request body

    if (!Array.isArray(todoIds) || todoIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty todoIds array" },
        { status: 400 }
      );
    }

    // Delete todos where _id matches any in the array
    const result = await Todo.deleteMany({ _id: { $in: todoIds } });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "No todos found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Todos deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    const err = error as IError;
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

async function updateTodoStatus(req: Request) {
  try {
    const { todoIds, status } = await req.json(); // Extract IDs & new status

    // Validate input
    if (!Array.isArray(todoIds) || todoIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty todoIds array" },
        { status: 400 }
      );
    }

    // Update multiple todos
    const result = await Todo.updateMany(
      { _id: { $in: todoIds } },
      { $set: { status: status } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No todos were found to updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Todos updated successfully",
      updatedCount: result.modifiedCount,
    });
  } catch (error: unknown) {
    const err = error as IError;
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
async function updateTodo(req: Request) {
  try {
    const { _id, name, description, status } = await req.json(); // Extract IDs & new status

    // Validate input
    if (!_id) {
      return NextResponse.json(
        { error: "Invalid or empty todoId" },
        { status: 400 }
      );
    }

    const result = await Todo.findOneAndUpdate(
      { _id }, // Find todo by ID
      { $set: { name, description, status } },
      { new: true, runValidators: true }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No todo was found to updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Todos updated successfully",
      updatedCount: result.modifiedCount,
    });
  } catch (error: unknown) {
    const err = error as IError;
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export const GET = withAuthentication(getTodo);
export const POST = withAuthentication(postTodo);
export const DELETE = withAuthentication(deleteTodo);
export const PATCH = withAuthentication(updateTodoStatus);
export const PUT = withAuthentication(updateTodo);
