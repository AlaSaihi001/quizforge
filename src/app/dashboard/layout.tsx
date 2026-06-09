import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "./sidebar";
import { PaymentToastWrapper } from "@/components/dashboard/payment-toast-wrapper";
import { OnboardingWrapper } from "@/components/dashboard/onboarding-wrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { credits: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        userName={user.name || "User"}
        userEmail={user.email || ""}
        userPlan={user.plan}
        creditsUsed={user.credits?.used || 0}
        creditsTotal={user.credits?.total || 10}
      />

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-800">{user.name}</span>
            <span className="text-slate-300">·</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                user.plan === "PRO"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {user.plan}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
      <PaymentToastWrapper />
      <OnboardingWrapper />
    </div>
  );
}
