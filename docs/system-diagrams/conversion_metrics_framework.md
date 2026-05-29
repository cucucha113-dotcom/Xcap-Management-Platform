# 🎯 Conversion Metrics Framework — Tách biệt chỉ số theo Mục tiêu Campaign

---

## 1. Vấn đề hiện tại

### Dashboard đang hiện thị sai

Nhìn vào dashboard hiện tại:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Tổng Spend   │  │ CPA          │  │ CTR          │  │ Conversions  │
│ 1,998,876,956│  │ 3,550,403 đ  │  │ 2.75%        │  │ 563          │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

**Con số `563 Conversions` và `CPA 3,550,403 đ` đang TRỘN LẪN dữ liệu từ các campaign có mục tiêu khác nhau:**

```
Campaign "Awareness Q2"    (Mục tiêu: Reach)         → "Results": 50,000 reach      ← ĐÂY KHÔNG PHẢI CONVERSION
Campaign "Traffic Blog"    (Mục tiêu: Traffic)        → "Results": 8,200 link clicks ← ĐÂY KHÔNG PHẢI CONVERSION
Campaign "Sale Tháng 5"   (Mục tiêu: Conversions)    → "Results": 312 purchases     ← ĐÂY MỚI LÀ CONVERSION THẬT
Campaign "Lead Gen Form"  (Mục tiêu: Leads)          → "Results": 251 leads         ← CÓ THỂ TÍNH LÀ CONVERSION
```

**Nếu gộp hết:** `Results = 50,000 + 8,200 + 312 + 251 = 58,763` → **VÔ NGHĨA**

**Hiện tại đang hiện `563`** → có vẻ chỉ lấy `purchases + leads` nhưng **không rõ logic** → dễ hiển thị sai.

### Tại sao CPA cũng sai?

```
CPA hiện tại = Tổng Spend / Tổng "Conversions" (trộn lẫn)
            = 1,998,876,956 / 563
            = 3,550,403 đ

CPA đúng     = Spend CHỈ TỪ campaigns chạy Conversions / Số Conversions thật
            = 800,000,000 / 312
            = 2,564,102 đ  ← CHÊNH LỆCH LỚN!
```

> [!CAUTION]
> **Khi trộn lẫn metrics từ các objective khác nhau, mọi chỉ số dẫn xuất (CPA, Conv Rate) đều sai.** Điều này dẫn đến quyết định tối ưu sai — ví dụ tưởng CPA cao nên cắt budget, nhưng thực ra CPA thật thấp hơn nhiều.

---

## 2. Mapping: Mục tiêu Campaign → "Kết quả" (Results) theo Platform

### Facebook Ads

| Objective | `campaign.objective` | "Results" = | Action Type (API) | Là Conversion thật? |
|---|---|---|---|---|
| **Awareness** | `OUTCOME_AWARENESS` | People Reached | `reach` | ❌ Không |
| **Traffic** | `OUTCOME_TRAFFIC` | Link Clicks / Landing Page Views | `link_click`, `landing_page_view` | ❌ Không |
| **Engagement** | `OUTCOME_ENGAGEMENT` | Post Engagements / ThruPlay | `post_engagement`, `video_view` | ❌ Không |
| **Leads** | `OUTCOME_LEADS` | Lead Form Submissions | `lead`, `onsite_conversion.lead_grouped` | ⚠️ Tùy (business counts as conversion) |
| **App Promotion** | `OUTCOME_APP_PROMOTION` | App Installs | `mobile_app_install` | ⚠️ Tùy |
| **Sales** | `OUTCOME_SALES` | Purchases / Add to Cart | `purchase`, `add_to_cart`, `initiate_checkout` | ✅ **CÓ — Đây là Conversion thật** |

**API field quan trọng:** `actions[]` array — mỗi element chứa `{ action_type, value }`.
Phải dùng `campaign.objective` để biết field nào là "kết quả chính".

### Google Ads

