"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  Compass,
  FileText,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

interface TimelineEvent {
  date: string;
  title: string;
  type: string;
  status: "completed" | "current" | "upcoming";
}

interface Application {
  id: number;
  company: string;
  role: string;
  location: string;
  salary: string;
  mode: string;
  score: number;
  jd: string;
  gaps: string[];
  summary?: string;
  timeline: TimelineEvent[];
}

interface ScoutedJob {
  title: string;
  company: string;
  location: string;
  url: string;
  score: number;
  reason: string;
}

function SunburstIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.2" fill="currentColor" />
      <path
        d="M12 1.5V6M12 18V22.5M1.5 12H6M18 12H22.5M4.58 4.58L7.76 7.76M16.24 16.24L19.42 19.42M19.42 4.58L16.24 7.76M7.76 16.24L4.58 19.42"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"tracker" | "scout">("tracker");
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rawJdInput, setRawJdInput] = useState("");
  const [overrideCompany, setOverrideCompany] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Live Job Scout state
  const [roleQuery, setRoleQuery] = useState("AI Engineer");
  const [locationQuery, setLocationQuery] = useState("Bengaluru");
  const [scouting, setScouting] = useState(false);
  const [scoutedJobs, setScoutedJobs] = useState<ScoutedJob[]>([]);
  const [scoutError, setScoutError] = useState<string | null>(null);
  const [addedJobs, setAddedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedApps = localStorage.getItem("applypilot_applications");
    if (savedApps) {
      try {
        const parsed = JSON.parse(savedApps);
        setApplications(parsed);
        if (parsed.length > 0) setSelectedApp(parsed[0]);
      } catch (e) {
        console.error("Failed to parse saved applications", e);
      }
    } else {
      const initial: Application[] = [
        {
          id: 1,
          company: "Microsoft",
          role: "Software Engineering Intern",
          location: "Bengaluru · Hybrid",
          salary: "₹50,000/month",
          mode: "Hybrid",
          score: 87,
          jd: "Looking for Python, React, and cloud infrastructure experience.",
          gaps: ["Distributed systems"],
          summary: "Strong candidate match with hands-on Python and React skills, with slight gap in large-scale distributed systems.",
          timeline: [
            { date: "Sep 08", title: "Application submitted", type: "APPLIED", status: "completed" },
            { date: "Sep 11", title: "Online assessment", type: "OA", status: "completed" },
            { date: "Sep 15", title: "Technical interview", type: "INTERVIEW", status: "current" },
            { date: "Sep 18", title: "Recruiter follow-up", type: "FOLLOW-UP", status: "upcoming" },
          ],
        },
        {
          id: 2,
          company: "OpenAI",
          role: "AI Research Engineer",
          location: "San Francisco · Remote",
          salary: "$120,000/yr",
          mode: "Remote",
          score: 96,
          jd: "Requires strong PyTorch, deep learning, computer vision, and neural networks expertise.",
          gaps: ["Large-scale cluster training"],
          summary: "Outstanding alignment with PyTorch, LLMs, and deep learning engineering background.",
          timeline: [
            { date: "Oct 01", title: "Resume screening passed", type: "SCREEN", status: "completed" },
            { date: "Oct 05", title: "Research presentation", type: "INTERVIEW", status: "current" },
          ],
        },
      ];
      setApplications(initial);
      setSelectedApp(initial[0]);
      localStorage.setItem("applypilot_applications", JSON.stringify(initial));
    }
    setLoading(false);
  }, []);

  async function handleSmartParse(e: React.FormEvent) {
    e.preventDefault();
    if (!rawJdInput.trim()) return;

    setParsing(true);
    setParseError(null);

    try {
      const res = await fetch("/api/parse-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jdText: rawJdInput,
          company: overrideCompany.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze job description with Gemini.");
      }

      const newApp: Application = {
        id: Date.now(),
        company: data.company || overrideCompany.trim() || "Target Company",
        role: data.role || "Software Engineer",
        location: data.location || "Remote",
        salary: data.salary || "Competitive",
        mode: data.mode || "Hybrid",
        score: typeof data.score === "number" ? data.score : 75,
        jd: rawJdInput,
        gaps: Array.isArray(data.gaps) ? data.gaps : [],
        summary: data.summary || "Parsed and evaluated against candidate profile.",
        timeline: [
          { date: "Today", title: "Application added & JD parsed with Gemini", type: "APPLIED", status: "completed" },
          { date: "Pending", title: "AI Skill Gap Analysis Verified", type: "EVAL", status: "current" },
        ],
      };

      const updated = [newApp, ...applications];
      setApplications(updated);
      setSelectedApp(newApp);
      localStorage.setItem("applypilot_applications", JSON.stringify(updated));

      setRawJdInput("");
      setOverrideCompany("");
      setShowForm(false);
    } catch (err: any) {
      console.error("Smart parse error:", err);
      setParseError(err.message || "An unexpected error occurred while parsing the JD.");
    } finally {
      setParsing(false);
    }
  }

  async function handleScoutJobs(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setScouting(true);
    setScoutError(null);

    try {
      const res = await fetch("/api/scout-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleQuery: roleQuery.trim(),
          locationQuery: locationQuery.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to scout jobs via Google Search grounding.");
      }

      if (Array.isArray(data)) {
        setScoutedJobs(data);
      } else {
        setScoutedJobs([]);
      }
    } catch (err: any) {
      console.error("Scout jobs error:", err);
      setScoutError(err.message || "Failed to scout live jobs.");
    } finally {
      setScouting(false);
    }
  }

  function addScoutedJobToTracker(job: ScoutedJob) {
    const jobKey = job.title + "-" + job.company;
    const newApp: Application = {
      id: Date.now(),
      company: job.company,
      role: job.title,
      location: job.location,
      salary: "Competitive",
      mode: job.location.toLowerCase().includes("remote") ? "Remote" : "Hybrid",
      score: job.score,
      jd: `${job.title} at ${job.company}\nLocation: ${job.location}\nListing URL: ${job.url}\n\nAI Scouting Evaluation:\n${job.reason}`,
      gaps: job.score >= 90 ? ["Production scale deployment"] : ["Specialized domain tooling", "System design depth"],
      summary: job.reason,
      timeline: [
        { date: "Today", title: "Discovered via Live AI Scout & Added", type: "SCOUTED", status: "completed" },
        { date: "Next", title: "Prepare tailored resume & submit", type: "APPLIED", status: "current" },
      ],
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    setSelectedApp(newApp);
    localStorage.setItem("applypilot_applications", JSON.stringify(updated));
    setAddedJobs((prev) => new Set(prev).add(jobKey));
  }

  function deleteApp(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    const updated = applications.filter((a) => a.id !== id);
    setApplications(updated);
    localStorage.setItem("applypilot_applications", JSON.stringify(updated));
    if (selectedApp?.id === id) {
      setSelectedApp(updated.length > 0 ? updated[0] : null);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#3054ff]/30 selection:text-white relative overflow-hidden font-sans">
      {/* Precision Landing Page Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Atmospheric Ambient Glows */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-950/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-10 top-1/3 h-[450px] w-[450px] rounded-full bg-indigo-950/15 blur-[140px]" />

      {/* Hero-grade Precision Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/80 backdrop-blur-xl px-6 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2.5 text-white hover:opacity-85 transition">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.12] text-white">
                <SunburstIcon />
              </span>
              <span className="text-base font-semibold tracking-tight text-white">
                Apply<span className="text-[#3054ff]">Pilot</span>
              </span>
            </a>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.2em] font-mono text-white/30 border-l border-white/[0.08] pl-3">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab("tracker")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full transition text-xs font-medium ${
                activeTab === "tracker"
                  ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.16)]"
                  : "border border-white/[0.10] bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <span>Applications</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  activeTab === "tracker" ? "bg-black/10 text-black font-bold" : "bg-white/[0.10] text-white/60"
                }`}
              >
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("scout")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full transition text-xs font-medium ${
                activeTab === "scout"
                  ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.16)]"
                  : "border border-white/[0.10] bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Sparkles size={12} className={activeTab === "scout" ? "text-[#3054ff]" : "text-white/40"} />
              <span>Live Job Scout</span>
            </button>

            <a
              href="/ai"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-white/60 hover:text-white hover:border-white/20 transition"
            >
              <span>AI Career Lab</span>
              <ArrowUpRight size={12} className="text-white/40" />
            </a>

            <div className="h-4 w-px bg-white/[0.08] mx-1"></div>

            <button
              onClick={() => {
                localStorage.clear();
                location.href = "/login";
              }}
              className="text-xs text-white/40 hover:text-red-400 font-mono transition px-2 py-1"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Workspace Area */}
      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 space-y-12">

        {/* TAB 1: APPLICATIONS TRACKER */}
        {activeTab === "tracker" && (
          <div className="space-y-10">
            {/* Header section matching Landing Page Typography */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
              <div>
                <div className="mb-3 flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">
                  <span className="h-px w-8 bg-white/30" />
                  Candidate Fit Engine
                </div>
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.04em] text-white">
                  Your Applications
                </h1>
                <p className="mt-2 text-sm sm:text-base text-white/50 max-w-xl">
                  Deep skill comparison against your profile: Python, React, PyTorch, SQL, Data Engineering, and LLMs.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setActiveTab("scout")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-white/80 hover:text-white hover:border-white/30 transition"
                >
                  <Compass size={14} className="text-[#3054ff]" />
                  <span>Scout Live Openings</span>
                </button>

                <button
                  onClick={() => setShowForm(!showForm)}
                  className="inline-flex items-center gap-2.5 rounded-full bg-white text-black px-5 py-2.5 text-xs font-semibold hover:scale-105 transition shadow-[0_0_24px_rgba(255,255,255,0.16)]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3054ff] text-white">
                    {showForm ? <X size={12} /> : <Sparkles size={12} />}
                  </span>
                  <span>{showForm ? "Close Parser" : "Smart Parse JD"}</span>
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {parseError && (
              <div className="border border-amber-500/30 bg-[#0c0905] p-4 text-xs text-amber-200/90 flex items-start justify-between gap-3 font-mono">
                <div className="flex items-start gap-2.5">
                  <CircleAlert size={16} className="text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-amber-300 font-semibold mb-0.5">Gemini Parsing Notice</strong>
                    {parseError}
                  </div>
                </div>
                <button onClick={() => setParseError(null)} className="text-amber-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Smart Parse JD Form (Terminal Style) */}
            {showForm && (
              <div className="border border-white/[0.10] bg-[#08090d] shadow-2xl shadow-black/80">
                <div className="flex h-11 items-center justify-between border-b border-white/[0.08] px-5 bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40">
                    AI / JOB DESCRIPTION PARSER
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3054ff] animate-pulse" />
                    GEMINI
                  </div>
                </div>

                <form onSubmit={handleSmartParse} className="p-6 sm:p-8 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.18em] font-mono text-white/40">
                      Company Name Override (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. OpenAI, Microsoft, Databricks (leave blank for Gemini auto-detection)"
                      className="w-full border border-white/[0.10] bg-black px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/20 focus:border-[#3054ff] focus:outline-none transition font-sans"
                      value={overrideCompany}
                      onChange={(e) => setOverrideCompany(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.18em] font-mono text-white/40">
                      Paste Full Job Description (JD)
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Paste the full JD text here to extract match score, missing skills, and compensation..."
                      className="w-full border border-white/[0.10] bg-black p-4 text-xs sm:text-sm text-white placeholder:text-white/20 focus:border-[#3054ff] focus:outline-none leading-relaxed transition font-sans"
                      value={rawJdInput}
                      onChange={(e) => setRawJdInput(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <p className="text-[11px] font-mono text-white/40">
                      Evaluated against: Python, React, PyTorch, SQL, Data Engineering, LLMs.
                    </p>
                    <button
                      type="submit"
                      disabled={parsing}
                      className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white text-black px-6 py-2.5 text-xs font-semibold hover:scale-105 transition shadow-[0_0_24px_rgba(255,255,255,0.16)] disabled:opacity-50"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3054ff] text-white">
                        <Sparkles size={12} />
                      </span>
                      <span>{parsing ? "Analyzing with Gemini..." : "Parse & Evaluate Match"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Selected Application AI Match Analysis (Styled directly after AIMatching.tsx) */}
            {selectedApp && (
              <div className="border border-white/[0.10] bg-[#08090d] shadow-2xl shadow-black/80">
                <div className="flex h-11 items-center justify-between border-b border-white/[0.08] px-5 bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40">
                    AI / MATCH ANALYSIS
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3054ff] animate-pulse" />
                    EVALUATION
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                  {/* Left Column: Role Details & Score */}
                  <div className="border-b lg:border-b-0 lg:border-r border-white/[0.08] p-7 sm:p-9 space-y-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40">
                        {selectedApp.company} · {selectedApp.mode}
                      </p>
                      <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                        {selectedApp.role}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-white/45 font-mono">
                        {selectedApp.location} {selectedApp.salary ? `· ${selectedApp.salary}` : ""}
                      </p>
                    </div>

                    {/* Match Score Display */}
                    <div className="border border-white/[0.08] bg-black p-6 space-y-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40">
                            Candidate Match Score
                          </p>
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-4xl sm:text-5xl font-semibold tracking-tight text-white font-sans">
                              {selectedApp.score}
                            </span>
                            <span className="text-2xl font-light text-white/40">%</span>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-mono uppercase tracking-wider ${
                            selectedApp.score >= 85
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                              : selectedApp.score >= 70
                              ? "bg-[#3054ff]/10 border border-[#3054ff]/20 text-blue-300"
                              : "bg-amber-500/10 border border-amber-500/20 text-amber-300"
                          }`}
                        >
                          {selectedApp.score >= 85 ? "High Alignment" : selectedApp.score >= 70 ? "Moderate Match" : "Significant Gaps"}
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-white/[0.08] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#3054ff] to-[#b4c0ff]"
                          style={{ width: `${selectedApp.score}%` }}
                        />
                      </div>

                      {selectedApp.summary && (
                        <p className="text-xs text-white/60 leading-relaxed italic border-t border-white/[0.06] pt-3">
                          &ldquo;{selectedApp.summary}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Missing Skills / Gaps */}
                    <div className="space-y-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 flex items-center gap-1.5">
                        <CircleAlert size={12} className="text-amber-400" />
                        Identified Missing Skills & Gaps
                      </p>
                      <div className="space-y-2">
                        {selectedApp.gaps && selectedApp.gaps.length > 0 ? (
                          selectedApp.gaps.map((gap, i) => (
                            <div
                              key={i}
                              className="border border-white/[0.08] bg-black/40 px-3.5 py-2.5 text-xs text-amber-200/90 font-mono flex items-center gap-2"
                            >
                              <span className="text-amber-400">·</span>
                              <span>{gap}</span>
                            </div>
                          ))
                        ) : (
                          <div className="border border-emerald-500/20 bg-emerald-500/05 px-3.5 py-2.5 text-xs text-emerald-300 font-mono flex items-center gap-2">
                            <Check size={12} /> No critical skill gaps detected.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Full Job Description Snippet */}
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40">
                        Parsed Job Description
                      </p>
                      <div className="border border-white/[0.08] bg-black p-4 max-h-40 overflow-y-auto text-xs text-white/60 leading-relaxed font-sans whitespace-pre-wrap">
                        {selectedApp.jd}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Application Milestones (Timeline Style) */}
                  <div className="p-7 sm:p-9 space-y-6 bg-black/30">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40">
                          Workflow
                        </p>
                        <h4 className="text-lg font-medium tracking-tight text-white mt-1">
                          Application Milestones
                        </h4>
                      </div>
                      <span className="rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono text-white/60">
                        Active Tracker
                      </span>
                    </div>

                    <div className="space-y-6 pt-2">
                      {selectedApp.timeline &&
                        selectedApp.timeline.map((event, idx) => (
                          <div key={idx} className="flex items-start gap-4">
                            <span className="text-xs font-mono text-white/40 pt-0.5 w-16 shrink-0">
                              {event.date}
                            </span>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    event.status === "completed"
                                      ? "bg-[#3054ff]"
                                      : event.status === "current"
                                      ? "bg-white animate-pulse"
                                      : "bg-white/20"
                                  }`}
                                />
                                <h5 className="text-sm font-medium text-white">{event.title}</h5>
                              </div>
                              <span className="text-[10px] font-mono text-white/40 uppercase block pl-4">
                                {event.type}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Applications List */}
            {loading ? (
              <div className="py-20 text-center text-white/40 font-mono text-xs">Loading tracked applications...</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    Tracked Positions ({applications.length})
                  </h3>
                  <span className="text-xs font-mono text-white/40">Stored locally in workspace</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`border transition cursor-pointer p-6 space-y-3 ${
                        selectedApp?.id === app.id
                          ? "border-[#3054ff] bg-[#0c0d14] shadow-lg shadow-[#3054ff]/05"
                          : "border-white/[0.08] bg-[#08090d] hover:border-white/20"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="text-base font-medium text-white">{app.role}</h4>
                            <span className="rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono text-white/80">
                              {app.company}
                            </span>
                            {app.mode && (
                              <span className="rounded-full border border-[#3054ff]/30 bg-[#3054ff]/10 px-2.5 py-0.5 text-[10px] font-mono text-blue-300">
                                {app.mode}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/40 font-mono">
                            {app.location} {app.salary ? `· ${app.salary}` : ""}
                          </p>
                          <p className="text-xs text-white/55 line-clamp-1 font-sans pt-1">
                            {app.jd}
                          </p>
                        </div>

                        <div className="flex items-center gap-5 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/[0.06]">
                          <div className="text-right">
                            <span className="text-[10px] font-mono uppercase text-white/40 block">Match</span>
                            <span
                              className={`text-xl font-semibold font-mono ${
                                app.score >= 85 ? "text-emerald-400" : app.score >= 70 ? "text-[#b4c0ff]" : "text-amber-400"
                              }`}
                            >
                              {app.score}%
                            </span>
                          </div>

                          <button
                            onClick={(e) => deleteApp(app.id, e)}
                            className="p-2 text-white/30 hover:text-red-400 hover:bg-white/[0.04] rounded transition"
                            title="Delete application"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE AI JOB SCOUT */}
        {activeTab === "scout" && (
          <div className="space-y-8">
            {/* Scout Terminal Hero */}
            <div className="border border-white/[0.10] bg-[#08090d] shadow-2xl shadow-black/80">
              <div className="flex h-11 items-center justify-between border-b border-white/[0.08] px-5 bg-white/[0.01]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40">
                  REAL-TIME WEB INTELLIGENCE · GEMINI 3.8 FLASH
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3054ff] animate-ping" />
                  GROUNDED
                </div>
              </div>

              <div className="p-7 sm:p-10 space-y-6">
                <div className="max-w-2xl space-y-2">
                  <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">
                    <span className="h-px w-8 bg-white/30" />
                    Live Job Radar
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-white">
                    Live AI Job Scout
                  </h2>
                  <p className="text-sm text-white/50 leading-relaxed font-sans">
                    Discover active, real-world openings across tech portals and career boards. Each role is scored
                    in real-time against your engineering background (Python, React, PyTorch, SQL, Data Engineering, LLMs).
                  </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleScoutJobs} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-6 space-y-1.5">
                      <label className="text-[10px] uppercase tracking-[0.18em] font-mono text-white/40">
                        Target Role / Specialization
                      </label>
                      <input
                        type="text"
                        value={roleQuery}
                        onChange={(e) => setRoleQuery(e.target.value)}
                        placeholder="e.g. AI Engineer, PyTorch Developer, Data Platform..."
                        className="w-full border border-white/[0.10] bg-black px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/20 focus:border-[#3054ff] focus:outline-none transition font-sans"
                        required
                      />
                    </div>

                    <div className="md:col-span-4 space-y-1.5">
                      <label className="text-[10px] uppercase tracking-[0.18em] font-mono text-white/40">
                        Target Location
                      </label>
                      <input
                        type="text"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        placeholder="e.g. Bengaluru, Remote, San Francisco..."
                        className="w-full border border-white/[0.10] bg-black px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/20 focus:border-[#3054ff] focus:outline-none transition font-sans"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-end">
                      <button
                        type="submit"
                        disabled={scouting}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-black py-3 px-4 text-xs font-semibold hover:scale-105 transition shadow-[0_0_24px_rgba(255,255,255,0.16)] disabled:opacity-50"
                      >
                        <Search size={14} />
                        <span>{scouting ? "Scouting..." : "Scout Web"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Recommendation Chips */}
                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    <span className="text-[10px] font-mono uppercase text-white/30">Suggestions:</span>
                    {[
                      "AI / LLM Engineer",
                      "PyTorch / Machine Learning Intern",
                      "Data Engineer (SQL & Python)",
                      "Full Stack AI Developer (React + Python)",
                      "Remote AI Researcher",
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setRoleQuery(preset)}
                        className="text-[11px] font-mono text-white/60 bg-white/[0.03] border border-white/[0.08] px-3 py-1 hover:border-white/30 hover:text-white transition rounded-full"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </form>
              </div>
            </div>

            {/* Error Banner */}
            {scoutError && (
              <div className="border border-amber-500/30 bg-[#0c0905] p-5 text-xs text-amber-200/90 font-mono space-y-2">
                <div className="flex items-center justify-between text-amber-300 font-semibold">
                  <div className="flex items-center gap-2">
                    <CircleAlert size={14} />
                    <span>Job Scout Notice</span>
                  </div>
                  <button onClick={() => setScoutError(null)} className="text-white/40 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
                <p>{scoutError}</p>
                {scoutError.toLowerCase().includes("gemini_api_key") ? (
                  <p className="text-white/40 text-[11px]">
                    Ensure your GEMINI_API_KEY is configured in <code className="text-amber-300">frontend/.env.local</code>.
                  </p>
                ) : (
                  <p className="text-white/40 text-[11px]">
                    Click &ldquo;Scout Web&rdquo; again to retry with fallback models.
                  </p>
                )}
              </div>
            )}

            {/* Loading State */}
            {scouting && (
              <div className="border border-white/[0.10] bg-[#08090d] p-12 text-center space-y-4">
                <div className="inline-flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-white/20 border-t-white" />
                <h4 className="text-base font-medium text-white">Scouting Live Tech Openings...</h4>
                <p className="text-xs font-mono text-white/40 max-w-md mx-auto">
                  Grounding queries on active portals, checking company career sites, and computing candidate skill fit.
                </p>
              </div>
            )}

            {/* Results Display */}
            {!scouting && scoutedJobs.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                      <span>Live Opportunities Found</span>
                      <span className="text-xs font-mono text-white/40">({scoutedJobs.length} active)</span>
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {scoutedJobs.map((job, idx) => {
                    const jobKey = job.title + "-" + job.company;
                    const isAdded = addedJobs.has(jobKey);

                    return (
                      <div
                        key={idx}
                        className="border border-white/[0.08] bg-[#08090d] p-6 space-y-4 hover:border-white/20 transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-xs font-mono font-semibold text-white/40">
                                #{idx + 1}
                              </span>
                              <h4 className="text-base font-semibold text-white">{job.title}</h4>
                              <span className="rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono text-white/80">
                                {job.company}
                              </span>
                              <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-0.5 text-[10px] font-mono text-white/50">
                                {job.location}
                              </span>
                            </div>

                            <p className="text-xs text-white/60 leading-relaxed font-sans pt-1">
                              <strong className="text-white/90 font-mono text-[11px]">AI Fit Analysis: </strong>
                              {job.reason}
                            </p>

                            <div className="pt-2">
                              <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-[#b4c0ff] hover:text-white transition font-mono"
                              >
                                <span>View Original Posting</span>
                                <ArrowUpRight size={13} />
                              </a>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-white/[0.06]">
                            <div className="text-right">
                              <span className="text-[10px] font-mono uppercase text-white/40 block">Match Score</span>
                              <span
                                className={`text-2xl font-semibold font-mono ${
                                  job.score >= 85 ? "text-emerald-400" : "text-[#b4c0ff]"
                                }`}
                              >
                                {job.score}%
                              </span>
                            </div>

                            <button
                              onClick={() => addScoutedJobToTracker(job)}
                              disabled={isAdded}
                              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                isAdded
                                  ? "bg-white/[0.06] border border-white/[0.10] text-emerald-300 cursor-default"
                                  : "bg-white text-black hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                              }`}
                            >
                              {isAdded ? "✓ In Tracker" : "+ Add to Tracker"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!scouting && scoutedJobs.length === 0 && !scoutError && (
              <div className="border border-dashed border-white/[0.10] p-12 text-center space-y-3">
                <Compass size={28} className="mx-auto text-white/30" />
                <h4 className="text-sm font-medium text-white">Ready to scout active opportunities</h4>
                <p className="text-xs text-white/40 max-w-md mx-auto">
                  Enter a target role and location above or select a preset to launch real-time candidate match scouting.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
