# 📋 Lazada Seller Center — Annotated Data Map

> **Shop:** PureNutra Medic
> **Market:** Philippines (sellercenter.lazada.com.ph)
> **Ngày chụp:** 11/05/2026 — Screenshots thật
> **Tổng:** 6 sản phẩm, 2 đơn hôm nay

---

## 📌 SIDEBAR NAVIGATION (Menu trái)

| Section | Menu items | URL Pattern |
|---|---|---|
| **Common Tools** | Manage Products, Orders, Promotions | Quick shortcuts |
| **Products** | Manage Products, Add Products, Decorate Products, Fulfillment By Lazada, Opportunity Center, Assortment Growth Center | `/apps/product/*` |
| **Orders** | Orders, Logistics, Return Orders, Reviews, Reporting Management | `/apps/order/*` |
| **Marketing Center** | Campaign, Promotions, LazFlash, LazLive, LazCoins Discount, Lazada Program, Customer Engagement, Priority Delivery | `/apps/marketing/*` |
| **Sponsored Solutions** | Quảng cáo Lazada (có 🔴 notification dot) | `/apps/sponsored/*` |
| **Store** | Shop decoration, store settings | `/apps/store/*` |
| **Finance** | My Income, My Balance, Logistics Fee, SVC Overview | `/apps/finance/*` |
| **Data Insight** | Business Advisor | `/apps/data/*` |
| **Service Center** | Customer service tools | `/apps/service/*` |
| **Setting** | Account, shipping settings | `/apps/setting/*` |

---

## 1️⃣ DASHBOARD — Tổng quan Shop (CLEAN — không popup)

![Lazada Dashboard annotated — 10 data points](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/lazada_dashboard_ann.png)

### Header
| Ô | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|
| **A** | `shop_name` | "PureNutra Medic" | Hiển thị ngay đầu trang |

### Task List (Hàng trên cùng)
| Ô | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|
| **①** | `unpaid_orders` | 0 | Đơn chưa thanh toán |
| **①** | `pending_pack` | 0 | Đơn chờ đóng gói |
| **①** | `pending_shipping` | 0 | Đơn chờ giao |
| **①** | `to_approve_cancel` | 0 | Đơn chờ duyệt hủy |
| **①** | `pending_return` | 0 | Đơn chờ hoàn trả |

### Operations Overview (3 khối)
| Ô | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|
| **②** | `waiting_pickup` | 14 | Logistics: chờ lấy hàng |
| **②** | `pickup_exceptions` | 14 | Logistics: lỗi lấy hàng |
| **③** | `out_of_stock` | 2 | Products: hết hàng |
| **③** | `qc_issues` | 1 | Products: lỗi QC |
| **③** | `to_be_reviewed` | 104 | Products: chờ review |
| **④** | `ongoing_penalties` | 3 | Violation: đang phạt |
| **④** | `orders_breach_fee` | 2 | Violation: đơn bị phí |

### Business Advisor (KPIs chính)

> [!IMPORTANT]
> Dữ liệu real-time (till GMT+8), so sánh vs Yesterday same period

| Ô | Field | Giá trị mẫu | % thay đổi | Ghi chú |
|---|---|---|---|---|
| **⑤** | `revenue` | ₱1,533 | +126.10% | **KPI #1** — Revenue Today |
| **⑤** | `orders` | 2 | — | Số đơn hàng |
| **⑤** | `visitors` | 1 | — | Khách truy cập |

### Seller Growth Metrics
| Ô | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|
| **⑥** | `fast_fulfilment_rate` (FFR) | 79.78% | Tỉ lệ hoàn tất nhanh |
| **⑦** | `chat_response_rate` | 90% | Tỉ lệ trả lời chat |

### LazFlash & Sidebar
| Ô | Field | Ghi chú |
|---|---|---|
| **⑧** | `lazflash_invitation` | SP được mời flash sale (₱209.29, Traffic Uplift 2X-5X) |
| **⑨** | `seller_growth` | Panel seller growth metrics |
| **⑩** | `sidebar_menu` | 9 sections: Common Tools → Setting |

