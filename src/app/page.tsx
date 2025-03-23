import AddTodo from "@/Components/AddTodo/AddTodo";
import AuthWrapper from "@/Components/AuthWrapper";
import ShowTodo from "@/Components/ShowTodo";

import { Box, Typography } from "@mui/material";
type Params = Promise<{ page: string; limit: string }>;
export default async function Home(props: { params: Params }) {
  const { page, limit } = await props.params;
  return (
    <AuthWrapper>
      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Todo Manager</Typography>
          <AddTodo />
        </Box>
        <ShowTodo page={page} limit={limit} />
      </Box>
    </AuthWrapper>
  );
}
