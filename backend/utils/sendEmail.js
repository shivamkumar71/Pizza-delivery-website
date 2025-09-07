import nodemailer from 'nodemailer';

export default async function sendEmail(to, subject, text) {
  // Simple nodemailer transporter using SMTP from env — optional. If not configured, just log.
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log('sendEmail: SMTP not configured, skipping send to', to);
    console.log('subject:', subject);
    console.log('text:', text);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: false,
    auth: { user, pass }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || user,
    to,
    subject,
    text
  });
}
