"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { StudentSidebar } from "@/components/StudentSidebar";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Navbar />
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 border-r bg-card md:block">
          <StudentSidebar />
        </aside>

        {/* Mobile Header */}
        <div className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 p-0"
              >
                <SheetTitle className="sr-only">menu</SheetTitle>
                <StudentSidebar />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold">Student Portal</h1>
          </header>

          {/* Main Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
