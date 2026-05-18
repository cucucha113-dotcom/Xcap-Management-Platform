# Quản lý Tài sản Đa Nền Tảng — System Diagram

> Module mới cho XCAP Management Platform
> Lấy cảm hứng từ SMIT Agency, mở rộng cho 6 nền tảng

---

## 1. TỔNG QUAN MODULE

```
┌─────────────────────────────────────────────────────────────────┐
│              QUẢN LÝ TÀI SẢN ĐA NỀN TẢNG                      │
│                                                                 │
│  ┌───────────────┐ ┌───────────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Tab 1         │ │ Tab 2         │ │ Tab 3    │ │ Tab 4   │ │
│  │ BROWSER       │ │ TÀI KHOẢN    │ │ PAGES &  │ │ BUSINESS│ │
│  │ PROFILES      │ │ QUẢNG CÁO    │ │ SHOPS    │ │ MANAGERS│ │
│  │               │ │               │ │          │ │         │ │
│  │ = VIA (SMIT)  │ │ FB + GG + TT  │ │ Shopee   │ │ BM      │ │
│  │ = Identity    │ │ Ads accounts  │ │ Lazada   │ │ MCC     │ │
│  │   trình duyệt │ │               │ │ TT Shop  │ │ BC      │ │
│  └───────┬───────┘ └───────┬───────┘ └────┬─────┘ └────┬────┘ │
│          │    Cross-filter  │              │            │       │
│          └──────────────────┴──────────────┴────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. NGUỒN KẾT NỐI THEO NỀN TẢNG

```
┌─────────────────────────────────────────────────────────────┐
│                    PHƯƠNG THỨC KẾT NỐI                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  FACEBOOK                                           │    │
│  │  ├── Kết nối cơ bản: ixBrowser Extension (scrape)  │    │
│  │  │   → Campaigns, spend, CPM, CTR, CPA             │    │
│  │  └── Kết nối nâng cao: Extension (billing page)    │    │
│  │      → Invoices, payments, threshold, billing       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  GOOGLE ADS                                         │    │
│  │  └── API chính thức: Google Ads API (OAuth 2.0)    │    │
│  │      → Campaigns, spend, conversions, billing       │    │
│  │      → MCC hierarchy, budget, change history        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  TIKTOK ADS                                         │    │
│  │  └── API chính thức: TikTok Marketing API (OAuth)  │    │
│  │      → Campaigns, spend, conversions, billing       │    │
│  │      → Business Center, Advertiser accounts         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  SHOPEE / LAZADA / TIKTOK SHOP                      │    │
│  │  └── ixBrowser Extension (scrape seller center)    │    │
│  │      → Shop info, products, orders, revenue         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. DATA FLOW — ĐỒNG BỘ TÀI SẢN

```
  ixBrowser Profile (NV)          Google/TikTok API           xcapwallet.com
  ┌───────────────────┐           ┌──────────────┐           ┌───────────────┐
  │ Extension modules │           │ OAuth Token  │           │ Card + Txn    │
  │                   │           │ Service      │           │ Sync Service  │
  │ [FB Collector]    │           │              │           │               │
  │ [Shopee Scraper]  │           │ [GG Ads API] │           │               │
  │ [Lazada Scraper]  │           │ [TT Mkt API] │           │               │
  │ [TT Shop Scraper] │           │              │           │               │
  └─────────┬─────────┘           └──────┬───────┘           └───────┬───────┘
            │                            │                           │
            ▼                            ▼                           ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                        XCAP BACKEND (Node.js)                          │
  │                                                                        │
  │  ┌──────────────┐  ┌───────────────┐  ┌────────────────────────────┐  │
  │  │ Asset Sync   │  │ API Gateway   │  │ Reconciliation Engine     │  │
  │  │ Service      │  │ (GG + TT)     │  │ (Invoice ↔ Transaction)   │  │
  │  │              │  │               │  │                            │  │
  │  │ Upsert       │  │ Token refresh │  │ Auto-match                │  │
  │  │ Dedup        │  │ Rate limiting │  │ Cross-platform            │  │
  │  │ Health check │  │ Data normalize│  │                            │  │
  │  └──────┬───────┘  └──────┬────────┘  └─────────────┬──────────────┘  │
  │         │                 │                          │                  │
  │         ▼                 ▼                          ▼                  │
  │  ┌─────────────────────────────────────────────────────────────────┐   │
  │  │                    MongoDB (Asset Collections)                   │   │
  │  │                                                                  │   │
  │  │  browser_profiles    ad_accounts      pages_shops               │   │
  │  │  business_managers   asset_tags       asset_blacklist            │   │
  │  │  sync_logs           health_alerts    api_tokens                 │   │
  │  └─────────────────────────────────────────────────────────────────┘   │
  └────────────────────────────────────────────────────────────────────────┘
```

