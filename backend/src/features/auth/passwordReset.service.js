import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import PasswordReset from './passwordReset.model.js';
import { createHttpError } from '../../shared/errors.js';
import { requireEmail, requirePassword } from '../../shared/validation.js';
import { sendPasswordOtp } from './mail.service.js';

const OTP_LIFETIME_MS = 10 * 60 * 1000;
const RESET_TOKEN_LIFETIME_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function hash(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function createOtp() { return crypto.randomInt(100000, 1000000).toString(); }
function createToken() { return crypto.randomBytes(32).toString('hex'); }

export async function requestPasswordReset(input) {
  const email = requireEmail(input.email);
  const user = await User.findOne({ email, status: 'ACTIVE' });
  if (!user) return;

  const otp = createOtp();
  await PasswordReset.deleteMany({ email });
  await PasswordReset.create({ email, otpHash: hash(otp), expiresAt: new Date(Date.now() + OTP_LIFETIME_MS) });
  await sendPasswordOtp(email, otp);
}

export async function verifyPasswordOtp(input) {
  const email = requireEmail(input.email);
  const otp = typeof input.otp === 'string' ? input.otp.trim() : '';
  if (!/^\d{6}$/.test(otp)) throw createHttpError(400, 'OTP must be a 6-digit code');

  const reset = await PasswordReset.findOne({ email }).sort({ createdAt: -1 });
  if (!reset || reset.usedAt || reset.expiresAt <= new Date()) throw createHttpError(400, 'OTP is invalid or expired');
  if (reset.attempts >= MAX_ATTEMPTS) throw createHttpError(429, 'Too many incorrect OTP attempts');
  if (reset.otpHash !== hash(otp)) {
    reset.attempts += 1;
    await reset.save();
    throw createHttpError(400, 'OTP is invalid or expired');
  }

  const resetToken = createToken();
  reset.resetTokenHash = hash(resetToken);
  reset.verifiedAt = new Date();
  reset.expiresAt = new Date(Date.now() + RESET_TOKEN_LIFETIME_MS);
  await reset.save();
  return resetToken;
}

export async function resetPassword(input) {
  const email = requireEmail(input.email);
  const password = requirePassword(input.password);
  if (typeof input.resetToken !== 'string' || input.resetToken.length < 32) throw createHttpError(400, 'Password reset verification is required');

  const reset = await PasswordReset.findOne({ email, resetTokenHash: hash(input.resetToken), verifiedAt: { $ne: null }, usedAt: null, expiresAt: { $gt: new Date() } });
  if (!reset) throw createHttpError(400, 'Password reset verification is invalid or expired');
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.findOneAndUpdate({ email, status: 'ACTIVE' }, { passwordHash }, { new: true });
  if (!user) throw createHttpError(400, 'Password reset verification is invalid or expired');
  reset.usedAt = new Date();
  await reset.save();
}
