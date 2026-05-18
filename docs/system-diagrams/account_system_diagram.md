# 🏗️ XCAP — Account & Permission Management System Diagram

> **Dựa trên:** Sơ đồ tổ chức XBK Media (multi-company)
> **Quy tắc:**
> - Mỗi Company có **1 admin riêng** (Tổng giám đốc)
> - NV chuyển dự án → **giữ lại data cũ**
> - Offboard → **soft-delete** (giữ data để audit)

---

## 1. ENTITY RELATIONSHIP DIAGRAM

```mermaid
erDiagram
    COMPANY ||--o{ DEPARTMENT : has
    COMPANY ||--o{ PROJECT : owns
    COMPANY ||--|| EMPLOYEE : "admin (TGĐ)"
    
    DEPARTMENT ||--o{ EMPLOYEE : belongs
    DEPARTMENT ||--|| EMPLOYEE : "head"
    
    PROJECT ||--o{ PROJECT_MEMBER : has
    PROJECT_MEMBER }o--|| EMPLOYEE : is
    
    EMPLOYEE ||--o{ EMPLOYEE : "reportsTo"
    EMPLOYEE ||--o{ MANAGED_ACCOUNT : manages
    EMPLOYEE ||--|| PERMISSION : has
    EMPLOYEE ||--o{ AUDIT_LOG : "target/performer"
    
    COMPANY {
        ObjectId _id
        string name "XBK Media / T.1 / Phoenix / MTG"
        string code "XBK"
        ObjectId admin "Tổng giám đốc"
        string status "active / inactive"
    }
    
    DEPARTMENT {
        ObjectId _id
        string name "Kinh doanh / HR / Kế toán"
        string code "KD / HR / KT"
        ObjectId company
        ObjectId head "Trưởng phòng"
        array modules "marketing / finance / hr"
        string stream "ngoai_san / noi_san / shared"
    }
    
    PROJECT {
        ObjectId _id
        string name "DA 1 / DA 2 / DA 3"
        string code "DA-001"
        ObjectId company
        ObjectId department
        ObjectId director "Giám đốc Dự án"
        string status "active / completed / archived"
    }
    
    PROJECT_MEMBER {
        ObjectId project
        ObjectId employee
        string role "director / leader / member"
        date joinedAt
        date leftAt
        boolean isActive
    }
    
    EMPLOYEE {
        ObjectId _id
        string employeeCode "XBK-001"
        string name
        string email
        string password "hashed"
        ObjectId company
        ObjectId department
        string role "super_admin...viewer"
        string position "Tổng GĐ / GĐ Dự án / Leader / NV"
        array stream "['ngoai_san'] or ['noi_san'] or ['ngoai_san','noi_san']"
        array platforms "facebook / google / tiktok_ads / shopee / lazada / tiktok_shop"
        ObjectId reportsTo
        string status "active / suspended / offboarded"
        date onboardedAt
        date offboardedAt
        string offboardReason
    }
    
    FEATURE_PERMISSION {
        string mode "full / custom"
        boolean assetManagement "view / edit / manage"
        boolean adManagement "view / edit"
        boolean finance "view / edit / approve"
        boolean hr "view / edit"
        boolean reports "view / export"
        boolean orgSettings "view / edit"
        boolean auditLog "view"
    }
    
    ASSET_PERMISSION {
        string mode "all / exclude / list / tag"
        array excludeIds "blacklist TKQC/Shop IDs"
        array includeIds "whitelist TKQC/Shop IDs"
        array tags "chọn theo tag: DA1, biocare..."
        array streams "ngoai_san / noi_san"
    }
    
    CUSTOM_ROLE {
        ObjectId _id
        string name "Senior Marketer / Junior Accountant"
        string baseRole "marketer / accountant / ..."
        ObjectId company
        object featurePermission "override defaults"
        object assetPermission "override defaults"
        ObjectId createdBy
    }
    
    INVITE {
        ObjectId _id
        string email
        string role "10 roles + custom"
        ObjectId customRoleId "if custom"
        array stream "ngoai_san / noi_san"
        object featurePermission
        object assetPermission
        ObjectId project
        string status "pending / accepted / expired / revoked"
        string token "unique invite token"
        date expiresAt "7 ngày"
        ObjectId invitedBy
        date createdAt
    }
    
    AUDIT_LOG {
        ObjectId _id
        string action "onboard / offboard / invite / permission_change / role_change / transfer"
        ObjectId targetEmployee
        ObjectId performedBy
        object before
        object after
        string ip
        date timestamp
    }
```

