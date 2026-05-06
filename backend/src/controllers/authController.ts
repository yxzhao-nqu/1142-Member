import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { MemberService, SessionService } from '../db/service';
import { randomUUID } from 'crypto';

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 小時

export class AuthController {
  // 登入
  static async login(req: Request, res: Response) {
    try {
      const { name, password } = req.body;

      // 驗證輸入
      if (!name || !password) {
        return res.status(400).json({ error: 'Name and password are required' });
      }

      // 查找會員
      const member = await MemberService.getMemberByName(name);
      if (!member) {
        return res.status(401).json({ error: 'Invalid name or password' });
      }

      // 驗證密碼
      const isPasswordValid = await bcryptjs.compare(password, member.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid name or password' });
      }

      // 創建 session
      const sessionId = randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_DURATION);
      await SessionService.createSession(sessionId, member.id, expiresAt);

      // 設置 cookie
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION
      });

      res.json({
        message: 'Login successful',
        member: {
          id: member.id,
          name: member.name,
          phone: member.phone,
          age: member.age,
          address: member.address
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 登出
  static async logout(req: Request, res: Response) {
    try {
      const sessionId = req.cookies?.sessionId;

      if (sessionId) {
        await SessionService.deleteSession(sessionId);
      }

      res.clearCookie('sessionId');
      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 檢查登入狀態
  static async check(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const member = await MemberService.getMemberById(req.userId);
      if (!member) {
        return res.status(401).json({ error: 'User not found' });
      }

      res.json({
        authenticated: true,
        member: {
          id: member.id,
          name: member.name,
          phone: member.phone,
          age: member.age,
          address: member.address
        }
      });
    } catch (error) {
      console.error('Check auth error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
