"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <h3 className="mt-4 font-serif text-xl font-bold text-navy">Application Submitted!</h3>
        <p className="mt-2 text-sm text-gray-text">
          Thank you for your interest. Our admissions team will contact you within 2–3 business days.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Student First Name" name="firstName" required />
        <Field label="Student Last Name" name="lastName" required />
        <Field label="Parent/Guardian Name" name="parentName" required />
        <Field label="Email Address" name="email" type="email" required />
        <Field label="Phone Number" name="phone" type="tel" required />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Grade Applying For</label>
          <select
            name="grade"
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          >
            <option value="">Select grade</option>
            <option>Early Years (Ages 3–5)</option>
            <option>Grade 1–5</option>
            <option>Grade 6–8</option>
            <option>Grade 9–12</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">Additional Message</label>
        <textarea
          name="message"
          rows={4}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          placeholder="Tell us about your child or any questions..."
        />
      </div>
      <button type="submit" className="btn-gold w-full rounded-lg py-3.5 text-sm sm:w-auto sm:px-10">
        SUBMIT APPLICATION
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
    </div>
  );
}
