"use client";

import { AuthProvider } from "@/context/AuthContext";
import "../../public/css/globals.css";

export default function RootLayout({ children }) {
  return (
    <html className={"h-full bg-gray-900"}>
      <body className={"h-full"}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>

  );
}