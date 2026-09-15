import "server-only";
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY");
}

if (!process.env.EMAIL_FROM) {
  throw new Error("Missing EMAIL_FROM");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail_1({ to, subject, html }) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

async function sendEmail({ to, subject, html }) {
  try {
    const { data, error } = resend.emails.send({
      from: `${process.env.APP_NAME} <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("RESEND EMAIL", error);
      throw new Error(error.message || "Failed to send verification email");
    }

    return data;
  } catch (error) {
    console.error("SEND EMAIL Error: ", error);
    throw error;
  }
}

export async function sendVerificationEmail({ to, name, token }) {
  const url = `${process.env.APP_URL}/verify-email?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to,
    subject: "Verifiko email-in tënd",
    html: `
      <h2>Përshëndetje ${name || ""}</h2>
      <p>Kliko butonin më poshtë për të verifikuar email-in:</p>
      <p>
        <a href="${url}">
          Verifiko email-in
        </a>
      </p>
      <p>Ky link skadon pas 24 orësh.</p>
    `,
  });
}

export async function sendPasswordResetEmail({ to, name, token }) {
  const url = `${process.env.APP_URL}/reset-password?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to,
    subject: "Rivendos fjalëkalimin",
    html: `
      <h2>Përshëndetje ${name || ""}</h2>
      <p>Kliko butonin më poshtë për të vendosur një fjalëkalim të ri:</p>
      <p>
        <a href="${url}">
          Rivendos fjalëkalimin
        </a>
      </p>
      <p>Ky link skadon pas 1 ore.</p>
    `,
  });
}
