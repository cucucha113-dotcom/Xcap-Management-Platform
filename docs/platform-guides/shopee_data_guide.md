# 🏪 Shopee — Hướng dẫn Lấy Dữ liệu cho XCAP NỘI SÀN

> **Mục tiêu:** Dev biết chính xác cần lấy gì từ Shopee, ở đâu, API endpoint nào, fields nào map vào entity nào trong XCAP Nội sàn system.
> **Stream:** `noi_san` — On-Platform E-commerce
> **API Docs:** https://open.shopee.com/documents/v2/v2.introduction
> **Auth:** OAuth 2.0

---

## 🏗️ 1. Kiến trúc Tổng quan

```
Shopee Seller Center (seller.shopee.vn)
├── Dashboard (Home)
│   ├── To-do List (pending orders, returns)
│   ├── Business Insights (revenue, orders, visitors, conversion)
│   ├── Shopee Ads Card (credit, sales, ROAS)
│   └── Affiliate Card (sales, ROI)
├── Orders
│   ├── My Orders (all statuses)
│   ├── Return/Refund/Cancel
│   ├── Mass Ship
│   └── Shipping Settings
├── Products
│   ├── My Products (listing management)
│   ├── Add New Product
│   └── AI Optimiser
├── Marketing Centre
│   ├── Shopee Ads (Keyword, Discovery, Shop Ads)
│   ├── Affiliate Marketing
│   ├── Vouchers / Flash Sale / Bundle Deals
│   └── Campaign
├── Finance
│   ├── My Income (escrow details)
│   ├── My Balance (wallet transactions)
│   ├── Bank Account
│   └── Tax
├── Data
│   ├── Business Insights (⚠️ không có API — cần Extension scrape)
│   └── My Reports
└── Shop Settings
    ├── Shop Rating / Decoration / Settings
    └── Customer Service
```

---

## 📦 2. XCAP Nội sàn Entities — Tham chiếu

| Entity | Mô tả | PK |
|---|---|---|
| **EcomShop** | Tài khoản Seller trên sàn | `shopId` |
| **EcomOrder** | Đơn hàng | `orderId` |
| **EcomProduct** | Sản phẩm / listing | `productId` |
| **EcomSettlement** | Thanh toán / settlement từ sàn | `settlementId` |
| **EcomMetrics** | Chỉ số KPI hàng ngày (pageViews, visitors, convRate…) | `metricId` |

---

## 📸 Visual Data Map — Vị trí dữ liệu trên Seller Center

> Dev cần biết chính xác từng field nằm ở đâu trên giao diện Shopee. Dưới đây là screenshots annotated từ account thật.

### Dashboard — 13 Data Points

![Shopee Dashboard — vị trí 13 fields cần lấy](assets/shopee_dashboard_ann.png)

| Ô | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|
| **①** | `to_process_shipment` | 2 | Đơn cần xử lý giao |
| **②** | `processed_shipment` | 3 | Đơn đã xử lý |
| **③** | `return_refund_cancel` | 72 | Đơn hoàn/hủy |
| **④** | `banned_products` | 6 | SP bị cấm/giảm boost |
| **⑤** | `join_cheap` | 8 | SP cần tham gia "Rẻ nhất Shopee" |
| **⑥** | `sales` | ₱1,556 (▲ 478%) | **Doanh số — KPI #1** |
| **⑦** | `visitors` | 20 (▼ 4.76%) | Lượt truy cập shop |
| **⑧** | `product_clicks` | 16 (▼ 30.43%) | Click vào sản phẩm |
| **⑨** | `orders` | 4 (▲ 300%) | Số đơn hàng |
| **⑩** | `conversion_rate` | 25.00% (▲ 20.65%) | Tỷ lệ chuyển đổi |
| **⑪** | `ads_credit` + `ads_sales` + `roas` | ₱130.76 / ₱937 / 8.37 | Shopee Ads card |
| **⑫** | `affiliate_sales` + `affiliate_roi` | ₱3.2K / 24.2 | Affiliate card |
| **⑬** | `shop_score` | 93 (Good) | Điểm hiệu suất shop |