---

## 2️⃣ ORDER MANAGEMENT — Quản lý đơn hàng

![Lazada Orders annotated — 8 data points](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/lazada_orders_ann.png)

### URL
```
/apps/order/index
```

### Order Status Tabs

| Tab | Badge | Ghi chú |
|---|---|---|
| All | — | Tất cả đơn |
| Unpaid | — | Chưa thanh toán |
| **To Ship** | 🔴 14 | Cần gửi hàng |
| Shipping | 🔴 1 | Đang giao |
| Delivered | — | Đã giao |
| Failed | — | Thất bại |
| Refund | — | Hoàn tiền |
| To Handover | 🔴 14 | Cần bàn giao |

### Performance Bar (top right)
| Field | Giá trị | Ghi chú |
|---|---|---|
| `cancellation_rate` | 0% | Tỷ lệ hủy |
| `pnr` | 0% | Package Not Received rate |
| `ffr` | 79.78% | Fast Fulfilment Rate |
| `ffr_plus` | 79.78% | FFR+ (enhanced) |

### Order Table Columns
| Cột | Field | Ghi chú |
|---|---|---|
| Product | `product_info` | Tên + ảnh sản phẩm |
| Total Amount | `total_amount` | Tổng tiền đơn |
| Delivery | `delivery_info` | Thông tin vận chuyển |
| Status | `order_status` | Trạng thái đơn |
| Actions | `actions` | Pack & Print, Negotiate... |

### Fulfillment Filters
| Filter | Options |
|---|---|
| Fulfillment SLA | About to Breach SLA (0), SLA Breached (0) |
| Priority Order | Priority Delivery |
| Print Status | AWB Unprinted, AWB Printed, Packing List Unprinted |

---

## 3️⃣ MANAGE PRODUCTS — Quản lý sản phẩm

![Lazada Products annotated — 10 data points](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/lazada_products_ann.png)

### URL
```
/apps/product/manage
```

### Product Overview Cards
| Ô | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|
| **①** | `product_limitation` | 6 / 5,000 | Số SP / Giới hạn |
| **①** | `qc_alert` | 0 No issue | Cảnh báo QC |
| **①** | `attribute_management` | 1 product(s) | SP cần sửa attribute |

### Status Tabs
| Ô | Tab | Count | Ghi chú |
|---|---|---|---|
| **②** | All | — | Tất cả |
| **②** | Active | 🔵 6 | Đang bán |
| **②** | Inactive | 🔴 1 | Ngừng bán |
| **②** | Draft | — | Bản nháp |
| **②** | Pending QC | — | Chờ duyệt |
| **②** | Violation | 🔴 1 | Vi phạm |
| **②** | Deleted | — | Đã xóa |

### Product Table
| Ô | Cột | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|---|
| **③** | Product Info | `product_name` | "Nano Silver FDA APPROVED Original 250ml Food Supplement for Pets" | Tên + thumbnail |
| **④** | Price | `price` | ₱299 - 1,969 | Range giá (nhiều SKU) |
| **⑤** | Stock | `stock` | 39,743 | Tồn kho |
| **⑥** | Active | `active_toggle` | 🔵 ON / ⚫ OFF | Bật/tắt sản phẩm |
| **⑦** | (dưới tên SP) | `product_id` | 5377977702 | Lazada Product ID |
| **⑧** | (icons dưới SP) | `product_metrics` | 👍100 👁100 🛒1,999 ⭐4.6 | Likes / Views / Sold / Rating |

### Sidebar Menus
| Ô | Menu | Items |
|---|---|---|
| **⑨** | Products | Manage Products, Add Products, Decorate, FBL, Opportunity Center, Assortment Growth |
| **⑩** | Finance | My Income, My Balance, Logistics Fee, SVC Overview |

---

## 4️⃣ MARKETING — Promotions & Marketing Tools

![Lazada Marketing annotated — 8 data points](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/lazada_marketing_ann.png)

### URL
```
/apps/marketing/promotions
```

