import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div className="max-w-3xl space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-28 bg-slate-200" />
          <Skeleton className="h-4 w-48 bg-slate-200" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg bg-slate-200" />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2">
        {[70, 90, 110, 100].map((w, i) => (
          <Skeleton
            key={i}
            className="h-7 rounded-full bg-slate-200"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex items-start gap-4 px-5 py-4">
            <Skeleton className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full bg-slate-200" />
                <Skeleton className="h-4 w-28 bg-slate-200" />
              </div>
              <Skeleton className="h-3 w-full bg-slate-200" />
              <Skeleton className="h-3 w-3/4 bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