---

## 2. ROLE HIERARCHY (Phân cấp quyền)

```mermaid
graph TD
    SA["🔴 super_admin<br/>(System Owner — Chủ hệ thống XCAP)"]
    
    CA["🟠 company_admin<br/>(Tổng Giám đốc — mỗi Company 1 người)"]
    
    DH["🟡 dept_head<br/>(Trưởng phòng / Giám đốc Dự án)"]
    
    TL["🟢 team_lead<br/>(Leader 1, Leader 2)"]
    
    MK["🔵 marketer<br/>(NV Marketing)"]
    AC["🔵 accountant<br/>(NV Kế toán)"]
    HR["🔵 hr_staff<br/>(NV HR)"]
    OP["🔵 ops_staff<br/>(NV Operations)"]
    CC["🔵 content_creator<br/>(NV Content)"]
    
    VW["⚪ viewer<br/>(Chỉ xem)"]
    
    SA --> CA
    CA --> DH
    DH --> TL
    TL --> MK
    TL --> CC
    DH --> AC
    DH --> HR
    DH --> OP
    MK --> VW
    AC --> VW
    
    style SA fill:#FF4444,color:#fff
    style CA fill:#FF8800,color:#fff
    style DH fill:#FFD700,color:#000
    style TL fill:#44BB44,color:#fff
    style MK fill:#4488FF,color:#fff
    style AC fill:#4488FF,color:#fff
    style HR fill:#4488FF,color:#fff
    style OP fill:#4488FF,color:#fff
    style CC fill:#4488FF,color:#fff
    style VW fill:#CCCCCC,color:#000
```

### Ai tạo được ai?

| Người tạo | Có thể tạo roles | Phạm vi |
|---|---|---|
| `super_admin` | Tất cả roles + custom | Toàn system |
| `company_admin` | `dept_head`, `team_lead`, tất cả staff, `viewer`, custom | Chỉ trong company mình |
| `dept_head` | `team_lead`, staff roles, `viewer` | Chỉ trong department mình |
| `team_lead` | Không tạo được | — |

### Custom Role Builder

```
┌──────────────────────────────────────────────────────────────┐
│                TẠO CUSTOM ROLE                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Bước 1: Đặt tên role                                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Tên: [ Senior Media Buyer                    ]    │    │
│  │ Kế thừa từ: [ marketer ▼ ]                        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Bước 2: Tùy chỉnh Feature Permission                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │ [x] Quản lý tài sản         (view / edit / manage) │    │
│  │ [x] Quản lý quảng cáo      (view / edit)          │    │
│  │ [ ] Tài chính              (view / edit / approve)│    │
│  │ [ ] Nhân sự                (view / edit)          │    │
│  │ [x] Báo cáo               (view / export)        │    │
│  │ [ ] Cài đặt tổ chức       (view / edit)          │    │
│  │ [ ] Audit log             (view)                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Bước 3: Tùy chỉnh Asset Permission                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │ (o) Toàn bộ tài sản                                │    │
│  │ ( ) Toàn bộ ngoại trừ: [act_xxx, shop_yyy]       │    │
│  │ ( ) Chọn theo danh sách: [act_001, act_002]     │    │
│  │ ( ) Chọn theo tag: [DA1] [biocare]               │    │
│  │                                                    │    │
│  │ Stream: [🌐 Ngoại sàn] [🏪 Nội sàn] [Cả 2]      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [ Lưu Custom Role ]                                         │
└──────────────────────────────────────────────────────────────┘
```

Ví dụ Custom Roles:

| Custom Role | Base | Feature Override | Asset Override |
|---|---|---|---|
| Senior Media Buyer | marketer | +reports(export), +assetMgmt(manage) | Tag: [DA1, DA2] |
| Junior Accountant | accountant | finance(view only) | Stream: noi_san |
| Content Lead | content_creator | +adMgmt(edit), +reports | All TKQC |
| Shop Manager | ops_staff | +assetMgmt, +finance(view) | Tag: [shopee, lazada] |

---

## 3. PERMISSION MATRIX

### 3.1 Feature Permission Defaults (10 roles mặc định)

