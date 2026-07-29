import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  name?: string;
  email?: string;
  organisation?: string;
  message?: string;
};

/**
 * Sends contact-form submissions via Gmail SMTP (nodemailer) to CONTACT_RECIPIENT_EMAIL.
 * Credentials live in `.env.local` (gitignored) — SMTP_USER / SMTP_PASSWORD is a Gmail app
 * password, not the account password.
 */
export async function POST(request: Request) {
  const payload = (await request.json()) as ContactPayload;
  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const message = payload.message?.trim();
  const organisation = payload.organisation?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL ?? smtpUser;

  if (!smtpUser || !smtpPassword || !recipient) {
    console.error("[contact] SMTP not configured — missing SMTP_USER / SMTP_PASSWORD / CONTACT_RECIPIENT_EMAIL");
    return NextResponse.json({ error: "Email delivery is not configured." }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: smtpUser, pass: smtpPassword },
  });

  try {
    await transporter.sendMail({
      from: `"Proxy Consultants Ltd Website" <${smtpUser}>`,
      to: recipient,
      replyTo: email,
      subject: `New enquiry from ${name}${organisation ? ` (${organisation})` : ""}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Organisation: ${organisation || "—"}`,
        "",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Organisation:</strong> ${escapeHtml(organisation || "—")}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[contact] failed to send email", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
