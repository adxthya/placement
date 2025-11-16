import React from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogIn, User } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-glass py-3 border-b border-white/10 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <GraduationCap
              size={28}
              className="text-college-primary"
            />
            <span className="font-serif font-bold text-lg md:text-xl text-college-primary">
              Student Portal
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/student/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-college-primary"
              >
                <User
                  size={18}
                  className="mr-1"
                />
                <span>Profile</span>
              </Button>
            </Link>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <LogIn
                size={18}
                className="mr-1"
              />
              <span>Login</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
