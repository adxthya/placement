"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        setAllowed(false);
        setLoading(false);
        router.replace("/login");
        return;
      }

      const email = user.email ?? "";
      const isSahrdaya = email.endsWith("@sahrdaya.ac.in");

      // Dumb way to restrict users to a domain but unfortunately I can't afford google workspace and this is a toy project.
      if (!isSahrdaya) {
        // sign out and block access
        auth.signOut();
        setAllowed(false);
        setLoading(false);
        window.location.href = "/login?error=invalid-domain";
        return;
      }

      setAllowed(true);
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
