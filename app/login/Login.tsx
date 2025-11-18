"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, TriangleAlert } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-background to-muted/30 p-4 gap-2">
      <Card className="w-full max-w-md p-8 space-y-2">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <h1 className="font-bold text-2xl text-foreground">Student Portal</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue</p>
        </div>

        <Button
          onClick={handleGoogleLogin}
          className="w-full"
          size="lg"
        >
          Continue with Google
        </Button>
      </Card>

      {error === "invalid-domain" && (
        <Alert
          variant="destructive"
          className="mb-4 max-w-md"
        >
          <TriangleAlert className="h-5 w-5" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Only @sahrdaya.ac.in email accounts are allowed to sign in.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Login;
