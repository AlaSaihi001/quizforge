import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center mb-8">
        <Zap className="w-7 h-7 text-white" />
      </div>

      {/* 404 */}
      <p className="text-8xl font-bold text-slate-200 mb-4 leading-none">404</p>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
      <p className="text-slate-500 text-center mb-8 max-w-sm">
        The page you are looking for do not exist or has been moved.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="outline" className="border-slate-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white">
            Go to dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
