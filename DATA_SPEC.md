# DATA SPECIFICATION — Xcap Management Platform

> Tài liệu mô tả chi tiết dữ liệu cần lấy từ từng nguồn, cho Dev team

---

## TỔNG QUAN NGUỒN DỮ LIỆU

| # | Nguồn | Phương pháp | Tần suất |
|---|---|---|---|
| 1 | Facebook Ads | Marketing API + Extension | Mỗi 30s khi NV mở trang |
| 2 | Google Ads | Ads API + Extension | Mỗi 30s khi NV mở trang |
| 3 | TikTok Ads | Marketing API + Extension | Mỗi 30s khi NV mở trang |
| 4 | TikTok Shop | Extension (scrape DOM) | Mỗi 30s khi NV mở trang |
| 5 | Shopee Seller | Extension (scrape DOM) | Mỗi 30s khi NV mở trang |
| 6 | Lazada Seller | Extension (scrape DOM) | Mỗi 30s khi NV mở trang |
| 7 | Browser Activity | Extension (chrome API) | Realtime |
| 8 | Xcap/Bank CSV | Admin upload CSV | Thủ công |
| 9 | Platform Invoices | Admin upload CSV | Thủ công |

---

## 1. FACEBOOK ADS

### URL nhận diện
```
business.facebook.com/adsmanager/*
www.facebook.com/adsmanager/*
```

### Dữ liệu Account Level
| Field | Kiểu | Mô tả | Ví dụ |
|---|---|---|---|
| account_id | string | ID tài khoản QC | "act_123456789" |
| account_name | string | Tên TKQC | "BM4 - X-TERRA" |
| currency | string | Đơn vị tiền | "USD" |
| timezone | string | Múi giờ | "Asia/Ho_Chi_Minh" |
| status | string | Trạng thái | "ACTIVE" |
| spend_cap | number | Giới hạn chi tiêu | 500.00 |
| balance | number | Số dư | 125.50 |

### Dữ liệu Campaign Level
| Field | Kiểu | Mô tả | Ví dụ |
|---|---|---|---|
| campaign_id | string | ID chiến dịch | "23851234567890" |
| campaign_name | string | Tên | "Sale 5.5 - Conv" |
| objective | string | Mục tiêu | "CONVERSIONS" |
| status | string | Trạng thái | "ACTIVE" |
| daily_budget | number | Ngân sách ngày | 50.00 |
| lifetime_budget | number | Ngân sách tổng | 1500.00 |
| start_time | datetime | Ngày bắt đầu | "2026-05-01" |
| stop_time | datetime | Ngày kết thúc | "2026-05-30" |

### Dữ liệu Metrics (theo ngày)
| Field | Kiểu | Đơn vị | Mô tả |
|---|---|---|---|
| spend | number | USD | Tổng chi tiêu |
| impressions | number | lần | Số lần hiển thị |
| reach | number | người | Số người tiếp cận |
| clicks | number | lần | Tổng clicks |
| link_clicks | number | lần | Clicks vào link |
| ctr | number | % | Click-through rate |
| cpc | number | USD | Cost per click |
| cpm | number | USD | Cost per 1000 impressions |
| conversions | number | lần | Số lượt chuyển đổi |
| conversion_value | number | USD | Giá trị chuyển đổi |
| cost_per_result | number | USD | Chi phí / kết quả |
| roas | number | x | Return on ad spend |
| frequency | number | lần | Tần suất trung bình |

### Dữ liệu Creative/Ad
| Field | Kiểu | Mô tả |
|---|---|---|
| ad_id | string | ID quảng cáo |
| ad_name | string | Tên QC |
| headline | string | Tiêu đề |
| body | string | Nội dung text |
| image_url | string | URL hình ảnh |
| video_url | string | URL video |
| thumbnail_url | string | URL thumbnail |
| call_to_action | string | CTA button |
| landing_page_url | string | URL đích |
| format | string | "IMAGE"/"VIDEO"/"CAROUSEL" |

### Dữ liệu Billing
| Field | Kiểu | Mô tả |
|---|---|---|
| transaction_id | string | Mã giao dịch |
| billing_date | date | Ngày tính phí |
| amount | number | Số tiền (USD) |
| card_last4 | string | 4 số cuối thẻ |
| invoice_id | string | Mã hóa đơn |
| payment_status | string | "SETTLED"/"PENDING" |

