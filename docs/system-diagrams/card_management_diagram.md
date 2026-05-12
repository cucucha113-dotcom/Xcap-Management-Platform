# 💳 XCAP — Card Management & Top-up Request System Diagram

> **Luồng hiện tại:** Google Forms → Kế toán → xcapwallet.com (thủ công)
> **Mục tiêu:** Tích hợp luồng request + quản lý thẻ + sync transaction vào XCAP app
> **External system:** https://app.xcapwallet.com (VNB — Ads Agency Management Platform)

---

## 1. LUỒNG HIỆN TẠI (AS-IS) — Thủ công

```mermaid
sequenceDiagram
    actor GDDA as GĐ Dự án
    participant GF as Google Forms
    actor KT as Kế toán
    participant XW as xcapwallet.com
    participant CARD as Thẻ Ads

    Note over GDDA,CARD: === LUỒNG NẠP TIỀN (hiện tại - thủ công) ===
    
    GDDA->>GF: Fill form "REQUEST NẠP ADS"
    Note right of GDDA: Điền: dự án, số tiền,<br/>thẻ, tài khoản QC
    
    GF-->>KT: Email thông báo có request mới
    
    KT->>XW: Đăng nhập xcapwallet.com
    KT->>XW: Mở limit thẻ (nâng hạn mức)
    XW->>CARD: Limit thẻ được nâng
    
    CARD->>XW: Transactions xuất hiện tại<br/>/transactions
    
    KT->>XW: Kiểm tra transactions
    Note right of KT: So khớp thủ công<br/>request ↔ transaction
    
    Note over GDDA,CARD: ❌ Vấn đề: 3 hệ thống rời rạc, không có audit trail
```

### Vấn đề hiện tại

| # | Vấn đề | Hậu quả |
|---|---|---|
| 1 | Google Forms tách rời | Không track trạng thái request |
| 2 | Xcapwallet thao tác thủ công | Dễ sai, không có log |
| 3 | Transaction check thủ công | Mất thời gian, không realtime |
| 4 | Không có approval workflow | GĐĐA request → KT làm ngay, thiếu kiểm soát |
| 5 | Không liên kết identity | Không biết card → NV → dự án → ad account |

---

## 2. LUỒNG MỚI (TO-BE) — Tích hợp vào XCAP

```mermaid
sequenceDiagram
    actor GDDA as GĐ Dự án
    participant APP as XCAP App
    participant API as XCAP API
    participant DB as MongoDB
    participant XW_API as xcapwallet.com API
    participant XW as xcapwallet.com
    actor KT as Kế toán
    actor TGD as TGĐ (Approve)

    Note over GDDA,TGD: === LUỒNG NẠP TIỀN (mới - tích hợp) ===
    
    GDDA->>APP: Tạo Top-up Request
    Note right of GDDA: Chọn: thẻ, số tiền,<br/>dự án, ad account, lý do
    
    APP->>API: POST /api/cards/requests
    API->>DB: Save request (status=pending)
    API-->>APP: Request created
    
    API->>APP: Notify KT + TGĐ (WebSocket + Telegram)
    
    alt Cần TGĐ duyệt (amount > threshold)
        TGD->>APP: Review & Approve
        APP->>API: PUT /api/cards/requests/:id/approve
        API->>DB: status = "approved"
    end
    
    KT->>APP: Xem request đã approved
    KT->>APP: Click "Thực hiện nạp"
    APP->>API: POST /api/cards/requests/:id/execute
    
    alt Có API integration
        API->>XW_API: PUT /cards/:id/limit (nâng hạn mức)
        XW_API-->>API: { success, newLimit }
    else Manual (phase 1)
        API-->>KT: Redirect → xcapwallet.com (mở tab mới)
        KT->>XW: Thao tác nâng limit thủ công
        KT->>APP: Confirm đã nạp xong
        APP->>API: PUT /api/cards/requests/:id/complete
    end
    
    API->>DB: status = "completed", executedAt, executedBy
    
    Note over API,XW: === AUTO SYNC TRANSACTIONS ===
    
    loop Mỗi 30 phút
        API->>XW_API: GET /transactions?since=lastSync
        XW_API-->>API: [transactions]
        API->>DB: Upsert transactions
        API->>DB: Auto-link: txn → card → employee → project
    end
```

---

## 3. REQUEST LIFECYCLE (State Machine)

