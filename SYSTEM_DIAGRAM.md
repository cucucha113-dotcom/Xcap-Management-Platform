# Xcap Management Platform — System Diagram & Data Flow

> v2 + kiến trúc v3: Marketing Module trước, sẵn sàng mở rộng đa phòng ban

---

## 1. TỔNG QUAN HỆ THỐNG

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    XCAP MANAGEMENT PLATFORM                             │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │ CORE PLATFORM (dùng chung)                                       │    │
│  │                                                                   │    │
│  │  Auth & RBAC ─── Employee Directory ─── Org Structure             │    │
│  │  Browser Tracking ─── ixBrowser Profiles ─── Notifications        │    │
│  │  Reports Engine ─── Audit Logs ─── File Storage                   │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌───────────┐ ┌───────────┐         │
│  │  MARKETING   │ │   FINANCE    │ │    HR     │ │ OPERATIONS│         │
│  │  Module      │ │   Module     │ │  Module   │ │  Module   │         │
│  │              │ │              │ │           │ │           │         │
│  │  ✅ v2 NOW   │ │  ✅ v2 NOW   │ │  ⏳ v3    │ │  ⏳ v3    │         │
│  │  (full)      │ │  (invoice    │ │  (later)  │ │  (later)  │         │
│  │              │ │   recon)     │ │           │ │           │         │
│  └──────────────┘ └──────────────┘ └───────────┘ └───────────┘         │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. KIẾN TRÚC MODULE (v2 + sẵn sàng v3)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     5000 NHÂN VIÊN × ixBrowser                           │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │ ixBrowser Profile (cài sẵn Extension)                          │      │
│  │                                                                │      │
│  │  ┌─────────────────────────────────────────────────────┐       │      │
│  │  │ Extension Modules:                                   │       │      │
│  │  │  [1] Platform Collectors (6 ads/ecom platforms)      │       │      │
│  │  │  [2] Browser Tracker (history, activity, domains)    │       │      │
│  │  │  [3] Data Sync (batch send, offline buffer)          │       │      │
│  │  └─────────────────────────────────────────────────────┘       │      │
│  └────────────────────────────────────────────────────────────────┘      │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     BACKEND SERVER (Node.js)                             │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │ CORE (dùng chung cho tất cả modules)                              │    │
│  │                                                                   │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │    │
│  │  │ Auth     │ │ Employee │ │ Browser  │ │ Notif.   │            │    │
│  │  │ & RBAC   │ │ Directory│ │ Tracking │ │ System   │            │    │
│  │  │          │ │ & Org    │ │          │ │          │            │    │
│  │  │ • JWT    │ │ • CRUD   │ │ • History│ │ • In-app │            │    │
│  │  │ • Roles  │ │ • Depts  │ │ • Session│ │ • Telegram│           │    │
│  │  │ • Perms  │ │ • Teams  │ │ • Domain │ │ • Email  │            │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌───────────────────────────────┐ ┌────────────────────────────────┐    │
│  │ MODULE: MARKETING (v2)        │ │ MODULE: FINANCE (v2)           │    │
│  │                               │ │                                │    │
│  │  ┌─────────┐ ┌─────────┐     │ │  ┌─────────┐ ┌─────────┐      │    │
│  │  │ Ads     │ │ Shops   │     │ │  │ Invoice │ │ Cards   │      │    │
│  │  │ 6 Plat. │ │ Mgmt    │     │ │  │ Recon   │ │ & Banks │      │    │
│  │  └─────────┘ └─────────┘     │ │  └─────────┘ └─────────┘      │    │
│  │  ┌─────────┐ ┌─────────┐     │ │  ┌─────────┐ ┌─────────┐      │    │
│  │  │Creative │ │Performnc│     │ │  │ Holds   │ │ Transact│      │    │
│  │  │ Library │ │ Ranking │     │ │  │ Tracking│ │ Match   │      │    │
│  │  └─────────┘ └─────────┘     │ │  └─────────┘ └─────────┘      │    │
│  └───────────────────────────────┘ └────────────────────────────────┘    │
│                                                                          │
│  ┌───────────────────────────────┐ ┌────────────────────────────────┐    │
│  │ MODULE: HR (v3 — thêm sau)   │ │ MODULE: OPS (v3 — thêm sau)   │    │
│  │  ⏳ Chấm công, nghỉ phép     │ │  ⏳ Đơn hàng, kho, vận chuyển  │    │
│  │  ⏳ KPI, tuyển dụng, đào tạo  │ │  ⏳ CSKH, supplier, QC         │    │
│  └───────────────────────────────┘ └────────────────────────────────┘    │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │ DATABASE: MongoDB                                                 │    │
│  │                                                                   │    │
│  │ CORE:  employees, departments, teams, roles, audit_logs,         │    │
│  │        browser_profiles, browsing_history, activity_sessions      │    │
│  │                                                                   │    │
│  │ MARKETING: ad_accounts, campaigns, creatives, daily_metrics,     │    │
│  │            shops                                                  │    │
│  │                                                                   │    │
│  │ FINANCE: payment_cards, payment_transactions, platform_invoices, │    │
│  │          hold_tracking, bank_accounts                             │    │
│  │                                                                   │    │
│  │ HR (v3): attendance, leave_requests, kpi_reviews                 │    │
│  │ OPS (v3): orders, inventory, shipments, support_tickets          │    │
│  └──────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     REACT DASHBOARD                                      │
│                                                                          │
│  SIDEBAR:                                                                │
│  ┌────────────┐  ┌─────────────────────────────────────────────────┐     │
│  │ CORE       │  │                                                 │     │
│  │ ──────     │  │  Nội dung thay đổi theo module được chọn        │     │
│  │ 📊 Overview│  │                                                 │     │
│  │ 👥 NV      │  │  Marketing: spend, ROAS, creatives, shops      │     │
│  │ 🌐 Profiles│  │  Finance: transactions, invoices, holds         │     │
│  │            │  │  HR (v3): attendance, leave, KPI                │     │
│  │ MARKETING │  │  Ops (v3): orders, inventory, shipping          │     │
│  │ ──────     │  │                                                 │     │
│  │ 💰 Spend   │  │                                                 │     │
│  │ 🎨 Creative│  │                                                 │     │
│  │ 📈 Perf    │  │                                                 │     │
│  │ 🏪 Shops   │  │                                                 │     │
│  │            │  │                                                 │     │
│  │ FINANCE   │  │                                                 │     │
│  │ ──────     │  │                                                 │     │
│  │ 🧾 Recon   │  │                                                 │     │
│  │ 💳 Cards   │  │                                                 │     │
│  │            │  │                                                 │     │
│  │ ⚙️ Settings│  │                                                 │     │
│  └────────────┘  └─────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. DATA FLOW

