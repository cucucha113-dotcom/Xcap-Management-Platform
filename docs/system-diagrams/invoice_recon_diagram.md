# 💰 XCAP — Invoice Reconciliation System Diagram

> **Dựa trên:** Finance Module v2 hiện tại + 6 platforms
> **5 entities:** BankAccount → PaymentCard → Transaction → Invoice → HoldTracking

---

## 1. ENTITY RELATIONSHIP

```mermaid
erDiagram
    BANK_ACCOUNT ||--o{ PAYMENT_CARD : "linkedCards"
    PAYMENT_CARD ||--o{ TRANSACTION : "cardId"
    PAYMENT_CARD ||--|| EMPLOYEE : "employeeId"
    PAYMENT_CARD ||--o{ AD_ACCOUNT : "linkedAccounts"
    TRANSACTION ||--o| INVOICE : "matched"
    INVOICE ||--o| TRANSACTION : "matched"
    PAYMENT_CARD ||--o{ HOLD : "cardId"
    
    BANK_ACCOUNT {
        string bankName "Vietcombank / TPBank"
        string accountNumber
        string currency "VND"
        number balance
        number totalDeposited
        number totalPaidToAds
        number unknownCharges
    }
    
    PAYMENT_CARD {
        string cardName "Visa *1234"
        string last4 "1234"
        string cardGroup "Group A"
        ObjectId employeeId "NV quản lý"
        ObjectId bankAccountId
        array linkedAccounts "FB / Google / TikTok accounts"
        string status "Active / Suspended / Cancelled"
    }
    
    TRANSACTION {
        date date
        string merchant "FACEBK *99Q2XLD9S2"
        string platform "facebook / google / tiktok"
        string cardLast4
        number amount "USD"
        number amountVND
        string reference
        string status "Settled / Pending / Reversed"
        string reconStatus "matched / partial / unmatched / orphan / pending"
        ObjectId matchedInvoiceId
    }
    
    INVOICE {
        string platform "facebook"
        string ref "99Q2XLD9S2"
        number amount
        string adAccountId
        string cardLast4
        date date
        string txId
        ObjectId matchedTransactionId
    }
    
    HOLD {
        string platform
        number holdAmount
        date holdDate
        date releaseDate
        string adAccountId
        string status "held / releasing / released"
    }
```

---

## 2. MONEY FLOW (Luồng tiền)

```mermaid
graph LR
    subgraph BANK["🏦 Ngân hàng"]
        BA["Bank Account<br/>VCB / TPBank"]
    end
    
    subgraph CARDS["💳 Thẻ thanh toán"]
        C1["Card *1234<br/>NV Đạt"]
        C2["Card *5678<br/>NV Linh"]
        C3["Card *9012<br/>NV Hùng"]
    end
    
    subgraph PLATFORMS["📱 Ad Platforms"]
        FB["Facebook Ads"]
        GG["Google Ads"]
        TT["TikTok Ads"]
    end
    
    subgraph INVOICES["🧾 Hoá đơn"]
        I1["Invoice FB<br/>ref: 99Q2XLD"]
        I2["Invoice GG<br/>ref: 4821-001"]
        I3["Invoice TT<br/>ref: TT20260510"]
    end
    
    BA -->|"Nạp tiền"| C1
    BA -->|"Nạp tiền"| C2
    BA -->|"Nạp tiền"| C3
    
    C1 -->|"Charge $50"| FB
    C2 -->|"Charge $30"| GG
    C3 -->|"Charge $20"| TT
    
    FB -->|"Xuất invoice"| I1
    GG -->|"Xuất invoice"| I2
    TT -->|"Xuất invoice"| I3
    
    style BA fill:#1a73e8,color:#fff
    style FB fill:#1877F2,color:#fff
    style GG fill:#34A853,color:#fff
    style TT fill:#000,color:#fff
```

### Identity Chain (Chuỗi liên kết)

```
Bank Account (VCB)
  └── Card *1234
        ├── Employee: NV Đạt (marketer)
        ├── Project: DA 1
        └── Ad Accounts:
              ├── FB: act_1162586225600942
              ├── Google: 228-148-2529
              └── TikTok: AnhDTN
```

---

## 3. RECONCILIATION ENGINE (3 phases)

