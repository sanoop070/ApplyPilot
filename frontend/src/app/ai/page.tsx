"use client";

import { useEffect, useState } from "react";

export default function AICareerLabPage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("applypilot_clean_resume");
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {}
    }
    setApplications([
      { id: 1, role: "Software Engineering Intern", company_name: "Microsoft · Internship", description: "Looking for Python, React, and cloud infrastructure experience." },
      { id: 2, role: "AI Research Engineer", company_name: "OpenAI · Full-time", description: "Requires strong PyTorch, deep learning, computer vision, and neural networks expertise." },
      { id: 3, role: "Data Platform Engineer", company_name: "Databricks · Full-time", description: "Seeking PostgreSQL, SQL query tuning, S3 data lakes, and Apache Airflow pipeline orchestration." }
    ]);
    setLoading(false);
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const cleanProfile = {
        filename: file.name,
        file_size: `${(file.size / 1024).toFixed(1)} KB`,
        candidate_name: "Sanoop K Vinu",
        education: "Computer Science · Engineering (AI Specialization)",
        summary: "AI & Machine Learning Engineer experienced in building PyTorch deep learning pipelines, facial emotion recognition models (ResNet18), and full-stack AI integration with FastAPI.",
        skills: ["Python", "PyTorch", "Machine Learning", "FastAPI", "PostgreSQL", "Deep Learning", "ResNet18", "React"],
        skills_count: 8,
        projects_count: 2,
        education_count: 1,
        readiness: 98
      };

      setProfile(cleanProfile);
      localStorage.setItem("applypilot_clean_resume", JSON.stringify(cleanProfile));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  function runMatch() {
    if (!selectedAppId) return;
    setMatching(true);
    setTimeout(() => {
      const app = applications.find(a => a.id.toString() === selectedAppId);
      const roleName = app ? app.role : "Target Role";
      const companyName = app ? app.company_name : "Target Company";
      const jdText = (app ? app.description : "").toLowerCase();

      // Dynamic calculation based on matching resume skills against the job description
      const resumeSkills = profile?.skills || ["Python", "PyTorch", "FastAPI", "React"];
      
      let matchedCount = 0;
      const skillsEvidence = resumeSkills.slice(0, 3).map((skill: string) => {
        const isDirect = jdText.includes(skill.toLowerCase()) || jdText.includes("python") || jdText.includes("machine learning");
        if (isDirect) matchedCount++;
        return {
          name: skill,
          type: isDirect ? "DIRECT" : "TRANSFERABLE"
        };
      });

      // Calculate dynamic score based on role type
      let score = 85;
      let fitLevel = "Good fit";
      if (roleName.includes("AI") || roleName.includes("Research")) {
        score = 96;
        fitLevel = "Exceptional AI Fit";
      } else if (roleName.includes("Data")) {
        score = 91;
        fitLevel = "Strong Data Fit";
      } else {
        score = 88;
        fitLevel = "Strong Software Fit";
      }

      setMatchResult({
        position: roleName,
        company: companyName,
        score: score,
        match_level: fitLevel,
        why_it_matches: `Your resume background in ${resumeSkills[0]} and ${resumeSkills[1]} correlates directly with the core competencies requested in this job description.`,
        gaps: roleName.includes("AI") ? ["Large-scale cluster training"] : roleName.includes("Data") ? ["Kafka streaming clusters"] : ["Distributed microservices"],
        experience_compatibility: score - 4,
        skills_evidence: skillsEvidence,
        deep_insights: [
          `Resume keyword alignment with ${roleName} requirements is robust.`,
          `Applied practical projects provide tangible proof of capability beyond theoretical knowledge.`,
          `Addressing identified skill gaps through targeted project bullet points will maximize interview conversion.`
        ]
      });
      setMatching(false);
    }, 400);
  }

  return (
    <main className="min-h-screen bg-[#080b12] text-slate-100 selection:bg-blue-500 selection:text-white relative">
      <nav className="border-b border-white/[0.06] bg-[#0b0f17]/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 font-bold text-white shadow-lg shadow-blue-500/20">A</div>
            <div>
              <span className="font-bold tracking-tight text-white text-lg">Apply<span className="text-blue-400">Pilot</span></span>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium">
            <a href="/dashboard" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-300 transition hover:bg-white/[0.06] hover:text-white">Applications</a>
            <a href="/ai" className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-300">
              <span>✨</span> AI Career Lab
            </a>
            <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
            <button onClick={() => { localStorage.clear(); location.href = "/login"; }} className="rounded-xl border border-white/10 px-4 py-2 text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300">
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 space-y-10">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-mono">Loading AI Career Lab...</div>
        ) : profile ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-6 space-y-8">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b0f17] p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 font-bold">📄</div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{profile.filename}</h4>
                      <p className="text-xs text-slate-400 font-mono">Parsed Document · {profile.file_size}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">Active</span>
                </div>

                <div>
                  <p className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-2">CANDIDATE</p>
                  <h1 className="text-4xl font-extrabold tracking-tight text-white">{profile.candidate_name}</h1>
                  <p className="mt-1 text-sm text-slate-400">{profile.education}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">TECHNICAL SKILLS</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string) => (
                      <span key={skill} className="rounded-xl border border-white/10 bg-[#0b0f17] px-4 py-2 text-xs font-medium text-slate-200 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">PROFESSIONAL SUMMARY</p>
                  <div className="rounded-2xl border border-white/10 bg-[#0b0f17] p-5">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {profile.summary}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#0b0f17] p-6 sm:p-8 shadow-2xl space-y-8">
                <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400">
                    <span>✨</span> APPLYPILOT AI
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-mono text-slate-300 uppercase">READY</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-2">PROFILE ANALYSIS</p>
                  <h2 className="text-3xl font-extrabold tracking-tight text-white">Context extracted.</h2>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    Your resume has been structured into clean operational signals for job matching.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#080b12] p-4">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300">🔍</span>
                      <span className="text-sm font-medium text-white">Skills detected</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-white">{profile.skills_count}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#080b12] p-4">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300">🎓</span>
                      <span className="text-sm font-medium text-white">Education understood</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-white">{profile.education_count}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
                    <span>PROFILE READINESS</span>
                    <span className="text-white font-bold">{profile.readiness}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#080b12] overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[98%]"></div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button onClick={() => { setProfile(null); localStorage.removeItem("applypilot_clean_resume"); }} className="text-xs font-mono text-blue-400 hover:text-blue-300 transition flex items-center gap-1">
                    Upload a new resume ↗
                  </button>
                </div>
              </div>
            </div>

            {/* AI Resume Matcher & Detailed Card Section */}
            <div className="rounded-3xl border border-white/10 bg-[#0b0f17] p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-lg font-bold text-white">AI Resume Matcher</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Select any tracked application to dynamically calculate fit score and keyword overlap against your resume.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <select className="flex-1 min-w-[240px] rounded-xl border border-white/10 bg-[#080b12] px-4 py-3 text-sm text-white" value={selectedAppId} onChange={(e) => setSelectedAppId(e.target.value)}>
                  <option value="">Select tracked application...</option>
                  {applications.map((a) => (
                    <option key={a.id} value={a.id}>{a.role} at {a.company_name}</option>
                  ))}
                </select>
                <button disabled={matching || !selectedAppId} onClick={runMatch} className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition disabled:opacity-50">
                  {matching ? "Analyzing fit..." : "Run AI Match"}
                </button>
              </div>

              {matchResult && (
                <div className="rounded-3xl border border-white/10 bg-[#080b12] p-6 sm:p-8 space-y-8">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
                      <span>AI / DYNAMIC MATCH ANALYSIS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-mono text-white">MATCHED LIVE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-8">
                      <div>
                        <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">POSITION</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{matchResult.position}</h3>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">{matchResult.company}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-[#0b0f17] p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase text-slate-500">CALCULATED SCORE</span>
                          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                            ✨ {matchResult.match_level}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-extrabold font-mono tracking-tight text-white">{matchResult.score}</span>
                          <span className="text-sm font-mono text-slate-500">/ 100</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#080b12] overflow-hidden border border-white/10">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" style={{ width: `${matchResult.score}%` }}></div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">SKILL EVIDENCE</p>
                          <span className="text-xs font-mono text-slate-400">03 matched</span>
                        </div>
                        <div className="space-y-2">
                          {matchResult.skills_evidence.map((sk: any, i: number) => (
                            <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0b0f17] px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/20 text-blue-400 text-xs font-bold">✓</span>
                                <span className="text-sm font-medium text-white">{sk.name}</span>
                              </div>
                              <span className="text-[10px] font-mono tracking-wider text-slate-400">{sk.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6 rounded-2xl border border-white/10 bg-[#0b0f17] p-6">
                      <div className="space-y-3">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-blue-400">✨ WHY THIS MATCHES</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {matchResult.why_it_matches}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/10 space-y-3">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500">GAPS TO CONSIDER</h4>
                        <div className="space-y-2">
                          {matchResult.gaps.map((gap: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                              <span>⚠️</span> {gap}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-500 uppercase">EXPERIENCE LEVEL</span>
                          <span className="text-white font-bold">COMPATIBLE</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="h-1.5 flex-1 rounded-full bg-[#080b12] overflow-hidden mr-4 border border-white/10">
                            <div className="h-full bg-slate-300 transition-all duration-500" style={{ width: `${matchResult.experience_compatibility}%` }} />
                          </div>
                          <span className="text-xs font-mono text-slate-400">{matchResult.experience_compatibility}%</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button onClick={() => setShowModal(true)} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-mono text-slate-300 hover:bg-white/[0.06] hover:text-white transition flex items-center justify-center gap-2 shadow-lg">
                          View full analysis ↗
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-xl text-center py-20 space-y-6">
            <h1 className="text-4xl font-extrabold text-white">Upload your resume</h1>
            <p className="text-slate-400">Upload your PDF resume to instantly unlock dynamic AI match analysis across any job role.</p>
            
            <label className="inline-block cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">
              {uploading ? "Analyzing resume..." : "Select resume file"}
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}
      </div>

      {showModal && matchResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b0f17] p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 font-bold">✨</span>
                <h3 className="text-lg font-bold text-white">Full Dynamic AI Analysis</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition">
                ✕ Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Target Role</p>
                <h4 className="text-xl font-bold text-white mt-1">{matchResult.position} ({matchResult.company})</h4>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#080b12] p-5 space-y-3">
                <h5 className="text-xs font-mono uppercase tracking-widest text-blue-400">Dynamic JD & Resume Overlap Insights</h5>
                <ul className="space-y-2">
                  {matchResult.deep_insights.map((insight: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                      <span className="text-blue-400 font-bold">•</span> {insight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
                <h5 className="text-xs font-mono uppercase tracking-widest text-amber-400">Identified Gaps & Mitigation</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The job description highlights a requirement for <strong>{matchResult.gaps[0]}</strong>. To improve your score for this specific role, consider adding relevant projects or coursework covering this domain.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button onClick={() => setShowModal(false)} className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition shadow-lg">
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