---

## 2. GOOGLE ADS

### URL nhận diện
```
ads.google.com/aw/campaigns*
ads.google.com/aw/overview*
```

### Dữ liệu Account Level
| Field | Kiểu | Mô tả | Ví dụ |
|---|---|---|---|
| customer_id | string | ID khách hàng | "123-456-7890" |
| descriptive_name | string | Tên TKQC | "GG - Main Account" |
| currency_code | string | Tiền tệ | "USD" |
| time_zone | string | Múi giờ | "Asia/Saigon" |

### Dữ liệu Campaign Level
| Field | Kiểu | Mô tả |
|---|---|---|
| campaign_id | string | ID chiến dịch |
| campaign_name | string | Tên |
| campaign_type | string | "SEARCH"/"DISPLAY"/"VIDEO"/"SHOPPING"/"PMAX" |
| status | string | "ENABLED"/"PAUSED"/"REMOVED" |
| bidding_strategy | string | "TARGET_CPA"/"MAXIMIZE_CONVERSIONS" |
| daily_budget | number | Ngân sách ngày (USD) |

### Dữ liệu Metrics (theo ngày)
| Field | Kiểu | Đơn vị |
|---|---|---|
| cost | number | USD |
| impressions | number | lần |
| clicks | number | lần |
| ctr | number | % |
| avg_cpc | number | USD |
| conversions | number | lần |
| conversion_value | number | USD |
| cost_per_conversion | number | USD |
| search_impression_share | number | % |
| quality_score | number | 1-10 |

### Dữ liệu Keywords (Search campaigns)
| Field | Kiểu | Mô tả |
|---|---|---|
| keyword_text | string | Từ khóa |
| match_type | string | "EXACT"/"PHRASE"/"BROAD" |
| quality_score | number | Điểm chất lượng (1-10) |
| bid | number | Giá thầu (USD) |
| impressions | number | Hiển thị |
| clicks | number | Clicks |
| ctr | number | CTR % |

---

## 3. TIKTOK ADS

### URL nhận diện
```
ads.tiktok.com/i18n/dashboard*
ads.tiktok.com/i18n/campaign*
```

### Dữ liệu Account Level
| Field | Kiểu | Mô tả |
|---|---|---|
| advertiser_id | string | ID nhà QC |
| advertiser_name | string | Tên |
| currency | string | "USD" |
| balance | number | Số dư |
| status | string | "ACTIVE"/"SUSPENDED" |

### Dữ liệu Campaign Level
| Field | Kiểu | Mô tả |
|---|---|---|
| campaign_id | string | ID chiến dịch |
| campaign_name | string | Tên |
| objective_type | string | "CONVERSIONS"/"TRAFFIC"/"REACH" |
| status | string | "ACTIVE"/"PAUSED" |
| budget | number | Ngân sách |
| budget_mode | string | "BUDGET_MODE_DAY"/"BUDGET_MODE_TOTAL" |

### Dữ liệu Metrics (theo ngày)
| Field | Kiểu | Đơn vị |
|---|---|---|
| spend | number | USD |
| impressions | number | lần |
| clicks | number | lần |
| ctr | number | % |
| cpc | number | USD |
| conversions | number | lần |
| conversion_rate | number | % |
| cost_per_conversion | number | USD |
| total_complete_payment | number | lần |
| total_complete_payment_rate | number | % |
| roas | number | x |
| video_views_6s | number | lần |
| video_play_actions | number | lần |

### Dữ liệu Creative
| Field | Kiểu | Mô tả |
|---|---|---|
| ad_id | string | ID QC |
| ad_name | string | Tên |
| ad_text | string | Nội dung |
| video_url | string | URL video TikTok |
| thumbnail_url | string | Thumbnail |
| landing_page_url | string | URL đích |
| call_to_action | string | CTA |

---

## 4. TIKTOK SHOP (Seller Center)

### URL nhận diện
```
seller-vn.tiktok.com/dashboard*
seller-vn.tiktok.com/order*
```

### Dữ liệu Shop
| Field | Kiểu | Mô tả |
|---|---|---|
| shop_id | string | ID shop |
| shop_name | string | Tên shop |
| shop_url | string | Link shop |
| rating | number | Đánh giá (1-5) |
| follower_count | number | Số followers |

