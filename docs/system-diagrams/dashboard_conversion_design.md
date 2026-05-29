# 🎯 Dashboard Ngoại Sàn — Conversion-Centric Design

> **Nguyên tắc:** Dashboard mặc định CHỈ hiện data từ campaigns có `objective_group = 'conversion'`.
> Các campaign Traffic/Awareness/Leads nằm trong tab riêng, không ảnh hưởng KPI chính.

---

## Layout tổng quan

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ 🔝 HEADER: XCAP | Dashboard | Tài sản | Chiến dịch | ...  │ 👤 Admin ▾    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [Facebook] [Google] [TikTok]    [All DA ▾]    [📅 30 ngày qua ▾]          │
│                                                                              │
│  ┌─ KPI 1 ──────┐ ┌─ KPI 2 ──────┐ ┌─ KPI 3 ──────┐ ┌─ KPI 4 ──────┐    │
│  │ 💰 Spend     │ │ 🎯 CPA       │ │ 📊 CTR       │ │ ✅ Conv.     │    │
│  │ 1.2 tỷ đ     │ │ 2,564,102 đ  │ │ 3.41%        │ │ 468          │    │
│  │ ▲ 8.2%       │ │ ▼ 12.3%      │ │ ▲ 0.5%       │ │ ▲ 15.7%     │    │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘    │
│                                                                              │
│  ┌─ Conversion Funnel ─────────────┐ ┌─ Conv by Platform ──────────────┐   │
│  │                                  │ │                                  │   │
│  │  Impressions → Clicks → Conv    │ │  🟦 FB: 58% (271)               │   │
│  │  18.5M     →  631K  →  468     │ │  🟥 GG: 27% (126)               │   │
│  │       CTR 3.41%   CR 0.074%    │ │  🟨 TT: 15% (71)                │   │
│  │                                  │ │                                  │   │
│  └──────────────────────────────────┘ └──────────────────────────────────┘   │
│                                                                              │
│  ┌─ CPA Trend (30 ngày) ──────────────────────────────────────────────┐    │
│  │  3.5M │                                                             │    │
│  │  3.0M │    ╱╲                                                       │    │
│  │  2.5M │╲  ╱  ╲    ╱╲                                               │    │
│  │  2.0M │ ╲╱    ╲╱╱  ╲───── target CPA                               │    │
│  │  1.5M │                ╲                                             │    │
│  │       └──────────────────────────────────────────────────────────   │    │
│  │        1    5    10   15   20   25   30                              │    │
│  │       ── FB  ── GG  ── TT  --- Target                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─ Top Campaigns (by CPA) ──────────────────────────────────────────┐     │
│  │ Campaign            │ Platform│ Spend      │ Conv │ CPA       │CTR │     │
│  │─────────────────────┼─────────┼────────────┼──────┼───────────┼────│     │
│  │ Sale Tháng 5 - FB01 │ 🟦 FB  │ 320,000,000│  156 │ 2,051,282 │4.1%│     │
│  │ Retarget Warm - FB03│ 🟦 FB  │ 180,000,000│  115 │ 1,565,217 │5.2%│     │
│  │ Search Brand - GG01 │ 🟥 GG  │ 250,000,000│  126 │ 1,984,127 │3.8%│     │
│  │ Conv TT - TT02      │ 🟨 TT  │ 150,000,000│   71 │ 2,112,676 │3.1%│     │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─ Spend by Project ─────────────────┐ ┌─ Top Performers (by CPA) ─────┐  │
│  │ Project    │Spend    │Conv│CPA     │ │ NV          │Spend  │Conv│CPA  │  │
│  │────────────┼─────────┼────┼────────│ │─────────────┼───────┼────┼─────│  │
│  │ DA Khác    │ 800M    │ 292│ 2.74M  │ │ T.Minh Tân  │ 600M  │292 │2.05M│  │
│  │ da1        │ 400M    │ 176│ 2.27M  │ │ NV-001      │ 400M  │176 │2.27M│  │
│  └────────────────────────────────────┘ └────────────────────────────────┘  │
│                                                                              │
│  ┌─ Spend Trend ─────────────────────┐ ┌─ Alerts ────────────────────────┐  │
│  │  80M │          ╱╲                 │ │ 🔴 CPA vượt target — GG03      │  │
│  │  60M │    ╱╲  ╱╱  ╲               │ │ 🟡 Budget sắp hết — FB01       │  │
│  │  40M │╲╱╱  ╲╱╱     ╲──            │ │ 🟢 Conv tăng 40% — TT02        │  │
│  │  20M │                             │ │ 🔴 1,850 giao dịch chưa đối soát│  │
│  │   0  └────────────────────         │ └────────────────────────────────┘  │
│  │       1   6   11  16  21  26  31   │                                      │
│  └────────────────────────────────────┘                                      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Chi tiết từng thành phần

