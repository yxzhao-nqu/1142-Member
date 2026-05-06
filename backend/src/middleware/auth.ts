import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../db/service';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      sessionId?: string;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.cookies?.sessionId;

    if (!sessionId) {
      return res.status(401).json({ error: 'Unauthorized: No session' });
    }

    const session = await SessionService.getSession(sessionId);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized: Invalid session' });
    }

    // 檢查 session 是否過期
    if (new Date(session.expires_at) < new Date()) {
      await SessionService.deleteSession(sessionId);
      return res.status(401).json({ error: 'Unauthorized: Session expired' });
    }

    req.userId = session.member_id;
    req.sessionId = sessionId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
