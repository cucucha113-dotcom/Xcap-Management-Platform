# 📋 Facebook Ads Manager — Annotated Data Map

> **Account:** X-TERRA 05 BM4
> **Account ID:** `1162586225600942`
> **Ngày chụp:** 11/05/2026 — Screenshots thật từ tài khoản QC
> **Tổng:** 37 chiến dịch, 46 nhóm QC, 46 quảng cáo

---

## 1️⃣ CAMPAIGNS — Chiến dịch (Default View: Hiệu quả)

![Campaigns Default View annotated](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/fb_campaigns_ann.png)

### Header & Controls

| Ô | Field | Vị trí | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **A** | `account_name` + `account_id` | Góc trên trái, dropdown | "X-TERRA 05 BM4 (11625...)" | Click dropdown → thấy full ID |
| **B** | `date_range` | Góc trên phải | "30 ngày qua: 10/4/2026 – 9/5/2026" | Tùy chỉnh khoảng thời gian |
| **C** | `level_tabs` | Dưới header | "Chiến dịch \| Nhóm quảng cáo \| Quảng cáo" | 3 cấp: Campaign / Ad Set / Ad |
| **⑨** | `column_preset` | Toolbar | "Cột: Hiệu quả" | Dropdown chọn preset cột |

### Bảng dữ liệu Campaign

| Ô | Cột trên UI (VN) | Field API | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **⑩** | Toggle ON/OFF | `campaign_status` | 🔵 ON / ⚫ OFF | Bật/tắt campaign |
| **①** | Chiến dịch | `campaign_name` | "NAMDP - RAT BAIT - TEST 7/5" | Tên chiến dịch |
| **②** | Phân phối | `delivery_status` | "Nhóm quảng c..." | Đang phân phối / Đã tắt |
| **③** | Hành động | `action` | "—" | Mục tiêu: chuyển đổi/click... |
| **④** | Kết quả | `results` | 2, 3, 1 | Số kết quả theo objective |
| **⑤** | Chi phí trên mỗi kết quả | `cost_per_result` | 78.411 đ, 82.060 đ | = spend / results |
| **⑥** | Ngân sách | `budget` | "299.999 đ Hàng ngày" / "Sử dụng ngân s..." | Daily budget hoặc Lifetime |
| **⑦** | Số tiền đã chi tiêu | `spend` | 156.821 đ, 106.430 đ | **KPI CHÍNH** — tổng chi |
| **⑧** | Lượt hiển thị | `impressions` | (cột cuối, cần scroll phải) | Tổng impressions |

---

## 2️⃣ CAMPAIGNS — Scroll phải (Reach, Impressions, CPM)

![Campaigns Performance Columns annotated](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/fb_performance_ann.png)

| Ô | Cột trên UI | Field API | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **①** | Số tiền đã chi tiêu | `spend` | 156.821 đ | Đơn vị VNĐ |
| **②** | Lượt hiển thị | `impressions` | 1.835, 1.063, 2.375 | Số lần hiển thị |
| **③** | Người tiếp cận | `reach` | 1.634, 972, 2.091 | Số người unique thấy QC |
| **④** | Tần suất | `frequency` | 1,12 / 1,09 / 1,14 | = impressions / reach |
| **⑤** | CPM | `cpm` | 85.461 đ, 100.122 đ | Chi phí / 1000 impressions |
| **⑥** | Lượt mua | `purchases` | — | Conversion purchase (nếu có) |
| **⑦** | Kết quả từ 37 chiến dịch | `total_campaigns` | 37 | Tổng campaigns trong account |

---

## 3️⃣ CAMPAIGNS — Preset "Hiệu quả và lượt click"

![Clicks Column Preset annotated](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/fb_clicks_ann.png)

> [!IMPORTANT]
> Chuyển preset cột bằng cách click "Cột: Hiệu quả" → chọn "Hiệu quả và lượt click"

