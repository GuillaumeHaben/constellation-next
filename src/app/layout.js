"use client";

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/context/ProtectedRoute";
import { usePathname } from "next/navigation";
import "../../public/css/globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  return (
    <html className={"h-full bg-gray-900 dark"}>
      <body className={"h-full dark"}>
        <AuthProvider>
          {isPublic ? children : <ProtectedRoute>{children}</ProtectedRoute>}
        </AuthProvider>
      </body>
    </html>
  );
}
