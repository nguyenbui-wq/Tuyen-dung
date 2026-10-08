// ==========================================================================
// WINGS BEAUTY & ACADEMY - ADMIN MANAGEMENT & REWARD APPROVAL
// Phân hệ quản trị toàn diện:
// 1. Duyệt Data Tuyển Dụng & Chi Thưởng
// 2. Duyệt Đăng Ký Thành Viên (SĐT / Gmail)
// 3. Duyệt Đăng Ký Tham Gia Mini Game (Kiểm Tra Ảnh Chuối Chuyển Ví Admin) 🍌
// 4. Duyệt Link Bài Đăng Mini Game (+1 🍌)
// 5. Form Cấu Hình Riêng: Lệ Phí & Thông Tin Ví Chuối Admin
// ==========================================================================

const ADMIN_DEFAULT_PIN = '12345678';

let currentAdminTab = 'leads';
let currentFilterStatus = 'ALL';
let currentSearchTerm = '';
let currentFilterReferrer = 'ALL';
let selectedLeadForEdit = null;
let selectedAdminCampaignId = null;

document.addEventListener('DOMContentLoaded', () => {
    initAdminTabs();
    initAdminListeners();
    initAdminAuth();
});

// ==========================================================================
// 1. ADMIN & COUNSELOR AUTHENTICATION & RBAC HELPER
// ==========================================================================
function getActiveAdminRole() {
    if (sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true') {
        return 'admin';
    }
    const cur = (typeof DataManager !== 'undefined' && DataManager.getCurrentUser) ? DataManager.getCurrentUser() : null;
    if (cur) {
        if (cur.systemRole === 'admin' || cur.isAdmin) return 'admin';
        if (cur.systemRole === 'counselor' || (cur.role && cur.role.toLowerCase().includes('chuyên viên'))) return 'counselor';
    }
    return 'collaborator';
}

function canCurrentRolePerform(permKey) {
    const role = getActiveAdminRole();
    if (role === 'admin') return true;
    if (role === 'counselor') return DataManager.hasPermission('counselor', permKey);
    return false;
}

function initAdminAuth() {
    const authBtn = document.getElementById('btnOpenAdminAuth');
    const authModal = document.getElementById('adminAuthModal');
    const authForm = document.getElementById('adminAuthForm');
    const pinInput = document.getElementById('adminPinInput');
    const authError = document.getElementById('adminAuthError');
    const adminPanel = document.getElementById('adminDashboardSection');
    const logoutBtn = document.getElementById('btnAdminLogout');

    const role = getActiveAdminRole();
    if ((role === 'admin' || role === 'counselor') && adminPanel) {
        showAdminPanel();
    }

    if (authBtn && authModal) {
        authBtn.addEventListener('click', () => {
            const currentRole = getActiveAdminRole();
            if (currentRole === 'admin' || currentRole === 'counselor') {
                showAdminPanel();
                if (adminPanel) {
                    setTimeout(() => {
                        adminPanel.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                }
            } else {
                authModal.classList.remove('hidden');
                authModal.classList.add('flex');
                if (pinInput) {
                    pinInput.value = '';
                    pinInput.focus();
                }
                if (authError) authError.classList.add('hidden');
            }
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputVal = pinInput ? pinInput.value.trim() : '';

            // 1. Mã PIN Admin (12345678 hoặc 123456)
            if (inputVal === '12345678' || inputVal === ADMIN_DEFAULT_PIN || inputVal === '123456') {
                sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
                authModal.classList.add('hidden');
                authModal.classList.remove('flex');
                if (authError) authError.classList.add('hidden');
                showAdminPanel();
                if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
                return;
            }

            // 2. Chuyên viên hướng nghiệp đăng nhập qua SĐT hoặc Mật khẩu
            const users = DataManager.getUsers();
            const counselorUser = users.find(u => 
                (u.systemRole === 'counselor' || (u.role && u.role.toLowerCase().includes('chuyên viên'))) && 
                (u.password === inputVal || u.identifier === inputVal)
            );

            if (counselorUser) {
                DataManager.setCurrentUser(counselorUser);
                authModal.classList.add('hidden');
                authModal.classList.remove('flex');
                if (authError) authError.classList.add('hidden');
                showAdminPanel();
                if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
                return;
            }

            if (authError) {
                authError.textContent = 'Mật khẩu sai! Quản trị viên nhập 12345678 hoặc Chuyên viên nhập SĐT/Mật khẩu.';
                authError.classList.remove('hidden');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
            if (adminPanel) adminPanel.classList.add('hidden');
            const mainLanding = document.getElementById('mainLandingSection') || document.body;
            mainLanding.scrollIntoView({ behavior: 'smooth' });
            if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
        });
    }

    const closeAuthBtn = document.getElementById('btnCloseAuthModal');
    if (closeAuthBtn && authModal) {
        closeAuthBtn.addEventListener('click', () => {
            authModal.classList.add('hidden');
            authModal.classList.remove('flex');
        });
    }
}

function showAdminPanel() {
    const adminPanel = document.getElementById('adminDashboardSection');
    if (!adminPanel) return;
    adminPanel.classList.remove('hidden');
    applyRoleTabPermissions();
    try {
        refreshAdminDashboard();
    } catch (err) {
        console.error('Lỗi làm mới admin dashboard:', err);
    }
    setTimeout(() => {
        adminPanel.scrollIntoView({ behavior: 'smooth' });
    }, 50);
}

// Áp dụng quyền hạn ẩn/hiện các tab theo cấp bậc (Admin vs Chuyên viên hướng nghiệp)
function applyRoleTabPermissions() {
    const role = getActiveAdminRole();
    const isFullAdmin = (role === 'admin');

    const canConfig = isFullAdmin || DataManager.hasPermission('counselor', 'config_system');
    const canPosts = isFullAdmin || DataManager.hasPermission('counselor', 'approve_posts');
    const canMembers = isFullAdmin || DataManager.hasPermission('counselor', 'approve_members');
    const canLeads = isFullAdmin || DataManager.hasPermission('counselor', 'approve_leads');

    const tabPermMap = {
        'leads': canLeads,
        'users': canMembers,
        'game_regs': canMembers,
        'banana_posts': canPosts,
        'courses': canConfig,
        'banana_config': canConfig,
        'permissions': isFullAdmin // Chỉ Admin mới được thấy và sửa bảng phân quyền!
    };

    // Ẩn / hiện các Tab button
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        const tabKey = btn.getAttribute('data-tab');
        const allowed = tabPermMap[tabKey] !== false;
        if (allowed) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });

    // Cập nhật nhãn phân quyền Admin Panel header
    const subTitleHeader = document.querySelector('#adminDashboardSection span.text-purple-400');
    if (subTitleHeader) {
        if (isFullAdmin) {
            subTitleHeader.textContent = '👑 QUẢN TRỊ VIÊN (TOÀN QUYỀN)';
            subTitleHeader.className = 'text-[10px] font-black text-red-400 uppercase tracking-wider block';
        } else {
            subTitleHeader.textContent = '🛡️ CHUYÊN VIÊN HƯỚNG NGHIỆP (PHÂN QUYỀN)';
            subTitleHeader.className = 'text-[10px] font-black text-purple-400 uppercase tracking-wider block';
        }
    }

    // Kích hoạt tab hợp lệ
    if (!tabPermMap[currentAdminTab]) {
        const firstAllowed = Object.keys(tabPermMap).find(k => tabPermMap[k]);
        if (firstAllowed) {
            switchAdminTab(firstAllowed);
        }
    } else {
        switchAdminTab(currentAdminTab);
    }
}

// 2. ADMIN TABS SWITCHER
function switchAdminTab(targetTab) {
    if (!targetTab) targetTab = 'leads';
    currentAdminTab = targetTab;

    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');

    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === targetTab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    tabContents.forEach(c => {
        if (c.id === `tabContent_${targetTab}`) {
            c.classList.remove('hidden');
        } else {
            c.classList.add('hidden');
        }
    });

    try {
        if (targetTab === 'users') renderUsersTable();
        if (targetTab === 'game_regs') renderGameRegistrationsTable();
        if (targetTab === 'banana_posts') renderBananaPostsTable();
        if (targetTab === 'banana_config') loadBananaConfigForm();
        if (targetTab === 'courses') renderAdminCoursesTable();
        if (targetTab === 'permissions') renderPermissionsMatrixTable();
        if (targetTab === 'leads') {
            renderLeadsTable();
            renderReferrerSummaryTable();
        }
    } catch (err) {
        console.error(`Lỗi render tab admin ${targetTab}:`, err);
    }
}
window.switchAdminTab = switchAdminTab;

function initAdminTabs() {
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchAdminTab(targetTab);
        });
    });
}