### 3.1 NV đăng nhập & làm việc

```
NV mở ixBrowser → chọn profile → Extension kích hoạt
    │
    ├──► Auth: JWT token verify với server
    ├──► Browser Tracker: bắt đầu phiên làm việc
    │
    ▼
NV mở Facebook Ads Manager
    │
    ├──► facebook-collector: thu thập campaigns, spend, creatives
    ├──► browser-tracker: ghi nhận URL, thời gian trên trang
    ├──► data-sync: batch gửi về server mỗi 30s
    │
    ▼
Server nhận data
    │
    ├──► Core: cập nhật employee lastSeen, activity_session
    ├──► Marketing module: lưu campaigns, metrics vào MongoDB
    ├──► WebSocket: đẩy update tới Dashboard admin
    │
    ▼
Admin xem Dashboard
    ├──► Overview: thấy NV A vừa submit data, spend tăng
    ├──► Marketing > Spend: biểu đồ cập nhật realtime
    └──► Core > Employees: NV A status "Online", active 3h
```

### 3.2 Invoice Reconciliation Flow

```
Admin import giao dịch (từ Xcap/bank CSV)
    │
    ├──► Finance module: lưu payment_transactions
    │
    ▼
Admin import hóa đơn (từ FB/Google/TikTok)
    │
    ├──► Finance module: lưu platform_invoices
    │
    ▼
Server auto-match
    │
    ├──► So khớp: transaction.reference ←→ invoice.ref
    ├──► So khớp: card.last4 + amount + date
    ├──► Liên kết: card → employee → ad_account → campaign
    │
    ▼
Dashboard Finance > Recon
    ├──► Matched: 85% ✅
    ├──► Partial: 8% ⚠️ (cần review)
    ├──► Unmatched: 5% ❌
    └──► Orphan: 2% 👻
```

