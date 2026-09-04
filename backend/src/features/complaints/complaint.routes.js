import { Router } from 'express';
import { authenticate } from '../../shared/auth.js';
import * as complaintController from './complaint.controller.js';

const router = Router();
router.use(authenticate);
router.post('/', complaintController.create);
router.get('/my', complaintController.listMine);
router.get('/:id', complaintController.getMine);
router.patch('/:id', complaintController.update);
router.delete('/:id', complaintController.remove);

export default router;
