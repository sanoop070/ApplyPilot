"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  FileText,
  GraduationCap,
  Layers3,
  ScanSearch,
  Sparkles,
} from "lucide-react";

const signals = [
  {
    icon: ScanSearch,
    label: "Skills detected",
    value: "12",
  },
  {
    icon: Layers3,
    label: "Projects mapped",
    value: "04",
  },
  {
    icon: GraduationCap,
    label: "Education understood",
    value: "01",
  },
];

export default function ResumeIntelligence() {
  return (
    <section
      id="resume"
      className="relative overflow-hidden bg-black px-6 py-32 text-white sm:py-40"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="max-w-3xl"
        >
          <div className="mb-7 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
            <span className="h-px w-8 bg-white/30" />
            Resume intelligence
          </div>

          <h2 className="text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl lg:text-[92px]">
            Your resume is
            <br />
            <span className="text-white/35">more than a document.</span>
          </h2>

          <p className="mt-8 max-w-xl text-base leading-7 text-white/50 sm:text-lg">
            ApplyPilot turns your resume into structured context that can be
            compared against every opportunity you track.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-px border border-white/[0.10] bg-white/[0.08] lg:grid-cols-[1fr_1fr]">
          {/* Resume panel */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="bg-[#080808] p-7 sm:p-10"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-white/45" />

                <div>
                  <p className="text-xs font-medium text-white/70">
                    resume.pdf
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/25">
                    Uploaded profile
                  </p>
                </div>
              </div>

              <span className="text-[9px] uppercase tracking-[0.16em] text-white/25">
                2.4 KB
              </span>
            </div>

            <div className="py-9">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                Candidate
              </p>

              <h3 className="mt-2 text-3xl font-medium tracking-tight">
                Software Engineer
              </h3>

              <p className="mt-2 text-sm text-white/35">
                Computer Science · Engineering
              </p>

              <div className="mt-9 space-y-7">
                <div>
                  <p className="mb-3 text-[9px] uppercase tracking-[0.18em] text-white/25">
                    Technical skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "Python",
                      "React",
                      "SQL",
                      "FastAPI",
                      "Machine Learning",
                      "PostgreSQL",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="border border-white/[0.09] px-3 py-1.5 text-xs text-white/55"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[9px] uppercase tracking-[0.18em] text-white/25">
                    Experience
                  </p>

                  <div className="border-l border-white/[0.12] pl-4">
                    <p className="text-sm text-white/65">
                      Full-stack engineering project
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/30">
                      Built production-style applications using Python,
                      React, APIs, databases, and machine learning systems.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[9px] uppercase tracking-[0.18em] text-white/25">
                    Projects
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-white/[0.08] p-3">
                      <p className="text-xs text-white/55">AI application</p>
                      <p className="mt-1 text-[10px] text-white/25">
                        ML · Python
                      </p>
                    </div>

                    <div className="border border-white/[0.08] p-3">
                      <p className="text-xs text-white/55">
                        Web platform
                      </p>
                      <p className="mt-1 text-[10px] text-white/25">
                        React · API
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI panel */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.12, duration: 0.7 }}
            className="relative bg-[#0a0b0f] p-7 sm:p-10"
          >
            <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 bg-blue-950/20 blur-[110px]" />

            <div className="relative">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                    ApplyPilot AI
                  </span>
                </div>

                <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-white/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Ready
                </span>
              </div>

              <div className="py-9">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Profile analysis
                </p>

                <h3 className="mt-3 text-3xl font-medium tracking-tight">
                  Context extracted.
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
                  Your resume is now structured into signals that can power
                  application matching and recommendations.
                </p>

                <div className="mt-9 divide-y divide-white/[0.07] border-y border-white/[0.07]">
                  {signals.map((signal, index) => {
                    const Icon = signal.icon;

                    return (
                      <motion.div
                        key={signal.label}
                        initial={{ opacity: 0, x: 12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.3 + index * 0.12,
                          duration: 0.4,
                        }}
                        className="flex items-center justify-between py-5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-9 w-9 items-center justify-center border border-white/[0.09]">
                            <Icon className="h-4 w-4 text-white/45" />
                          </div>

                          <span className="text-sm text-white/60">
                            {signal.label}
                          </span>
                        </div>

                        <span className="text-sm font-medium text-white/75">
                          {signal.value}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-9">
                  <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.16em]">
                    <span className="text-white/25">Profile readiness</span>
                    <span className="text-white/55">94%</span>
                  </div>

                  <div className="mt-3 h-px bg-white/[0.08]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "94%" }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.45,
                        duration: 0.9,
                        ease: "easeOut",
                      }}
                      className="h-px bg-blue-400"
                    />
                  </div>
                </div>

                <div className="mt-9 border border-blue-400/10 bg-blue-400/[0.035] p-5">
                  <div className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />

                    <div>
                      <p className="text-xs font-medium text-white/70">
                        Ready for matching
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/35">
                        ApplyPilot can now use this profile to explain fit
                        across your tracked opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="group flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white">
                View profile intelligence
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-white/[0.08] pt-5 text-[10px] uppercase tracking-[0.18em] text-white/25">
          <span>04</span>
          <span>One profile. Every opportunity.</span>
        </div>
      </div>
    </section>
  );
}
