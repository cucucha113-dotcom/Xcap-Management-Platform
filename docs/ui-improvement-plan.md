# 🎯 XCAP UI Improvement Plan — Dev Site → Mockup Alignment

> **Dev site:** https://ads.byscom.net
> **Mockup target:** `/mockup/screenshots/`
> **Mục tiêu:** Dev nhìn vào biết cần chỉnh gì, ở đâu, thay đổi thế nào

---

## 📊 Tổng quan So sánh

| Tiêu chí | Dev Site (ads.byscom.net) | Mockup Target | Gap |
|---|---|---|---|
| Layout | Topbar + Sidebar (260px) + Content | Logo + Sidebar (200px) + Content | ⚠️ Sidebar nhỏ hơn, có user profile |
| Stat Cards | 5 cards, chỉ hiện value + label | 5 cards, có icon, trend %, sub-label | 🔴 Thiếu icon, trend, sub-info |
| Charts | Chart.js canvas | CSS bar chart + SVG donut | ⚠️ Chức năng tương đương, style khác |
| Sidebar | Flat nav, no user card | User profile card + section badges | 🔴 Thiếu user profile, badge counts |
| Browser Profiles | Có view-browsers, thiếu cột | 10 cột đầy đủ + KPI cards | 🔴 Thiếu fingerprint, session, pages |
| Employee Detail | Không có drill-down | Full detail + profiles + history | 🔴 Chưa có trang này |

---

## 🔴 Module 1: SIDEBAR — Cải tiến Navigation

### Mockup Target:
![Mockup Sidebar](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/01_overview.png)

### Cần thay đổi:

#### 1.1 Thêm User Profile Card (Ưu tiên: 🔴 HIGH)
**File:** `index.html` — trong `.sidebar`, trước `.nav-section` đầu tiên
**Thêm:**
```html
<!-- Thêm ngay sau <div class="sidebar"> -->
<div class="user-profile-card">
  <div class="user-avatar">ĐN</div>
  <div class="user-info">
    <div class="user-name">Nguyễn Đạt</div>
    <div class="user-role">Super Admin</div>
  </div>
  <span class="online-dot"></span>
</div>
```
**CSS cần thêm:**
```css
.user-profile-card {
  display: flex; align-items: center; gap: 12px;
  padding: 14px; margin-bottom: 20px;
  background: rgba(26,86,219,0.08); border-radius: 10px;
  border: 1px solid var(--border); position: relative;
}
.user-avatar {
  width: 40px; height: 40px; border-radius: 10px;
  background: #1a56db; display: flex; align-items: center;
  justify-content: center; font-weight: 700; color: #fff; font-size: 14px;
}
.user-name { font-weight: 700; font-size: 13px; color: var(--text); }
.user-role { font-size: 11px; color: var(--text2); }
.online-dot {
  position: absolute; top: 14px; right: 14px;
  width: 8px; height: 8px; border-radius: 50%; background: #34d399;
}
```

#### 1.2 Thêm Badge Counts trên Nav Items (Ưu tiên: 🟡 MEDIUM)
**Hiện tại:** Chỉ có một số nav item có `.nav-count`
**Cần thêm:** Badge cho tất cả key items:
- Nhân viên: count dynamic (hiện có nhưng `display:none`)
- Browser Profiles: hiện count running profiles
- Đối soát: hiện count unmatched

**Sửa:** Bỏ `display:none` ở `#nav-count-employees`, set `.nav-count` style thêm animation:
```css
.nav-count { animation: pulse 2s infinite; }
```

#### 1.3 Thêm Sync Status Footer (Ưu tiên: 🟢 LOW)
**Thêm cuối sidebar:**
```html
<div class="sidebar-footer">
  <span class="dot-sm dot-green dot-pulse"></span>
  <span>Synced 30s ago</span>
</div>
```

---

## 🔴 Module 2: OVERVIEW — Stat Cards Upgrade

### Mockup Target:
````carousel
![Overview Stats](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/01_overview.png)
<!-- slide -->
![Spend Page](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/03_spend.png)
````

