import { Router } from 'express';
import { authenticate } from '../../shared/auth.js';
import * as controller from './serviceRequest.controller.js';

const router = Router();
router.use(authenticate);
router.post('/', controller.create);
router.get('/my', controller.listMine);
router.get('/:id', controller.getMine);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