| Campaign Type | `advertising_channel_type` | "Conversions" = | Là Conversion thật? |
|---|---|---|---|
| **Search** | `SEARCH` | Primary conversion actions | ✅ Đúng (nếu setup đúng) |
| **Display** | `DISPLAY` | Primary conversion actions | ⚠️ Thường là view-through |
| **Video** | `VIDEO` | Video views / Conversions | ⚠️ Tùy optimization goal |
| **Shopping** | `SHOPPING` | Purchases | ✅ Đúng |
| **Performance Max** | `PERFORMANCE_MAX` | Primary conversions | ✅ Đúng |
| **Demand Gen** | `DEMAND_GEN` | Engagement / Conversions | ⚠️ Tùy |

**Google khác biệt:** Google cho phép define "Conversion Actions" riêng (Purchase, Lead, Contact, Sign-up...) và đánh dấu `primary` vs `secondary`. Field `metrics.conversions` chỉ đếm **primary** conversion actions.

**Vẫn cần lọc thêm:** vì 1 Display campaign chạy awareness cũng có thể report `conversions` (view-through), nhưng ý nghĩa khác hoàn toàn vs Search campaign chạy conversions.

### TikTok Ads

| Objective | `objective_type` | "Results" = | Là Conversion thật? |
|---|---|---|---|
| **Reach** | `REACH` | Impressions Served | ❌ Không |
| **Traffic** | `TRAFFIC` | Clicks | ❌ Không |
| **Video Views** | `VIDEO_VIEW` | 2s/6s/Full Views | ❌ Không |
| **Community Interaction** | `COMMUNITY_INTERACTION` | Follows / Profile Visits | ❌ Không |
| **Lead Gen** | `LEAD_GENERATION` | Lead Submissions | ⚠️ Tùy |
| **App Promotion** | `APP_PROMOTION` | App Installs | ⚠️ Tùy |
| **Website Conversions** | `CONVERSIONS` | Complete Payment / ATC | ✅ **CÓ** |

---

## 3. Data Model mới — Thêm `objective_group` + `result_type`

### 3.1 Campaign table — Thêm fields

```sql
ALTER TABLE campaigns ADD COLUMN objective_group ENUM(
  'awareness',     -- Reach, Brand Awareness
  'consideration', -- Traffic, Video Views, Engagement
  'conversion',    -- Sales, Website Conversions, Shopping
  'lead_gen',      -- Lead Generation
  'app_install'    -- App Promotion
) NOT NULL DEFAULT 'consideration';
```

### 3.2 Mapping rule: Platform Objective → XCAP `objective_group`

```javascript
const OBJECTIVE_MAPPING = {
  // Facebook
  'OUTCOME_AWARENESS':       'awareness',
  'OUTCOME_TRAFFIC':         'consideration',
  'OUTCOME_ENGAGEMENT':      'consideration',
  'OUTCOME_LEADS':           'lead_gen',
  'OUTCOME_APP_PROMOTION':   'app_install',
  'OUTCOME_SALES':           'conversion',

  // Google (advertising_channel_type + bidding_strategy)
  'SEARCH':                  'conversion',      // Default, có thể override
  'DISPLAY':                 'awareness',        // Default
  'VIDEO':                   'consideration',    // Default
  'SHOPPING':                'conversion',
  'PERFORMANCE_MAX':         'conversion',
  'DEMAND_GEN':              'consideration',

  // TikTok
  'REACH':                   'awareness',
  'TRAFFIC':                 'consideration',
  'VIDEO_VIEW':              'consideration',
  'COMMUNITY_INTERACTION':   'consideration',
  'LEAD_GENERATION':         'lead_gen',
  'APP_PROMOTION':           'app_install',
  'CONVERSIONS':             'conversion',
};
```

### 3.3 Result metrics table — Tách biệt per-objective