### My Products — 11 Data Points

![Shopee Products — vị trí 11 fields cần lấy](assets/shopee_products_ann.png)

| Ô | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|
| **①** | `status_tabs` | All / Live (8) / Violation (6) | Lọc theo trạng thái |
| **②** | `total_products` | 8 | Tổng SP |
| **④** | `product_name` | "Red Shark milk joint relief cream..." | Tên + thumbnail |
| **⑤** | `price_range` | ₱1,500 - ₱5,500 | Range giá (nhiều SKU) |
| **⑥** | `stock` | 4k / 991 | Tồn kho |
| **⑦** | `performance` | "Sales..." | Doanh số SP (L30D) |
| **⑧** | `item_id` + `parent_sku` | "Item ID: 28736132581" | ID sản phẩm + SKU |
| **⑨** | `affiliate_badge` | "AMS Commission >" | SP đã bật Affiliate |
| **⑩** | `actions` | Edit / Boost / More | Nút thao tác |

### Marketing — Shopee Ads & Affiliate — 10 Data Points

![Shopee Marketing — vị trí 10 fields cần lấy](assets/shopee_marketing_ann.png)

| Ô | Field | Giá trị mẫu | Ghi chú |
|---|---|---|---|
| **②** | `ads_credit` | ₱176.22 | Số dư credit QC |
| **③** | `ads_sales` | ₱318.00 (▼ 44.98%) | Doanh số từ Ads |
| **④** | `roas` | 4.78 (▼ 10.90%) | Return on Ad Spend |
| **⑥** | `affiliate_sales` | ₱3.2K | Doanh số qua affiliate |
| **⑦** | `new_buyers` | 7 | Khách mới từ affiliate |
| **⑧** | `affiliate_roi` | 24.2 | ROI affiliate |
| **⑨** | `competitiveness` | +54% ↗ | Độ cạnh tranh |

### 🔗 URL Patterns cho Extension

```
Dashboard:     seller.shopee.{market}/
Orders:        seller.shopee.{market}/portal/sale/order
My Products:   seller.shopee.{market}/portal/product/list/all
Shopee Ads:    seller.shopee.{market}/portal/marketing/pas/index
Affiliate:     seller.shopee.{market}/portal/marketing/affiliate
My Income:     seller.shopee.{market}/portal/finance/income
Business Data: seller.shopee.{market}/portal/data/business
```

---

## 📋 3. API Endpoints & Data Mapping

### 3.1 Shop Data

**API:** `GET /api/v2/shop/get_shop_info`

| Shopee Field | XCAP Entity | XCAP Field | Ghi chú |
|---|---|---|---|
| `shop_id` | EcomShop | shopId | PK |
| `shop_name` | EcomShop | shopName | |
| `status` | EcomShop | status | `NORMAL`, `BANNED`, `FROZEN` |
| `item_count` | EcomShop | totalProducts | |
| `rating_star` | EcomShop | shopRating | 1–5 scale |
| `shop_location` | — | — | Metadata |
| *(hardcode)* | EcomShop | platform | `"shopee"` |
| *(from project)* | EcomShop | projectCode | FK → Gán khi onboard |

**Bổ sung:** `GET /api/v2/shop/get_shop_performance` → Shop score, response rate, late shipment rate.

---

### 3.2 Order Data

**API:** `GET /api/v2/order/get_order_list` → danh sách order_sn
**API:** `GET /api/v2/order/get_order_detail` → chi tiết từng order

