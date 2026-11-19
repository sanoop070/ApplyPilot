"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("sanoopkvinu226@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("applypilot_logged_in", "true");
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#080b12] text-slate-100 flex items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0f17] p-8 shadow-2xl space-y-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 font-bold text-white shadow-lg shadow-blue-500/20 text-xl">A</div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Welcome back</h1>
          <p className="text-xs text-slate-400 font-mono">Sign in to continue your job search.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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

          <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