```sql
CREATE TABLE campaign_results (
  id BIGINT PRIMARY KEY,
  campaign_id BIGINT NOT NULL,
  date DATE NOT NULL,
  platform ENUM('facebook', 'google', 'tiktok'),

  -- Raw metrics (luôn có)
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  spend DECIMAL(18,2) DEFAULT 0,
  ctr DECIMAL(8,4) DEFAULT 0,
  cpc DECIMAL(18,2) DEFAULT 0,

  -- Result metrics (ý nghĩa thay đổi theo objective)
  result_type VARCHAR(50),          -- 'reach', 'link_click', 'purchase', 'lead', 'install'
  result_count INT DEFAULT 0,       -- Số lượng kết quả CHÍNH
  cost_per_result DECIMAL(18,2),    -- Chi phí per kết quả chính

  -- Conversion metrics (CHỈ có ý nghĩa khi objective = conversion/lead_gen)
  conversions INT DEFAULT 0,        -- Purchases / Leads thật
  conversion_value DECIMAL(18,2),   -- Revenue from conversions
  cost_per_conversion DECIMAL(18,2),-- CPA thật

  -- Objective group (denormalized for fast query)
  objective_group ENUM('awareness', 'consideration', 'conversion', 'lead_gen', 'app_install'),

  INDEX idx_objective_date (objective_group, date),
  INDEX idx_campaign_date (campaign_id, date)
);
```

---

## 4. Logic hiển thị Dashboard — ĐÚNG

### 4.1 KPI Cards — Cách tính mới

```
┌─────────────────────┐  ┌─────────────────────┐  ┌────────────────────┐  ┌─────────────────────┐
│ 💰 Tổng Spend       │  │ 🎯 CPA              │  │ 📊 CTR             │  │ ✅ Conversions      │
│ 1,998,876,956 đ     │  │ 2,564,102 đ ✅       │  │ 2.75%              │  │ 312 purchases ✅    │
│ (ALL campaigns)     │  │ (CHỈ conv campaigns) │  │ (ALL campaigns)    │  │ (CHỈ conv campaigns)│
└─────────────────────┘  └─────────────────────┘  └────────────────────┘  └─────────────────────┘
```

**SQL cho từng KPI:**

```sql
-- Tổng Spend (ALL campaigns)
SELECT SUM(spend) AS total_spend
FROM campaign_results
WHERE date BETWEEN :start AND :end;

-- Conversions (CHỈ conversion campaigns)
SELECT SUM(conversions) AS total_conversions
FROM campaign_results
WHERE date BETWEEN :start AND :end
  AND objective_group = 'conversion';

-- CPA (CHỈ conversion campaigns)
SELECT SUM(spend) / NULLIF(SUM(conversions), 0) AS cpa
FROM campaign_results
WHERE date BETWEEN :start AND :end
  AND objective_group = 'conversion';

-- CTR (ALL campaigns — metric chung)
SELECT SUM(clicks) * 100.0 / NULLIF(SUM(impressions), 0) AS ctr
FROM campaign_results
WHERE date BETWEEN :start AND :end;
```

### 4.2 Bảng Top Performers — Tách biệt

**Cách hiện tại (SAI):** Gộp hết → mọi NV hiện cùng metric "Conversions"

**Cách đúng:** Hiện kết quả CHÍNH theo objective group của campaigns mà NV quản lý

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ 🏆 Top Performers (theo chỉ tiêu chuyển đổi)                                │
│                                                                                │
│  1. Trần Minh Tân                                                             │
│     800,000,000 đ • CPA 2,564,102 đ • 312 purchases                           │
│     (Spend từ 5 campaigns chạy Conversions)                                    │
│                                                                                │
│  2. NV-001                                                                     │
│     350,000,000 đ • CPA 1,730,000 đ • 202 purchases                           │
│     (Spend từ 3 campaigns chạy Conversions)                                    │
│                                                                                │
│  3. A                                                                          │
│     200,000,000 đ • CPA 4,081,632 đ • 49 purchases                            │
│     (Spend từ 2 campaigns chạy Conversions)                                    │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│ 📢 Top Performers (theo Traffic/Reach)                                        │
│                                                                                │
│  1. Trần Minh Tân                                                             │
│     555,649,892 đ • 180,000 link clicks • CPC 3,087 đ                         │
│                                                                                │
│  2. NV-001                                                                     │
│     50,429,367 đ • 22,000 link clicks • CPC 2,292 đ                           │
│                                                                                │
│  3. A                                                                          │
│     42,797,697 đ • 12,000 reach • CPM 3,566,474 đ                             │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Dashboard Filter — Thêm toggle

