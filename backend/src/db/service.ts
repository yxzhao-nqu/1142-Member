import { pool } from './init';

export interface Member {
  id: number;
  name: string;
  password: string;
  phone: string;
  age?: number;
  address?: string;
  created_at: string;
  updated_at: string;
}

export class MemberService {
  // 新增會員
  static async createMember(
    name: string,
    password: string,
    phone: string,
    age?: number,
    address?: string
  ): Promise<Member> {
    const result = await pool.query(
      `INSERT INTO members (name, password, phone, age, address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, password, phone, age ?? null, address ?? null]
    );

    return result.rows[0];
  }

  // 獲取所有會員
  static async getAllMembers(): Promise<Member[]> {
    const result = await pool.query('SELECT * FROM members ORDER BY created_at DESC');
    return result.rows;
  }

  // 獲取單個會員
  static async getMemberById(id: number): Promise<Member | undefined> {
    const result = await pool.query('SELECT * FROM members WHERE id = $1', [id]);
    return result.rows[0];
  }

  // 獲取會員（通過用戶名 - 用於登入）
  static async getMemberByName(name: string): Promise<Member | undefined> {
    const result = await pool.query('SELECT * FROM members WHERE name = $1', [name]);
    return result.rows[0];
  }

  // 更新會員
  static async updateMember(
    id: number,
    name: string,
    phone: string,
    age?: number,
    address?: string
  ): Promise<Member | null> {
    const result = await pool.query(
      `UPDATE members
       SET name = $1,
           phone = $2,
           age = $3,
           address = $4,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name, phone, age ?? null, address ?? null, id]
    );

    return result.rows[0] ?? null;
  }

  // 刪除會員
  static async deleteMember(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM members WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export class SessionService {
  // 創建 session
  static async createSession(sessionId: string, memberId: number, expiresAt: Date): Promise<void> {
    await pool.query(
      `INSERT INTO sessions (id, member_id, expires_at)
       VALUES ($1, $2, $3)`,
      [sessionId, memberId, expiresAt.toISOString()]
    );
  }

  // 獲取 session
  static async getSession(sessionId: string): Promise<{ member_id: number; expires_at: string } | undefined> {
    const result = await pool.query(
      'SELECT member_id, expires_at FROM sessions WHERE id = $1',
      [sessionId]
    );
    return result.rows[0];
  }

  // 刪除 session
  static async deleteSession(sessionId: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
    return (result.rowCount ?? 0) > 0;
  }

  // 清理過期 session
  static async cleanupExpiredSessions(): Promise<void> {
    await pool.query('DELETE FROM sessions WHERE expires_at < NOW()');
  }
}


