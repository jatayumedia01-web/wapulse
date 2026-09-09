"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <h3 className="mt-4 font-serif text-xl font-bold text-navy">Message Sent!</h3>
        <p className="mt-2 text-sm text-gray-text">We will get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <input
          required
          placeholder="Your Name"
          className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
        <input
          required
          type="email"
          placeholder="Email Address"
          className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
      </div>
      <input
        placeholder="Subject"
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
      <textarea
        required
        rows={5}
        placeholder="Your Message"
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
      <button type="submit" className="btn-gold rounded-lg px-8 py-3.5 text-sm">
        SEND MESSAGE
      </button>
    </form>
  );
}