### 3.3 Phân quyền theo Role

```
ROLE                    THẤY GÌ
────                    ────────
Super Admin (CEO)       Tất cả modules, tất cả data
Marketing Manager       Marketing module + NV trong phòng mình
Marketer                Chỉ data của chính mình
Finance Manager         Finance module (invoice recon, cards)
Accountant              Chỉ data tài chính được gán
HR Manager (v3)         HR module
Ops Manager (v3)        Operations module
```

---

## 4. CẤU TRÚC CODE (module-based)

```
xcap-management-platform/
│
├── server/
│   ├── index.js                      ← Entry point
│   ├── config/
│   │   ├── database.js               ← MongoDB connection
│   │   └── redis.js                  ← Redis connection
│   │
│   ├── core/                         ← CORE (dùng chung)
│   │   ├── auth/
│   │   │   ├── auth.routes.js        ← Login, refresh, logout
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.middleware.js    ← JWT verify, requireRole
│   │   │   └── auth.model.js
│   │   ├── employees/
│   │   │   ├── employee.routes.js    ← CRUD employees
│   │   │   ├── employee.controller.js
│   │   │   └── employee.model.js
│   │   ├── departments/
│   │   │   ├── department.routes.js
│   │   │   └── department.model.js
│   │   ├── browser-tracking/
│   │   │   ├── tracking.routes.js    ← Submit history, sessions
│   │   │   ├── tracking.controller.js
│   │   │   ├── browsing-history.model.js
│   │   │   └── activity-session.model.js
│   │   ├── browser-profiles/
│   │   │   ├── profile.routes.js     ← ixBrowser management
│   │   │   └── profile.model.js
│   │   └── notifications/
│   │       ├── notification.routes.js
│   │       └── telegram.service.js
│   │
│   ├── modules/                      ← MODULES (theo phòng ban)
│   │   ├── marketing/
│   │   │   ├── ad-accounts/
│   │   │   │   ├── account.routes.js
│   │   │   │   └── account.model.js
│   │   │   ├── campaigns/
│   │   │   │   ├── campaign.routes.js
│   │   │   │   └── campaign.model.js
│   │   │   ├── creatives/
│   │   │   │   ├── creative.routes.js
│   │   │   │   └── creative.model.js
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.routes.js
│   │   │   │   └── daily-metrics.model.js
│   │   │   ├── shops/
│   │   │   │   ├── shop.routes.js
│   │   │   │   └── shop.model.js
│   │   │   └── index.js             ← Marketing module entry
│   │   │
│   │   ├── finance/
│   │   │   ├── cards/
│   │   │   │   ├── card.routes.js
│   │   │   │   └── card.model.js
│   │   │   ├── transactions/
│   │   │   │   ├── transaction.routes.js
│   │   │   │   └── transaction.model.js
│   │   │   ├── invoices/
│   │   │   │   ├── invoice.routes.js
│   │   │   │   └── invoice.model.js
│   │   │   ├── reconciliation/
│   │   │   │   ├── recon.routes.js
│   │   │   │   └── recon.service.js
│   │   │   ├── holds/
│   │   │   │   ├── hold.routes.js
│   │   │   │   └── hold.model.js
│   │   │   └── index.js             ← Finance module entry
│   │   │
│   │   ├── hr/                       ← v3 (thư mục rỗng, thêm sau)
│   │   │   └── index.js             ← Placeholder
│   │   │
│   │   └── operations/               ← v3 (thư mục rỗng, thêm sau)
│   │       └── index.js             ← Placeholder
│   │
│   └── shared/
│       ├── helpers.js
│       ├── logger.js
│       └── validators.js
│
├── dashboard/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                   ← Router + module loader
│       ├── index.css
│       │
│       ├── core/                     ← CORE components
│       │   ├── Layout.jsx            ← Sidebar + main area
│       │   ├── Sidebar.jsx           ← Module-aware navigation
│       │   ├── AuthProvider.jsx      ← Login state
│       │   └── pages/
│       │       ├── LoginPage.jsx
│       │       ├── OverviewPage.jsx
│       │       ├── EmployeesPage.jsx
│       │       ├── EmployeeDetailPage.jsx
│       │       └── ProfilesPage.jsx
│       │
│       ├── modules/
│       │   ├── marketing/
│       │   │   ├── SpendPage.jsx
│       │   │   ├── CreativesPage.jsx
│       │   │   ├── PerformancePage.jsx
│       │   │   └── ShopsPage.jsx
│       │   │
│       │   ├── finance/
│       │   │   ├── ReconDashboard.jsx
│       │   │   ├── TransactionsPage.jsx
│       │   │   ├── InvoicesPage.jsx
│       │   │   ├── CardsPage.jsx
│       │   │   └── HoldsPage.jsx
│       │   │
│       │   ├── hr/                   ← v3 placeholder
│       │   └── operations/           ← v3 placeholder
│       │
│       ├── services/
│       │   └── api.js
│       │
│       └── shared/
│           ├── StatCard.jsx
│           ├── DataTable.jsx
│           ├── Chart.jsx
│           └── FilterBar.jsx
│
└── extension/                        ← Chrome Extension
    ├── manifest.json
    ├── background/service-worker.js
    ├── content-scripts/
    │   ├── facebook-collector.js
    │   ├── google-collector.js
    │   ├── tiktok-ads-collector.js
    │   ├── tiktok-shop-collector.js
    │   ├── shopee-collector.js
    │   ├── lazada-collector.js
    │   └── browser-tracker.js
    └── popup/
```

