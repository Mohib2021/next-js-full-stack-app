import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { showToast } from "./Toast";
import { revalidateApiByTag } from "@/app/api/lib/revalidation";
import AddTodoDialog from "./AddTodo/AddTodoDialog";
interface Todo {
  _id: string;
  name: string;
  description: string;
  status: string;
}
function TodoActions({ todo }: { todo: Todo }) {
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleDeleteTodo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/todo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([todo._id]),
      });
      const data = await res.json();
      if (data.deletedCount) {
        await revalidateApiByTag("getTodos");
        showToast("success", data.message);
      } else {
        showToast("error", data.message);
      }
    } catch {
      showToast("error", "Failed to delete todo!");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateStatus = async (status: string) => {
    setLoadingStatus(true);
    try {
      const res = await fetch(`/api/todo`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status, todoIds: [todo._id] }),
      });
      const data = await res.json();
      if (data.updatedCount) {
        await revalidateApiByTag("getTodos");
        showToast("success", data.message);
      } else {
        showToast("error", data.message);
      }
    } catch {
      showToast("error", "Failed to update todo status!");
    } finally {
      setLoadingStatus(false);
    }
  };
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <IconButton onClick={() => setOpenEdit(true)}>
        <EditOutlinedIcon />
      </IconButton>
      {loading ? (
        <CircularProgress size={25} />
      ) : (
        <IconButton onClick={handleDeleteTodo}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      )}

      <Tooltip
        title={
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={() => handleUpdateStatus("Done")}
                color="success"
                variant="outlined"
              >
                Done
              </Button>
              <Button
                onClick={() => handleUpdateStatus("Pending")}
                color="warning"
                variant="outlined"
              >
                Pending
              </Button>
            </Box>
          </Box>
        }
        arrow
        placement="top"
      >
        {loadingStatus ? (
          <CircularProgress size={25} />
        ) : (
          <IconButton>
            <MoreHorizOutlinedIcon />
          </IconButton>
        )}
      </Tooltip>
      <AddTodoDialog open={openEdit} setOpen={setOpenEdit} todo={todo} />
    </Box>
  );
}

export default TodoActions;
