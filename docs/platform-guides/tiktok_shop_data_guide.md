# 📋 TikTok Shop Seller Center — Annotated Data Map

> **Shop:** Dermaclear Naturix (Philippines)
> **URL:** `seller.tiktokshopglobalselling.com`
> **Ngày chụp:** 11/05/2026 — Screenshots thật, annotated chính xác

---

## 1️⃣ HOMEPAGE — Dashboard Tổng Quan

![Homepage annotated — 10 data points](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/tts_homepage_annotated.png)

| Ô | Field | Vị trí trên UI | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **A** | `shop_name` + `shop_region` | Góc phải trên, avatar area | "Dermaclear Naturix", "Philippines" | Cố định trên mọi trang |
| **①** | `to_ship` + `urgent` | Card "To Ship" trong Action Needed | 2 (3 Urgent) | Đơn cần giao gấp |
| **②** | `rejected_products` | Card "Rejected Products" | 3 | SP bị TikTok từ chối |
| **③** | `unreplied_reviews` | Card "Unreplied negative reviews" | 11 | Review tiêu cực chưa phản hồi |
| **④** | `gmv` | Card GMV trong Shop Insights | ₱907 | **KPI CHÍNH** — Tổng GMV |
| **⑤** | `live_gmv` | Card LIVE-attributed | ₱0 | GMV từ livestream |
| **⑥** | `video_gmv` | Card Video-attributed | ₱0 | GMV từ short video |
| **⑦** | `creator_gmv` | Card Creator-attributed | ₱0 | GMV từ affiliate/creator |
| **⑧** | `date_filter` | Nút "Today / Last 7 days / Last 28 days" | Last 7 days | Bộ lọc thời gian cho insights |
| **⑨** | `risk_level` + `violations` | Gauge chart + violation count (phải) | "Low Risk", 13 records | Mức rủi ro shop |
| **⑩** | `daily_order_limit` | Card "Limitations" (phải dưới) | 0/100 | Giới hạn đơn/ngày |

---

## 2️⃣ PRODUCTS — Manage Products

![Products annotated — 11 data points](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/tts_products_annotated.png)

| Ô | Field | Vị trí trên UI | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **①** | `product_name` | Cột Product — dòng chính (có thumbnail) | "[COD]Bee Venom Plus Original – Natural Pain Relief, Skin..." | Tên đầy đủ SP |
| **②** | `product_id` | Dưới tên SP, dạng "ID:xxxxx" | ID:17334359223... | ID duy nhất của SP |
| **③** | `items_sold` | Cột giữa, text "x item sold" | "1 item sold" | Tổng đã bán |
| **④** | `status` | Cột Status, indicator ● | "● Live" | Live / Draft / Reviewing |
| **⑤** | `views` | Cột Views, số nguyên | 2,987 | Lượt xem SP |
| **⑥** | `created_date` | Dưới status, dạng DD/MM/YYYY HH:mm | "02/12/2025 15:01" | Ngày tạo SP |
| **⑦** | `retail_price` | Cột "Retail price" | "₱369.00 - ₱1,129.00" | Range giá (nhiều SKU) |
| **⑧** | `sales_amount` | Text "Sales: ₱xxx" dưới items_sold | "Sales: ₱369.00" | Tổng doanh số |
| **⑨** | `sku_views` | Text "Views: xxx" | "Views: 372" | Views per SKU |
| **⑩** | `sku_count` | Label "3 SKUs" + nút Expand | "3 SKUs" | Số biến thể |
| **⑪** | `status_filter_tabs` | Tabs trên cùng: All / Active / Review | "All", "Active 5" | Lọc theo trạng thái |

---

## 3️⃣ ANALYTICS — Shop Analytics

![Analytics annotated — 10 data points](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/tts_analytics_annotated.png)

