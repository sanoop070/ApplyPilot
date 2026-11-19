"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [fullName, setFullName] = useState("Sanoop");
  const [email, setEmail] = useState("sanoopkvinu226@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("applypilot_logged_in", "true");
    localStorage.setItem("applypilot_user", fullName);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#080b12] text-slate-100 flex items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0f17] p-8 shadow-2xl space-y-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 font-bold text-white shadow-lg shadow-blue-500/20 text-xl">A</div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Create your account</h1>
          <p className="text-xs text-slate-400 font-mono">Start organizing your career journey with ApplyPilot.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Full name (optional)</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              required 
            />
          </div>

          <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-500/25">
            Create account
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 font-mono">
          Already have an account? <a href="/login" className="text-blue-400 hover:underline">Sign in</a>
        </div>
      </div>
    </main>
  );
}
