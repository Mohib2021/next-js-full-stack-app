"use client";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { showToast } from "../Toast";
import { revalidateApiByTag } from "@/app/api/lib/revalidation";

interface AddTodoDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  todo?: { _id: string; name: string; description: string; status: string };
}

const AddTodoDialog: React.FC<AddTodoDialogProps> = ({
  open,
  setOpen,
  todo,
}) => {
  const [todoName, setTodoName] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todo) {
      setTodoName(todo.name);
      setTodoDescription(todo.description);
      setStatus(todo.status);
    }
  }, [todo]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/todo", {
        method: todo ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures cookies are sent
        body: JSON.stringify({
          _id: todo?._id,
          name: todoName,
          description: todoDescription,
          status: status || "Pending",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to ${todo ? "update" : "add"} todo`
        );
      }
      await revalidateApiByTag("getTodos");
      showToast("success", `Todo ${todo ? "updated" : "added"} successfully`);
      setOpen(false); // Close dialog
      setTodoName(""); // Reset form
      setTodoDescription("");
    } catch (err: unknown) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: { borderRadius: "20px" },
      }}
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
    >
      <form onSubmit={handleAddTodo}>
        <DialogTitle>{todo ? "UPDATE" : "ADD"} TODO</DialogTitle>

        <Box sx={{ p: 3, pt: 0 }}>
          <TextField
            required
            sx={{ mb: 3, mt: 1 }}
            label="Todo Name"
            fullWidth
            value={todoName}
            onChange={(e) => setTodoName(e.target.value)}
          />
          {todo && (
            <Autocomplete
              sx={{ mb: 3, width: "100%" }}
              disablePortal
              options={["Pending", "Done"]}
              value={status}
              onChange={(_, value) => setStatus(value || "")}
              renderInput={(params) => <TextField {...params} label="Status" />}
            />
          )}
          <TextField
            required
            label="Todo Description"
            fullWidth
            rows={3}
            multiline
            value={todoDescription}
            onChange={(e) => setTodoDescription(e.target.value)}
          />
        </Box>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="outlined"
            onClick={() => setOpen(false)}
            color="info"
          >
            Cancel
          </Button>
          <Button
            color="info"
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : todo ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTodoDialog;
