# Quản lý Tài sản Đa Nền Tảng v2 — Phân luồng Ngoại sàn / Nội sàn

> Thiết kế phân tách 2 hệ kênh chuyên môn, tránh chồng chéo tài sản & nhân sự

---

## 1. TỔNG QUAN 2 LUỒNG DỰ ÁN

```
┌────────────────────────────────────────────────────────────────────────┐
│                     XCAP MANAGEMENT PLATFORM                          │
│                                                                        │
│  ┌─────────────────────────────┐  ┌──────────────────────────────┐    │
│  │     🌐 NGOẠI SÀN            │  │      🏪 NỘI SÀN              │    │
│  │     (Off-Platform Ads)      │  │      (On-Platform E-com)     │    │
│  │                             │  │                              │    │
│  │  Kênh:                      │  │  Kênh:                       │    │
│  │  ├── Facebook Ads           │  │  ├── TikTok Shop             │    │
│  │  ├── Google Ads             │  │  ├── Shopee                  │    │
│  │  └── TikTok Ads             │  │  └── Lazada                  │    │
│  │                             │  │                              │    │
│  │  Nhân sự:                   │  │  Nhân sự:                    │    │
│  │  ├── Media Buyer            │  │  ├── Shop Operator           │    │
│  │  ├── Campaign Manager       │  │  ├── Listing Specialist      │    │
│  │  └── Creative Specialist    │  │  └── E-com Marketer          │    │
│  │                             │  │                              │    │
│  │  Tài sản chính:             │  │  Tài sản chính:              │    │
│  │  ├── TKQC (Ad Accounts)     │  │  ├── Shop (Seller Account)   │    │
│  │  ├── BM / MCC / BC          │  │  ├── Products (Listings)     │    │
│  │  ├── Fanpage                │  │  ├── Orders                  │    │
│  │  └── Payment Cards          │  │  └── Voucher / Flash Sale    │    │
│  │                             │  │                              │    │
│  │  KPI:                       │  │  KPI:                        │    │
│  │  ├── CPA, ROAS, CTR        │  │  ├── GMV, Orders, Conv Rate  │    │
│  │  ├── Spend, Impressions    │  │  ├── Revenue, AOV            │    │
│  │  └── CPM, Frequency        │  │  └── Product Views, ATC      │    │
│  └─────────────────────────────┘  └──────────────────────────────┘    │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                    SHARED CORE LAYER                         │      │
│  │  Auth & RBAC │ Employee Dir │ Browser Profiles │ Finance     │      │
│  │  Audit Log │ Notifications │ Reports │ xcapwallet.com        │      │
│  └──────────────────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. SƠ ĐỒ TỔ CHỨC — PHÂN CHUYÊN MÔN

> **Quan trọng:** NV thuộc 1 luồng nhưng có thể triển khai **nhiều nền tảng**
> trong luồng đó. VD: 1 Media Buyer chạy cả FB + GG + TT Ads.

```
                        ┌──────────────┐
                        │  Tổng GĐ     │
                        │  (Company)   │
                        └──────┬───────┘
                               │
               ┌───────────────┼───────────────┐
               │                               │
      ┌────────▼────────┐            ┌─────────▼────────┐
      │  GĐ NGOẠI SÀN  │            │  GĐ NỘI SÀN     │
      │  (Dept Head)    │            │  (Dept Head)     │
      └────────┬────────┘            └─────────┬────────┘
               │                               │
     ┌─────────┼──────────┐         ┌──────────┼──────────┐
     │         │          │         │          │          │
  ┌──▼───┐  ┌──▼───┐  ┌──▼───┐  ┌──▼───┐  ┌──▼───┐  ┌──▼───┐
  │DA 1  │  │DA 2  │  │DA 3  │  │DA 4  │  │DA 5  │  │DA 6  │
  │Brand │  │Brand │  │Brand │  │Brand │  │Brand │  │Brand │
  │  A   │  │  B   │  │  C   │  │  D   │  │  E   │  │  F   │
  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘
     │         │         │         │         │         │
  ┌──▼────────────────────┐     ┌──▼────────────────────┐
  │  Media Buyer x11      │     │  Shop Operator x11    │
  │                       │     │                       │
  │  Mỗi NV có thể chạy: │     │  Mỗi NV có thể chạy: │
  │  ├── FB Ads ✅        │     │  ├── Shopee ✅        │
  │  ├── GG Ads ✅        │     │  ├── Lazada ✅        │
  │  └── TT Ads ✅        │     │  └── TT Shop ✅       │
  │                       │     │                       │
  │  Gán theo DỰ ÁN,     │     │  Gán theo DỰ ÁN,     │
  │  không gán theo       │     │  không gán theo       │
  │  nền tảng             │     │  nền tảng             │
  └───────────────────────┘     └───────────────────────┘
