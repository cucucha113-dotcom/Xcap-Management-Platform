# 🌐 XCAP — Account & Permission System: NGOẠI SÀN (Off-Platform Ads)

> **Tách từ:** `account_system_diagram.md` — chỉ phần liên quan đến hệ thống Ngoại sàn
> **Stream:** `ngoai_san` (Facebook Ads, Google Ads, TikTok Ads)
> **Platforms:** Facebook, Google, TikTok Ads

---

## 1. TỔ CHỨC NHÂN SỰ NGOẠI SÀN

```mermaid
graph TB
    subgraph NGOAI_SAN["🌐 NGOẠI SÀN — Off-Platform Ads"]
        direction TB
        
        TGD["🟠 Tổng Giám đốc<br/>(company_admin)<br/>Thấy ALL data ngoại sàn"]
        
        subgraph DA1["📁 Dự án Brand A"]
            GD_DA1["🟡 GĐ DA Brand A<br/>(project_director)"]
            L1["🟢 Leader 1<br/>(team_lead)"]
            NV1["🔵 NV1<br/>marketer<br/>FB + GG"]
            NV2["🔵 NV2<br/>marketer<br/>FB + TT"]
            NV3["🔵 NV3<br/>marketer<br/>FB + GG + TT"]
        end
        
        subgraph DA2["📁 Dự án Brand B"]
            GD_DA2["🟡 GĐ DA Brand B<br/>(project_director)"]
            L2["🟢 Leader 2<br/>(team_lead)"]
            NV4["🔵 NV4<br/>marketer<br/>FB"]
            NV5["🔵 NV5<br/>marketer<br/>GG + TT"]
        end
        
        subgraph SUPPORT["⚙️ Support (phục vụ ngoại sàn)"]
            KT["🔵 Kế toán<br/>accountant<br/>Đối soát ads"]
        end
    end
    
    TGD --> GD_DA1
    TGD --> GD_DA2
    GD_DA1 --> L1
    L1 --> NV1
    L1 --> NV2
    L1 --> NV3
    GD_DA2 --> L2
    L2 --> NV4
    L2 --> NV5
    TGD -.-> KT
```

### Vai trò trong Ngoại sàn

| Role | Vị trí | Số lượng (quy mô 500NV) | Chức năng chính |
|---|---|---|---|
| `company_admin` | Tổng GĐ | 1 | Toàn quyền, phê duyệt budget lớn |
| `project_director` | GĐ Dự án | 8 | Quản lý 1-3 dự án, phân bổ TKQC, quản NV trong DA |
| `team_lead` | Leader | 24 | Quản lý nhóm 5-8 NVQC |
| `marketer` | Nhân viên quảng cáo (NVQC) | 180 | Chạy QC, quản lý TKQC được gán |
| `accountant` | Kế toán | 15 | Đối soát chi phí ads, invoices |

---

## 2. ENTITY MODEL — Ngoại sàn

### 2.1 Employee (Ngoại sàn specific fields)

```javascript
// Employee schema — fields relevant to ngoai_san
{
  _id: ObjectId,
  employeeCode: "XBK-001",
  name: "Trần Minh Tân",
  email: "tan@xbk.vn",
  
  company: ObjectId,               // ref → Company
  department: ObjectId,            // ref → Department (Phòng Ngoại sàn)
  
  role: "marketer",                // super_admin | company_admin | project_director | team_lead | marketer | accountant
  position: "Nhân viên quảng cáo", // Vị trí thực tế
  
  stream: ["ngoai_san"],           // ← LOCKED: chỉ ngoại sàn
  platforms: ["facebook", "google", "tiktok_ads"],  // Platforms NV làm việc
  
  reportsTo: ObjectId,             // ref → Employee (Leader/GĐ DA)
  status: "active",               // active | suspended | offboarded
  
  // Ngoại sàn specific
  managedAccounts: {
    adAccounts: [ObjectId],         // ref → AdAccount (TKQC được gán)
    browserProfiles: [ObjectId],    // ref → BrowserProfile
    cards: [ObjectId],              // ref → Card (thẻ QC được gán)
  }
}
```

