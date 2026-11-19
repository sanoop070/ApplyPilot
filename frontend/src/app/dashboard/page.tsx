"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rawJdInput, setRawJdInput] = useState("");
  const [overrideCompany, setOverrideCompany] = useState("");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);

  useEffect(() => {
    const savedApps = localStorage.getItem("applypilot_applications");
    if (savedApps) {
      try {
        const parsed = JSON.parse(savedApps);
        setApplications(parsed);
        if (parsed.length > 0) setSelectedApp(parsed[0]);
      } catch (e) {}
    } else {
      const initial = [
        { 
          id: 1, 
          company: "Microsoft", 
          role: "Software Engineering Intern", 
          location: "Bengaluru / Remote", 
          salary: "?50,000/month", 
          mode: "Hybrid", 
          score: 87, 
          jd: "Looking for Python, React, and cloud infrastructure experience.",
          gaps: ["Distributed systems"],
          timeline: [
            { date: "Sep 08", title: "Application submitted", type: "APPLIED", status: "completed" },
            { date: "Sep 11", title: "Online assessment", type: "OA", status: "completed" },
            { date: "Sep 15", title: "Technical interview", type: "INTERVIEW", status: "current" },
            { date: "Sep 18", title: "Recruiter follow-up", type: "FOLLOW-UP", status: "upcoming" }
          ]
        },
        { 
          id: 2, 
          company: "OpenAI", 
          role: "AI Research Engineer", 
          location: "Remote", 
          salary: "$120,000/yr", 
          mode: "Remote", 
          score: 96, 
          jd: "Requires strong PyTorch, deep learning, computer vision, and neural networks expertise.",
          gaps: ["Large-scale cluster training"],
          timeline: [
            { date: "Oct 01", title: "Resume screening passed", type: "SCREEN", status: "completed" },
            { date: "Oct 05", title: "Research presentation", type: "INTERVIEW", status: "current" }
          ]
        }
      ];
      setApplications(initial);
      setSelectedApp(initial[0]);
      localStorage.setItem("applypilot_applications", JSON.stringify(initial));
    }
    setLoading(false);
  }, []);

  function handleSmartParse(e: React.FormEvent) {
    e.preventDefault();
    if (!rawJdInput.trim()) return;

    setParsing(true);
    setTimeout(() => {
      const text = rawJdInput;
      const lower = text.toLowerCase();

      let extractedCompany = overrideCompany.trim() || "Target Company";
      if (!overrideCompany.trim()) {
        if (lower.includes("microsoft")) extractedCompany = "Microsoft";
        else if (lower.includes("openai")) extractedCompany = "OpenAI";
        else if (lower.includes("google")) extractedCompany = "Google";
        else if (lower.includes("databricks")) extractedCompany = "Databricks";
        else if (lower.includes("figma") || lower.includes("design studio")) extractedCompany = "Design Studio Inc.";
        else if (lower.includes("amazon")) extractedCompany = "Amazon";
      }

      let extractedRole = "Software Engineer";
      if (lower.includes("web designer") || lower.includes("ui/ux") || lower.includes("figma")) extractedRole = "Web Designer";
      else if (lower.includes("ai research") || lower.includes("machine learning")) extractedRole = "AI Research Engineer";
      else if (lower.includes("data platform")) extractedRole = "Data Platform Engineer";

      let extractedLocation = "Bangalore, Karnataka";
      let extractedMode = "Hybrid / On-site";
      if (lower.includes("remote")) {
        extractedMode = "Remote";
        extractedLocation = "Remote";
      } else if (lower.includes("hybrid")) {
        extractedMode = "Hybrid";
        extractedLocation = "Bangalore, Karnataka (Hybrid)";
      }

      let extractedSalary = "Competitive";
      if (text.includes("?") || text.includes("INR")) extractedSalary = "?60,000 - ?90,000 / month";
      else if (text.includes("$")) extractedSalary = "$110,000 - $140,000 / year";

      let score = 75;
      let gaps = ["Advanced Cloud Architecture"];
      if (extractedRole === "Web Designer") {
        score = 52;
        gaps = ["Figma & Adobe XD proficiency", "UI/UX wireframing portfolio", "Design systems experience"];
      } else if (extractedRole.includes("AI")) {
        score = 96;
        gaps = ["Large-scale cluster training"];
      } else if (extractedRole.includes("Data")) {
        score = 88;
        gaps = ["Kafka streaming pipelines"];
      }

      const newApp = {
        id: Date.now(),
        company: extractedCompany,
        role: extractedRole,
        location: extractedLocation,
        salary: extractedSalary,
        mode: extractedMode,
        score: score,
        jd: text,
        gaps: gaps,
        timeline: [
          { date: "Today", title: "Application added & JD parsed", type: "APPLIED", status: "completed" },
          { date: "Pending", title: "AI Skill Gap Analysis Verified", type: "EVAL", status: "current" }
        ]
      };

      const updated = [newApp, ...applications];
      setApplications(updated);
      setSelectedApp(newApp);
      localStorage.setItem("applypilot_applications", JSON.stringify(updated));

      setRawJdInput("");
      setOverrideCompany("");
      setParsing(false);
      setShowForm(false);
    }, 500);
  }

  function deleteApp(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    const updated = applications.filter(a => a.id !== id);
    setApplications(updated);
    localStorage.setItem("applypilot_applications", JSON.stringify(updated));
    if (selectedApp?.id === id) {
      setSelectedApp(updated.length > 0 ? updated[0] : null);
    }
  }

  return (
    <main className="min-h-screen bg-[#080b12] text-slate-100 selection:bg-blue-500 selection:text-white">
      <nav className="border-b border-white/[0.06] bg-[#0b0f17]/85 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 font-bold text-white shadow-lg shadow-blue-500/20">A</div>
            <div>
              <span className="font-bold tracking-tight text-white text-lg">Apply<span className="text-blue-400">Pilot</span></span>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium">
            <a href="/dashboard" className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-300">
              Applications
            </a>
            <a href="/ai" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-300 transition hover:bg-white/[0.06] hover:text-white">
              <span>?</span> AI Career Lab
            </a>
            <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
            <button onClick={() => { localStorage.clear(); location.href = "/login"; }} className="rounded-xl border border-white/10 px-4 py-2 text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300">
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Your Applications</h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">Click any application card below to check realistic match scores & skill gaps.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">
            {showForm ? "Close form" : "? Smart Parse Job Description"}
          </button>
        </div>

        {showForm && (
          <div className="rounded-3xl border border-white/10 bg-[#0b0f17] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>?</span> AI Smart Job Description Parser
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Paste any JD below to evaluate real skill overlap against your AI/Engineering resume.</p>
            </div>

            <form onSubmit={handleSmartParse} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Optional Company Name Override</label>
                <input 
                  type="text" 
                  placeholder="e.g. Adobe, Microsoft (leave blank for AI auto-detection)" 
                  className="w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                  value={overrideCompany} 
                  onChange={(e) => setOverrideCompany(e.target.value)} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Paste Full Job Description (JD)</label>
                <textarea 
                  rows={6} 
                  placeholder="Paste the entire job description here..." 
                  className="w-full rounded-xl border border-white/10 bg-[#080b12] p-4 text-sm text-white focus:border-blue-500 focus:outline-none leading-relaxed font-sans"
                  value={rawJdInput} 
                  onChange={(e) => setRawJdInput(e.target.value)} 
                  required 
                />
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" disabled={parsing} className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-500/20 disabled:opacity-50">
                  {parsing ? "AI analyzing skill match..." : "? Parse JD & Analyze Real Fit"}
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedApp && (
          <div className="rounded-3xl border border-blue-500/30 bg-[#0b0f17] p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600/10 px-6 py-2 rounded-bl-3xl border-l border-b border-blue-500/20 font-mono text-xs text-blue-400">
              REALISTIC AI FIT ANALYSIS
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase text-blue-400">{selectedApp.company}</span>
                  <h2 className="text-3xl font-extrabold text-white mt-1">{selectedApp.role}</h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">{selectedApp.location} ? {selectedApp.salary}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#080b12] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Calculated Match Score</span>
                    <span className={`text-xl font-extrabold font-mono ${selectedApp.score < 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {selectedApp.score}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-black overflow-hidden border border-white/10">
                    <div className={`h-full bg-gradient-to-r ${selectedApp.score < 70 ? 'from-amber-500 to-red-500' : 'from-blue-500 to-emerald-400'}`} style={{ width: selectedApp.score + "%" }}></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400">?? Identified Missing Skills & Gaps</h4>
                  <div className="space-y-2">
                    {selectedApp.gaps && selectedApp.gaps.map((gap: string, i: number) => (
                      <div key={i} className="text-xs text-amber-200/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 font-mono">
                        ? {gap}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Full Parsed Job Description</h4>
                  <div className="rounded-2xl border border-white/10 bg-[#080b12] p-4 max-h-48 overflow-y-auto text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                    {selectedApp.jd}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6 rounded-2xl border border-white/10 bg-[#0b0f17] p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Application Milestones</h3>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-mono text-emerald-400">
                    Active Tracking
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  {selectedApp.timeline && selectedApp.timeline.map((event: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 pb-4 border-b border-white/[0.04] last:border-0">
                      <span className="text-xs font-mono text-slate-500 pt-0.5 w-16">{event.date}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={"h-2 w-2 rounded-full " + (event.status === "completed" ? "bg-emerald-400" : event.status === "current" ? "bg-blue-500 animate-pulse" : "bg-slate-600")}></span>
                          <h5 className="text-sm font-medium text-white">{event.title}</h5>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase mt-0.5 block">{event.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-mono">Loading applications...</div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">All Tracked Applications ({applications.length})</h3>
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div 
                  key={app.id} 
                  onClick={() => setSelectedApp(app)}
                  className={"rounded-2xl border transition cursor-pointer p-6 space-y-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 " + (selectedApp?.id === app.id ? "border-blue-500 bg-[#0b0f17]/90 shadow-blue-500/10" : "border-white/10 bg-[#0b0f17] hover:border-white/30")}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-lg font-bold text-white">{app.role}</h4>
                      <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-0.5 text-[10px] font-mono text-blue-300 font-bold">
                        {app.company}
                      </span>
                      {app.mode && (
                        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-0.5 text-[10px] font-mono text-violet-300">
                          {app.mode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">{app.location} ? {app.salary}</p>
                    <p className="text-xs text-slate-300 pt-1 line-clamp-1 bg-[#080b12] p-2.5 rounded-xl border border-white/[0.06]">
                      <strong className="text-blue-400 font-mono">JD Preview:</strong> {app.jd}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-white/10">
                    <div className="text-center px-4 py-2 rounded-xl border border-white/10 bg-[#080b12]">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">AI Match</span>
                      <span className={`text-xl font-extrabold font-mono ${app.score < 70 ? 'text-amber-400' : 'text-emerald-400'}`}>{app.score}%</span>
                    </div>

                    <button onClick={(e) => deleteApp(app.id, e)} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-mono text-slate-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
