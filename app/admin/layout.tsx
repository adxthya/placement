"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { GraduationCap } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />

          <div className="flex-1 flex flex-col">
            <header className="h-16 border-b bg-background flex items-center px-4 gap-4 sticky top-0 z-10">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h1 className="font-bold text-xl text-primary">
                  Admin Dashboard
                </h1>
              </div>
            </header>

            <main className="flex-1 p-6 bg-muted/30">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
