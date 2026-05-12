/* XCAP Management Platform — App Controller */

let currentPage = 'overview';

function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.page === page));
  const titles = { 'overview':'Tổng quan','employees':'Nhân viên','accounts':'Quản lý TK','browsers':'Browser Profiles','fb-campaigns':'Facebook Campaigns','fb-adsets':'Ad Sets','fb-spend':'Chi tiêu Facebook','fb-creatives':'Creatives','recon':'Đối soát hóa đơn','cards':'Quản lý thẻ','topup':'Request nạp tiền','audit':'Audit Log','settings':'Cài đặt' };
  if (page.startsWith('emp-detail:')) document.getElementById('pageTitle').textContent = 'Chi tiết nhân viên';
  else document.getElementById('pageTitle').textContent = titles[page] || page;
  const renderers = { 'overview':renderOverview,'employees':renderEmployees,'browsers':renderBrowsers,'fb-campaigns':renderCampaigns,'fb-spend':renderSpend,'recon':renderRecon,'cards':renderCards,'topup':renderTopup,'audit':renderAudit };
  if (page.startsWith('emp-detail:')) { document.getElementById('contentArea').innerHTML = renderEmpDetail(page.split(':')[1]); return; }
  const fn = renderers[page];
  document.getElementById('contentArea').innerHTML = fn ? fn() : `<div class="stat-card"><p style="color:var(--text-muted);padding:40px;text-align:center">📦 Module "${titles[page]||page}" — Coming in Phase 2</p></div>`;
}

function fmt(n) { return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fmtN(n) { return n.toLocaleString('vi-VN'); }
function statusBadge(s) { const m={'Active':'active','Paused':'paused','Error':'error','online':'active','idle':'paused','offline':'error','Settled':'active','Pending':'pending','Reversed':'error'}; return `<span class="badge ${m[s]||'info'}">${s}</span>`; }
function reconBadge(s) { return `<span class="badge ${s}">${s==='matched'?'✅ Matched':s==='partial'?'⚠️ Partial':s==='unmatched'?'❌ Unmatched':s==='orphan'?'👻 Orphan':'⏳ Pending'}</span>`; }

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }
function updateDateRange() {}

