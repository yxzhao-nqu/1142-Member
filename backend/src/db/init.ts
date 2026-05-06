import sqlite3 from 'sqlite3';
import path from 'path';
import bcryptjs from 'bcryptjs';

const dbPath = path.join(__dirname, '../../db/database.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

export async function initializeDatabase() {
  return new Promise<void>((resolve, reject) => {
    // 啟用外鍵
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) return reject(err);

      // 創建 members 表
      db.run(
        `CREATE TABLE IF NOT EXISTS members (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          phone TEXT NOT NULL,
          age INTEGER,
          address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) return reject(err);

          // 創建 sessions 表
          db.run(
            `CREATE TABLE IF NOT EXISTS sessions (
              id TEXT PRIMARY KEY,
              member_id INTEGER NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              expires_at DATETIME,
              FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
            )`,
            async (err) => {
              if (err) return reject(err);

              try {
                // 檢查是否已有預設會員，如果沒有則創建
                await createDefaultMember();
                console.log('Database initialized successfully');
                resolve();
              } catch (error) {
                reject(error);
              }
            }
          );
        }
      );
    });
  });
}

// 創建預設會員
async function createDefaultMember() {
  return new Promise<void>((resolve, reject) => {
    // 檢查 admin 會員是否已存在
    db.get('SELECT id FROM members WHERE name = ?', ['admin'], async (err, row) => {
      if (err) return reject(err);

      if (row) {
        // admin 會員已存在
        console.log('Default admin member already exists');
        resolve();
        return;
      }

      try {
        // 加密密碼
        const hashedPassword = await bcryptjs.hash('123456', 10);

        // 插入預設會員
        db.run(
          `INSERT INTO members (name, password, phone, age, address)
          VALUES (?, ?, ?, ?, ?)`,
          ['admin', hashedPassword, '09123456789', 30, '台北市'],
          function (err) {
            if (err) return reject(err);
            console.log('Default admin member created successfully');
            resolve();
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  });
}