### 2.2 Tài sản Ngoại sàn được quản lý per-NV

```mermaid
erDiagram
    EMPLOYEE ||--o{ AD_ACCOUNT : "manages"
    EMPLOYEE ||--o{ BROWSER_PROFILE : "uses"
    EMPLOYEE ||--o{ CARD : "holds"
    EMPLOYEE ||--o{ CAMPAIGN : "runs"
    
    AD_ACCOUNT ||--|| BUSINESS_MANAGER : "belongs to"
    AD_ACCOUNT ||--o{ CAMPAIGN : "contains"
    AD_ACCOUNT }o--|| CARD : "billed to"
    
    EMPLOYEE {
        ObjectId _id
        string employeeCode
        string name
        string role "marketer / team_lead / project_director / ..."
        array stream "ngoai_san"
        array platforms "facebook / google / tiktok_ads"
    }
    
    AD_ACCOUNT {
        ObjectId _id
        string accountId "act_123456789"
        string platform "facebook / google / tiktok_ads"
        string name "X-TERRA 05 BM4"
        ObjectId assignedTo "Employee ref"
        ObjectId project "Project ref"
        string status "active / warning / disabled / die"
        number dailySpendLimit
        number monthlySpendLimit
    }
    
    BROWSER_PROFILE {
        ObjectId _id
        string profileName "Profile FB - NV1"
        string ixBrowserId "IXB-001"
        string proxy "socks5://..."
        array tags "ngoai_san / DA1"
        ObjectId assignedTo "Employee ref"
        array blockedUrls "seller.shopee.* / seller.lazada.*"
    }
    
    BUSINESS_MANAGER {
        ObjectId _id
        string bmId "BM-123456"
        string platform "facebook / google / tiktok_ads"
        string name "BM XBK Media 01"
        ObjectId managedBy "project_director / team_lead"
        array adAccounts "child TKQC"
    }
    
    CARD {
        ObjectId _id
        string lastFour "4521"
        string provider "visa / mastercard"
        string bank "Techcombank"
        string holderName "Nguyen Van A"
        ObjectId assignedTo "Employee ref"
        string stream "ngoai_san"
        number spendLimit
        number currentSpend
        array linkedAccounts "AdAccount refs"
    }

    CAMPAIGN {
        ObjectId _id
        string campaignId "camp_123"
        string name "Summer Sale 2025"
        string platform "facebook"
        string objectiveGroup "conversion / consideration / awareness"
        ObjectId adAccount "AdAccount ref"
        ObjectId managedBy "Employee ref"
        ObjectId project "Project ref"
    }
```

---

## 3. PERMISSION MATRIX — Ngoại sàn

### 3.1 Feature Permissions (Chỉ features liên quan ngoại sàn)

| Feature | company_admin | project_director (GĐ DA) | team_lead | marketer | accountant |
|---|:---:|:---:|:---:|:---:|:---:|
| **Dashboard** | ✅ All data | ✅ Project data | ✅ Team data | 👁️ Self data | 👁️ Finance |
| **TKQC Management** | ✅ manage | ✅ manage | ✅ edit | edit (assigned) | ❌ |
| **BM/MCC/BC** | ✅ manage | ✅ manage | 👁️ view | ❌ | ❌ |
| **Browser Profiles** | ✅ manage | ✅ manage | edit | edit (assigned) | ❌ |
| **Campaign CRUD** | ✅ | ✅ | ✅ | ✅ (assigned TKQC) | ❌ |
| **Card Management** | ✅ manage | 👁️ view | 👁️ view | 👁️ view (assigned) | ✅ manage |
| **Finance / Đối soát** | ✅ | ✅ full (assigned) | ✅ full (assigned) | ✅ full (assigned) | ✅ edit |
| **Top-up Request** | ✅ approve | ✅ approve (project) | ✅ request | ✅ request | ✅ process |
| **Reports / Export** | ✅ export | ✅ export | 👁️ view | 👁️ view (self) | 👁️ view |
| **HR / NV** | ✅ manage | ✅ project | ❌ | ❌ | ❌ |
| **Settings** | ✅ edit | ❌ | ❌ | ❌ | ❌ |
| **Audit Log** | ✅ | 👁️ project | ❌ | ❌ | ❌ |

