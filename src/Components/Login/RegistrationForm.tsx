"use client";

import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { showToast } from "../Toast";

type RegistrationFormProps = {
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({ setValue }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match!");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Redirect to login page after successful registration
      showToast("success", `${data?.message}`);
      setValue(0);
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
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
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
        <TextField
          required
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          size="large"
          type="submit"
          variant="contained"
          color="info"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Register"
          )}
        </Button>
      </Box>
    </form>
  );
};

export default RegistrationForm;
