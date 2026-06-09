import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

// Metadata fonctionne car ce fichier n'a pas "use client"
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your QuizForge AI account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
