import { NextResponse } from "next/server";
import { site } from "@/data/site";

export const runtime = "nodejs";

/**
 * Sends the contact form by email through Resend (https://resend.com).
 * Needs RESEND_API_KEY; CONTACT_FROM is optional (defaults to Resend's onboarding sender,
 * which is fine for testing; use an address on your verified domain in production).
 * Without a key it answers 503 and the form falls back to opening the visitor's mail app.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);
  const company = String(body.company ?? ""); // honeypot: real visitors never fill it

  if (company) return NextResponse.json({ ok: true });
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please fill in your name, a valid email and a message." }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Email sending is not configured." }, { status: 503 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: [site.email],
      reply_to: email,
      subject: `New message from ${name} via your portfolio`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "Could not send right now. Please try again." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
