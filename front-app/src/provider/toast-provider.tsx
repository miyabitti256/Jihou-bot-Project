"use client";

import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          fontFamily: "Noto Sans JP",
          zIndex: 9999,
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          boxShadow:
            theme === "dark"
              ? "0 4px 6px rgba(255, 255, 255, 0.1)"
              : "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        success: {
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "2px solid hsl(var(--border))",
          },
        },
        error: {
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "2px solid hsl(var(--border))",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
