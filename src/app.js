import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend Tutorial API is running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      posts: '/api/posts',
    },
  });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