// ═══ OVERVIEW PAGE ═══
function renderOverview() {
  const c = MOCK.campaigns;
  const totalSpend = c.reduce((s,x)=>s+x.spent,0);
  const totalConv = c.reduce((s,x)=>s+x.conversions,0);
  const totalImpr = c.reduce((s,x)=>s+x.impressions,0);
  const avgCPA = totalSpend / totalConv;
  const activeC = c.filter(x=>x.status==='Active').length;

  const maxSpend = Math.max(...MOCK.dailySpend.map(d=>d.amount));
  const bars = MOCK.dailySpend.map(d => {
    const h = (d.amount/maxSpend)*180;
    return `<div class="chart-bar" style="height:${h}px;background:linear-gradient(to top,var(--fb-blue),var(--accent))" data-tooltip="$${fmt(d.amount)} — ${d.date}"></div>`;
  }).join('');

  const empColors = ['#f59e0b','#ef4444','#22c55e','#8b5cf6','#06b6d4','#ec4899','#3b82f6','#10b981'];
  const topEmps = MOCK.employees.filter(e=>e.totalSpend>0).sort((a,b)=>b.totalSpend-a.totalSpend).slice(0,5);
  const empRows = topEmps.map((e,i) => `<div class="emp-row"><div class="emp-avatar" style="background:${empColors[i%8]}">${e.name.split(' ').pop()[0]}</div><div class="emp-info"><div class="emp-name">${e.name}</div><div class="emp-detail">${e.project} · ${e.role}</div></div><div class="emp-spend"><div class="emp-amount">$${fmt(e.totalSpend)}</div><div class="emp-label">spent</div></div></div>`).join('');

  const actColors = {data:'var(--success)',request:'var(--warning)',recon:'var(--accent)',sync:'var(--cyan)',approve:'var(--purple)'};
  const actItems = MOCK.auditLog.map(a => `<div class="activity-item"><div class="activity-dot" style="background:${actColors[a.type]||'var(--text-muted)'}"></div><div><div class="activity-text">${a.action}</div><div class="activity-time">${a.time} hôm nay</div></div></div>`).join('');

  // Recon donut
  const txns = MOCK.transactions;
  const matched = txns.filter(t=>t.reconStatus==='matched').length;
  const partial = txns.filter(t=>t.reconStatus==='partial').length;
  const unmatched = txns.filter(t=>t.reconStatus==='unmatched').length;
  const pending = txns.filter(t=>t.reconStatus==='pending').length;
  const total = txns.length;

  return `
    <div class="stat-grid">
      <div class="stat-card fb"><div class="stat-header"><span class="stat-label">Tổng chi tiêu FB</span><span class="stat-icon">💰</span></div><div class="stat-value">$${fmt(totalSpend)}</div><div class="stat-sub"><span class="stat-change up">↑ 12.5%</span> so với tháng trước</div></div>
      <div class="stat-card green"><div class="stat-header"><span class="stat-label">Conversions</span><span class="stat-icon">🎯</span></div><div class="stat-value">${fmtN(totalConv)}</div><div class="stat-sub"><span class="stat-change up">↑ 18.2%</span> CPA avg: $${fmt(totalSpend/totalConv)}</div></div>
      <div class="stat-card purple"><div class="stat-header"><span class="stat-label">CPA</span><span class="stat-icon">💲</span></div><div class="stat-value">$${fmt(avgCPA)}</div><div class="stat-sub"><span class="stat-change down">↓ 8.5%</span> tốt hơn tháng trước</div></div>
      <div class="stat-card blue"><div class="stat-header"><span class="stat-label">Impressions</span><span class="stat-icon">👁️</span></div><div class="stat-value">${(totalImpr/1000).toFixed(0)}K</div><div class="stat-sub">${activeC}/${c.length} campaigns đang active</div></div>
      <div class="stat-card orange"><div class="stat-header"><span class="stat-label">Pending Requests</span><span class="stat-icon">📋</span></div><div class="stat-value">2</div><div class="stat-sub">$800 chờ duyệt</div></div>
    </div>

    <div class="chart-grid">
      <div class="chart-card"><div class="chart-title">📊 Chi tiêu Facebook — 30 ngày qua</div><div class="chart-area">${bars}</div></div>
      <div class="chart-card"><div class="chart-title">🧾 Đối soát</div>
        <div class="donut-container">
          <svg class="donut-svg" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--bg-primary)" stroke-width="4"/>
            <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--success)" stroke-width="4" stroke-dasharray="${matched/total*100} ${100-matched/total*100}" stroke-dashoffset="25"/>
            <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--warning)" stroke-width="4" stroke-dasharray="${partial/total*100} ${100-partial/total*100}" stroke-dashoffset="${25-matched/total*100}"/>
            <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--danger)" stroke-width="4" stroke-dasharray="${unmatched/total*100} ${100-unmatched/total*100}" stroke-dashoffset="${25-matched/total*100-partial/total*100}"/>
            <text x="21" y="22" text-anchor="middle" fill="var(--text-primary)" font-size="6" font-weight="800">${Math.round(matched/total*100)}%</text>
            <text x="21" y="26" text-anchor="middle" fill="var(--text-muted)" font-size="2.5">matched</text>
          </svg>
          <div class="donut-legend">
            <div class="legend-item"><div class="legend-dot" style="background:var(--success)"></div>Matched<span class="legend-value">${matched}</span></div>
            <div class="legend-item"><div class="legend-dot" style="background:var(--warning)"></div>Partial<span class="legend-value">${partial}</span></div>
            <div class="legend-item"><div class="legend-dot" style="background:var(--danger)"></div>Unmatched<span class="legend-value">${unmatched}</span></div>
            <div class="legend-item"><div class="legend-dot" style="background:var(--accent)"></div>Pending<span class="legend-value">${pending}</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-grid">
      <div class="section-card"><div class="section-title">🏆 Top Marketers (by Spend)</div><div class="emp-list">${empRows}</div></div>
      <div class="section-card"><div class="section-title">⚡ Hoạt động gần đây</div><div class="activity-list">${actItems}</div></div>
    </div>`;
}

