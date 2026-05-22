import { prisma } from "@/lib/prisma";

async function getTestUser() {
  return prisma.user.findFirst({
    where: { email: "ala@test.com" },
    include: { generations: true, credits: true },
  });
}

const modeColors: Record<string, string> = {
  MCQ: "bg-blue-100 text-blue-700",
  FLASHCARDS: "bg-green-100 text-green-700",
  SUMMARY: "bg-amber-100 text-amber-700",
};

export default async function HistoryPage() {
  const user = await getTestUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">No user found — did you run the seed?</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Generation History
          </h1>
          <p className="text-gray-500 text-sm mt-1">User: {user.name}</p>
        </div>

        {/* Credits Badge */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-sm">
          <span className="text-gray-500">Credits: </span>
          <span className="font-bold text-gray-900">
            {user.credits?.used}/{user.credits?.total}
          </span>
        </div>
      </div>

      {/* Generations List */}
      {user.generations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-400 text-lg">No generations yet</p>
          <a
            href="/dashboard/generate"
            className="mt-3 text-blue-500 text-sm hover:underline"
          >
            Create your first one →
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {user.generations.map((gen) => (
            <div
              key={gen.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${modeColors[gen.mode]}`}
                >
                  {gen.mode}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(gen.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {gen.inputText.substring(0, 120)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