### Dữ liệu Orders (theo ngày)
| Field | Kiểu | Mô tả |
|---|---|---|
| date | date | Ngày |
| total_orders | number | Tổng đơn hàng |
| completed_orders | number | Đơn hoàn thành |
| cancelled_orders | number | Đơn hủy |
| returned_orders | number | Đơn trả hàng |
| gmv | number | Tổng GMV (VND) |
| revenue | number | Doanh thu thực (VND) |
| items_sold | number | Số SP bán |

### Dữ liệu Products
| Field | Kiểu | Mô tả |
|---|---|---|
| product_id | string | ID sản phẩm |
| product_name | string | Tên |
| price | number | Giá (VND) |
| stock | number | Tồn kho |
| sold | number | Đã bán |
| rating | number | Đánh giá |
| status | string | "ACTIVE"/"INACTIVE" |

### Dữ liệu Ads (TikTok Shop Ads)
| Field | Kiểu | Mô tả |
|---|---|---|
| ad_spend | number | Chi tiêu QC (VND) |
| ad_orders | number | Đơn từ QC |
| ad_gmv | number | GMV từ QC |
| ad_roas | number | ROAS quảng cáo |

---

## 5. SHOPEE SELLER CENTER

### URL nhận diện
```
seller.shopee.vn/portal/sale*
seller.shopee.vn/portal/marketing*
banhang.shopee.vn/*
```

### Dữ liệu Shop
| Field | Kiểu | Mô tả |
|---|---|---|
| shop_id | string | ID shop |
| shop_name | string | Tên shop |
| shop_url | string | Link shop |
| rating | number | Đánh giá (1-5) |
| response_rate | number | Tỉ lệ phản hồi % |
| ship_on_time_rate | number | Tỉ lệ giao đúng hạn % |

### Dữ liệu Orders
| Field | Kiểu | Mô tả |
|---|---|---|
| date | date | Ngày |
| total_orders | number | Tổng đơn |
| shipped_orders | number | Đã giao |
| completed_orders | number | Hoàn thành |
| cancelled_orders | number | Hủy |
| return_refund | number | Hoàn/trả |
| revenue | number | Doanh thu (VND) |
| gmv | number | GMV (VND) |

### Dữ liệu Products
| Field | Kiểu | Mô tả |
|---|---|---|
| item_id | string | ID sản phẩm |
| item_name | string | Tên |
| price | number | Giá (VND) |
| stock | number | Tồn kho |
| sold | number | Đã bán (30 ngày) |
| rating | number | Đánh giá |
| views | number | Lượt xem |

### Dữ liệu Shopee Ads
| Field | Kiểu | Mô tả |
|---|---|---|
| ad_type | string | "keyword"/"discovery"/"shop_ads" |
| ad_spend | number | Chi tiêu (VND) |
| impressions | number | Hiển thị |
| clicks | number | Clicks |
| ctr | number | CTR % |
| orders | number | Đơn từ QC |
| gmv | number | GMV từ QC |
| roas | number | ROAS |

---

## 6. LAZADA SELLER CENTER

### URL nhận diện
```
sellercenter.lazada.vn/apps/seller/login*
sellercenter.lazada.vn/apps/order/list*
```

### Dữ liệu Shop
| Field | Kiểu | Mô tả |
|---|---|---|
| seller_id | string | ID seller |
| shop_name | string | Tên shop |
| positive_rating | number | % đánh giá tốt |
| ship_on_time | number | % giao đúng hạn |

### Dữ liệu Orders
| Field | Kiểu | Mô tả |
|---|---|---|
| date | date | Ngày |
| total_orders | number | Tổng đơn |
| pending | number | Chờ xử lý |
| ready_to_ship | number | Sẵn sàng giao |
| shipped | number | Đang giao |
| delivered | number | Đã giao |
| cancelled | number | Hủy |
| revenue | number | Doanh thu (VND) |

### Dữ liệu Products
| Field | Kiểu | Mô tả |
|---|---|---|
| sku_id | string | SKU |
| product_name | string | Tên |
| price | number | Giá (VND) |
| stock | number | Tồn kho |
| sold | number | Đã bán |
| rating | number | Đánh giá |

### Dữ liệu Lazada Ads
| Field | Kiểu | Mô tả |
|---|---|---|
| ad_spend | number | Chi tiêu (VND) |
| impressions | number | Hiển thị |
| clicks | number | Clicks |
| orders | number | Đơn từ QC |
| revenue_from_ads | number | Doanh thu từ QC |
| roas | number | ROAS |

