import type { Metadata } from "next";
import LoginTabs from "@/Components/Login/LoginTabs";
import { Box, Card } from "@mui/material";
import React from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your application",
};

function page() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ p: 4, borderRadius: 4 }}>
        <LoginTabs />
      </Card>
    </Box>
  );
}

export default page;
