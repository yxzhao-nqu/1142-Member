# 會員管理平台

## 項目簡介

一個使用 React + TypeScript 前端和 Node.js/Express 後端的會員管理平台。包括會員登入、登出、新增、修改、刪除等功能。

## 項目結構

```
Member/
├── frontend/          # React + TypeScript 前端項目
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── MemberManagement.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── backend/           # Node.js + Express 後端項目
    ├── src/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── routes/
    │   ├── db/
    │   └── app.ts
    └── package.json
```

## 技術棧

### 前端
- React 19
- TypeScript
- React Router v7
- Axios
- Vite

### 後端
- Node.js
- Express
- TypeScript
- SQLite3
- bcryptjs (密碼加密)
- cookie-parser

## 安裝與運行

### 前端

```bash
cd frontend
yarn install
yarn dev
```

前端訪問地址：`http://localhost:5173`

### 後端

```bash
cd backend
yarn install
yarn dev
```

後端服務器地址：`http://localhost:3001`

## 功能特性

✅ **會員登入**
- 通過帳號密碼登入
- Session 記錄登入狀態
- 24小時 Session 過期

✅ **會員管理**
- 查看所有會員列表
- 新增會員（需要帳號、密碼、電話）
- 修改會員信息
- 刪除會員

✅ **路由保護**
- 未登入用戶無法訪問會員管理頁面
- 自動重定向至登入頁

✅ **數據持久化**
- SQLite 數據庫存儲
- 密碼使用 bcrypt 加密

## API 端點

### 認證
- `POST /api/auth/login` - 登入
- `POST /api/auth/logout` - 登出
- `GET /api/auth/check` - 檢查登入狀態

### 會員管理
- `GET /api/members` - 獲取所有會員
- `GET /api/members/:id` - 獲取單個會員
- `POST /api/members` - 新增會員
- `PUT /api/members/:id` - 修改會員
- `DELETE /api/members/:id` - 刪除會員

## 使用說明

1. **首次啟動**
   - 同時啟動前端和後端
   - 訪問 `http://localhost:5173` 進入系統

2. **登入**
   - 如果是首次使用，需要先創建會員
   - 使用已有的會員帳號密碼登入

3. **會員管理**
   - 登入後進入會員管理頁面
   - 可以新增、編輯、刪除會員
   - 點擊「編輯」按鈕修改會員信息
   - 點擊「刪除」按鈕刪除會員

4. **登出**
   - 點擊右上角「登出」按鈕
   - 會話將被清除，重定向至登入頁

## 數據庫架構

### Members 表
```sql
CREATE TABLE members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Sessions 表
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  member_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
);
```

## 開發說明

### 前端開發
- 使用 Vite 作為開發服務器（HMR 支持）
- TypeScript 提供類型安全
- 組件存放在 `src/pages` 和 `src/components`

### 後端開發
- 使用 ts-node 開發環境
- 支持熱重載
- 運行 `yarn dev` 啟動開發服務器

## 常見問題

### SQLite3 編譯錯誤
如果遇到 SQLite3 原生模塊編譯錯誤，確保已安裝 Python 和 Visual C++ 編譯工具。

### CORS 錯誤
前端默認連接 `http://localhost:3001` 後端，確保後端正常運行。

### Session 失效
Session 默認 24 小時過期，登出時會立即清除。

## 許可證

MIT