| Ô | Cột trên UI | Field API | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **A** | Column preset | `column_preset` | "Hiệu quả và lượt click" | Preset hiện tại |
| **①** | CTR (tỷ lệ click vào liên kết) | `ctr_link` | 1,63% / 1,88% / 1,64% | CTR chỉ link clicks |
| **②** | Lượt click (tất cả) | `clicks_all` | 57, 36, 71 | Tổng tất cả loại click |
| **③** | CTR (Tất cả) | `ctr_all` | 3,11% / 3,39% / 2,99% | CTR toàn bộ clicks |
| **④** | CPC (tất cả) | `cpc_all` | 2.751 đ, 2.956 đ, 3.467 đ | Chi phí mỗi click |
| **⑤** | Lượt xem trang đích | `landing_page_views` | 15, 31, 10 | Số lượt xem LP thực tế |
| **⑥** | Chi phí trên mỗi lượt xem trang đích | `cost_per_landing_view` | 10.455 đ, 7.095 đ | Chi phí / landing view |

---

## 4️⃣ AD SETS — Nhóm quảng cáo

![Ad Sets level annotated](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/fb_adsets_ann.png)

> Tab "Nhóm quảng cáo" — hiển thị 37 ad sets

| Ô | Cột trên UI | Field API | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **A** | Tab level | - | "Nhóm quảng cáo" | Cấp Ad Set |
| **①** | Chiến dịch | `campaign_name` | "NAMDP - RAT BAIT - TEST 7/5" | Campaign cha |
| **②** | Phân phối | `delivery_status` | "Nhóm quảng c..." | Active / Paused / Off |
| **③** | Hành động | `action` | "—" | Action type |
| **④** | Cài đặt ghi nhận | `attribution_setting` | "Lượt click tro..." | Attribution window: 7-day click |
| **⑤** | Kết quả | `results` | 2, 3, 1 | Conversions / leads... |
| **⑥** | Người tiếp cận | `reach` | 1.634, 972, 2.091, 3.487 | Unique reach |
| **⑦** | Tần suất | `frequency` | 1,12 / 1,09 / 1,14 | Avg frequency |
| **⑧** | Chi phí trên mỗi kết quả | `cost_per_result` | (cột cuối, cần scroll) | Cost per conversion |
| **⑨** | Column preset | - | "Hiệu quả và lượt click" | Preset đang chọn |

---

## 5️⃣ ADS — Quảng cáo (với Creative thumbnails)

![Ads level with creatives annotated](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/fb_ads_ann.png)

> Tab "Quảng cáo" — hiển thị 46 ads với ảnh/video thumbnail

| Ô | Cột trên UI | Field API | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **A** | Tab level | - | "Quảng cáo" (46 ads) | Cấp Ad đơn lẻ |
| **①** | Thumbnail | `creative_thumbnail` | Ảnh/video preview | Hình ảnh creative QC |
| **②** | Quảng cáo | `ad_name` | "NAMDP - RAT BAIT - TEST 9/5" | Tên QC |
| **③** | Phân phối | `delivery_status` | "Chiến dịch: Tắt" / "Nhóm quảng c." | Status kế thừa từ campaign/adset |
| **④** | Cài đặt ghi nhận | `attribution` | "Lượt click tro..." | Attribution window |
| **⑤** | Kết quả | `results` | 1, 2 | Số conversion |
| **⑥** | Người tiếp cận | `reach` | 1.297, 581, 533 | Unique reach per ad |
| **⑦** | Tần suất | `frequency` | 1,06 / 1,07 | Avg frequency per ad |
| **⑧** | Tổng ads | `total_ads` | 46 | "Kết quả từ 46 quảng cáo" |

---

## 6️⃣ BILLING — Hoạt động thanh toán (Payment Activity)

![Billing Payment Activity annotated](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/fb_billing_trans_ann.png)

> [!IMPORTANT]
> Trang Billing nằm TÁCH BIỆT khỏi Ads Manager. Truy cập qua: `Lập hóa đơn và thanh toán` (Billing Hub)

### Sidebar Billing (4 mục)

