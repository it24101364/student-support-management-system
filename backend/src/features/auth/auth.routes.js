import { Router } from 'express';
import { authenticate } from '../../shared/auth.js';
import { currentUser, login, register } from './auth.controller.js';
import { forgotPassword, updatePassword, verifyOtp } from './passwordReset.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', updatePassword);
router.get('/me', authenticate, currentUser);

export default router;
