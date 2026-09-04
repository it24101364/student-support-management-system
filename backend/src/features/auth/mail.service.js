import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  if (!env.smtpHost || !env.smtpUser || !env.smtpPassword || !env.smtpFrom) {
    throw new Error('SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM are required for password recovery');
  }
  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: { user: env.smtpUser, pass: env.smtpPassword }
  });
  return transporter;
}

export function sendPasswordOtp(email, otp) {
  return getTransporter().sendMail({
    from: env.smtpFrom,
    to: email,
    subject: 'Student Support password reset code',
    text: `Your password reset code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`
  });
}
