"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is required");
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: to.toLowerCase().trim(),
      subject: subject.trim(),
      html: text.trim(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error sending email", error);

    return {
      success: false,
      error: "Failed to send email. Please try again later.",
    };
  }
}
