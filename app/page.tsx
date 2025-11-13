import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import StudentForm from "@/components/StudentForm";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-college-light overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <main>
        <StudentForm />
      </main>
    </div>
  );
}