---

## 5. 6 PLATFORMS

```
Platform              Dữ liệu              Phương pháp
─────────────────     ──────────────────    ─────────────────
Facebook Ads          Campaigns, Spend,     Marketing API
                      Creatives, ROAS       + Extension overlay

Google Ads            Campaigns, Spend,     Ads API
                      Keywords, QS          + Extension overlay

TikTok Ads            Campaigns, Spend,     Marketing API
                      Creatives, ROAS       + Extension overlay

TikTok Shop           Orders, Revenue,      Extension
                      Products, Ratings     (scrape DOM)

Shopee Seller Ctr     Orders, Revenue,      Extension
                      Ads, Products         (scrape DOM)

Lazada Seller Ctr     Orders, Revenue,      Extension
                      Ads, Products         (scrape DOM)
```

---

## 6. TECH STACK

```
Layer            Công nghệ                   Vai trò
─────────────    ─────────────────────────    ──────────────────
Browser          ixBrowser (anti-detect)      Trình duyệt công ty
Extension        Chrome Manifest V3, JS       Thu thập + tracking
Backend API      Node.js + Express            REST API (modular)
Realtime         Socket.IO                    Push updates
Database         MongoDB (Time-Series)        Lưu trữ chính
Cache/Queue      Redis + BullMQ              Cache, jobs, pub/sub
Dashboard        React + Vite + Recharts      Giao diện admin
Auth             JWT + bcrypt + RBAC          Multi-role access
ixBrowser API    REST (Local API)             Quản lý profiles
Alerts           Telegram Bot API             Cảnh báo
```
