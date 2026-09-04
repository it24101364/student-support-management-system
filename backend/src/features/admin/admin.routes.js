import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../shared/auth.js';
import * as controller from './admin.controller.js';

const router = Router();
router.use(authenticate, authorizeRoles('ADMIN'));
router.get('/users', controller.listUsers);
router.patch('/users/:id/status', controller.updateUserStatus);
router.get('/complaints', controller.listComplaints);
router.patch('/complaints/:id', controller.updateComplaint);
router.patch('/complaints/:id/status', controller.updateComplaintStatus);
router.get('/service-requests', controller.listRequests);
router.patch('/service-requests/:id', controller.updateRequest);
router.patch('/service-requests/:id/status', controller.updateRequestStatus);

export default router;
