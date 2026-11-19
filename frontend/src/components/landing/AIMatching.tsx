"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  Sparkles,
} from "lucide-react";

const matchedSkills = [
  { name: "Python", type: "direct" },
  { name: "React", type: "direct" },
  { name: "Cloud systems", type: "transferable" },
];

const missingSkills = ["Distributed systems"];

export default function AIMatching() {
  return (
    <section
      id="ai"
      className="relative overflow-hidden bg-black px-6 py-32 text-white sm:py-40"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-950/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-7 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">
              <span className="h-px w-8 bg-white/30" />
              AI matching, explained
            </div>

            <h2 className="max-w-3xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl lg:text-[92px]">
              Know which
              <br />
              opportunities
              <br />
              <span className="text-white/35">deserve your time.</span>
            </h2>

            <p className="mt-8 max-w-xl text-base leading-7 text-white/50 sm:text-lg">
              ApplyPilot compares the role against your actual experience,
              projects, education, and skills — then shows you why the match
              makes sense.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="relative"
          >
            <div className="border border-white/[0.10] bg-[#08090d] shadow-2xl shadow-black/50">
              <div className="flex h-11 items-center justify-between border-b border-white/[0.08] px-5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                </div>

                <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                  AI / MATCH ANALYSIS
                </div>

                <div className="flex items-center gap-2 text-[10px] text-white/35">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  LIVE
                </div>
              </div>

              <div className="grid lg:grid-cols-[1fr_0.72fr]">
                <div className="border-b border-white/[0.08] p-7 lg:border-b-0 lg:border-r lg:p-9">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                        Position
                      </p>
                      <h3 className="mt-2 text-2xl font-medium tracking-tight">
                        Software Engineering Intern
                      </h3>
                      <p className="mt-1 text-sm text-white/40">
                        Microsoft · Internship
                      </p>
                    </div>

                    <ArrowUpRight className="h-5 w-5 text-white/30" />
                  </div>

                  <div className="mt-12 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                        Match score
                      </p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-7xl font-semibold tracking-[-0.07em]">
                          87
                        </span>
                        <span className="text-sm text-white/30">/ 100</span>
                      </div>
                    </div>

                    <div className="mb-2 flex items-center gap-2 text-xs text-white/50">
                      <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                      Strong fit
                    </div>
                  </div>

                  <div className="mt-7 h-px w-full bg-white/[0.08]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "87%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.35, duration: 0.9, ease: "easeOut" }}
                      className="h-px bg-blue-400"
                    />
                  </div>

                  <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                        Skill evidence
                      </span>
                      <span className="text-[10px] text-white/25">
                        03 matched
                      </span>
                    </div>

                    <div className="space-y-0">
                      {matchedSkills.map((skill) => (
                        <div
                          key={skill.name}
                          className="flex items-center justify-between border-t border-white/[0.07] py-4"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-5 w-5 items-center justify-center border border-blue-400/40">
                              <Check className="h-3 w-3 text-blue-400" />
                            </span>
                            <span className="text-sm text-white/75">
                              {skill.name}
                            </span>
                          </div>

                          <span className="text-[10px] uppercase tracking-[0.14em] text-white/25">
                            {skill.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-7 lg:p-9">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
                    <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                    Why this matches
                  </div>

                  <p className="mt-6 text-sm leading-6 text-white/55">
                    Your projects and experience show strong evidence for the
                    core engineering requirements. Cloud experience is treated
                    as transferable rather than an exact match.
                  </p>

                  <div className="mt-9">
                    <div className="mb-4 text-[10px] uppercase tracking-[0.18em] text-white/30">
                      Gaps to consider
                    </div>

                    {missingSkills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-3 border-t border-white/[0.07] py-4"
                      >
                        <CircleAlert className="h-4 w-4 text-white/30" />
                        <span className="text-sm text-white/55">{skill}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 border-t border-white/[0.07] pt-6">
                    <div className="flex justify-between text-[10px] uppercase tracking-[0.16em]">
                      <span className="text-white/30">Experience level</span>
                      <span className="text-white/65">Compatible</span>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-1 flex-1 bg-white/[0.07]">
                        <div className="h-1 w-[82%] bg-white/60" />
                      </div>
                      <span className="text-xs text-white/35">82%</span>
                    </div>
                  </div>

                  <button className="group mt-9 flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white">
                    View full analysis
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-white/[0.08] pt-5 text-[10px] uppercase tracking-[0.18em] text-white/25">
          <span>02</span>
          <span>Evidence over guesswork.</span>
        </div>
      </div>
    </section>
  );
}