// 2.1. RENDER BẢNG PHÂN QUYỀN TRUY CẬP (CHECKBOX MATRIX)
function renderPermissionsMatrixTable() {
    const tableBody = document.getElementById('permissionsMatrixTableBody');
    if (!tableBody) return;

    const matrix = DataManager.getRolePermissions();
    const permissions = SYSTEM_PERMISSIONS_LIST;
    const isFullAdmin = (getActiveAdminRole() === 'admin');

    let html = '';
    permissions.forEach((p, idx) => {
        const rowBg = idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/80';

        // Admin: luôn có quyền & disabled
        const adminChecked = 'checked disabled';

        // Counselor: từ matrix
        const counselorChecked = (matrix.counselor && matrix.counselor.permissions && matrix.counselor.permissions[p.key]) ? 'checked' : '';
        const counselorDisabled = isFullAdmin ? '' : 'disabled';

        // Collaborator: từ matrix
        const collabChecked = (matrix.collaborator && matrix.collaborator.permissions && matrix.collaborator.permissions[p.key]) ? 'checked' : '';
        const collabDisabled = isFullAdmin ? '' : 'disabled';

        html += `
            <tr class="${rowBg} hover:bg-slate-800/50 transition-colors border-b border-slate-800">
                <!-- Cột 1: Tên quyền & mô tả -->
                <td class="py-3 px-4">
                    <div class="flex items-start gap-2.5">
                        <div class="w-7 h-7 rounded-lg bg-black/60 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                            <i class="${p.icon} text-xs"></i>
                        </div>
                        <div>
                            <div class="font-bold text-white text-xs">${idx + 1}. ${p.name}</div>
                            <div class="text-[11px] text-slate-400 leading-tight mt-0.5">${p.desc}</div>
                        </div>
                    </div>
                </td>

                <!-- Cột 2: Quản trị viên (Admin) -->
                <td class="py-3 px-3 text-center bg-red-950/20 border-l border-amber-500/20">
                    <div class="inline-flex items-center justify-center">
                        <input type="checkbox" ${adminChecked} class="w-4 h-4 accent-red-500 rounded cursor-not-allowed" title="Quản trị viên luôn có toàn quyền">
                    </div>
                    <div class="text-[9px] text-emerald-400 font-bold mt-0.5">Toàn quyền</div>
                </td>

                <!-- Cột 3: Chuyên viên hướng nghiệp -->
                <td class="py-3 px-3 text-center bg-purple-950/20 border-l border-amber-500/20">
                    <label class="inline-flex flex-col items-center justify-center cursor-pointer p-1 rounded-lg hover:bg-purple-900/30 transition-all">
                        <input type="checkbox" id="perm_counselor_${p.key}" ${counselorChecked} ${counselorDisabled} class="w-5 h-5 accent-purple-500 rounded cursor-pointer transition-transform hover:scale-110">
                        <span class="text-[9px] text-purple-300 font-semibold mt-1">
                            ${counselorChecked ? '✓ Cho phép' : '✕ Khóa'}
                        </span>
                    </label>
                </td>

                <!-- Cột 4: Cộng tác viên -->
                <td class="py-3 px-3 text-center bg-slate-900/40 border-l border-amber-500/20">
                    <label class="inline-flex flex-col items-center justify-center cursor-pointer p-1 rounded-lg hover:bg-slate-800/40 transition-all">
                        <input type="checkbox" id="perm_collaborator_${p.key}" ${collabChecked} ${collabDisabled} class="w-4 h-4 accent-blue-500 rounded cursor-pointer transition-transform hover:scale-110">
                        <span class="text-[9px] text-slate-400 font-medium mt-1">
                            ${collabChecked ? '✓ Cho phép' : '✕ Khóa'}
                        </span>
                    </label>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

window.savePermissionsMatrixFromUI = function() {
    if (getActiveAdminRole() !== 'admin') {
        alert('Chỉ Quản trị viên (Admin) mới có quyền lưu cấu hình bảng phân quyền!');
        return;
    }

    const matrix = DataManager.getRolePermissions();
    SYSTEM_PERMISSIONS_LIST.forEach(p => {
        const elCounselor = document.getElementById(`perm_counselor_${p.key}`);
        if (elCounselor) matrix.counselor.permissions[p.key] = elCounselor.checked;

        const elCollab = document.getElementById(`perm_collaborator_${p.key}`);
        if (elCollab) matrix.collaborator.permissions[p.key] = elCollab.checked;
    });

    DataManager.saveRolePermissions(matrix);
    applyRoleTabPermissions();
    renderPermissionsMatrixTable();

    if (typeof showToast === 'function') {
        showToast('Đã lưu cấu hình phân quyền hệ thống thành công!', 'success');
    } else {
        alert('Đã lưu cấu hình phân quyền hệ thống thành công!');
    }
};

window.resetPermissionsMatrixToDefault = function() {
    if (getActiveAdminRole() !== 'admin') {
        alert('Chỉ Quản trị viên (Admin) mới có quyền đặt lại phân quyền!');
        return;
    }
    if (confirm('Khôi phục phân quyền về mặc định:\n- Admin: Toàn quyền\n- Chuyên viên hướng nghiệp: Duyệt bài & Duyệt thành viên\n- Cộng tác viên: Không duyệt gì hết')) {
        DataManager.saveRolePermissions(JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS)));
        applyRoleTabPermissions();
        renderPermissionsMatrixTable();
        alert('Đã khôi phục phân quyền về mặc định!');
    }
};

// 3. KHỞI TẠO CÁC SỰ KIỆN ADMIN
function initAdminListeners() {
    const searchInput = document.getElementById('adminSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase().trim();
            renderLeadsTable();
        });
    }

    const statusFilter = document.getElementById('adminStatusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilterStatus = e.target.value;
            renderLeadsTable();
        });
    }

    const refFilter = document.getElementById('adminReferrerFilter');
    if (refFilter) {
        refFilter.addEventListener('change', (e) => {
            currentFilterReferrer = e.target.value;
            renderLeadsTable();
        });
    }

    const btnExport = document.getElementById('btnExportExcel');
    if (btnExport) btnExport.addEventListener('click', exportToCSV);

    const btnResetDemo = document.getElementById('btnResetDemoData');
    if (btnResetDemo) {
        btnResetDemo.addEventListener('click', () => {
            if (confirm('Khôi phục danh sách dữ liệu mẫu ban đầu của Wings?')) {
                DataManager.resetDemoData();
                refreshAdminDashboard();
                if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
                alert('Đã khôi phục dữ liệu mẫu thành công!');
            }
        });
    }

    const editForm = document.getElementById('adminEditLeadForm');
    if (editForm) editForm.addEventListener('submit', handleUpdateLeadSubmit);

    const bananaForm = document.getElementById('adminBananaConfigForm');
    if (bananaForm) bananaForm.addEventListener('submit', handleSaveBananaConfig);

    const courseForm = document.getElementById('adminCourseForm');
    if (courseForm) courseForm.addEventListener('submit', handleSaveCourseSubmit);

    const dupCampForm = document.getElementById('adminDuplicateCampaignForm');
    if (dupCampForm) dupCampForm.addEventListener('submit', handleDuplicateCampaignSubmit);

    const editCampMetaForm = document.getElementById('adminEditCampaignMetaForm');
    if (editCampMetaForm) editCampMetaForm.addEventListener('submit', handleEditCampaignMetaSubmit);

    const campSelect = document.getElementById('adminCampaignSelect');
    if (campSelect) {
        campSelect.addEventListener('change', (e) => {
            selectedAdminCampaignId = e.target.value;
            renderAdminCoursesTable();
        });
    }

    // Live preview khi nhập % hoặc học phí trong modal khóa học
    ['courseInputTuition', 'courseInputSelfPercent', 'courseInputAcaPercent'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateCourseRewardPreview);
        }
    });

    const btnCloseDetail = document.getElementById('btnCloseDetailModal');
    if (btnCloseDetail) {
        btnCloseDetail.addEventListener('click', () => {
            document.getElementById('leadDetailModal').classList.add('hidden');
            document.getElementById('leadDetailModal').classList.remove('flex');
        });
    }

    const btnCloseEdit = document.getElementById('btnCloseEditModal');
    if (btnCloseEdit) {
        btnCloseEdit.addEventListener('click', () => {
            document.getElementById('adminEditModal').classList.add('hidden');
            document.getElementById('adminEditModal').classList.remove('flex');
        });
    }

    const btnCloseProofZoom = document.getElementById('btnCloseProofZoomModal');
    if (btnCloseProofZoom) {
        btnCloseProofZoom.addEventListener('click', () => {
            document.getElementById('proofZoomModal').classList.add('hidden');
            document.getElementById('proofZoomModal').classList.remove('flex');
        });
    }
}

// 4. REFRESH TOÀN BỘ DASHBOARD
function refreshAdminDashboard() {
    const leads = DataManager.getLeads();
    const users = DataManager.getUsers();
    const gameRegs = DataManager.getGameRegistrations();
    const posts = DataManager.getBananaPosts();

    // KPIs Leads
    const totalLeads = leads.length;
    const wonLeads = leads.filter(l => ['WON', 'APPROVED', 'PAID'].includes(l.status)).length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
    
    let pendingApprovalReward = 0;
    let paidReward = 0;

    leads.forEach(l => {
        if (l.status === 'PAID') {
            paidReward += (l.rewardAmount || 0);
        } else if (l.status === 'APPROVED' || l.status === 'WON') {
            pendingApprovalReward += (l.rewardAmount || 0);
        }
    });

    const kpiTotal = document.getElementById('kpiTotalLeads');
    if (kpiTotal) kpiTotal.textContent = totalLeads;
    const kpiWon = document.getElementById('kpiWonLeads');
    if (kpiWon) kpiWon.textContent = wonLeads;
    const kpiConv = document.getElementById('kpiConversionRate');
    if (kpiConv) kpiConv.textContent = `${conversionRate}%`;
    const kpiPending = document.getElementById('kpiPendingReward');
    if (kpiPending) kpiPending.textContent = DataManager.formatCurrency(pendingApprovalReward);
    const kpiPaid = document.getElementById('kpiPaidReward');
    if (kpiPaid) kpiPaid.textContent = DataManager.formatCurrency(paidReward);

    // Badges số lượng chờ duyệt trên Tabs
    const pendingUsersCount = users.filter(u => u.status === 'PENDING').length;
    const pendingGameRegsCount = gameRegs.filter(r => r.status === 'PENDING').length;
    const pendingPostsCount = posts.filter(p => p.status === 'PENDING').length;

    const badgeUserTab = document.getElementById('badgePendingUsersCount');
    const badgeGameRegTab = document.getElementById('badgePendingGameRegsCount');
    const badgePostTab = document.getElementById('badgePendingPostsCount');

    if (badgeUserTab) {
        badgeUserTab.textContent = pendingUsersCount;
        badgeUserTab.classList.toggle('hidden', pendingUsersCount === 0);
    }
    if (badgeGameRegTab) {
        badgeGameRegTab.textContent = pendingGameRegsCount;
        badgeGameRegTab.classList.toggle('hidden', pendingGameRegsCount === 0);
    }
    if (badgePostTab) {
        badgePostTab.textContent = pendingPostsCount;
        badgePostTab.classList.toggle('hidden', pendingPostsCount === 0);
    }

    populateReferrerFilter(leads);
    renderLeadsTable();
    renderReferrerSummaryTable();
    renderUsersTable();
    renderGameRegistrationsTable();
    renderBananaPostsTable();
    loadBananaConfigForm();
    renderAdminCoursesTable();
}

function populateReferrerFilter(leads) {
    const refFilter = document.getElementById('adminReferrerFilter');
    if (!refFilter) return;

    const referrers = [...new Set(leads.map(l => l.referrerName))];
    let html = '<option value="ALL">Tất cả người giới thiệu</option>';
    referrers.forEach(name => {
        html += `<option value="${name}">${name}</option>`;
    });
    refFilter.innerHTML = html;
    refFilter.value = currentFilterReferrer;
}

// ==========================================================================
// 5. TAB 2: DUYỆT ĐĂNG KÝ THÀNH VIÊN (SĐT / GMAIL)
// ==========================================================================
function renderUsersTable() {
    const tableBody = document.getElementById('adminUsersTableBody');
    if (!tableBody) return;

    const users = DataManager.getUsers();

    if (users.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">Chưa có thành viên đăng ký</td></tr>`;
        return;
    }

    let html = '';
    const currentAdminRole = getActiveAdminRole();
    const isFullAdmin = (currentAdminRole === 'admin');

    users.forEach(u => {
        let statusBadge = '';
        if (u.status === 'APPROVED') {
            statusBadge = `<span class="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"><i class="fa-solid fa-check mr-1"></i>Đã duyệt</span>`;
        } else if (u.status === 'REJECTED') {
            statusBadge = `<span class="px-2 py-0.5 rounded text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold"><i class="fa-solid fa-ban mr-1"></i>Từ chối</span>`;
        } else {
            statusBadge = `<span class="px-2.5 py-1 rounded text-xs bg-amber-500/25 text-amber-300 border border-amber-400/50 font-bold animate-pulse"><i class="fa-solid fa-hourglass-half mr-1"></i>Chờ duyệt</span>`;
        }

        const isEmail = u.authType === 'email' || u.identifier.includes('@');

        const avatarDisplay = u.avatar && u.avatar.trim() !== ''
            ? `<img src="${u.avatar}" class="w-8 h-8 rounded-full object-cover border border-amber-400 mr-2 flex-shrink-0" alt="Avatar">`
            : `<div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0"><i class="fa-solid fa-circle-user"></i></div>`;

        const sysRole = u.systemRole || (u.role && u.role.toLowerCase().includes('chuyên viên') ? 'counselor' : (u.isAdmin ? 'admin' : 'collaborator'));
        let roleBadge = '';
        if (sysRole === 'admin') {
            roleBadge = `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">👑 Quản Trị Viên</span>`;
        } else if (sysRole === 'counselor') {
            roleBadge = `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">🛡️ Chuyên Viên</span>`;
        } else {
            roleBadge = `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">💼 CTV</span>`;
        }

        const roleSelectHtml = isFullAdmin ? `
            <div class="mt-1">
                <select onchange="adminChangeUserRoleAction('${u.id}', this.value)" class="bg-black/90 border border-slate-700 hover:border-amber-400 text-[10px] rounded px-1.5 py-0.5 text-slate-200 cursor-pointer shadow-sm" title="Quản trị viên đổi vai trò">
                    <option value="collaborator" ${sysRole === 'collaborator' ? 'selected' : ''}>💼 Cộng tác viên</option>
                    <option value="counselor" ${sysRole === 'counselor' ? 'selected' : ''}>🛡️ Chuyên viên hướng nghiệp</option>
                    <option value="admin" ${sysRole === 'admin' ? 'selected' : ''}>👑 Quản trị viên</option>
                </select>
            </div>
        ` : `<div class="mt-1">${roleBadge}</div>`;

        html += `
            <tr class="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                <td class="py-3 px-3 font-mono text-xs text-amber-400 font-bold">${u.id}</td>
                <td class="py-3 px-3">
                    <div class="flex items-center">
                        ${avatarDisplay}
                        <div>
                            <div class="font-semibold text-white text-sm flex items-center gap-1.5">
                                <span>${u.name}</span>
                                ${isFullAdmin ? roleBadge : ''}
                            </div>
                            <div class="text-xs text-slate-400">${u.role || 'Cộng tác viên'}</div>
                            ${roleSelectHtml}
                        </div>
                    </div>
                </td>
                <td class="py-3 px-3">
                    <div class="text-xs font-mono font-bold ${isEmail ? 'text-cyan-400' : 'text-amber-300'} flex items-center gap-1.5">
                        <i class="${isEmail ? 'fa-regular fa-envelope' : 'fa-solid fa-phone'}"></i>
                        ${u.identifier}
                    </div>
                </td>
                <td class="py-3 px-3 text-xs text-slate-300 font-mono">
                    ${u.bankInfo || '<span class="text-slate-500 italic">Chưa có</span>'}
                </td>
                <td class="py-3 px-3 text-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 text-xs font-bold">
                        🍌 ${u.bananas || 0}
                    </span>
                    <button onclick="adminAdjustBananasModal('${u.id}', '${u.name}', ${u.bananas || 0})" title="Cộng/Trừ Chuối" class="ml-1 text-[11px] text-slate-400 hover:text-yellow-400">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </td>
                <td class="py-3 px-3 text-center">
                    ${statusBadge}
                </td>
                <td class="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                    ${u.status === 'PENDING' ? `
                        <button onclick="adminApproveUserAction('${u.id}')" class="px-2.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition-all">
                            <i class="fa-solid fa-check mr-1"></i> Duyệt Ngay
                        </button>
                        <button onclick="adminRejectUserAction('${u.id}')" class="px-2 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40 text-xs transition-all">
                            Từ Chối
                        </button>
                    ` : u.status === 'APPROVED' ? `
                        <button onclick="adminRejectUserAction('${u.id}')" class="px-2 py-1 rounded bg-slate-800 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 text-xs transition-all" title="Khóa/Hủy duyệt">
                            Khóa
                        </button>
                    ` : `
                        <button onclick="adminApproveUserAction('${u.id}')" class="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black text-xs font-semibold transition-all">
                            Duyệt Lại
                        </button>
                    `}
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

window.adminChangeUserRoleAction = function(userId, newRole) {
    if (getActiveAdminRole() !== 'admin') {
        alert('Chỉ Quản trị viên mới có quyền điều chỉnh vai trò thành viên!');
        return;
    }
    const updated = DataManager.updateUserSystemRole(userId, newRole);
    if (updated) {
        refreshAdminDashboard();
        if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
        if (typeof showToast === 'function') {
            showToast(`Đã chuyển vai trò của ${updated.name} thành: ${updated.role}`, 'success');
        } else {
            alert(`Đã cập nhật vai trò của ${updated.name} thành: ${updated.role}`);
        }
    }
};

window.adminApproveUserAction = function(userId) {
    const role = getActiveAdminRole();
    const canApproveMembers = (role === 'admin' || DataManager.hasPermission('counselor', 'approve_members'));
    if (!canApproveMembers) {
        alert('Bạn không có quyền duyệt thành viên!');
        return;
    }
    const updated = DataManager.approveUser(userId);
    if (updated) {
        refreshAdminDashboard();
        if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
        alert(`Đã duyệt kích hoạt tài khoản ${updated.name} (${updated.identifier}) thành công!`);
    }
};

window.adminRejectUserAction = function(userId) {
    const role = getActiveAdminRole();
    const canApproveMembers = (role === 'admin' || DataManager.hasPermission('counselor', 'approve_members'));
    if (!canApproveMembers) {
        alert('Bạn không có quyền duyệt thành viên!');
        return;
    }
    if (confirm('Bạn có chắc muốn từ chối / khóa tài khoản này?')) {
        const updated = DataManager.rejectUser(userId);
        if (updated) {
            refreshAdminDashboard();
            if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
        }
    }
};

window.adminAdjustBananasModal = function(userId, name, currentBananas) {
    if (!canCurrentRolePerform('approve_members')) {
        alert('Bạn không có quyền điều chỉnh số chuối thành viên! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const amountStr = prompt(`Điều chỉnh số Chuối 🍌 cho ${name} (Hiện có: ${currentBananas} 🍌).\nNhập số chuối muốn cộng (VD: 2) hoặc trừ (VD: -1):`, '1');
    if (amountStr !== null) {
        const amount = parseInt(amountStr, 10);
        if (!isNaN(amount)) {
            DataManager.adjustUserBananas(userId, amount);
            refreshAdminDashboard();
            if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
            alert(`Đã cập nhật ví chuối thành công!`);
        } else {
            alert('Vui lòng nhập số hợp lệ!');
        }
    }
};

// ==========================================================================
// 6. TAB 3: DUYỆT ĐĂNG KÝ THAM GIA MINI GAME (KIỂM TRA ẢNH CHUỐI) 🍌
// ==========================================================================
function renderGameRegistrationsTable() {
    const tableBody = document.getElementById('adminGameRegsTableBody');
    if (!tableBody) return;

    const list = DataManager.getGameRegistrations();

    if (list.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">Chưa có đơn đăng ký tham gia game nào</td></tr>`;
        return;
    }

    let html = '';
    list.forEach(r => {
        let statusBadge = '';
        if (r.status === 'APPROVED') {
            statusBadge = `<span class="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"><i class="fa-solid fa-check mr-1"></i>Đã duyệt chơi</span>`;
        } else if (r.status === 'REJECTED') {
            statusBadge = `<span class="px-2 py-0.5 rounded text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold"><i class="fa-solid fa-xmark mr-1"></i>Từ chối</span>`;
        } else {
            statusBadge = `<span class="px-2.5 py-1 rounded text-xs bg-amber-500/25 text-amber-300 border border-amber-400/50 font-bold animate-pulse"><i class="fa-solid fa-hourglass-half mr-1"></i>Chờ kiểm tra ảnh</span>`;
        }

        html += `
            <tr class="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                <td class="py-3 px-3 font-mono text-xs text-amber-400 font-bold">${r.id}</td>
                <td class="py-3 px-3">
                    <div class="font-semibold text-white text-sm">${r.userName}</div>
                    <div class="text-xs text-slate-400 font-mono">${r.userIdentifier}</div>
                </td>
                <td class="py-3 px-3 text-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 text-xs font-black">
                        🍌 ${r.bananasTransferred} Chuối
                    </span>
                </td>
                <!-- Ảnh bằng chứng chuyển chuối kèm nút phóng to -->
                <td class="py-3 px-3">
                    <div class="flex items-center gap-2">
                        <img src="${r.proofImage}" alt="Ảnh chuối" class="w-12 h-12 object-cover rounded-lg border border-amber-500/50 cursor-pointer hover:scale-105 transition-all shadow" 
                            onclick="openProofZoomModal('${r.proofImage}', '${r.userName}', '${r.bananasTransferred}')" title="Bấm để phóng to xem ảnh">
                        <div>
                            <button onclick="openProofZoomModal('${r.proofImage}', '${r.userName}', '${r.bananasTransferred}')" class="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                                <i class="fa-solid fa-magnifying-glass-plus"></i> Xem ảnh chuối
                            </button>
                            ${r.note ? `<div class="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">"${r.note}"</div>` : ''}
                        </div>
                    </div>
                </td>
                <td class="py-3 px-3 text-xs text-slate-400">
                    ${DataManager.formatDate(r.submittedAt)}
                </td>
                <td class="py-3 px-3 text-center">
                    ${statusBadge}
                </td>
                <td class="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                    ${r.status === 'PENDING' ? `
                        <button onclick="adminApproveGameRegAction('${r.id}')" class="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-md transition-all">
                            <i class="fa-solid fa-check mr-1"></i> Duyệt Tham Gia
                        </button>
                        <button onclick="adminRejectGameRegAction('${r.id}')" class="px-2 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40 text-xs transition-all">
                            Từ Chối
                        </button>
                    ` : r.status === 'APPROVED' ? `
                        <button onclick="adminRejectGameRegAction('${r.id}')" class="px-2 py-1 rounded bg-slate-800 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 text-xs transition-all">
                            Hủy Quyền
                        </button>
                    ` : `
                        <button onclick="adminApproveGameRegAction('${r.id}')" class="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black text-xs font-semibold transition-all">
                            Duyệt Lại
                        </button>
                    `}
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

window.openProofZoomModal = function(imgSrc, userName, bananas) {
    const modal = document.getElementById('proofZoomModal');
    const img = document.getElementById('proofZoomImage');
    const title = document.getElementById('proofZoomTitle');
    if (!modal || !img) return;

    img.src = imgSrc;
    if (title) title.textContent = `Bằng Chứng Chuyển ${bananas} Chuối 🍌 Của: ${userName}`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.adminApproveGameRegAction = function(regId) {
    const role = getActiveAdminRole();
    const canApproveMembers = (role === 'admin' || DataManager.hasPermission('counselor', 'approve_members'));
    if (!canApproveMembers) {
        alert('Tài khoản của bạn không có quyền duyệt thành viên tham gia game!');
        return;
    }
    const updated = DataManager.approveGameRegistration(regId);
    if (updated) {
        refreshAdminDashboard();
        if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
        alert(`Đã duyệt đơn đăng ký tham gia game của ${updated.userName}! Thành viên đã được mở quyền nộp link bài đăng.`);
    }
};

window.adminRejectGameRegAction = function(regId) {
    const role = getActiveAdminRole();
    const canApproveMembers = (role === 'admin' || DataManager.hasPermission('counselor', 'approve_members'));
    if (!canApproveMembers) {
        alert('Tài khoản của bạn không có quyền duyệt thành viên tham gia game!');
        return;
    }
    const reason = prompt('Nhập lý do từ chối (VD: Ảnh mờ, chưa nhận được chuối vào ví Admin...):', 'Ảnh chưa thể hiện rõ giao dịch chuyển chuối hoặc chưa nhận được chuối');
    if (reason !== null) {
        DataManager.rejectGameRegistration(regId, reason);
        refreshAdminDashboard();
        if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
    }
};

// ==========================================================================
// 7. TAB 4: DUYỆT BÀI ĐĂNG MINI GAME (+1 🍌)
// ==========================================================================
function renderBananaPostsTable() {
    const tableBody = document.getElementById('adminBananaPostsTableBody');
    if (!tableBody) return;

    const posts = DataManager.getBananaPosts();

    if (posts.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">Chưa có bài đăng nào nộp link</td></tr>`;
        return;
    }

    let html = '';
    posts.forEach(p => {
        let statusBadge = '';
        if (p.status === 'APPROVED') {
            statusBadge = `<span class="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"><i class="fa-solid fa-check mr-1"></i>Hợp lệ (+${p.bananasAwarded} 🍌)</span>`;
        } else if (p.status === 'REJECTED') {
            statusBadge = `<span class="px-2 py-0.5 rounded text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold"><i class="fa-solid fa-xmark mr-1"></i>Từ chối</span>`;
        } else {
            statusBadge = `<span class="px-2.5 py-1 rounded text-xs bg-amber-500/25 text-amber-300 border border-amber-400/50 font-bold animate-pulse"><i class="fa-solid fa-clock mr-1"></i>Chờ duyệt link</span>`;
        }

        html += `
            <tr class="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                <td class="py-3 px-3 font-mono text-xs text-amber-400 font-bold">${p.id}</td>
                <td class="py-3 px-3">
                    <div class="font-semibold text-white text-sm">${p.userName}</div>
                    <div class="text-xs text-slate-400 font-mono">${p.userIdentifier}</div>
                </td>
                <td class="py-3 px-3">
                    <span class="inline-block px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold text-xs uppercase">
                        ${p.platform}
                    </span>
                </td>
                <td class="py-3 px-3 max-w-xs">
                    <a href="${p.link}" target="_blank" class="text-yellow-400 hover:underline font-mono text-xs flex items-center gap-1.5 truncate" title="Bấm mở link bài đăng">
                        <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                        ${p.link}
                    </a>
                    ${p.note ? `<div class="text-[11px] text-slate-400 truncate mt-0.5">${p.note}</div>` : ''}
                    ${p.adminNote ? `<div class="text-[10px] text-rose-300 italic mt-0.5">Lý do: ${p.adminNote}</div>` : ''}
                </td>
                <td class="py-3 px-3 text-xs text-slate-400">
                    ${DataManager.formatDate(p.createdAt)}
                </td>
                <td class="py-3 px-3 text-center">
                    ${statusBadge}
                </td>
                <td class="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                    ${p.status === 'PENDING' ? `
                        <button onclick="adminApproveBananaPostAction('${p.id}')" class="px-3 py-1.5 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs shadow-md transition-all">
                            🍌 Duyệt +1 Chuối
                        </button>
                        <button onclick="adminRejectBananaPostAction('${p.id}')" class="px-2 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40 text-xs transition-all">
                            Từ Chối
                        </button>
                    ` : `
                        <span class="text-xs text-slate-500 italic">Đã xử lý</span>
                    `}
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

window.adminApproveBananaPostAction = function(postId) {
    const role = getActiveAdminRole();
    const canApprovePosts = (role === 'admin' || DataManager.hasPermission('counselor', 'approve_posts'));
    if (!canApprovePosts) {
        alert('Tài khoản của bạn không có quyền duyệt bài!');
        return;
    }
    const updated = DataManager.approveBananaPost(postId);
    if (updated) {
        refreshAdminDashboard();
        if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
        alert(`Đã duyệt bài đăng hợp lệ và cộng ${updated.bananasAwarded} Chuối 🍌 vào ví của ${updated.userName}!`);
    }
};

window.adminRejectBananaPostAction = function(postId) {
    const role = getActiveAdminRole();
    const canApprovePosts = (role === 'admin' || DataManager.hasPermission('counselor', 'approve_posts'));
    if (!canApprovePosts) {
        alert('Tài khoản của bạn không có quyền duyệt bài!');
        return;
    }
    const reason = prompt('Nhập lý do từ chối bài đăng:', 'Link bài đăng chưa ở chế độ công khai hoặc thiếu hashtag');
    if (reason !== null) {
        DataManager.rejectBananaPost(postId, reason);
        refreshAdminDashboard();
        if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
    }
};

// ==========================================================================
// 8. TAB 5: FORM CẤU HÌNH LỆ PHÍ & THÔNG TIN VÍ CHUỐI ADMIN 🍌
// ==========================================================================
function loadBananaConfigForm() {
    const config = DataManager.getBananaConfig();
    const inputFee = document.getElementById('cfgRequiredBananas');
    const inputReward = document.getElementById('cfgBananasPerLink');
    const inputWallet = document.getElementById('cfgAdminWalletAddress');
    const inputOwner = document.getElementById('cfgAdminWalletOwner');
    const inputTitle = document.getElementById('cfgProgramTitle');
    const inputDesc = document.getElementById('cfgProgramDesc');
    const inputGuidelines = document.getElementById('cfgGuidelines');

    if (inputFee) inputFee.value = config.requiredBananasToEnter || 3;
    if (inputReward) inputReward.value = config.bananasPerValidLink || 1;
    if (inputWallet) inputWallet.value = config.adminWalletAddress || 'WINGS-BANANA-ADMIN-8888';
    if (inputOwner) inputOwner.value = config.adminWalletOwner || 'Bộ phận Hướng nghiệp Wings (Vy Đào)';
    if (inputTitle) inputTitle.value = config.programFeeTitle || '';
    if (inputDesc) inputDesc.value = config.programFeeDescription || '';
    if (inputGuidelines) inputGuidelines.value = config.guidelines || '';
}

function handleSaveBananaConfig(e) {
    e.preventDefault();
    if (!canCurrentRolePerform('config_system')) {
        alert('Bạn không có quyền điều chỉnh cấu hình mini game & ví chuối! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const requiredBananasToEnter = parseInt(document.getElementById('cfgRequiredBananas').value, 10) || 3;
    const bananasPerValidLink = parseInt(document.getElementById('cfgBananasPerLink').value, 10) || 1;
    const adminWalletAddress = document.getElementById('cfgAdminWalletAddress').value.trim();
    const adminWalletOwner = document.getElementById('cfgAdminWalletOwner').value.trim();
    const programFeeTitle = document.getElementById('cfgProgramTitle')?.value?.trim() || '';
    const programFeeDescription = document.getElementById('cfgProgramDesc')?.value?.trim() || '';
    const guidelines = document.getElementById('cfgGuidelines')?.value?.trim() || '';

    DataManager.saveBananaConfig({
        requiredBananasToEnter,
        bananasPerValidLink,
        adminWalletAddress,
        adminWalletOwner,
        programFeeTitle,
        programFeeDescription,
        guidelines
    });

    if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
    alert('Đã lưu cấu hình lệ phí và thông tin ví Chuối 🍌 thành công! Thông tin ngoài trang chủ đã được cập nhật.');
}

// ==========================================================================
// 9. TAB 1: DUYỆT DATA TUYỂN DỤNG & CHI THƯỞNG
// ==========================================================================
function renderLeadsTable() {
    const tableBody = document.getElementById('adminLeadsTableBody');
    if (!tableBody) return;

    let leads = DataManager.getLeads();

    if (currentFilterStatus !== 'ALL') {
        leads = leads.filter(l => l.status === currentFilterStatus);
    }
    if (currentFilterReferrer !== 'ALL') {
        leads = leads.filter(l => l.referrerName === currentFilterReferrer);
    }
    if (currentSearchTerm) {
        leads = leads.filter(l => 
            l.id.toLowerCase().includes(currentSearchTerm) ||
            l.customerName.toLowerCase().includes(currentSearchTerm) ||
            l.customerPhone.includes(currentSearchTerm) ||
            l.referrerName.toLowerCase().includes(currentSearchTerm) ||
            l.referrerPhone.includes(currentSearchTerm)
        );
    }

    if (leads.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-10 text-slate-400">
                    <i class="fa-solid fa-box-open text-3xl mb-2 text-amber-500/40"></i>
                    <p>Không có dữ liệu phù hợp với bộ lọc</p>
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    leads.forEach(l => {
        const statusConfig = LEAD_STATUS[l.status] || LEAD_STATUS.NEW;
        const course = COURSES_CONFIG.find(c => c.id === l.actualCourseId) || COURSES_CONFIG.find(c => c.id === l.interestCourseId);
        const isSelf = l.actualCloseType === 'self';

        html += `
            <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-3">
                    <div class="font-mono text-xs font-bold text-amber-400">${l.id}</div>
                    <div class="text-[11px] text-slate-500">${DataManager.formatDate(l.createdAt)}</div>
                </td>
                <td class="py-3 px-3">
                    <div class="font-semibold text-white text-sm flex items-center gap-1.5">
                        <i class="fa-solid fa-user-tag text-xs text-amber-500"></i> ${l.referrerName}
                    </div>
                    <div class="text-xs text-slate-400 font-mono">${l.referrerPhone}</div>
                </td>
                <td class="py-3 px-3">
                    <div class="font-semibold text-amber-200 text-sm">${l.customerName}</div>
                    <div class="text-xs text-slate-400 font-mono">${l.customerPhone}</div>
                    ${l.appointmentDate ? `
                        <div class="text-[10px] text-yellow-300 font-medium flex items-center gap-1 mt-0.5" title="Kế hoạch ACA: Ngày hẹn lên học viện">
                            <i class="fa-regular fa-calendar-check text-yellow-400"></i> Hẹn: ${DataManager.formatDate(l.appointmentDate)}
                        </div>
                    ` : ''}
                </td>
                <td class="py-3 px-3">
                    <div class="text-sm font-medium text-white">${course?.name || '--'}</div>
                    <div class="text-xs ${isSelf ? 'text-amber-400 font-semibold' : 'text-slate-400'}">
                        ${isSelf ? 'Tự chốt (100%)' : 'CV Hướng nghiệp (50%)'}
                    </div>
                </td>
                <td class="py-3 px-3">
                    <div class="font-bold text-amber-400 text-sm">
                        ${DataManager.formatCurrency(l.rewardAmount)}
                    </div>
                </td>
                <td class="py-3 px-3">
                    <span class="inline-block px-2.5 py-1 text-xs rounded-full border ${statusConfig.color}">
                        ${statusConfig.label}
                    </span>
                </td>
                <td class="py-3 px-3 text-xs text-slate-400 max-w-[160px] truncate" title="${l.adminNote || ''}">
                    ${l.adminNote || '<span class="text-slate-600 italic">Chưa có</span>'}
                </td>
                <td class="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                    <button onclick="openLeadDetail('${l.id}')" title="Xem 4 thông tin bàn giao" 
                        class="p-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button onclick="openLeadEditModal('${l.id}')" title="Duyệt thưởng / Đổi trạng thái" 
                        class="p-1.5 px-2.5 rounded bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black transition-all text-xs font-medium border border-amber-500/40">
                        <i class="fa-solid fa-pen-to-square mr-1"></i> Xử lý
                    </button>
                    <button onclick="deleteLeadConfirm('${l.id}')" title="Xóa data" 
                        class="p-1.5 px-2 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors text-xs">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

function renderReferrerSummaryTable() {
    const tableBody = document.getElementById('adminReferrerSummaryTableBody');
    if (!tableBody) return;

    const leads = DataManager.getLeads();
    const summaryMap = {};

    leads.forEach(l => {
        const key = l.referrerPhone;
        if (!summaryMap[key]) {
            summaryMap[key] = {
                name: l.referrerName,
                phone: l.referrerPhone,
                bank: l.referrerBank || 'Chưa cung cấp',
                totalLeads: 0,
                wonLeads: 0,
                totalReward: 0,
                paidReward: 0,
                pendingReward: 0
            };
        }

        summaryMap[key].totalLeads += 1;
        
        if (['WON', 'APPROVED', 'PAID'].includes(l.status)) {
            summaryMap[key].wonLeads += 1;
            summaryMap[key].totalReward += (l.rewardAmount || 0);

            if (l.status === 'PAID') {
                summaryMap[key].paidReward += (l.rewardAmount || 0);
            } else {
                summaryMap[key].pendingReward += (l.rewardAmount || 0);
            }
        }
    });

    const summaryList = Object.values(summaryMap);
    if (summaryList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-500">Chưa có người giới thiệu</td></tr>`;
        return;
    }

    let html = '';
    summaryList.forEach(item => {
        const hasPending = item.pendingReward > 0;
        html += `
            <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-3">
                    <div class="font-semibold text-white text-sm">${item.name}</div>
                    <div class="text-xs text-amber-400 font-mono">${item.phone}</div>
                </td>
                <td class="py-3 px-3 text-xs text-slate-300 font-mono">${item.bank}</td>
                <td class="py-3 px-3 text-center text-sm font-medium text-slate-200">
                    ${item.totalLeads} (${item.wonLeads} chốt)
                </td>
                <td class="py-3 px-3 text-right font-bold text-amber-300 text-sm">
                    ${DataManager.formatCurrency(item.totalReward)}
                </td>
                <td class="py-3 px-3 text-right font-semibold text-yellow-400 text-sm">
                    ${DataManager.formatCurrency(item.paidReward)}
                </td>
                <td class="py-3 px-3 text-right font-bold ${hasPending ? 'text-emerald-400 animate-pulse' : 'text-slate-500'} text-sm">
                    ${DataManager.formatCurrency(item.pendingReward)}
                </td>
                <td class="py-3 px-3 text-right">
                    ${hasPending ? `
                        <button onclick="payoutAllForReferrer('${item.phone}')" class="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs rounded transition-all shadow-md">
                            <i class="fa-solid fa-money-bill-wave mr-1"></i> Chi tất cả
                        </button>
                    ` : `
                        <span class="text-xs text-slate-500"><i class="fa-solid fa-check-double text-yellow-500 mr-1"></i>Đã đủ</span>
                    `}
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

window.openLeadDetail = function(id) {
    const leads = DataManager.getLeads();
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    const modal = document.getElementById('leadDetailModal');
    if (!modal) return;

    const course = COURSES_CONFIG.find(c => c.id === lead.actualCourseId) || COURSES_CONFIG.find(c => c.id === lead.interestCourseId);

    const dLeadId = document.getElementById('detailLeadId');
    if (dLeadId) dLeadId.textContent = lead.id;
    const dLeadDate = document.getElementById('detailLeadDate');
    if (dLeadDate) dLeadDate.textContent = DataManager.formatDate(lead.createdAt);
    const dRef = document.getElementById('detailReferrer');
    if (dRef) dRef.innerHTML = `<strong>${lead.referrerName}</strong> - SĐT/Gmail: ${lead.referrerPhone} (${lead.referrerRole})<br><span class="text-amber-300 font-mono">${lead.referrerBank || 'Chưa có STK'}</span>`;
    const dCust = document.getElementById('detailCustomer');
    if (dCust) dCust.innerHTML = `<strong>${lead.customerName}</strong> - SĐT: <a href="tel:${lead.customerPhone}" class="text-amber-400 underline font-mono">${lead.customerPhone}</a>`;
    const dCourse = document.getElementById('detailCourse');
    if (dCourse) dCourse.textContent = `${course?.name} (${course?.tuitionFormatted})`;
    const dCloseType = document.getElementById('detailCloseType');
    if (dCloseType) dCloseType.textContent = lead.closeType === 'self' ? 'Người giới thiệu tự chốt (100% thưởng)' : 'Bàn giao CV Hướng nghiệp chốt (50% thưởng)';

    // Hiển thị Kế hoạch Đội ACA nếu có lịch hẹn hoặc tự chốt
    const acaBox = document.getElementById('detailAcaPlanningBox');
    if (acaBox) {
        if (lead.appointmentDate || lead.tuitionPaymentDate || lead.closeType === 'self') {
            acaBox.classList.remove('hidden');
            const apptEl = document.getElementById('detailAppointment');
            const tuitionEl = document.getElementById('detailTuitionDate');
            const noteEl = document.getElementById('detailTuitionNote');

            if (apptEl) apptEl.textContent = lead.appointmentDate ? DataManager.formatDate(lead.appointmentDate) : 'Chưa xếp lịch';
            if (tuitionEl) tuitionEl.textContent = lead.tuitionPaymentDate || 'Chưa ghi nhận';
            if (noteEl) noteEl.textContent = lead.tuitionPaymentNote || 'Không có ghi chú thêm.';
        } else {
            acaBox.classList.add('hidden');
        }
    }

    document.getElementById('detailTarget').textContent = `${lead.customerTarget} ${lead.customerTargetDetail ? ' - ' + lead.customerTargetDetail : ''}`;
    document.getElementById('detailStage').textContent = lead.customerStage;
    document.getElementById('detailPainPoint').textContent = lead.customerPainPoint || 'Không ghi chú';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.openLeadEditModal = function(id) {
    if (!canCurrentRolePerform('approve_leads')) {
        alert('Bạn không có quyền chỉnh sửa / duyệt hồ sơ data khách hàng! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const leads = DataManager.getLeads();
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    selectedLeadForEdit = lead;
    const modal = document.getElementById('adminEditModal');
    if (!modal) return;

    document.getElementById('editLeadIdDisplay').textContent = lead.id;
    document.getElementById('editCustomerNameDisplay').textContent = lead.customerName;
    document.getElementById('editReferrerNameDisplay').textContent = `${lead.referrerName} (${lead.referrerPhone})`;

    const courseSelect = document.getElementById('editActualCourse');
    const closeTypeSelect = document.getElementById('editActualCloseType');
    const statusSelect = document.getElementById('editStatus');
    const noteInput = document.getElementById('editAdminNote');
    const rewardPreview = document.getElementById('editRewardPreview');

    const editAppt = document.getElementById('editAppointmentDate');
    const editTuition = document.getElementById('editTuitionPaymentDate');
    const editNote = document.getElementById('editTuitionPaymentNote');

    courseSelect.value = lead.actualCourseId || lead.interestCourseId;
    closeTypeSelect.value = lead.actualCloseType || lead.closeType;
    statusSelect.value = lead.status;
    noteInput.value = lead.adminNote || '';

    if (editAppt) editAppt.value = lead.appointmentDate || '';
    if (editTuition) editTuition.value = lead.tuitionPaymentDate || '';
    if (editNote) editNote.value = lead.tuitionPaymentNote || '';

    function updatePreview() {
        const c = COURSES_CONFIG.find(item => item.id === courseSelect.value) || COURSES_CONFIG[0];
        const isSelf = closeTypeSelect.value === 'self';
        const amount = isSelf ? c.rewardSelf : c.rewardPass;
        rewardPreview.textContent = DataManager.formatCurrency(amount);
    }

    courseSelect.onchange = updatePreview;
    closeTypeSelect.onchange = updatePreview;
    updatePreview();

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

function handleUpdateLeadSubmit(e) {
    e.preventDefault();
    if (!selectedLeadForEdit) return;

    const role = getActiveAdminRole();
    const canApproveLeads = (role === 'admin' || DataManager.hasPermission('counselor', 'approve_leads'));
    if (!canApproveLeads) {
        alert('Tài khoản của bạn không có quyền duyệt Data & duyệt chi trả thưởng!');
        return;
    }

    const actualCourseId = document.getElementById('editActualCourse').value;
    const actualCloseType = document.getElementById('editActualCloseType').value;
    const status = document.getElementById('editStatus').value;
    const adminNote = document.getElementById('editAdminNote').value.trim();

    const appointmentDate = document.getElementById('editAppointmentDate')?.value || '';
    const tuitionPaymentDate = document.getElementById('editTuitionPaymentDate')?.value || '';
    const tuitionPaymentNote = document.getElementById('editTuitionPaymentNote')?.value.trim() || '';

    let paidDate = selectedLeadForEdit.paidDate;
    if (status === 'PAID' && !paidDate) {
        paidDate = new Date().toISOString().slice(0, 10);
    }

    DataManager.updateLead(selectedLeadForEdit.id, {
        actualCourseId,
        actualCloseType,
        status,
        adminNote,
        paidDate,
        appointmentDate,
        tuitionPaymentDate,
        tuitionPaymentNote
    });

    document.getElementById('adminEditModal').classList.add('hidden');
    document.getElementById('adminEditModal').classList.remove('flex');
    selectedLeadForEdit = null;

    refreshAdminDashboard();
}

window.deleteLeadConfirm = function(id) {
    if (!canCurrentRolePerform('approve_leads')) {
        alert('Bạn không có quyền xóa hồ sơ data! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ ${id}?`)) {
        DataManager.deleteLead(id);
        refreshAdminDashboard();
    }
};

window.payoutAllForReferrer = function(phone) {
    if (!canCurrentRolePerform('approve_leads')) {
        alert('Bạn không có quyền duyệt chi trả thưởng! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    if (confirm(`Xác nhận đã thanh toán toàn bộ tiền thưởng đang chờ cho ${phone}?`)) {
        const leads = DataManager.getLeads();
        const today = new Date().toISOString().slice(0, 10);

        leads.forEach(l => {
            if (l.referrerPhone === phone && ['WON', 'APPROVED'].includes(l.status)) {
                l.status = 'PAID';
                l.paidDate = today;
                l.adminNote = (l.adminNote ? l.adminNote + ' | ' : '') + `Đã thanh toán ngày ${today}`;
            }
        });

        DataManager.saveLeads(leads);
        refreshAdminDashboard();
        alert('Đã cập nhật trạng thái chi trả thành công!');
    }
};

function exportToCSV() {
    const leads = DataManager.getLeads();
    if (leads.length === 0) {
        alert('Không có dữ liệu để xuất!');
        return;
    }

    const headers = [
        'Mã hồ sơ', 'Ngày gửi', 'Người giới thiệu', 'SĐT/Gmail Người GT', 'Vai trò', 'STK Ngân hàng',
        'Họ tên Khách', 'SĐT Khách', 'Mục tiêu khách', 'Chi tiết nhu cầu', 'Giai đoạn quyết định', 'Nỗi lo/Điểm chốt',
        'Khóa học thực tế', 'Hình thức chốt', 'Tiền thưởng (VNĐ)', 'Trạng thái', 'Ngày chi trả', 'Ghi chú quản lý'
    ];

    const rows = leads.map(l => {
        const course = COURSES_CONFIG.find(c => c.id === l.actualCourseId) || COURSES_CONFIG.find(c => c.id === l.interestCourseId);
        const statusConfig = LEAD_STATUS[l.status] || LEAD_STATUS.NEW;

        return [
            l.id,
            DataManager.formatDate(l.createdAt),
            `"${(l.referrerName || '').replace(/"/g, '""')}"`,
            `"${l.referrerPhone}"`,
            `"${(l.referrerRole || '').replace(/"/g, '""')}"`,
            `"${(l.referrerBank || '').replace(/"/g, '""')}"`,
            `"${(l.customerName || '').replace(/"/g, '""')}"`,
            `"${l.customerPhone}"`,
            `"${(l.customerTarget || '').replace(/"/g, '""')}"`,
            `"${(l.customerTargetDetail || '').replace(/"/g, '""')}"`,
            `"${(l.customerStage || '').replace(/"/g, '""')}"`,
            `"${(l.customerPainPoint || '').replace(/"/g, '""')}"`,
            `"${course?.name || ''}"`,
            l.actualCloseType === 'self' ? 'Tự chốt (100%)' : 'CV Hướng nghiệp (50%)',
            l.rewardAmount || 0,
            statusConfig.label,
            l.paidDate || '',
            `"${(l.adminNote || '').replace(/"/g, '""')}"`
        ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Wings_TuyenDung_BaoCaoThuong_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==========================================================================
// 11. QUẢN LÝ DANH MỤC KHÓA HỌC & BẢNG THƯỞNG (DO ADMIN QUY ĐỊNH)
// ==========================================================================

// ==========================================================================
// 11. QUẢN LÝ MẪU BẢNG THƯỞNG, KỲ ÁP DỤNG & DANH MỤC KHÓA HỌC (ADMIN QUY ĐỊNH)
// ==========================================================================

function renderAdminCoursesTable() {
    const tableBody = document.getElementById('adminCoursesTableBody');
    const campSelect = document.getElementById('adminCampaignSelect');
    const campDatesDisplay = document.getElementById('adminCampDatesDisplay');
    const campStatusBadge = document.getElementById('adminCampStatusBadge');
    const campNoteDisplay = document.getElementById('adminCampNoteDisplay');
    const btnActivate = document.getElementById('btnActivateCampaign');

    const campaigns = DataManager.getCampaigns ? DataManager.getCampaigns() : [];
    if (campaigns.length === 0) return;

    // 1. Xác định campaign đang được chọn xem trong Admin
    if (!selectedAdminCampaignId || !campaigns.some(c => c.id === selectedAdminCampaignId)) {
        const activeCamp = DataManager.getActiveCampaign ? DataManager.getActiveCampaign() : null;
        selectedAdminCampaignId = activeCamp ? activeCamp.id : campaigns[0].id;
    }

    const currentCamp = campaigns.find(c => c.id === selectedAdminCampaignId) || campaigns[0];

    // 2. Điền danh sách chiến dịch vào selector
    if (campSelect) {
        let optHtml = '';
        campaigns.forEach(c => {
            const isAct = c.isActive ? ' ⭐ [ĐANG ÁP DỤNG]' : '';
            optHtml += `<option value="${c.id}" ${c.id === selectedAdminCampaignId ? 'selected' : ''}>${c.name}${isAct}</option>`;
        });
        campSelect.innerHTML = optHtml;
    }

    // 3. Cập nhật thời gian diễn ra & trạng thái
    if (campDatesDisplay) {
        const start = DataManager.formatDateShort ? DataManager.formatDateShort(currentCamp.startDate) : currentCamp.startDate;
        const end = DataManager.formatDateShort ? DataManager.formatDateShort(currentCamp.endDate) : currentCamp.endDate;
        campDatesDisplay.textContent = `${start} - ${end}`;
    }

    if (campStatusBadge) {
        if (currentCamp.isActive) {
            campStatusBadge.innerHTML = `<span class="px-2.5 py-1 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 shadow-sm"><i class="fa-solid fa-circle-check"></i> Đang áp dụng chính thức</span>`;
            if (btnActivate) btnActivate.classList.add('hidden');
        } else {
            campStatusBadge.innerHTML = `<span class="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-medium flex items-center gap-1"><i class="fa-solid fa-clock"></i> Mẫu dự thảo / Chưa kích hoạt</span>`;
            if (btnActivate) btnActivate.classList.remove('hidden');
        }
    }

    if (campNoteDisplay) {
        campNoteDisplay.textContent = currentCamp.note || 'Chính sách bảng thưởng tuyển sinh Wings Academy';
    }

    // 4. Render danh sách khóa học thuộc campaign đang chọn
    if (!tableBody) return;
    const courses = DataManager.getCourses(selectedAdminCampaignId);

    if (!courses || courses.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400">Mẫu này chưa có khóa học nào. Bấm "+ Thêm Khóa Mới" để tạo!</td></tr>`;
        return;
    }

    let html = '';
    courses.forEach((c, idx) => {
        const badgeHtml = c.badge ? `<span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 ml-1.5 uppercase">${c.badge}</span>` : '';
        const iconHtml = c.icon ? `<i class="fa-solid fa-${c.icon} text-amber-400 mr-1.5"></i>` : '';
        const scholarshipDisplay = (c.scholarship > 0 || c.scholarshipNote) ? `
            <div>
                <div class="font-bold text-yellow-300 font-mono flex items-center gap-1">
                    <i class="fa-solid fa-gift text-yellow-400 text-[10px]"></i>
                    ${c.scholarshipFormatted || DataManager.formatMoneyShort(c.scholarship)}
                </div>
                ${c.scholarshipNote ? `<div class="text-[10px] text-amber-200/80 italic mt-0.5">${c.scholarshipNote}</div>` : ''}
            </div>
        ` : `<span class="text-slate-500">--</span>`;

        html += `
            <tr class="border-b border-amber-900/20 hover:bg-amber-500/5 transition-colors">
                <td class="py-2.5 px-3">
                    <div class="font-bold text-white flex items-center">
                        ${iconHtml}
                        <span>${c.name}</span>
                        ${badgeHtml}
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono mt-0.5">ID: ${c.id}</div>
                </td>
                <td class="py-2.5 px-3">
                    <div class="font-bold text-amber-200 font-mono text-sm">${c.tuitionFormatted || DataManager.formatMoneyShort(c.tuition)}</div>
                    <div class="text-[10px] text-slate-400">${c.tuition.toLocaleString('vi-VN')} đ</div>
                </td>
                <td class="py-2.5 px-3">
                    ${scholarshipDisplay}
                </td>
                <td class="py-2.5 px-3 text-center">
                    <div class="inline-block px-2.5 py-1 rounded-xl bg-amber-950/40 border border-amber-500/30">
                        <div class="font-extrabold text-yellow-300 text-xs">${c.selfPercent || 20}%</div>
                        <div class="text-[11px] text-yellow-400 font-bold">${c.rewardSelfFormatted || DataManager.formatMoneyShort(c.rewardSelf)}</div>
                    </div>
                </td>
                <td class="py-2.5 px-3 text-center">
                    <div class="inline-block px-2.5 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                        <div class="font-extrabold text-emerald-300 text-xs">${c.acaPercent || 10}%</div>
                        <div class="text-[11px] text-emerald-400 font-bold">${c.rewardPassFormatted || DataManager.formatMoneyShort(c.rewardPass)}</div>
                    </div>
                </td>
                <td class="py-2.5 px-3 text-right whitespace-nowrap">
                    <button type="button" onclick="openEditCourseModal('${c.id}')" class="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold hover:bg-amber-500 hover:text-black transition-colors mr-1">
                        <i class="fa-solid fa-pen-to-square text-[10px]"></i> Sửa
                    </button>
                    <button type="button" onclick="deleteCourseConfirm('${c.id}')" class="px-2 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold hover:bg-rose-500 hover:text-white transition-colors">
                        <i class="fa-solid fa-trash text-[10px]"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

window.openAddCourseModal = function() {
    if (!canCurrentRolePerform('config_system')) {
        alert('Bạn không có quyền thêm mới khóa học! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const modal = document.getElementById('courseEditModal');
    const form = document.getElementById('adminCourseForm');
    const title = document.getElementById('courseModalTitle');
    const editIdInput = document.getElementById('courseEditId');

    if (!modal || !form) return;
    form.reset();
    editIdInput.value = '';
    title.innerHTML = '<i class="fa-solid fa-plus text-amber-400"></i> Thêm Khóa Học & Mức Thưởng Mới';

    document.getElementById('courseInputSelfPercent').value = 20;
    document.getElementById('courseInputAcaPercent').value = 10;
    document.getElementById('courseInputScholarship').value = 0;
    updateCourseRewardPreview();

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.openEditCourseModal = function(courseId) {
    if (!canCurrentRolePerform('config_system')) {
        alert('Bạn không có quyền chỉnh sửa bảng thưởng khóa học! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const modal = document.getElementById('courseEditModal');
    const form = document.getElementById('adminCourseForm');
    const title = document.getElementById('courseModalTitle');
    const editIdInput = document.getElementById('courseEditId');

    if (!modal || !form) return;
    const courses = DataManager.getCourses(selectedAdminCampaignId);
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    editIdInput.value = course.id;
    title.innerHTML = `<i class="fa-solid fa-pen-to-square text-amber-400"></i> Sửa Khóa: ${course.name}`;

    document.getElementById('courseInputName').value = course.name || '';
    document.getElementById('courseInputTuition').value = course.tuition || 0;
    document.getElementById('courseInputScholarship').value = course.scholarship || 0;
    document.getElementById('courseInputScholarshipNote').value = course.scholarshipNote || '';
    document.getElementById('courseInputSelfPercent').value = course.selfPercent !== undefined ? course.selfPercent : 20;
    document.getElementById('courseInputAcaPercent').value = course.acaPercent !== undefined ? course.acaPercent : 10;
    document.getElementById('courseInputBadge').value = course.badge || '';
    if (document.getElementById('courseInputIcon')) {
        document.getElementById('courseInputIcon').value = course.icon || 'crown';
    }

    updateCourseRewardPreview();

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closeCourseEditModal = function() {
    const modal = document.getElementById('courseEditModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

function updateCourseRewardPreview() {
    const tuitionInput = document.getElementById('courseInputTuition');
    const selfPercentInput = document.getElementById('courseInputSelfPercent');
    const acaPercentInput = document.getElementById('courseInputAcaPercent');
    const previewSelf = document.getElementById('coursePreviewSelfReward');
    const previewAca = document.getElementById('coursePreviewAcaReward');

    if (!tuitionInput || !previewSelf || !previewAca) return;

    const tuition = parseFloat(tuitionInput.value) || 0;
    const selfPercent = parseFloat(selfPercentInput?.value) || 0;
    const acaPercent = parseFloat(acaPercentInput?.value) || 0;

    const rewardSelf = Math.round(tuition * selfPercent / 100);
    const rewardAca = Math.round(tuition * acaPercent / 100);

    previewSelf.textContent = `${DataManager.formatMoneyShort(rewardSelf)} (${rewardSelf.toLocaleString('vi-VN')} đ)`;
    previewAca.textContent = `${DataManager.formatMoneyShort(rewardAca)} (${rewardAca.toLocaleString('vi-VN')} đ)`;
}

function handleSaveCourseSubmit(e) {
    e.preventDefault();
    if (!canCurrentRolePerform('config_system')) {
        alert('Bạn không có quyền lưu thay đổi khóa học! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const editId = document.getElementById('courseEditId')?.value?.trim();
    const name = document.getElementById('courseInputName')?.value?.trim();
    const tuition = parseInt(document.getElementById('courseInputTuition')?.value, 10) || 0;
    const scholarship = parseInt(document.getElementById('courseInputScholarship')?.value, 10) || 0;
    const scholarshipNote = document.getElementById('courseInputScholarshipNote')?.value?.trim() || '';
    const selfPercent = parseFloat(document.getElementById('courseInputSelfPercent')?.value) || 0;
    const acaPercent = parseFloat(document.getElementById('courseInputAcaPercent')?.value) || 0;
    const badge = document.getElementById('courseInputBadge')?.value?.trim() || '';
    const icon = document.getElementById('courseInputIcon')?.value || 'crown';

    if (!name) {
        alert('Vui lòng nhập tên khóa học!');
        return;
    }

    if (tuition <= 0) {
        alert('Vui lòng nhập học phí niêm yết hợp lệ!');
        return;
    }

    const courseData = {
        name,
        tuition,
        scholarship,
        scholarshipNote,
        selfPercent,
        acaPercent,
        badge,
        icon
    };

    if (editId) {
        DataManager.updateCourse(editId, courseData, selectedAdminCampaignId);
    } else {
        DataManager.addCourse(courseData, selectedAdminCampaignId);
    }

    closeCourseEditModal();
    renderAdminCoursesTable();

    // Đồng bộ lập tức ra giao diện người dùng
    if (typeof initRewardMobileCards === 'function') initRewardMobileCards();
    if (typeof populateCourseSelects === 'function') populateCourseSelects();
    if (typeof initRewardCalculator === 'function') initRewardCalculator();

    alert(editId ? `Đã cập nhật khóa học "${name}" thành công!` : `Đã thêm khóa học mới "${name}" thành công!`);
}

window.deleteCourseConfirm = function(id) {
    if (!canCurrentRolePerform('config_system')) {
        alert('Bạn không có quyền xóa khóa học! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const courses = DataManager.getCourses(selectedAdminCampaignId);
    const course = courses.find(c => c.id === id);
    const courseName = course ? course.name : id;

    if (confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseName}" khỏi mẫu bảng thưởng này?`)) {
        DataManager.deleteCourse(id, selectedAdminCampaignId);
        renderAdminCoursesTable();

        if (typeof initRewardMobileCards === 'function') initRewardMobileCards();
        if (typeof populateCourseSelects === 'function') populateCourseSelects();
        if (typeof initRewardCalculator === 'function') initRewardCalculator();

        alert(`Đã xóa khóa học "${courseName}"!`);
    }
};

// ==========================================================================
// 12. CÁC HÀNH ĐỘNG CHIẾN DỊCH / MẪU BẢNG THƯỞNG (NHÂN BẢN, SỬA, KÍCH HOẠT, XÓA)
// ==========================================================================

// MODAL NHÂN BẢN MẪU BẢNG THƯỞNG
window.openDuplicateCampaignModal = function() {
    if (!canCurrentRolePerform('config_system')) {
        alert('Bạn không có quyền nhân bản mẫu bảng thưởng! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const campaigns = DataManager.getCampaigns ? DataManager.getCampaigns() : [];
    const currentCamp = campaigns.find(c => c.id === selectedAdminCampaignId) || campaigns[0];
    if (!currentCamp) return;

    const modal = document.getElementById('duplicateCampaignModal');
    if (!modal) return;

    document.getElementById('dupSourceCampName').textContent = currentCamp.name;
    document.getElementById('dupInputName').value = `${currentCamp.name} (Bản sao mới)`;
    document.getElementById('dupInputStartDate').value = currentCamp.startDate || '';
    document.getElementById('dupInputEndDate').value = currentCamp.endDate || '';
    document.getElementById('dupInputNote').value = currentCamp.note || '';
    document.getElementById('dupCheckActive').checked = true;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closeDuplicateCampaignModal = function() {
    const modal = document.getElementById('duplicateCampaignModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

function handleDuplicateCampaignSubmit(e) {
    e.preventDefault();
    if (!canCurrentRolePerform('config_system')) {
        alert('Bạn không có quyền tạo mẫu bảng thưởng mới! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const newName = document.getElementById('dupInputName').value.trim();
    const startDate = document.getElementById('dupInputStartDate').value;
    const endDate = document.getElementById('dupInputEndDate').value;
    const note = document.getElementById('dupInputNote').value.trim();
    const makeActive = document.getElementById('dupCheckActive').checked;

    if (!newName) {
        alert('Vui lòng nhập tên cho mẫu bảng thưởng mới!');
        return;
    }
    if (!startDate || !endDate) {
        alert('Vui lòng chọn thời gian bắt đầu và kết thúc!');
        return;
    }

    const newCamp = DataManager.duplicateCampaign(selectedAdminCampaignId, newName, startDate, endDate, makeActive, note);
    if (newCamp) {
        selectedAdminCampaignId = newCamp.id;
        closeDuplicateCampaignModal();
        renderAdminCoursesTable();

        if (typeof initRewardMobileCards === 'function') initRewardMobileCards();
        if (typeof populateCourseSelects === 'function') populateCourseSelects();
        if (typeof initRewardCalculator === 'function') initRewardCalculator();

        alert(`✨ Đã nhân bản thành công mẫu bảng thưởng mới:\n"${newCamp.name}"!\n\nToàn bộ khóa học, học phí và % hoa hồng đã được sao chép. Bạn có thể thoải mái điều chỉnh cho kỳ mới.`);
    }
}

// MODAL SỬA THÔNG TIN KỲ BẢNG THƯỞNG
window.openEditCampaignMetaModal = function() {
    if (!canCurrentRolePerform('config_system')) {
        alert('Bạn không có quyền chỉnh sửa thông tin kỳ bảng thưởng! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const campaigns = DataManager.getCampaigns ? DataManager.getCampaigns() : [];
    const currentCamp = campaigns.find(c => c.id === selectedAdminCampaignId) || campaigns[0];
    if (!currentCamp) return;

    const modal = document.getElementById('editCampaignMetaModal');
    if (!modal) return;

    document.getElementById('metaInputName').value = currentCamp.name || '';
    document.getElementById('metaInputStartDate').value = currentCamp.startDate || '';
    document.getElementById('metaInputEndDate').value = currentCamp.endDate || '';
    document.getElementById('metaInputNote').value = currentCamp.note || '';
    document.getElementById('metaCheckActive').checked = !!currentCamp.isActive;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closeEditCampaignMetaModal = function() {
    const modal = document.getElementById('editCampaignMetaModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

function handleEditCampaignMetaSubmit(e) {
    e.preventDefault();
    if (!canCurrentRolePerform('config_system')) {
        alert('Bạn không có quyền lưu thông tin kỳ bảng thưởng! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const name = document.getElementById('metaInputName').value.trim();
    const startDate = document.getElementById('metaInputStartDate').value;
    const endDate = document.getElementById('metaInputEndDate').value;
    const note = document.getElementById('metaInputNote').value.trim();
    const isActive = document.getElementById('metaCheckActive').checked;

    if (!name) {
        alert('Vui lòng nhập tên mẫu bảng thưởng!');
        return;
    }
    if (!startDate || !endDate) {
        alert('Vui lòng chọn thời gian bắt đầu và kết thúc!');
        return;
    }

    DataManager.updateCampaignMeta(selectedAdminCampaignId, { name, startDate, endDate, note, isActive });
    closeEditCampaignMetaModal();
    renderAdminCoursesTable();

    if (typeof initRewardMobileCards === 'function') initRewardMobileCards();
    if (typeof populateCourseSelects === 'function') populateCourseSelects();
    if (typeof initRewardCalculator === 'function') initRewardCalculator();

    alert('Đã lưu cập nhật thông tin kỳ bảng thưởng thành công!');
}

// KÍCH HOẠT MẪU ĐANG XEM LÀM CHÍNH THỨC
window.adminActivateCurrentCampaign = function() {
    if (!canCurrentRolePerform('config_system')) {
        alert('Bạn không có quyền kích hoạt bảng thưởng! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const campaigns = DataManager.getCampaigns ? DataManager.getCampaigns() : [];
    const currentCamp = campaigns.find(c => c.id === selectedAdminCampaignId);
    if (!currentCamp) return;

    if (confirm(`Xác nhận kích hoạt mẫu "${currentCamp.name}" làm bảng thưởng CHÍNH THỨC đang áp dụng cho ứng viên ngoài trang chủ?`)) {
        DataManager.setActiveCampaign(selectedAdminCampaignId);
        renderAdminCoursesTable();

        if (typeof initRewardMobileCards === 'function') initRewardMobileCards();
        if (typeof populateCourseSelects === 'function') populateCourseSelects();
        if (typeof initRewardCalculator === 'function') initRewardCalculator();

        alert(`Đã kích hoạt mẫu "${currentCamp.name}" làm bảng thưởng chính thức ngoài trang chủ!`);
    }
};

// XÓA MẪU BẢNG THƯỞNG ĐANG CHỌN
window.adminDeleteCurrentCampaign = function() {
    if (!canCurrentRolePerform('config_system')) {
        alert('Bạn không có quyền xóa mẫu bảng thưởng! Vui lòng liên hệ Quản trị viên.');
        return;
    }
    const campaigns = DataManager.getCampaigns ? DataManager.getCampaigns() : [];
    if (campaigns.length <= 1) {
        alert('Hệ thống phải có ít nhất 1 mẫu bảng thưởng. Không thể xóa mẫu duy nhất!');
        return;
    }

    const currentCamp = campaigns.find(c => c.id === selectedAdminCampaignId);
    if (!currentCamp) return;

    if (confirm(`Bạn có chắc chắn muốn xóa mẫu bảng thưởng "${currentCamp.name}"?\nToàn bộ thiết lập khóa học trong mẫu này sẽ bị xóa.`)) {
        DataManager.deleteCampaign(selectedAdminCampaignId);
        selectedAdminCampaignId = DataManager.getActiveCampaign()?.id || DataManager.getCampaigns()[0]?.id;
        renderAdminCoursesTable();

        if (typeof initRewardMobileCards === 'function') initRewardMobileCards();
        if (typeof populateCourseSelects === 'function') populateCourseSelects();
        if (typeof initRewardCalculator === 'function') initRewardCalculator();

        alert('Đã xóa mẫu bảng thưởng thành công!');
    }
};

