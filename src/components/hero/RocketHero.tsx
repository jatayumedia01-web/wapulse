"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Flame, Inbox, Megaphone, Menu, Workflow, X, Zap } from "lucide-react";
import type { HeroSceneStatus } from "./scene-types";

const RocketScene = dynamic(() => import("./RocketScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" aria-hidden />,
});

const features = [
  {
    icon: Inbox,
    title: "Team inbox",
    copy: "Shared conversations, assignment, and AI copilots in one glass cockpit.",
  },
  {
    icon: Megaphone,
    title: "Broadcast campaigns",
    copy: "Launch template blasts with targeting, scheduling, and a live funnel.",
  },
  {
    icon: Workflow,
    title: "Automation",
    copy: "Keyword journeys, drip sequences, and WhatsApp flows that fire on cue.",
  },
];

export default function RocketHero() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<HeroSceneStatus>({
    thrusting: false,
    zoom: 1,
    orbiting: false,
  });

  function ignite() {
    window.dispatchEvent(new Event("wapulse-hero-ignite"));
  }

  return (
    <div className="hero-space min-h-screen bg-black text-white">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-[0_0_24px_rgba(16,185,129,0.35)]">
              <Zap size={18} strokeWidth={2.5} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">WAPulse</span>
          </Link>

          <nav className="hidden items-center gap-8 text-[13.5px] text-white/70 md:flex">
            <a href="#product" className="transition hover:text-white">
              Product
            </a>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <Link href="/auth/login" className="transition hover:text-white">
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black transition hover:bg-white/90"
            >
              Get started
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-white/10 bg-black/90 px-5 py-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-3 text-[14px] text-white/80">
              <a href="#product" onClick={() => setOpen(false)}>
                Product
              </a>
              <a href="#features" onClick={() => setOpen(false)}>
                Features
              </a>
              <Link href="/auth/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setOpen(false)}
                className="rounded-full bg-white px-4 py-2.5 text-center text-[13px] font-semibold text-black"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>

      <section
        id="product"
        className="relative isolate flex min-h-screen items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-0 sm:pt-0"
      >
        <div className="absolute inset-0 lg:left-[34%]">
          <RocketScene onStatus={setStatus} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.12)_42%,transparent_68%),radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_46%]">
          <div className="max-w-xl">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
              WhatsApp Business Platform
            </p>
            <h1 className="text-[42px] leading-[1.05] font-semibold tracking-tight text-white sm:text-6xl">
              Launch messages
              <span className="block text-white/55">at planetary scale.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/60 sm:text-[16px]">
              A cinematic command deck for inbox, campaigns, and automation — built for teams that
              treat every conversation like a launch.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/auth/register"
                className="rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-black transition hover:bg-white/90"
              >
                Start free
              </Link>
              <Link
                href="/auth/login"
                className="rounded-full border border-white/20 px-5 py-2.5 text-[13.5px] font-medium text-white/85 transition hover:border-white/40 hover:text-white"
              >
                Sign in
              </Link>
              <button
                type="button"
                onClick={ignite}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-[13px] font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
              >
                <Flame size={14} />
                Ignite
              </button>
            </div>

            <div className="hero-hud mt-8 grid max-w-md grid-cols-3 gap-2 text-[10px] tracking-[0.16em] uppercase">
              <div className={`hero-hud-cell ${status.orbiting ? "is-live" : ""}`}>
                <span>Orbit</span>
                <strong>{status.orbiting ? "Tracking" : "Auto"}</strong>
              </div>
              <div className={`hero-hud-cell ${status.thrusting ? "is-live" : ""}`}>
                <span>Thrust</span>
                <strong>{status.thrusting ? "Boost" : "Idle"}</strong>
              </div>
              <div className="hero-hud-cell">
                <span>Zoom</span>
                <strong>{status.zoom.toFixed(2)}x</strong>
              </div>
            </div>
            <p className="mt-4 text-[12px] text-white/35">
              Drag to orbit · scroll to zoom · click or Ignite for boost
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="relative border-t border-white/10 bg-black px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
            Mission systems
          </p>
          <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Everything after liftoff lives here.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, copy }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <Icon size={18} />
                </span>
                <h3 className="text-[16px] font-semibold">{title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-[12px] text-white/35 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} WAPulse</span>
          <div className="flex gap-5">
            <Link href="/auth/login" className="hover:text-white/70">
              Sign in
            </Link>
            <Link href="/auth/register" className="hover:text-white/70">
              Create workspace
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