### 2.1 Stat Cards: Thêm Icon + Trend + Sub-label (Ưu tiên: 🔴 HIGH)

**Hiện tại (dev):**
```html
<div class="stat-card green">
  <div class="stat-value" id="ov-spend">—</div>
  <div class="stat-label">Tổng chi tiêu</div>
</div>
```

**Cần đổi thành:**
```html
<div class="stat-card green">
  <div class="stat-header">
    <span class="stat-label">TỔNG CHI TIÊU FB</span>
    <span class="stat-icon">💰</span>
  </div>
  <div class="stat-value" id="ov-spend">—</div>
  <div class="stat-sub">
    <span class="stat-change up">↑ 12.5%</span> so với tháng trước
  </div>
</div>
```

**CSS thêm:**
```css
.stat-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 8px;
}
.stat-icon { font-size: 20px; opacity: 0.6; }
.stat-sub { font-size: 11px; color: var(--text2); margin-top: 6px; }
.stat-change { font-weight: 600; font-size: 11px; }
.stat-change.up { color: #34d399; }
.stat-change.down { color: #60a5fa; }
```

**Áp dụng cho TẤT CẢ 5 stat cards:**

| Card | Label | Icon | Trend |
|---|---|---|---|
| 1 (green) | TỔNG CHI TIÊU FB | 💰 | ↑ X% so với tháng trước |
| 2 (blue) | CONVERSIONS | 🎯 | ↑ X% CPA avg: $Y |
| 3 (new) | CPA | 💲 | ↓ X% tốt hơn tháng trước |
| 4 (orange) | IMPRESSIONS | 👁️ | X/Y campaigns đang active |
| 5 (red) | PENDING REQUESTS | 📋 | $X chờ duyệt |

> [!IMPORTANT]
> Card thứ 3 hiện là "CPC TB" trên dev site → **Đổi thành CPA** (Chi phí trên mỗi kết quả). Công thức: `totalSpend / totalConversions`

### 2.2 Top-border color cho stat cards (Ưu tiên: 🟡 MEDIUM)
**CSS thêm:**
```css
.stat-card.green { border-top: 3px solid #34d399; }
.stat-card.blue { border-top: 3px solid #60a5fa; }
.stat-card.orange { border-top: 3px solid #fb923c; }
.stat-card.red { border-top: 3px solid #f87171; }
.stat-card.purple { border-top: 3px solid #a78bfa; }
```

---

## 🔴 Module 3: CAMPAIGNS TABLE — Enhanced Columns

### 2 thay đổi chính:

#### 3.1 Đổi cột "CPC" → "CPA" (Ưu tiên: 🔴 HIGH)
**File:** HTML campaigns table header + JS render function
- Header: `<th>CPC ↕</th>` → `<th>CPA ↕</th>`
- Data: Dùng `costPerResult` thay cho `cpcAll`

#### 3.2 Thêm ROAS color coding (Ưu tiên: 🟡 MEDIUM)
**Trong JS render campaigns:**
```javascript
// ROAS >= 4x → green, >= 2x → orange, < 2x → red
const roasColor = roas >= 4 ? '#34d399' : roas >= 2 ? '#fb923c' : '#f87171';
td.style.color = roasColor;
td.style.fontWeight = '700';
```

---

## 🔴 Module 4: BROWSER PROFILES — Missing Columns

### Mockup Target:
![Browser Profiles](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/05_browsers.png)

### 4.1 Thêm cột thiếu vào table (Ưu tiên: 🔴 HIGH)

**Hiện tại dev có:** Profile, Nhân viên, IP, Trạng thái, Extension, Platform, Accounts, Hoạt động, Hành động

**Cần thêm theo mockup:**

| Cột | Mô tả | Priority |
|---|---|---|
| OS / Browser | `Windows 11 · Chrome 124` | 🔴 HIGH |
| Fingerprint | Badge `FP-8a2f4d` | 🔴 HIGH |
| Session Time | `3h 24m` hoặc `-` | 🔴 HIGH |
| Pages Today | Số trang đã truy cập | 🟡 MEDIUM |
| Last Active | `2 phút trước` | 🟡 MEDIUM |