### 3.2 Asset Permission — Gán TKQC cho NV

| Mode | Mô tả | Dùng cho |
|---|---|---|
| `all` | Thấy toàn bộ TKQC trong stream ngoai_san | TGĐ, GĐ Ngoại sàn |
| `exclude` | Tất cả **trừ** list cụ thể | project_director (trừ TKQC nhạy cảm) |
| `list` | Chỉ TKQC trong danh sách | Media Buyer (3-5 TKQC cụ thể) |
| `tag` | Theo tag: `DA1`, `brand_A`, `facebook` | Gán theo dự án hoặc platform |

**Ví dụ gán cho Media Buyer:**

```javascript
// NV1 — chỉ quản 3 TKQC cụ thể
{
  employee: "NV1",
  assetPermission: {
    mode: "list",
    includeIds: ["act_111", "act_222", "act_333"],
    streams: ["ngoai_san"]
  }
}

// GĐ DA Brand A — tất cả TKQC tag DA1
{
  employee: "GD_DA1",
  assetPermission: {
    mode: "tag",
    tags: ["DA1", "brand_A"],
    streams: ["ngoai_san"]
  }
}
```

### 3.3 Data Scope — Ai thấy gì?

```
┌─────────────────────────────────────────────────────────────────────┐
│  Data Scope trong Ngoại sàn                                         │
│                                                                     │
│  company_admin (TGĐ)                                               │
│  └── ALL TKQC, ALL campaigns, ALL NV, ALL finance                   │
│                                                                     │
│  project_director (GĐ DA Brand A)                                  │
│  └── TKQC thuộc DA Brand A, campaigns DA, NV trong DA              │
│                                                                     │
│  team_lead (Leader 1)                                               │
│  └── TKQC của team members, campaigns team, NV trong team          │
│                                                                     │
│  marketer (NVQC)                                                    │
│  └── CHỈ TKQC được gán (act_111, act_222, act_333)                 │
│      CHỈ campaigns mình tạo/quản lý                                │
│      CHỈ data/reports CỦA MÌNH                                     │
│                                                                     │
│  accountant (Kế toán)                                               │
│  └── Finance data (invoices, cards, đối soát)                       │
│      KHÔNG thấy campaign details                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. STREAM ISOLATION RULES — Ngoại sàn

### 4.1 Cách ly với Nội sàn

| Rule | Enforcement | Ví dụ |
|---|---|---|
| **NV Lock** | `employee.stream = ["ngoai_san"]` | NV ngoại sàn KHÔNG thể được gán Shop Shopee |
| **TKQC Lock** | `adAccount.stream = "ngoai_san"` | TKQC FB/GG/TT KHÔNG hiện trong module Nội sàn |
| **Browser Profile** | `profile.tags includes "ngoai_san"` | Profile ngoại sàn BLOCK URL: `seller.shopee.*`, `seller.lazada.*` |
| **Card Isolation** | `card.stream = "ngoai_san"` | Card ads KHÔNG dùng cho e-com top-up |
| **Dashboard Filter** | `WHERE stream = "ngoai_san"` | Dashboard chỉ hiện metrics ngoại sàn |
| **Report Scope** | Filtered by stream | Export chỉ có data ngoại sàn |

### 4.2 Cross-stream Exceptions

```
┌─────────────────────────────────────────────────────────┐
│  Ai có thể thấy data CẢ 2 stream?                      │
│                                                         │
│  ✅ super_admin          → Toàn hệ thống                │
│  ✅ company_admin (TGĐ)  → Toàn company                 │
│  ⚠️ project_director    → Chỉ trong DA đó               │
│     (nếu quản DA cả 2 stream)                           │
│  ✅ Kế toán tổng         → Finance data cả 2 stream     │
│                                                         │
│  ❌ team_lead             → CHỈ stream mình              │
│  ❌ marketer              → CHỈ ngoại sàn                │
└─────────────────────────────────────────────────────────┘
```

---

## 5. FLOWS — Lifecycle NV Ngoại sàn

### 5.1 Onboard Media Buyer mới

```mermaid
sequenceDiagram
    actor GD as GĐ DA / GĐ NS
    participant API as XCAP API
    participant DB as Database
    participant Email as Email Service
    
    Note over GD: Tuyển Media Buyer mới cho DA Brand A
    
    GD->>API: POST /api/invites
    Note right of GD: {<br/>  email: "nv_moi@xbk.vn",<br/>  role: "marketer",<br/>  stream: ["ngoai_san"],<br/>  platforms: ["facebook", "google"],<br/>  project: "DA-Brand-A",<br/>  reportsTo: "Leader1_id",<br/>  assetPerm: {<br/>    mode: "list",<br/>    includeIds: ["act_444", "act_555"]<br/>  }<br/>}
    
    API->>DB: Create Invite (pending)
    API->>Email: Gửi link mời
    
    Note over Email: NV click link → đăng ký → Active
    
    API->>DB: Create Employee (stream: ngoai_san)
    API->>DB: Gán TKQC: act_444, act_555
    API->>DB: Gán Browser Profile: profile_new
    API->>DB: Add to Project: DA-Brand-A
    API->>DB: Set reportsTo: Leader1