| Feature | super_admin | company_admin | dept_head | team_lead | marketer | accountant | hr_staff | ops_staff | content | viewer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Quản lý tài sản | ✅ | ✅ | ✅ | ✅ | edit | ❌ | ❌ | edit | ❌ | 👁️ |
| Quản lý QC | ✅ | ✅ | ✅ | ✅ | edit | ❌ | ❌ | ❌ | ❌ | 👁️ |
| Tài chính | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Nhân sự | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Báo cáo | ✅ | ✅ | ✅ | view | view | view | ❌ | view | ❌ | 👁️ |
| Cài đặt tổ chức | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Audit log | ✅ | ✅ | view | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

> **Custom Role** kế thừa defaults từ base role, rồi override bằng Feature Permission tùy chỉnh.

### 3.2 Asset Permission — 4 chế độ gán (từ SMIT)

| Mode | Mô tả | Use case |
|---|---|---|
| `all` | Toàn bộ TKQC + Shop | TGĐ, GĐ Dept |
| `exclude` | Tất cả **ngoại trừ** list cụ thể | GĐ DA quản hầu hết, trừ vài TK nhạy cảm |
| `list` | Chỉ danh sách TKQC/Shop được chọn | NV chỉ quản 3-5 TKQC cụ thể |
| `tag` | Chọn theo tag (DA1, biocare, shopee_vn...) | Gán theo dự án / brand / platform |

> Kết hợp với **Stream filter**: `streams: ["ngoai_san"]` → chỉ thấy tài sản Ngoại sàn.

### 3.3 Data Scope (Phạm vi dữ liệu)

```mermaid
graph LR
    ALL["🔴 ALL<br/>super_admin"]
    COMP["🟠 COMPANY<br/>company_admin"]
    DEPT["🟡 DEPARTMENT<br/>dept_head"]
    TEAM["🟢 TEAM<br/>team_lead"]
    SELF["🔵 SELF<br/>marketer/staff"]
    ASSIGNED["🔵 ASSIGNED<br/>accountant"]
    
    ALL --> COMP --> DEPT --> TEAM --> SELF
    DEPT --> ASSIGNED
    
    style ALL fill:#FF4444,color:#fff
    style COMP fill:#FF8800,color:#fff
    style DEPT fill:#FFD700,color:#000
    style TEAM fill:#44BB44,color:#fff
    style SELF fill:#4488FF,color:#fff
    style ASSIGNED fill:#8844FF,color:#fff
```

### 3.4 Action Permissions

| Action | super_admin | company_admin | dept_head | team_lead | staff |
|---|:---:|:---:|:---:|:---:|:---:|
| Email invite NV | ✅ | ✅ | ✅ (dept) | ❌ | ❌ |
| Bulk import CSV | ✅ | ✅ | ❌ | ❌ | ❌ |
| Offboard NV | ✅ | ✅ (company) | ❌ | ❌ | ❌ |
| Đổi role | ✅ | ✅ (≤ dept_head) | ❌ | ❌ | ❌ |
| Tạo custom role | ✅ | ✅ | ❌ | ❌ | ❌ |
| Gán feature perm | ✅ | ✅ | ✅ (team) | ❌ | ❌ |
| Gán asset perm | ✅ | ✅ | ✅ (team) | ❌ | ❌ |
| Chuyển dự án | ✅ | ✅ | ✅ | ❌ | ❌ |
| Suspend TK | ✅ | ✅ | ❌ | ❌ | ❌ |
| Xem audit log | ✅ | ✅ | ✅ (dept) | ❌ | ❌ |
| Manage assets | ✅ | ✅ | ✅ | ✅ | Per perm |
| View reports | ✅ | ✅ | ✅ | ✅ | Per perm |

---

## 4. ACCOUNT LIFECYCLE STATE MACHINE

```mermaid
stateDiagram-v2
    [*] --> Pending: POST /onboard
    
    Pending --> Active: Email verified / Admin approve
    Active --> Suspended: POST /suspend
    Suspended --> Active: POST /reactivate
    Active --> Offboarded: POST /offboard
    Suspended --> Offboarded: POST /offboard
    
    Offboarded --> [*]: Data giữ lại (soft-delete)
    
    state Active {
        [*] --> Working
        Working --> RoleChanged: PUT /role
        Working --> Transferred: PUT /transfer
        Working --> PermUpdated: POST/DELETE /permissions
        RoleChanged --> Working
        Transferred --> Working
        PermUpdated --> Working
    }
    
    note right of Offboarded
        - status = "offboarded"
        - offboardedAt = now
        - Revoke all sessions
        - Remove from active projects
        - DATA GIỮ NGUYÊN để audit
    end note
    
    note right of Suspended
        - Không login được
        - Data vẫn hiển thị
        - Có thể reactivate
    end note
```