| Ô | Menu item | Chức năng |
|---|---|---|
| **①** | Tài khoản | Thông tin tài khoản QC |
| **①** | Phương thức thanh toán | Thẻ Visa/Mastercard đã thêm |
| **①** | **Hoạt động thanh toán** | Lịch sử giao dịch — **ĐANG XEM** |
| **①** | Hạn mức tín dụng | Credit limit setting |

### Header Billing

| Ô | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|
| **②** | `account_name` + `account_id` | "X-TERRA 05 BM4 (1162586225600942)" | Tên TK + full ID |
| **③** | `outstanding_balance` | **852.817 đ** | **DƯ NỢ** — Số tiền cần thanh toán |
| **④** | `pay_now_button` | "Thanh toán ngay" | Nút thanh toán |
| **⑤** | `transaction_filter` | "Giao dịch" dropdown | Lọc loại giao dịch |
| **⑥** | `date_range` | "5 Tháng 5, 2026 – 11 Tháng 5, 2026" | Khoảng thời gian |

### Bảng giao dịch (Transaction Table)

| Ô | Cột trên UI | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **⑦** | ID giao dịch | `transaction_id` | "26757767230574672-26757767347241327" | ID duy nhất |
| **⑧** | Ngày | `transaction_date` | "6 Tháng 5, 2026" | Ngày giao dịch |
| **⑨** | Số tiền | `amount` | **1.200.000 đ** | Số tiền thanh toán |
| **⑩** | Phương thức thanh toán | `payment_method` | "Visa ··· 3153 / 663YQPHL72" | Thẻ + mã tham chiếu |
| **⑪** | Trạng thái thanh toán | `payment_status` | 🔴 **"Không thành công"** | FAILED / Thành công |

---

## 7️⃣ BILLING — Phương thức thanh toán (Payment Methods)

![Billing Payment Methods annotated](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/fb_billing_methods_ann.png)

### Dữ liệu Payment Methods

| Ô | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|
| **①** | Page title | "Phương thức thanh toán" | Trang quản lý thẻ |
| **②** | `billing_sidebar` | 4 menu items | Navigation |
| **③** | `permission_notice` | "Bạn cần quyền để xem" | Cần quyền BM Admin |
| **④** | `account_selector` | "X-TERRA 05 BM4 (1162586225600...)" | Dropdown chọn TK |
| **⑤** | `default_card` | **Visa ···· 8577** (Mặc định, hết hạn 10/31) | Thẻ thanh toán chính |
| **⑥** | `add_payment_method` | "Thêm phương thức thanh toán" | Nút thêm thẻ mới |
| **⑦** | `account_type_tabs` | "Tài khoản quảng cáo \| Tài khoản WhatsApp Business" | Tabs loại TK |

---

## 📊 TỔNG HỢP — Tất cả Column Presets có sẵn

> Từ screenshot dropdown "Cột:", các preset có sẵn:

| Preset | Tên VN | Các cột chính |
|---|---|---|
| **Hiệu quả** (default) | Performance | results, cost_per_result, spend, budget, impressions |
| **Hiệu quả và lượt click** | Performance & Clicks | ctr_link, clicks_all, ctr_all, cpc_all, landing_views |
| **Lượt tương tác** | Engagement | likes, comments, shares, post_engagement |
| **Phân phối** | Delivery | reach, frequency, cpm, impressions |
| **Thiết lập** | Setup | objective, targeting, placement |
| **Tùy chỉnh cột** | Custom columns | Chọn bất kỳ metric nào |

---

## 📋 MASTER DATA FIELDS — Tổng hợp tất cả fields cần lấy (28 fields)

### 🔴 Ưu tiên cao (Core KPIs — Ads Manager)