---

## 4. DATA SCHEMA

### 4.1 Browser Profile (Tab 1)
```javascript
{
  _id: ObjectId,
  profileId: "PRF-001",           // ixBrowser ID
  name: "Đạt_FB_Main",           // Tên gợi nhớ (editable)
  employeeId: "XBK-001",         // Link → Employee
  projectId: "DA-001",           // Link → Dự án
  companyId: "XBK",              // Multi-company

  // ixBrowser metadata
  os: "Windows 11",
  browser: "Chrome 124",
  proxy: { ip: "103.152.xx.41", port: 8080, country: "VN" },
  fingerprint: "FP-8a2f4d",
  status: "running",             // running | idle | stopped

  // Platforms detected
  platforms: {
    facebook: { connected: true, viaId: "100xxx", viaName: "Nguyễn Đạt" },
    google:   { connected: true, email: "dat@xbk.com" },
    tiktok:   { connected: false },
    shopee:   { connected: true, shopId: "xxx" },
    lazada:   { connected: false },
    tiktokShop: { connected: false }
  },

  // Connection status
  basicConnection: true,          // Extension cài & đang sync
  advancedConnection: true,       // Extension đang pull billing

  // Stats
  adAccountCount: 3,
  sessionTime: "3h 24m",
  pagesVisited: 42,
  lastActive: ISODate,

  // Tags
  personalTags: ["main", "biocare"],
  orgTags: ["DA1", "team-lead"],

  createdAt: ISODate,
  syncedBy: "XBK-001"
}
```

### 4.2 Ad Account (Tab 2)
```javascript
{
  _id: ObjectId,
  platform: "facebook",          // facebook | google | tiktok
  accountId: "act_1162586225600942",
  name: "DA1_Biocare_Main",
  status: "Active",              // Active | Disabled | Suspended | Unsettled

  // Platform-specific
  accountType: "business",       // personal | business (FB: BM, GG: MCC, TT: BC)
  businessId: "BM-xxx",         // BM / MCC / BC ID
  businessName: "XBK Media",

  // Financial
  totalSpend: 15420.50,
  currency: "USD",
  billingThreshold: 250,
  dailyLimit: 500,
  balance: 42.30,

  // Metadata
  timezone: "Asia/Ho_Chi_Minh",
  createdAt: ISODate,

  // XCAP links
  profileId: "PRF-001",         // Link → Browser Profile
  employeeId: "XBK-001",
  projectId: "DA-001",
  companyId: "XBK",

  // Tags + management
  personalTags: [],
  orgTags: ["biocare", "DA1"],
  basicConnection: true,
  advancedConnection: true,
  isBlacklisted: false,
  deletedAt: null,               // Soft-delete (thùng rác 30 ngày)

  // Sync
  lastSyncAt: ISODate,
  syncSource: "extension",       // extension | api
  syncedBy: "XBK-001"
}
```

### 4.3 Page / Shop (Tab 3)
```javascript
{
  _id: ObjectId,
  platform: "shopee",           // facebook | shopee | lazada | tiktokShop
  type: "shop",                 // fanpage | shop
  assetId: "shop_xxx",
  name: "XBK Biocare Official",
  url: "https://shopee.ph/xbkbiocare",

  // Stats (platform-dependent)
  followers: 12500,
  products: 48,
  rating: 4.8,
  totalOrders: 3200,
  revenue: 125000,

  // XCAP links
  profileId: "PRF-004",
  employeeId: "XBK-003",
  linkedAdAccounts: ["act_xxx"],
  projectId: "DA-002",

  orgTags: ["DA2", "fashion"],
  lastSyncAt: ISODate
}
```

