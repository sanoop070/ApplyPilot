"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Sparkles,
} from "lucide-react";

const applications = [
  {
    company: "Microsoft",
    role: "Software Engineering Intern",
    status: "Interview",
    statusClass: "showcase-status-interview",
    date: "Sep 15",
  },
  {
    company: "Google",
    role: "STEP Intern",
    status: "Applied",
    statusClass: "showcase-status-applied",
    date: "Sep 18",
  },
  {
    company: "Stripe",
    role: "Software Engineer Intern",
    status: "OA",
    statusClass: "showcase-status-oa",
    date: "Sep 21",
  },
];

export default function ProductShowcase() {
  return (
    <section id="examples" className="showcase">
      <div className="showcase-grid" />

      <div className="showcase-inner">
        <motion.div
          className="showcase-intro"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <div className="showcase-eyebrow">
            <span className="showcase-eyebrow-line" />
            APPLICATION SEARCH, ORGANIZED
          </div>

          <h2>
            Turn the internship hunt
            <span> into a system.</span>
          </h2>

          <p>
            Every application, deadline, interview, and AI signal in one
            focused workspace.
          </p>
        </motion.div>

        <motion.div
          className="showcase-product"
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="showcase-window-bar">
            <div className="showcase-window-dots">
              <span />
              <span />
              <span />
            </div>

            <div className="showcase-window-title">
              <BriefcaseBusiness size={13} />
              ApplyPilot / Applications
            </div>

            <div className="showcase-window-count">03 ACTIVE</div>
          </div>

          <div className="showcase-dashboard">
            <aside className="showcase-sidebar">
              <div className="showcase-sidebar-brand">
                <span className="showcase-brand-mark">✳</span>
                <span>ApplyPilot</span>
              </div>

              <div className="showcase-sidebar-section">
                <span>WORKSPACE</span>

                <div className="showcase-sidebar-item active">
                  <BriefcaseBusiness size={15} />
                  Applications
                </div>

                <div className="showcase-sidebar-item">
                  <CalendarClock size={15} />
                  Deadlines
                </div>

                <div className="showcase-sidebar-item">
                  <Sparkles size={15} />
                  AI Insights
                </div>
              </div>

              <div className="showcase-sidebar-bottom">
                <div className="showcase-resume">
                  <div className="showcase-resume-icon">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <strong>Resume ready</strong>
                    <span>AI matching enabled</span>
                  </div>
                </div>
              </div>
            </aside>

            <div className="showcase-main">
              <div className="showcase-main-header">
                <div>
                  <span className="showcase-main-kicker">OVERVIEW</span>
                  <h3>Applications</h3>
                </div>

                <button className="showcase-add-button">
                  Add application
                  <ArrowUpRight size={15} />
                </button>
              </div>

              <div className="showcase-stats">
                <div className="showcase-stat">
                  <span>ACTIVE</span>
                  <strong>12</strong>
                  <small>applications</small>
                </div>

                <div className="showcase-stat">
                  <span>INTERVIEWS</span>
                  <strong>04</strong>
                  <small>in progress</small>
                </div>

                <div className="showcase-stat accent">
                  <span>SUCCESS RATE</span>
                  <strong>38%</strong>
                  <small>offer / rejected</small>
                </div>
              </div>

              <div className="showcase-content-grid">
                <div className="showcase-application-list">
                  <div className="showcase-panel-heading">
                    <span>RECENT APPLICATIONS</span>
                    <span>DEADLINE</span>
                  </div>

                  {applications.map((application, index) => (
                    <motion.div
                      key={application.company}
                      className="showcase-application"
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.45,
                        delay: 0.3 + index * 0.08,
                      }}
                    >
                      <div className="showcase-company-mark">
                        {application.company.charAt(0)}
                      </div>

                      <div className="showcase-application-info">
                        <strong>{application.company}</strong>
                        <span>{application.role}</span>
                      </div>

                      <div
                        className={`showcase-status ${application.statusClass}`}
                      >
                        <CircleDot size={9} />
                        {application.status}
                      </div>

                      <div className="showcase-deadline">
                        {application.date}
                        <ChevronRight size={14} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="showcase-ai-card">
                  <div className="showcase-ai-top">
                    <span>
                      <Sparkles size={14} />
                      AI MATCH
                    </span>
                    <span className="showcase-ai-live">LIVE</span>
                  </div>

                  <div className="showcase-score">
                    <strong>87</strong>
                    <span>/ 100</span>
                  </div>

                  <div className="showcase-score-label">
                    Strong fit for
                    <strong> Software Engineering Intern</strong>
                  </div>

                  <div className="showcase-score-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "87%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>

                  <div className="showcase-ai-evidence">
                    <div>
                      <CheckCircle2 size={14} />
                      <span>Python</span>
                      <small>direct</small>
                    </div>
                    <div>
                      <CheckCircle2 size={14} />
                      <span>React</span>
                      <small>direct</small>
                    </div>
                    <div>
                      <CheckCircle2 size={14} />
                      <span>Cloud systems</span>
                      <small>transferable</small>
                    </div>
                  </div>

                  <button className="showcase-view-analysis">
                    View full analysis
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="showcase-caption"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span>01</span>
          <p>
            Stop maintaining spreadsheets. ApplyPilot turns your search into a
            living application system.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
