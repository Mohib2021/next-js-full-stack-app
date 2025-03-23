// app/components/ClientErrorBoundary.tsx
"use client"; // Mark this as a client-side component

import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@mui/material";
interface ClientErrorBoundaryProps {
  children: React.ReactNode; // Explicitly type children prop
}

const ClientErrorBoundary: React.FC<ClientErrorBoundaryProps> = ({
  children,
}) => {
  return (
    <ErrorBoundary FallbackComponent={FallbackErrorComponent}>
      {children}
    </ErrorBoundary>
  );
};
export default ClientErrorBoundary;

interface FallbackErrorComponentProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const FallbackErrorComponent: React.FC<FallbackErrorComponentProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div
      style={{
        padding: "20px",
        background: "#f8d7da",
        color: "#721c24",
        borderRadius: "5px",
      }}
    >
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <Button onClick={resetErrorBoundary} variant="contained" color="primary">
        Try Again
      </Button>
    </div>
  );
};
