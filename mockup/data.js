/* ═══════════════════════════════════════
   XCAP Mock Data — Phase 1: Facebook
   Realistic Vietnamese marketing data
   ═══════════════════════════════════════ */

const MOCK = {
  // ─── FACEBOOK CAMPAIGNS ───
  campaigns: [
    { id: 'C001', name: 'DA1_Biocare_Whitening_Broad', objective: 'Conversions', status: 'Active', budget: 150, spent: 142.36, impressions: 89420, reach: 52180, clicks: 3214, ctr: 3.59, cpc: 0.044, conversions: 186, cpa: 0.77, roas: 4.82, adAccount: 'act_1162586225600942', employee: 'Nguyễn Đạt' },
    { id: 'C002', name: 'DA1_Biocare_Serum_Retarget', objective: 'Conversions', status: 'Active', budget: 80, spent: 76.50, impressions: 45200, reach: 18900, clicks: 2890, ctr: 6.39, cpc: 0.026, conversions: 245, cpa: 0.31, roas: 7.14, adAccount: 'act_1162586225600942', employee: 'Nguyễn Đạt' },
    { id: 'C003', name: 'DA1_Biocare_Bundle_LAL', objective: 'Conversions', status: 'Active', budget: 200, spent: 188.20, impressions: 124500, reach: 78400, clicks: 4120, ctr: 3.31, cpc: 0.046, conversions: 312, cpa: 0.60, roas: 5.21, adAccount: 'act_1162586225600942', employee: 'Trần Linh' },
    { id: 'C004', name: 'DA2_Fashion_Summer_Sale', objective: 'Conversions', status: 'Active', budget: 120, spent: 108.90, impressions: 67800, reach: 41200, clicks: 2540, ctr: 3.75, cpc: 0.043, conversions: 156, cpa: 0.70, roas: 3.89, adAccount: 'act_9872345678', employee: 'Phạm Hùng' },
    { id: 'C005', name: 'DA2_Fashion_Retarget_ATC', objective: 'Conversions', status: 'Active', budget: 60, spent: 54.30, impressions: 32100, reach: 12800, clicks: 1890, ctr: 5.89, cpc: 0.029, conversions: 198, cpa: 0.27, roas: 8.42, adAccount: 'act_9872345678', employee: 'Phạm Hùng' },
    { id: 'C006', name: 'DA1_Biocare_Video_Awareness', objective: 'Awareness', status: 'Active', budget: 50, spent: 45.80, impressions: 210000, reach: 165000, clicks: 820, ctr: 0.39, cpc: 0.056, conversions: 0, cpa: 0, roas: 0, adAccount: 'act_1162586225600942', employee: 'Lê Trang' },
    { id: 'C007', name: 'DA3_Electronics_Flash_Sale', objective: 'Conversions', status: 'Paused', budget: 180, spent: 165.40, impressions: 98700, reach: 62300, clicks: 3680, ctr: 3.73, cpc: 0.045, conversions: 89, cpa: 1.86, roas: 2.15, adAccount: 'act_5551234567', employee: 'Võ Minh' },
    { id: 'C008', name: 'DA3_Electronics_LAL_Purchase', objective: 'Conversions', status: 'Error', budget: 100, spent: 12.50, impressions: 4200, reach: 3100, clicks: 180, ctr: 4.29, cpc: 0.069, conversions: 5, cpa: 2.50, roas: 1.20, adAccount: 'act_5551234567', employee: 'Võ Minh' },
  ],

  // ─── EMPLOYEES ───
  employees: [
    { code: 'XBK-001', name: 'Nguyễn Đạt', role: 'team_lead', dept: 'Marketing', project: 'DA 1', status: 'online', totalSpend: 218.86, accounts: 2, lastSeen: '2 phút trước' },
    { code: 'XBK-002', name: 'Trần Linh', role: 'marketer', dept: 'Marketing', project: 'DA 1', status: 'online', totalSpend: 188.20, accounts: 1, lastSeen: '5 phút trước' },
    { code: 'XBK-003', name: 'Phạm Hùng', role: 'marketer', dept: 'Marketing', project: 'DA 2', status: 'online', totalSpend: 163.20, accounts: 1, lastSeen: '1 phút trước' },
    { code: 'XBK-004', name: 'Lê Trang', role: 'marketer', dept: 'Marketing', project: 'DA 1', status: 'idle', totalSpend: 45.80, accounts: 1, lastSeen: '15 phút trước' },
    { code: 'XBK-005', name: 'Võ Minh', role: 'team_lead', dept: 'Marketing', project: 'DA 3', status: 'online', totalSpend: 177.90, accounts: 1, lastSeen: '3 phút trước' },
    { code: 'XBK-006', name: 'Ngô Phương', role: 'accountant', dept: 'Kế toán', project: '-', status: 'online', totalSpend: 0, accounts: 0, lastSeen: '1 phút trước' },
    { code: 'XBK-007', name: 'Đỗ Hải', role: 'dept_head', dept: 'Marketing', project: 'ALL', status: 'online', totalSpend: 0, accounts: 0, lastSeen: '10 phút trước' },
    { code: 'XBK-008', name: 'Bùi Tâm', role: 'marketer', dept: 'Marketing', project: 'DA 2', status: 'offline', totalSpend: 0, accounts: 0, lastSeen: '2 giờ trước' },
  ],

  // ─── TRANSACTIONS ───
  transactions: [
    { date: '2026-05-10', merchant: 'FACEBK *99Q2XLD9S2', platform: 'facebook', card: '*1234', amount: -142.36, amountVND: 3612890, status: 'Settled', reconStatus: 'matched', ref: '99Q2XLD9S2' },
    { date: '2026-05-10', merchant: 'FACEBK *HXJKP83N21', platform: 'facebook', card: '*1234', amount: -76.50, amountVND: 1943100, status: 'Settled', reconStatus: 'matched', ref: 'HXJKP83N21' },
    { date: '2026-05-09', merchant: 'FACEBK *W92MLQD7F5', platform: 'facebook', card: '*5678', amount: -188.20, amountVND: 4781480, status: 'Settled', reconStatus: 'matched', ref: 'W92MLQD7F5' },
    { date: '2026-05-09', merchant: 'FACEBK *TZ8N4KR2P1', platform: 'facebook', card: '*5678', amount: -108.90, amountVND: 2767260, status: 'Settled', reconStatus: 'partial', ref: 'TZ8N4KR2P1' },
    { date: '2026-05-08', merchant: 'FACEBK *GH4LP9QX82', platform: 'facebook', card: '*9012', amount: -54.30, amountVND: 1379820, status: 'Settled', reconStatus: 'matched', ref: 'GH4LP9QX82' },
    { date: '2026-05-08', merchant: 'FACEBK *QW5MNRT6Y3', platform: 'facebook', card: '*1234', amount: -45.80, amountVND: 1163320, status: 'Pending', reconStatus: 'pending', ref: 'QW5MNRT6Y3' },
    { date: '2026-05-07', merchant: 'FACEBK *KL2HF8VB94', platform: 'facebook', card: '*9012', amount: -165.40, amountVND: 4203160, status: 'Settled', reconStatus: 'unmatched', ref: 'KL2HF8VB94' },
    { date: '2026-05-07', merchant: 'FACEBK *PX7JD3WM15', platform: 'facebook', card: '*5678', amount: -12.50, amountVND: 317500, status: 'Settled', reconStatus: 'matched', ref: 'PX7JD3WM15' },
  ],

  // ─── CARDS ───
  cards: [
    { name: 'Visa Business *1234', last4: '1234', employee: 'Nguyễn Đạt', project: 'DA 1', limit: 500, spent: 264.66, status: 'Active', adAccounts: ['act_1162586225600942'] },
    { name: 'Visa Business *5678', last4: '5678', employee: 'Trần Linh', project: 'DA 1', limit: 400, spent: 309.60, status: 'Active', adAccounts: ['act_1162586225600942'] },
    { name: 'Mastercard *9012', last4: '9012', employee: 'Phạm Hùng', project: 'DA 2', limit: 300, spent: 219.70, status: 'Active', adAccounts: ['act_9872345678'] },
    { name: 'Visa Business *3456', last4: '3456', employee: 'Võ Minh', project: 'DA 3', limit: 350, spent: 177.90, status: 'Active', adAccounts: ['act_5551234567'] },
    { name: 'Visa Business *7890', last4: '7890', employee: 'Lê Trang', project: 'DA 1', limit: 200, spent: 45.80, status: 'Suspended', adAccounts: [] },
  ],

  // ─── TOP-UP REQUESTS ───
  requests: [
    { id: 'REQ-001', type: 'topup', employee: 'Nguyễn Đạt', project: 'DA 1', card: '*1234', amount: 500, reason: 'Nạp ads FB Biocare tháng 5', status: 'pending', createdAt: '2026-05-12 09:30' },
    { id: 'REQ-002', type: 'topup', employee: 'Phạm Hùng', project: 'DA 2', card: '*9012', amount: 300, reason: 'Nạp ads FB Fashion Summer', status: 'pending', createdAt: '2026-05-12 10:15' },
    { id: 'REQ-003', type: 'topup', employee: 'Trần Linh', project: 'DA 1', card: '*5678', amount: 200, reason: 'Nạp thêm cho Bundle LAL', status: 'approved', createdAt: '2026-05-11 14:00' },
    { id: 'REQ-004', type: 'new_card', employee: 'Bùi Tâm', project: 'DA 2', card: '-', amount: 200, reason: 'Cấp thẻ mới cho NV mới', status: 'rejected', createdAt: '2026-05-10 11:00' },
    { id: 'REQ-005', type: 'topup', employee: 'Võ Minh', project: 'DA 3', card: '*3456', amount: 400, reason: 'Flash Sale Electronics', status: 'completed', createdAt: '2026-05-09 08:45' },
  ],

  // ─── DAILY SPEND (for chart) ───
  dailySpend: [
    { date: '13/04', amount: 380 }, { date: '14/04', amount: 420 }, { date: '15/04', amount: 395 },
    { date: '16/04', amount: 510 }, { date: '17/04', amount: 480 }, { date: '18/04', amount: 445 },
    { date: '19/04', amount: 390 }, { date: '20/04', amount: 520 }, { date: '21/04', amount: 560 },
    { date: '22/04', amount: 530 }, { date: '23/04', amount: 610 }, { date: '24/04', amount: 580 },
    { date: '25/04', amount: 495 }, { date: '26/04', amount: 540 }, { date: '27/04', amount: 620 },
    { date: '28/04', amount: 590 }, { date: '29/04', amount: 680 }, { date: '30/04', amount: 710 },
    { date: '01/05', amount: 650 }, { date: '02/05', amount: 720 }, { date: '03/05', amount: 690 },
    { date: '04/05', amount: 750 }, { date: '05/05', amount: 680 }, { date: '06/05', amount: 790 },
    { date: '07/05', amount: 730 }, { date: '08/05', amount: 810 }, { date: '09/05', amount: 770 },
    { date: '10/05', amount: 820 }, { date: '11/05', amount: 793.96 }, { date: '12/05', amount: 485 },
  ],

  // ─── BROWSER PROFILES (ixBrowser) ───
  browserProfiles: [
    { id: 'PRF-001', name: 'Đạt_FB_Main', employee: 'Nguyễn Đạt', employeeCode: 'XBK-001', os: 'Windows 11', browser: 'Chrome 124', proxy: '103.152.xx.41:8080 (VN)', fingerprint: 'FP-8a2f4d', status: 'running', platform: 'Facebook Ads', adAccount: 'act_1162586225600942', lastActive: '2 phút trước', sessionTime: '3h 24m', pagesVisited: 42, extensionStatus: 'Active', createdAt: '2026-01-15' },
    { id: 'PRF-002', name: 'Đạt_FB_Backup', employee: 'Nguyễn Đạt', employeeCode: 'XBK-001', os: 'Windows 11', browser: 'Chrome 124', proxy: '103.152.xx.42:8080 (VN)', fingerprint: 'FP-3c7b91', status: 'stopped', platform: 'Facebook Ads', adAccount: 'act_1162586225600942', lastActive: '1 ngày trước', sessionTime: '0m', pagesVisited: 0, extensionStatus: 'Idle', createdAt: '2026-02-10' },
    { id: 'PRF-003', name: 'Linh_FB_DA1', employee: 'Trần Linh', employeeCode: 'XBK-002', os: 'Windows 10', browser: 'Chrome 123', proxy: '103.152.xx.43:8080 (VN)', fingerprint: 'FP-6e1d82', status: 'running', platform: 'Facebook Ads', adAccount: 'act_1162586225600942', lastActive: '5 phút trước', sessionTime: '2h 10m', pagesVisited: 28, extensionStatus: 'Active', createdAt: '2026-01-20' },
    { id: 'PRF-004', name: 'Hùng_FB_DA2', employee: 'Phạm Hùng', employeeCode: 'XBK-003', os: 'Windows 11', browser: 'Chrome 124', proxy: '185.230.xx.15:3128 (US)', fingerprint: 'FP-9f4a23', status: 'running', platform: 'Facebook Ads', adAccount: 'act_9872345678', lastActive: '1 phút trước', sessionTime: '4h 02m', pagesVisited: 56, extensionStatus: 'Active', createdAt: '2026-02-01' },
    { id: 'PRF-005', name: 'Trang_FB_Video', employee: 'Lê Trang', employeeCode: 'XBK-004', os: 'macOS 14', browser: 'Chrome 124', proxy: '103.152.xx.44:8080 (VN)', fingerprint: 'FP-2b8e67', status: 'idle', platform: 'Facebook Ads', adAccount: 'act_1162586225600942', lastActive: '15 phút trước', sessionTime: '1h 30m', pagesVisited: 12, extensionStatus: 'Active', createdAt: '2026-03-05' },
    { id: 'PRF-006', name: 'Minh_FB_DA3', employee: 'Võ Minh', employeeCode: 'XBK-005', os: 'Windows 11', browser: 'Chrome 124', proxy: '185.230.xx.16:3128 (US)', fingerprint: 'FP-5d3c41', status: 'running', platform: 'Facebook Ads', adAccount: 'act_5551234567', lastActive: '3 phút trước', sessionTime: '2h 45m', pagesVisited: 35, extensionStatus: 'Active', createdAt: '2026-01-25' },
    { id: 'PRF-007', name: 'Minh_FB_Backup', employee: 'Võ Minh', employeeCode: 'XBK-005', os: 'Windows 10', browser: 'Chrome 123', proxy: '185.230.xx.17:3128 (US)', fingerprint: 'FP-7a9f15', status: 'stopped', platform: 'Facebook Ads', adAccount: 'act_5551234567', lastActive: '3 ngày trước', sessionTime: '0m', pagesVisited: 0, extensionStatus: 'Disabled', createdAt: '2026-02-15' },
    { id: 'PRF-008', name: 'Tâm_FB_DA2', employee: 'Bùi Tâm', employeeCode: 'XBK-008', os: 'Windows 11', browser: 'Chrome 124', proxy: '103.152.xx.45:8080 (VN)', fingerprint: 'FP-1c4b89', status: 'stopped', platform: 'Facebook Ads', adAccount: '-', lastActive: '2 giờ trước', sessionTime: '0m', pagesVisited: 0, extensionStatus: 'Disabled', createdAt: '2026-04-01' },
  ],

  // ─── BROWSING SESSIONS (per profile) ───
  browsingSessions: [
    { profile: 'PRF-001', employee: 'Nguyễn Đạt', startTime: '08:15', duration: '3h 24m', pages: [
      { url: 'facebook.com/adsmanager/campaigns', title: 'Ads Manager - Campaigns', time: '08:15', duration: '45m' },
      { url: 'facebook.com/adsmanager/ads', title: 'Ads Manager - Ads', time: '09:00', duration: '30m' },
      { url: 'business.facebook.com/billing', title: 'Billing Hub', time: '09:30', duration: '15m' },
      { url: 'facebook.com/adsmanager/reporting', title: 'Ads Manager - Reports', time: '09:45', duration: '1h 20m' },
      { url: 'facebook.com/adsmanager/creatives', title: 'Creative Hub', time: '11:05', duration: '34m' },
    ]},
    { profile: 'PRF-004', employee: 'Phạm Hùng', startTime: '07:45', duration: '4h 02m', pages: [
      { url: 'facebook.com/adsmanager/campaigns', title: 'Ads Manager - Campaigns', time: '07:45', duration: '1h 10m' },
      { url: 'facebook.com/adsmanager/audiences', title: 'Audiences', time: '08:55', duration: '40m' },
      { url: 'facebook.com/adsmanager/ads', title: 'Ads Manager - Ads', time: '09:35', duration: '55m' },
      { url: 'business.facebook.com/billing', title: 'Billing Hub', time: '10:30', duration: '20m' },
      { url: 'facebook.com/adsmanager/reporting', title: 'Reports', time: '10:50', duration: '57m' },
    ]},
  ],

  // ─── AUDIT LOG ───
  auditLog: [
    { time: '10:35', action: 'Profile Đạt_FB_Main — Extension sync 3 campaigns', type: 'data' },
    { time: '10:32', action: 'Đạt submit data FB — 3 campaigns, $142 spend', type: 'data' },
    { time: '10:15', action: 'Hùng request nạp $300 — card *9012 — DA 2', type: 'request' },
    { time: '09:45', action: 'Auto-recon: 5 matched, 1 partial, 1 unmatched', type: 'recon' },
    { time: '09:30', action: 'Đạt request nạp $500 — card *1234 — DA 1', type: 'request' },
    { time: '09:00', action: 'System sync xcapwallet — 8 transactions imported', type: 'sync' },
    { time: '08:30', action: 'Linh approved request REQ-003 ($200)', type: 'approve' },
    { time: '08:15', action: 'Profile Đạt_FB_Main started — ixBrowser session', type: 'browser' },
    { time: '07:45', action: 'Profile Hùng_FB_DA2 started — ixBrowser session', type: 'browser' },
  ],
};