| Ô | Field | Vị trí trên UI | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **①** | `analytics_tabs` | Tab bar dưới "Analytics" | 7 tabs | Shop/Growth/Content/Card/Product/Marketing/Post-purchase |
| **②** | `date_range` | Dưới "Key metrics", date picker | "May 10, 2026 - May 10, 2026" | Chọn ngày + Compare |
| **③** | `gmv` | Card GMV (có checkbox ✅) | ₱0.00 | **KPI** — tick để hiện trên chart |
| **④** | `items_sold` | Card Items sold (có checkbox ✅) | 0 | Tổng SP đã bán |
| **⑤** | `sku_orders` | Card SKU orders (có checkbox) | 0 | Số đơn theo SKU |
| **⑥** | `orders` | Card Orders (có checkbox) | 0 | Tổng đơn hàng |
| **⑦** | `trend_chart` | Line chart theo giờ (00:00→21:00) | Chart line | So sánh Yesterday / Previous day |
| **⑧** | `gmv_breakdown` | Section "GMV breakdown" dưới chart | "By content type" / "By order source" | Phân tích nguồn GMV |
| **⑨** | `content_attribution` | Pie chart + table LIVEs/Videos/Cards | "LIVEs 0.0%", "Videos 0.0%" | Tỉ lệ đóng góp từng loại content |
| **⑩** | `category_ranking` | Panel phải "GMV rankings" | Top GMV shops in category | Xếp hạng trong ngành |

---

## 4️⃣ FINANCE — Tài chính

![Finance annotated — 8 data points](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/tts_finance_annotated.png)

| Ô | Field | Vị trí trên UI | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **①** | `finance_tabs` | Tab bar dưới "Overview" | 6 tabs | Financial summary / Payouts / Statements / On hold / Invoices / Tax |
| **②** | `paid_amount` | Card "Paid" (highlight xanh) | -- | Đã thanh toán tuần này |
| **③** | `processing_amount` | Card "Processing" | -- | Đang xử lý (1-3 ngày) |
| **④** | `on_hold_amount` | Card "On hold" | -- | Tiền bị giữ (tổng) |
| **⑤** | `date_filter` | Nút "This week / Last week / Last month" + date picker | 01/04/2026 - 30/04/2026 | Bộ lọc thời gian |
| **⑥** | `payout_history` | Bảng payouts | "Recent payouts will appear here" | Lịch sử thanh toán |
| **⑦** | `payment_provider` + `account` | Section "Payment settings" | "LianLian Global ID", "********0860", "Valid" | Nhà cung cấp + số TK + trạng thái |
| **⑧** | `finance_submenu` | Sidebar trái (khi hover icon 💰) | Financial summary / Deposit / Bills / Wallet | Menu con Finance |

---

## 5️⃣ ADS DASHBOARD — Quảng cáo Shop

![Ads Dashboard annotated — 11 data points](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/tts_ads_annotated.png)

| Ô | Field | Vị trí trên UI | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **①** | `ads_dashboard_page` | Tiêu đề trang | "Ads dashboard" | Trang quản lý QC shop |
| **②** | `ad_campaign_name` + `tag` | Card SP bên trái | "33 JM - 0212 MR DUNG", "Primary" | Tên chiến dịch + tag |
| **③** | `product_name` | Cột "Product" trong bảng | "Green shirt" | SP đang chạy ads |
| **④** | `sku_id` | Dưới tên SP | "SKU ID: 123456789" | ID biến thể |
| **⑤** | `optimization_mode` | Dropdown "Optimization mode" | "Target ROI" / "Max delivery" | 2 chế độ tối ưu |
| **⑥** | `gross_revenue` | Cột "Gross revenue" | 500.00 | Doanh thu gộp |
| **⑦** | `ad_cost` | Card "Cost" (trái dưới) | 0 VND | **KPI** — Chi phí QC |
| **⑧** | `ad_roi` | Card "ROI" (phải dưới) | 0.00 | **KPI** — ROI quảng cáo |
| **⑨** | `date_range` | Date picker phải trên | "2026-05-04 - 2026-05-11" | Khoảng thời gian báo cáo |
| **⑩** | `create_ads_action` | Nút "Create GMV Max ads" (phải trên) | Button | Tạo QC mới |
| **⑪** | `manage_ads_account` | Link "Manage account" | Link | Quản lý TK QC |

---

## 📊 TỔNG KẾT — 49 DATA POINTS

| Trang | Số ô khoanh | Data chính |
|---|---|---|
| Homepage | 10 | GMV, Action Needed, Shop Status |
| Products | 11 | Product list + SKU details |
| Analytics | 10 | KPIs + Chart + GMV Breakdown |
| Finance | 8 | Paid/Processing/Hold + Payment |
| Ads | 11 | Campaign + Cost + ROI |
| **TỔNG** | **49** | |

---

## 🎬 VIDEO WALKTHROUGH

![Video recording thao tác navigate qua từng trang](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/tts_full_walkthrough.webp)

