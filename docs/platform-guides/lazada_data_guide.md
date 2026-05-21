# 🏪 Lazada — Hướng dẫn Lấy Dữ liệu cho XCAP NỘI SÀN

> **Mục tiêu:** Dev biết chính xác cần lấy gì từ Lazada, ở đâu, API endpoint nào, fields nào map vào entity nào trong XCAP Nội sàn system.
> **Stream:** `noi_san` — On-Platform E-commerce
> **API Docs:** https://open.lazada.com/apps/doc/api
> **Auth:** OAuth 2.0

---

## 🏗️ 1. Kiến trúc Tổng quan

```
Lazada Seller Center (sellercenter.lazada.vn)
├── Home Dashboard
│   ├── Task List (pending orders, returns)
│   ├── Business Advisor (revenue, orders, visitors)
│   ├── Seller Growth Metrics (FFR, Chat Response)
│   └── LazFlash Invitations
├── Orders
│   ├── Manage Orders (all statuses)
│   ├── Returns & Refunds
│   ├── Cancellations
│   └── Reporting Management
├── Products
│   ├── Manage Products (listing management)
│   ├── Add Products
│   ├── Quality Center
│   ├── Fulfillment By Lazada (FBL)
│   └── Opportunity Center
├── Marketing Center
│   ├── Promotions (Vouchers, Flexi Combo, Free Shipping)
│   ├── Campaign
│   ├── LazFlash / LazLive / LazCoins
│   └── Customer Engagement
├── Sponsored Solutions (In-platform Ads)
│   ├── Sponsored Products
│   ├── Sponsored Discovery
│   └── Sponsored Affiliate
├── Finance
│   ├── Account Statement
│   ├── Transaction Overview (payout details)
│   ├── Logistics Fee
│   └── SVC Overview
├── Data Insight
│   └── Business Advisor (⚠️ không có public API — cần Extension scrape)
└── Settings
    ├── Account / Shipping Settings
    └── Store Decoration
```

---

## 📦 2. XCAP Nội sàn Entities — Tham chiếu

| Entity | Mô tả | PK |
|---|---|---|
| **EcomShop** | Tài khoản Seller trên sàn | `shopId` |
| **EcomOrder** | Đơn hàng | `orderId` |
| **EcomProduct** | Sản phẩm / listing | `productId` |
| **EcomSettlement** | Thanh toán / payout từ sàn | `settlementId` |
| **EcomMetrics** | Chỉ số KPI hàng ngày | `metricId` |

---

## 📋 3. API Endpoints & Data Mapping

### 3.1 Seller / Shop Data

**API:** `GET /seller/get`

| Lazada Field | XCAP Entity | XCAP Field | Ghi chú |
|---|---|---|---|
| `seller_id` | EcomShop | shopId | PK |
| `name` | EcomShop | shopName | |
| `short_code` | EcomShop | shopUrl | Store URL slug |
| `status` | EcomShop | status | `active`, `inactive`, `suspended` |
| `cb` | — | — | Cross-border seller flag |
| `verified` | — | — | Seller verification status |
| *(hardcode)* | EcomShop | platform | `"lazada"` |
| *(from project)* | EcomShop | projectCode | FK → Gán khi onboard |

**Bổ sung:** Lazada không có trực tiếp `totalProducts`, `totalOrders`, `shopRating` trong seller API → Tính từ Products API + Orders API.

---

### 3.2 Order Data

**API:** `GET /orders/get` → danh sách orders (filter by status, date range)
**API:** `GET /orders/items/get` → chi tiết items trong order

#### Order Level:

| Lazada Field | XCAP Entity | XCAP Field | Ghi chú |
|---|---|---|---|
| `order_id` | EcomOrder | orderId | PK (Lazada format) |
| `statuses` | EcomOrder | status | Array — xem mapping bên dưới |
| `price` | EcomOrder | orderAmount | Tổng giá trị đơn |
| `shipping_fee` | EcomOrder | shippingFee | |
| `voucher_seller` | EcomOrder | sellerDiscount | Voucher seller |
| `voucher_platform` | EcomOrder | platformDiscount | Lazada subsidy |
| `customer_name` | EcomOrder | buyerUsername | |
| `created_at` | EcomOrder | orderDate | ISO 8601 format |
| `updated_at` | — | — | |
| *(hardcode)* | EcomOrder | platform | `"lazada"` |

