import WaitlistForm from "@/components/forms/WaitlistForm";
import Link from "next/link";

const trustPillars = [
  {
    title: "Verification-first onboarding",
    body: "Upload CRO docs + ID once. We badge every listing with trust telemetry before it goes live.",
  },
  {
    title: "AI syndication",
    body: "One click sends listings to renters, corporates, and affordable housing partners with tailored copy.",
  },
  {
    title: "Viewing OS",
    body: "Schedule, confirm, and route viewings inside a glass dashboard with automatic reminders + attendance logs.",
  },
];

export const metadata = {
  title: "For landlords & agents | Gaff.ie",
  description: "Join the verification-first property platform. Capture verified tenants, AI scoring, and viewing automation before launch.",
};

export default function AgentsPage() {
  return (
    <main className="relative overflow-hidden pb-20">
      <section className="hero-gradient relative pt-28 pb-20">
        <div className="noise-overlay" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70">
              Operator waitlist
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold text-white leading-tight">
              Bring your portfolio to a verification-first marketplace.
            </h1>
            <p className="text-white/70 text-base sm:text-lg">
              We are onboarding the first twenty landlords, agents, and property managers who want scam-free listings, instant trust
              signals, and AI-matched tenants. Capture the demand surge the moment we open to the public.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-white/70">
              <span className="glass-panel px-4 py-2">Identity + ownership verification baked in</span>
              <span className="glass-panel px-4 py-2">AI-qualified tenant leads</span>
              <span className="glass-panel px-4 py-2">Viewing automation + analytics</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/listing/new" className="neon-button text-center">
                List today
              </Link>
              <Link href="/contact" className="ghost-pill text-center">
                Talk to the team
              </Link>
            </div>
          </div>
          <div className="glass-panel p-6 sm:p-8">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/60 mb-4">Join the private beta</p>
            <WaitlistForm />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid gap-6">
        {trustPillars.map((pillar) => (
          <div key={pillar.title} className="glass-panel p-6 sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">{pillar.title}</p>
            <p className="text-white/80 text-lg sm:text-xl mt-2">{pillar.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
