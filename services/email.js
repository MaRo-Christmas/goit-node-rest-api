import nodemailer from "nodemailer";

const { UKR_NET_USER, UKR_NET_PASS } = process.env;

export const mailer = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_USER,
    pass: UKR_NET_PASS,
  },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
});

export async function verifySmtp() {
  try {
    await mailer.verify();
    console.log("[mailer] SMTP OK");
  } catch (e) {
    console.error("[mailer] SMTP verify failed:", e?.message || e);
  }
}

export async function sendEmail({ to, subject, html, text, replyTo }) {
  const from = `"Contacts API" <${UKR_NET_USER}>`;

  try {
    await mailer.sendMail({
      from,
      to,
      subject,
      html,
      text: text || stripHtml(html),
      replyTo,
    });
  } catch (e) {
    throw e;
  }
}

function stripHtml(html = "") {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}
