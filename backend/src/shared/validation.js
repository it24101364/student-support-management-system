import { createHttpError } from './errors.js';

export function requireText(value, field, { max = 120, min = 1 } = {}) {
  if (typeof value !== 'string') {
    throw createHttpError(400, `${field} is required`);
  }

  const text = value.trim();
  if (text.length < min || text.length > max) {
    throw createHttpError(400, `${field} must be between ${min} and ${max} characters`);
  }

  return text;
}

export function requireEmail(value) {
  const email = requireText(value, 'Email', { max: 254 }).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw createHttpError(400, 'Email must be valid');
  }
  return email;
}

export function requirePassword(value) {
  if (typeof value !== 'string' || value.length < 8 || value.length > 72) {
    throw createHttpError(400, 'Password must be between 8 and 72 characters');
  }
  return value;
}
