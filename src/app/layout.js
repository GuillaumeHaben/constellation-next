"use client";

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/context/ProtectedRoute";
import { usePathname } from "next/navigation";
import { HeroUIProvider } from "@heroui/react";
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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" async></script>
      </head>
      <body className={"h-full dark"}>
        <HeroUIProvider>
          <AuthProvider>
            {isPublic ? children : <ProtectedRoute>{children}</ProtectedRoute>}
          </AuthProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
