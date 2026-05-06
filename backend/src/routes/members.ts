import { Router } from 'express';
import { MemberController } from '../controllers/memberController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 所有會員路由都需要認證
router.use(authMiddleware);

// 新增會員
router.post('/', MemberController.create);

// 獲取所有會員
router.get('/', MemberController.getAll);

// 獲取單個會員
router.get('/:id', MemberController.getById);

// 更新會員
router.put('/:id', MemberController.update);

// 刪除會員
router.delete('/:id', MemberController.delete);

export default router;
