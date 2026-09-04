import { loginUser, registerUser } from './auth.service.js';
import { serializeUser } from '../../shared/auth.js';

export async function register(request, response, next) {
  try {
    const session = await registerUser(request.body);
    response.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
}

export async function login(request, response, next) {
  try {
    const session = await loginUser(request.body);
    response.json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
}

export function currentUser(request, response) {
  response.json({ success: true, data: { user: serializeUser(request.user) } });
}
