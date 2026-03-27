"use client";

import { useState } from "react";

const roles = [
  { value: "landlord", label: "Independent landlord" },
  { value: "estate_agent", label: "Estate agent" },
  { value: "developer", label: "Developer" },
  { value: "prop_manager", label: "Property manager" },
];

const portfolioSizes = [
  { value: "1-5", label: "1-5 units" },
  { value: "6-25", label: "6-25 units" },
  { value: "26-100", label: "26-100 units" },
  { value: "100+", label: "100+ units" },
];

export default function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData.entries());

        setStatus("loading");
        setMessage("");

        try {
          const res = await fetch("/api/waitlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            throw new Error("Failed to submit");
          }

          setStatus("success");
          setMessage("Locked in. We'll reach out with onboarding details within 24h.");
          e.currentTarget.reset();
        } catch (err) {
          console.error(err);
          setStatus("error");
          setMessage("Couldn't save your spot. Try again or email hello@gaff.ie.");
        }
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Name</label>
          <input name="name" required className="form-input" placeholder="Sarah Doyle" />
        </div>
        <div>
          <label className="form-label">Work email</label>
          <input type="email" name="email" required className="form-input" placeholder="you@agency.ie" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Role</label>
          <select name="role" required className="form-input">
            <option value="">Select role</option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Portfolio size</label>
          <select name="portfolioSize" required className="form-input">
            <option value="">Units under management</option>
            {portfolioSizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="form-label">What do you need from Gaff.ie?</label>
        <textarea
          name="notes"
          rows={4}
          className="form-input"
          placeholder="Verified tenants, instant listing syndication, etc."
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="neon-button w-full md:w-auto"
      >
        {status === "loading" ? "Submitting..." : "Join the waitlist"}
      </button>

      {message && (
        <p className={`text-sm ${status === "error" ? "text-rose-300" : "text-emerald-300"}`}>{message}</p>
      )}
    </form>
  );
}
