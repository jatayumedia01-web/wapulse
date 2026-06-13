import Link from "next/link";
import { Zap, Mail } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md text-center">
        <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white"><Mail size={26} /></span>
        <h1 className="text-2xl font-bold text-slate-900">Check your email</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-slate-500">
          We sent a verification link to your email. Click the link to activate your account and get started.
        </p>
        <p className="mt-6 text-[13px] text-slate-400">
          Already verified?{" "}
          <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