---

## 5. ONBOARDING FLOW (2 chế độ: Email Invite + Bulk CSV)

### 5.1 Email Invite Flow

```mermaid
sequenceDiagram
    actor Admin as Admin (TGĐ/TP)
    participant API as /api/invites
    participant DB as MongoDB
    participant Email as Email Service
    participant Audit as Audit Log
    actor NV as NV mới
    
    Admin->>API: POST { email, role, stream, featurePerm, assetPerm, project }
    
    API->>API: Validate (email?, role hợp lệ?, admin có quyền?)
    API->>DB: Create Invite (status=pending, expiresAt=+7d)
    API->>Email: Gửi link mời (token unique)
    API->>Audit: Log action="invite_sent"
    API-->>Admin: { invite, status: "pending" }
    
    Note over NV: NV nhận email, click link
    NV->>API: GET /api/invites/accept?token=xxx
    API->>API: Validate token (hết hạn? đã dùng?)
    
    alt NV chưa có TK XCAP
        NV->>API: POST /api/auth/register { name, password }
        API->>DB: Create Employee + link invite permissions
    else NV đã có TK
        API->>DB: Link Employee to Company + apply permissions
    end
    
    API->>DB: Invite status = "accepted"
    API->>Audit: Log action="onboard"
    API-->>NV: Welcome + redirect to dashboard
```

### 5.2 Bulk Import CSV Flow

```mermaid
sequenceDiagram
    actor Admin as Admin (TGĐ)
    participant APP as XCAP App
    participant API as /api/accounts/bulk-import
    participant DB as MongoDB
    participant Email as Email Service
    participant Audit as Audit Log
    
    Admin->>APP: Upload CSV file
    Note right of Admin: CSV columns:<br/>name, email, role,<br/>stream, project, dept
    
    APP->>API: POST /api/accounts/bulk-import { csv }
    API->>API: Parse + validate CSV rows
    
    loop Mỗi row trong CSV
        API->>API: Generate employeeCode (XBK-XXX)
        API->>API: Generate temp password
        API->>DB: Create Employee + default permissions for role
        API->>Email: Gửi credentials (email + temp password)
    end
    
    API->>Audit: Log action="bulk_import", count=N
    API-->>Admin: { imported: 50, failed: 2, errors: [...] }
```

---

## 6. PERMISSION CHANGE FLOW

```mermaid
sequenceDiagram
    actor Admin as Admin
    participant API as /api/accounts/:id/permissions
    participant Guard as Permission Guard
    participant DB as MongoDB
    participant Audit as Audit Log
    participant Session as Session Manager
    
    Admin->>API: POST { add_modules: ["finance"], canViewReports: true }
    
    API->>Guard: Check: Admin có quyền manage permissions?
    Guard->>Guard: Check hierarchy (không thể sửa cấp trên)
    Guard-->>API: ✅ Allowed
    
    API->>DB: Get current permissions (before)
    DB-->>API: { modules: ["marketing"], canViewReports: false }
    
    API->>DB: Merge permissions
    Note over API,DB: modules: ["marketing", "finance"]<br/>canViewReports: true
    
    API->>Audit: Log { action: "permission_added", before, after }
    
    API->>Session: Invalidate current JWT
    Note over Session: User phải login lại để<br/>nhận token mới với quyền mới
    
    API-->>Admin: { employee, permissions: updated }
```

---

## 7. TRANSFER FLOW (Chuyển dự án)

```mermaid
sequenceDiagram
    actor Admin as Admin
    participant API as /api/accounts/:id/transfer
    participant DB as MongoDB
    participant Audit as Audit Log
    
    Admin->>API: PUT { newProject: "DA-002", newTeam: "Team B", newReportsTo: "leader2_id" }
    
    API->>DB: Get employee current state
    DB-->>API: { project: "DA-001", team: "Team A", reportsTo: "leader1_id" }
    
    Note over API: DATA CŨ GIỮ NGUYÊN<br/>(campaigns, reports vẫn thuộc NV)
    
    API->>DB: Update Project DA-001: member.leftAt = now, isActive = false
    API->>DB: Update Project DA-002: add member, isActive = true
    API->>DB: Update employee: project, team, reportsTo
    API->>DB: Update old leader: remove from subordinates
    API->>DB: Update new leader: add to subordinates
    
    API->>Audit: Log { action: "transfer", before: {DA-001}, after: {DA-002} }
    
    API-->>Admin: { employee, transfer: { from: "DA-001", to: "DA-002" } }
```

