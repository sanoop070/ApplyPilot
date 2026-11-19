"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { motion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const VIDEO_SRC =
  "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8";

const POSTER_SRC =
  "https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZWNobm9sb2d5JTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3Njg5NzIyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080";

function SunburstIcon() {
  return (
    <svg
      width="24"
      height="24"
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

function Navbar() {
  return (
    <nav className="hero-nav">
      <a href="/" className="hero-logo" aria-label="ApplyPilot home">
        <SunburstIcon />
      </a>

      <div className="hero-nav-links">
        <a href="#products">
          Products
          <ChevronDown size={14} strokeWidth={1.8} />
        </a>
        <a href="#stories">Customer Stories</a>
        <a href="#resources">Resources</a>
        <a href="#pricing">Pricing</a>
      </div>

      <div className="hero-nav-actions">
        <a href="#demo" className="hero-demo-link">
          Book A Demo
        </a>

        <a href="#get-started" className="hero-get-started">
          Get Started
        </a>
      </div>
    </nav>
  );
}

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();

      hls.loadSource(VIDEO_SRC);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((error) => {
          console.log("Autoplay prevented:", error);
        });
      });

      return () => {
        hls.destroy();
      };
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = VIDEO_SRC;

      const handleLoadedMetadata = () => {
        video.play().catch((error) => {
          console.log("Autoplay prevented:", error);
        });
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, []);

  return (
    <section className="hero">
      <video
        ref={videoRef}
        className="hero-video"
        muted
        loop
        playsInline
        autoPlay
        poster={POSTER_SRC}
        aria-hidden="true"
      />

      <div className="hero-video-overlay" />

      <div className="hero-glow hero-glow-top" />
      <div className="hero-glow hero-glow-bottom" />

      <Navbar />

      <div className="hero-content">
        <motion.p
          className="hero-preheadline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your AI copilot for the internship hunt
        </motion.p>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          ApplyPilot
        </motion.h1>

        <motion.p
          className="hero-subheadline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Track applications, understand your fit, stay ahead of deadlines,
          and follow up with confidence.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <a href="#get-started" className="hero-primary-button">
            <span>Start Tracking Free</span>

            <span className="hero-primary-icon">
              <ArrowRight size={20} strokeWidth={2} />
            </span>
          </a>

          <a href="#examples" className="hero-secondary-button">
            <span>Explore the Dashboard</span>
            <ArrowRight size={18} strokeWidth={1.8} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