| Shopee Field | XCAP Entity | XCAP Field | Ghi chú |
|---|---|---|---|
| `order_sn` | EcomOrder | orderId | PK |
| `order_status` | EcomOrder | status | Xem bảng trạng thái |
| `total_amount` | EcomOrder | orderAmount | Tổng giá trị đơn |
| `actual_shipping_fee` | EcomOrder | shippingFee | Phí ship thực tế |
| `seller_discount` | EcomOrder | sellerDiscount | Voucher seller |
| `shopee_discount` | EcomOrder | platformDiscount | Shopee subsidy |
| `estimated_shipping_fee` | — | — | Phí ship ước tính |
| `buyer_username` | EcomOrder | buyerUsername | |
| `create_time` | EcomOrder | orderDate | Unix timestamp → ISO |
| `ship_by_date` | EcomOrder | shipDate | Hạn giao |
| `pay_time` | — | — | Thời điểm thanh toán |
| *(hardcode)* | EcomOrder | platform | `"shopee"` |

**Tính toán thêm:**
- `netRevenue` = `orderAmount` - `shippingFee` - `platformFee` - `sellerDiscount` - `platformDiscount`
- `platformFee` lấy từ Escrow API (section 3.4)

**Order Statuses Mapping:**

| Shopee Status | XCAP Status | Ý nghĩa |
|---|---|---|
| `UNPAID` | `pending` | Chưa thanh toán |
| `READY_TO_SHIP` | `pending` | Chờ giao hàng |
| `PROCESSED` | `shipping` | Đang xử lý logistics |
| `SHIPPED` | `shipping` | Đã giao cho vận chuyển |
| `COMPLETED` | `delivered` | Hoàn tất |
| `IN_CANCEL` | `cancelled` | Đang hủy |
| `CANCELLED` | `cancelled` | Đã hủy |
| `INVOICE_PENDING` | `pending` | Chờ invoice |

**Pagination:** Max 15 ngày/request, 100 items/page. Dùng `cursor` để phân trang.

---

### 3.3 Product Data

**API:** `GET /api/v2/product/get_item_list` → danh sách item_id
**API:** `GET /api/v2/product/get_item_base_info` → thông tin cơ bản
**API:** `GET /api/v2/product/get_item_extra_info` → sales, likes, views

| Shopee Field | XCAP Entity | XCAP Field | Ghi chú |
|---|---|---|---|
| `item_id` | EcomProduct | productId | PK |
| `item_name` | EcomProduct | productName | |
| `item_sku` | EcomProduct | sku | Parent SKU |
| `price_info.current_price` | EcomProduct | price | Giá hiện tại |
| `stock_info_v2.summary_info.total_available_stock` | EcomProduct | stock | Tồn kho |
| `item_status` | EcomProduct | status | `NORMAL`, `BANNED`, `DELETED`, `UNLIST` |
| `rating_star` | EcomProduct | rating | 1–5 |
| `comment_count` | EcomProduct | reviewCount | |
| `category_id` | EcomProduct | category | Cần resolve name qua Category API |
| `create_time` | EcomProduct | createdAt | |
| *(hardcode)* | EcomProduct | platform | `"shopee"` |

**Từ `get_item_extra_info`:**

| Field | XCAP Field | Ghi chú |
|---|---|---|
| `sale` | totalSold | Tổng đã bán |
| `likes` | — | Metadata |
| `views` | — | Metadata (cho EcomMetrics) |

**SKU Variants:** Dùng `GET /api/v2/product/get_model_list` để lấy variant details (size, color, price, stock per SKU).

---

### 3.4 Finance / Income — Settlement

**API:** `GET /api/v2/payment/get_escrow_detail` → Chi tiết thanh toán từng order
**API:** `GET /api/v2/payment/get_wallet_transaction_list` → Lịch sử giao dịch wallet

#### Escrow Detail (per order):

