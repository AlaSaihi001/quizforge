// Server Component - pas besoin de "use client"
// On peut appeler directement notre server action
import { getStats } from "@/lib/actions/test.action";

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div className="p-5 text-white bg-gray-800 border border-gray-300 rounded-lg">
          <h3>Total Users</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold" }}>{stats.users}</p>
        </div>
        <div className="p-5 text-white bg-gray-800 border border-gray-300 rounded-lg">
          <h3>Total Generations</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold" }}>
            {stats.generations}
          </p>
        </div>
      </div>
    </div>
  );
}