```

### 5.2 Gán/Thu hồi TKQC

```mermaid
sequenceDiagram
    actor Leader as Leader / GĐ DA
    participant API as XCAP API
    participant DB as Database
    participant Audit as Audit Log
    
    Note over Leader: Gán thêm TKQC cho NV1
    
    Leader->>API: PUT /api/accounts/NV1/asset-perms
    Note right of Leader: {<br/>  action: "add",<br/>  adAccountIds: ["act_666"]<br/>}
    
    API->>API: Check: Leader quản lý act_666? ✅
    API->>API: Check: act_666 thuộc stream ngoai_san? ✅
    API->>API: Check: NV1 thuộc stream ngoai_san? ✅
    
    API->>DB: Update NV1.assetPermission.includeIds += act_666
    API->>Audit: Log { action: "asset_assigned", account: "act_666", to: "NV1" }
    
    API-->>Leader: ✅ Đã gán act_666 cho NV1
```

### 5.3 Chuyển TKQC từ NV A → NV B

#### Khi nào xảy ra?
- NV A nghỉ phép / offboard → cần người khác chạy tiếp
- NV A quản lý kém → chuyển TKQC cho NV giỏi hơn
- Tái cấu trúc team → phân bổ lại tài sản

#### Flow chi tiết

```mermaid
sequenceDiagram
    actor Admin as Leader / GĐ DA
    participant API as XCAP API
    participant DB as Database
    participant Audit as Audit Log
    
    Note over Admin: Chuyển act_111 từ NV-A → NV-B
    
    Admin->>API: POST /api/assets/transfer
    Note right of Admin: {<br/>  adAccountIds: ["act_111"],<br/>  fromEmployee: "NV-A",<br/>  toEmployee: "NV-B",<br/>  transferCard: true,<br/>  transferProfile: true,<br/>  effectiveDate: "2026-05-29",<br/>  reason: "Tái phân bổ TKQC"<br/>}
    
    API->>API: Validate permissions
    Note over API: Check:<br/>1. Admin có quyền manage act_111? ✅<br/>2. NV-A đang giữ act_111? ✅<br/>3. NV-B cùng stream ngoai_san? ✅<br/>4. NV-B active? ✅
    
    rect rgb(255, 240, 240)
        Note over API,DB: BƯỚC 1: Thu hồi từ NV-A
        API->>DB: NV-A.managedAccounts.adAccounts -= act_111
        API->>DB: NV-A.assetPermission.includeIds -= act_111
        
        opt transferCard = true
            API->>DB: NV-A.managedAccounts.cards -= card_linked_to_act_111
        end
        opt transferProfile = true
            API->>DB: NV-A.managedAccounts.browserProfiles -= profile_for_act_111
        end
    end
    
    rect rgb(240, 255, 240)
        Note over API,DB: BƯỚC 2: Gán cho NV-B
        API->>DB: NV-B.managedAccounts.adAccounts += act_111
        API->>DB: NV-B.assetPermission.includeIds += act_111
        
        opt transferCard = true
            API->>DB: NV-B.managedAccounts.cards += card_linked_to_act_111
        end
        opt transferProfile = true
            API->>DB: NV-B.managedAccounts.browserProfiles += profile_for_act_111
        end
    end
    
    rect rgb(240, 240, 255)
        Note over API,DB: BƯỚC 3: Đánh dấu mốc chuyển giao
        API->>DB: INSERT asset_transfer_log {<br/>  adAccountId: "act_111",<br/>  fromEmployee: "NV-A",<br/>  toEmployee: "NV-B",<br/>  transferredAt: "2026-05-29T00:00:00",<br/>  transferredBy: "Admin",<br/>  reason: "Tái phân bổ TKQC"<br/>}
    end
    
    API->>Audit: Log { action: "asset_transfer", from: "NV-A", to: "NV-B", accounts: ["act_111"] }
    API-->>Admin: ✅ Đã chuyển act_111 từ NV-A → NV-B
