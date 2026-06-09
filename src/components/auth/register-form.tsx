"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Eye, EyeOff, Check, ArrowRight } from "lucide-react";

const benefits = [
  "10 free AI generations per day",
  "MCQ, Flashcards & Summaries",
  "English, French & Arabic",
];

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength =
    form.password.length === 0
      ? null
      : form.password.length < 6
        ? "weak"
        : form.password.length < 10
          ? "medium"
          : "strong";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await registerUser(form);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (signInResult?.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold">QuizForge AI</span>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Study smarter,
              <br />
              not harder.
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Join students who use QuizForge to turn their notes into perfect
              study materials in seconds.
            </p>
          </div>

          <div className="space-y-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-violet-400" />
                </div>
                <span className="text-slate-300 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            {["S", "A", "M"].map((l) => (
              <div
                key={l}
                className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold -ml-2 first:ml-0 border-2 border-slate-900"
              >
                {l}
              </div>
            ))}
            <span className="text-slate-400 text-xs ml-1">+2.4k students</span>
          </div>
          <p className="text-slate-400 text-xs">
            Already using QuizForge to ace their exams
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">QuizForge AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Create your account
            </h1>
            <p className="text-slate-500 text-sm">
              Free forever · No credit card required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-slate-700 text-sm font-medium"
              >
                Full name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                disabled={isLoading}
                className="h-11 border-slate-300 focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-slate-700 text-sm font-medium"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={isLoading}
                className="h-11 border-slate-300 focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-slate-700 text-sm font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="h-11 border-slate-300 focus:border-violet-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {passwordStrength && (
                <div className="flex gap-1 mt-1.5 items-center">
                  {["weak", "medium", "strong"].map((level, i) => {
                    const isActive =
                      passwordStrength === "weak"
                        ? i === 0
                        : passwordStrength === "medium"
                          ? i <= 1
                          : true;
                    return (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          isActive
                            ? passwordStrength === "weak"
                              ? "bg-red-500"
                              : passwordStrength === "medium"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            : "bg-slate-200"
                        }`}
                      />
                    );
                  })}
                  <span
                    className={`text-xs ml-1 ${
                      passwordStrength === "weak"
                        ? "text-red-500"
                        : passwordStrength === "medium"
                          ? "text-amber-500"
                          : "text-emerald-600"
                    }`}
                  >
                    {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create free account
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            <p className="text-xs text-slate-400 text-center">
              By creating an account, you agree to our Terms of Service.
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-violet-600 hover:text-violet-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
