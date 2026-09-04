import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import { createHttpError } from '../../shared/errors.js';
import { createSession } from '../../shared/auth.js';
import { requireEmail, requirePassword, requireText } from '../../shared/validation.js';

export async function registerUser(input) {
  const name = requireText(input.name, 'Name', { max: 80 });
  const email = requireEmail(input.email);
  const password = requirePassword(input.password);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const user = await User.create({ name, email, passwordHash, role: 'STUDENT' });
    return createSession(user);
  } catch (error) {
    if (error.code === 11000) throw createHttpError(409, 'An account with this email already exists');
    throw error;
  }
}

export async function loginUser(input) {
  const email = requireEmail(input.email);
  const password = requirePassword(input.password);
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw createHttpError(401, 'Invalid email or password');
  }
  if (user.status !== 'ACTIVE') {
    throw createHttpError(403, 'This account is inactive');
  }

  return createSession(user);
}
