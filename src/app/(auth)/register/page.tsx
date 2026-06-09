// PAS de "use client"
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a free QuizForge AI account and start generating quizzes.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