```

#### Quy tắc Data Ownership sau chuyển giao

```
┌──────────────────────────────────────────────────────────────────────────┐
│  TKQC: act_111 — Chuyển từ NV-A → NV-B ngày 29/05/2026                 │
│                                                                          │
│  ══════ DATA CỦA NV-A (giữ nguyên, không mất) ═══════                  │
│                                                                          │
│  │ Thời gian       │ Campaigns      │ Spend      │ Conv │ Thuộc về │    │
│  │─────────────────│────────────────│────────────│──────│──────────│    │
│  │ 01/05 → 28/05   │ Camp-01, 02, 03│ 50,000,000 │  120 │ NV-A     │    │
│  │                 │                │            │      │          │    │
│  │  → Reports NV-A vẫn hiện data này                              │    │
│  │  → Dashboard NV-A vẫn tính spend/conv này vào KPI              │    │
│  │  → Campaigns cũ vẫn gắn managedBy = NV-A                      │    │
│  │                                                                │    │
│  ══════ DATA CỦA NV-B (từ ngày chuyển giao) ═════════              │    │
│                                                                          │
│  │ 29/05 → ...     │ Camp mới       │ Spend mới  │ Conv │ NV-B     │    │
│  │                 │                │            │      │          │    │
│  │  → Campaigns mới tạo trên act_111 gắn managedBy = NV-B        │    │
│  │  → Spend từ 29/05 tính vào KPI NV-B                           │    │
│  │  → Campaigns cũ (Camp-01,02,03) NV-B có thể THẤY nhưng       │    │
│  │    data KHÔNG tính vào KPI của NV-B                            │    │
│                                                                          │
│  ══════ MỐC CHUYỂN GIAO (asset_transfer_log) ═════════                 │
│                                                                          │
│  transferredAt: 2026-05-29T00:00:00                                     │
│  → Mọi query dashboard dùng mốc này để phân tách data                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### SQL phân tách data theo mốc chuyển giao

```sql
-- KPI cho NV-B: CHỈ tính data từ ngày nhận TKQC
SELECT
  SUM(cr.spend) AS total_spend,
  SUM(cr.conversions) AS total_conv
FROM campaign_results cr
JOIN campaigns c ON cr.campaign_id = c.id
WHERE c.ad_account_id = 'act_111'
  AND c.managed_by = 'NV-B'                          -- Campaigns NV-B tạo
  AND cr.date >= '2026-05-29';                        -- Từ ngày nhận

-- KPI cho NV-A: CHỈ tính data TRƯỚC ngày chuyển
SELECT
  SUM(cr.spend) AS total_spend,
  SUM(cr.conversions) AS total_conv
FROM campaign_results cr
JOIN campaigns c ON cr.campaign_id = c.id
WHERE c.ad_account_id = 'act_111'
  AND c.managed_by = 'NV-A'                          -- Campaigns NV-A tạo
  AND cr.date < '2026-05-29';                         -- Trước ngày chuyển

-- Campaigns cũ vẫn chạy (NV-A tạo nhưng NV-B tiếp quản)
-- → Spend sau 29/05 tính cho NV-B
SELECT
  SUM(cr.spend) AS inherited_spend
FROM campaign_results cr
JOIN campaigns c ON cr.campaign_id = c.id
JOIN asset_transfer_log atl ON c.ad_account_id = atl.ad_account_id
WHERE c.ad_account_id = 'act_111'
  AND c.managed_by = 'NV-A'                          -- Campaign NV-A tạo
  AND cr.date >= atl.transferred_at                   -- Nhưng spend sau chuyển giao
  -- → Tính cho NV-B (người hiện đang quản lý TKQC)
```