// ═══ CAMPAIGNS PAGE ═══
function renderCampaigns() {
  const rows = MOCK.campaigns.map(c => `<tr>
    <td><div style="font-weight:600">${c.name}</div><div style="font-size:11px;color:var(--text-muted)">${c.adAccount}</div></td>
    <td>${statusBadge(c.status)}</td>
    <td style="font-weight:600">$${fmt(c.spent)}<div style="font-size:11px;color:var(--text-muted)">/ $${c.budget}</div></td>
    <td>${fmtN(c.impressions)}</td>
    <td>${fmtN(c.clicks)}</td>
    <td>${c.ctr.toFixed(2)}%</td>
    <td>${fmtN(c.conversions)}</td>
    <td>$${fmt(c.cpa)}</td>
    <td style="font-weight:700;color:${c.roas>=4?'var(--success)':c.roas>=2?'var(--warning)':'var(--danger)'}">${c.roas>0?c.roas.toFixed(2)+'x':'-'}</td>
    <td>${c.employee}</td>
  </tr>`).join('');

  return `
    <div class="filter-bar">
      <input class="filter-input" placeholder="🔍 Tìm campaign..." oninput="filterTable(this,'campaigns-table')">
      <select class="filter-select"><option value="">Tất cả Status</option><option>Active</option><option>Paused</option><option>Error</option></select>
      <select class="filter-select"><option value="">Tất cả Dự án</option><option>DA 1</option><option>DA 2</option><option>DA 3</option></select>
      <button class="table-btn primary" style="margin-left:auto">⟳ Sync Now</button>
    </div>
    <div class="table-container">
      <table id="campaigns-table"><thead><tr><th>Campaign</th><th>Status</th><th>Spent / Budget</th><th>Impr.</th><th>Clicks</th><th>CTR</th><th>Conv.</th><th>CPA</th><th>ROAS</th><th>Marketer</th></tr></thead><tbody>${rows}</tbody></table>
    </div>`;
}

// ═══ SPEND PAGE ═══
function renderSpend() {
  const maxS = Math.max(...MOCK.dailySpend.map(d=>d.amount));
  const bars = MOCK.dailySpend.map(d => `<div class="chart-bar" style="height:${(d.amount/maxS)*220}px;background:linear-gradient(to top,var(--fb-blue),var(--accent))" data-tooltip="$${fmt(d.amount)} — ${d.date}"></div>`).join('');
  const totalS = MOCK.dailySpend.reduce((s,d)=>s+d.amount,0);
  const avgD = totalS / MOCK.dailySpend.length;

  const byProject = {};
  MOCK.campaigns.forEach(c => { const p = c.name.startsWith('DA1')?'DA 1':c.name.startsWith('DA2')?'DA 2':'DA 3'; byProject[p] = (byProject[p]||0)+c.spent; });
  const projBars = Object.entries(byProject).map(([p,v]) => `<div class="progress-row"><span class="progress-label">${p}</span><div class="progress-bar"><div class="progress-fill" style="width:${(v/totalS)*100}%;background:${p==='DA 1'?'var(--accent)':p==='DA 2'?'var(--warning)':'var(--purple)'}"></div></div><span class="progress-value">$${fmt(v)}</span></div>`).join('');

  return `
    <div class="stat-grid">
      <div class="stat-card fb"><div class="stat-header"><span class="stat-label">Tổng 30 ngày</span></div><div class="stat-value">$${fmt(totalS)}</div><div class="stat-sub">Facebook Ads only</div></div>
      <div class="stat-card blue"><div class="stat-header"><span class="stat-label">TB / ngày</span></div><div class="stat-value">$${fmt(avgD)}</div></div>
      <div class="stat-card green"><div class="stat-header"><span class="stat-label">Hôm nay</span></div><div class="stat-value">$${fmt(MOCK.dailySpend.at(-1).amount)}</div></div>
      <div class="stat-card orange"><div class="stat-header"><span class="stat-label">Cao nhất</span></div><div class="stat-value">$${fmt(maxS)}</div></div>
    </div>
    <div class="chart-card" style="margin-bottom:24px"><div class="chart-title">💰 Daily Spend — Facebook</div><div class="chart-area" style="height:240px">${bars}</div></div>
    <div class="chart-card"><div class="chart-title">📁 Spend by Project</div><div style="padding:8px 0">${projBars}</div></div>`;
}