#### Order Items Level (`/orders/items/get`):

| Field | Mapping | Ghi chú |
|---|---|---|
| `order_item_id` | Line item ID | Per-item tracking |
| `sku` | → EcomProduct.sku | Match product |
| `name` | Product name | |
| `paid_price` | Item price after discounts | |
| `shipping_amount` | Shipping per item | |
| `voucher_amount` | Discount per item | |
| `status` | Item-level status | Có thể khác vs order status |

> [!IMPORTANT]
> Lazada có **item-level statuses** — mỗi item trong 1 order có thể ở status khác nhau.
> Cần track cả order-level VÀ item-level để reconciliation chính xác.

**Order Statuses Mapping:**

| Lazada Status | XCAP Status | Ý nghĩa |
|---|---|---|
| `pending` | `pending` | Chờ xử lý |
| `packed` | `pending` | Đã đóng gói |
| `ready_to_ship` | `pending` | Sẵn sàng giao |
| `shipped` | `shipping` | Đang vận chuyển |
| `delivered` | `delivered` | Đã giao thành công |
| `failed` | `cancelled` | Giao hàng thất bại |
| `returned` | `returned` | Đã hoàn trả |
| `cancelled` | `cancelled` | Đã hủy |

**Pagination:** `offset` + `limit` (max 100 items). Date range max **15 ngày** per request.

---

### 3.3 Product Data

**API:** `GET /products/get` → product list with details

| Lazada Field | XCAP Entity | XCAP Field | Ghi chú |
|---|---|---|---|
| `item_id` | EcomProduct | productId | PK |
| `attributes.name` | EcomProduct | productName | |
| `skus[0].SellerSku` | EcomProduct | sku | SKU chính |
| `skus[0].price` | EcomProduct | price | Giá hiện tại |
| `skus[0].quantity` | EcomProduct | stock | Tồn kho |
| `status` | EcomProduct | status | `active`, `inactive`, `deleted`, `suspended` |
| `primary_category` | EcomProduct | category | Category ID → resolve name |
| `skus[0].Images` | — | — | Product images array |
| *(hardcode)* | EcomProduct | platform | `"lazada"` |
| `created_at` | EcomProduct | createdAt | |

**Không có sẵn qua API — cần scrape hoặc tính:**

| Field | XCAP Field | Cách lấy |
|---|---|---|
| totalSold | totalSold | SUM(order_items) WHERE product matches |
| totalRevenue | totalRevenue | SUM(paid_price) WHERE product matches |
| rating | rating | Scrape từ Product page hoặc Reviews API |
| reviewCount | reviewCount | `GET /reviews/seller/get` (nếu có access) |

**SKU Variants:** Mỗi product có array `skus[]` — mỗi SKU có riêng: SellerSku, price, quantity, Images, package dimensions.

---

### 3.4 Finance / Transactions

**API:** `GET /finance/transaction/detail/get` → Chi tiết giao dịch
**API:** `GET /finance/payout/status/get` → Trạng thái payout

#### Transaction Detail:

| Lazada Field | XCAP Entity | XCAP Field | Ghi chú |
|---|---|---|---|
| `transaction_number` | EcomSettlement | settlementId | PK |
| `amount` | — | — | Amount per transaction type |
| `transaction_type` | — | — | Xem mapping bên dưới |
| `order_no` | — | — | FK → EcomOrder.orderId |
| `paid_status` | EcomSettlement | status | `pending`, `paid` |
| `transaction_date` | EcomSettlement | settlementDate | |
| `fee_name` | — | — | Detail: commission, shipping, etc. |
| *(hardcode)* | EcomSettlement | platform | `"lazada"` |

**Transaction Types → Settlement Mapping:**

