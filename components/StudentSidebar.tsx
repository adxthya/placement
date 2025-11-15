"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/student/eligible", icon: Briefcase, label: "Eligible Interviews" },
  { href: "/student/profile", icon: User, label: "My Profile" },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Student Portal</h2>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                active && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