// ═══ EMPLOYEES PAGE ═══
function renderEmployees() {
  const colors = ['#f59e0b','#ef4444','#22c55e','#8b5cf6','#06b6d4','#ec4899','#3b82f6','#10b981'];
  const rows = MOCK.employees.map((e,i) => `<tr onclick="navigateTo('emp-detail:${e.code}')" style="cursor:pointer">
    <td><div style="display:flex;align-items:center;gap:10px"><div class="emp-avatar" style="background:${colors[i%8]}">${e.name.split(' ').pop()[0]}</div><div><div style="font-weight:600">${e.name}</div><div style="font-size:11px;color:var(--text-muted)">${e.code}</div></div></div></td>
    <td><span class="badge ${e.role==='dept_head'?'info':e.role==='team_lead'?'active':'pending'}">${e.role}</span></td>
    <td>${e.dept}</td><td>${e.project}</td>
    <td>${statusBadge(e.status==='online'?'Active':e.status==='idle'?'Paused':'Error')}</td>
    <td style="font-weight:600">${e.totalSpend>0?'$'+fmt(e.totalSpend):'-'}</td>
    <td>${e.accounts}</td><td style="color:var(--text-muted)">${e.lastSeen}</td>
  </tr>`).join('');

  return `
    <div class="stat-grid">
      <div class="stat-card blue"><div class="stat-header"><span class="stat-label">Tổng NV</span></div><div class="stat-value">${MOCK.employees.length}</div></div>
      <div class="stat-card green"><div class="stat-header"><span class="stat-label">Online</span></div><div class="stat-value">${MOCK.employees.filter(e=>e.status==='online').length}</div></div>
      <div class="stat-card orange"><div class="stat-header"><span class="stat-label">Marketers</span></div><div class="stat-value">${MOCK.employees.filter(e=>e.role==='marketer').length}</div></div>
    </div>
    <div class="table-container">
      <div class="table-header"><span class="table-title">👥 Danh sách nhân viên</span><button class="table-btn primary">+ Thêm NV</button></div>
      <table><thead><tr><th>Nhân viên</th><th>Role</th><th>Phòng</th><th>Dự án</th><th>Status</th><th>FB Spend</th><th>Accounts</th><th>Last Seen</th></tr></thead><tbody>${rows}</tbody></table>
    </div>`;
}

// ═══ RECON PAGE ═══
function renderRecon() {
  const t = MOCK.transactions;
  const matched = t.filter(x=>x.reconStatus==='matched').length;
  const rows = t.map(tx => `<tr>
    <td>${tx.date}</td><td style="font-family:monospace;font-size:12px">${tx.merchant}</td><td>${tx.card}</td>
    <td style="font-weight:600;color:var(--danger)">$${fmt(Math.abs(tx.amount))}</td>
    <td>₫${fmtN(Math.abs(tx.amountVND))}</td>
    <td>${statusBadge(tx.status)}</td><td>${reconBadge(tx.reconStatus)}</td>
  </tr>`).join('');

  return `
    <div class="stat-grid">
      <div class="stat-card green"><div class="stat-header"><span class="stat-label">Matched</span></div><div class="stat-value">${matched}/${t.length}</div><div class="stat-sub">${Math.round(matched/t.length*100)}% match rate</div></div>
      <div class="stat-card orange"><div class="stat-header"><span class="stat-label">Partial</span></div><div class="stat-value">${t.filter(x=>x.reconStatus==='partial').length}</div></div>
      <div class="stat-card red"><div class="stat-header"><span class="stat-label">Unmatched</span></div><div class="stat-value">${t.filter(x=>x.reconStatus==='unmatched').length}</div></div>
      <div class="stat-card blue"><div class="stat-header"><span class="stat-label">Pending</span></div><div class="stat-value">${t.filter(x=>x.reconStatus==='pending').length}</div></div>
    </div>
    <div class="table-container">
      <div class="table-header"><span class="table-title">🧾 Giao dịch Facebook</span><div class="table-actions"><button class="table-btn">Import CSV</button><button class="table-btn primary">⟳ Auto Match</button></div></div>
      <table><thead><tr><th>Date</th><th>Merchant</th><th>Card</th><th>Amount</th><th>VND</th><th>Status</th><th>Recon</th></tr></thead><tbody>${rows}</tbody></table>
    </div>`;
}

