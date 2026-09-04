import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import healthRouter from './routes/health.js';
import authRouter from './features/auth/auth.routes.js';
import complaintRouter from './features/complaints/complaint.routes.js';
import serviceRequestRouter from './features/serviceRequests/serviceRequest.routes.js';
import analyticsRouter from './features/analytics/analytics.routes.js';
import adminRouter from './features/admin/admin.routes.js';

const app = express();

const allowedOrigins = new Set([env.clientUrl, 'http://localhost:5173', 'http://localhost:5174']);
app.use(cors({ origin: (origin, callback) => {
	if (!origin || allowedOrigins.has(origin)) return callback(null, true);
	return callback(new Error('Origin is not allowed by CORS'));
} }));
app.use(express.json());
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/complaints', complaintRouter);
app.use('/api/service-requests', serviceRequestRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/admin', adminRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