| Shopee Field | XCAP Entity | XCAP Field | Ghi chú |
|---|---|---|---|
| `order_sn` | EcomSettlement | — | FK → orderId |
| `escrow_amount` | EcomSettlement | netSettlement | Số tiền thực nhận |
| `buyer_total_amount` | EcomSettlement | grossRevenue | Buyer trả tổng |
| `commission_fee` | EcomSettlement | platformFee | Phí hoa hồng Shopee |
| `service_fee` | — | — | Phí dịch vụ (gộp vào platformFee) |
| `credit_card_transaction_fee` | — | — | Phí giao dịch thẻ |
| `seller_shipping_discount` | EcomSettlement | shippingFee | Phần ship seller chịu |
| `escrow_release_time` | EcomSettlement | settlementDate | Thời điểm giải ngân |
| *(hardcode)* | EcomSettlement | platform | `"shopee"` |
| *(hardcode)* | EcomSettlement | period | `"per_order"` |

> [!IMPORTANT]
> `platformFee` = `commission_fee` + `service_fee` + `credit_card_transaction_fee`
> `adjustments` = `seller_voucher_amount` + `shopee_voucher_amount`
> `netSettlement` = `grossRevenue` - `platformFee` - `shippingFee` - `adjustments`

#### Wallet Transactions:

| Field | Mapping | Ghi chú |
|---|---|---|
| `transaction_id` | settlementId | PK |
| `amount` | netSettlement | Số tiền +/- |
| `transaction_type` | — | `WITHDRAWAL`, `ESCROW`, `ADJUSTMENT` |
| `status` | status | `COMPLETED`, `PENDING`, `FAILED` |
| `create_time` | settlementDate | |

---

### 3.5 Return / Refund

**API:** `GET /api/v2/returns/get_return_list`
**API:** `GET /api/v2/returns/get_return_detail`

| Field | Dùng cho | Ghi chú |
|---|---|---|
| `return_sn` | Return tracking | |
| `order_sn` | Link to EcomOrder | |
| `reason` | Analytics | Lý do trả hàng |
| `status` | Return status | `REQUESTED`, `ACCEPTED`, `REFUNDED`, `REJECTED` |
| `refund_amount` | EcomSettlement adjustments | |

**Tính toán:**
- `returnRate` = count(returns) / count(delivered_orders) × 100
- `cancelRate` = count(cancelled_orders) / count(all_orders) × 100
→ Lưu vào **EcomMetrics**.

---

### 3.6 Shopee Ads (In-platform Ads)

**API:** Hạn chế — Shopee Ads API chỉ mở cho một số partner.
**Phương án chính:** Extension scrape từ Marketing Centre.

| Data Point | Source | XCAP Mapping |
|---|---|---|
| Campaign Name | Shopee Ads Dashboard | In-platform Ads table |
| Budget / Spend | Shopee Ads Dashboard | `budget`, `spend` |
| Impressions / Clicks | Shopee Ads Dashboard | `impressions`, `clicks` |
| Orders from Ads | Shopee Ads Dashboard | `orders` |
| ROAS | Shopee Ads Dashboard | `roas` |
| Ad Credit Balance | Dashboard Card | `adsCredit` |

**URL cần scrape:**
```
/portal/marketing/pas/index      → Keyword Ads
/portal/marketing/cpc/index      → Discovery Ads
/portal/marketing/shop_ads       → Shop Ads
```

---

## 🔌 4. Extension Scraping Guide — Business Insights

> [!WARNING]
> Shopee API **KHÔNG cung cấp** pageViews, visitors, conversionRate, product views, add-to-cart.
> Bắt buộc dùng Extension scrape từ Business Insights Dashboard.

### Target URL:
```
seller.shopee.vn/portal/data/business
seller.shopee.ph/portal/data/business
```

### Metrics cần scrape → EcomMetrics:

| UI Location | Field | XCAP Field | Ghi chú |
|---|---|---|---|
| Business Insights > Visitors | visitors | visitors | Unique visitors |
| Business Insights > Page Views | pageViews | pageViews | Total page views |
| Business Insights > Conversion Rate | conversion_rate | conversionRate | orders/visitors × 100 |
| Business Insights > Revenue | revenue | revenue | Verify vs Order API |
| Business Insights > Orders | orders | orders | Verify vs Order API |
| Product Performance > Views | product_views | — | Per-product views |
| Product Performance > Add to Cart | add_to_cart | — | ATC count |

