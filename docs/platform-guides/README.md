# 📋 Xcap Management Platform — Cross-Platform Data Collection Guides

> **Tổng:** 6 platforms | 188 data fields | 28 annotated views | 6 video walkthroughs
> **Ngày tạo:** 11/05/2026

## 📊 Platform Guides

| # | Platform | Guide | Data Fields | Annotated Views | Video |
|---|---|---|---|---|---|
| 1 | 🔵 Facebook Ads | [facebook_ads_data_guide.md](facebook_ads_data_guide.md) | 28 | 7 | ✅ |
| 2 | 🟠 Shopee Seller Centre | [shopee_data_guide.md](shopee_data_guide.md) | 34 | 3 | ✅ |
| 3 | 🔵 Lazada Seller Center | [lazada_data_guide.md](lazada_data_guide.md) | 30 | 5 | ✅ |
| 4 | 🟢 Google Ads | [google_ads_data_guide.md](google_ads_data_guide.md) | 25 | 4 | ✅ |
| 5 | ⬛ TikTok Shop | [tiktok_shop_data_guide.md](tiktok_shop_data_guide.md) | 49 | 5 | ✅ |
| 6 | ⬛ TikTok Ads | [tiktok_ads_data_guide.md](tiktok_ads_data_guide.md) | 22 | 4 | ✅ |

## 📁 Structure

```
docs/platform-guides/
├── README.md                      ← This file
├── facebook_ads_data_guide.md     ← FB Ads Manager + Billing
├── shopee_data_guide.md           ← Shopee Seller Centre PH
├── lazada_data_guide.md           ← Lazada Seller Center PH
├── google_ads_data_guide.md       ← Google Ads MCC
├── tiktok_shop_data_guide.md      ← TikTok Shop Seller Center
├── tiktok_ads_data_guide.md       ← TikTok Ads Manager
└── assets/                        ← All screenshots & videos
    ├── fb_*.png                   ← Facebook annotated images
    ├── fb_*.webp                  ← Facebook video walkthroughs
    ├── shopee_*.png               ← Shopee annotated images
    ├── shopee_*.webp              ← Shopee video walkthrough
    ├── lazada_*.png               ← Lazada annotated images
    ├── lazada_*.webp              ← Lazada video walkthrough
    ├── gads_*.png                 ← Google Ads annotated images
    ├── gads_*.webp                ← Google Ads video walkthrough
    ├── tts_*.png                  ← TikTok Shop annotated images
    ├── tts_*.webp                 ← TikTok Shop video walkthrough
    ├── ttads_*.png                ← TikTok Ads annotated images
    └── ttads_*.webp               ← TikTok Ads video walkthrough
```

## 🎯 Mục đích

Tài liệu này phục vụ đội dev xây dựng **browser-based automated collector** cho Xcap Management Platform:

1. **Ảnh annotated (red box)** — Chỉ rõ vị trí từng data field trên UI
2. **Video walkthrough (.webp)** — Demo thao tác navigate thực tế
3. **URL patterns** — Danh sách URL cần scrape cho mỗi platform
4. **Data fields** — Tổng hợp tất cả fields cần extract, ưu tiên theo mức độ

## ⚠️ Lưu ý

- Tất cả screenshots đều từ **tài khoản thật** (không phải mock)
- Video `.webp` có thể xem trực tiếp trên GitHub hoặc tải về
- Paths trong markdown sử dụng relative path `assets/filename`
