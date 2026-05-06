import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 登入
router.post('/login', AuthController.login);

// 登出（需要認證）
router.post('/logout', authMiddleware, AuthController.logout);

// 檢查認證狀態（需要認證）
router.get('/check', authMiddleware, AuthController.check);

export default router;