### Content Script Flow:

```javascript
// shopee-noi-san-collector.js
const SHOPEE_PATTERNS = [
  'seller.shopee.vn',
  'seller.shopee.ph',
  'seller.shopee.co.th'
];

// Detect Business Insights page
if (location.pathname.includes('/portal/data/business')) {
  // Wait for dashboard to load
  await waitForSelector('.business-insight-card');
  
  const metrics = {
    platform: 'shopee',
    shopId: extractShopId(), // from URL or DOM
    date: new Date().toISOString().split('T')[0],
    visitors: parseNumber(document.querySelector('[data-metric="visitors"]')?.textContent),
    pageViews: parseNumber(document.querySelector('[data-metric="page_views"]')?.textContent),
    conversionRate: parseFloat(document.querySelector('[data-metric="conversion_rate"]')?.textContent),
    revenue: parseNumber(document.querySelector('[data-metric="revenue"]')?.textContent),
    orders: parseInt(document.querySelector('[data-metric="orders"]')?.textContent),
  };
  
  // Submit to XCAP backend
  await fetch('/api/ecom/metrics', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(metrics)
  });
}
```

> [!NOTE]
> DOM selectors là **gợi ý**. Dev cần inspect element trên account thật để xác nhận.
> Shopee thường dùng `data-*` attributes hoặc class names obfuscated. Dùng **MutationObserver** để detect khi data load xong.

---

## 🔄 5. Sync Strategy

```
Cron Schedule:
├── Every 15min:  Order sync (new + status changes)
│                 GET /api/v2/order/get_order_list?time_range_field=update_time
├── Every 1h:     Product stock/price sync
│                 GET /api/v2/product/get_item_list + get_item_base_info
├── Every 6h:     Full product catalog + extra info (sales, views)
│                 GET /api/v2/product/get_item_extra_info
├── Daily 2AM:    Yesterday's orders finalization
│                 GET /api/v2/order/get_order_list?time_range_field=create_time (yesterday)
├── Daily 3AM:    Escrow/settlement data
│                 GET /api/v2/payment/get_escrow_detail (for completed orders)
├── Daily 4AM:    Return/refund sync
│                 GET /api/v2/returns/get_return_list
├── Weekly:       Settlement reconciliation
│                 Match escrow records vs internal orders
└── Extension:    Business Insights (realtime khi NV mở page)
                  Shopee Ads metrics (khi NV mở Marketing Centre)
```

---

## ⚠️ 6. Rate Limits & Auth

### OAuth 2.0 Flow:
```
1. Đăng ký app trên Shopee Open Platform
2. Seller authorize → redirect URI → auth_code
3. Exchange auth_code → access_token + refresh_token
4. Dùng access_token + shop_id + sign (HMAC-SHA256)
5. Refresh token trước khi hết hạn
```

### Rate Limits:

| API Category | Limit | Ghi chú |
|---|---|---|
| Order APIs | 1 req/s per shop | get_order_list, get_order_detail |
| Product APIs | 1 req/s per shop | get_item_list, get_item_base_info |
| Payment APIs | 1 req/s per shop | get_escrow_detail |
| Shop APIs | 1 req/s per shop | get_shop_info |

### Token Lifecycle:

| Token | TTL | Ghi chú |
|---|---|---|
| Access Token | 4 hours | Dùng cho API calls |
| Refresh Token | 30 days | Dùng để renew access token |
| Auth Code | 1 use | Dùng 1 lần để lấy token |

### Request Signature:
```
sign = HMAC-SHA256(partner_key, path + timestamp + access_token + shop_id)
```

---