```

---

## 3. QUY TẮC PHÂN BỔ TÀI SẢN — CHỐNG CHỒNG CHÉO

### 3.1 Nguyên tắc cốt lõi

```
┌─────────────────────────────────────────────────────────────────┐
│                    5 QUY TẮC PHÂN BỔ                            │
│                                                                 │
│  1️⃣  MỖI BROWSER PROFILE thuộc ĐÚNG 1 LUỒNG                  │
│      → Profile Ngoại sàn KHÔNG được login shop e-com           │
│      → Profile Nội sàn KHÔNG được login ads manager            │
│                                                                 │
│  2️⃣  MỖI NHÂN VIÊN thuộc ĐÚNG 1 LUỒNG tại 1 thời điểm       │
│      → Nhưng có thể chạy NHIỀU NỀN TẢNG trong luồng đó       │
│      → VD: Media Buyer chạy cả FB + GG + TT Ads               │
│      → VD: Shop Operator quản cả Shopee + Lazada              │
│      → Chuyển luồng = chuyển dự án (có audit trail)            │
│                                                                 │
│  3️⃣  MỖI TKQC / SHOP chỉ gán cho 1 NV chính + 1 NV backup    │
│      → Tránh 2 người cùng thao tác 1 tài khoản                │
│                                                                 │
│  4️⃣  TÀI SẢN FINANCE theo luồng riêng                         │
│      → Card ngoại sàn: dùng cho FB/GG/TT Ads billing           │
│      → Card nội sàn: dùng cho top-up shop, ads trong sàn       │
│                                                                 │
│  5️⃣  BÁO CÁO & DASHBOARD tách theo luồng                      │
│      → GĐ Ngoại sàn chỉ thấy data ads                         │
│      → GĐ Nội sàn chỉ thấy data e-com                         │
│      → TGĐ thấy cả 2                                           │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Ma trận phân quyền tài sản

```
                         NGOẠI SÀN                    NỘI SÀN
                  ┌──────────────────────┐    ┌──────────────────────┐
  Tài sản         │  FB    GG    TT Ads  │    │  Shopee Lazada TTShop│
  ────────────────┼──────────────────────┼────┼──────────────────────┤
  Browser Profile │  ✅    ✅    ✅      │    │  ✅    ✅     ✅    │
  Ad Account      │  ✅    ✅    ✅      │    │  ❌    ❌     ❌    │
  Shop Account    │  ❌    ❌    ❌      │    │  ✅    ✅     ✅    │
  Fanpage         │  ✅    ❌    ❌      │    │  ❌    ❌     ❌    │
  BM / MCC / BC   │  ✅    ✅    ✅      │    │  ❌    ❌     ❌    │
  Payment Card    │  💳 Ads Cards        │    │  💳 E-com Cards      │
  ────────────────┼──────────────────────┼────┼──────────────────────┤
  NV Roles        │  Media Buyer         │    │  Shop Operator       │
                  │  Campaign Mgr        │    │  Listing Specialist  │
                  │  Creative Specialist │    │  E-com Marketer      │
  ────────────────┼──────────────────────┼────┼──────────────────────┤
  KPI Dashboard   │  CPA ROAS CTR CPM   │    │  GMV Orders Rev AOV  │
  ────────────────┼──────────────────────┼────┼──────────────────────┤
  Recon Engine    │  Ads Invoices ↔ Card │    │  Sàn Settlements ↔   │
                  │  Transactions        │    │  Bank Transfers      │
  └──────────────────────┘    └──────────────────────┘
```

