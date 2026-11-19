import {
  LayoutDashboard, BriefcaseBusiness, Sparkles, FileText, CalendarDays,
  Settings, Search, Bell, Plus, ArrowUpRight, Clock, CheckCircle2,
  CircleDot, TrendingUp, MoreHorizontal, ChevronRight, Target
} from "lucide-react";

const stats = [
  { label: "Total applications", value: "24", note: "+4 this week", icon: BriefcaseBusiness, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Interviews", value: "5", note: "2 upcoming", icon: CalendarDays, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Assessments", value: "3", note: "1 due soon", icon: Target, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Offers", value: "2", note: "Keep it going!", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

const pipeline = [
  { name: "Saved", count: 6, color: "bg-slate-400" },
  { name: "Applied", count: 10, color: "bg-blue-400" },
  { name: "Assessment", count: 3, color: "bg-amber-400" },
  { name: "Interview", count: 5, color: "bg-violet-400" },
  { name: "Offers", count: 2, color: "bg-emerald-400" },
];

const applications = [
  { company: "Google", role: "Software Engineering Intern", date: "Nov 16, 2026", status: "Interview", color: "text-violet-300", badge: "bg-violet-500/10", logo: "G", logoColor: "text-blue-400" },
  { company: "Microsoft", role: "SWE Intern — Summer 2027", date: "Nov 14, 2026", status: "Assessment", color: "text-amber-300", badge: "bg-amber-500/10", logo: "M", logoColor: "text-sky-400" },
  { company: "Amazon", role: "Software Development Engineer Intern", date: "Nov 12, 2026", status: "Applied", color: "text-blue-300", badge: "bg-blue-500/10", logo: "a", logoColor: "text-orange-400" },
  { company: "Adobe", role: "Product Engineering Intern", date: "Nov 10, 2026", status: "Applied", color: "text-blue-300", badge: "bg-blue-500/10", logo: "A", logoColor: "text-red-400" },
];

const deadlines = [
  { company: "Microsoft", task: "Online assessment", date: "Tomorrow", color: "border-amber-400" },
  { company: "Google", task: "Interview · Round 1", date: "Nov 22", color: "border-violet-400" },
  { company: "NVIDIA", task: "Application deadline", date: "Nov 25", color: "border-blue-400" },
];

const nav = [
  { name: "Overview", icon: LayoutDashboard, active: true },
  { name: "Applications", icon: BriefcaseBusiness },
  { name: "AI Job Matches", icon: Sparkles },
  { name: "Resume Analyzer", icon: FileText },
  { name: "Follow-ups", icon: CalendarDays },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#080b12] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 border-r border-white/[0.06] bg-[#0b0f17] px-5 py-7 lg:flex lg:flex-col">
          <a href="/" className="mb-10 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-500/20">A</div>
            <span className="text-lg font-semibold tracking-tight">Apply<span className="text-blue-400">Pilot</span></span>
          </a>
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
          <nav className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.name} href="#" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${item.active ? "border border-blue-500/20 bg-blue-500/10 text-blue-300" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"}`}>
                  <Icon size={17} />
                  {item.name}
                  {item.name === "Applications" && <span className="ml-auto rounded-md bg-white/[0.06] px-2 py-0.5 text-xs text-slate-400">24</span>}
                </a>
              );
            })}
          </nav>
          <div className="mt-9 border-t border-white/[0.06] pt-6">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Preferences</p>
            <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/[0.04]"><Settings size={17}/> Settings</a>
          </div>
          <div className="mt-auto rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-500/[0.09] to-violet-500/[0.04] p-4">
            <Sparkles size={18} className="mb-3 text-blue-400"/>
            <p className="text-sm font-medium">Your next opportunity awaits.</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">Stay consistent. Your dream role is closer than you think.</p>
            <a href="#" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-300">Explore matches <ArrowUpRight size={13}/></a>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 md:px-9">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 font-bold">A</div>
              <span className="font-semibold">Apply<span className="text-blue-400">Pilot</span></span>
            </div>
            <div className="hidden items-center gap-2 text-sm text-slate-500 lg:flex"><LayoutDashboard size={15}/> Workspace <ChevronRight size={14}/> <span className="text-slate-200">Overview</span></div>
            <div className="flex items-center gap-3">
              <button aria-label="Search" className="rounded-xl border border-white/[0.07] p-2.5 text-slate-400 hover:bg-white/[0.04]"><Search size={17}/></button>
              <button aria-label="Notifications" className="relative rounded-xl border border-white/[0.07] p-2.5 text-slate-400 hover:bg-white/[0.04]"><Bell size={17}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-400"/></button>
              <div className="ml-1 flex items-center gap-2.5 border-l border-white/[0.08] pl-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold">S</div>
                <div className="hidden sm:block"><p className="text-xs font-medium">Student</p><p className="text-[10px] text-slate-500">Candidate account</p></div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-9 md:py-10">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-medium text-blue-400">MONDAY, NOVEMBER 19</p>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Welcome back 👋</h1>
                <p className="mt-2 text-sm text-slate-400">Here's your internship search at a glance.</p>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"><Plus size={16}/> Add application</button>
            </div>

            <div className="mb-7 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] px-4 py-3 text-xs text-amber-200/80">
              Dashboard preview · Sample data is displayed here. Backend integration is the next step.
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return <div key={stat.label} className="rounded-2xl border border-white/[0.07] bg-[#101520] p-5 transition hover:border-white/[0.12]">
                  <div className="flex items-center justify-between"><span className="text-sm text-slate-400">{stat.label}</span><span className={`rounded-xl p-2 ${stat.bg} ${stat.color}`}><Icon size={18}/></span></div>
                  <div className="mt-4 flex items-end justify-between"><span className="text-3xl font-semibold tracking-tight">{stat.value}</span><span className="mb-1 flex items-center gap-1 text-xs text-emerald-400"><TrendingUp size={13}/>{stat.note}</span></div>
                </div>;
              })}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
              <div className="rounded-2xl border border-white/[0.07] bg-[#101520] p-5 md:p-6">
                <div className="mb-6 flex items-center justify-between"><div><h2 className="font-semibold">Application pipeline</h2><p className="mt-1 text-xs text-slate-500">Your progress through the hiring process</p></div><button className="text-slate-500"><MoreHorizontal size={19}/></button></div>
                <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-white/[0.04]">
                  {pipeline.map((p) => <div key={p.name} className={`${p.color} transition-all`} style={{width: `${p.count/24*100}%`}}/>)}
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  {pipeline.map(p => <div key={p.name}><div className="mb-2 flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${p.color}`}/><span className="text-xs text-slate-400">{p.name}</span></div><p className="text-xl font-semibold">{p.count}</p></div>)}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#101520] p-5 md:p-6">
                <div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold">Upcoming deadlines</h2><p className="mt-1 text-xs text-slate-500">Don't miss your next step</p></div><CalendarDays size={18} className="text-slate-500"/></div>
                <div className="space-y-4">
                  {deadlines.map(d => <div key={d.company} className={`flex items-center justify-between border-l-2 ${d.color} pl-3`}>
                    <div><p className="text-sm font-medium">{d.company}</p><p className="mt-1 text-xs text-slate-500">{d.task}</p></div><span className="text-xs text-slate-400">{d.date}</span>
                  </div>)}
                </div>
                <a href="#" className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs text-blue-300">View calendar <ChevronRight size={14}/></a>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#101520]">
              <div className="flex items-center justify-between border-b border-white/[0.06] p-5 md:px-6"><div><h2 className="font-semibold">Recent applications</h2><p className="mt-1 text-xs text-slate-500">Track your latest opportunities</p></div><a href="#" className="text-xs text-blue-300">View all <ArrowUpRight size={13} className="inline"/></a></div>
              <div className="divide-y divide-white/[0.04]">
                {applications.map(a => <div key={a.company} className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-white/[0.015] md:px-6">
                  <div className="flex min-w-0 items-center gap-3"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-lg font-bold ${a.logoColor}`}>{a.logo}</div><div className="min-w-0"><p className="text-sm font-medium">{a.company}</p><p className="mt-1 truncate text-xs text-slate-500">{a.role}</p></div></div>
                  <div className="hidden text-xs text-slate-500 sm:block">{a.date}</div><span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs ${a.badge} ${a.color}`}>{a.status}</span>
                </div>)}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-[#101520] p-5"><div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400"><Sparkles size={20}/></div><div className="flex-1"><h3 className="text-sm font-medium">AI job matches</h3><p className="mt-1 text-xs leading-5 text-slate-500">Discover opportunities aligned with your skills and interests.</p><a href="#" className="mt-3 inline-flex items-center gap-1 text-xs text-blue-300">Find matches <ChevronRight size={13}/></a></div></div>
              <div className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-[#101520] p-5"><div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400"><FileText size={20}/></div><div className="flex-1"><h3 className="text-sm font-medium">Resume intelligence</h3><p className="mt-1 text-xs leading-5 text-slate-500">Improve your resume and see how it aligns with your target roles.</p><a href="#" className="mt-3 inline-flex items-center gap-1 text-xs text-violet-300">Analyze resume <ChevronRight size={13}/></a></div></div>
            </div>
            <p className="mt-8 text-center text-[11px] text-slate-600">ApplyPilot · Stay focused. Keep moving. Get hired.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
