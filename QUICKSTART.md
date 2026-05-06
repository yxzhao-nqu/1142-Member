# 🚀 會員管理平台 - 快速啟動指南

## 📦 項目已完成

所有前端和後端代碼已完成構建，所有依賴已安裝，代碼已通過 TypeScript 編譯驗證。

## ⚡ 快速啟動

### 方案 1: 分別在兩個終端運行

**終端 1 - 啟動後端服務**
```bash
cd backend
yarn dev
```
✅ 後端運行在 `http://localhost:3001`

**終端 2 - 啟動前端開發服務**
```bash
cd frontend
yarn dev
```
✅ 前端運行在 `http://localhost:5173`

### 方案 2: 一個命令同時啟動（可選）

在項目根目錄創建 `start-all.ps1`：
```powershell
# 啟動後端和前端（Windows PowerShell）
Start-Process -FilePath "powershell" -ArgumentList "cd backend; yarn dev"
Start-Process -FilePath "powershell" -ArgumentList "cd frontend; yarn dev"
```

## 🎯 第一次使用步驟

1. **啟動系統**
   - 同時運行後端和前端
   - 打開瀏覽器訪問 `http://localhost:5173`

2. **首次登入**
   - 如果是首次使用，頁面會顯示登入窗口
   - 此時數據庫為空，需要先創建會員
   - 點擊「新增會員」創建第一個會員帳號

3. **創建測試會員**
   - 帳號：`admin`
   - 密碼：`123456`
   - 電話：`09123456789`
   - 年齡：`30`
   - 地址：`台北市`
   - 點擊「新增」按鈕

4. **登入系統**
   - 使用剛建立的帳號登入
   - 成功後進入會員管理頁面

5. **操作會員**
   - 新增更多會員
   - 編輯會員信息
   - 刪除不需要的會員

## 📁 項目結構

```
Member/
├── frontend/              # React + TypeScript
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx          # 登入頁面
│   │   │   ├── MemberManagement.tsx   # 會員管理頁面
│   │   │   └── ProtectedRoute.tsx     # 路由保護
│   │   ├── services/
│   │   │   └── api.ts                 # API 調用
│   │   ├── styles/
│   │   │   ├── LoginPage.css
│   │   │   └── MemberManagement.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── backend/               # Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts      # 認證邏輯
│   │   │   └── memberController.ts    # 會員邏輯
│   │   ├── middleware/
│   │   │   └── auth.ts                # Session 驗證
│   │   ├── routes/
│   │   │   ├── auth.ts                # 認證路由
│   │   │   └── members.ts             # 會員路由
│   │   ├── db/
│   │   │   ├── init.ts                # DB 初始化
│   │   │   └── service.ts             # DB 服務
│   │   └── app.ts                     # Express 應用
│   ├── db/
│   │   └── database.db                # SQLite 數據庫（自動生成）
│   ├── package.json
│   └── tsconfig.json
│
├── README.md              # 詳細文檔
└── QUICKSTART.md          # 本文件
```

## 🔌 API 端點

### 認證 API
- `POST /api/auth/login` - 登入
- `POST /api/auth/logout` - 登出  
- `GET /api/auth/check` - 檢查登入狀態

### 會員 API（需要登入）
- `GET /api/members` - 獲取所有會員
- `POST /api/members` - 新增會員
- `GET /api/members/:id` - 獲取單個會員
- `PUT /api/members/:id` - 修改會員
- `DELETE /api/members/:id` - 刪除會員

## 🛠️ 技術細節

### 前端
- **框架**: React 19 + TypeScript
- **路由**: React Router v7
- **HTTP**: Axios
- **構建**: Vite
- **支持特性**: Hot Module Replacement (HMR)

### 後端
- **框架**: Express + TypeScript
- **數據庫**: SQLite3
- **認證**: Session + HTTP-Only Cookies
- **密碼**: bcryptjs 加密
- **跨域**: CORS 配置

### 數據庫
- **引擎**: SQLite3
- **位置**: `backend/db/database.db`
- **表**: `members`, `sessions`

## 🔐 安全特性

✅ 密碼使用 bcryptjs 加密存儲（不能明文讀取）
✅ Session 基於 HTTP-Only Cookies（防止 XSS）
✅ CORS 配置限制跨域請求
✅ Session 自動 24 小時過期
✅ 前端登出立即清除 session

## ⚙️ 環境變量（可選）

創建 `backend/.env`：
```bash
PORT=3001
NODE_ENV=development
```

## 📝 常用命令

### 前端
```bash
cd frontend
yarn dev       # 開發模式（HMR）
yarn build     # 生產構建
yarn lint      # 代碼檢查
yarn preview   # 預覽生產構建
```

### 後端
```bash
cd backend
yarn dev       # 開發模式（ts-node）
yarn build     # 編譯 TypeScript
yarn start     # 運行編譯後的代碼
```

## 🐛 故障排除

### 問題：後端啟動失敗
**解決**: 確保 Python 已安裝（SQLite3 需要編譯）

### 問題：前端無法連接後端
**解決**: 檢查後端是否運行在 `http://localhost:3001`

### 問題：登入失敗
**解決**: 確保已創建會員，檢查帳號密碼是否正確

### 問題：修改會員時出錯
**解決**: 檢查新帳號是否已被其他會員使用

## 📞 支持

如遇到問題，請檢查：
1. 前後端是否同時運行
2. 瀏覽器控制台是否有錯誤信息
3. 後端終端是否有錯誤日誌
4. 數據庫文件是否存在（自動生成）

## ✨ 功能檢查清單

- [x] 會員登入（帳號/密碼）
- [x] Session 管理（24小時過期）
- [x] 會員新增
- [x] 會員列表顯示
- [x] 會員修改
- [x] 會員刪除
- [x] 會員登出
- [x] 路由保護（未登入重定向）
- [x] SQLite 數據持久化
- [x] 密碼加密存儲
- [x] TypeScript 類型安全
- [x] CORS 跨域支持

---

**祝你使用愉快！🎉**