```mermaid
stateDiagram-v2
    [*] --> Draft: GĐ DA tạo request

    Draft --> Pending: Submit
    Pending --> Approved: TGĐ/KT approve
    Pending --> Rejected: TGĐ/KT reject
    
    Approved --> Executing: KT bắt đầu nạp
    Executing --> Completed: Nạp thành công
    Executing --> Failed: Nạp thất bại
    
    Failed --> Executing: Retry
    Rejected --> Draft: Sửa & submit lại
    Completed --> [*]
    
    note right of Pending
        amount <= threshold → Auto-approve
        amount > threshold → Cần TGĐ duyệt
    end note
    
    note right of Completed
        Log: executedBy, executedAt
        Sync: check transaction từ xcapwallet
        Update: card limit history
    end note
```

---

## 4. CARD ISSUANCE FLOW (Cấp thẻ mới)

```mermaid
sequenceDiagram
    actor GDDA as GĐ Dự án
    participant APP as XCAP App
    participant API as XCAP API
    participant DB as MongoDB
    actor KT as Kế toán
    participant XW as xcapwallet.com

    Note over GDDA,XW: === LUỒNG CẤP THẺ MỚI ===
    
    GDDA->>APP: Tạo Card Request
    Note right of GDDA: Loại: Cấp thẻ mới<br/>Cho NV: NV Đạt<br/>Dự án: DA 1<br/>Platform: Facebook Ads<br/>Hạn mức ban đầu: $200

    APP->>API: POST /api/cards/requests {type: "new_card"}
    API->>DB: Save (status=pending, type=new_card)
    
    API->>APP: Notify TGĐ (cần duyệt cấp thẻ mới)
    
    GDDA->>APP: TGĐ approve
    APP->>API: PUT /api/cards/requests/:id/approve
    
    KT->>XW: Tạo thẻ mới trên xcapwallet.com
    KT->>APP: Nhập thông tin thẻ mới
    Note right of KT: cardName, last4,<br/>bankAccount, initial limit
    
    APP->>API: POST /api/cards {cardName, last4, employeeId, project...}
    API->>DB: Create PaymentCard
    API->>DB: Link: card → employee → project → ad accounts
    API->>DB: Update request: status=completed
    
    API->>APP: Notify GĐĐA + NV: "Thẻ mới đã được cấp"
```

---

## 5. TRANSACTION SYNC (Đồng bộ giao dịch)

```mermaid
flowchart TD
    subgraph XW["xcapwallet.com"]
        TXN_SRC["Transactions Page<br/>/transactions"]
    end
    
    subgraph SYNC["XCAP Sync Engine"]
        CRON["⏰ Cron Job<br/>Mỗi 30 phút"]
        FETCH["Fetch transactions<br/>từ xcapwallet API"]
        PARSE["Parse & normalize"]
        MATCH["Auto-match:<br/>card.last4 → PaymentCard"]
        LINK["Link identity chain:<br/>txn → card → NV → DA → ad account"]
    end
    
    subgraph DB["MongoDB"]
        TXN_DB["PaymentTransaction"]
        CARD_DB["PaymentCard"]
        EMP_DB["Employee"]
    end
    
    subgraph DASH["Dashboard"]
        RECON["Finance > Recon"]
        REPORT["Reports"]
    end
    
    TXN_SRC -->|"API / Scrape"| FETCH
    CRON --> FETCH
    FETCH --> PARSE --> MATCH
    MATCH --> CARD_DB
    MATCH --> LINK
    LINK --> EMP_DB
    LINK --> TXN_DB
    TXN_DB --> RECON
    TXN_DB --> REPORT
```

### Sync Strategy

| Method | Mô tả | Ưu tiên |
|---|---|---|
| **API (nếu có)** | `GET /api/transactions?since=lastSync` | ⭐ Tốt nhất |
| **Webhook** | xcapwallet push event khi có txn mới | ⭐⭐ Realtime |
| **CSV Export** | KT export CSV từ /transactions → import | Backup |
| **Extension Scrape** | Extension đọc DOM /transactions | Phase 1 |

---

## 6. ENTITY RELATIONSHIP