// ═══ CARDS PAGE ═══
function renderCards() {
  const rows = MOCK.cards.map(c => {
    const pct = Math.round(c.spent/c.limit*100);
    const color = pct>80?'var(--danger)':pct>50?'var(--warning)':'var(--success)';
    return `<tr>
      <td style="font-weight:600">${c.name}</td><td>${c.employee}</td><td>${c.project}</td>
      <td>$${fmt(c.limit)}</td><td style="font-weight:600">$${fmt(c.spent)}</td>
      <td><div class="progress-bar" style="width:120px"><div class="progress-fill" style="width:${pct}%;background:${color}"></div></div><span style="font-size:11px;color:var(--text-muted);margin-left:8px">${pct}%</span></td>
      <td>${statusBadge(c.status)}</td>
    </tr>`;
  }).join('');

  return `
    <div class="stat-grid">
      <div class="stat-card blue"><div class="stat-header"><span class="stat-label">Active Cards</span></div><div class="stat-value">${MOCK.cards.filter(c=>c.status==='Active').length}</div></div>
      <div class="stat-card green"><div class="stat-header"><span class="stat-label">Total Limit</span></div><div class="stat-value">$${fmtN(MOCK.cards.reduce((s,c)=>s+c.limit,0))}</div></div>
      <div class="stat-card orange"><div class="stat-header"><span class="stat-label">Total Spent</span></div><div class="stat-value">$${fmt(MOCK.cards.reduce((s,c)=>s+c.spent,0))}</div></div>
    </div>
    <div class="table-container">
      <div class="table-header"><span class="table-title">💳 Payment Cards</span><button class="table-btn primary">+ Thêm thẻ</button></div>
      <table><thead><tr><th>Card</th><th>NV</th><th>Dự án</th><th>Limit</th><th>Spent</th><th>Usage</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
    </div>`;
}

// ═══ TOP-UP REQUESTS PAGE ═══
function renderTopup() {
  const statusIcon = {pending:'🟡',approved:'🟢',rejected:'🔴',completed:'✅'};
  const items = MOCK.requests.map(r => `<div class="request-card">
    <div class="request-icon">${r.type==='new_card'?'💳':'💰'}</div>
    <div class="request-info"><div class="request-title">${r.employee} — ${r.reason}</div><div class="request-meta">${r.id} · ${r.project} · Card ${r.card} · ${r.createdAt}</div></div>
    <div class="request-amount"><div class="request-amt-val">$${fmtN(r.amount)}</div><div class="request-status"><span class="badge ${r.status==='completed'?'active':r.status==='approved'?'active':r.status==='rejected'?'error':'pending'}">${statusIcon[r.status]} ${r.status}</span></div></div>
  </div>`).join('');

  return `
    <div class="stat-grid">
      <div class="stat-card orange"><div class="stat-header"><span class="stat-label">Pending</span></div><div class="stat-value">${MOCK.requests.filter(r=>r.status==='pending').length}</div></div>
      <div class="stat-card green"><div class="stat-header"><span class="stat-label">Approved</span></div><div class="stat-value">${MOCK.requests.filter(r=>r.status==='approved').length}</div></div>
      <div class="stat-card blue"><div class="stat-header"><span class="stat-label">Completed</span></div><div class="stat-value">${MOCK.requests.filter(r=>r.status==='completed').length}</div></div>
    </div>
    <div class="table-container"><div class="table-header"><span class="table-title">📋 Card Requests</span><button class="table-btn primary">+ Tạo Request</button></div></div>
    ${items}`;
}

