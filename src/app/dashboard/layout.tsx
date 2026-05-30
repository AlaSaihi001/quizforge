import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "./sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Récupère la session côté serveur
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // Récupère les données complètes de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { credits: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar — reçoit les données du serveur */}
      <Sidebar
        userName={user.name || "User"}
        userEmail={user.email || ""}
        userPlan={user.plan}
        creditsUsed={user.credits?.used || 0}
        creditsTotal={user.credits?.total || 10}
      />

      {/* Contenu principal — scrollable */}
      <main className="flex-1 overflow-y-auto bg-gray-500">
        {/* Header en haut de chaque page */}
        <div className="border-b border-slate-200  px-8 py-4 sticky top-0 z-10">
          <p className="text-sm text-white">
            Welcome back,{" "}
            <span className="font-medium text-slate-800">{user.name}</span>
          </p>
        </div>

        {/* Contenu de la page active */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
