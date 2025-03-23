import type { Metadata } from "next";
import "./globals.css";
import { Box } from "@mui/material";
import { ThemeProvider } from "@/Context/ThemeContext";
import { connectDB } from "./api/lib/db";
import ToastProvider from "@/Components/ToastProvider";
import ClientErrorBoundary from "@/Components/ErrorBoundery";

export const metadata: Metadata = {
  title: "Todo Manager",
  description: "Todo Management Application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connectDB();
  return (
    <html lang="en">
      <body>
        <ClientErrorBoundary>
          <ThemeProvider>
            <ToastProvider />
            <Box className="container">{children}</Box>
          </ThemeProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