```mermaid
flowchart TD
    START["📥 Input: Pending Transactions"] --> P1
    
    subgraph P1["PHASE 1: Reference Match"]
        REF1["Extract ref từ merchant<br/>FACEBK *99Q2XLD9S2 → 99Q2XLD9S2"]
        REF2["So khớp: txn.ref ↔ invoice.ref"]
        REF3{Tìm thấy?}
        REF1 --> REF2 --> REF3
    end
    
    REF3 -->|Có| AMT_CHECK
    REF3 -->|Không| P2
    
    AMT_CHECK{"Amount match?<br/>|diff| < 100 VND"}
    AMT_CHECK -->|Yes| MATCHED["✅ MATCHED"]
    AMT_CHECK -->|No| PARTIAL["⚠️ PARTIAL<br/>(ref đúng, amount lệch)"]
    
    subgraph P2["PHASE 2: Fuzzy Match"]
        FZ1["So khớp bộ 3:<br/>card.last4 + amount ± 5% + date ± 2 ngày"]
        FZ2{Tìm thấy?}
        FZ1 --> FZ2
    end
    
    FZ2 -->|Có| PARTIAL
    FZ2 -->|Không| P3
    
    subgraph P3["PHASE 3: Orphan Detection"]
        OR1["Invoice không có transaction?"]
        OR2["Transaction không có invoice?"]
        OR1 --> ORPHAN_INV["👻 ORPHAN INVOICE"]
        OR2 --> UNMATCHED["❌ UNMATCHED TXN"]
    end
    
    style MATCHED fill:#22c55e,color:#fff
    style PARTIAL fill:#f59e0b,color:#fff
    style UNMATCHED fill:#ef4444,color:#fff
    style ORPHAN_INV fill:#8b5cf6,color:#fff
```

### Match Rules

| Phase | Logic | Kết quả |
|---|---|---|
| **Phase 1** | `txn.ref === invoice.ref` AND `|amount diff| < 100` | ✅ Matched |
| **Phase 1b** | `txn.ref === invoice.ref` AND `amount diff > 100` | ⚠️ Partial |
| **Phase 2** | `card.last4 + amount ±5% + date ±2d` | ⚠️ Partial |
| **Phase 3** | No match found | ❌ Unmatched / 👻 Orphan |

---

## 4. IMPORT → MATCH → REVIEW FLOW

```mermaid
sequenceDiagram
    actor KT as Kế toán
    participant API as Finance API
    participant DB as MongoDB
    participant Engine as Recon Engine
    participant WS as WebSocket
    actor FM as Finance Manager

    Note over KT: === BƯỚC 1: Import Transactions ===
    KT->>API: POST /finance/transactions/import
    Note right of KT: CSV từ Xcap/Bank<br/>{date, merchant, amount, card}
    API->>DB: insertMany(transactions) [status=pending]
    API-->>KT: { imported: 150 }

    Note over KT: === BƯỚC 2: Import Invoices ===
    KT->>API: POST /finance/invoices/import
    Note right of KT: CSV từ FB/Google/TikTok<br/>{ref, amount, adAccount, date}
    API->>DB: insertMany(invoices)
    API-->>KT: { imported: 140 }

    Note over Engine: === BƯỚC 3: Auto-Match ===
    KT->>API: POST /finance/reconcile
    API->>Engine: Run 3-phase matching
    
    Engine->>DB: Find pending transactions
    loop Mỗi transaction
        Engine->>DB: Phase 1: Find invoice by ref
        Engine->>DB: Phase 2: Fuzzy match (last4+amount+date)
        Engine->>DB: Update reconStatus
    end
    Engine->>DB: Phase 3: Find orphan invoices
    
    API-->>KT: { matched: 120, partial: 12, unmatched: 8 }
    API->>WS: Emit recon:updated

    Note over FM: === BƯỚC 4: Manual Review ===
    WS-->>FM: recon:updated notification
    FM->>API: GET /finance/transactions?reconStatus=partial
    API-->>FM: 12 partial matches
    
    FM->>API: PUT /finance/transactions/:id {reconStatus: "matched"}
    Note right of FM: Review & confirm từng partial
    
    FM->>API: GET /finance/transactions?reconStatus=unmatched
    API-->>FM: 8 unmatched
    Note right of FM: Investigate & resolve
```

---

## 5. HOLD TRACKING LIFECYCLE

```mermaid
stateDiagram-v2
    [*] --> Held: Platform giữ tiền
    
    Held --> Releasing: Release bắt đầu
    Releasing --> Released: Tiền trả về card
    Released --> [*]
    
    Held --> Held: Extend hold
    
    note right of Held
        Platform charge nhưng chưa settle
        Thường: FB hold 3-7 ngày
        Google hold 5-14 ngày
    end note
    
    note right of Released
        Tiền trả về → tạo reverse transaction
        Cập nhật bank balance
    end note
```

### Hold Data Flow

