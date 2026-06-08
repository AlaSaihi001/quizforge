import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft } from "lucide-react";

export default function ShareNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center mb-6">
        <Zap className="w-7 h-7 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Content not found
      </h1>
      <p className="text-slate-500 text-center mb-8 max-w-sm">
        This shared content do not exist or has been deleted.
      </p>
      <Link href="/">
        <Button variant="outline" className="border-slate-300">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Button>
      </Link>
    </div>
  );
}
