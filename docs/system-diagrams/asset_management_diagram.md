# 📦 XCAP — Asset Management: NGOẠI SÀN (Off-Platform Ads)

> **Tách từ:** `ngoai_san_account_system.md` — chỉ phần quản lý tài sản
> **Tài sản:** TKQC (Ad Accounts), BM/MCC/BC, Browser Profiles, Cards, Campaigns
> **Stream:** `ngoai_san` (Facebook Ads, Google Ads, TikTok Ads)

---

## 1. ENTITY MODEL — Tài sản Ngoại sàn

### 1.1 Tổng quan quan hệ

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

### 1.2 Schema chi tiết từng Entity

#### AD_ACCOUNT (TKQC)

```javascript
{
  _id: ObjectId,
  accountId: "act_123456789",        // ID trên platform
  platform: "facebook",              // facebook | google | tiktok_ads
  name: "X-TERRA 05 BM4",
  
  // Ownership
  assignedTo: ObjectId,              // ref → Employee (NV đang quản lý)
  project: ObjectId,                 // ref → Project (DA thuộc)
  businessManager: ObjectId,         // ref → BM chứa TKQC này
  stream: "ngoai_san",              // LOCKED
  
  // Limits
  dailySpendLimit: 5000000,          // 5tr VND/ngày
  monthlySpendLimit: 100000000,      // 100tr VND/tháng
  
  // Status
  status: "active",                  // active | warning | disabled | die
  statusHistory: [
    { status: "active", changedAt: Date, changedBy: ObjectId, reason: "" }
  ],
  
  // Card
  linkedCard: ObjectId,              // ref → Card đang gắn
  
  // Tags (dùng cho asset permission mode: "tag")
  tags: ["DA1", "brand_A", "facebook"],
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  lastSyncAt: Date                   // Lần sync cuối từ platform API
}
```

#### BROWSER_PROFILE