### 4.4 Business Manager (Tab 4)
```javascript
{
  _id: ObjectId,
  platform: "facebook",        // facebook | google | tiktok
  type: "BM",                  // BM | MCC | BC
  managerId: "BM-12345",
  name: "XBK Media Agency",
  status: "Active",
  adAccountCount: 12,
  totalSpend: 45200.00,
  currency: "USD",
  linkedProfiles: ["PRF-001", "PRF-003"],
  companyId: "XBK",
  lastSyncAt: ISODate
}
```

---

## 5. CÔNG CỤ QUẢN LÝ

```
┌──────────────────────────────────────────────────────────────┐
│                    THANH CÔNG CỤ BẢNG DỮ LIỆU               │
│                                                              │
│  [🔍 Bộ lọc] [🏷️ Gắn Tag] [💱 Quy đổi] [📥 Export]       │
│  [📝 Chuẩn hóa tên] [⚙️ Tùy chỉnh cột]                   │
│  [🗑️ Thùng rác] [⛔ Danh sách đen] [🏥 Health Check]      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Chuẩn hóa tên (Batch rename)                          │  │
│  │                                                        │  │
│  │ Template: {Platform}_{Project}_{NV}_{Index}            │  │
│  │ Preview:  FB_DA1_Đạt_001, FB_DA1_Đạt_002             │  │
│  │           GG_DA2_Hùng_001                              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Health Check — Tự động cảnh báo                       │  │
│  │                                                        │  │
│  │ 🔴 TKQC bị Disabled      → Notify NV + Team Lead     │  │
│  │ 🟡 TKQC Unsettled        → Notify Kế toán            │  │
│  │ 🟡 Billing gần ngưỡng    → Notify NV                 │  │
│  │ 🔴 Profile disconnected  → Notify Admin              │  │
│  │ 🟡 Extension offline >1h → Notify NV                 │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. API INTEGRATION — GOOGLE & TIKTOK

### Google Ads API Flow
```
NV đăng ký OAuth → XCAP Backend lưu refresh_token
                          │
                   ┌──────▼──────┐
                   │ Cron 30min  │
                   │             │
                   │ 1. Refresh access_token
                   │ 2. GET /customers/{id}/campaigns
                   │ 3. GET /customers/{id}/billing
                   │ 4. Normalize → MongoDB
                   └─────────────┘

Scopes cần thiết:
- adwords (campaigns, ad groups, ads, metrics)
- billing (invoices, payments, budgets)
```

### TikTok Marketing API Flow
```
NV đăng ký OAuth → XCAP Backend lưu access_token
                          │
                   ┌──────▼──────┐
                   │ Cron 30min  │
                   │             │
                   │ 1. GET /advertiser/info
                   │ 2. GET /campaign/get
                   │ 3. GET /report/integrated/get
                   │ 4. Normalize → MongoDB
                   └─────────────┘

Scopes cần thiết:
- advertiser_management
- campaign_management  
- report_read
```

---

## 7. SO SÁNH SMIT vs XCAP (FINAL)

| Tính năng | SMIT | XCAP |
|---|---|---|
| Nền tảng | Facebook only | FB + GG (API) + TT (API) + 3 e-com (Extension) |
| Đơn vị quản lý | VIA (FB account) | ixBrowser Profile (multi-platform identity) |
| Kết nối cơ bản | Facebook OAuth | Extension (FB) + API OAuth (GG, TT) |
| Kết nối nâng cao | SMIT Connect Extension | ixBrowser Extension (billing scrape) |
| Tab 1 | VIA | Browser Profiles |
| Tab 2 | TKQC (FB only) | TKQC đa nền tảng (FB + GG + TT) |
| Tab 3 | Fanpage | Pages & Shops (FB + Shopee + Lazada + TT Shop) |
| Tab 4 | ❌ | Business Managers (BM + MCC + BC) |
| Tag | ✅ Cá nhân + DN | ✅ Cá nhân + DN + Auto-tag by project |
| Health Check | ❌ | ✅ Tự động cảnh báo TK lỗi |
| Finance link | Hóa đơn + Thẻ | + xcapwallet.com + Recon Engine |
| Scale | ~100 TKQC | 10K-15K profiles, ~30K TKQC |
