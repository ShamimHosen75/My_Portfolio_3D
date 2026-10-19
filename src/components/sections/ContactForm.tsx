"use client";

import { useId, useRef, useState } from "react";
import { contact } from "@/data/contact";
import { site } from "@/data/site";

type Field = "name" | "email" | "subject" | "message";
type Errors = Partial<Record<Field, string>>;
type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "error"; message: string };

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (data.name.trim().length < 2)
    errors.name = "Please enter your name (at least 2 characters).";
  if (!data.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(data.email.trim()))
    errors.email = "That email doesn't look right. Try name@example.com.";
  if (!data.subject)
    errors.subject = "Please choose what your message is about.";
  if (data.message.trim().length < 10)
    errors.message =
      "Please write a little more (at least 10 characters) so I can help.";
  else if (data.message.length > 5000)
    errors.message = "Please keep your message under 5,000 characters.";
  return errors;
}

export function ContactForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const fieldId = (f: Field) => `${uid}-${f}`;
  const errorId = (f: Field) => `${uid}-${f}-error`;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.state === "sending") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    const found = validate(data);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      setStatus({ state: "idle" });
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    // Bots fill the hidden field; pretend it worked and send nothing.
    if (fd.get("botcheck")) {
      setStatus({ state: "sent" });
      form.reset();
      return;
    }

    if (!ACCESS_KEY) {
      setStatus({
        state: "error",
        message: `The contact form isn't set up yet (missing Web3Forms access key). Please email me at ${site.email}.`,
      });
      return;
    }

    setStatus({ state: "sending" });
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          ...data,
          subject: `Portfolio: ${data.subject}`,
          from_name: data.name,
          replyto: data.email,
        }),
      });
      const json = (await res.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;
      if (res.ok && json?.success) {
        setStatus({ state: "sent" });
        form.reset();
        return;
      }
      if (res.status === 429) {
        setStatus({
          state: "error",
          message:
            "Too many messages in a short time. Please wait a minute and try again.",
        });
      } else {
        setStatus({
          state: "error",
          message: json?.message
            ? `The message couldn't be sent: ${json.message}`
            : `The message couldn't be sent (error ${res.status}). Please try again or email ${site.email}.`,
        });
      }
    } catch {
      setStatus({
        state: "error",
        message: `Couldn't reach the server. Check your connection and try again, or email ${site.email}.`,
      });
    }
  };

  const clearError = (f: Field) => () => {
    if (errors[f]) setErrors((prev) => ({ ...prev, [f]: undefined }));
  };

  const inputClass = (f: Field) =>
    `mt-2 w-full rounded-xl border bg-bg px-4 py-3.5 text-text placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
      errors[f] ? "border-[#FF8A75]" : "border-line"
    }`;

  const errorText = (f: Field) =>
    errors[f] ? (
      <p id={errorId(f)} className="mt-2 text-sm text-[#FF9C8A]">
        {errors[f]}
      </p>
    ) : null;

  const describedBy = (f: Field) => (errors[f] ? errorId(f) : undefined);

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      className="relative rounded-3xl border border-line bg-surface p-6 md:p-9"
    >
      {/* Honeypot: hidden from people and assistive tech, tempting for bots. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          Leave this empty
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("name")} className="text-sm font-medium">
            Name
          </label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            onInput={clearError("name")}
            className={inputClass("name")}
          />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor={fieldId("email")} className="text-sm font-medium">
            Email
          </label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            onInput={clearError("email")}
            className={inputClass("email")}
          />
          {errorText("email")}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={fieldId("subject")} className="text-sm font-medium">
          Subject
        </label>
        <select
          id={fieldId("subject")}
          name="subject"
          defaultValue=""
          aria-invalid={!!errors.subject}
          aria-describedby={describedBy("subject")}
          onChange={clearError("subject")}
          className={`${inputClass("subject")} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6' stroke='%239FB5B0' stroke-width='2' fill='none'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-12`}
        >
          <option value="" disabled>
            Choose a subject
          </option>
          {contact.subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errorText("subject")}
      </div>

      <div className="mt-5">
        <label htmlFor={fieldId("message")} className="text-sm font-medium">
          Message
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={5}
          placeholder="Tell me a bit about your project or idea"
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
          onInput={clearError("message")}
          className={`${inputClass("message")} resize-y`}
        />
        {errorText("message")}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-bg transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
        >
          {status.state === "sending" ? "Sending…" : "Send message"}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status.state === "sending" && (
            <span className="text-muted">Sending…</span>
          )}
          {status.state === "sent" && (
            <span className="text-accent">
              Message sent. Thanks, I&apos;ll get back to you soon.
            </span>
          )}
          {status.state === "error" && (
            <span className="text-[#FF9C8A]">{status.message}</span>
          )}
        </p>
      </div>
    </form>
  );
}
