import { db } from './init';

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
  static createMember(
    name: string,
    password: string,
    phone: string,
    age?: number,
    address?: string
  ): Promise<Member> {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO members (name, password, phone, age, address)
        VALUES (?, ?, ?, ?, ?)`,
        [name, password, phone, age || null, address || null],
        function (err) {
          if (err) return reject(err);

          db.get('SELECT * FROM members WHERE id = ?', [this.lastID], (err, member: Member) => {
            if (err) reject(err);
            else resolve(member);
          });
        }
      );
    });
  }

  // 獲取所有會員
  static getAllMembers(): Promise<Member[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM members ORDER BY created_at DESC', (err, members: Member[]) => {
        if (err) reject(err);
        else resolve(members || []);
      });
    });
  }

  // 獲取單個會員
  static getMemberById(id: number): Promise<Member | undefined> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM members WHERE id = ?', [id], (err, member: Member | undefined) => {
        if (err) reject(err);
        else resolve(member);
      });
    });
  }

  // 獲取會員（通過用戶名 - 用於登入）
  static getMemberByName(name: string): Promise<Member | undefined> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM members WHERE name = ?', [name], (err, member: Member | undefined) => {
        if (err) reject(err);
        else resolve(member);
      });
    });
  }

  // 更新會員
  static updateMember(
    id: number,
    name: string,
    phone: string,
    age?: number,
    address?: string
  ): Promise<Member | null> {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE members 
        SET name = ?, phone = ?, age = ?, address = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [name, phone, age || null, address || null, id],
        function (err) {
          if (err) return reject(err);

          if (this.changes === 0) {
            resolve(null);
          } else {
            db.get('SELECT * FROM members WHERE id = ?', [id], (err, member: Member) => {
              if (err) reject(err);
              else resolve(member);
            });
          }
        }
      );
    });
  }

  // 刪除會員
  static deleteMember(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM members WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }
}

export class SessionService {
  // 創建 session
  static createSession(sessionId: string, memberId: number, expiresAt: Date): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO sessions (id, member_id, expires_at)
        VALUES (?, ?, ?)`,
        [sessionId, memberId, expiresAt.toISOString()],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // 獲取 session
  static getSession(sessionId: string): Promise<{ member_id: number; expires_at: string } | undefined> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT member_id, expires_at FROM sessions WHERE id = ?',
        [sessionId],
        (err, row: { member_id: number; expires_at: string } | undefined) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  // 刪除 session
  static deleteSession(sessionId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM sessions WHERE id = ?', [sessionId], function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }

  // 清理過期 session
  static cleanupExpiredSessions(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}


