import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../shared/auth.js';
import { adminAnalytics, studentAnalytics } from './analytics.controller.js';

const router = Router();
router.use(authenticate);
router.get('/student', authorizeRoles('STUDENT'), studentAnalytics);
router.get('/admin', authorizeRoles('ADMIN'), adminAnalytics);

export default router;