#### Options khi chuyển

| Option | Default | Mô tả |
|---|---|---|
| `transferCard` | `true` | Chuyển luôn thẻ thanh toán đang gắn với TKQC |
| `transferProfile` | `true` | Chuyển luôn browser profile đang dùng cho TKQC |
| `pauseCampaigns` | `false` | Tạm dừng tất cả campaigns đang chạy trên TKQC |
| `effectiveDate` | `now` | Ngày hiệu lực chuyển giao (có thể set tương lai) |
| `notifyEmployees` | `true` | Gửi notification cho cả NV-A và NV-B |

#### Edge Cases

| Case | Xử lý |
|---|---|
| NV-A đang offboarded | Vẫn chuyển được — TKQC cần người quản lý mới |
| NV-B đã có TKQC đầy (>5) | Warning cho Admin, cho phép override |
| TKQC đang có campaigns chạy | Warning: "3 campaigns đang active", Admin chọn pause hoặc giữ chạy |
| Chuyển TKQC khác DA | Cần GĐ DA đích đồng ý (hoặc TGĐ approve) |
| Chuyển hàng loạt | Batch API: `POST /api/assets/transfer/bulk` — chuyển nhiều TKQC cùng lúc |
| NV-B khác platform | ❌ Block — NV chỉ chạy FB không nhận TKQC Google |

### 5.4 Chuyển NV giữa các DA (trong ngoại sàn)

```mermaid
sequenceDiagram
    actor GD_NS as GĐ Ngoại sàn
    participant API as XCAP API
    participant DB as Database
    participant Audit as Audit Log
    
    Note over GD_NS: Chuyển NV3 từ DA Brand A → DA Brand B
    
    GD_NS->>API: PUT /api/accounts/NV3/transfer
    Note right of GD_NS: {<br/>  newProject: "DA-Brand-B",<br/>  newReportsTo: "Leader2_id",<br/>  transferAccounts: false<br/>}
    
    API->>DB: DA Brand A: NV3.isActive = false, leftAt = now
    API->>DB: DA Brand B: add NV3, isActive = true
    API->>DB: NV3.reportsTo = Leader2
    
    Note over API,DB: ⚠️ TKQC CŨ vẫn thuộc NV3<br/>(data campaigns giữ nguyên)<br/>GĐ DA mới sẽ gán TKQC mới
    
    API->>DB: NV3.assetPermission = reset (GĐ DA mới sẽ gán lại)
    API->>Audit: Log { action: "transfer", from: "DA-A", to: "DA-B" }
```

### 5.5 Offboard NV Ngoại sàn

```mermaid
sequenceDiagram
    actor TGD as TGĐ / GĐ NS
    participant API as XCAP API
    participant DB as Database
    participant Session as Session Manager
    participant Audit as Audit Log
    
    TGD->>API: POST /api/accounts/NV2/offboard
    Note right of TGD: { reason: "Nghỉ việc" }
    
    API->>DB: NV2.status = "offboarded"
    API->>DB: NV2.offboardedAt = now
    
    Note over API,DB: KHÔNG XÓA DATA:<br/>- Campaigns NV2 đã chạy → giữ nguyên<br/>- Reports → giữ nguyên<br/>- Spend history → giữ nguyên<br/>- TKQC → thu hồi (unassign) để gán NV khác
    
    API->>DB: Unassign all TKQC from NV2
    API->>DB: Unassign browser profiles from NV2
    API->>DB: Unassign cards from NV2
    API->>DB: Remove from all active projects
    
    API->>Session: Revoke ALL sessions/tokens
    API->>Audit: Log { action: "offboard", reason: "Nghỉ việc", assets_recovered: [...] }
```