**Header HTML cần sửa:**
```html
<thead><tr>
  <th>Profile</th>
  <th>NV</th>
  <th>OS / Browser</th>    <!-- MỚI -->
  <th>Proxy</th>
  <th>Fingerprint</th>     <!-- MỚI -->
  <th>Status</th>
  <th>Platform</th>
  <th>Extension</th>
  <th>Session</th>          <!-- MỚI -->
  <th>Last Active</th>      <!-- MỚI -->
</tr></thead>
```

### 4.2 KPI Cards cập nhật (Ưu tiên: 🟡 MEDIUM)

**Hiện tại dev có:** Tổng profiles, Active, Đang chạy, Pending
**Mockup có:** Running (🟢), Tổng Profiles (🌐), Extensions Active (🔌), Pages Today (📄)

→ **Thêm icon vào stat cards** tương tự Module 2

### 4.3 Click vào row → drill-down Employee Detail (Ưu tiên: 🔴 HIGH)
**Cần thêm `onclick` handler:**
```javascript
tr.onclick = () => navigateTo('emp-detail:' + employeeCode);
tr.style.cursor = 'pointer';
```

---

## 🔴 Module 5: EMPLOYEE DETAIL — Trang mới

### Mockup Target:
![Employee Detail](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/06_employee_detail.png)

> [!CAUTION]
> Trang này **CHƯA CÓ** trên dev site. Cần tạo mới hoàn toàn.

### Layout gồm:

```
┌─────────────────────────────────┬─────────────────────────────┐
│  ← Quay lại                     │                             │
├─────────────────────────────────┤    FB Campaigns (table)      │
│  Avatar + Name + Code + Role    │    Campaign | Status | Spent │
│  ┌──────┐ ┌──────┐             │    | CTR | ROAS              │
│  │Dự án │ │Spend │             │                             │
│  │DA 1  │ │$218  │             │                             │
│  ├──────┤ ├──────┤             │                             │
│  │Profile│ │Cards │             │                             │
│  │  2   │ │  1   │             │                             │
│  └──────┘ └──────┘             │                             │
├─────────────────────────────────┴─────────────────────────────┤
│  🌐 Browser Profiles (2)                                      │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 🟢 Đạt_FB_Main | Win11 · Chrome 124 | FP-8a2f4d | 3h24m│ │
│  │ 🔴 Đạt_FB_Backup | Win11 · Chrome 124 | stopped         │ │
│  └──────────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────────┤
│  📜 Browsing History — Hôm nay                                │
│  🕐 Session 08:15 — 3h 24m                                   │
│  ● 08:15 Ads Manager - Campaigns (45m)                       │
│  ● 09:00 Ads Manager - Ads (30m)                             │
│  ● 09:30 Billing Hub (15m)                                    │
│  ● 09:45 Reports (1h 20m)                                    │
└───────────────────────────────────────────────────────────────┘
```

### Data sources:
- Employee info: `/api/employees/:code`
- Browser profiles: filter `browserProfiles` by `employeeCode`
- Campaigns: filter `campaigns` by `employee`
- Cards: filter `cards` by `employee`
- Browsing sessions: filter `browsingSessions` by profile ID

---

## 🟡 Module 6: EMPLOYEES TABLE — Clickable Rows

### Mockup Target:
![Employees](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/04_employees.png)

### 6.1 Thêm avatar + clickable rows (Ưu tiên: 🟡 MEDIUM)

**Hiện tại:** Plain text rows
**Cần đổi:**
```javascript
// Trong render employee row:
`<tr onclick="navigateTo('emp-detail:${e.code}')" style="cursor:pointer">
  <td>
    <div style="display:flex;align-items:center;gap:10px">
      <div class="emp-avatar" style="background:${color}">
        ${e.name.split(' ').pop()[0]}
      </div>
      <div>
        <div style="font-weight:600">${e.name}</div>
        <div style="font-size:11px;color:var(--text2)">${e.code}</div>
      </div>
    </div>
  </td>
  ...
