import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import "react-day-picker/dist/style.css";
import DashboardLayout from "./Components/layouts/DashboardLayout";

export const metadata: Metadata = {
  title: "Teacher Management System",
  description: "Manage teachers, payments, and educational resources",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, sans-serif" }} className="antialiased">
        <DashboardLayout>{children}</DashboardLayout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--background)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            },
          }}
          closeButton
          richColors
        />
      </body>
    </html>
  );
}
