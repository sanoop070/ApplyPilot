"use client";

import { useEffect, useState } from "react";

const API = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api`;
const statuses = ["saved", "applied", "online_assessment", "interview", "offer", "rejected", "withdrawn"];

function getToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("applypilot_token") ||
    ""
  );
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

const inputStyle =
  "w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3 text-white outline-none focus:border-blue-500";
const buttonStyle =
  "rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50";

export default function DashboardPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    company_id: "",
    role: "",
    job_url: "",
    location: "",
    employment_type: "",
    salary: "",
    status: "saved",
    applied_date: "",
    deadline: "",
    job_description: "",
    notes: "",
  });

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [apps, companyList] = await Promise.all([
        request("/applications"),
        request("/companies"),
      ]);
      setApplications(Array.isArray(apps) ? apps : []);
      setCompanies(Array.isArray(companyList) ? companyList : []);
    } catch (e: any) {
      setError(e.message || "Unable to load data. Please log in again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createApplication(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company_id || !form.role.trim()) {
      setError("Choose a company and enter a job role.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload: any = {
        ...form,
        company_id: Number(form.company_id),
        applied_date: form.applied_date ? form.applied_date + "T00:00:00" : null,
        deadline: form.deadline ? form.deadline + "T00:00:00" : null,
      };
      await request("/applications", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setForm({
        company_id: "",
        role: "",
        job_url: "",
        location: "",
        employment_type: "",
        salary: "",
        status: "saved",
        applied_date: "",
        deadline: "",
        job_description: "",
        notes: "",
      });
      setShowForm(false);
      await loadData();
    } catch (e: any) {
      setError(e.message || "Could not save application.");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(id: number, status: string) {
    try {
      await request(`/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadData();
    } catch (e: any) {
      setError(e.message || "Status update failed.");
    }
  }

  async function deleteApplication(id: number) {
    try {
      await request(`/applications/${id}`, { method: "DELETE" });
      setPendingDeleteId(null);
      setToast("Application deleted successfully.");
      setTimeout(() => setToast(""), 3000);
      await loadData();
    } catch (e: any) {
      setError(e.message || "Delete failed.");
      setPendingDeleteId(null);
    }
  }

  const count = (status: string) => applications.filter((a) => a.status === status).length;
  const active = applications.filter((a) => !["rejected", "withdrawn"].includes(a.status)).length;
  const interviewCount = count("interview");
  const offers = count("offer");
  const responseRate = applications.length
    ? Math.round(((interviewCount + offers + count("rejected")) / applications.length) * 100)
    : 0;

  function companyName(id: number) {
    const company = companies.find((c) => c.id === id);
    return company?.name || company?.company_name || `Company #${id}`;
  }

  function prettyStatus(status: string) {
    return (status || "").replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase());
  }

  return (
    <main className="min-h-screen bg-[#080b12] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">ApplyPilot</h1>
            <p className="mt-2 text-gray-400">Your real application tracker</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={loadData} className="rounded-xl border border-white/10 px-4 py-3 hover:bg-white/5">
              Refresh
            </button>
            <button onClick={() => setShowForm(!showForm)} className={buttonStyle}>
              {showForm ? "Close form" : "+ Add application"}
            </button>
            <button onClick={() => { localStorage.clear(); location.href = "/login"; }} className="rounded-xl border border-white/10 px-4 py-3 text-gray-300 hover:bg-white/5">
              Log out
            </button>
          </div>
        </header>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ["Total applications", applications.length],
            ["Active applications", active],
            ["Interviews", interviewCount],
            ["Offers", offers],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-white/10 bg-[#101521] p-5">
              <p className="text-sm text-gray-400">{label}</p>
              <p className="mt-3 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </section>

        {showForm && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-[#101521] p-5 sm:p-7">
            <h2 className="mb-5 text-xl font-bold">Add an application</h2>
            {companies.length === 0 ? (
              <p className="text-amber-300">
                You don't have any companies saved yet. Create a company first using your Companies API/Swagger at{" "}
                <a className="underline" href="http://localhost:8000/docs" target="_blank">backend docs</a>.
              </p>
            ) : (
              <form onSubmit={createApplication} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-300">
                  Company *
                  <select className={inputStyle} value={form.company_id} onChange={(e) => setForm({ ...form, company_id: e.target.value })} required>
                    <option value="">Select company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name || c.company_name}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-gray-300">
                  Job role *
                  <input className={inputStyle} placeholder="Software Engineer Intern" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
                </label>
                <label className="space-y-2 text-sm text-gray-300">
                  Job URL
                  <input className={inputStyle} type="url" placeholder="https://..." value={form.job_url} onChange={(e) => setForm({ ...form, job_url: e.target.value })} />
                </label>
                <label className="space-y-2 text-sm text-gray-300">
                  Location
                  <input className={inputStyle} placeholder="Bengaluru / Remote" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </label>
                <label className="space-y-2 text-sm text-gray-300">
                  Employment type
                  <input className={inputStyle} placeholder="Internship / Full-time" value={form.employment_type} onChange={(e) => setForm({ ...form, employment_type: e.target.value })} />
                </label>
                <label className="space-y-2 text-sm text-gray-300">
                  Salary / stipend
                  <input className={inputStyle} placeholder="e.g. ?30,000/month" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
                </label>
                <label className="space-y-2 text-sm text-gray-300">
                  Status
                  <select className={inputStyle} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {statuses.map((s) => <option key={s} value={s}>{prettyStatus(s)}</option>)}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-gray-300">
                  Applied date
                  <input className={inputStyle} type="date" value={form.applied_date} onChange={(e) => setForm({ ...form, applied_date: e.target.value })} />
                </label>
                <label className="space-y-2 text-sm text-gray-300">
                  Deadline
                  <input className={inputStyle} type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                </label>
                <label className="space-y-2 text-sm text-gray-300 sm:col-span-2">
                  Job description
                  <textarea className={inputStyle} rows={3} placeholder="Paste the job description..." value={form.job_description} onChange={(e) => setForm({ ...form, job_description: e.target.value })} />
                </label>
                <label className="space-y-2 text-sm text-gray-300 sm:col-span-2">
                  Notes
                  <textarea className={inputStyle} rows={2} placeholder="Your notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </label>
                <button disabled={saving} className={`${buttonStyle} sm:col-span-2`}>
                  {saving ? "Saving..." : "Save application"}
                </button>
              </form>
            )}
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-white/10 bg-[#101521] p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Your applications</h2>
            <span className="text-sm text-gray-400">{applications.length} records</span>
          </div>

          {loading ? (
            <p className="py-10 text-center text-gray-400">Loading your saved applications...</p>
          ) : applications.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg font-semibold">No applications yet</p>
              <p className="mt-2 text-gray-400">Add your first application to start tracking your job search.</p>
              <button onClick={() => setShowForm(true)} className={`${buttonStyle} mt-5`}>+ Add your first application</button>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((a) => (
                <article key={a.id} className="flex flex-col gap-4 rounded-xl border border-white/5 bg-[#080b12] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{companyName(a.company_id)}</h3>
                    <p className="mt-1 text-gray-300">{a.role}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      {a.location && <span>{a.location}</span>}
                      {a.salary && <span>{a.salary}</span>}
                      {a.deadline && <span>Deadline: {a.deadline}</span>}
                      {a.job_url && <a className="text-blue-400 underline" href={a.job_url} target="_blank" rel="noreferrer">Job posting ?</a>}
                    </div>
                    {a.notes && <p className="mt-2 text-sm text-gray-400">{a.notes}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select aria-label="Update status" className="rounded-lg border border-white/10 bg-[#101521] px-3 py-2 text-sm" value={a.status} onChange={(e) => changeStatus(a.id, e.target.value)}>
                      {statuses.map((s) => <option key={s} value={s}>{prettyStatus(s)}</option>)}
                    </select>
                    <button onClick={() => setPendingDeleteId(a.id)} className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10">
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    
        {pendingDeleteId !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101521] p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Delete application?</h3>
              <p className="mt-2 text-sm text-gray-400">
                This application will be permanently deleted. This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setPendingDeleteId(null)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteApplication(pendingDeleteId)}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                >
                  Delete permanently
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-xl border border-green-500/30 bg-[#10251b] px-5 py-3 text-sm text-green-300 shadow-xl">
            ? {toast}
          </div>
        )}
      </main>
  );
}








