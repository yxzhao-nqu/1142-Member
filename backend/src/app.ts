import 'dotenv/config';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { initializeDatabase } from './db/init';
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';

const app = express();

// Render automatically populates process.env.PORT (default is 10000)
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  process.env.FRONTEND_URL, // Your Render Frontend
  'http://localhost:5173', // Custom Domain
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 初始化數據庫
initializeDatabase().then(() => {
  // 路由
  app.use('/api/auth', authRoutes);
  app.use('/api/members', memberRoutes);

  // 健康檢查
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK' });
  });

  // 啟動服務器
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

export default app;
