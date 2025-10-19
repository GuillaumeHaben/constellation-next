"use client";

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/context/ProtectedRoute";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@material-tailwind/react";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  return (
    <html className={"h-full bg-gray-900 dark"} suppressHydrationWarning>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      </head>
      <body className={"h-full dark"}>
        <ThemeProvider>
          <AuthProvider>
            {isPublic ? children : <ProtectedRoute>{children}</ProtectedRoute>}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