```javascript
{
  _id: ObjectId,
  profileName: "Profile FB - NV1",
  ixBrowserId: "IXB-001",           // ID trong IX Browser
  
  // Network
  proxy: "socks5://user:pass@ip:port",
  userAgent: "Mozilla/5.0 ...",
  
  // Assignment
  assignedTo: ObjectId,              // ref → Employee
  tags: ["ngoai_san", "DA1", "facebook"],
  
  // Security
  blockedUrls: [                     // Chặn truy cập nội sàn
    "seller.shopee.*",
    "seller.lazada.*"
  ],
  
  // Status
  status: "active",                  // active | suspended | archived
  lastUsedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

#### CARD (Thẻ thanh toán)

```javascript
{
  _id: ObjectId,
  lastFour: "4521",
  provider: "visa",                  // visa | mastercard
  bank: "Techcombank",
  holderName: "Nguyen Van A",
  
  // Assignment
  assignedTo: ObjectId,              // ref → Employee đang giữ
  stream: "ngoai_san",              // LOCKED — không dùng cho nội sàn
  
  // Limits — CHỈ TGĐ + Kế toán được sửa
  spendLimit: 50000000,              // 50tr VND
  currentSpend: 32000000,
  resetDate: "monthly",             // daily | weekly | monthly
  
  // Linked
  linkedAccounts: [ObjectId],        // ref → AdAccount đang gắn
  
  // Status
  status: "active",                  // active | frozen | expired | cancelled
  
  createdAt: Date,
  updatedAt: Date
}
```

#### BUSINESS_MANAGER (BM / MCC / BC)

```javascript
{
  _id: ObjectId,
  bmId: "BM-123456",
  platform: "facebook",              // facebook → BM, google → MCC, tiktok → BC
  name: "BM XBK Media 01",
  
  // Management
  managedBy: ObjectId,               // ref → project_director / team_lead
  adAccounts: [ObjectId],            // ref → child TKQC
  
  // Status
  status: "active",                  // active | restricted | disabled
  maxAccounts: 10,                   // Giới hạn TKQC trong BM
  currentAccountCount: 7,
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 2. ASSET PERMISSION — Ai thấy tài sản nào?

### 2.1 Permission Modes

| Mode | Mô tả | Dùng cho |
|---|---|---|
| `all` | Thấy toàn bộ tài sản trong stream ngoai_san | TGĐ |
| `exclude` | Tất cả **trừ** list cụ thể | project_director (trừ TKQC nhạy cảm) |
| `list` | Chỉ tài sản trong danh sách | NVQC (3-5 TKQC cụ thể) |
| `tag` | Theo tag: `DA1`, `brand_A`, `facebook` | Gán theo dự án hoặc platform |

### 2.2 Ví dụ gán

```javascript
// NVQC — chỉ quản 3 TKQC cụ thể
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

// TGĐ — thấy tất cả
{
  employee: "TGD",
  assetPermission: {
    mode: "all",
    streams: ["ngoai_san"]
  }
}
```

### 2.3 Card Permission — Quy tắc đặc biệt

> [!IMPORTANT]
> Giới hạn chi tiêu (spendLimit) trên Card **CHỈ** được sửa bởi `company_admin` (TGĐ) và `accountant` (Kế toán).
> `project_director` có quyền manage card (-limit): gán thẻ, xem, liên kết TKQC, nhưng **KHÔNG** được mở/sửa giới hạn chi tiêu.

| Role | Card | Sửa spendLimit |
|---|---|---|
| `company_admin` | ✅ manage | ✅ Được |
| `accountant` | ✅ manage | ✅ Được |
| `project_director` | ✅ manage (-limit) | 🔒 Không |
| `team_lead` | 👁️ view | 🔒 Không |
| `marketer` | 👁️ view (assigned) | 🔒 Không |

### 2.4 Asset Scope theo Role

```
┌─────────────────────────────────────────────────────────────────────┐
│  Asset Scope — Ai thấy tài sản nào?                                 │
│                                                                     │
│  company_admin (TGĐ)                                               │
│  └── ALL TKQC, ALL BM, ALL Cards, ALL Profiles                      │
│                                                                     │
│  project_director (GĐ DA Brand A)                                  │
│  └── TKQC thuộc DA, BM thuộc DA, Cards trong DA, Profiles DA       │
│                                                                     │
│  team_lead (Leader 1)                                               │
│  └── TKQC của team members, Profiles team, Cards team               │
│                                                                     │
│  marketer (NVQC)                                                    │
│  └── CHỈ TKQC được gán (act_111, act_222, act_333)                 │
│      CHỈ profile MÌNH dùng                                         │
│      CHỈ card được gán                                              │
│                                                                     │
│  accountant (Kế toán)                                               │
│  └── ALL Cards (manage), finance data                               │
│      KHÔNG thấy campaign details                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. STREAM ISOLATION — Cách ly tài sản

| Rule | Enforcement | Ví dụ |
|---|---|---|
| **TKQC Lock** | `adAccount.stream = "ngoai_san"` | TKQC FB/GG/TT KHÔNG hiện trong module Nội sàn |
| **Browser Profile** | `profile.tags includes "ngoai_san"` | Profile ngoại sàn BLOCK URL: `seller.shopee.*`, `seller.lazada.*` |
| **Card Isolation** | `card.stream = "ngoai_san"` | Card ads KHÔNG dùng cho e-com top-up |
| **BM Scope** | `bm.stream = "ngoai_san"` | BM chỉ chứa TKQC ngoại sàn |

---

## 4. FLOWS — Lifecycle Tài sản

### 4.1 Gán/Thu hồi TKQC

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

### 4.2 Chuyển TKQC từ NV-A → NV-B

#### Khi nào xảy ra?
- NV-A nghỉ phép / offboard → cần người khác chạy tiếp
- NV-A quản lý kém → chuyển TKQC cho NV giỏi hơn
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
  AND c.managed_by = 'NV-B'
  AND cr.date >= '2026-05-29';

-- KPI cho NV-A: CHỈ tính data TRƯỚC ngày chuyển
SELECT
  SUM(cr.spend) AS total_spend,
  SUM(cr.conversions) AS total_conv
FROM campaign_results cr
JOIN campaigns c ON cr.campaign_id = c.id
WHERE c.ad_account_id = 'act_111'
  AND c.managed_by = 'NV-A'
  AND cr.date < '2026-05-29';

-- Campaigns cũ vẫn chạy (NV-A tạo nhưng NV-B tiếp quản)
-- → Spend sau 29/05 tính cho NV-B
SELECT
  SUM(cr.spend) AS inherited_spend
FROM campaign_results cr
JOIN campaigns c ON cr.campaign_id = c.id
JOIN asset_transfer_log atl ON c.ad_account_id = atl.ad_account_id
WHERE c.ad_account_id = 'act_111'
  AND c.managed_by = 'NV-A'
  AND cr.date >= atl.transferred_at;
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

### 4.3 Thu hồi tài sản khi Offboard

```mermaid
sequenceDiagram
    participant API as XCAP API
    participant DB as Database
    
    Note over API: Khi NV bị offboard → Thu hồi tất cả tài sản
    
    API->>DB: Unassign all TKQC from NV
    API->>DB: Unassign all browser profiles from NV
    API->>DB: Unassign all cards from NV
    
    Note over API,DB: ⚠️ DATA KHÔNG XÓA:<br/>- Campaigns đã chạy → giữ nguyên<br/>- Spend history → giữ nguyên<br/>- Reports → giữ nguyên<br/><br/>TKQC, Profile, Card → unassign<br/>→ GĐ DA gán lại cho NV khác
```

---

## 5. API ENDPOINTS — Asset Management

```
┌─────────────────────────────────────────────────────────────────────┐
│              ASSET MANAGEMENT APIs — Ngoại sàn                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📦 TKQC (Ad Accounts)                                              │
│  ├── GET    /api/ad-accounts                    List (filtered)     │
│  ├── GET    /api/ad-accounts/:id                Detail               │
│  ├── POST   /api/ad-accounts                    Create (from BM)    │
│  ├── PUT    /api/ad-accounts/:id                Update status/info  │
│  ├── PUT    /api/ad-accounts/:id/assign         Gán cho NV          │
│  │          body: { employeeId: "NV1" }                             │
│  ├── PUT    /api/ad-accounts/:id/unassign       Thu hồi              │
│  └── PUT    /api/ad-accounts/:id/limits         Sửa spend limits   │
│             body: { dailyLimit: 5000000, monthlyLimit: 100000000 }  │
│                                                                     │
│  🏢 BM / MCC / BC                                                   │
│  ├── GET    /api/business-managers               List                │
│  ├── GET    /api/business-managers/:id            Detail              │
│  ├── POST   /api/business-managers                Create              │
│  └── PUT    /api/business-managers/:id            Update              │
│                                                                     │
│  🌐 Browser Profiles                                                │
│  ├── GET    /api/browser-profiles                List (filtered)     │
│  ├── POST   /api/browser-profiles                Create              │
│  ├── PUT    /api/browser-profiles/:id/assign     Gán cho NV          │
│  ├── PUT    /api/browser-profiles/:id/unassign   Thu hồi              │
│  └── PUT    /api/browser-profiles/:id/blocked-urls  Update blocks   │
│                                                                     │
│  💳 Cards                                                            │
│  ├── GET    /api/cards                           List (filtered)     │
│  ├── POST   /api/cards                           Create              │
│  ├── PUT    /api/cards/:id/assign                Gán cho NV          │
│  ├── PUT    /api/cards/:id/unassign              Thu hồi              │
│  ├── PUT    /api/cards/:id/link-account          Liên kết TKQC       │
│  │          body: { adAccountId: "act_111" }                        │
│  └── PUT    /api/cards/:id/limits                Sửa spendLimit     │
│             ⚠️ CHỈ company_admin + accountant                       │
│             body: { spendLimit: 50000000 }                          │
│                                                                     │
│  🔄 Asset Transfer                                                   │
│  ├── POST   /api/assets/transfer                 Chuyển NV-A → NV-B │
│  │          body: { adAccountIds, fromEmployee, toEmployee,         │
│  │                  transferCard, transferProfile, effectiveDate }   │
│  ├── POST   /api/assets/transfer/bulk            Chuyển hàng loạt   │
│  └── GET    /api/assets/transfer-log             Lịch sử chuyển     │
│             query: { adAccountId, employeeId, dateFrom, dateTo }    │
│                                                                     │
│  📦 Bulk Assignment                                                  │
│  ├── PUT    /api/accounts/:id/assign-tkqc        Gán nhiều TKQC     │
│  │          body: { adAccountIds: ["act_111", "act_222"] }          │
│  ├── PUT    /api/accounts/:id/assign-profile     Gán browser profile│
│  │          body: { profileIds: ["prof_001"] }                      │
│  ├── PUT    /api/accounts/:id/assign-card        Gán card            │
│  │          body: { cardIds: ["card_001"] }                         │
│  └── DELETE /api/accounts/:id/revoke-assets      Thu hồi tài sản    │
│             body: { adAccountIds, profileIds, cardIds }             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. MIDDLEWARE — Asset Scope Filter

### 6.1 Stream Guard

```javascript
// Middleware kiểm tra stream ngoai_san trước mọi thao tác asset

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
```

### 6.2 Asset Scope Filter

```javascript
// Filter tài sản theo quyền của NV

const assetScopeFilter = (req, res, next) => {
  const user = req.user;
  const perm = user.assetPermission;
  
  switch (perm.mode) {
    case 'all':
      req.assetFilter = { stream: 'ngoai_san' };
      break;
      
    case 'exclude':
      req.assetFilter = { 
        stream: 'ngoai_san',
        _id: { $nin: perm.excludeIds }
      };
      break;
      
    case 'list':
      req.assetFilter = {
        stream: 'ngoai_san', 
        _id: { $in: perm.includeIds }
      };
      break;
      
    case 'tag':
      req.assetFilter = {
        stream: 'ngoai_san',
        tags: { $in: perm.tags }
      };
      break;
  }
  
  next();
};
```

### 6.3 Card Limit Guard

```javascript
// Middleware chặn sửa spendLimit — chỉ TGĐ và Kế toán

const cardLimitGuard = (req, res, next) => {
  const user = req.user;
  
  // Chỉ cho phép sửa limit nếu là company_admin hoặc accountant
  if (req.body.spendLimit !== undefined) {
    if (!['super_admin', 'company_admin', 'accountant'].includes(user.role)) {
      return res.status(403).json({
        error: 'CARD_LIMIT_LOCKED',
        message: 'Chỉ TGĐ và Kế toán được sửa giới hạn chi tiêu',
        yourRole: user.role,
        requiredRoles: ['company_admin', 'accountant']
      });
    }
  }
  
  next();
};

// Usage
router.put('/api/cards/:id/limits',
  streamGuard('ngoai_san'),
  cardLimitGuard,                    // ← Block GĐ DA trở xuống
  cardController.updateLimits
);
```

### 6.4 Usage — Kết hợp middlewares

```javascript
// Ad Accounts — filtered by asset scope
router.get('/api/ad-accounts', 
  streamGuard('ngoai_san'),
  assetScopeFilter,
  adAccountController.list
);

// Cards — filtered + limit guard
router.put('/api/cards/:id', 
  streamGuard('ngoai_san'),
  assetScopeFilter,
  cardLimitGuard,
  cardController.update
);

// Asset Transfer
router.post('/api/assets/transfer',
  streamGuard('ngoai_san'),
  requireRole(['project_director', 'team_lead', 'company_admin']),
  assetTransferController.transfer
);
```

---

## 7. SUMMARY — Quy mô tài sản Ngoại sàn (500 NV)

| Asset | Số lượng | Ghi chú |
|---|---|---|
| **TKQC (Ad Accounts)** | ~630 | ~3.5 TKQC / NVQC |
| **BM/MCC/BC** | ~70 | ~9 TKQC / BM |
| **Browser Profiles** | ~500 | ~1 profile / NV (có thể nhiều hơn) |
| **Cards (ads)** | ~315 | ~2 TKQC / card |
| **Fanpages** | ~24 | Dùng cho FB ads |
| **Projects** | ~16 | ~2 DA / GĐ DA |

> [!NOTE]
> File account & permission đầy đủ: [ngoai_san_account_system.md](./ngoai_san_account_system.md)