</tr>`
```

**CSS:**
```css
.emp-avatar {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: #fff; font-size: 13px; flex-shrink: 0;
}
```

---

## 🟡 Module 7: RECONCILIATION — Badge Styling

### Mockup Target:
![Recon](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/07_recon.png)

### 7.1 Recon status badges (Ưu tiên: 🟡 MEDIUM)
```css
.badge-matched { background: #064e3b; color: #34d399; }
.badge-partial { background: #3b2c1f; color: #fb923c; }
.badge-unmatched { background: #3b1f1f; color: #f87171; }
.badge-pending { background: #1e3a5f; color: #60a5fa; }
```

### 7.2 Thêm "Auto Match" button (Ưu tiên: 🟢 LOW)
```html
<button class="btn-primary btn-sm">⟳ Auto Match</button>
```

---

## 🟡 Module 8: CARDS — Usage Progress Bar

### Mockup Target:
![Cards](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/08_cards.png)

### 8.1 Thêm Usage % column (Ưu tiên: 🟡 MEDIUM)
**Dev đã có `.usage-bar` CSS** → Cần thêm vào table render:
```javascript
const pct = Math.round(spent / limit * 100);
const color = pct > 80 ? '#f87171' : pct > 50 ? '#fb923c' : '#34d399';
`<td>
  <div class="usage-bar"><div class="usage-bar-fill" style="width:${pct}%;background:${color}"></div></div>
  <span style="font-size:11px;color:var(--text2)">${pct}%</span>
</td>`
```

---

## 🟡 Module 9: TOP-UP REQUESTS — Card Layout

### Mockup Target:
![Top-up](/Users/mac/.gemini/antigravity/brain/c89efd2b-e021-4d13-afb8-d06fc14ce27e/09_topup.png)

### 9.1 Request cards thay vì table (Ưu tiên: 🟢 LOW)

**CSS mới:**
```css
.request-card {
  display: flex; gap: 16px; align-items: center;
  padding: 16px; background: var(--surface2);
  border: 1px solid var(--border); border-radius: 10px;
  margin-bottom: 8px;
}
.request-icon { font-size: 24px; }
.request-info { flex: 1; }
.request-title { font-weight: 600; margin-bottom: 4px; }
.request-meta { font-size: 11px; color: var(--text2); }
.request-amount { text-align: right; }
```

---

## Verification Plan

### Automated Tests
```bash
# Chạy dev server local
npm run dev

# Mở browser check từng page
# Đối chiếu visual vs mockup screenshots
```

### Manual Verification
1. So sánh từng page screenshot với mockup images
2. Check responsive trên mobile (768px breakpoint)
3. Verify data flow: Employees → click → Employee Detail → profiles → browsing history
4. Test badge colors, stat card trends, chart rendering

---

## Priority Roadmap

| # | Module | Priority | Effort | Impact |
|---|---|---|---|---|
| 1 | Stat Cards (icons, trends, CPA) | 🔴 HIGH | 2h | Cao — UX chính |
| 2 | Browser Profiles (thêm cột) | 🔴 HIGH | 3h | Cao — tính năng mới |
| 3 | Employee Detail page (tạo mới) | 🔴 HIGH | 4h | Cao — drill-down |
| 4 | Sidebar user profile | 🔴 HIGH | 1h | Trung bình — visual |
| 5 | Employee clickable rows | 🟡 MED | 1h | Trung bình — UX |
| 6 | Recon badges + Auto Match | 🟡 MED | 1h | Thấp — visual |
| 7 | Cards usage bar | 🟡 MED | 1h | Thấp — có sẵn CSS |
| 8 | Request card layout | 🟢 LOW | 2h | Thấp — cosmetic |
| 9 | Sync status footer | 🟢 LOW | 0.5h | Thấp — cosmetic |

> **Tổng estimate:** ~15.5h dev time