### 1. 📊 KPI Cards — Chỉ từ Conversion Campaigns

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 💰 Spend        │  │ 🎯 CPA          │  │ 📊 CTR          │  │ ✅ Conversions  │
│                 │  │                 │  │                 │  │                 │
│  1,200,000,000  │  │  2,564,102 đ    │  │  3.41%          │  │  468            │
│                 │  │                 │  │                 │  │                 │
│  ▲ 8.2% vs     │  │  ▼ 12.3% vs     │  │  ▲ 0.5% vs      │  │  ▲ 15.7% vs    │
│  tháng trước    │  │  tháng trước    │  │  tháng trước    │  │  tháng trước    │
│                 │  │  (CPA giảm=tốt) │  │                 │  │                 │
│  26 campaigns   │  │                 │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

**SQL:**

```sql
SELECT
  SUM(spend)                                        AS total_spend,
  SUM(conversions)                                  AS total_conversions,
  SUM(spend) / NULLIF(SUM(conversions), 0)          AS cpa,
  SUM(clicks) * 100.0 / NULLIF(SUM(impressions), 0) AS ctr,
  COUNT(DISTINCT campaign_id)                        AS campaign_count
FROM campaign_results
WHERE date BETWEEN :start AND :end
  AND objective_group = 'conversion';     -- ← CHỈ conversion campaigns
```

> [!IMPORTANT]
> **Mọi số trên dashboard đều filter `objective_group = 'conversion'`.**
> Traffic/Awareness campaigns KHÔNG ảnh hưởng con số nào trên trang chính.

---

### 2. 🔻 Conversion Funnel

Hiển thị pipeline chuyển đổi: từ Impressions → Clicks → Conversions

```
┌──────────────────────────────────────────────────────────────────┐
│  Conversion Funnel (30 ngày — CHỈ conversion campaigns)         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐         │
│  │████████████████████████████████████████████████████ │ 18.5M   │
│  │               Impressions                          │          │
│  └─────────────────────────────────────────────────────┘         │
│                         │                                        │
│                    CTR 3.41%                                     │
│                         ▼                                        │
│  ┌─────────────────────────────────┐                             │
│  │██████████████████████████████   │ 631,000 Clicks              │
│  └─────────────────────────────────┘                             │
│                         │                                        │
│                   Conv Rate 0.074%                                │
│                         ▼                                        │
│  ┌──────────┐                                                    │
│  │██████████│ 468 Conversions                                    │
│  └──────────┘                                                    │
│                                                                  │
│  CPA: 2,564,102 đ    │    Spend: 1.2 tỷ đ                      │
└──────────────────────────────────────────────────────────────────┘
```

**Ý nghĩa:** Marketer nhìn funnel biết ngay bottleneck ở đâu:
- CTR thấp → vấn đề Creative/Targeting
- Conv Rate thấp → vấn đề Landing Page/Offer

---

### 3. 📈 CPA Trend Chart

```
┌──────────────────────────────────────────────────────────────────┐
│  CPA Trend — 30 ngày (mỗi line = 1 platform)                   │
│                                                                  │
│  4.0M │                                                          │
│       │                                                          │
│  3.5M │         ╱╲                                               │
│       │   ╱╲   ╱  ╲                                              │
│  3.0M │──╱──╲─╱────╲──────── 🟥 Google (CPA cao nhất)           │
│       │ ╱    ╲      ╲                                            │
│  2.5M │╱      ╲      ╲╱╲─── ···· Target CPA: 2.5M ····         │
│       │        ╲        ╲                                        │
│  2.0M │         ╲────────── 🟦 Facebook (CPA ổn định)           │
│       │                                                          │
│  1.5M │──────────────────── 🟨 TikTok (CPA thấp nhất)           │
│       │                                                          │
│  1.0M └──┬──┬──┬──┬──┬──┬──┬──┬──┬──                            │
│          1  4  7  10 13 16 19 22 25 28                           │
│                                                                  │
│  ── FB    ── GG    ── TT    ···· Target                          │
│  Avg: 2.05M  Avg: 2.98M  Avg: 1.87M                            │
└──────────────────────────────────────────────────────────────────┘
```

**Insight từ chart:**
- Nếu CPA tăng → budget đang kém hiệu quả, cần tối ưu
- Nếu CPA giảm → campaigns đang scale tốt
- So sánh vs Target CPA → biết ngay vượt budget hay chưa

