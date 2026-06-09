import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 max-w-5xl animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-52 bg-slate-200" />
        <Skeleton className="h-4 w-64 bg-slate-200" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-5"
          >
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-4 w-32 bg-slate-200" />
              <Skeleton className="w-9 h-9 rounded-xl bg-slate-200" />
            </div>
            <Skeleton className="h-10 w-16 bg-slate-200 mb-1" />
            <Skeleton className="h-3 w-20 bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl bg-slate-200" />
        ))}
      </div>

      {/* Recent generations */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-44 bg-slate-200" />
          <Skeleton className="h-4 w-16 bg-slate-200" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16 rounded-full bg-slate-200" />
                  <Skeleton className="h-3 w-24 bg-slate-200" />
                </div>
                <Skeleton className="h-3 w-full bg-slate-200" />
              </div>
              <Skeleton className="h-3 w-16 bg-slate-200 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