---

## 4. LUỒNG PHÂN BỔ TÀI SẢN

### 4.1 Onboard nhân viên mới

```
                   ┌──────────────┐
                   │  NV mới      │
                   │  được tuyển   │
                   └──────┬───────┘
                          │
                   ┌──────▼───────┐
                   │ HR gán vào   │
                   │ Luồng nào?   │
                   └──────┬───────┘
                          │
              ┌───────────┼───────────┐
              │                       │
     ┌────────▼────────┐     ┌────────▼────────┐
     │  NGOẠI SÀN      │     │  NỘI SÀN        │
     │                  │     │                  │
     │ 1. Gán Role:     │     │ 1. Gán Role:     │
     │    Media Buyer   │     │    Shop Operator  │
     │                  │     │                  │
     │ 2. Tạo Profile   │     │ 2. Tạo Profile   │
     │    tag: ngoai_san│     │    tag: noi_san   │
     │                  │     │                  │
     │ 3. Gán TKQC:     │     │ 3. Gán Shop:      │
     │    FB/GG/TT acc  │     │    Shopee/Lazada/  │
     │                  │     │    TT Shop account │
     │ 4. Cấp thẻ:      │     │                  │
     │    Ads Card      │     │ 4. Cấp thẻ:       │
     │                  │     │    E-com Card     │
     │ 5. Dashboard:    │     │                  │
     │    Ads KPIs      │     │ 5. Dashboard:     │
     │                  │     │    E-com KPIs     │
     └──────────────────┘     └──────────────────┘
```

### 4.2 Giám sát & Phân quyền xem

```
┌────────────────────────────────────────────────────────────────┐
│                    DATA VISIBILITY MATRIX                       │
│                                                                │
│  Vai trò              │ Ngoại sàn │ Nội sàn │ Finance │ All   │
│  ──────────────────────┼───────────┼─────────┼─────────┼─────  │
│  TGĐ (CEO)            │    ✅     │   ✅    │   ✅    │  ✅   │
│  GĐ Ngoại sàn         │    ✅     │   ❌    │   🔵*   │  ❌   │
│  GĐ Nội sàn           │    ❌     │   ✅    │   🔵*   │  ❌   │
│  Team Lead (FB/GG/TT) │    🟡**   │   ❌    │   ❌    │  ❌   │
│  Team Lead (Shopee/..) │    ❌     │   🟡**  │   ❌    │  ❌   │
│  Media Buyer           │    🟢*** │   ❌    │   ❌    │  ❌   │
│  Shop Operator         │    ❌     │   🟢*** │   ❌    │  ❌   │
│  Kế toán               │    📊    │   📊    │   ✅    │  📊   │
│                                                                │
│  * 🔵 Chỉ thấy finance của luồng mình                         │
│  ** 🟡 Chỉ thấy data team mình quản lý                        │
│  *** 🟢 Chỉ thấy TKQC/Shop được gán cho mình                 │
│  📊 Chỉ thấy số liệu tổng hợp, không thấy chi tiết campaign  │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. KIẾN TRÚC TABS — REDESIGN THEO 2 LUỒNG

```
┌──────────────────────────────────────────────────────────────────┐
│  QUẢN LÝ TÀI SẢN                                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ SWITCH:  [ 🌐 Ngoại sàn ]  [ 🏪 Nội sàn ]  [ ALL* ]   │    │
│  └──────────────────────────────────────────────────────────┘    │
│  * ALL chỉ hiện cho TGĐ + Kế toán                               │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════  │
│  KHI CHỌN: 🌐 NGOẠI SÀN                                        │
│  ═══════════════════════════════════════════════════════════════  │
│                                                                  │
│  Tab 1: Browser Profiles (tag: ngoai_san)                        │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Profile | NV | Platforms [FB✅ GG✅ TT✅] | TKQC Count  │    │
│  │ Status | Extension | Session | Proxy | Tags             │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Tab 2: Tài khoản Quảng cáo                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Platform [FB|GG|TT] | TKQC ID | Tên | Status           │    │
│  │ Spend | Limit | Threshold | BM/MCC/BC | NV | Project    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Tab 3: Fanpages                                                 │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Page Name | Followers | Linked TKQC | NV quản lý        │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Tab 4: Business Managers (BM / MCC / BC)                        │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Platform | BM ID | Name | TKQC Count | Total Spend      │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════  │
│  KHI CHỌN: 🏪 NỘI SÀN                                          │
│  ═══════════════════════════════════════════════════════════════  │
│                                                                  │
│  Tab 1: Browser Profiles (tag: noi_san)                          │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Profile | NV | Platforms [Shopee✅ Lazada✅ TTShop✅]    │    │
│  │ Status | Extension | Session | Proxy | Tags             │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Tab 2: Shops (Seller Accounts)                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Platform [Shopee|Lazada|TTShop] | Shop Name | Status    │    │
│  │ Products | Orders | Revenue | Rating | NV | Project     │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Tab 3: Products & Listings                                      │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ SKU | Product Name | Shop | Price | Stock | Views | ATC │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Tab 4: In-platform Ads                                          │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Platform | Campaign | Budget | Spend | Orders | ROAS    │    │
│  │ (Shopee Ads, Lazada Sponsored, TT Shop Ads)             │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. VALIDATION — HỆ THỐNG CHỐNG CHỒNG CHÉO