---

## 8. OFFBOARDING FLOW

```mermaid
sequenceDiagram
    actor Admin as TGĐ/Super Admin
    participant API as /api/accounts/:id/offboard
    participant DB as MongoDB
    participant Session as Session Manager
    participant Audit as Audit Log
    
    Admin->>API: POST { reason: "Nghỉ việc" }
    
    API->>API: Check: Chỉ company_admin+ mới offboard được
    
    API->>DB: Set status = "offboarded"
    API->>DB: Set offboardedAt = now
    API->>DB: Set offboardReason = "Nghỉ việc"
    
    API->>DB: ProjectMember: set isActive=false cho tất cả projects
    API->>DB: Remove from reportsTo.subordinates
    
    Note over API,DB: ⚠️ KHÔNG XÓA DATA<br/>Campaigns, reports, metrics<br/>vẫn giữ nguyên + gắn employeeId
    
    API->>Session: Revoke ALL active sessions/tokens
    
    API->>Audit: Log { action: "offboard", reason: "Nghỉ việc" }
    
    API-->>Admin: { message: "Offboarded", employee }
```

---

## 9. MULTI-COMPANY ARCHITECTURE (Ngoại sàn / Nội sàn)

```mermaid
graph TB
    subgraph XCAP_SYSTEM["🌐 XCAP SYSTEM"]
        direction TB
        
        subgraph XBK["🏢 XBK Media"]
            XBK_CEO["🟠 TGĐ XBK<br/>(company_admin)"]
            
            subgraph NS["🌐 Ngoại sàn (FB/GG/TT Ads)"]
                NS_HEAD["🟡 GĐ Ngoại sàn<br/>(dept_head)"]
                
                subgraph DA1["📁 DA Brand A"]
                    DA1_DIR["🟡 GĐ DA"]
                    L1["🟢 Leader"]
                    NV1["🔵 NV1 (FB+GG)"]
                    NV2["🔵 NV2 (FB+TT)"]
                    NV3["🔵 NV3 (FB+GG+TT)"]
                end
                
                subgraph DA2["📁 DA Brand B"]
                    DA2_DIR["🟡 GĐ DA"]
                    NV4["🔵 NV4 (FB)"]
                end
            end
            
            subgraph NOS["🏪 Nội sàn (Shopee/Lazada/TT Shop)"]
                NOS_HEAD["🟡 GĐ Nội sàn<br/>(dept_head)"]
                
                subgraph DA3["📁 DA Brand C"]
                    DA3_DIR["🟡 GĐ DA"]
                    NV5["🔵 NV5 (Shopee+Lazada)"]
                    NV6["🔵 NV6 (TTShop)"]
                end
            end
            
            subgraph SHARED["⚙️ Shared (stream: shared)"]
                HR_HEAD["🟡 TP HR"]
                KT_HEAD["🟡 TP Kế toán"]
            end
        end
        
        subgraph T1["🏢 T.1"]
            T1_CEO["🟠 TGĐ T.1"]
        end
    end
    
    XBK_CEO --> NS_HEAD
    XBK_CEO --> NOS_HEAD
    XBK_CEO --> HR_HEAD
    XBK_CEO --> KT_HEAD
    NS_HEAD --> DA1_DIR
    NS_HEAD --> DA2_DIR
    NOS_HEAD --> DA3_DIR
    DA1_DIR --> L1
    L1 --> NV1
    L1 --> NV2
    L1 --> NV3
    DA2_DIR --> NV4
    DA3_DIR --> NV5
    DA3_DIR --> NV6
```

### Isolation Rules (Cách ly dữ liệu)

| Quy tắc | Mô tả |
|---|---|
| **Company Isolation** | TGĐ XBK **KHÔNG** thấy data T.1/Phoenix/MTG |
| **Stream Isolation** | GĐ Ngoại sàn **KHÔNG** thấy data Nội sàn, ngược lại |
| **Cross-stream GĐ** | GĐ Dự án quản DA cả 2 luồng → thấy data **cả 2**, nhưng chỉ trong DA mình |
| **Project Isolation** | GĐ DA Brand A **KHÔNG** thấy NV DA Brand B |
| **Team Isolation** | Leader 1 **KHÔNG** thấy NV của Leader 2 |
| **Platform Cross** | NV stream ngoai_san chạy nhiều platform (FB+GG+TT) OK |
| **Stream Lock (NV)** | NV ngoai_san **KHÔNG** được gán shop account |
| **Cross-reference** | super_admin + TGĐ thấy **CẢ 2 LUỒNG** |

