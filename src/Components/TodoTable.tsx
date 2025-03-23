"use client";
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
import React from "react";
import TodoActions from "./TodoActions";
import { useRouter } from "next/navigation";

interface Todo {
  _id: string;
  name: string;
  description: string;
  status: string;
}

const TodoTable = ({
  todos,
  totalPages,
  currentPage,
  limit,
}: {
  todos: Todo[];
  totalPages: number;
  currentPage: number;
  limit: number;
}) => {
  const router = useRouter();

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/?page=${value}&limit=${limit || 20}`);
  };

  return (
    <Box sx={{ my: 4 }}>
      <Card sx={{ borderRadius: "20px", p: 2.5 }}>
        {todos?.length > 0 ? (
          <>
            <TableContainer>
              <Table>
                <TableHead
                  sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                >
                  <TableRow>
                    <TableCell width={"20%"}>Name</TableCell>
                    <TableCell width={"50%"}>Description</TableCell>
                    <TableCell width={"15%"}>Status</TableCell>
                    <TableCell width={"15%"}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todos.map((todo) => (
                    <TableRow key={todo._id}>
                      <TableCell>{todo.name}</TableCell>
                      <TableCell>{todo.description}</TableCell>
                      <TableCell>
                        <Button
                          color={
                            todo.status === "Pending" ? "warning" : "success"
                          }
                          variant="outlined"
                        >
                          {todo.status}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <TodoActions todo={todo} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        ) : (
          <Box>
            <Box sx={{ textAlign: "center", my: 3 }}>No todos found.</Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default TodoTable;