| Transaction Type | XCAP Mapping | Ghi chú |
|---|---|---|
| `Item Revenue` | grossRevenue | Doanh thu sản phẩm |
| `Commission` | platformFee (cộng dồn) | Hoa hồng Lazada |
| `Shipping Fee` | shippingFee | Phí vận chuyển |
| `Service Fee` | platformFee (cộng dồn) | Phí dịch vụ |
| `Adjustment` | adjustments | Điều chỉnh |
| `Refund` | adjustments (trừ) | Hoàn tiền |

> [!IMPORTANT]
> **platformFee** = `Commission` + `Service Fee` + other fees
> **adjustments** = `Adjustment` + `Refund` + `Penalty`
> **netSettlement** = `grossRevenue` - `platformFee` - `shippingFee` - `adjustments`

#### Payout Status:

| Field | XCAP Field | Ghi chú |
|---|---|---|
| `statement_number` | settlementId | Payout statement ID |
| `payout_amount` | netSettlement | Số tiền thực nhận |
| `start_date` / `end_date` | period | Khoảng thời gian payout |
| `status` | status | `processing`, `paid` |

---

### 3.5 Return / Refund

**API:** `GET /order/reverse/get` → Reverse orders (returns, refunds)

| Field | Dùng cho | Ghi chú |
|---|---|---|
| `reverse_order_id` | Return tracking | |
| `order_id` | FK → EcomOrder | |
| `reason` | Analytics | Lý do trả hàng |
| `status` | Return status | `REQUESTED`, `PROCESSING`, `SUCCESS`, `REJECTED` |
| `refund_amount` | Settlement adjustments | |
| `created_at` | Tracking timeline | |

**Tính toán:**
- `returnRate` = count(returned_orders) / count(delivered_orders) × 100
- `cancelRate` = count(cancelled_orders) / count(all_orders) × 100
→ Lưu vào **EcomMetrics** daily.

---

### 3.6 Lazada Sponsored Solutions (In-platform Ads)

**API:** Hạn chế — Lazada Sponsored Solutions API không public.
**Phương án chính:** Extension scrape từ Sponsored Solutions Dashboard.

| Data Point | Source | XCAP Mapping |
|---|---|---|
| Campaign Name | Sponsored Products Dashboard | In-platform Ads table |
| Budget / Spend | Sponsored Dashboard | `budget`, `spend` |
| Impressions / Clicks | Sponsored Dashboard | `impressions`, `clicks` |
| Orders from Ads | Sponsored Dashboard | `orders` |
| ROAS | Sponsored Dashboard | `roas` |
| Ad Type | Sponsored Dashboard | `Sponsored Products` / `Discovery` / `Affiliate` |

**URL cần scrape:**
```
/apps/sponsored/campaign          → Campaign list
/apps/sponsored/product           → Sponsored Products
/apps/sponsored/discovery         → Sponsored Discovery
/apps/sponsored/affiliate         → Sponsored Affiliate
```

---

## 🔌 4. Extension Scraping Guide — Business Advisor

> [!WARNING]
> Lazada Business Advisor data **KHÔNG CÓ public API**.
> Bắt buộc dùng Extension scrape từ Data Insight page.

### Target URL:
```
sellercenter.lazada.vn/apps/data/business-advisor
sellercenter.lazada.com.ph/apps/data/business-advisor
sellercenter.lazada.co.th/apps/data/business-advisor
```

### Metrics cần scrape → EcomMetrics:

| UI Location | Field | XCAP Field | Ghi chú |
|---|---|---|---|
| Business Advisor > Revenue | revenue | revenue | KPI #1 |
| Business Advisor > Orders | orders | orders | Verify vs Order API |
| Business Advisor > Visitors | visitors | visitors | Unique visitors |
| Business Advisor > Page Views | page_views | pageViews | |
| Business Advisor > Conversion Rate | conversion_rate | conversionRate | |
| Product Rankings > Views | product_views | — | Per-product |
| Product Rankings > Sold | items_sold | itemsSold | |
| Traffic Analysis > Sources | traffic_sources | — | Metadata |

### Content Script Flow:

```javascript
// lazada-noi-san-collector.js
const LAZADA_PATTERNS = [
  'sellercenter.lazada.vn',
  'sellercenter.lazada.com.ph',
  'sellercenter.lazada.co.th'
];

// Detect Business Advisor page
if (location.pathname.includes('/apps/data/business-advisor')) {
  await waitForSelector('.business-advisor-container');
  
  const metrics = {
    platform: 'lazada',
    shopId: extractSellerId(), // from URL params or DOM
    date: new Date().toISOString().split('T')[0],
    revenue: parseNumber(querySelector('[data-metric="revenue"]')?.textContent),
    orders: parseInt(querySelector('[data-metric="orders"]')?.textContent),
    visitors: parseInt(querySelector('[data-metric="visitors"]')?.textContent),
    pageViews: parseInt(querySelector('[data-metric="page_views"]')?.textContent),
    conversionRate: parseFloat(querySelector('[data-metric="conversion_rate"]')?.textContent),
  };
  
  await fetch('/api/ecom/metrics', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(metrics)
  });
}

// Detect Dashboard page → scrape seller growth metrics
if (location.pathname === '/' || location.pathname.includes('/apps/seller/dashboard')) {
  const growth = {
    fastFulfilmentRate: parseFloat(querySelector('[data-metric="ffr"]')?.textContent),
    chatResponseRate: parseFloat(querySelector('[data-metric="chat_response"]')?.textContent),
    cancellationRate: parseFloat(querySelector('[data-metric="cancellation"]')?.textContent),
  };
  // Submit growth metrics
}
```

> [!NOTE]
> DOM selectors là **gợi ý**. Lazada dùng React — elements có thể re-render.
> Dùng **MutationObserver** hoặc **polling interval (30s)** để ensure data loaded.

---

## 🔄 5. Sync Strategy

```
Cron Schedule:
├── Every 15min:  Order sync (new + status changes)
│                 GET /orders/get?sort_by=updated_at
├── Every 1h:     Product stock/price sync
│                 GET /products/get
├── Every 6h:     Full product catalog sync
│                 GET /products/get (all statuses)
├── Daily 2AM:    Yesterday's orders finalization
│                 GET /orders/get?created_after=yesterday
├── Daily 3AM:    Finance transaction sync
│                 GET /finance/transaction/detail/get
├── Daily 4AM:    Return/refund sync
│                 GET /order/reverse/get
├── Weekly:       Payout reconciliation
│                 GET /finance/payout/status/get
│                 Match vs bank transfers
└── Extension:    Business Advisor (realtime khi NV mở page)
                  Sponsored Solutions (khi NV mở ads dashboard)
```

---

## ⚠️ 6. Rate Limits & Auth

### OAuth 2.0 Flow:
```
1. Đăng ký app trên Lazada Open Platform
2. Seller authorize → redirect → auth code
3. POST /auth/token/create → access_token + refresh_token
4. Dùng access_token trong mọi API call
5. Refresh trước khi hết hạn (7 ngày)
```

### Token Lifecycle:

| Token | TTL | Ghi chú |
|---|---|---|
| Access Token | 7 days | Dùng cho API calls |
| Refresh Token | 30 days | Dùng để renew access token |
| Auth Code | 1 use | Chỉ dùng 1 lần |

### Rate Limits:

| API Category | Limit | Ghi chú |
|---|---|---|
| Order APIs | ~20 req/min | get orders, items |
| Product APIs | ~20 req/min | get, update products |
| Finance APIs | ~10 req/min | transactions, payouts |
| Seller APIs | ~10 req/min | seller info |

### Request Signature:
```
sign = HMAC-SHA256(app_secret, sorted_params_string)
```

> [!IMPORTANT]
> Lazada API dùng **offset pagination** (không phải cursor).
> Max items per page: **100** (orders), **500** (products).
> Order date range max **15 ngày** per request.

---

## 📊 7. Dashboard Mapping — KPIs Nội sàn

