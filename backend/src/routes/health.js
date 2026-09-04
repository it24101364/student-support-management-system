import { Router } from 'express';

const router = Router();

router.get('/', (_request, response) => {
  response.json({ success: true, data: { status: 'ok' } });
});

export default router;
