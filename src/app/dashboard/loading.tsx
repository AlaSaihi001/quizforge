import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44 bg-slate-200" />
        <Skeleton className="h-4 w-64 bg-slate-200" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3"
          >
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-28 bg-slate-200" />
              <Skeleton className="h-9 w-9 rounded-xl bg-slate-200" />
            </div>
            <Skeleton className="h-9 w-16 bg-slate-200" />
            <Skeleton className="h-3 w-20 bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Recent section */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-40 bg-slate-200" />
          <Skeleton className="h-6 w-20 bg-slate-200" />
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-full bg-slate-200" />
              <Skeleton className="h-4 flex-1 bg-slate-200" />
              <Skeleton className="h-3 w-20 bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
