"use client";

import Image from "next/image";
import Link from "next/link";
import { GraduationCap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getAuth, signOut } from "firebase/auth";
import app from "@/lib/firebase";

const Navbar = () => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login"; // hard redirect so state resets
  };

  // Another dumb stuff
  const isAdmin = user?.email === "adithya222011@sahrdaya.ac.in"; // admin check

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
            <span className="font-bold text-lg md:text-xl text-college-primary">
              Student Portal
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {!user && (
              <Link href="/login">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <LogIn
                    size={18}
                    className="mr-1"
                  />
                  Login
                </Button>
              </Link>
            )}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white/70 rounded-full shadow-sm hover:bg-white/90 transition">
                    <Image
                      src={user.photoURL ?? "/default-user.png"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <span className="font-medium text-sm">
                      {user.displayName ?? "User"}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-40"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/student/profile"
                      className="cursor-pointer"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/students"
                        className="cursor-pointer"
                      >
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