```mermaid
erDiagram
    CARD_REQUEST ||--|| PAYMENT_CARD : "creates/topup"
    CARD_REQUEST }o--|| EMPLOYEE : "requestedBy"
    CARD_REQUEST }o--|| EMPLOYEE : "approvedBy"
    CARD_REQUEST }o--|| EMPLOYEE : "executedBy"
    CARD_REQUEST }o--|| PROJECT : "forProject"
    
    PAYMENT_CARD ||--o{ TRANSACTION : "generates"
    PAYMENT_CARD ||--o{ LIMIT_HISTORY : "tracks"
    PAYMENT_CARD }o--|| EMPLOYEE : "assignedTo"
    PAYMENT_CARD }o--|| BANK_ACCOUNT : "linkedBank"
    
    CARD_REQUEST {
        ObjectId _id
        string type "new_card / topup / limit_change"
        ObjectId requestedBy "GĐ Dự án"
        ObjectId cardId "null nếu new_card"
        ObjectId project
        number requestedAmount "$200"
        string platform "facebook / google / tiktok"
        string adAccountId
        string reason "Nạp ads FB tháng 5"
        string status "draft/pending/approved/rejected/executing/completed/failed"
        ObjectId approvedBy
        date approvedAt
        ObjectId executedBy "Kế toán"
        date executedAt
        string notes
    }
    
    LIMIT_HISTORY {
        ObjectId cardId
        number previousLimit
        number newLimit
        number changeAmount
        string changeType "increase / decrease"
        ObjectId changedBy
        ObjectId requestId "link về request"
        date changedAt
    }
    
    PAYMENT_CARD {
        string cardName
        string last4
        ObjectId employeeId
        string project
        ObjectId bankAccountId
        array linkedAccounts
        number currentLimit
        string status "Active / Suspended / Cancelled"
        string xcapwalletCardId "ID trên xcapwallet"
    }
    
    TRANSACTION {
        date date
        string merchant
        string platform
        string cardLast4
        number amount
        number amountVND
        string reference
        string reconStatus
        string xcapwalletTxnId "ID trên xcapwallet"
        date syncedAt
    }
```

---

## 7. MULTI-LEVEL APPROVAL

```
                    ┌─────────────────────────────────────────┐
                    │        APPROVAL MATRIX                   │
                    ├─────────────────────────────────────────┤
                    │                                         │
                    │  Request Amount     Approval Required    │
                    │  ─────────────     ─────────────────    │
                    │  ≤ $100            Auto-approve          │
                    │  $101 - $500       KT approve            │
                    │  $501 - $2,000     KT + TP KT approve    │
                    │  > $2,000          KT + TGĐ approve      │
                    │  New Card          TGĐ approve           │
                    │                                         │
                    └─────────────────────────────────────────┘
```

```mermaid
flowchart LR
    REQ["GĐ DA<br/>Submit Request"] --> CHECK{"Amount?"}
    
    CHECK -->|"≤ $100"| AUTO["✅ Auto-approve"]
    CHECK -->|"$101-$500"| KT["KT Approve"]
    CHECK -->|"$501-$2000"| KT_TP["KT + TP KT"]
    CHECK -->|"> $2000"| KT_TGD["KT + TGĐ"]
    CHECK -->|"New Card"| TGD["TGĐ Approve"]
    
    AUTO --> EXEC["KT Execute"]
    KT --> EXEC
    KT_TP --> EXEC
    KT_TGD --> EXEC
    TGD --> EXEC
    
    EXEC --> DONE["✅ Completed"]
```

---

## 8. XCAPWALLET INTEGRATION ARCHITECTURE

```
┌──────────────────────────────────────────────────────────────────┐
│                    XCAP MANAGEMENT PLATFORM                       │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐      │
│  │ Card Management Module (NEW)                            │      │
│  │                                                         │      │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │      │
│  │  │ Card     │ │ Top-up   │ │ Limit    │ │ Txn      │  │      │
│  │  │ Registry │ │ Requests │ │ History  │ │ Sync     │  │      │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │      │
│  │       │             │            │             │        │      │
│  │       └─────────────┼────────────┼─────────────┘        │      │
│  │                     │            │                      │      │
│  └─────────────────────┼────────────┼──────────────────────┘      │
│                        │            │                              │
│  ═══════════════ XCAPWALLET ADAPTER ══════════════════════        │
│                        │            │                              │
│  ┌─────────────────────┼────────────┼──────────────────────┐      │
│  │ XcapwalletService   │            │                      │      │
│  │                     │            │                      │      │
│  │  syncTransactions() ─── fetchCards() ─── updateLimit()  │      │
│  │  getBalance()       ─── getCardDetails()                │      │
│  └─────────────────────┼────────────┼──────────────────────┘      │
│                        │            │                              │
└────────────────────────┼────────────┼──────────────────────────────┘
                         │            │
                         ▼            ▼
              ┌──────────────────────────────┐
              │    https://app.xcapwallet.com │
              │    (VNB Ads Agency Platform)  │
              │                              │
              │    /dashboard                │
              │    /cards                    │
              │    /transactions             │
              │    /api/* (nếu có)           │
              └──────────────────────────────┘
```