---

## 6. CUSTOM ROLES — Ngoại sàn

### Các Custom Role phổ biến

| Custom Role | Base Role | Feature Override | Asset Override | Use case |
|---|---|---|---|---|
| **Senior NVQC** | `marketer` | +reports(export), +assetMgmt(manage) | Tag: [DA1, DA2] | NVQC kinh nghiệm, quản nhiều TKQC |
| **Junior NVQC** | `marketer` | campaign(view+edit), -create | List: [act_001] | NVQC mới, chỉ chạy 1 TKQC |
| **Campaign Manager** | `team_lead` | +finance(view), +reports(export) | Tag: [all_project] | Leader có quyền xem finance |
| **Ads Accountant** | `accountant` | finance(full), +assetMgmt(view) | Stream: ngoai_san | KT chuyên đối soát ads |

### Tạo Custom Role — Wireframe

```
┌──────────────────────────────────────────────────────────────┐
│                TẠO CUSTOM ROLE — Ngoại sàn                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Tên role:    [ Senior Media Buyer               ]           │
│  Base role:   [ marketer ▼ ]                                 │
│  Stream:      [🌐 Ngoại sàn ✓] [🏪 Nội sàn ✗]              │
│                                                              │
│  ── Feature Permissions ──────────────────────────           │
│  [✅] Dashboard               (view self data)               │
│  [✅] Quản lý TKQC            (view / edit / manage ●)       │
│  [✅] Quản lý QC / Campaigns  (view / edit / create)         │
│  [✅] Browser Profiles        (view / edit)                   │
│  [  ] Card Management         (không truy cập)               │
│  [  ] Tài chính / Đối soát    (không truy cập)               │
│  [✅] Báo cáo                 (view / export ●)              │
│  [  ] Nhân sự                 (không truy cập)               │
│  [  ] Audit Log               (không truy cập)               │
│                                                              │
│  ── Asset Permissions ────────────────────────────           │
│  (○) Toàn bộ TKQC ngoại sàn                                 │
│  (○) Toàn bộ trừ: [___]                                     │
│  (○) Chọn theo danh sách: [___]                              │
│  (●) Chọn theo tag: [ DA1 ✓ ] [ DA2 ✓ ] [ DA3 ]            │
│                                                              │
│  [ Hủy ]                              [ Lưu Custom Role ]   │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. API ENDPOINTS — Ngoại sàn Account Management

```
┌─────────────────────────────────────────────────────────────────────┐
│              ACCOUNT MANAGEMENT APIs — Ngoại sàn                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  👤 NV MANAGEMENT                                                   │
│  ├── POST   /api/invites                      Mời NV mới           │
│  │          body: { role, stream:["ngoai_san"], platforms, project } │
│  ├── POST   /api/accounts/bulk-import         Import CSV            │
│  ├── PUT    /api/accounts/:id/role            Đổi role              │
│  ├── PUT    /api/accounts/:id/transfer        Chuyển DA             │
│  ├── POST   /api/accounts/:id/suspend         Tạm khóa             │
│  ├── POST   /api/accounts/:id/reactivate      Kích hoạt lại        │
│  └── POST   /api/accounts/:id/offboard        Offboard             │
│                                                                     │
│  🔐 PERMISSIONS                                                     │
│  ├── GET    /api/accounts/:id/feature-perms    Xem feature perms    │
│  ├── PUT    /api/accounts/:id/feature-perms    Cập nhật features    │
│  ├── GET    /api/accounts/:id/asset-perms      Xem TKQC được gán   │
│  └── PUT    /api/accounts/:id/asset-perms      Gán/thu hồi TKQC    │
│             body: { mode:"list", includeIds:["act_xxx"] }           │
│                                                                     │
│  📦 ASSET ASSIGNMENT (Ngoại sàn specific)                            │
│  ├── PUT    /api/accounts/:id/assign-tkqc      Gán TKQC cho NV     │
│  │          body: { adAccountIds: ["act_111"] }                     │
│  ├── PUT    /api/accounts/:id/assign-profile   Gán browser profile  │
│  │          body: { profileIds: ["prof_001"] }                      │
│  ├── PUT    /api/accounts/:id/assign-card      Gán card             │
│  │          body: { cardIds: ["card_001"] }                         │
│  └── DELETE /api/accounts/:id/revoke-assets    Thu hồi tài sản     │
│             body: { adAccountIds, profileIds, cardIds }             │
│                                                                     │
│  🎭 CUSTOM ROLES                                                    │
│  ├── GET    /api/custom-roles?stream=ngoai_san  List roles          │
│  ├── POST   /api/custom-roles                   Create              │
│  ├── PUT    /api/custom-roles/:id               Update              │
│  └── DELETE /api/custom-roles/:id               Delete              │
│                                                                     │
│  📋 AUDIT                                                           │
│  ├── GET    /api/audit?stream=ngoai_san         Logs (filtered)     │
│  └── GET    /api/audit/:employeeId              Logs of 1 NV        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. MIDDLEWARE — Stream Guard