---

## 10. DATABASE SCHEMA SUMMARY

```
┌─────────────────────────────────────────────────────────────────┐
│                     XCAP DATABASE SCHEMA v2                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  companies ──┐                                                  │
│              ├── departments ──┐                                │
│              │                 ├── employees ──┐                │
│              │                 │               ├── feature_perms │
│              │                 │               ├── asset_perms   │
│              │                 │               └── audit_logs    │
│              │                 │                                 │
│              ├── custom_roles ─┤ [NEW]                          │
│              ├── invites ──────┤ [NEW]                          │
│              │                 │                                 │
│              ├── projects ─────┤                                │
│              │                 ├── project_members              │
│              │                 └── (Marketing data)             │
│              │                                                  │
│              └── (Finance data)                                 │
│                  ├── transactions                               │
│                  ├── invoices / cards / holds                   │
│                                                                 │
│  audit_logs (global — cross all entities)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. API ENDPOINTS OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ACCOUNT MANAGEMENT APIs v2                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📦 COMPANIES                                                       │
│  ├── GET    /api/companies                    List (super_admin)    │
│  ├── POST   /api/companies                    Create                │
│  └── PUT    /api/companies/:id                Update                │
│                                                                     │
│  📁 PROJECTS                                                        │
│  ├── GET    /api/projects                     List (scoped)         │
│  ├── POST   /api/projects                     Create                │
│  └── PUT    /api/projects/:id/members         Add/remove members    │
│                                                                     │
│  📨 INVITES [NEW]                                                    │
│  ├── POST   /api/invites                      Gửi email invite     │
│  ├── GET    /api/invites                      List pending/accepted │
│  ├── GET    /api/invites/accept?token=xxx     NV accept invite      │
│  ├── DELETE /api/invites/:id                  Revoke invite         │
│  └── POST   /api/accounts/bulk-import         Bulk CSV import       │
│                                                                     │
│  👤 ACCOUNT LIFECYCLE                                               │
│  ├── GET    /api/accounts/:id/feature-perms    Xem feature perm     │
│  ├── PUT    /api/accounts/:id/feature-perms    Cập nhật feature     │
│  ├── GET    /api/accounts/:id/asset-perms      Xem asset perm       │
│  ├── PUT    /api/accounts/:id/asset-perms      Cập nhật asset       │
│  ├── PUT    /api/accounts/:id/role             Đổi role              │
│  ├── PUT    /api/accounts/:id/transfer         Chuyển dự án          │
│  ├── POST   /api/accounts/:id/suspend          Tạm khóa              │
│  ├── POST   /api/accounts/:id/reactivate       Kích hoạt lại         │
│  └── POST   /api/accounts/:id/offboard         Offboard              │
│                                                                     │
│  🎭 CUSTOM ROLES [NEW]                                               │
│  ├── GET    /api/custom-roles                  List (company)       │
│  ├── POST   /api/custom-roles                  Create custom role   │
│  ├── PUT    /api/custom-roles/:id              Update                │
│  └── DELETE /api/custom-roles/:id              Delete                │
│                                                                     │
│  📋 AUDIT                                                           │
│  ├── GET    /api/audit                         List logs (scoped)   │
│  └── GET    /api/audit/:employeeId             Logs of 1 employee   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 12. FILES TO CREATE/MODIFY

```
server/
├── core/
│   ├── companies/                          [NEW]
│   │   ├── company.model.js
│   │   └── company.routes.js
│   │
│   ├── projects/                           [NEW]
│   │   ├── project.model.js
│   │   └── project.routes.js
│   │
│   ├── employees/
│   │   ├── employee.model.js               [MODIFY] +company, +projects, +reportsTo
│   │   ├── employee.routes.js              (giữ nguyên)
│   │   └── account-lifecycle.routes.js     [NEW] onboard/offboard/permissions
│   │
│   ├── audit/                              [NEW]
│   │   ├── audit-log.model.js
│   │   └── audit.routes.js
│   │
│   └── auth/
│       └── auth.middleware.js              [MODIFY] +applyDataScope, +company_admin
│
├── shared/
│   ├── permission-presets.js               [NEW]
│   └── validators.js                       [MODIFY] +company_admin role
│
├── seeds/
│   └── seed-org.js                         [NEW] seed org structure
│
└── index.js                                [MODIFY] register new routes
```
