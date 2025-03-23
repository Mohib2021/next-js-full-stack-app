import React from "react";
import TodoTable from "./TodoTable";
import { cookies } from "next/headers";

const ShowTodo = async ({ page, limit }: { page: string; limit: string }) => {
  const pageNumber = page ? Number(page) : 1;
  const limitCount = limit ? Number(limit) : 20;

  const cookieStore = await cookies(); // ✅ Read cookies from the request
  const authCookie = cookieStore.get("accessToken")?.value || ""; // Replace with actual cookie name

  const todos = await fetch(
    `http://localhost:3000/api/todo?page=${pageNumber}&limit=${limitCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${authCookie}`,
      },

      next: { tags: ["getTodos"] },
    }
  );

  const { data, pagination } = await todos.json();
  return (
    <div>
      <TodoTable
        todos={data}
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        limit={limitCount}
      />
    </div>
  );
};

export default ShowTodo;
