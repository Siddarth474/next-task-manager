import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import TaskApiProvider from "@/context/TaskContext";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Track your tasks",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TaskApiProvider>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </TaskApiProvider>
      </body>
    </html>
  );
}
 