| # | Field | Tên VN | Vị trí | Column Preset |
|---|---|---|---|---|
| 1 | `spend` | Số tiền đã chi tiêu | Campaigns table | Hiệu quả |
| 2 | `results` | Kết quả | Campaigns table | Hiệu quả |
| 3 | `cost_per_result` | Chi phí/kết quả | Campaigns table | Hiệu quả |
| 4 | `impressions` | Lượt hiển thị | Campaigns table (scroll phải) | Hiệu quả |
| 5 | `reach` | Người tiếp cận | Campaigns table (scroll phải) | Hiệu quả |
| 6 | `cpc_all` | CPC (tất cả) | Campaigns table | Hiệu quả & clicks |
| 7 | `ctr_all` | CTR (tất cả) | Campaigns table | Hiệu quả & clicks |
| 8 | `campaign_name` | Chiến dịch | Cột đầu tiên | Mọi preset |

### 🔴 Ưu tiên cao (Billing — Thanh toán)

| # | Field | Tên VN | Vị trí | Ghi chú |
|---|---|---|---|---|
| 9 | `outstanding_balance` | Dư nợ | Billing > Header | **852.817 đ** — số tiền cần TT |
| 10 | `transaction_id` | ID giao dịch | Billing > Transaction table | Unique ID |
| 11 | `amount` | Số tiền | Billing > Transaction table | 1.200.000 đ |
| 12 | `payment_status` | Trạng thái TT | Billing > Transaction table | Thành công / Không thành công |
| 13 | `payment_method` | Phương thức TT | Billing > Transaction table | Visa ··· 3153 |
| 14 | `default_card` | Thẻ mặc định | Billing > Payment Methods | Visa ···· 8577 (exp 10/31) |

### 🟡 Ưu tiên trung bình (Performance)

| # | Field | Tên VN | Vị trí | Column Preset |
|---|---|---|---|---|
| 15 | `budget` | Ngân sách | Campaigns table | Hiệu quả |
| 16 | `delivery_status` | Phân phối | Campaigns table | Mọi preset |
| 17 | `frequency` | Tần suất | Campaigns table | Hiệu quả |
| 18 | `cpm` | CPM | Campaigns (scroll phải) | Hiệu quả |
| 19 | `ctr_link` | CTR link | Campaigns table | Hiệu quả & clicks |
| 20 | `clicks_all` | Lượt click (tất cả) | Campaigns table | Hiệu quả & clicks |
| 21 | `landing_page_views` | Lượt xem trang đích | Campaigns table | Hiệu quả & clicks |
| 22 | `transaction_date` | Ngày giao dịch | Billing > Transaction table | 6 Tháng 5, 2026 |

### 🟢 Ưu tiên thấp (Creative, Setup & Account)

| # | Field | Tên VN | Vị trí | Cấp |
|---|---|---|---|---|
| 23 | `ad_name` | Tên quảng cáo | Ads tab | Ad |
| 24 | `creative_thumbnail` | Ảnh/video QC | Ads tab | Ad |
| 25 | `attribution` | Cài đặt ghi nhận | Ads tab | Ad |
| 26 | `purchases` | Lượt mua | Scroll phải | Campaign |
| 27 | `account_name` | Tên TK QC | Header | Account |
| 28 | `account_id` | ID tài khoản | Header | Account |

---

## 🔗 URL PATTERNS cho Extension

```
Campaigns:        adsmanager.facebook.com/adsmanager/manage/campaigns?act=1162586225600942
Ad Sets:          adsmanager.facebook.com/adsmanager/manage/adsets?act=1162586225600942  
Ads:              adsmanager.facebook.com/adsmanager/manage/ads?act=1162586225600942
Payment Activity: adsmanager.facebook.com/billing_hub/payment_activity?act=1162586225600942
Payment Methods:  adsmanager.facebook.com/billing_hub/payment_settings?act=1162586225600942
Credit Limit:     adsmanager.facebook.com/billing_hub/credit_line?act=1162586225600942
```

---

## 🎬 VIDEO WALKTHROUGH

### Ads Manager (Campaigns → Ad Sets → Ads → Column Presets)
![Video navigate qua Campaigns, Ad Sets, Ads, Column Presets](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/fb_full_walkthrough.webp)

### Billing Hub (Payment Activity → Payment Methods)
![Video navigate Billing: Transaction History + Payment Methods](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/fb_billing_walkthrough.webp)