```
┌──────────────────────────────────────────────────────────────────┐
│ 🎯 View by Objective:                                            │
│                                                                    │
│ [All] [🎯 Conversions] [📢 Traffic] [👁️ Awareness] [📝 Leads]   │
│                                                                    │
│ Khi chọn "Conversions":                                           │
│   → KPI cards CHỈ hiện data từ conversion campaigns               │
│   → Tables CHỈ hiện conversion campaigns                          │
│   → Charts CHỈ vẽ conversion campaign data                        │
│                                                                    │
│ Khi chọn "All":                                                   │
│   → KPI cards hiện tổng hợp, nhưng TÁCH BIỆT:                   │
│     💰 Total Spend (all) | 🎯 Conv: 312 | 📝 Leads: 251         │
│     📢 Clicks: 8,200    | 👁️ Reach: 50K                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Cách API lấy đúng fields

### 5.1 Facebook — Lấy `campaign.objective` + `actions[]`

```javascript
// Facebook Marketing API — Lấy campaign với objective
const response = await fb.get(`/act_{ad_account_id}/campaigns`, {
  fields: ['name', 'objective', 'status', 'daily_budget'],
});

// Insights với actions breakdown
const insights = await fb.get(`/act_{ad_account_id}/insights`, {
  level: 'campaign',
  fields: [
    'campaign_name', 'campaign_id', 'objective',
    'spend', 'impressions', 'clicks', 'ctr', 'cpc',
    'actions',           // Array: [{action_type, value}, ...]
    'action_values',     // Array: [{action_type, value}, ...]
    'cost_per_action_type',
  ],
  time_range: { since: '2026-05-01', until: '2026-05-29' },
});

// Parse results theo objective
function extractConversions(campaign) {
  const objective = campaign.objective;
  const actions = campaign.actions || [];

  if (objective === 'OUTCOME_SALES') {
    // Chỉ đếm purchase actions
    const purchases = actions.find(a => a.action_type === 'purchase');
    return {
      objective_group: 'conversion',
      result_type: 'purchase',
      result_count: purchases?.value || 0,
      conversion_value: getActionValue(campaign, 'purchase'),
    };
  }
  else if (objective === 'OUTCOME_LEADS') {
    const leads = actions.find(a =>
      a.action_type === 'lead' ||
      a.action_type === 'onsite_conversion.lead_grouped'
    );
    return {
      objective_group: 'lead_gen',
      result_type: 'lead',
      result_count: leads?.value || 0,
    };
  }
  else if (objective === 'OUTCOME_TRAFFIC') {
    const clicks = actions.find(a => a.action_type === 'link_click');
    return {
      objective_group: 'consideration',
      result_type: 'link_click',
      result_count: clicks?.value || 0,
    };
  }
  // ... other objectives
}
```

### 5.2 Google Ads — Lấy `campaign.type` + `conversion_action`

```javascript
// Google Ads API — Campaign with conversion actions
const query = `
  SELECT
    campaign.name,
    campaign.advertising_channel_type,
    campaign.bidding_strategy_type,
    metrics.cost_micros,
    metrics.impressions,
    metrics.clicks,
    metrics.conversions,
    metrics.conversions_value,
    metrics.cost_per_conversion,
    segments.conversion_action_name,
    segments.conversion_action_category
  FROM campaign
  WHERE segments.date BETWEEN '2026-05-01' AND '2026-05-29'
    AND campaign.status = 'ENABLED'
  ORDER BY metrics.cost_micros DESC
`;

