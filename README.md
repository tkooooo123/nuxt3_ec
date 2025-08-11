# 🍞 Bakery ｜烘培電商平台

Bakery 是一個以烘培食品為主的電商平台，使用 **Nuxt 3** 建構，包含前台購物流程與後台管理系統。
支援商品瀏覽、購物車、結帳流程與後台商品管理、訂單管理功能，並於前台和後台登入頁實作響應式設計。

👉 [🔗 前台線上 Demo](https://nuxt3-ec-six.vercel.app/)

👉 [🔗 後台線上 Demo](https://nuxt3-ec-six.vercel.app/login) (後台建議使用裝置解析度寬 1440px 以上)

---

## 🛠️ 技術架構

### 🔸 前端技術

- **框架**: Nuxt 3 (Vue 3)
- **狀態管理**: Pinia
- **UI 框架**: Element Plus
- **樣式**: UnoCSS + Sass
- **輪播**: Swiper
- **通知**: Vue3 Toastify

### 🔸 後端技術

- **資料庫**: MongoDB (Mongoose)
- **認證**: JWT + bcrypt
- **檔案上傳**: Cloudinary
- **金流**: ECPay 綠界支付

### 🔸 開發工具

- **語言**: TypeScript
- **自動導入**: unplugin-auto-import
- **組件自動導入**: unplugin-vue-components
- **SEO**: @nuxtjs/sitemap
- **開發環境**: ngrok

---

## 🔐 測試帳號

### 前台登入

```txt
測試帳號：user1@gmail.com
測試密碼：12345678
```

### 後台登入

```txt
測試帳號：admin@gmail.com
測試密碼：12345678
```

---

## ✨ 功能介紹

### 🔸 前台功能

- **首頁**: 商品展示、輪播圖、熱門商品
- **商品管理**:
  - 商品列表與詳細頁面
  - 商品分類篩選（全部、新品報到、冠軍排行、限時搶購）
  - 商品關鍵字搜尋
- **購物車**: 加入購物車、修改數量、刪除商品
- **結帳流程**: 購物車填寫表單、ECPay 金流整合
- **會員系統**: 註冊、登入、訂單查詢
- **響應式設計**: 支援各種裝置尺寸

### 🔸 後台功能（Admin）

- **管理者登入**: JWT 認證系統
- **分類管理**: 新增、編輯、刪除、查看分類
- **商品管理**: 新增、編輯、刪除、查看商品，支援圖片上傳
- **訂單管理**: 查看訂單、編輯狀態、刪除訂單
- **使用者管理**: 查看會員資料

---

## 📁 專案結構

```
nuxt3_ec/
├── components/          # Vue 組件
│   ├── admin/          # 後台組件
│   ├── front/          # 前台組件
│   └── home/           # 首頁組件
├── pages/              # 頁面路由
│   ├── admin/          # 後台頁面
│   ├── product/        # 商品相關頁面
│   └── createOrderSuccess/ # 訂單成功頁面
├── server/             # 後端 API
│   ├── api/            # API 路由
│   ├── models/         # MongoDB 模型
│   ├── utils/          # 工具函數
│   └── seed/           # 資料庫種子資料
├── stores/             # Pinia 狀態管理
├── composables/        # 組合式函數
├── middleware/         # 路由中間件
├── layouts/            # 頁面佈局
├── assets/             # 靜態資源
├── public/             # 公開檔案
└── plugins/            # Nuxt 插件
```

---

## 🚀 快速開始

### 環境需求

- Node.js 18+
- MongoDB

### 安裝依賴

```bash
npm install
```

### 環境變數設定

建立 `.env` 檔案並設定以下變數：

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset

# ECPay
ECPAY_MERCHANT_ID=your_ecpay_merchant_id
ECPAY_HASH_KEY=your_ecpay_hash_key
ECPAY_HASH_IV=your_ecpay_hash_iv

# Ngrok (開發用)
NGROK_AUTHTOKEN=your_ngrok_auth_token

# 網站 URL
SITE_URL=https://your-domain.com
```

### 開發模式

```bash
npm run dev
```

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

---

## 📝 開發筆記

### 主要特色

- 使用 Nuxt 3 的 SSR/SSG 特性提升 SEO 表現
- 整合 Element Plus 提供完整的 UI 組件
- 使用 UnoCSS 實現原子化 CSS
- 完整的 TypeScript 支援
- 自動導入功能減少重複的 import 語句
- 整合 ECPay 金流系統
- 使用 Cloudinary 進行圖片管理

### 資料庫模型

- **User**: 使用者資料
- **Product**: 商品資料
- **Category**: 商品分類
- **Order**: 訂單資料
- **Cart**: 購物車資料

---

## 📄 授權

此專案僅供學習使用。
