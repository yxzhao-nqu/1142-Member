import 'dotenv/config';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { initializeDatabase } from './db/init';
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';

const app = express();
const PORT = process.env.PORT || 3001;

// 中間件
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
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
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

export default app;
