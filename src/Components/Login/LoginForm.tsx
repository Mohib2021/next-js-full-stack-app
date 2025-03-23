"use client";

import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { showToast } from "../Toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensures cookies are sent & received
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      showToast("success", "Login Successful!");
      // Redirect to dashboard after successful login
      window.location.href = "/";
    } catch (err: unknown) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "300px",
        }}
      >
        <TextField
          required
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          size="large"
          type="submit"
          variant="contained"
          color="info"
          disabled={loading}
        >
          {loading ? <CircularProgress size={30} color="inherit" /> : "Login"}
        </Button>
      </Box>
    </form>
  );
};

export default LoginForm;