// ═══ BROWSER PROFILES PAGE ═══
function renderBrowsers() {
  const p = MOCK.browserProfiles;
  const running = p.filter(x=>x.status==='running').length;
  const statusDot = s => s==='running'?'🟢':s==='idle'?'🟡':'🔴';
  const statusCls = s => s==='running'?'active':s==='idle'?'paused':'error';

  const rows = p.map(pr => `<tr onclick="navigateTo('emp-detail:${pr.employeeCode}')" style="cursor:pointer">
    <td><div style="display:flex;align-items:center;gap:8px">${statusDot(pr.status)}<div><div style="font-weight:600">${pr.name}</div><div style="font-size:11px;color:var(--text-muted)">${pr.id}</div></div></div></td>
    <td>${pr.employee}</td>
    <td><span style="font-family:monospace;font-size:12px;color:var(--text-muted)">${pr.os} · ${pr.browser}</span></td>
    <td><span style="font-family:monospace;font-size:11px">${pr.proxy}</span></td>
    <td><span class="badge info">${pr.fingerprint}</span></td>
    <td><span class="badge ${statusCls(pr.status)}">${pr.status}</span></td>
    <td>${pr.platform}<div style="font-size:11px;color:var(--text-muted)">${pr.adAccount}</div></td>
    <td><span class="badge ${pr.extensionStatus==='Active'?'active':pr.extensionStatus==='Idle'?'paused':'error'}">${pr.extensionStatus}</span></td>
    <td>${pr.sessionTime !== '0m' ? pr.sessionTime : '-'}</td>
    <td style="color:var(--text-muted)">${pr.lastActive}</td>
  </tr>`).join('');

  return `
    <div class="stat-grid">
      <div class="stat-card green"><div class="stat-header"><span class="stat-label">Running</span><span class="stat-icon">🟢</span></div><div class="stat-value">${running}</div><div class="stat-sub">profiles đang chạy</div></div>
      <div class="stat-card blue"><div class="stat-header"><span class="stat-label">Tổng Profiles</span><span class="stat-icon">🌐</span></div><div class="stat-value">${p.length}</div><div class="stat-sub">ixBrowser profiles</div></div>
      <div class="stat-card purple"><div class="stat-header"><span class="stat-label">Extensions Active</span><span class="stat-icon">🔌</span></div><div class="stat-value">${p.filter(x=>x.extensionStatus==='Active').length}</div><div class="stat-sub">đang thu thập data</div></div>
      <div class="stat-card orange"><div class="stat-header"><span class="stat-label">Pages Today</span><span class="stat-icon">📄</span></div><div class="stat-value">${p.reduce((s,x)=>s+x.pagesVisited,0)}</div><div class="stat-sub">trang đã truy cập</div></div>
    </div>
    <div class="table-container">
      <div class="table-header"><span class="table-title">🌐 ixBrowser Profiles</span><div class="table-actions"><button class="table-btn">⟳ Sync All</button><button class="table-btn primary">+ Tạo Profile</button></div></div>
      <table><thead><tr><th>Profile</th><th>NV</th><th>OS / Browser</th><th>Proxy</th><th>Fingerprint</th><th>Status</th><th>Platform</th><th>Extension</th><th>Session</th><th>Last Active</th></tr></thead><tbody>${rows}</tbody></table>
    </div>`;
}