```javascript
// Middleware kiểm tra stream ngoai_san trước mọi thao tác

const streamGuard = (requiredStream = 'ngoai_san') => {
  return (req, res, next) => {
    const user = req.user; // từ JWT
    
    // super_admin và company_admin bypass stream check
    if (['super_admin', 'company_admin'].includes(user.role)) {
      return next();
    }
    
    // Check NV có thuộc stream yêu cầu không
    if (!user.stream.includes(requiredStream)) {
      return res.status(403).json({
        error: 'STREAM_VIOLATION',
        message: `Bạn không có quyền truy cập stream: ${requiredStream}`,
        yourStream: user.stream,
        requiredStream
      });
    }
    
    // Inject stream filter vào query
    req.streamFilter = { stream: requiredStream };
    next();
  };
};

// Usage
router.get('/api/ad-accounts', 
  streamGuard('ngoai_san'),     // ← Chỉ NV ngoại sàn mới access
  assetScopeFilter,             // ← Filter theo TKQC được gán
  adAccountController.list
);
```

### Asset Scope Filter

```javascript
// Filter TKQC theo quyền của NV

const assetScopeFilter = (req, res, next) => {
  const user = req.user;
  const perm = user.assetPermission;
  
  switch (perm.mode) {
    case 'all':
      // Không filter — thấy tất cả TKQC ngoại sàn
      req.assetFilter = { stream: 'ngoai_san' };
      break;
      
    case 'exclude':
      // Tất cả trừ blacklist
      req.assetFilter = { 
        stream: 'ngoai_san',
        _id: { $nin: perm.excludeIds }
      };
      break;
      
    case 'list':
      // Chỉ whitelist
      req.assetFilter = {
        stream: 'ngoai_san', 
        _id: { $in: perm.includeIds }
      };
      break;
      
    case 'tag':
      // Theo tags
      req.assetFilter = {
        stream: 'ngoai_san',
        tags: { $in: perm.tags }
      };
      break;
  }
  
  next();
};
```

---

## 9. SUMMARY — Quy mô Ngoại sàn (500 NV)

| Metric | Giá trị |
|---|---|
| **Tổng NV ngoại sàn** | ~228 |
| **NVQC (Nhân viên quảng cáo)** | 180 |
| **Leaders** | 24 |
| **GĐ Dự án** | 8 |
| **Kế toán (ads)** | 15 |
| **TKQC (Ad Accounts)** | ~630 |
| **BM/MCC/BC** | ~70 |
| **Browser Profiles** | ~500 |
| **Cards (ads)** | ~315 |
| **Fanpages** | ~24 |
| **Projects** | ~16 |

> [!NOTE]
> File gốc đầy đủ (cả ngoại sàn + nội sàn + shared): [account_system_diagram.md](./account_system_diagram.md)
