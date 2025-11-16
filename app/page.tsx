import AnimatedBackground from "@/components/AnimatedBackground";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import StudentForm from "@/components/StudentForm";

export default function Home() {
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
