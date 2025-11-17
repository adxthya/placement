"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import StudentForm from "@/components/StudentForm";
import AuthGuard from "@/components/AuthGuard";

export default function Home() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setChecking(false);
        return;
      }

      const studentRef = doc(db, "students", user.email!);
      const snap = await getDoc(studentRef);

      if (snap.exists()) {
        router.push("/student/profile");
        return;
      }

      setChecking(false);
    });

    return () => unsub();
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-college-light overflow-hidden">
        <AnimatedBackground />
        <Navbar />
        <main>
          <StudentForm />
        </main>
      </div>
    </AuthGuard>
  );
}