```
Platform charge → Card bị hold
    │
    ├── holdAmount = $50
    ├── holdDate = 2026-05-10
    ├── Estimate releaseDate = 2026-05-17
    │
    ├── Kế toán track trên Dashboard
    │   ├── Tab "Held" → 15 holds, $1,200 total
    │   ├── Tab "Releasing" → 3 holds, $180
    │   └── Tab "Released" → 45 holds, $3,500
    │
    └── Khi released:
        ├── status = "released"
        ├── releaseDate = actual date
        └── Bank balance += holdAmount
```

---

## 6. DASHBOARD KPIs

```
┌──────────────────────────────────────────────────────────────┐
│                  FINANCE > RECONCILIATION                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ Total Txns │ │ Total Amt  │ │ Match Rate │ │  Holds   │ │
│  │    150     │ │ ₫45.2M     │ │   85.3%    │ │ 15 active│ │
│  │            │ │            │ │            │ │ ₫3.6M    │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Reconciliation Status                                │    │
│  │                                                      │    │
│  │  ✅ Matched:    120 (80%)  ████████████████░░░░     │    │
│  │  ⚠️ Partial:     12 (8%)   ██░░░░░░░░░░░░░░░░░░    │    │
│  │  ❌ Unmatched:    8 (5%)   █░░░░░░░░░░░░░░░░░░░    │    │
│  │  👻 Orphan:       3 (2%)   ░░░░░░░░░░░░░░░░░░░░    │    │
│  │  ⏳ Pending:      7 (5%)   █░░░░░░░░░░░░░░░░░░░    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ By Platform                                          │    │
│  │  Facebook:  85 txns  │ ₫28.5M │ 88% matched        │    │
│  │  Google:    35 txns  │ ₫10.2M │ 82% matched        │    │
│  │  TikTok:    30 txns  │ ₫6.5M  │ 80% matched        │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. API ENDPOINTS

```
┌─────────────────────────────────────────────────────────────┐
│                FINANCE MODULE APIs                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 DASHBOARD                                               │
│  └── GET  /api/finance/dashboard          KPI summary       │
│                                                             │
│  💳 CARDS                                                    │
│  ├── GET  /api/finance/cards              List cards        │
│  ├── POST /api/finance/cards              Create card       │
│  └── PUT  /api/finance/cards/:id          Update card       │
│                                                             │
│  📄 TRANSACTIONS                                             │
│  ├── GET  /api/finance/transactions       List (filtered)   │
│  ├── POST /api/finance/transactions/import  Bulk import CSV │
│  └── PUT  /api/finance/transactions/:id     Manual update   │
│                                                             │
│  🧾 INVOICES                                                 │
│  ├── GET  /api/finance/invoices           List (filtered)   │
│  └── POST /api/finance/invoices/import    Bulk import CSV   │
│                                                             │
│  🔄 RECONCILIATION                                           │
│  └── POST /api/finance/reconcile          Run auto-match    │
│                                                             │
│  🔒 HOLDS                                                    │
│  ├── GET  /api/finance/holds              List (by status)  │
│  ├── POST /api/finance/holds              Create hold       │
│  └── PUT  /api/finance/holds/:id          Update status     │
│                                                             │
│  🏦 BANK ACCOUNTS                                            │
│  └── GET  /api/finance/banks              List banks        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. FULL PIPELINE

```
  CSV/Bank Export          Platform Invoices         Extension Auto-Collect
  (Xcap, VCB)             (FB, Google, TikTok)      (spend data realtime)
       │                        │                          │
       ▼                        ▼                          ▼
  ┌─────────┐             ┌─────────┐              ┌─────────────┐
  │ Import  │             │ Import  │              │ Daily       │
  │ Txns    │             │ Invoices│              │ Metrics     │
  └────┬────┘             └────┬────┘              └──────┬──────┘
       │                       │                          │
       └───────────┬───────────┘                          │
                   ▼                                      │
            ┌─────────────┐                               │
            │ RECON       │                               │
            │ ENGINE      │◄──────────────────────────────┘
            │ (3 phases)  │     Cross-validate spend
            └──────┬──────┘
                   │
        ┌──────────┼──────────┬──────────┐
        ▼          ▼          ▼          ▼
    ✅ Match   ⚠️ Partial  ❌ Unmatch  👻 Orphan
        │          │          │          │
        └──────────┼──────────┘          │
                   ▼                     │
            ┌─────────────┐              │
            │ MANUAL      │              │
            │ REVIEW      │◄─────────────┘
            │ (by FM)     │
            └──────┬──────┘
                   ▼
            ┌─────────────┐
            │ DASHBOARD   │
            │ KPIs +      │
            │ Reports     │
            └─────────────┘
```
