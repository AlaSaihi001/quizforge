import { Skeleton } from "@/components/ui/skeleton";

export default function GenerateLoading() {
  return (
    <div className="max-w-2xl space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32 bg-slate-200" />
        <Skeleton className="h-4 w-56 bg-slate-200" />
      </div>

      {/* Mode selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <Skeleton className="h-3 w-28 bg-slate-200 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl border-2 border-slate-100">
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-200 mb-3" />
              <Skeleton className="h-4 w-20 bg-slate-200 mb-1" />
              <Skeleton className="h-3 w-24 bg-slate-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <Skeleton className="h-3 w-24 bg-slate-200 mb-4" />
        <Skeleton className="h-9 w-44 bg-slate-200 rounded-lg" />
      </div>

      {/* Textarea */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <Skeleton className="h-3 w-28 bg-slate-200 mb-4" />
        <Skeleton className="h-44 w-full bg-slate-200 rounded-xl" />
      </div>

      {/* Button */}
      <Skeleton className="h-12 w-full bg-slate-200 rounded-xl" />
    </div>
  );
}
