"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Circle,
  Mail,
} from "lucide-react";

const events = [
  {
    date: "SEP 08",
    title: "Application submitted",
    company: "Microsoft · Software Engineering Intern",
    type: "Applied",
    state: "complete",
  },
  {
    date: "SEP 11",
    title: "Online assessment",
    company: "Microsoft · Software Engineering Intern",
    type: "OA",
    state: "complete",
  },
  {
    date: "SEP 15",
    title: "Technical interview",
    company: "Microsoft · Software Engineering Intern",
    type: "Interview",
    state: "current",
  },
  {
    date: "SEP 18",
    title: "Recruiter follow-up",
    company: "Microsoft · Software Engineering Intern",
    type: "Follow-up",
    state: "upcoming",
  },
];

export default function Timeline() {
  return (
    <section
      id="timeline"
      className="relative overflow-hidden bg-[#050505] px-6 py-32 text-white sm:py-40"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-7 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
              <span className="h-px w-8 bg-white/30" />
              Application intelligence
            </div>

            <h2 className="max-w-xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl lg:text-[88px]">
              Never lose
              <br />
              <span className="text-white/35">the thread.</span>
            </h2>

            <p className="mt-8 max-w-md text-base leading-7 text-white/50 sm:text-lg">
              Every application has a next move. ApplyPilot keeps deadlines,
              interviews, recruiter follow-ups, and status changes connected.
            </p>

            <div className="mt-12 flex items-center gap-4 border-t border-white/[0.08] pt-6">
              <div className="flex h-10 w-10 items-center justify-center border border-white/[0.12]">
                <CalendarDays className="h-4 w-4 text-white/60" />
              </div>

              <div>
                <p className="text-xs font-medium text-white/70">
                  Next action
                </p>
                <p className="mt-1 text-xs text-white/35">
                  Follow up with Microsoft · Sep 18
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="relative"
          >
            <div className="border border-white/[0.10] bg-[#090909]">
              <div className="flex h-12 items-center justify-between border-b border-white/[0.08] px-5">
                <div className="flex items-center gap-3">
                  <Circle className="h-3 w-3 fill-white/20 text-white/20" />
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                    Application / Timeline
                  </span>
                </div>

                <span className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                  04 EVENTS
                </span>
              </div>

              <div className="p-7 sm:p-9">
                <div className="mb-9 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                      Active application
                    </p>

                    <h3 className="mt-2 text-2xl font-medium tracking-tight">
                      Microsoft
                    </h3>

                    <p className="mt-1 text-sm text-white/35">
                      Software Engineering Intern
                    </p>
                  </div>

                  <span className="border border-blue-400/20 bg-blue-400/[0.06] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-blue-300">
                    Interview
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute bottom-5 left-[61px] top-5 w-px bg-white/[0.09] sm:left-[69px]" />

                  <div className="space-y-0">
                    {events.map((event, index) => (
                      <motion.div
                        key={event.date}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.2 + index * 0.1,
                          duration: 0.45,
                        }}
                        className="relative grid grid-cols-[52px_20px_1fr] gap-4 py-5 sm:grid-cols-[60px_20px_1fr] sm:gap-5"
                      >
                        <div className="pt-1 text-[10px] font-medium tracking-[0.14em] text-white/30">
                          {event.date}
                        </div>

                        <div className="relative z-10 flex justify-center">
                          {event.state === "complete" ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-[#090909]">
                              <Check className="h-3 w-3 text-white/60" />
                            </span>
                          ) : event.state === "current" ? (
                            <motion.span
                              animate={{ scale: [1, 1.12, 1] }}
                              transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut",
                              }}
                              className="flex h-5 w-5 items-center justify-center rounded-full border border-blue-400/60 bg-blue-400/10"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                            </motion.span>
                          ) : (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-[#090909]">
                              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h4
                              className={`text-sm font-medium ${
                                event.state === "upcoming"
                                  ? "text-white/45"
                                  : "text-white/80"
                              }`}
                            >
                              {event.title}
                            </h4>

                            <span className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                              {event.type}
                            </span>
                          </div>

                          <p className="mt-1 text-xs leading-5 text-white/30">
                            {event.company}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-7 grid border-t border-white/[0.08] pt-7 sm:grid-cols-2">
                  <div className="flex items-center gap-3 border-b border-white/[0.07] pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
                    <div className="flex h-9 w-9 items-center justify-center border border-white/[0.10]">
                      <Mail className="h-4 w-4 text-white/45" />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">
                        Follow-up
                      </p>
                      <p className="mt-1 text-xs text-white/60">
                        Due in 3 days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 sm:pl-6 sm:pt-0">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">
                        Status
                      </p>
                      <p className="mt-1 text-xs text-blue-300">
                        Interview in progress
                      </p>
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-white/25" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-white/[0.08] pt-5 text-[10px] uppercase tracking-[0.18em] text-white/25">
          <span>03</span>
          <span>Every application has a next move.</span>
        </div>
      </div>
    </section>
  );
}
