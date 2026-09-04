import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';
import { createHttpError } from './errors.js';

function signToken(user) {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is required');
  }

  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, { expiresIn: '1d' });
}

export function serializeUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status };
}

export function createSession(user) {
  return { token: signToken(user), user: serializeUser(user) };
}

export async function authenticate(request, _response, next) {
  try {
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authentication required');
    }

    const payload = jwt.verify(header.slice(7), env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user || user.status !== 'ACTIVE') {
      throw createHttpError(401, 'User is not active');
    }

    request.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : createHttpError(401, 'Invalid or expired token'));
  }
}

export function authorizeRoles(...roles) {
  return (request, _response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return next(createHttpError(403, 'You do not have permission to access this resource'));
    }
    next();
  };
}