---

## 7. BROWSER TRACKING (Extension)

### Dữ liệu Browsing History
| Field | Kiểu | Mô tả | Ví dụ |
|---|---|---|---|
| url | string | URL đầy đủ | "https://ads.google.com/..." |
| domain | string | Domain | "ads.google.com" |
| title | string | Tiêu đề tab | "Google Ads - Campaigns" |
| visited_at | datetime | Thời điểm truy cập | "2026-05-08T09:15:00Z" |
| duration | number | Thời gian trên trang (giây) | 180 |
| source | string | Nguồn | "typed"/"link"/"redirect" |
| category | string | Phân loại tự động | "work_ads"/"work_ecom"/"other" |

### Phân loại Domain tự động
```
work_ads:   facebook.com/adsmanager, ads.google.com, ads.tiktok.com
work_ecom:  seller.shopee.vn, sellercenter.lazada.vn, seller-vn.tiktok.com
social:     facebook.com, youtube.com, tiktok.com (không phải ads)
other:      tất cả domain khác
```

### Dữ liệu Activity Session
| Field | Kiểu | Mô tả |
|---|---|---|
| date | date | Ngày làm việc |
| start_time | datetime | Giờ bắt đầu |
| end_time | datetime | Giờ kết thúc |
| active_minutes | number | Phút hoạt động |
| idle_minutes | number | Phút nghỉ (> 5 min không thao tác) |
| tabs_opened | number | Tổng tabs đã mở |
| productivity_score | number | Điểm năng suất (0-100) |
| platform_minutes | object | Phút trên từng platform |

### KHÔNG thu thập
- ❌ Passwords, form data
- ❌ Nội dung trang web
- ❌ Screenshots
- ❌ File downloads
- ❌ Cookies, local storage

---

## 8. FINANCE — Import thủ công

### Giao dịch thẻ (từ Xcap/Bank CSV)
| Field | Kiểu | Mô tả | Ví dụ |
|---|---|---|---|
| date | date | Ngày giao dịch | "2026-05-01" |
| merchant | string | Tên merchant | "FACEBK *99Q2XLD9S2" |
| card_last4 | string | 4 số cuối thẻ | "1785" |
| amount | number | Số tiền (USD) | -25.50 |
| amount_vnd | number | Quy đổi VND | 637500 |
| currency | string | Loại tiền | "USD" |
| status | string | Trạng thái | "Settled" |
| reference | string | Mã tham chiếu | "99Q2XLD9S2" |

### Hóa đơn platform (từ FB/GG/TT)
| Field | Kiểu | Mô tả | Ví dụ |
|---|---|---|---|
| platform | string | Nền tảng | "Facebook" |
| invoice_ref | string | Mã hóa đơn | "FB-INV-20260501" |
| amount | number | Số tiền | 637500 |
| ad_account_id | string | TKQC liên quan | "act_123456789" |
| card_last4 | string | Thẻ thanh toán | "1785" |
| date | date | Ngày | "2026-05-01" |

---

## 9. API ENDPOINTS — GỬI DỮ LIỆU VỀ SERVER

### Extension → Server

```
POST /api/marketing/submit
Body: {
  "platform": "facebook",
  "accountId": "act_123456789",
  "profileId": "IX-NV001-1",
  "campaigns": [ ... array of campaign objects ... ]
}

POST /api/tracking/history
Body: {
  "profileId": "IX-NV001-1",
  "entries": [
    { "url": "...", "domain": "...", "title": "...", "duration": 180, "category": "work_ads" }
  ]
}

POST /api/tracking/session
Body: {
  "profileId": "IX-NV001-1",
  "date": "2026-05-08",
  "startTime": "...",
  "endTime": "...",
  "activeMinutes": 420,
  "idleMinutes": 60,
  "tabsOpened": 15,
  "productivityScore": 85,
  "platformActivity": {
    "facebook": 120, "google": 90, "tiktok_ads": 60,
    "shopee": 80, "lazada": 40, "tiktok_shop": 30
  }
}
```

### Admin Upload → Server
```
POST /api/finance/transactions/import
Body: { "transactions": [ ... ] }

POST /api/finance/invoices/import
Body: { "invoices": [ ... ] }

POST /api/finance/reconcile
→ Auto-match transactions ↔ invoices
```