---

## 9. DASHBOARD KPIs

```
┌──────────────────────────────────────────────────────────────┐
│               FINANCE > CARD MANAGEMENT                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ Active     │ │ Total      │ │ Pending    │ │ Today    │ │
│  │ Cards      │ │ Limit      │ │ Requests   │ │ Spend    │ │
│  │    25      │ │ $45,200    │ │     3      │ │ $1,250   │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Recent Requests                                      │    │
│  │                                                      │    │
│  │  🟡 NV Đạt — Top-up $500 (DA 1, FB) — Pending       │    │
│  │  ✅ NV Linh — Top-up $200 (DA 2, GG) — Completed    │    │
│  │  🔴 NV Hùng — New Card (DA 3) — Rejected            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Cards by Project                                     │    │
│  │  DA 1: 8 cards │ $15,200 limit │ $4,500 spent       │    │
│  │  DA 2: 5 cards │ $10,000 limit │ $2,800 spent       │    │
│  │  DA 3: 3 cards │ $5,000 limit  │ $1,200 spent       │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## 10. API ENDPOINTS

```
┌─────────────────────────────────────────────────────────────────┐
│              CARD MANAGEMENT APIs (NEW)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📋 CARD REQUESTS                                                │
│  ├── GET    /api/cards/requests              List (scoped)      │
│  ├── POST   /api/cards/requests              Create request     │
│  ├── PUT    /api/cards/requests/:id          Update draft       │
│  ├── PUT    /api/cards/requests/:id/approve  Approve            │
│  ├── PUT    /api/cards/requests/:id/reject   Reject             │
│  ├── POST   /api/cards/requests/:id/execute  Start execution    │
│  └── PUT    /api/cards/requests/:id/complete Mark completed     │
│                                                                 │
│  💳 CARDS (enhanced)                                             │
│  ├── GET    /api/cards                       List all cards     │
│  ├── POST   /api/cards                       Register card      │
│  ├── PUT    /api/cards/:id                   Update card        │
│  ├── PUT    /api/cards/:id/limit             Change limit       │
│  └── GET    /api/cards/:id/history           Limit history      │
│                                                                 │
│  🔄 XCAPWALLET SYNC                                              │
│  ├── POST   /api/xcapwallet/sync             Manual sync        │
│  ├── GET    /api/xcapwallet/status           Sync status        │
│  └── POST   /api/xcapwallet/webhook          Receive webhook    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. FILES TO CREATE/MODIFY

```
server/
├── modules/finance/
│   ├── card-requests/                    [NEW]
│   │   ├── card-request.model.js         Request schema
│   │   ├── card-request.routes.js        CRUD + approve/reject/execute
│   │   └── approval.service.js           Multi-level approval logic
│   │
│   ├── cards/
│   │   ├── card.model.js                 [MODIFY] +currentLimit, +xcapwalletCardId
│   │   ├── card.routes.js                [MODIFY] +limit change, +history
│   │   └── limit-history.model.js        [NEW] Track limit changes
│   │
│   ├── xcapwallet/                       [NEW]
│   │   ├── xcapwallet.service.js         API adapter
│   │   └── xcapwallet.sync.js            Transaction sync job
│   │
│   ├── models.js                         [MODIFY] +CardRequest, +LimitHistory
│   └── index.js                          [MODIFY] Register new routes
│
├── jobs/
│   └── sync-xcapwallet.js                [NEW] Cron job (30 min)
│
└── dashboard/src/modules/finance/
    ├── CardRequestPage.jsx               [NEW] Request form
    ├── CardRequestList.jsx               [NEW] Pending approvals
    └── CardManagement.jsx                [NEW] Cards overview
```