---

### 4. 🏆 Top Campaigns — Xếp hạng theo CPA

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Top Campaigns (Conversion) — sorted by CPA ascending (tốt nhất ↑)     │
│                                                                          │
│  │ # │ Campaign              │ Plt │ NV          │ Spend     │Conv│ CPA       │ CTR  │
│  │───│───────────────────────│─────│─────────────│───────────│────│───────────│──────│
│  │ 1 │ Retarget Warm - FB03  │ 🟦  │ T.Minh Tân  │ 180,000,000│ 115│ 1,565,217│ 5.2% │ ← CPA thấp nhất
│  │ 2 │ Search Brand - GG01   │ 🟥  │ NV-001      │ 250,000,000│ 126│ 1,984,127│ 3.8% │
│  │ 3 │ Sale Tháng 5 - FB01   │ 🟦  │ T.Minh Tân  │ 320,000,000│ 156│ 2,051,282│ 4.1% │
│  │ 4 │ Conv TT - TT02        │ 🟨  │ A           │ 150,000,000│  71│ 2,112,676│ 3.1% │
│  │ 5 │ PMax Shopping - GG02  │ 🟥  │ NV-001      │ 200,000,000│  78│ 2,564,102│ 3.5% │
│  │ 6 │ 🔴 Display Conv - GG03│ 🟥  │ A           │ 100,000,000│  22│ 4,545,454│ 1.2% │ ← CPA vượt target!
│  │───│───────────────────────│─────│─────────────│───────────│────│───────────│──────│
│  │   │ TỔNG                  │     │             │1,200,000,000│ 468│ 2,564,102│ 3.41%│
│  └───────────────────────────────────────────────────────────────────────────────────┘
│
│  ⚡ Quick actions: [📊 Xem chi tiết] [⏸️ Pause kém] [📥 Export CSV]
└──────────────────────────────────────────────────────────────────────────┘
```

**Tính năng:**
- Mặc định sort by CPA ascending (campaign tốt nhất lên đầu)
- Highlight đỏ campaigns có CPA > Target
- Cột NV → biết ai đang quản lý campaign nào
- Quick actions: pause campaigns kém hiệu quả

---

### 5. 📊 Conversions by Platform

```
┌──────────────────────────────────────┐
│  Conversions by Platform             │
│                                      │
│        ┌────────────┐                │
│       ╱  🟦 FB      ╲               │
│      │   271 (58%)   │               │
│       ╲  CPA: 2.05M ╱               │
│        └──────┬─────┘                │
│      ┌────────┴────────┐             │
│     ╱ 🟥 GG   ╲╱ 🟨 TT ╲            │
│    │  126 (27%) │ 71 (15%)│           │
│    │  CPA:2.98M │ CPA:1.87M│          │
│     ╲          ╱╲         ╱           │
│      └────────┘  └───────┘            │
│                                      │
│  Platform tốt nhất: TikTok (CPA ↓)  │
│  Volume cao nhất: Facebook (58%)     │
└──────────────────────────────────────┘
```

---

### 6. 💼 Spend by Project + Conversion Metrics

```
┌──────────────────────────────────────────────────────────────────────┐
│  💼 Spend by Project (Conversion Campaigns Only)                     │
│                                                                      │
│  │ Project        │ Conv Spend │████████████████│ Conv │ CPA       │
│  │────────────────│────────────│────────────────│──────│───────────│
│  │ DA Khác        │ 800,000,000│████████████████│  292 │ 2,739,726 │
│  │                │            │ 92%            │      │           │
│  │ da1            │ 400,000,000│████████       │  176 │ 2,272,727 │
│  │                │            │ 67%            │      │           │
│  └────────────────────────────────────────────────────────────────────┘
│
│  Progress bar = % budget đã dùng cho conversion campaigns
└──────────────────────────────────────────────────────────────────────┘
```

---

### 7. 👥 Top Performers — Xếp hạng NV theo CPA

```
┌──────────────────────────────────────────────────────────────────┐
│  👥 Spend by Nhân sự (Conversion Campaigns Only)                 │
│                                                                  │
│  │ NV             │ Conv Spend    │ Conv │ CPA         │ CTR  │ Campaigns │
│  │────────────────│───────────────│──────│─────────────│──────│───────────│
│  │ 🟢 T.Minh Tân  │ 600,000,000   │  292 │ 2,054,794 đ │ 4.52%│     8    │
│  │ 🟢 NV-001      │ 400,000,000   │  127 │ 3,149,606 đ │ 3.21%│     5    │
│  │ 🟡 A           │ 200,000,000   │   49 │ 4,081,632 đ │ 2.18%│     3    │
│  └────────────────────────────────────────────────────────────────────────┘
│
│  🟢 CPA < Target    🟡 CPA ≈ Target    🔴 CPA > Target
└──────────────────────────────────────────────────────────────────┘
```

---

### 8. ⚠️ Alerts — Conversion-focused

```
┌──────────────────────────────────────────────────────────────────┐
│  ⚠️ Alerts                                                       │
│                                                                  │
│  🔴 CPA vượt target 82% — GG03 Display Conv                     │
│     CPA: 4,545,454 đ vs Target: 2,500,000 đ                     │
│     [Xem chi tiết] [Pause campaign]                              │
│                                                                  │
│  🟡 Budget sắp hết — FB01 Sale Tháng 5                          │
│     Đã dùng 94% budget (320M / 340M)                             │
│     [Tăng budget] [Xem chi tiết]                                 │
│                                                                  │
│  🟢 Conv tăng mạnh — TT02 Conv TT                               │
│     Conversions +40% so với tuần trước, CPA giảm 15%             │
│     [Scale budget] [Xem chi tiết]                                │
│                                                                  │
│  🔴 1,850 giao dịch chưa đối soát                               │
│     [Đối soát ngay]                                              │
└──────────────────────────────────────────────────────────────────┘
```

**Alert rules cho conversion dashboard:**

| Alert | Điều kiện | Severity |
|---|---|---|
| CPA vượt target | CPA > Target × 1.3 (vượt 30%) | 🔴 Critical |
| CPA gần target | CPA > Target × 1.0 | 🟡 Warning |
| Conv giảm đột ngột | Conv today < Conv avg_7d × 0.5 | 🔴 Critical |
| Conv tăng mạnh | Conv today > Conv avg_7d × 1.3 | 🟢 Info (scale opportunity) |
| Budget sắp hết | Spend > Budget × 0.9 | 🟡 Warning |
| Campaign không có conv | Conv = 0 sau 3 ngày chạy | 🔴 Critical |
| Đối soát pending | Transactions chưa match > 1,000 | 🔴 Critical |

---

## 9. Header Filter — Campaign chạy không phải Conversion

Nếu marketer muốn xem campaigns khác (Traffic, Awareness), dùng **tab phụ** ở header:

```
┌──────────────────────────────────────────────────────────────────┐
│  📊 Dashboard                                                    │
│                                                                  │
│  [🎯 Conversions ✓] [📢 Traffic] [👁️ Awareness] [📝 Leads]     │
│                                                                  │
│  Khi chọn tab khác:                                              │
│  ┌────────────────────────────────────────────────────────┐      │
│  │ Tab: Traffic                                           │      │
│  │ KPI cards đổi thành:                                   │      │
│  │  💰 Spend | 🔗 Link Clicks | 💵 CPC | 📊 CTR         │      │
│  │                                                        │      │
│  │ Table đổi thành:                                       │      │
│  │  Campaign | Platform | Spend | Clicks | CPC | CTR     │      │
│  └────────────────────────────────────────────────────────┘      │
│                                                                  │
│  Tab Conversion luôn là DEFAULT khi mở Dashboard                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## 10. Tổng kết — So sánh Dashboard cũ vs mới

| Thành phần | Dashboard cũ (trộn lẫn) | Dashboard mới (Conversion-centric) |
|---|---|---|
| **KPI Cards** | Spend, CPA*, CTR, Conv* (tất cả objectives) | Spend, CPA, CTR, Conv (CHỈ conversion obj) |
| **CPA** | Spend_all / Results_all = SAI | Spend_conv / Conv_real = ĐÚNG |
| **Top Campaigns** | Sort by spend, trộn objectives | Sort by CPA, CHỈ conversion campaigns |
| **Top Performers** | "Leads" (unclear) | Conversions + CPA per NV |
| **Charts** | Spend by Platform (all) | CPA Trend + Conversion Funnel |
| **Alerts** | Generic | CPA-based alerts (vượt target, conv giảm) |
| **Default tab** | All mixed | 🎯 Conversions (tab phụ cho Traffic/Awareness) |

> [!IMPORTANT]
> **Rule:** Mọi chỉ số trên Dashboard mặc định đều filter `WHERE objective_group = 'conversion'`.
> Marketer mở Dashboard → thấy ngay CPA thật, Conversion thật, không bị nhiễu bởi Traffic/Awareness campaigns.
