"use client";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import styles from "./addTodo.module.css";
import { useState } from "react";
import AddTodoDialog from "./AddTodoDialog";

const AddTodo = () => {
  const [openAddTodo, setOpenAddTodo] = useState<true | false>(false);
  return (
    <Box className={styles.container}>
      <Button
        onClick={() => setOpenAddTodo(true)}
        endIcon={<Add />}
        variant="contained"
        color="info"
      >
        Add Todo
      </Button>
      <AddTodoDialog open={openAddTodo} setOpen={setOpenAddTodo} />
    </Box>
  );
};
export default AddTodo;