## 📊 7. Dashboard Mapping — KPIs Nội sàn

| Dashboard KPI | Công thức | Data Source |
|---|---|---|
| **GMV** | SUM(orders.orderAmount) WHERE status IN (COMPLETED, SHIPPED) | Order API |
| **Orders** | COUNT(orders) WHERE date = today | Order API |
| **Conv Rate** | orders / visitors × 100 | Extension (visitors) + Order API (orders) |
| **AOV** | GMV / Orders | Calculated |
| **Revenue** | SUM(settlements.netSettlement) | Payment API |
| **Product Views** | SUM(product.views) | Extension scrape |
| **ATC (Add to Cart)** | SUM(product.add_to_cart) | Extension scrape |

### Charts:
- **Daily GMV by Platform** → EcomMetrics.revenue (platform = shopee)
- **Order Trend** → EcomMetrics.orders (7-day / 30-day trend)
- **Top Products by Revenue** → EcomProduct sorted by totalRevenue DESC

---

## 🔁 8. Settlement Reconciliation

### Flow: Sàn Settlement ↔ Bank Transfer

```
1. Order hoàn tất (COMPLETED)
     ↓
2. Shopee tính escrow detail:
   grossRevenue - commission - service_fee - shipping = netSettlement
     ↓
3. XCAP download escrow qua API
     ↓
4. So khớp với internal order records:
   ✅ SUM(order.netRevenue) cho period == settlement.netSettlement
   ❌ Nếu chênh lệch → Flag discrepancy
     ↓
5. Shopee chuyển tiền vào bank account
     ↓
6. XCAP match bank transfer amount vs expected settlement
     ↓
7. Generate recon report: Matched / Partial / Unmatched
```

### Discrepancy Types:

| Loại | Ví dụ | Action |
|---|---|---|
| **Missing Order** | Order trong Shopee nhưng không có trong XCAP | Sync lại order |
| **Fee Mismatch** | Commission rate khác so với expected | Review Shopee fee policy |
| **Adjustment** | Refund/penalty chưa track | Update settlement record |
| **Bank Amount** | Bank transfer ≠ expected settlement | Escalate to finance |

---

## ✅ 9. Implementation Checklist

### Phase 1: Setup (Week 1)
- [ ] Đăng ký Shopee Open Platform app
- [ ] Implement OAuth 2.0 flow + token refresh
- [ ] Setup shop authorization cho tất cả shops
- [ ] Tạo `EcomShop` records cho mỗi shop

### Phase 2: Core Data (Week 2-3)
- [ ] Order sync worker (15-min cron)
- [ ] Product sync worker (1h + 6h cron)
- [ ] Escrow/settlement sync (daily cron)
- [ ] Return/refund sync (daily cron)
- [ ] Order status mapping (Shopee → XCAP)
- [ ] `netRevenue` calculation pipeline

### Phase 3: Extension (Week 3-4)
- [ ] Business Insights scraper (visitors, pageViews, convRate)
- [ ] Shopee Ads scraper (credit, spend, ROAS)
- [ ] Product performance scraper (views, ATC)
- [ ] Extension → POST /api/ecom/metrics endpoint

### Phase 4: Dashboard & Recon (Week 4-5)
- [ ] KPI cards: GMV, Orders, Conv Rate, AOV, Revenue
- [ ] Charts: Daily GMV trend, Top Products
- [ ] Tables: Shop Performance, Product Rankings
- [ ] Settlement reconciliation engine
- [ ] Discrepancy detection + alerting
- [ ] Cross-stream violation check (Card isolation)

---

> [!IMPORTANT]
> **Shopee API cần chú ý:**
> - Timestamp phải là **UTC+8 (Singapore time)**
> - Order date range max **15 ngày** per request
> - Pagination dùng **cursor-based**, không dùng offset
> - Tất cả request cần **sign** (HMAC-SHA256)
> - `shop_id` bắt buộc trong mọi request