| Dashboard KPI | Công thức | Data Source |
|---|---|---|
| **GMV** | SUM(orders.orderAmount) WHERE status IN (delivered, shipped) | Order API |
| **Orders** | COUNT(orders) WHERE date = today | Order API |
| **Conv Rate** | orders / visitors × 100 | Extension (visitors) + Order API (orders) |
| **AOV** | GMV / Orders | Calculated |
| **Revenue** | SUM(settlements.netSettlement) | Finance API |
| **FFR** | Fast Fulfilment Rate | Extension (Dashboard) |
| **Chat Response** | Response rate | Extension (Dashboard) |

### Charts:
- **Daily GMV** → EcomMetrics.revenue (platform = lazada)
- **Order Trend** → EcomMetrics.orders (7-day / 30-day)
- **Top Products by Revenue** → EcomProduct sorted by totalRevenue DESC
- **Product Rankings** → Extension scrape (Business Advisor)

---

## 🔁 8. Settlement Reconciliation

### Flow: Lazada Payout ↔ Bank Transfer

```
1. Order delivered + buyer confirm
     ↓
2. Lazada settlement period (bi-weekly / monthly):
   grossRevenue - commission - service_fee - shipping = netPayout
     ↓
3. XCAP download transactions via Finance API
     ↓
4. Aggregate by statement period:
   SUM(Item Revenue) - SUM(Commission) - SUM(Shipping) - SUM(Adjustments)
     ↓
5. Match vs payout amount from /finance/payout/status/get
   ✅ Match → mark as RECONCILED
   ❌ Mismatch → Flag discrepancy + detail breakdown
     ↓
6. Verify bank transfer received matches expected payout
     ↓
7. Generate recon report
```

### Discrepancy Types:

| Loại | Ví dụ | Action |
|---|---|---|
| **Missing Transaction** | Order trong Lazada nhưng không có transaction record | Re-sync finance data |
| **Fee Mismatch** | Commission rate bất thường | Check Lazada fee tier |
| **Refund Not Tracked** | Return refund chưa match | Sync reverse orders |
| **Payout Delay** | Expected payout chưa paid | Monitor payout status |
| **Bank Mismatch** | Bank credit ≠ payout amount | Escalate to finance team |

---

## ✅ 9. Implementation Checklist

### Phase 1: Setup (Week 1)
- [ ] Đăng ký Lazada Open Platform app
- [ ] Implement OAuth 2.0 flow + token refresh (7-day cycle)
- [ ] Setup seller authorization cho tất cả shops
- [ ] Tạo `EcomShop` records (seller_id, platform=lazada)
- [ ] Test API connectivity + rate limit handling

### Phase 2: Core Data (Week 2-3)
- [ ] Order sync worker (15-min cron) + item-level tracking
- [ ] Product sync worker (1h + 6h cron) + SKU variants
- [ ] Finance transaction sync (daily cron)
- [ ] Return/refund sync (daily cron)
- [ ] Order status mapping (Lazada → XCAP)
- [ ] `netRevenue` calculation (grossRevenue - all fees)
- [ ] `totalSold` / `totalRevenue` aggregation per product

### Phase 3: Extension (Week 3-4)
- [ ] Business Advisor scraper (revenue, visitors, convRate)
- [ ] Sponsored Solutions scraper (campaign metrics)
- [ ] Dashboard growth metrics scraper (FFR, chat response)
- [ ] Extension → POST /api/ecom/metrics endpoint

### Phase 4: Dashboard & Recon (Week 4-5)
- [ ] KPI cards: GMV, Orders, Conv Rate, AOV, Revenue
- [ ] Charts: Daily GMV trend, Top Products
- [ ] Tables: Shop Performance, Product Rankings
- [ ] Settlement reconciliation engine (bi-weekly/monthly)
- [ ] Payout vs bank transfer matching
- [ ] Discrepancy detection + alerting
- [ ] Cross-stream violation check (Card isolation)

---

> [!IMPORTANT]
> **Lazada API cần chú ý:**
> - Date format: **ISO 8601** (`2026-01-15T00:00:00+07:00`)
> - Order date range max **15 ngày** per request
> - Pagination dùng **offset + limit** (max 100 orders, 500 products)
> - Lazada có **multiple marketplace** (VN, PH, TH...) — seller_id khác nhau per market
> - **Item-level statuses** có thể khác order-level status — cần track cả hai