// Google đã tự tách primary/secondary conversions
// Chỉ cần filter thêm theo campaign type nếu muốn
```

### 5.3 TikTok Ads — Lấy `objective_type` + `result`

```javascript
// TikTok Ads API
const response = await tiktok.get('/report/integrated/get/', {
  advertiser_id: 'xxx',
  report_type: 'BASIC',
  dimensions: ['campaign_id'],
  data_level: 'AUCTION_CAMPAIGN',
  metrics: [
    'campaign_name', 'objective_type',
    'spend', 'impressions', 'clicks', 'ctr', 'cpc',
    'result', 'cost_per_result', 'result_rate',
    'conversion',              // Conversion events
    'complete_payment',        // Purchase events specifically
    'total_complete_payment_rate',
  ],
  start_date: '2026-05-01',
  end_date: '2026-05-29',
});

// Parse theo objective
function parseTikTokResults(campaign) {
  if (campaign.objective_type === 'CONVERSIONS') {
    return {
      objective_group: 'conversion',
      result_type: 'purchase',
      result_count: campaign.complete_payment || campaign.conversion,
      cost_per_result: campaign.cost_per_result,
    };
  }
  // ... other objectives
}
```

---

## 6. Ví dụ trước/sau khi Fix

### TRƯỚC (hiện tại — SAI)

```
Dashboard hiện: Conversions = 563, CPA = 3,550,403 đ

Thực tế bên trong:
├── 312 purchases (từ 10 Sales campaigns, spend 800M)     ← CONVERSION THẬT
├── 251 leads (từ 5 Lead Gen campaigns, spend 200M)       ← LEAD, CHƯA CHẮC LÀ CONVERSION
├── 8,200 link clicks (từ 8 Traffic campaigns, spend 600M) ← KHÔNG PHẢI CONVERSION
└── 50,000 reach (từ 3 Awareness campaigns, spend 399M)    ← KHÔNG PHẢI CONVERSION

CPA = 1,998,876,956 / 563 = 3,550,403 đ  ← SAI
```

### SAU (fix — ĐÚNG)

```
Dashboard mới — Objective Filter: [🎯 Conversions] selected

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ 💰 Conv Spend    │  │ 🎯 CPA          │  │ ✅ Purchases     │
│ 800,000,000 đ    │  │ 2,564,102 đ     │  │ 312              │
│ (10 campaigns)   │  │ ▼ 28% vs trộn   │  │ (Sales obj only) │
└──────────────────┘  └──────────────────┘  └──────────────────┘

Dashboard mới — Objective Filter: [All] selected

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 💰 Spend     │ │ ✅ Purchases │ │ 📝 Leads     │ │ 🔗 Clicks    │ │ 👁️ Reach     │
│ ~2 tỷ đ      │ │ 312          │ │ 251          │ │ 8,200        │ │ 50,000       │
│ All campaigns│ │ CPA 2.56M    │ │ CPL 797K     │ │ CPC 73K      │ │ CPM 7.98M    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

---

## 7. Tóm tắt — Checklist Implementation

- [ ] **Data model:** Thêm `objective_group` vào table campaigns
- [ ] **API sync:** Parse `campaign.objective` khi sync data từ FB/GG/TT
- [ ] **Mapping function:** Map platform objective → XCAP objective_group
- [ ] **Result extraction:** Parse `actions[]` array (FB), `conversion_action` (GG), `result` (TT) theo objective
- [ ] **Dashboard KPIs:** Filter metrics theo objective_group
  - CPA = Spend (conv campaigns only) / Conversions
  - Conv Rate = Conversions / Clicks (conv campaigns only)
- [ ] **UI filter:** Thêm Objective toggle trên Dashboard
- [ ] **Top Performers:** Tách bảng theo objective group hoặc hiện cột riêng
- [ ] **Reports:** Cho phép filter/group by objective trong báo cáo

> [!IMPORTANT]
> **Rule vàng:** Không bao giờ cộng `results` từ các objective khác nhau. Mỗi objective có metric "kết quả" riêng, chỉ so sánh được trong cùng objective group.