### Tabs & Smart Suggestions
| Ô | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|
| **①** | `promotion_tabs` | Promotions / Smart Promotion (New) | 2 tab chính |
| **②** | `smart_suggestion` | GASTRO-P ₱230, Min.Spend ₱2,200, Specific Product Voucher | Gợi ý voucher từ Lazada |

### Marketing Tools
| Ô | Field | Ghi chú |
|---|---|---|
| **③** | `marketing_tools` | Flexi Combo, Seller Free Shipping, Add-On Deals |
| **④** | `voucher_types` | Regular Voucher, Store New Buyer Voucher, Store Follower Voucher |
| **⑤** | `tool_categories` | Popular Tools / Improve Store Conversion / Improve Basket Size / Others |

### Sidebar Navigation
| Ô | Menu | Items |
|---|---|---|
| **⑥** | Marketing Center | Campaign, Promotions, LazFlash, LazLive, LazCoins Discount, Lazada Program, Customer Engagement, Priority Delivery |
| **⑦** | **Sponsored Solutions** 🔴 | Quảng cáo trả phí Lazada (tương tự Shopee Ads) |
| **⑧** | Data Insight | Business Advisor |

---

## 📊 TỔNG HỢP — 30 DATA FIELDS

### 🔴 Ưu tiên cao (Core KPIs)

| # | Field | Trang | Giá trị mẫu |
|---|---|---|---|
| 1 | `revenue` | Dashboard | ₱1,533 |
| 2 | `orders` | Dashboard | 2 |
| 3 | `vs_yesterday` | Dashboard | +126.10% |
| 4 | `fast_fulfilment_rate` | Dashboard / Orders | 79.78% |
| 5 | `chat_response_rate` | Dashboard | 90% |
| 6 | `cancellation_rate` | Orders top bar | 0% |
| 7 | `to_ship_count` | Orders tabs | 14 |

### 🟡 Ưu tiên trung bình (Operations)

| # | Field | Trang | Giá trị mẫu |
|---|---|---|---|
| 8 | `order_status` | Orders table | To Ship / Shipping / Delivered |
| 9 | `total_amount` | Orders table | Tổng tiền đơn |
| 10 | `delivery_info` | Orders table | Carrier + tracking |
| 11 | `product_limitation` | Products overview | 6 / 5,000 |
| 12 | `qc_alert` | Products overview | 0 No issue |
| 13 | `active_count` | Products tabs | Active (6) |
| 14 | `violation_count` | Products tabs | Violation (1) |
| 15 | `task_list` | Dashboard | 0/2 |

### 🟢 Ưu tiên thấp (Product & Marketing)

| # | Field | Trang | Giá trị mẫu |
|---|---|---|---|
| 16 | `product_name` | Products table | "Nano Silver FDA..." |
| 17 | `price` | Products table | ₱299 - 1,969 |
| 18 | `stock` | Products table | 39,743 |
| 19 | `product_id` | Products table | 5377977702 |
| 20 | `product_sold` | Product metrics | 1,999 |
| 21 | `product_rating` | Product metrics | 4.6 |
| 22 | `product_views` | Product metrics | 100 |
| 23 | `shop_name` | Header | PureNutra Medic |

---

## 🔗 URL PATTERNS cho Extension

```
Dashboard:    sellercenter.lazada.com.ph/
Orders:       sellercenter.lazada.com.ph/apps/order/index
Products:     sellercenter.lazada.com.ph/apps/product/manage
Promotions:   sellercenter.lazada.com.ph/apps/marketing/promotions
Sponsored:    sellercenter.lazada.com.ph/apps/sponsored/campaign
My Income:    sellercenter.lazada.com.ph/apps/finance/income
My Balance:   sellercenter.lazada.com.ph/apps/finance/balance
Data Insight: sellercenter.lazada.com.ph/apps/data/business-advisor
```

---

## 🎬 VIDEO WALKTHROUGH

![Video navigate qua Lazada Seller Center: Dashboard → Orders → Products → Marketing](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/artifacts/lazada_full_walkthrough.webp)