// ═══ EMPLOYEE DETAIL PAGE ═══
function renderEmpDetail(code) {
  const emp = MOCK.employees.find(e => e.code === code);
  if (!emp) return '<p>Employee not found</p>';
  const profiles = MOCK.browserProfiles.filter(p => p.employeeCode === code);
  const campaigns = MOCK.campaigns.filter(c => c.employee === emp.name);
  const cards = MOCK.cards.filter(c => c.employee === emp.name);
  const sessions = MOCK.browsingSessions.filter(s => profiles.some(p => p.id === s.profile));
  const colors = ['#f59e0b','#ef4444','#22c55e','#8b5cf6','#06b6d4','#ec4899','#3b82f7','#10b981'];
  const ci = MOCK.employees.indexOf(emp);
  const statusDot = s => s==='running'?'🟢':s==='idle'?'🟡':'🔴';

  // Profile cards
  const profileCards = profiles.map(pr => `
    <div class="request-card">
      <div class="request-icon">${statusDot(pr.status)}</div>
      <div class="request-info">
        <div class="request-title">${pr.name}</div>
        <div class="request-meta">${pr.os} · ${pr.browser} · ${pr.proxy}</div>
        <div class="request-meta" style="margin-top:4px">🔑 ${pr.fingerprint} · 📱 ${pr.adAccount} · Extension: <span class="badge ${pr.extensionStatus==='Active'?'active':'error'}">${pr.extensionStatus}</span></div>
      </div>
      <div class="request-amount">
        <div style="font-size:16px;font-weight:700">${pr.sessionTime}</div>
        <div style="font-size:11px;color:var(--text-muted)">${pr.pagesVisited} pages</div>
        <div class="request-status"><span class="badge ${pr.status==='running'?'active':pr.status==='idle'?'paused':'error'}">${pr.status}</span></div>
      </div>
    </div>`).join('');

  // Browsing history
  const historyHTML = sessions.map(s => {
    const pageRows = s.pages.map(pg => `
      <div class="activity-item">
        <div class="activity-dot" style="background:var(--fb-blue)"></div>
        <div style="flex:1"><div class="activity-text"><strong>${pg.title}</strong></div><div style="font-size:11px;color:var(--text-muted);font-family:monospace">${pg.url}</div></div>
        <div style="text-align:right"><div style="font-size:12px;font-weight:600">${pg.time}</div><div style="font-size:11px;color:var(--text-muted)">${pg.duration}</div></div>
      </div>`).join('');
    return `<div class="section-card" style="margin-bottom:16px"><div class="section-title">🕐 Session ${s.startTime} — ${s.duration}</div><div class="activity-list">${pageRows}</div></div>`;
  }).join('') || '<div class="section-card"><p style="color:var(--text-muted)">Không có session hôm nay</p></div>';

  // Campaign rows
  const campRows = campaigns.map(c => `<tr>
    <td style="font-weight:600">${c.name}</td><td>${statusBadge(c.status)}</td>
    <td>$${fmt(c.spent)}</td><td>${c.ctr.toFixed(2)}%</td>
    <td style="color:${c.roas>=4?'var(--success)':c.roas>=2?'var(--warning)':'var(--danger)'}">${c.roas>0?c.roas.toFixed(2)+'x':'-'}</td>
  </tr>`).join('') || '<tr><td colspan="5" style="color:var(--text-muted)">Chưa có campaigns</td></tr>';

  return `
    <div style="margin-bottom:24px"><button class="table-btn" onclick="navigateTo('employees')" style="margin-bottom:16px">← Quay lại danh sách</button></div>
    <div class="section-grid" style="margin-bottom:24px">
      <div class="section-card">
        <div style="display:flex;gap:16px;align-items:center;margin-bottom:20px">
          <div class="emp-avatar" style="width:56px;height:56px;font-size:22px;border-radius:14px;background:${colors[ci%8]}">${emp.name.split(' ').pop()[0]}</div>
          <div>
            <div style="font-size:20px;font-weight:800">${emp.name}</div>
            <div style="color:var(--text-muted)">${emp.code} · ${emp.role} · ${emp.dept}</div>
            <div style="margin-top:4px"><span class="badge ${emp.status==='online'?'active':emp.status==='idle'?'paused':'error'}">${emp.status}</span> · Last seen: ${emp.lastSeen}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="stat-card blue" style="margin:0"><div class="stat-label">Dự án</div><div class="stat-value" style="font-size:20px">${emp.project}</div></div>
          <div class="stat-card green" style="margin:0"><div class="stat-label">FB Spend</div><div class="stat-value" style="font-size:20px">$${fmt(emp.totalSpend)}</div></div>
          <div class="stat-card purple" style="margin:0"><div class="stat-label">Profiles</div><div class="stat-value" style="font-size:20px">${profiles.length}</div></div>
          <div class="stat-card orange" style="margin:0"><div class="stat-label">Cards</div><div class="stat-value" style="font-size:20px">${cards.length}</div></div>
        </div>
      </div>
      <div class="section-card">
        <div class="section-title">📢 FB Campaigns (${campaigns.length})</div>
        <table><thead><tr><th>Campaign</th><th>Status</th><th>Spent</th><th>CTR</th><th>ROAS</th></tr></thead><tbody>${campRows}</tbody></table>
      </div>
    </div>

    <div style="margin-bottom:16px"><span style="font-size:16px;font-weight:700">🌐 Browser Profiles (${profiles.length})</span></div>
    ${profileCards}

    <div style="margin:24px 0 16px"><span style="font-size:16px;font-weight:700">📜 Browsing History — Hôm nay</span></div>
    ${historyHTML}`;
}

// ═══ AUDIT LOG PAGE ═══
function renderAudit() {
  const colors = {data:'var(--success)',request:'var(--warning)',recon:'var(--accent)',sync:'var(--cyan)',approve:'var(--purple)',browser:'var(--fb-blue)'};
  const items = MOCK.auditLog.map(a => `<div class="activity-item"><div class="activity-dot" style="background:${colors[a.type]||'var(--text-muted)'}"></div><div><div class="activity-text">${a.action}</div><div class="activity-time">${a.time} — Hôm nay</div></div></div>`).join('');
  return `<div class="section-card"><div class="section-title">📝 Audit Trail</div><div class="activity-list">${items}</div></div>`;
}

function filterTable(input, tableId) {
  const q = input.value.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => navigateTo('overview'));
