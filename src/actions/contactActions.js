// src/actions/contactActions.js
"use server";

import { resend } from "@/lib/resend";
import { getPublicSettings } from "@/actions/settingsActions";

export async function sendContactMessage({ name, email, subject, message }) {
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return { success: false, error: "Plotëso emrin, email-in dhe mesazhin." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Email-i i vendosur nuk është valid." };
  }

  try {
    const settings = await getPublicSettings();
    const to = process.env.ADMIN_EMAIL || settings.storeEmail;

    const { error } = await resend.emails.send({
      from: `${settings.storeName} <${process.env.EMAIL_FROM}>`,
      to,
      replyTo: email,
      subject: `[Kontakt] ${subject?.trim() || "Mesazh i ri nga faqja"}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Mesazh i ri nga faqja e kontaktit</h2>
          <p><strong>Emri:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${subject ? `<p><strong>Subjekti:</strong> ${subject}</p>` : ""}
          <p><strong>Mesazhi:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: "Dërgimi dështoi. Provo përsëri." };
    }

    return {
      success: true,
      message: "Mesazhi u dërgua! Do t'ju kontaktojmë së shpejti.",
    };
  } catch (error) {
    console.error("Error sending contact message:", error);
    return { success: false, error: "Dërgimi dështoi. Provo përsëri." };
  }
}