```
┌──────────────────────────────────────────────────────────────┐
│              ENFORCEMENT RULES (Backend)                      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Rule 1: PROFILE STREAM LOCK                           │  │
│  │                                                        │  │
│  │ Khi tạo profile, bắt buộc chọn stream:                │  │
│  │   stream: "ngoai_san" | "noi_san"                     │  │
│  │                                                        │  │
│  │ Extension tự validate:                                 │  │
│  │   if (profile.stream === "ngoai_san") {               │  │
│  │     ALLOW:  facebook.com/adsmanager                   │  │
│  │     ALLOW:  ads.google.com                            │  │
│  │     ALLOW:  ads.tiktok.com                            │  │
│  │     BLOCK:  seller.shopee.* ← Cảnh báo!              │  │
│  │     BLOCK:  sellercenter.lazada.* ← Cảnh báo!        │  │
│  │   }                                                    │  │
│  │   if (profile.stream === "noi_san") {                 │  │
│  │     ALLOW:  seller.shopee.*                           │  │
│  │     ALLOW:  sellercenter.lazada.*                     │  │
│  │     ALLOW:  seller.tiktokshop.*                       │  │
│  │     BLOCK:  facebook.com/adsmanager ← Cảnh báo!      │  │
│  │     BLOCK:  ads.google.com ← Cảnh báo!               │  │
│  │   }                                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Rule 2: EMPLOYEE STREAM + MULTI-PLATFORM              │  │
│  │                                                        │  │
│  │ employee.stream = "ngoai_san" | "noi_san"             │  │
│  │ employee.platforms = ["facebook","google","tiktok"]   │  │
│  │   → NV chọn 1+ platform trong luồng được gán         │  │
│  │                                                        │  │
│  │ Ví dụ hợp lệ:                                         │  │
│  │   ✅ stream=ngoai_san, platforms=[FB, GG]              │  │
│  │   ✅ stream=ngoai_san, platforms=[FB, GG, TT]          │  │
│  │   ✅ stream=noi_san, platforms=[Shopee, Lazada]        │  │
│  │   ❌ stream=ngoai_san, platforms=[FB, Shopee] ← BLOCK │  │
│  │                                                        │  │
│  │ Constraint:                                            │  │
│  │   platforms[] phải thuộc đúng stream                   │  │
│  │   NV ngoai_san KHÔNG được gán shop account            │  │
│  │   NV noi_san KHÔNG được gán ad account                │  │
│  │   Chuyển luồng → phải qua HR approval + audit log    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Rule 3: ASSET OWNERSHIP                               │  │
│  │                                                        │  │
│  │ Mỗi TKQC / Shop có:                                   │  │
│  │   owner: "XBK-001"        (NV chính — 1 duy nhất)    │  │
│  │   backup: "XBK-002"       (NV backup — 1 duy nhất)   │  │
│  │   supervisor: "XBK-007"   (Team Lead — giám sát)     │  │
│  │                                                        │  │
│  │ Khi gán owner:                                         │  │
│  │   CHECK owner.stream === asset.stream                 │  │
│  │   CHECK asset chưa có owner khác (trừ khi transfer)   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Rule 4: CARD ISOLATION                                │  │
│  │                                                        │  │
│  │ card.stream = "ngoai_san" | "noi_san"                 │  │
│  │                                                        │  │
│  │ Ads Card → chỉ dùng cho FB/GG/TT Ads billing         │  │
│  │ E-com Card → chỉ dùng cho top-up shop + sàn ads      │  │
│  │                                                        │  │
│  │ Recon Engine validate:                                 │  │
│  │   Txn từ "FACEBK" trên E-com Card → FLAG ❌           │  │
│  │   Txn từ "SHOPEE" trên Ads Card → FLAG ❌             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. DASHBOARD THEO LUỒNG

```
┌─────────────────────────────────────────────────────────────┐
│  🌐 DASHBOARD NGOẠI SÀN                                    │
│                                                             │
│  KPIs: [Total Spend] [CPA] [Conversions] [Impressions]     │
│                                                             │
│  Charts:                                                    │
│  ├── Daily Spend by Platform (FB / GG / TT)                │
│  ├── CPA Trend                                              │
│  └── Top Campaigns by ROAS                                  │
│                                                             │
│  Tables:                                                    │
│  ├── Campaigns (cross-platform)                             │
│  ├── TKQC Health (Active / Disabled / Unsettled)           │
│  └── Top Marketers by Spend                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🏪 DASHBOARD NỘI SÀN                                      │
│                                                             │
│  KPIs: [GMV] [Orders] [Conv Rate] [AOV] [Revenue]          │
│                                                             │
│  Charts:                                                    │
│  ├── Daily GMV by Platform (Shopee / Lazada / TT Shop)     │
│  ├── Order Trend                                            │
│  └── Top Products by Revenue                                │
│                                                             │
│  Tables:                                                    │
│  ├── Shop Performance                                       │
│  ├── Product Rankings                                       │
│  └── Top Operators by GMV                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. TÓM TẮT SO SÁNH

| Khía cạnh | Ngoại sàn 🌐 | Nội sàn 🏪 |
|---|---|---|
| **Kênh** | Facebook, Google, TikTok Ads | Shopee, Lazada, TikTok Shop |
| **Kết nối** | FB: Extension, GG+TT: API | Extension scrape Seller Center |
| **Tài sản chính** | TKQC + Fanpage + BM/MCC/BC | Shop + Products + In-platform Ads |
| **Nhân sự** | Media Buyer, Campaign Mgr | Shop Operator, Listing Spec |
| **Cards** | Ads Cards (FB/GG/TT billing) | E-com Cards (shop top-up) |
| **KPIs** | CPA, ROAS, CTR, CPM | GMV, Orders, Conv Rate, AOV |
| **Recon** | Ads Invoice ↔ Card Txn | Sàn Settlement ↔ Bank Transfer |
| **Dashboard** | Ads Performance | E-commerce Performance |
