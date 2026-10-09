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

// Dashboard Funnel & Leaderboard Time Filtering State
let currentDashboardTimeFilter = 'month'; // 'month', 'week', 'day'
let currentDashboardDate = new Date();
let currentConsultantFilter = 'ALL'; // 'ALL', 'ONLINE', 'CLIENT'
let currentAdminLbCategory = 'data'; // 'data', 'banana'

document.addEventListener('DOMContentLoaded', () => {
    initAdminTabs();
    initAdminListeners();
    initAdminAuth();
    initAdminThemeToggle();
    if (typeof getWingsThemeMode === 'function') {
        applyWingsThemeUIAdmin(getWingsThemeMode());
    }
});

// ==========================================================================
// THEME MODE SWITCHER (VƯỜN ƯƠM WINGS <-> TIÊU CHUẨN CRM)
// ==========================================================================
function applyWingsThemeUIAdmin(mode) {
    const validMode = (mode === 'standard' || mode === 'nursery') ? mode : 'nursery';
    const isNursery = (validMode === 'nursery');
    const cfg = (typeof WINGS_THEME_CONFIG !== 'undefined' && WINGS_THEME_CONFIG[validMode]) ? WINGS_THEME_CONFIG[validMode] : null;
    if (!cfg) return;

    // 1. Header Button
    const iconEl = document.getElementById('themeModeIconAdmin');
    const labelEl = document.getElementById('themeModeLabelAdmin');
    if (iconEl) iconEl.textContent = cfg.icon;
    if (labelEl) labelEl.textContent = cfg.shortName;

    // 1.1 Header Badge & Subtitle (Cập nhật chuẩn theo vai trò Kiểm Lâm vs Bà Tiên Xanh)
    applyRoleTabPermissions();

    // 2. Consultant Filter Buttons
    const btnOnline = document.getElementById('btnConsOnline');
    const btnClient = document.getElementById('btnConsClient');
    if (btnOnline && cfg.admin) btnOnline.textContent = cfg.admin.btnConsOnline;
    if (btnClient && cfg.admin) btnClient.textContent = cfg.admin.btnConsClient;

    // 3. Visual Funnel Bar
    const fnTitle = document.getElementById('funnelSectionTitle');
    const fnTip = document.getElementById('funnelSectionTip');
    if (fnTitle && cfg.admin) fnTitle.innerHTML = cfg.admin.funnelTitle;
    if (fnTip && cfg.admin) fnTip.textContent = cfg.admin.funnelTip;

    if (cfg.admin && cfg.admin.funnelSteps) {
        for (let i = 1; i <= 5; i++) {
            const stepEl = document.getElementById(`funnelStep${i}Label`);
            if (stepEl && cfg.admin.funnelSteps[i - 1]) {
                stepEl.textContent = cfg.admin.funnelSteps[i - 1];
            }
        }
    }

    // 4. Admin Screen Titles & Bottom Bar Labels
    const screenTitleLeads = document.getElementById('screenTitleLeads');
    const screenSubLeads = document.getElementById('screenSubLeads');
    const bottomLabelSetup = document.getElementById('adminBottomLabel_setup');
    const bottomLabelLeads = document.getElementById('adminBottomLabel_leads');
    const bottomLabelLb = document.getElementById('adminBottomLabel_leaderboard');
    const tabUsers = document.getElementById('adminTabLabel_users');
    const tabPerm = document.getElementById('adminTabLabel_permissions');

    if (screenTitleLeads) screenTitleLeads.textContent = isNursery ? 'Quản Lý Hạt Giống & Tiến Trình' : 'Quản Lý Lead & Tiến Trình';
    if (screenSubLeads) screenSubLeads.textContent = isNursery ? 'Theo dõi phễu gieo hạt, tưới mát, nảy mầm, đào tạo và chi thưởng cho người gieo hạt' : 'Theo dõi phễu tiếp nhận data, chăm sóc, checkin, đào tạo và chi trả hoa hồng';
    if (bottomLabelSetup) bottomLabelSetup.textContent = 'Cài Đặt';
    if (bottomLabelLeads) bottomLabelLeads.textContent = isNursery ? 'Gieo Hạt' : 'Data Lead';
    if (bottomLabelLb) bottomLabelLb.textContent = isNursery ? 'Xếp Hạng' : 'Bảng Xếp Hạng';
    if (tabUsers && cfg.admin && cfg.admin.titleTabUsers) tabUsers.textContent = cfg.admin.titleTabUsers;
    if (tabPerm && cfg.admin && cfg.admin.titleTabPermissions) tabPerm.textContent = cfg.admin.titleTabPermissions;

    // 5. Admin Status Filter Dropdown
    const statusSelect = document.getElementById('adminStatusFilter');
    if (statusSelect && cfg.admin && cfg.admin.statusOptions) {
        const curVal = statusSelect.value;
        statusSelect.innerHTML = cfg.admin.statusOptions.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('');
        statusSelect.value = curVal;
    }

    // 6. Admin Leaderboard Tab Terminology
    const lbMainTitle = document.getElementById('adminLbMainTitleText');
    const lbMainSub = document.getElementById('adminLbMainSubtitle');
    const btnLbDataLabel = document.getElementById('btnAdminLbDataLabel');
    const lbDataSecTitle = document.getElementById('adminLbDataSectionTitle');

    if (lbMainTitle && cfg.admin && cfg.admin.lbMainTitle) lbMainTitle.textContent = cfg.admin.lbMainTitle;
    if (lbMainSub && cfg.admin && cfg.admin.lbMainSubtitle) lbMainSub.textContent = cfg.admin.lbMainSubtitle;
    if (btnLbDataLabel && cfg.admin && cfg.admin.lbTabDataBtn) btnLbDataLabel.textContent = cfg.admin.lbTabDataBtn;
    if (lbDataSecTitle && cfg.admin && cfg.admin.lbDataSectionTitle) lbDataSecTitle.textContent = cfg.admin.lbDataSectionTitle;

    // Table Column Headers in Admin Leaderboard
    const colRef = document.getElementById('adminLbColReferrer');
    const colTotal = document.getElementById('adminLbColTotalData');
    const colCheckin = document.getElementById('adminLbColCheckin');
    const colTrain = document.getElementById('adminLbColTraining');
    const colWon = document.getElementById('adminLbColWon');
    const colReward = document.getElementById('adminLbColReward');

    if (colRef) colRef.textContent = isNursery ? 'Người Gieo Hạt' : 'Người Giới Thiệu';
    if (colTotal) colTotal.textContent = isNursery ? 'Số Hạt Giống' : 'Số Khách (Data)';
    if (colCheckin) colCheckin.textContent = isNursery ? '🌱 Nảy Mầm' : 'Đã Checkin';
    if (colTrain) colTrain.textContent = isNursery ? '🌿 Đâm Chồi' : 'Đang Training';
    if (colWon) colWon.textContent = isNursery ? '🍎 Kết Trái (Won)' : 'Đã Chốt (Won)';
    if (colReward) colReward.textContent = isNursery ? 'Quả Ngọt (VNĐ)' : 'Tổng Thưởng (VNĐ)';

    // 7. Permissions Matrix
    const permDesc = document.getElementById('adminPermDesc');
    const permColAdmin = document.getElementById('permColAdminTitle');
    const permColCounselor = document.getElementById('permColCounselorTitle');
    const permColCollab = document.getElementById('permColCollabTitle');

    if (permDesc && cfg.admin && cfg.admin.permDesc) permDesc.textContent = cfg.admin.permDesc;
    if (permColAdmin && cfg.admin && cfg.admin.permColAdmin) permColAdmin.textContent = cfg.admin.permColAdmin;
    if (permColCounselor && cfg.admin && cfg.admin.permColCounselor) permColCounselor.textContent = cfg.admin.permColCounselor;
    if (permColCollab && cfg.admin && cfg.admin.permColCollab) permColCollab.textContent = cfg.admin.permColCollab;

    // 8. Admin Auth Modal
    const authIcon = document.getElementById('adminAuthModalIconAdmin');
    const authTitle = document.getElementById('adminAuthModalTitleAdmin');
    const authDesc = document.getElementById('adminAuthModalDescAdmin');

    if (authIcon) authIcon.innerHTML = `<i class="fa-solid ${isNursery ? 'fa-tree' : 'fa-shield-halved'}"></i>`;
    if (authTitle) authTitle.textContent = isNursery ? 'Xác Thực Kiểm Lâm' : 'Xác Thực Quản Trị';
    if (authDesc) authDesc.textContent = isNursery ? 'Nhập mật khẩu Kiểm Lâm để vào vườn ươm' : 'Nhập mật khẩu quản trị để vào dashboard';

    // 9. Re-render affected tables if active
    if (typeof renderAdminLeaderboard === 'function') renderAdminLeaderboard();
    if (typeof renderUsersTable === 'function') renderUsersTable();
    if (typeof renderPermissionsMatrixTable === 'function') renderPermissionsMatrixTable();
}
window.applyWingsThemeUIAdmin = applyWingsThemeUIAdmin;

function initAdminThemeToggle() {
    const btn = document.getElementById('btnToggleThemeModeAdmin');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof toggleWingsThemeMode === 'function') {
            const nextMode = toggleWingsThemeMode();
            applyWingsThemeUIAdmin(nextMode);
            refreshAdminDashboard();
        }
    });
}

// ==========================================================================
// 1. ADMIN & COUNSELOR AUTHENTICATION & RBAC HELPER
// ==========================================================================
function getAdminRoleDisplayName() {
    const mode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
    return (mode === 'nursery') ? 'Kiểm Lâm' : 'Quản trị viên';
}
window.getAdminRoleDisplayName = getAdminRoleDisplayName;

function getActiveAdminRole() {
    // 1. Kiểm tra session giả lập hoặc chọn góc nhìn xem trước (Kiểm Lâm vs Bà Tiên Xanh)
    const explicitRole = sessionStorage.getItem('wings_admin_active_role');
    if (explicitRole === 'counselor' || explicitRole === 'admin') {
        return explicitRole;
    }
    // 2. Kiểm tra tài khoản người dùng hiện tại
    const cur = (typeof DataManager !== 'undefined' && DataManager.getCurrentUser) ? DataManager.getCurrentUser() : null;
    if (cur) {
        if (cur.systemRole === 'counselor' || (cur.role && cur.role.toLowerCase().includes('chuyên viên'))) {
            return 'counselor';
        }
        if (cur.systemRole === 'admin' || cur.isAdmin) {
            return 'admin';
        }
    }
    // 3. Kiểm tra PIN Admin đã xác thực
    if (sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true') {
        return 'admin';
    }
    return 'collaborator';
}
window.getActiveAdminRole = getActiveAdminRole;

function canCurrentRolePerform(permKey) {
    const role = getActiveAdminRole();
    if (role === 'admin') return true;
    if (role === 'counselor') {
        return DataManager.hasPermission('counselor', permKey);
    }
    if (role === 'collaborator') {
        return DataManager.hasPermission('collaborator', permKey);
    }
    return false;
}
window.canCurrentRolePerform = canCurrentRolePerform;

function setAdminRoleActive(targetRole) {
    if (targetRole !== 'admin' && targetRole !== 'counselor') targetRole = 'admin';
    sessionStorage.setItem('wings_admin_active_role', targetRole);
    
    updateRolePreviewButton();
    applyRoleTabPermissions();
    refreshAdminDashboard();
    
    const msg = (targetRole === 'counselor') 
        ? '🧚 Đã chuyển sang giao diện [Bà Tiên Xanh] (Đã ẩn Bảng thưởng khóa học, Cấu hình game và Phân quyền kiểm lâm)!'
        : '🌲 Đã chuyển sang giao diện [Kiểm Lâm] (Đầy đủ 4 tab cài đặt và toàn quyền quản trị)!';
    if (typeof showToast === 'function') {
        showToast(msg, 'info');
    }
}
window.setAdminRoleActive = setAdminRoleActive;

function toggleAdminRolePreview() {
    const curRole = getActiveAdminRole();
    const newRole = (curRole === 'admin') ? 'counselor' : 'admin';
    setAdminRoleActive(newRole);
}
window.toggleAdminRolePreview = toggleAdminRolePreview;

function updateRolePreviewButton() {
    const curRole = getActiveAdminRole();
    const btnAdmin = document.getElementById('roleSwitchBtn_admin');
    const btnCounselor = document.getElementById('roleSwitchBtn_counselor');

    if (btnAdmin && btnCounselor) {
        if (curRole === 'counselor') {
            btnAdmin.className = 'px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-slate-400 hover:text-yellow-300 border border-transparent font-medium text-[10px] sm:text-[11px] shrink-0';
            btnCounselor.className = 'px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer bg-purple-500/30 text-purple-300 border border-purple-500/50 shadow font-extrabold text-[10px] sm:text-[11px] shrink-0';
        } else {
            btnAdmin.className = 'px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer bg-amber-500/30 text-yellow-300 border border-amber-500/50 shadow font-extrabold text-[10px] sm:text-[11px] shrink-0';
            btnCounselor.className = 'px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-slate-400 hover:text-purple-300 border border-transparent font-medium text-[10px] sm:text-[11px] shrink-0';
        }
    }

    const legacyBtn = document.getElementById('btnSwitchRoleView');
    const iconEl = document.getElementById('roleViewIcon');
    const labelEl = document.getElementById('roleViewLabel');
    if (legacyBtn) {
        if (curRole === 'counselor') {
            legacyBtn.className = 'px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer bg-purple-950/60 hover:bg-purple-900/60 border-purple-500/50 text-purple-300';
            if (iconEl) iconEl.textContent = '🧚';
            if (labelEl) labelEl.textContent = 'Đang xem: Bà Tiên Xanh';
        } else {
            legacyBtn.className = 'px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-yellow-300';
            if (iconEl) iconEl.textContent = '🌲';
            if (labelEl) labelEl.textContent = 'Đang xem: Kiểm Lâm';
        }
    }
}
window.updateRolePreviewButton = updateRolePreviewButton;

function initAdminAuth() {
    const authBtn = document.getElementById('btnOpenAdminAuth');
    const authModal = document.getElementById('adminAuthModal');
    const authForm = document.getElementById('adminAuthForm');
    const pinInput = document.getElementById('adminPinInput');
    const authError = document.getElementById('adminAuthError');
    const adminPanel = document.getElementById('adminDashboardSection');
    const logoutBtn = document.getElementById('btnAdminLogout');

    const isAdminPage = window.location.pathname.endsWith('admin.html') || window.location.pathname.includes('admin.html');
    const role = getActiveAdminRole();
    const isAuthed = (role === 'admin' || role === 'counselor');

    if (isAdminPage) {
        if (!isAuthed) {
            if (authModal) {
                authModal.classList.remove('hidden');
                authModal.classList.add('flex');
                if (pinInput) {
                    pinInput.value = '';
                    setTimeout(() => pinInput.focus(), 150);
                }
            }
        } else {
            applyRoleTabPermissions();
            refreshAdminDashboard();
        }
    } else {
        // Trên trang index.html: người dùng ấn nút Quản Trị -> sang thẳng admin.html (Hình 3)
        // Không hiển thị màn hình trung gian Hình 2
        if (authBtn) {
            authBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'admin.html';
            });
        }
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputVal = pinInput ? pinInput.value.trim() : '';

            // 1. Mã PIN Admin (12345678 hoặc 123456)
            if (inputVal === '12345678' || inputVal === ADMIN_DEFAULT_PIN || inputVal === '123456') {
                sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
                sessionStorage.setItem('wings_admin_active_role', 'admin');
                if (authModal) {
                    authModal.classList.add('hidden');
                    authModal.classList.remove('flex');
                    if (authError) authError.classList.add('hidden');
                }
                if (isAdminPage) {
                    applyRoleTabPermissions();
                    refreshAdminDashboard();
                } else {
                    // Trực tiếp sang admin.html (Hình 3)
                    window.location.href = 'admin.html';
                }
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
                sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
                sessionStorage.setItem('wings_admin_active_role', 'counselor');
                if (authModal) {
                    authModal.classList.add('hidden');
                    authModal.classList.remove('flex');
                    if (authError) authError.classList.add('hidden');
                }
                if (isAdminPage) {
                    applyRoleTabPermissions();
                    refreshAdminDashboard();
                } else {
                    // Trực tiếp sang admin.html (Hình 3)
                    window.location.href = 'admin.html';
                }
                if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
                return;
            }

            if (authError) {
                authError.textContent = `Mật khẩu sai! ${getAdminRoleDisplayName()} nhập 12345678 hoặc Chuyên viên nhập SĐT/Mật khẩu.`;
                authError.classList.remove('hidden');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
            sessionStorage.removeItem('wings_admin_active_role');
            if (isAdminPage) {
                window.location.href = 'index.html';
            } else {
                if (typeof window.navigateToScreen === 'function') {
                    window.navigateToScreen('screen-search-dashboard');
                }
                if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
            }
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
    const isAdminPage = window.location.pathname.endsWith('admin.html') || window.location.pathname.includes('admin.html');
    if (!isAdminPage) {
        window.location.href = 'admin.html';
        return;
    }
    const adminPanel = document.getElementById('adminDashboardSection');
    const screenAdmin = document.getElementById('screen-admin');
    if (screenAdmin) screenAdmin.classList.remove('hidden');
    if (adminPanel) adminPanel.classList.remove('hidden');
    applyRoleTabPermissions();
    try {
        refreshAdminDashboard();
    } catch (err) {
        console.error('Lỗi làm mới admin dashboard:', err);
    }
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
}
window.showAdminPanel = showAdminPanel;

// Áp dụng quyền hạn ẩn/hiện các tab theo cấp bậc (Admin vs Bà Tiên Xanh)
let isApplyingPermissions = false;

function applyRoleTabPermissions() {
    if (isApplyingPermissions) return;
    isApplyingPermissions = true;
    try {
        const role = getActiveAdminRole();
        const isFullAdmin = (role === 'admin');

        const canCourses = isFullAdmin || DataManager.hasPermission('counselor', 'config_courses');
        const canGame = isFullAdmin || DataManager.hasPermission('counselor', 'config_game');
        const canMembers = isFullAdmin || DataManager.hasPermission('counselor', 'approve_members');
        const canGameRegs = isFullAdmin || DataManager.hasPermission('counselor', 'approve_game_regs');
        const canPosts = isFullAdmin || DataManager.hasPermission('counselor', 'approve_posts');
        const canLeads = isFullAdmin || DataManager.hasPermission('counselor', 'approve_leads');

        // 1. Phân quyền hiển thị các nút trên Thanh Bar bên dưới
        // Cài Đặt (Screen 11 / Set up)
        const btnSetupBottom = document.getElementById('adminNavBtn_setup');
        const canSetup = (canCourses || canGame || canMembers || isFullAdmin);
        if (btnSetupBottom) btnSetupBottom.classList.toggle('hidden', !canSetup);

        // Gieo Hạt (Screen 7)
        const btnLeadsBottom = document.getElementById('adminNavBtn_leads');
        if (btnLeadsBottom) btnLeadsBottom.classList.toggle('hidden', !canLeads);

        // Mini Game (Screen 8)
        const btnMinigameBottom = document.getElementById('adminNavBtn_minigame');
        const canMiniGame = (canGameRegs || canPosts || isFullAdmin);
        if (btnMinigameBottom) btnMinigameBottom.classList.toggle('hidden', !canMiniGame);

        // 2. Sub-tab phân quyền trong Mini game
        // Ẩn/hiện động theo đúng dấu tick trên ma trận phân quyền:
        // - Có tick -> Hiện cả tab và nội dung
        // - Không tick -> Ẩn cả tab và nội dung
        const btnGameRegsSub = document.getElementById('btnSubTab_game_regs');
        const contentGameRegs = document.getElementById('minigameSubContent_game_regs');
        if (btnGameRegsSub) btnGameRegsSub.classList.toggle('hidden', !canGameRegs);
        if (contentGameRegs && !canGameRegs) contentGameRegs.classList.add('hidden');

        const btnBananaPostsSub = document.getElementById('btnSubTab_banana_posts');
        const contentBananaPosts = document.getElementById('minigameSubContent_banana_posts');
        if (btnBananaPostsSub) btnBananaPostsSub.classList.toggle('hidden', !canPosts);
        if (contentBananaPosts && !canPosts) contentBananaPosts.classList.add('hidden');

        // Tự động kích hoạt sub-tab hợp lệ trong Mini Game nếu sub-tab hiện tại bị ẩn
        const activeMinigameBtn = document.querySelector('#tabContent_minigame button.filter-btn-active');
        const currentMinigameSub = activeMinigameBtn ? activeMinigameBtn.id.replace('btnSubTab_', '') : null;
        const isCurrentMinigameAllowed = (currentMinigameSub === 'game_regs' && canGameRegs) ||
                                         (currentMinigameSub === 'banana_posts' && canPosts);

        if (!isCurrentMinigameAllowed) {
            if (canGameRegs) {
                switchAdminMinigameSubTab('game_regs');
            } else if (canPosts) {
                switchAdminMinigameSubTab('banana_posts');
            }
        }

        // 3. Sub-tab phân quyền trong Set up
        // QUY TẮC: Ẩn/hiện động theo đúng dấu tick trên ma trận phân quyền:
        // - Có tick -> Hiện cả tab và nội dung
        // - Không tick -> Ẩn cả tab và nội dung
        // - Riêng "Phân Quyền Kiểm Lâm": CHỈ DÀNH RIÊNG CHO ADMIN (luôn ẩn hoàn toàn đối với Bà Tiên Xanh)
        const showPermTab = isFullAdmin;
        const showCoursesTab = canCourses;
        const showConfigTab = canGame;
        const showUsersTab = canMembers;

        const btnPermSub = document.getElementById('btnSetupSubTab_permissions');
        const contentPerm = document.getElementById('setupSubContent_permissions');
        if (btnPermSub) btnPermSub.classList.toggle('hidden', !showPermTab);
        if (contentPerm && !showPermTab) contentPerm.classList.add('hidden');

        const btnCoursesSub = document.getElementById('btnSetupSubTab_courses');
        const contentCourses = document.getElementById('setupSubContent_courses');
        if (btnCoursesSub) btnCoursesSub.classList.toggle('hidden', !showCoursesTab);
        if (contentCourses && !showCoursesTab) contentCourses.classList.add('hidden');

        const btnConfigSub = document.getElementById('btnSetupSubTab_banana_config');
        const contentConfig = document.getElementById('setupSubContent_banana_config');
        if (btnConfigSub) btnConfigSub.classList.toggle('hidden', !showConfigTab);
        if (contentConfig && !showConfigTab) contentConfig.classList.add('hidden');

        const btnUsersSub = document.getElementById('btnSetupSubTab_users');
        const contentUsers = document.getElementById('setupSubContent_users');
        if (btnUsersSub) btnUsersSub.classList.toggle('hidden', !showUsersTab);
        if (contentUsers && !showUsersTab) contentUsers.classList.add('hidden');

        // Tự động kích hoạt sub-tab hợp lệ trong Set up nếu sub-tab hiện tại bị ẩn
        const activeSetupBtn = document.querySelector('#tabContent_setup button.filter-btn-active');
        const currentSetupSub = activeSetupBtn ? activeSetupBtn.id.replace('btnSetupSubTab_', '') : null;
        const isCurrentSetupAllowed = (currentSetupSub === 'courses' && showCoursesTab) ||
                                      (currentSetupSub === 'banana_config' && showConfigTab) ||
                                      (currentSetupSub === 'permissions' && showPermTab) ||
                                      (currentSetupSub === 'users' && showUsersTab);

        if (!isCurrentSetupAllowed) {
            if (showCoursesTab) switchAdminSetupSubTab('courses');
            else if (showConfigTab) switchAdminSetupSubTab('banana_config');
            else if (showPermTab) switchAdminSetupSubTab('permissions');
            else if (showUsersTab) switchAdminSetupSubTab('users');
        }

        // 4. Các nút tab cũ nếu còn xuất hiện
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            const tabKey = btn.getAttribute('data-tab');
            const allowed = (tabKey === 'leads' ? canLeads :
                             tabKey === 'leaderboard' ? true :
                             tabKey === 'users' ? canMembers :
                             tabKey === 'game_regs' ? canGameRegs :
                             tabKey === 'banana_posts' ? canPosts :
                             tabKey === 'courses' ? canCourses :
                             tabKey === 'banana_config' ? canGame :
                             tabKey === 'permissions' ? isFullAdmin : true);
            btn.classList.toggle('hidden', !allowed);
        });

        // 5. Cập nhật nhãn phân quyền Admin Panel header và Card hồ sơ
        const themeMode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
        const isNursery = (themeMode === 'nursery');

        const topHeaderBadge = document.getElementById('adminHeaderBadge');
        const topHeaderSub = document.getElementById('adminHeaderSub');
        if (topHeaderBadge) {
            if (isFullAdmin) {
                topHeaderBadge.textContent = isNursery ? '🌲 KIỂM LÂM WINGS' : '👑 QUẢN TRỊ VIÊN WINGS';
                topHeaderBadge.className = 'px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-extrabold uppercase bg-amber-500/20 text-yellow-300 border border-amber-500/40 whitespace-nowrap shrink-0';
            } else {
                topHeaderBadge.textContent = '🧚 BÀ TIÊN XANH';
                topHeaderBadge.className = 'px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 whitespace-nowrap shrink-0';
            }
        }
        if (topHeaderSub) {
            if (isFullAdmin) {
                topHeaderSub.textContent = isNursery
                    ? 'Hệ Thống Kiểm Lâm & Báo Cáo Vun Trồng Vườn Ươm Wings'
                    : 'Hệ Thống Quản Trị Viên & Báo Cáo Tuyển Sinh';
            } else {
                topHeaderSub.textContent = 'Hệ Thống Bà Tiên Xanh & Báo Cáo Vun Trồng Vườn Ươm Wings';
            }
        }

        const subTitleHeader = document.querySelector('#adminDashboardSection span.text-purple-400, #adminDashboardSection span.text-red-400, #adminDashboardSection span.text-emerald-400, #adminPanelBadge');
        const profileEl = document.getElementById('adminProfileName');

        if (subTitleHeader) {
            if (isFullAdmin) {
                subTitleHeader.textContent = isNursery ? '🌲 KIỂM LÂM (VƯỜN ƯƠM WINGS)' : '👑 QUẢN TRỊ VIÊN (ADMIN)';
                subTitleHeader.className = isNursery
                    ? 'text-[10px] font-black text-emerald-400 uppercase tracking-wider block'
                    : 'text-[10px] font-black text-red-400 uppercase tracking-wider block';
            } else {
                subTitleHeader.textContent = '🧚 BÀ TIÊN XANH (CHĂM SÓC & VUN TRỒNG)';
                subTitleHeader.className = 'text-[10px] font-black text-purple-400 uppercase tracking-wider block';
            }
        }

        if (profileEl) {
            if (isFullAdmin) {
                profileEl.textContent = isNursery ? 'Kiểm Lâm Vườn Ươm Wings' : 'Quản Trị Viên (Admin)';
            } else {
                profileEl.textContent = 'Bà Tiên Xanh 🧚';
            }
        }

        // Cập nhật trạng thái hiển thị của nút đổi góc nhìn xem trước
        updateRolePreviewButton();

        // Kích hoạt tab hợp lệ nếu tab hiện tại bị khóa
        if (typeof switchAdminMainTab === 'function') {
            if (currentAdminMainTab === 'setup' && !canSetup) {
                if (canLeads) switchAdminMainTab('leads');
                else if (canMiniGame) switchAdminMainTab('minigame');
                else switchAdminMainTab('leaderboard');
            } else if (currentAdminMainTab === 'leads' && !canLeads) {
                if (canSetup) switchAdminMainTab('setup');
                else if (canMiniGame) switchAdminMainTab('minigame');
                else switchAdminMainTab('leaderboard');
            } else if (currentAdminMainTab === 'minigame' && !canMiniGame) {
                if (canSetup) switchAdminMainTab('setup');
                else if (canLeads) switchAdminMainTab('leads');
                else switchAdminMainTab('leaderboard');
            }
        }
    } finally {
        isApplyingPermissions = false;
    }
}
window.applyRoleTabPermissions = applyRoleTabPermissions;

// ==========================================================================
// 1.1. DASHBOARD TIME FILTER, PERIOD SHIFT & CONSULTANT FILTER
// ==========================================================================
function updateDashboardPeriodLabel() {
    const labelEl = document.getElementById('dashboardPeriodLabel');
    const badgeData = document.getElementById('adminLbDataPeriodBadge');
    const badgeBanana = document.getElementById('adminLbBananaPeriodBadge');

    const d = currentDashboardDate || new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const y = d.getFullYear();
    const day = String(d.getDate()).padStart(2, '0');

    let text = `${m}/${y}`;
    if (currentDashboardTimeFilter === 'day') {
        text = `${day}/${m}/${y}`;
    } else if (currentDashboardTimeFilter === 'week') {
        const startOfWeek = new Date(d);
        const dayOfWeek = (d.getDay() + 6) % 7;
        startOfWeek.setDate(d.getDate() - dayOfWeek);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const sD = String(startOfWeek.getDate()).padStart(2, '0');
        const eD = String(endOfWeek.getDate()).padStart(2, '0');
        text = `${sD}-${eD}/${m}/${y}`;
    }

    if (labelEl) labelEl.textContent = text;
    if (badgeData) badgeData.textContent = text;
    if (badgeBanana) badgeBanana.textContent = text;
}
window.updateDashboardPeriodLabel = updateDashboardPeriodLabel;

function setDashboardTimeFilter(mode) {
    currentDashboardTimeFilter = mode;
    ['btnFilterMonth', 'btnFilterWeek', 'btnFilterDay'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const match = (mode === 'month' && id === 'btnFilterMonth') ||
                      (mode === 'week' && id === 'btnFilterWeek') ||
                      (mode === 'day' && id === 'btnFilterDay');
        if (match) {
            btn.className = 'px-3 py-1.5 rounded-lg filter-btn-active transition-all flex items-center gap-1';
        } else {
            btn.className = 'px-3 py-1.5 rounded-lg filter-btn-inactive transition-all flex items-center gap-1';
        }
    });
    updateDashboardPeriodLabel();
    refreshAdminDashboard();
}
window.setDashboardTimeFilter = setDashboardTimeFilter;

function shiftDashboardPeriod(direction) {
    if (!currentDashboardDate) currentDashboardDate = new Date();
    const d = new Date(currentDashboardDate);
    if (currentDashboardTimeFilter === 'day') {
        d.setDate(d.getDate() + direction);
    } else if (currentDashboardTimeFilter === 'week') {
        d.setDate(d.getDate() + direction * 7);
    } else {
        d.setMonth(d.getMonth() + direction);
    }
    currentDashboardDate = d;
    updateDashboardPeriodLabel();
    refreshAdminDashboard();
}
window.shiftDashboardPeriod = shiftDashboardPeriod;

function setConsultantFilter(type) {
    currentConsultantFilter = type;
    ['btnConsAll', 'btnConsOnline', 'btnConsClient'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const match = (type === 'ALL' && id === 'btnConsAll') ||
                      (type === 'ONLINE' && id === 'btnConsOnline') ||
                      (type === 'CLIENT' && id === 'btnConsClient');
        if (match) {
            btn.className = 'px-2.5 py-1.5 rounded-lg filter-btn-active text-[11px]';
        } else {
            btn.className = 'px-2.5 py-1.5 rounded-lg filter-btn-inactive text-[11px]';
        }
    });
    refreshAdminDashboard();
}
window.setConsultantFilter = setConsultantFilter;

function switchAdminLeaderboardCategory(cat) {
    currentAdminLbCategory = cat;
    const btnData = document.getElementById('btnAdminLbData');
    const btnBanana = document.getElementById('btnAdminLbBanana');
    const viewData = document.getElementById('adminLbView_data');
    const viewBanana = document.getElementById('adminLbView_banana');

    if (cat === 'data') {
        if (btnData) btnData.className = 'px-3 py-1.5 rounded-lg filter-btn-active font-bold';
        if (btnBanana) btnBanana.className = 'px-3 py-1.5 rounded-lg filter-btn-inactive font-bold';
        if (viewData) viewData.classList.remove('hidden');
        if (viewBanana) viewBanana.classList.add('hidden');
    } else {
        if (btnData) btnData.className = 'px-3 py-1.5 rounded-lg filter-btn-inactive font-bold';
        if (btnBanana) btnBanana.className = 'px-3 py-1.5 rounded-lg filter-btn-active font-bold';
        if (viewData) viewData.classList.add('hidden');
        if (viewBanana) viewBanana.classList.remove('hidden');
    }
    renderAdminLeaderboard();
}
window.switchAdminLeaderboardCategory = switchAdminLeaderboardCategory;

function renderAdminLeaderboard() {
    const dataBody = document.getElementById('adminLbDataTableBody');
    const bananaBody = document.getElementById('adminLbBananaTableBody');
    const themeMode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
    const isNursery = (themeMode === 'nursery');
    const leaderboard = DataManager.getLeaderboard(currentDashboardTimeFilter, currentDashboardDate);

    if (dataBody) {
        if (leaderboard.dataLeaderboard.length === 0) {
            dataBody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">${isNursery ? 'Không có dữ liệu gieo hạt trong kỳ này' : 'Không có dữ liệu giới thiệu trong kỳ này'}</td></tr>`;
        } else {
            let html = '';
            leaderboard.dataLeaderboard.forEach(item => {
                let medal = `<span class="font-mono font-bold text-slate-400">#${item.rank}</span>`;
                if (item.rank === 1) medal = `<span class="text-base" title="Quán quân Top 1">🥇</span>`;
                else if (item.rank === 2) medal = `<span class="text-base" title="Á quân Top 2">🥈</span>`;
                else if (item.rank === 3) medal = `<span class="text-base" title="Hạng 3">🥉</span>`;

                let displayRole = item.role || '';
                if (isNursery && (displayRole.toLowerCase().includes('cộng tác viên') || displayRole.toLowerCase().includes('ctv'))) {
                    displayRole = '🌱 Người gieo hạt';
                }

                html += `
                    <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                        <td class="py-2.5 px-3 text-center font-bold">${medal}</td>
                        <td class="py-2.5 px-3">
                            <div class="font-bold text-white text-xs">${item.name}</div>
                            <div class="text-[11px] text-slate-400 font-mono">${item.phone || '--'} • <span class="text-amber-400/80">${displayRole}</span></div>
                        </td>
                        <td class="py-2.5 px-3 text-center font-bold text-white font-mono text-sm">${item.totalLeads}</td>
                        <td class="py-2.5 px-3 text-center font-bold text-purple-300 font-mono">${item.checkinLeads}</td>
                        <td class="py-2.5 px-3 text-center font-bold text-cyan-300 font-mono">${item.trainingLeads}</td>
                        <td class="py-2.5 px-3 text-center font-bold text-emerald-400 font-mono">${item.wonLeads}</td>
                        <td class="py-2.5 px-3 text-right font-extrabold text-yellow-300 font-mono text-sm">
                            ${DataManager.formatCurrency(item.totalReward)}
                        </td>
                    </tr>
                `;
            });
            dataBody.innerHTML = html;
        }
    }

    if (bananaBody) {
        if (leaderboard.bananaLeaderboard.length === 0) {
            bananaBody.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-slate-400">Không có hoạt động mini game trong kỳ này</td></tr>`;
        } else {
            let html = '';
            leaderboard.bananaLeaderboard.forEach(item => {
                let medal = `<span class="font-mono font-bold text-slate-400">#${item.rank}</span>`;
                if (item.rank === 1) medal = `<span class="text-base">🥇</span>`;
                else if (item.rank === 2) medal = `<span class="text-base">🥈</span>`;
                else if (item.rank === 3) medal = `<span class="text-base">🥉</span>`;

                html += `
                    <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                        <td class="py-2.5 px-3 text-center font-bold">${medal}</td>
                        <td class="py-2.5 px-3">
                            <div class="font-bold text-white text-xs">${item.name}</div>
                            <div class="text-[11px] text-slate-400 font-mono">${item.identifier}</div>
                        </td>
                        <td class="py-2.5 px-3 text-center font-bold text-white font-mono">${item.totalPosts}</td>
                        <td class="py-2.5 px-3 text-center font-bold text-emerald-400 font-mono">${item.approvedPosts}</td>
                        <td class="py-2.5 px-3 text-right font-extrabold text-yellow-300 font-mono text-sm">
                            ${item.totalBananas} 🍌
                        </td>
                    </tr>
                `;
            });
            bananaBody.innerHTML = html;
        }
    }
}
window.renderAdminLeaderboard = renderAdminLeaderboard;

// 1.2. LEAD 1-CLICK FUNNEL STATUS & NOTE EDITOR
function changeLeadFunnelStatus(leadId, newStatus) {
    const role = getActiveAdminRole();
    if (role !== 'admin' && !DataManager.hasPermission('counselor', 'approve_leads')) {
        alert('Tài khoản của bạn không có quyền cập nhật trạng thái Data tuyển sinh!');
        refreshAdminDashboard();
        return;
    }

    const leads = DataManager.getLeads();
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    if (role === 'counselor') {
        const currentLevel = DataManager.getFunnelLevel(lead.status);
        const targetLevel = DataManager.getFunnelLevel(newStatus);

        // Quy định: Bà tiên xanh không điều chuyển trạng thái dưới mục "tưới mát"
        // Chỉ có admin mới được chỉnh trạng thái ban đầu (DATA/NEW)
        if (newStatus === 'DATA' || newStatus === 'NEW') {
            alert(`Bà tiên xanh không được điều chuyển trạng thái về "Gieo hạt" (dưới mức Tưới Mát).\nChỉ có ${getAdminRoleDisplayName()} mới có quyền chỉnh trạng thái ban đầu!`);
            refreshAdminDashboard();
            return;
        }

        // Quy định: Bà tiên xanh chỉ có thể cập nhật tiến trình lên trên (không chuyển lùi và không hủy)
        if (targetLevel < currentLevel || newStatus === 'LOST' || newStatus === 'REJECTED') {
            alert('Bà tiên xanh chỉ có thể cập nhật tiến trình lên trên (từ Tưới Mát trở lên)!\nKhông được phép chuyển lùi trạng thái hoặc hủy hồ sơ.');
            refreshAdminDashboard();
            return;
        }
    }

    DataManager.updateLeadFunnelStatus(leadId, newStatus);
    refreshAdminDashboard();
    if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
}
window.changeLeadFunnelStatus = changeLeadFunnelStatus;

function promptEditLeadNote(leadId) {
    const leads = DataManager.getLeads();
    const l = leads.find(item => item.id === leadId);
    if (!l) return;
    const oldNote = l.adminNote || '';
    const newNote = prompt(`Cập nhật ghi chú tiến độ cho khách ${l.customerName}:`, oldNote);
    if (newNote !== null) {
        DataManager.updateLeadFunnelStatus(leadId, l.status, newNote);
        refreshAdminDashboard();
    }
}
window.promptEditLeadNote = promptEditLeadNote;

// 2. ADMIN TABS SWITCHER (5 MÀN HÌNH CHÍNH & THANH BAR BÊN DƯỚI)
let currentAdminMainTab = 'setup';

function switchAdminMainTab(tabId) {
    if (!tabId) tabId = 'setup';
    currentAdminMainTab = tabId;

    // 1. Cập nhật nút Thanh Bar bên dưới (Bottom Bar)
    document.querySelectorAll('.admin-bottom-item').forEach(btn => {
        if (btn.id === `adminNavBtn_${tabId}`) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 2. Ẩn / hiện 5 màn hình chính
    const mainTabs = ['setup', 'leads', 'minigame', 'leaderboard', 'kpi'];
    mainTabs.forEach(t => {
        const el = document.getElementById(`tabContent_${t}`);
        if (el) {
            if (t === tabId) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });

    // 3. Tự động chuyển sub-tab phù hợp theo phân quyền khi vào tab
    const role = getActiveAdminRole();
    const isFullAdmin = (role === 'admin');

    if (tabId === 'setup') {
        const canCourses = isFullAdmin || DataManager.hasPermission('counselor', 'config_courses');
        const canGame = isFullAdmin || DataManager.hasPermission('counselor', 'config_game');
        const canMembers = isFullAdmin || DataManager.hasPermission('counselor', 'approve_members');

        const activeSubBtn = document.querySelector('#tabContent_setup button.filter-btn-active');
        const currentSub = activeSubBtn ? activeSubBtn.id.replace('btnSetupSubTab_', '') : null;
        const isCurrentAllowed = (currentSub === 'courses' && canCourses) ||
                                 (currentSub === 'banana_config' && canGame) ||
                                 (currentSub === 'permissions' && isFullAdmin) ||
                                 (currentSub === 'users' && canMembers);

        if (isCurrentAllowed) {
            switchAdminSetupSubTab(currentSub);
        } else {
            if (canCourses) switchAdminSetupSubTab('courses');
            else if (canGame) switchAdminSetupSubTab('banana_config');
            else if (isFullAdmin) switchAdminSetupSubTab('permissions');
            else if (canMembers) switchAdminSetupSubTab('users');
            else switchAdminSetupSubTab('courses');
        }
    } else if (tabId === 'minigame') {
        const canGameRegs = isFullAdmin || DataManager.hasPermission('counselor', 'approve_game_regs');
        const canPosts = isFullAdmin || DataManager.hasPermission('counselor', 'approve_posts');

        const activeSubBtn = document.querySelector('#tabContent_minigame button.filter-btn-active');
        const currentSub = activeSubBtn ? activeSubBtn.id.replace('btnSubTab_', '') : null;
        const isCurrentAllowed = (currentSub === 'game_regs' && canGameRegs) ||
                                 (currentSub === 'banana_posts' && canPosts);

        if (isCurrentAllowed) {
            switchAdminMinigameSubTab(currentSub);
        } else {
            if (canGameRegs) switchAdminMinigameSubTab('game_regs');
            else if (canPosts) switchAdminMinigameSubTab('banana_posts');
            else switchAdminMinigameSubTab('banana_posts');
        }
    }

    // 4. Kích hoạt render dữ liệu tương ứng
    try {
        if (tabId === 'leads') {
            renderLeadsTable();
            renderReferrerSummaryTable();
        } else if (tabId === 'minigame') {
            renderGameRegistrationsTable();
            renderBananaPostsTable();
        } else if (tabId === 'leaderboard') {
            renderAdminLeaderboard();
        } else if (tabId === 'kpi') {
            refreshAdminDashboard();
        } else if (tabId === 'setup') {
            renderAdminCoursesTable();
            loadBananaConfigForm();
            if (isFullAdmin) renderPermissionsMatrixTable();
            renderUsersTable();
        }
    } catch (err) {
        console.error(`Lỗi render tab admin ${tabId}:`, err);
    }

    // Cuộn nhẹ lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.switchAdminMainTab = switchAdminMainTab;

// CHUYỂN SUB-TAB TRONG MINI GAME (DUYỆT ẢNH CHUỐI VS DUYỆT LINK BÀI)
function switchAdminMinigameSubTab(subTab) {
    const role = getActiveAdminRole();
    const isFullAdmin = (role === 'admin');
    const canGameRegs = isFullAdmin || DataManager.hasPermission('counselor', 'approve_game_regs');
    const canPosts = isFullAdmin || DataManager.hasPermission('counselor', 'approve_posts');

    // Chặn truy cập sub-tab bị khóa
    if (subTab === 'game_regs' && !canGameRegs) {
        subTab = 'banana_posts';
    } else if (subTab === 'banana_posts' && !canPosts) {
        subTab = 'game_regs';
    }

    const isGameRegs = (subTab === 'game_regs');
    const btnRegs = document.getElementById('btnSubTab_game_regs');
    const btnPosts = document.getElementById('btnSubTab_banana_posts');
    const contentRegs = document.getElementById('minigameSubContent_game_regs');
    const contentPosts = document.getElementById('minigameSubContent_banana_posts');

    if (btnRegs) {
        btnRegs.classList.toggle('filter-btn-active', isGameRegs && canGameRegs);
        btnRegs.classList.toggle('filter-btn-inactive', !isGameRegs && canGameRegs);
        btnRegs.classList.toggle('hidden', !canGameRegs);
    }
    if (btnPosts) {
        btnPosts.classList.toggle('filter-btn-active', !isGameRegs && canPosts);
        btnPosts.classList.toggle('filter-btn-inactive', isGameRegs && canPosts);
        btnPosts.classList.toggle('hidden', !canPosts);
    }
    if (contentRegs) contentRegs.classList.toggle('hidden', !isGameRegs || !canGameRegs);
    if (contentPosts) contentPosts.classList.toggle('hidden', isGameRegs || !canPosts);

    if (isGameRegs && canGameRegs) renderGameRegistrationsTable();
    else if (!isGameRegs && canPosts) renderBananaPostsTable();
}
window.switchAdminMinigameSubTab = switchAdminMinigameSubTab;

// CHUYỂN SUB-TAB TRONG SET UP (BẢNG THƯỞNG, CẤU HÌNH GAME, PHÂN QUYỀN, DUYỆT THÀNH VIÊN)
function switchAdminSetupSubTab(subTab) {
    const role = getActiveAdminRole();
    const isFullAdmin = (role === 'admin');
    const canCourses = isFullAdmin || DataManager.hasPermission('counselor', 'config_courses');
    const canGame = isFullAdmin || DataManager.hasPermission('counselor', 'config_game');
    const canMembers = isFullAdmin || DataManager.hasPermission('counselor', 'approve_members');

    // QUY TẮC: Ẩn/hiện động theo đúng dấu tick trên ma trận phân quyền
    const showCoursesTab = canCourses;
    const showConfigTab = canGame;
    const showPermTab = isFullAdmin; // Phân quyền kiểm lâm chỉ dành riêng cho Admin
    const showUsersTab = canMembers;

    // Kiểm tra xem subTab yêu cầu có được phép không, nếu không thì tự chuyển sang tab được phép đầu tiên
    const isRequestedAllowed = (subTab === 'courses' && showCoursesTab) ||
                               (subTab === 'banana_config' && showConfigTab) ||
                               (subTab === 'permissions' && showPermTab) ||
                               (subTab === 'users' && showUsersTab);

    if (!isRequestedAllowed) {
        if (showCoursesTab) subTab = 'courses';
        else if (showConfigTab) subTab = 'banana_config';
        else if (showPermTab) subTab = 'permissions';
        else if (showUsersTab) subTab = 'users';
        else subTab = null;
    }

    const subTabs = ['courses', 'banana_config', 'permissions', 'users'];
    subTabs.forEach(t => {
        const btn = document.getElementById(`btnSetupSubTab_${t}`);
        const content = document.getElementById(`setupSubContent_${t}`);
        const isCurrent = (t === subTab);
        const isAllowed = (t === 'permissions' ? showPermTab :
                           t === 'courses' ? showCoursesTab :
                           t === 'banana_config' ? showConfigTab :
                           t === 'users' ? showUsersTab : false);

        if (btn) {
            btn.classList.toggle('filter-btn-active', isCurrent && isAllowed);
            btn.classList.toggle('filter-btn-inactive', !isCurrent && isAllowed);
            btn.classList.toggle('hidden', !isAllowed);
        }
        if (content) {
            content.classList.toggle('hidden', !isCurrent || !isAllowed);
        }
    });

    if (subTab === 'courses' && showCoursesTab) renderAdminCoursesTable();
    else if (subTab === 'banana_config' && showConfigTab) loadBananaConfigForm();
    else if (subTab === 'permissions' && showPermTab) renderPermissionsMatrixTable();
    else if (subTab === 'users' && showUsersTab) renderUsersTable();
}
window.switchAdminSetupSubTab = switchAdminSetupSubTab;

// ĐIỀU HƯỚNG TƯƠNG THÍCH NGƯỢC CHO CÁC LỜI GỌI CŨ
function switchAdminTab(targetTab) {
    if (!targetTab) targetTab = 'leads';
    currentAdminTab = targetTab;

    if (targetTab === 'leads') {
        switchAdminMainTab('leads');
    } else if (targetTab === 'minigame') {
        switchAdminMainTab('minigame');
    } else if (targetTab === 'game_regs') {
        switchAdminMainTab('minigame');
        switchAdminMinigameSubTab('game_regs');
    } else if (targetTab === 'banana_posts') {
        switchAdminMainTab('minigame');
        switchAdminMinigameSubTab('banana_posts');
    } else if (targetTab === 'leaderboard') {
        switchAdminMainTab('leaderboard');
    } else if (targetTab === 'kpi') {
        switchAdminMainTab('kpi');
    } else if (targetTab === 'setup' || targetTab === 'courses') {
        switchAdminMainTab('setup');
        switchAdminSetupSubTab('courses');
    } else if (targetTab === 'banana_config') {
        switchAdminMainTab('setup');
        switchAdminSetupSubTab('banana_config');
    } else if (targetTab === 'permissions') {
        switchAdminMainTab('setup');
        switchAdminSetupSubTab('permissions');
    } else if (targetTab === 'users') {
        switchAdminMainTab('setup');
        switchAdminSetupSubTab('users');
    } else {
        switchAdminMainTab('leads');
    }
}
window.switchAdminTab = switchAdminTab;

function initAdminTabs() {
    // Bottom tab items (Thanh Bar bên dưới)
    document.querySelectorAll('.admin-bottom-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.id.replace('adminNavBtn_', '');
            switchAdminMainTab(id);
        });
    });

    // Legacy tab buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchAdminTab(targetTab);
        });
    });
}

// 2.1. RENDER BẢNG PHÂN QUYỀN TRUY CẬP (CHECKBOX MATRIX 5+1 NHIỆM VỤ)
function renderPermissionsMatrixTable() {
    const tableBody = document.getElementById('adminPermissionsTableBody') || document.getElementById('permissionsMatrixTableBody');
    if (!tableBody) return;

    const matrix = DataManager.getRolePermissions();
    const permissions = SYSTEM_PERMISSIONS_LIST;
    const isFullAdmin = (getActiveAdminRole() === 'admin');
    const themeMode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
    const isNursery = (themeMode === 'nursery');

    let html = '';
    permissions.forEach((p, idx) => {
        const rowBg = idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/80';

        // Admin: luôn có quyền & disabled
        const adminChecked = 'checked disabled';

        // Counselor (Bà Tiên Xanh): từ matrix
        const counselorChecked = (matrix.counselor && matrix.counselor.permissions && matrix.counselor.permissions[p.key]) ? 'checked' : '';
        const counselorDisabled = isFullAdmin ? '' : 'disabled';

        // Collaborator (Người Gieo Hạt): từ matrix
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

                <!-- Cột 2: Kiểm Lâm / Quản trị viên (Toàn quyền) -->
                <td class="py-3 px-3 text-center bg-red-950/20 border-l border-amber-500/20">
                    <div class="inline-flex items-center justify-center">
                        <input type="checkbox" ${adminChecked} class="w-4 h-4 accent-red-500 rounded cursor-not-allowed" title="${isNursery ? 'Kiểm Lâm luôn có toàn quyền' : 'Quản trị viên luôn có toàn quyền'}">
                    </div>
                    <div class="text-[9px] text-emerald-400 font-bold mt-0.5">Toàn quyền</div>
                </td>

                <!-- Cột 3: Bà Tiên Xanh (CV Hướng Nghiệp) -->
                <td class="py-3 px-3 text-center bg-purple-950/20 border-l border-amber-500/20">
                    <label class="inline-flex flex-col items-center justify-center cursor-pointer p-1 rounded-lg hover:bg-purple-900/30 transition-all">
                        <input type="checkbox" id="perm_counselor_${p.key}" ${counselorChecked} ${counselorDisabled} 
                            onchange="onPermissionCheckboxChange('counselor', '${p.key}', this.checked)"
                            class="w-5 h-5 accent-purple-500 rounded cursor-pointer transition-transform hover:scale-110">
                        <span id="label_counselor_${p.key}" class="text-[9px] ${counselorChecked ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'} mt-1">
                            ${counselorChecked ? '✓ Cho phép' : '✕ Khóa'}
                        </span>
                    </label>
                </td>

                <!-- Cột 4: Người Gieo Hạt (Cộng Tác Viên) -->
                <td class="py-3 px-3 text-center bg-slate-900/40 border-l border-amber-500/20">
                    <label class="inline-flex flex-col items-center justify-center cursor-pointer p-1 rounded-lg hover:bg-slate-800/40 transition-all">
                        <input type="checkbox" id="perm_collaborator_${p.key}" ${collabChecked} ${collabDisabled} 
                            onchange="onPermissionCheckboxChange('collaborator', '${p.key}', this.checked)"
                            class="w-4 h-4 accent-blue-500 rounded cursor-pointer transition-transform hover:scale-110">
                        <span id="label_collaborator_${p.key}" class="text-[9px] ${collabChecked ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'} mt-1">
                            ${collabChecked ? '✓ Cho phép' : '✕ Khóa'}
                        </span>
                    </label>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

// Xử lý live khi click checkbox ma trận phân quyền
window.onPermissionCheckboxChange = function(roleKey, permKey, isChecked) {
    if (getActiveAdminRole() !== 'admin') {
        alert(`Chỉ ${getAdminRoleDisplayName()} mới có quyền điều chỉnh phân quyền!`);
        renderPermissionsMatrixTable();
        return;
    }

    const matrix = DataManager.getRolePermissions();
    if (matrix[roleKey] && matrix[roleKey].permissions) {
        matrix[roleKey].permissions[permKey] = Boolean(isChecked);
        DataManager.saveRolePermissions(matrix);
    }

    // Cập nhật nhãn trạng thái live
    const labelEl = document.getElementById(`label_${roleKey}_${permKey}`);
    if (labelEl) {
        labelEl.textContent = isChecked ? '✓ Cho phép' : '✕ Khóa';
        labelEl.className = `text-[9px] ${isChecked ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'} mt-1`;
    }

    applyRoleTabPermissions();

    const permObj = SYSTEM_PERMISSIONS_LIST.find(p => p.key === permKey);
    const permName = permObj ? permObj.name : permKey;
    const roleName = (roleKey === 'counselor') ? 'Bà Tiên Xanh' : 'Người Gieo Hạt';
    const actionText = isChecked ? 'MỞ QUYỀN' : 'KHÓA QUYỀN';

    if (typeof showToast === 'function') {
        showToast(`Đã ${isChecked ? 'mở' : 'khóa'} quyền "${permName}" cho ${roleName}!`, isChecked ? 'success' : 'info');
    }
};

window.savePermissionsMatrixFromUI = function(silent = false) {
    if (getActiveAdminRole() !== 'admin') {
        alert(`Chỉ ${getAdminRoleDisplayName()} mới có quyền lưu cấu hình bảng phân quyền!`);
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

    if (!silent) {
        if (typeof showToast === 'function') {
            showToast('Đã lưu cấu hình ma trận phân quyền hệ thống thành công!', 'success');
        } else {
            alert('Đã lưu cấu hình ma trận phân quyền hệ thống thành công!');
        }
    }
};

window.resetPermissionsMatrixToDefault = function() {
    if (getActiveAdminRole() !== 'admin') {
        alert(`Chỉ ${getAdminRoleDisplayName()} mới có quyền đặt lại phân quyền!`);
        return;
    }
    const adminLabel = getAdminRoleDisplayName();
    const isNursery = (typeof getWingsThemeMode === 'function') ? (getWingsThemeMode() === 'nursery') : true;
    const msg = isNursery 
        ? `Khôi phục phân quyền về mặc định:\n- ${adminLabel}: Toàn quyền Vườn Ươm\n- Bà Tiên Xanh: Duyệt bài link, ảnh chuối, người gieo hạt & hạt giống\n- Người Gieo Hạt: Không có quyền quản trị`
        : `Khôi phục phân quyền về mặc định:\n- ${adminLabel}: Toàn quyền hệ thống\n- Chuyên viên hướng nghiệp: Duyệt hồ sơ & chăm sóc data\n- Cộng tác viên: Không có quyền quản trị`;
    if (confirm(msg)) {
        DataManager.saveRolePermissions(JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS)));
        applyRoleTabPermissions();
        renderPermissionsMatrixTable();
        if (typeof showToast === 'function') {
            showToast('Đã khôi phục ma trận phân quyền về mặc định!', 'info');
        } else {
            alert('Đã khôi phục ma trận phân quyền về mặc định!');
        }
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

    const resetPwdForm = document.getElementById('adminResetPasswordForm');
    if (resetPwdForm) resetPwdForm.addEventListener('submit', handleAdminResetPasswordSubmit);

    const campSelect = document.getElementById('adminCampaignSelect');
    if (campSelect) {
        campSelect.addEventListener('change', (e) => {
            selectedAdminCampaignId = e.target.value;
            renderAdminCoursesTable();
        });
    }

    // Live bi-directional calculation khi nhập Tiền thưởng, % hoa hồng, hoặc học phí
    const tuitionEl = document.getElementById('courseInputTuition');
    if (tuitionEl) {
        tuitionEl.addEventListener('input', () => updateCourseRewardBiDirectional('tuition'));
    }

    const rewardSelfEl = document.getElementById('courseInputRewardSelf');
    if (rewardSelfEl) {
        rewardSelfEl.addEventListener('input', () => updateCourseRewardBiDirectional('self_money'));
    }

    const selfPercentEl = document.getElementById('courseInputSelfPercent');
    if (selfPercentEl) {
        selfPercentEl.addEventListener('input', () => updateCourseRewardBiDirectional('self_percent'));
    }

    const rewardPassEl = document.getElementById('courseInputRewardPass');
    if (rewardPassEl) {
        rewardPassEl.addEventListener('input', () => updateCourseRewardBiDirectional('pass_money'));
    }

    const acaPercentEl = document.getElementById('courseInputAcaPercent');
    if (acaPercentEl) {
        acaPercentEl.addEventListener('input', () => updateCourseRewardBiDirectional('pass_percent'));
    }

    // Live preview & upload ảnh bộ mi đại diện
    const courseImgInput = document.getElementById('courseInputImage');
    if (courseImgInput) {
        courseImgInput.addEventListener('input', (e) => updateCourseImagePreview(e.target.value));
        courseImgInput.addEventListener('change', (e) => updateCourseImagePreview(e.target.value));
    }
    const courseImgFileInput = document.getElementById('courseInputImageFile');
    if (courseImgFileInput) {
        courseImgFileInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let w = img.width;
                    let h = img.height;
                    const maxDim = 600;
                    if (w > maxDim || h > maxDim) {
                        if (w > h) {
                            h = Math.round((h * maxDim) / w);
                            w = maxDim;
                        } else {
                            w = Math.round((w * maxDim) / h);
                            h = maxDim;
                        }
                    }
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    const compressedData = canvas.toDataURL('image/jpeg', 0.85);
                    if (courseImgInput) courseImgInput.value = compressedData;
                    updateCourseImagePreview(compressedData);
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

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
    updateDashboardPeriodLabel();
    updateRolePreviewButton();
    applyRoleTabPermissions();

    // 1. Lấy dữ liệu Phễu Tuyển Sinh Lũy Tiến theo bộ lọc thời gian
    const funnelStats = DataManager.getFunnelStats(currentDashboardTimeFilter, currentDashboardDate);

    // Cập nhật 6 thẻ KPI Cards (Đúng mẫu ảnh media_1791450682289.png)
    const elData = document.getElementById('kpiFunnelData');
    const elCare = document.getElementById('kpiFunnelCare');
    const elRateCare = document.getElementById('kpiRateCare');
    const barCare = document.getElementById('barFunnelCare');

    const elCheckin = document.getElementById('kpiFunnelCheckin');
    const elRateCheckin = document.getElementById('kpiRateCheckin');
    const barCheckin = document.getElementById('barFunnelCheckin');

    const elTraining = document.getElementById('kpiFunnelTraining');
    const elRateTraining = document.getElementById('kpiRateTraining');
    const barTraining = document.getElementById('barFunnelTraining');

    const elWon = document.getElementById('kpiFunnelWon');
    const elRateWon = document.getElementById('kpiRateWon');
    const barWon = document.getElementById('barFunnelWon');

    const elTotalReward = document.getElementById('kpiTotalRewardLive');
    const elPaidReward = document.getElementById('kpiPaidRewardLive');

    if (elData) elData.textContent = funnelStats.dataCount;
    if (elCare) elCare.textContent = funnelStats.careCount;
    if (elRateCare) elRateCare.textContent = `${funnelStats.rateCare}%`;
    if (barCare) barCare.style.width = `${Math.min(100, funnelStats.rateCare)}%`;

    if (elCheckin) elCheckin.textContent = funnelStats.checkinCount;
    if (elRateCheckin) elRateCheckin.textContent = `${funnelStats.rateCheckin}%`;
    if (barCheckin) barCheckin.style.width = `${Math.min(100, funnelStats.rateCheckin)}%`;

    if (elTraining) elTraining.textContent = funnelStats.trainingCount;
    if (elRateTraining) elRateTraining.textContent = `${funnelStats.rateTraining}%`;
    if (barTraining) barTraining.style.width = `${Math.min(100, funnelStats.rateTraining)}%`;

    if (elWon) elWon.textContent = funnelStats.wonCount;
    if (elRateWon) elRateWon.textContent = `${funnelStats.rateWon}%`;
    if (barWon) barWon.style.width = `${Math.min(100, funnelStats.rateWon)}%`;

    if (elTotalReward) elTotalReward.textContent = DataManager.formatCurrency(funnelStats.totalReward);
    if (elPaidReward) elPaidReward.textContent = DataManager.formatCurrency(funnelStats.paidReward);

    // Cập nhật Visual Funnel Steps kết nối trực quan
    const fnData = document.getElementById('funnelText_data');
    const fnCare = document.getElementById('funnelText_care');
    const fnPctCare = document.getElementById('funnelPct_care');
    const fnCheckin = document.getElementById('funnelText_checkin');
    const fnPctCheckin = document.getElementById('funnelPct_checkin');
    const fnTraining = document.getElementById('funnelText_training');
    const fnPctTraining = document.getElementById('funnelPct_training');
    const fnWon = document.getElementById('funnelText_won');
    const fnPctWon = document.getElementById('funnelPct_won');

    if (fnData) fnData.textContent = funnelStats.dataCount;
    if (fnCare) fnCare.textContent = funnelStats.careCount;
    if (fnPctCare) fnPctCare.textContent = `${funnelStats.rateCare}%`;
    if (fnCheckin) fnCheckin.textContent = funnelStats.checkinCount;
    if (fnPctCheckin) fnPctCheckin.textContent = `${funnelStats.rateCheckin}%`;
    if (fnTraining) fnTraining.textContent = funnelStats.trainingCount;
    if (fnPctTraining) fnPctTraining.textContent = `${funnelStats.rateTraining}%`;
    if (fnWon) fnWon.textContent = funnelStats.wonCount;
    if (fnPctWon) fnPctWon.textContent = `${funnelStats.rateWon}%`;

    // Cập nhật các KPI cũ nếu còn xuất hiện
    const legacyTotal = document.getElementById('kpiTotalLeads');
    if (legacyTotal) legacyTotal.textContent = funnelStats.dataCount;
    const legacyWon = document.getElementById('kpiWonLeads');
    if (legacyWon) legacyWon.textContent = funnelStats.wonCount;
    const legacyConv = document.getElementById('kpiConversionRate');
    if (legacyConv) legacyConv.textContent = `${funnelStats.rateWon}%`;
    const legacyPending = document.getElementById('kpiPendingReward');
    if (legacyPending) legacyPending.textContent = DataManager.formatCurrency(funnelStats.pendingReward);
    const legacyPaid = document.getElementById('kpiPaidReward');
    if (legacyPaid) legacyPaid.textContent = DataManager.formatCurrency(funnelStats.paidReward);

    // Badges số lượng chờ duyệt trên Tabs
    const users = DataManager.getUsers();
    const gameRegs = DataManager.getGameRegistrations();
    const posts = DataManager.getBananaPosts();

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

    // Cập nhật badges cho thanh Bar bên dưới (Bottom Bar)
    const pendingMiniGameCount = pendingGameRegsCount + pendingPostsCount;
    const badgeBottomMini = document.getElementById('badgeBottomPendingMiniGame');
    if (badgeBottomMini) {
        badgeBottomMini.textContent = pendingMiniGameCount;
        badgeBottomMini.classList.toggle('hidden', pendingMiniGameCount === 0);
    }

    const badgeBottomSetup = document.getElementById('badgeBottomPendingSetup');
    if (badgeBottomSetup) {
        badgeBottomSetup.textContent = pendingUsersCount;
        badgeBottomSetup.classList.toggle('hidden', pendingUsersCount === 0);
    }

    const allLeads = DataManager.getLeads();
    populateReferrerFilter(allLeads);
    renderLeadsTable();
    renderReferrerSummaryTable();
    renderAdminLeaderboard();
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
// 5. TAB 2: DUYỆT ĐĂNG KÝ THÀNH VIÊN (SĐT / GMAIL) - TÌM KIẾM & LỌC & TRUY CẬP THÔNG TIN
// ==========================================================================

// Bộ điều khiển tìm kiếm & lọc thành viên
function onUserFilterChange() {
    renderUsersTable();
}
window.onUserFilterChange = onUserFilterChange;

function adminResetUserFilters() {
    const searchInput = document.getElementById('adminUserSearchInput');
    const roleFilter = document.getElementById('adminUserRoleFilter');
    const statusFilter = document.getElementById('adminUserStatusFilter');
    const gameFilter = document.getElementById('adminUserGameFilter');

    if (searchInput) searchInput.value = '';
    if (roleFilter) roleFilter.value = 'ALL';
    if (statusFilter) statusFilter.value = 'ALL';
    if (gameFilter) gameFilter.value = 'ALL';

    renderUsersTable();
}
window.adminResetUserFilters = adminResetUserFilters;

function renderUsersTable() {
    const tableBody = document.getElementById('adminUsersTableBody');
    if (!tableBody) return;

    const users = DataManager.getUsers();

    // 1. Đọc giá trị các bộ lọc
    const searchVal = (document.getElementById('adminUserSearchInput')?.value || '').trim().toLowerCase();
    const roleFilter = document.getElementById('adminUserRoleFilter')?.value || 'ALL';
    const statusFilter = document.getElementById('adminUserStatusFilter')?.value || 'ALL';
    const gameFilter = document.getElementById('adminUserGameFilter')?.value || 'ALL';

    // 2. Lọc danh sách thành viên
    const filteredUsers = users.filter(u => {
        // Tìm kiếm theo: Tên, SĐT/Gmail, Mã TV, STK ngân hàng
        if (searchVal) {
            const nameMatch = (u.name || '').toLowerCase().includes(searchVal);
            const idMatch = (u.id || '').toLowerCase().includes(searchVal);
            const identMatch = (u.identifier || '').toLowerCase().includes(searchVal);
            const bankMatch = (u.bankInfo || '').toLowerCase().includes(searchVal);
            if (!nameMatch && !idMatch && !identMatch && !bankMatch) return false;
        }

        const uSysRole = u.systemRole || (u.role && u.role.toLowerCase().includes('chuyên viên') ? 'counselor' : (u.isAdmin ? 'admin' : 'collaborator'));
        if (roleFilter !== 'ALL' && uSysRole !== roleFilter) return false;

        if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;

        if (gameFilter !== 'ALL') {
            const isGameApproved = Boolean(u.miniGameApproved);
            if (gameFilter === 'APPROVED' && !isGameApproved) return false;
            if (gameFilter === 'LOCKED' && isGameApproved) return false;
        }

        return true;
    });

    // Cập nhật badge số lượng hiển thị
    const countBadge = document.getElementById('userListCountBadge');
    if (countBadge) {
        countBadge.textContent = `Hiển thị: ${filteredUsers.length} / ${users.length} thành viên`;
    }

    if (filteredUsers.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" class="text-center py-8 text-slate-400">Không tìm thấy thành viên nào phù hợp với bộ lọc</td></tr>`;
        return;
    }

    let html = '';
    const currentAdminRole = getActiveAdminRole();
    const isFullAdmin = (currentAdminRole === 'admin');
    const isCounselor = (currentAdminRole === 'counselor');

    filteredUsers.forEach(u => {
        let statusBadge = '';
        if (u.status === 'APPROVED') {
            statusBadge = `<span class="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"><i class="fa-solid fa-check mr-1"></i>Đã duyệt</span>`;
        } else if (u.status === 'REJECTED') {
            statusBadge = `<span class="px-2 py-0.5 rounded text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold"><i class="fa-solid fa-ban mr-1"></i>Từ chối</span>`;
        } else {
            statusBadge = `<span class="px-2.5 py-1 rounded text-xs bg-amber-500/25 text-amber-300 border border-amber-400/50 font-bold animate-pulse"><i class="fa-solid fa-hourglass-half mr-1"></i>Chờ duyệt</span>`;
        }

        const isEmail = u.authType === 'email' || (u.identifier && u.identifier.includes('@'));

        const avatarDisplay = u.avatar && u.avatar.trim() !== ''
            ? `<img src="${u.avatar}" class="w-8 h-8 rounded-full object-cover border border-amber-400 mr-2 flex-shrink-0" alt="Avatar">`
            : `<div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0"><i class="fa-solid fa-circle-user"></i></div>`;

        const themeMode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
        const isNursery = themeMode === 'nursery';

        const sysRole = u.systemRole || (u.role && u.role.toLowerCase().includes('chuyên viên') ? 'counselor' : (u.isAdmin ? 'admin' : 'collaborator'));
        let roleBadge = '';
        if (sysRole === 'admin') {
            roleBadge = isNursery
                ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">🌲 Kiểm Lâm</span>`
                : `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">👑 Quản Trị Viên</span>`;
        } else if (sysRole === 'counselor') {
            roleBadge = isNursery
                ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">🧚 Bà Tiên Xanh</span>`
                : `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">👩‍💼 Chuyên Viên Hướng Nghiệp</span>`;
        } else {
            roleBadge = isNursery
                ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">🌱 Người Gieo Hạt</span>`
                : `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">💼 Cộng Tác Viên</span>`;
        }

        const roleDefaultTitle = isNursery ? 'Người gieo hạt tuyển sinh' : 'Cộng tác viên tuyển sinh';
        const optCollabText = isNursery ? '🌱 Người gieo hạt (CTV)' : '💼 Cộng tác viên (CTV)';
        const optCounselorText = isNursery ? '🧚 Bà tiên xanh (CV Hướng nghiệp)' : '👩‍💼 Chuyên viên hướng nghiệp';
        const optAdminText = isNursery ? '🌲 Kiểm Lâm (Vườn Ươm Wings)' : '👑 Quản trị viên (Admin)';

        // 3. Phân quyền truy cập thông tin cấp bậc:
        // - Kiểm Lâm (admin): vào được cả Người Gieo Hạt và Bà Tiên Xanh
        // - Bà Tiên Xanh (counselor): CHỈ vào được Người Gieo Hạt (collaborator). Khóa truy cập với Kiểm Lâm hoặc Bà Tiên Xanh khác.
        let canAccess = false;
        let lockReason = '';
        if (isFullAdmin) {
            canAccess = true;
        } else if (isCounselor) {
            if (sysRole === 'collaborator') {
                canAccess = true;
            } else {
                canAccess = false;
                lockReason = 'Bà Tiên Xanh chỉ được truy cập thông tin Người Gieo Hạt';
            }
        } else {
            canAccess = false;
            lockReason = 'Bạn không có quyền truy cập';
        }

        let accessActionHtml = '';
        if (canAccess) {
            accessActionHtml = `
                <button type="button" onclick="adminOpenUserDetailModal('${u.id}')" class="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 mx-auto cursor-pointer" title="Xem thông tin chi tiết và trải nghiệm giao diện người này">
                    <i class="fa-solid fa-address-card text-xs"></i>
                    <span>Truy Cập TT</span>
                </button>
            `;
        } else {
            accessActionHtml = `
                <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-500 border border-slate-800 text-[11px] font-semibold cursor-not-allowed select-none mx-auto" title="${lockReason}">
                    <i class="fa-solid fa-lock text-[10px] text-slate-500"></i>
                    <span>Khóa Truy Cập</span>
                </div>
            `;
        }

        html += `
            <tr class="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                <!-- 1. Mã Thành Viên -->
                <td class="py-3 px-3 font-mono text-xs text-amber-400 font-bold whitespace-nowrap">${u.id}</td>

                <!-- 2. Họ Tên & Danh Xưng -->
                <td class="py-3 px-3">
                    <div class="flex items-center">
                        ${avatarDisplay}
                        <div>
                            <div class="font-semibold text-white text-sm">
                                <span>${u.name}</span>
                            </div>
                            <div class="text-[11px] text-slate-400">${u.role || roleDefaultTitle}</div>
                        </div>
                    </div>
                </td>

                <!-- 3. SĐT / Gmail Định Danh -->
                <td class="py-3 px-3">
                    <div class="text-xs font-mono font-bold ${isEmail ? 'text-cyan-400' : 'text-amber-300'} flex items-center gap-1.5 whitespace-nowrap">
                        <i class="${isEmail ? 'fa-regular fa-envelope' : 'fa-solid fa-phone'}"></i>
                        <span>${u.identifier}</span>
                    </div>
                </td>

                <!-- 4. Cấp Quyền & Vai Trò Hệ Thống -->
                <td class="py-3 px-3">
                    <div class="space-y-1.5 min-w-[170px]">
                        <div class="flex items-center gap-1.5">
                            ${roleBadge}
                        </div>
                        <div class="flex items-center gap-1">
                            <select onchange="adminChangeUserRoleAction('${u.id}', this.value)" class="bg-black/90 border border-slate-700 hover:border-amber-400 text-xs rounded-lg px-2 py-1 text-amber-200 font-semibold cursor-pointer shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-400 w-full" title="Thay đổi vai trò thành viên">
                                <option value="collaborator" ${sysRole === 'collaborator' ? 'selected' : ''}>${optCollabText}</option>
                                <option value="counselor" ${sysRole === 'counselor' ? 'selected' : ''}>${optCounselorText}</option>
                                <option value="admin" ${sysRole === 'admin' ? 'selected' : ''}>${optAdminText}</option>
                            </select>
                        </div>
                    </div>
                </td>

                <!-- 5. Mật Khẩu & Cấp Lại -->
                <td class="py-3 px-3 whitespace-nowrap">
                    <div class="space-y-1 min-w-[130px]">
                        <div class="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800">
                            <i class="fa-solid fa-key text-[10px] text-amber-400"></i>
                            <span id="pwd_disp_${u.id}">••••••</span>
                            <button type="button" onclick="adminTogglePasswordReveal('${u.id}', '${(u.password || '123456').replace(/'/g, "\\'")}')" class="text-slate-400 hover:text-amber-300 ml-auto p-0.5 cursor-pointer" title="Xem / Ẩn mật khẩu">
                                <i class="fa-solid fa-eye text-[11px]" id="pwd_icon_${u.id}"></i>
                            </button>
                        </div>
                        <button onclick="adminOpenResetPasswordModal('${u.id}', '${(u.name || '').replace(/'/g, "\\'")}', '${(u.identifier || '').replace(/'/g, "\\'")}', '${(u.password || '123456').replace(/'/g, "\\'")}')" class="w-full px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer" title="Admin đổi hoặc cấp lại mật khẩu cho thành viên">
                            <i class="fa-solid fa-pen-to-square text-[9px]"></i> Cấp lại MK
                        </button>
                    </div>
                </td>

                <!-- 6. Số Chuối -->
                <td class="py-3 px-3 text-center whitespace-nowrap">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 text-xs font-bold">
                        🍌 ${u.bananas || 0}
                    </span>
                    <button onclick="adminAdjustBananasModal('${u.id}', '${u.name}', ${u.bananas || 0})" title="Cộng/Trừ Chuối" class="ml-1 text-[11px] text-slate-400 hover:text-yellow-400 cursor-pointer">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </td>

                <!-- 7. Trạng Thái -->
                <td class="py-3 px-3 text-center whitespace-nowrap">
                    ${statusBadge}
                </td>

                <!-- 8. Truy Cập Thông Tin (Phân Cấp: Kiểm Lâm -> All, Bà Tiên Xanh -> Người Gieo Hạt) -->
                <td class="py-3 px-3 text-center whitespace-nowrap">
                    ${accessActionHtml}
                </td>

                <!-- 9. Thao Tác Duyệt -->
                <td class="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                    ${u.status === 'PENDING' ? `
                        <button onclick="adminApproveUserAction('${u.id}')" class="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer">
                            <i class="fa-solid fa-check mr-1"></i> Duyệt Ngay
                        </button>
                        <button onclick="adminRejectUserAction('${u.id}')" class="px-2 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40 text-xs transition-all active:scale-95 cursor-pointer">
                            Từ Chối
                        </button>
                    ` : u.status === 'APPROVED' ? `
                        <button onclick="adminRejectUserAction('${u.id}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 text-xs transition-all cursor-pointer" title="Khóa/Hủy duyệt">
                            <i class="fa-solid fa-lock mr-1"></i> Khóa
                        </button>
                    ` : `
                        <button onclick="adminApproveUserAction('${u.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black text-xs font-semibold transition-all cursor-pointer">
                            <i class="fa-solid fa-rotate-left mr-1"></i> Duyệt Lại
                        </button>
                    `}
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

// ==========================================================================
// TRUY CẬP THÔNG TIN CHI TIẾT THÀNH VIÊN & ĐĂNG NHẬP DƯỚI DANH NGHĨA (IMPERSONATION)
// ==========================================================================
let currentDetailModalUserId = null;
let currentDetailModalUserPassword = '';
let isModalPasswordRevealed = false;

window.adminOpenUserDetailModal = function(userId) {
    const currentAdminRole = getActiveAdminRole();
    const isFullAdmin = (currentAdminRole === 'admin');
    const isCounselor = (currentAdminRole === 'counselor');

    const u = DataManager.getUserById(userId);
    if (!u) {
        alert('Không tìm thấy thông tin thành viên!');
        return;
    }

    const sysRole = u.systemRole || (u.role && u.role.toLowerCase().includes('chuyên viên') ? 'counselor' : (u.isAdmin ? 'admin' : 'collaborator'));

    // Kiểm tra phân quyền truy cập thông tin cấp thấp hơn:
    // Kiểm Lâm: vào được Người Gieo Hạt và Bà Tiên Xanh
    // Bà Tiên Xanh: CHỈ vào được Người Gieo Hạt
    if (!isFullAdmin) {
        if (isCounselor && sysRole !== 'collaborator') {
            alert('⛔ Bà Tiên Xanh chỉ có quyền truy cập thông tin của Người Gieo Hạt!');
            return;
        }
        if (!isCounselor) {
            alert('⛔ Bạn không có quyền truy cập thông tin thành viên!');
            return;
        }
    }

    currentDetailModalUserId = u.id;
    currentDetailModalUserPassword = u.password || '123456';
    isModalPasswordRevealed = false;

    const modal = document.getElementById('adminUserDetailModal');
    if (!modal) return;

    // 1. Header & Profile
    const nameEl = document.getElementById('modalUserName');
    const idEl = document.getElementById('modalUserId');
    const roleBadgeEl = document.getElementById('modalUserRoleBadge');
    const statusBadgeEl = document.getElementById('modalUserStatusBadge');
    const avatarBox = document.getElementById('modalUserAvatarBox');

    if (nameEl) nameEl.textContent = u.name;
    if (idEl) idEl.textContent = u.id;

    if (avatarBox) {
        if (u.avatar && u.avatar.trim() !== '') {
            avatarBox.innerHTML = `<img src="${u.avatar}" class="w-full h-full object-cover" alt="Avatar">`;
        } else {
            avatarBox.innerHTML = `<i class="fa-solid fa-circle-user text-2xl"></i>`;
        }
    }

    const themeMode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
    const isNursery = themeMode === 'nursery';

    let roleBadge = '';
    if (sysRole === 'admin') {
        roleBadge = isNursery
            ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">🌲 Kiểm Lâm</span>`
            : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">👑 Quản Trị Viên</span>`;
    } else if (sysRole === 'counselor') {
        roleBadge = isNursery
            ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">🧚 Bà Tiên Xanh</span>`
            : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">👩‍💼 Chuyên Viên</span>`;
    } else {
        roleBadge = isNursery
            ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">🌱 Người Gieo Hạt</span>`
            : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">💼 CTV Tuyển Sinh</span>`;
    }
    if (roleBadgeEl) roleBadgeEl.innerHTML = roleBadge;

    let statusBadge = '';
    if (u.status === 'APPROVED') {
        statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">Đã Duyệt</span>`;
    } else if (u.status === 'REJECTED') {
        statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">Bị Khóa</span>`;
    } else {
        statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] bg-amber-500/25 text-amber-300 border border-amber-400/50 font-bold animate-pulse">Chờ Duyệt</span>`;
    }
    if (statusBadgeEl) statusBadgeEl.innerHTML = statusBadge;

    // 2. Tài khoản & Ngân hàng
    const identEl = document.getElementById('modalUserIdentifier');
    const regEl = document.getElementById('modalUserRegisteredAt');
    const pwdEl = document.getElementById('modalUserPasswordText');
    const pwdIcon = document.getElementById('modalUserPwdIcon');
    const gameBadgeEl = document.getElementById('modalUserMiniGameBadge');
    const bankEl = document.getElementById('modalUserBankInfo');

    if (identEl) identEl.textContent = u.identifier;
    if (regEl) regEl.textContent = u.registeredAt ? DataManager.formatDate(u.registeredAt) : 'Chưa ghi nhận';
    if (pwdEl) pwdEl.textContent = '••••••';
    if (pwdIcon) {
        pwdIcon.classList.remove('fa-eye-slash');
        pwdIcon.classList.add('fa-eye');
    }

    if (gameBadgeEl) {
        if (u.miniGameApproved) {
            gameBadgeEl.innerHTML = '<span class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check"></i> Đã mở quyền chơi 🍌</span>';
        } else {
            gameBadgeEl.innerHTML = '<span class="text-amber-400 font-semibold"><i class="fa-solid fa-hourglass-half"></i> Chưa mở quyền</span>';
        }
    }

    if (bankEl) {
        if (u.bankInfo && u.bankInfo.trim() !== '') {
            bankEl.innerHTML = `<span class="text-white font-semibold">${u.bankInfo}</span>`;
        } else {
            bankEl.innerHTML = `<span class="text-slate-400 italic">Thành viên chưa bổ sung số tài khoản ngân hàng</span>`;
        }
    }

    // 3. Thống kê hạt giống & Quả ngọt (Dữ liệu thực tế)
    const idStr = (u.identifier || '').trim().toLowerCase();
    const nameStr = (u.name || '').trim().toLowerCase();
    const leads = DataManager.getLeads();
    const userLeads = leads.filter(l => 
        (l.referrerPhone && l.referrerPhone.trim().toLowerCase() === idStr) ||
        (l.referrerName && l.referrerName.trim().toLowerCase() === nameStr)
    );

    let totalLeadsCount = userLeads.length;
    let inFunnelCount = 0;
    let wonLeadsCount = 0;
    let totalReward = 0;
    let paidReward = 0;

    userLeads.forEach(l => {
        const amt = l.rewardAmount || 0;
        totalReward += amt;
        if (l.status === 'PAID') {
            wonLeadsCount++;
            paidReward += amt;
        } else if (['WON', 'APPROVED', 'HOAN_THANH'].includes(l.status)) {
            wonLeadsCount++;
        } else {
            inFunnelCount++;
        }
    });

    const posts = DataManager.getBananaPosts ? DataManager.getBananaPosts() : [];
    const userPosts = posts.filter(p => 
        (p.userIdentifier && p.userIdentifier.trim().toLowerCase() === idStr) ||
        (p.userName && p.userName.trim().toLowerCase() === nameStr)
    );
    const approvedPostsCount = userPosts.filter(p => p.status === 'APPROVED').length;

    const totalLeadsEl = document.getElementById('modalUserTotalLeads');
    const inFunnelEl = document.getElementById('modalUserInFunnel');
    const wonLeadsEl = document.getElementById('modalUserWonLeads');
    const gamePostsEl = document.getElementById('modalUserGamePosts');
    const bananaCountEl = document.getElementById('modalUserBananaCount');
    const totalRewardEl = document.getElementById('modalUserTotalReward');
    const remainingRewardEl = document.getElementById('modalUserRemainingReward');

    if (totalLeadsEl) totalLeadsEl.textContent = totalLeadsCount;
    if (inFunnelEl) inFunnelEl.textContent = inFunnelCount;
    if (wonLeadsEl) wonLeadsEl.textContent = wonLeadsCount;
    if (gamePostsEl) gamePostsEl.textContent = `${approvedPostsCount} / ${userPosts.length}`;
    if (bananaCountEl) bananaCountEl.textContent = `🍌 ${u.bananas || 0} Chuối`;
    if (totalRewardEl) totalRewardEl.textContent = DataManager.formatCurrency(totalReward);
    if (remainingRewardEl) remainingRewardEl.textContent = DataManager.formatCurrency(totalReward - paidReward);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closeAdminUserDetailModal = function() {
    const modal = document.getElementById('adminUserDetailModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    currentDetailModalUserId = null;
    currentDetailModalUserPassword = '';
    isModalPasswordRevealed = false;
};

window.toggleModalUserPassword = function() {
    isModalPasswordRevealed = !isModalPasswordRevealed;
    const pwdEl = document.getElementById('modalUserPasswordText');
    const pwdIcon = document.getElementById('modalUserPwdIcon');
    if (pwdEl) {
        pwdEl.textContent = isModalPasswordRevealed ? (currentDetailModalUserPassword || '123456') : '••••••';
    }
    if (pwdIcon) {
        if (isModalPasswordRevealed) {
            pwdIcon.classList.remove('fa-eye');
            pwdIcon.classList.add('fa-eye-slash');
        } else {
            pwdIcon.classList.remove('fa-eye-slash');
            pwdIcon.classList.add('fa-eye');
        }
    }
};

window.adminLoginAsCurrentModalUser = function() {
    if (!currentDetailModalUserId) return;
    adminLoginAsTargetUser(currentDetailModalUserId);
};

window.adminLoginAsTargetUser = function(userId) {
    const currentAdminRole = getActiveAdminRole();
    const isFullAdmin = (currentAdminRole === 'admin');
    const isCounselor = (currentAdminRole === 'counselor');

    const targetUser = DataManager.getUserById(userId);
    if (!targetUser) {
        alert('Không tìm thấy thành viên để đăng nhập!');
        return;
    }

    const sysRole = targetUser.systemRole || (targetUser.role && targetUser.role.toLowerCase().includes('chuyên viên') ? 'counselor' : (targetUser.isAdmin ? 'admin' : 'collaborator'));

    // Kiểm tra quyền:
    // Kiểm Lâm: được vào Người Gieo Hạt và Bà Tiên Xanh
    // Bà Tiên Xanh: CHỈ được vào Người Gieo Hạt
    if (!isFullAdmin) {
        if (isCounselor && sysRole !== 'collaborator') {
            alert('⛔ Bà Tiên Xanh chỉ có quyền vào xem giao diện của Người Gieo Hạt!');
            return;
        }
        if (!isCounselor) {
            alert('⛔ Bạn không có quyền thực hiện thao tác này!');
            return;
        }
    }

    const cur = DataManager.getCurrentUser();
    const impSession = {
        originalAdminRole: currentAdminRole,
        originalUserId: cur ? cur.id : null,
        targetUserId: targetUser.id,
        targetUserName: targetUser.name,
        targetSysRole: sysRole,
        startedAt: Date.now()
    };

    localStorage.setItem('wings_impersonation', JSON.stringify(impSession));
    DataManager.setCurrentUser(targetUser);

    closeAdminUserDetailModal();
    alert(`🚀 Bạn đang chuyển sang trải nghiệm giao diện với tư cách: ${targetUser.name} (${targetUser.role || sysRole}).\n\nBạn có thể quay lại trang Quản trị bất kỳ lúc nào bằng nút trên thanh banner!`);
    window.location.href = 'index.html';
};


window.adminChangeUserRoleAction = function(userId, newRole) {
    const currentRole = getActiveAdminRole();
    if (currentRole !== 'admin') {
        const pin = prompt(`Vui lòng nhập mã PIN ${getAdminRoleDisplayName()} (12345678) để cấp quyền / thay đổi vai trò:`);
        if (pin === '12345678' || pin === ADMIN_DEFAULT_PIN || pin === '123456') {
            sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
            if (typeof applyRoleTabPermissions === 'function') applyRoleTabPermissions();
        } else {
            alert(`Mã PIN không chính xác! Chỉ ${getAdminRoleDisplayName()} mới có quyền cấp vai trò.`);
            renderUsersTable();
            return;
        }
    }
    const updated = DataManager.updateUserSystemRole(userId, newRole);
    if (updated) {
        refreshAdminDashboard();
        if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
        if (typeof showToast === 'function') {
            showToast(`Đã cấp quyền: ${updated.name} -> ${updated.role}`, 'success');
        } else {
            alert(`Đã cấp quyền thành công cho ${updated.name} thành: ${updated.role}`);
        }
    }
};

window.adminApproveUserAction = function(userId) {
    const role = getActiveAdminRole();
    const canApproveMembers = (role === 'admin' || DataManager.hasPermission('counselor', 'approve_members'));
    if (!canApproveMembers) {
        const pin = prompt(`Vui lòng nhập mã PIN ${getAdminRoleDisplayName()} (12345678) để duyệt kích hoạt thành viên:`);
        if (pin === '12345678' || pin === ADMIN_DEFAULT_PIN || pin === '123456') {
            sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
            if (typeof applyRoleTabPermissions === 'function') applyRoleTabPermissions();
        } else {
            alert(`Mã PIN không chính xác! Chỉ ${getAdminRoleDisplayName()} hoặc Chuyên viên mới được duyệt.`);
            return;
        }
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
        alert(`Bạn không có quyền điều chỉnh số chuối thành viên! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
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
    if (!canCurrentRolePerform('approve_game_regs')) {
        alert('Tài khoản của bạn không có quyền duyệt ảnh chuối!');
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
    if (!canCurrentRolePerform('approve_game_regs')) {
        alert('Tài khoản của bạn không có quyền duyệt ảnh chuối!');
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
    if (inputOwner) inputOwner.value = config.adminWalletOwner || 'Bộ phận Hướng nghiệp Wings';
    if (inputTitle) inputTitle.value = config.programFeeTitle || '';
    if (inputDesc) inputDesc.value = config.programFeeDescription || '';
    if (inputGuidelines) inputGuidelines.value = config.guidelines || '';
}

function handleSaveBananaConfig(e) {
    e.preventDefault();
    if (!canCurrentRolePerform('config_game')) {
        alert(`Bạn không có quyền điều chỉnh cấu hình mini game & ví chuối! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
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
    if (currentConsultantFilter === 'ONLINE') {
        leads = leads.filter(l => l.actualCloseType === 'pass' || (l.assignedTo && (l.assignedTo.includes('CV') || l.assignedTo.includes('Bà Tiên'))));
    } else if (currentConsultantFilter === 'CLIENT') {
        leads = leads.filter(l => l.actualCloseType === 'self' || (l.assignedTo && (l.assignedTo.includes('Tự chốt') || l.assignedTo.includes('Tự Vun Trồng'))));
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

    const countDisplay = document.getElementById('leadsCountDisplay');
    if (countDisplay) countDisplay.textContent = leads.length;

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
        const course = COURSES_CONFIG.find(c => c.id === l.actualCourseId) || COURSES_CONFIG.find(c => c.id === l.interestCourseId);
        const isSelf = l.actualCloseType === 'self';

        let statusBorderColor = 'border-slate-700 bg-slate-900 text-slate-300';
        if (l.status === 'CARE') statusBorderColor = 'border-amber-500/40 bg-amber-950/30 text-amber-300';
        else if (l.status === 'CHECKIN') statusBorderColor = 'border-purple-500/40 bg-purple-950/30 text-purple-300';
        else if (l.status === 'TRAINING') statusBorderColor = 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300';
        else if (['WON', 'APPROVED'].includes(l.status)) statusBorderColor = 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300';
        else if (l.status === 'PAID') statusBorderColor = 'border-yellow-500/40 bg-yellow-950/30 text-yellow-300';
        else if (['LOST', 'REJECTED'].includes(l.status)) statusBorderColor = 'border-rose-500/40 bg-rose-950/30 text-rose-400';

        html += `
            <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-3">
                    <div class="font-mono text-xs font-bold text-amber-400">${l.id}</div>
                    <div class="text-[11px] text-slate-500">${DataManager.formatDate(l.createdAt)}</div>
                </td>
                <td class="py-3 px-3">
                    <div class="font-semibold text-amber-200 text-sm">${l.customerName}</div>
                    <div class="text-xs text-slate-400 font-mono">${l.customerPhone}</div>
                    ${l.customerTarget ? `<span class="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-medium">🎯 ${l.customerTarget}</span>` : ''}
                    ${l.appointmentDate ? `
                        <div class="text-[10px] text-yellow-300 font-medium flex items-center gap-1 mt-0.5" title="Kế hoạch ACA: Ngày hẹn lên học viện">
                            <i class="fa-regular fa-calendar-check text-yellow-400"></i> Hẹn: ${DataManager.formatDate(l.appointmentDate)}
                        </div>
                    ` : ''}
                </td>
                <td class="py-3 px-3">
                    <div class="font-semibold text-white text-sm flex items-center gap-1.5">
                        <i class="fa-solid fa-user-tag text-xs text-amber-500"></i> ${l.referrerName}
                    </div>
                    <div class="text-xs text-slate-400 font-mono">${l.referrerPhone}</div>
                    ${l.referrerBank ? `<div class="text-[10px] text-slate-500 truncate max-w-[150px]" title="${l.referrerBank}"><i class="fa-solid fa-credit-card mr-0.5"></i> ${l.referrerBank}</div>` : ''}
                </td>
                <td class="py-3 px-3">
                    <div class="text-sm font-medium text-white">${course?.name || '--'}</div>
                    <div class="text-xs ${isSelf ? 'text-amber-400 font-semibold' : 'text-slate-400'}">
                        ${(() => {
                            const themeMode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
                            return (themeMode === 'nursery')
                                ? (isSelf ? '🌟 Tự Vun Trồng (100% Quả Ngọt)' : '🧚 Bà Tiên Xanh (50% Quả Ngọt)')
                                : (isSelf ? '🌟 Tự Chốt (100% Hoa Hồng)' : '🤝 Gửi Data (50% Hoa Hồng)');
                        })()}
                    </div>
                </td>
                <td class="py-3 px-3">
                    <div class="flex items-center justify-center">
                        ${(() => {
                            const currentRole = getActiveAdminRole();
                            const currentLevel = DataManager.getFunnelLevel(l.status);
                            const isCounselor = (currentRole === 'counselor');
                            const isLeadWon = ['WON', 'APPROVED'].includes(l.status);
                            const isLeadLost = ['LOST', 'REJECTED'].includes(l.status);
                            const themeMode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
                            const isNursery = (themeMode === 'nursery');

                            let optionsHtml = '';
                            if (!isCounselor) {
                                if (isNursery) {
                                    optionsHtml = `
                                        <option value="DATA" ${l.status === 'DATA' ? 'selected' : ''}>1. 🤲 Gieo hạt (Mới)</option>
                                        <option value="CARE" ${l.status === 'CARE' ? 'selected' : ''}>2. 💧 Tưới mát (Chăm sóc)</option>
                                        <option value="CHECKIN" ${l.status === 'CHECKIN' ? 'selected' : ''}>3. 🌱 Nảy mầm (Checkin)</option>
                                        <option value="TRAINING" ${l.status === 'TRAINING' ? 'selected' : ''}>4. 🌿 Đâm chồi (Đào tạo)</option>
                                        <option value="WON" ${isLeadWon ? 'selected' : ''}>5. 🍎 Kết trái (Quả ngọt)</option>
                                        <option value="PAID" ${l.status === 'PAID' ? 'selected' : ''}>🍎 Đã thu hoạch (Chi trả)</option>
                                        <option value="LOST" ${isLeadLost ? 'selected' : ''}>🥀 Khô héo / Thất bại</option>
                                    `;
                                } else {
                                    optionsHtml = `
                                        <option value="DATA" ${l.status === 'DATA' ? 'selected' : ''}>1. Tiếp nhận (Mới)</option>
                                        <option value="CARE" ${l.status === 'CARE' ? 'selected' : ''}>2. Tư vấn (Chăm sóc)</option>
                                        <option value="CHECKIN" ${l.status === 'CHECKIN' ? 'selected' : ''}>3. Check-in (Học viện)</option>
                                        <option value="TRAINING" ${l.status === 'TRAINING' ? 'selected' : ''}>4. Đào tạo (Học nghề)</option>
                                        <option value="WON" ${isLeadWon ? 'selected' : ''}>5. Hoàn tất (Thành công)</option>
                                        <option value="PAID" ${l.status === 'PAID' ? 'selected' : ''}>Đã chi trả thưởng</option>
                                        <option value="LOST" ${isLeadLost ? 'selected' : ''}>Thất bại / Hủy</option>
                                    `;
                                }
                            } else {
                                const disAdmin = 'disabled class="text-slate-600 bg-slate-900"';
                                const disLower = 'disabled class="text-slate-600 bg-slate-900"';

                                if (isNursery) {
                                    optionsHtml = `
                                        <option value="DATA" ${l.status === 'DATA' ? 'selected' : ''} ${disAdmin}>1. 🤲 Gieo hạt (Chỉ Kiểm Lâm)</option>
                                        <option value="CARE" ${l.status === 'CARE' ? 'selected' : ''} ${currentLevel > 2 ? disLower : ''}>2. 💧 Tưới mát ${currentLevel > 2 ? '(Không chuyển lùi)' : ''}</option>
                                        <option value="CHECKIN" ${l.status === 'CHECKIN' ? 'selected' : ''} ${currentLevel > 3 ? disLower : ''}>3. 🌱 Nảy mầm ${currentLevel > 3 ? '(Không chuyển lùi)' : ''}</option>
                                        <option value="TRAINING" ${l.status === 'TRAINING' ? 'selected' : ''} ${currentLevel > 4 ? disLower : ''}>4. 🌿 Đâm chồi ${currentLevel > 4 ? '(Không chuyển lùi)' : ''}</option>
                                        <option value="WON" ${isLeadWon ? 'selected' : ''} ${currentLevel > 5 ? disLower : ''}>5. 🍎 Kết trái (Quả ngọt)</option>
                                        <option value="PAID" ${l.status === 'PAID' ? 'selected' : ''} ${canCurrentRolePerform('approve_leads') ? '' : disAdmin}>🍎 Đã thu hoạch</option>
                                        <option value="LOST" ${isLeadLost ? 'selected' : ''} ${disAdmin}>🥀 Khô héo (Chỉ Kiểm Lâm)</option>
                                    `;
                                } else {
                                    optionsHtml = `
                                        <option value="DATA" ${l.status === 'DATA' ? 'selected' : ''} ${disAdmin}>1. Tiếp nhận (Chỉ Admin)</option>
                                        <option value="CARE" ${l.status === 'CARE' ? 'selected' : ''} ${currentLevel > 2 ? disLower : ''}>2. Tư vấn ${currentLevel > 2 ? '(Không chuyển lùi)' : ''}</option>
                                        <option value="CHECKIN" ${l.status === 'CHECKIN' ? 'selected' : ''} ${currentLevel > 3 ? disLower : ''}>3. Check-in ${currentLevel > 3 ? '(Không chuyển lùi)' : ''}</option>
                                        <option value="TRAINING" ${l.status === 'TRAINING' ? 'selected' : ''} ${currentLevel > 4 ? disLower : ''}>4. Đào tạo ${currentLevel > 4 ? '(Không chuyển lùi)' : ''}</option>
                                        <option value="WON" ${isLeadWon ? 'selected' : ''} ${currentLevel > 5 ? disLower : ''}>5. Hoàn tất (Thành công)</option>
                                        <option value="PAID" ${l.status === 'PAID' ? 'selected' : ''} ${canCurrentRolePerform('approve_leads') ? '' : disAdmin}>Đã chi trả</option>
                                        <option value="LOST" ${isLeadLost ? 'selected' : ''} ${disAdmin}>Hủy hồ sơ (Chỉ Admin)</option>
                                    `;
                                }
                            }

                            return `
                                <select onchange="changeLeadFunnelStatus('${l.id}', this.value)" 
                                    class="form-input-luxury py-1.5 px-2 text-xs font-bold rounded-xl cursor-pointer ${statusBorderColor}">
                                    ${optionsHtml}
                                </select>
                            `;
                        })()}
                    </div>
                </td>
                <td class="py-3 px-3">
                    <div onclick="promptEditLeadNote('${l.id}')" 
                        class="cursor-pointer group flex items-center justify-between gap-1 text-slate-300 hover:text-amber-300 transition-colors p-1.5 rounded-lg bg-black/40 hover:bg-slate-800 border border-slate-800" 
                        title="Bấm vào để sửa nhanh ghi chú tiến độ">
                        <span class="truncate max-w-[150px] text-xs">${l.adminNote || '<span class="text-slate-600 italic">Chưa có note...</span>'}</span>
                        <i class="fa-solid fa-pen-to-square text-[10px] text-slate-500 group-hover:text-amber-400 opacity-60 group-hover:opacity-100 flex-shrink-0"></i>
                    </div>
                </td>
                <td class="py-3 px-3 text-right">
                    <div class="font-bold text-amber-400 text-sm font-mono">
                        ${DataManager.formatCurrency(l.rewardAmount)}
                    </div>
                </td>
                <td class="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                    <button onclick="openLeadDetail('${l.id}')" title="Xem 4 thông tin bàn giao" 
                        class="p-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button onclick="openLeadEditModal('${l.id}')" title="Duyệt thưởng / Đổi chi tiết" 
                        class="p-1.5 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black transition-all text-xs font-medium border border-amber-500/40">
                        <i class="fa-solid fa-pen-to-square mr-1"></i> Xử lý
                    </button>
                    <button onclick="deleteLeadConfirm('${l.id}')" title="Xóa data" 
                        class="p-1.5 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors text-xs">
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
    if (dCloseType) dCloseType.textContent = lead.closeType === 'self' ? '🌱 Người gieo hạt tự vun trồng (100% quả ngọt)' : '🧚 Trao Bà Tiên Xanh chăm sóc (50% quả ngọt)';

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
        alert(`Bạn không có quyền chỉnh sửa / duyệt hạt giống cơ hội! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
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

    const role = getActiveAdminRole();
    const isCounselor = (role === 'counselor');
    const currentLevel = DataManager.getFunnelLevel(lead.status);

    if (statusSelect) {
        const themeMode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
        const adminTag = (themeMode === 'nursery') ? ' (Chỉ Kiểm Lâm)' : ' (Chỉ Admin)';
        Array.from(statusSelect.options).forEach(opt => {
            const optVal = opt.value;
            const optLevel = DataManager.getFunnelLevel(optVal);
            let cleanText = opt.text.replace(/ \(Chỉ Admin\)/g, '').replace(/ \(Chỉ Kiểm Lâm\)/g, '').replace(/ \(Không chuyển lùi\)/g, '');

            if (isCounselor) {
                if (optVal === 'DATA' || optVal === 'NEW' || optVal === 'LOST' || optVal === 'REJECTED') {
                    opt.disabled = true;
                    opt.text = cleanText + adminTag;
                } else if (optLevel < currentLevel) {
                    opt.disabled = true;
                    opt.text = cleanText + ' (Không chuyển lùi)';
                } else {
                    opt.disabled = false;
                    opt.text = cleanText;
                }
            } else {
                opt.disabled = false;
                opt.text = cleanText;
            }
        });
    }

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
        alert('Tài khoản của bạn không có quyền duyệt Hạt Giống & duyệt chi trả quả ngọt!');
        return;
    }

    const actualCourseId = document.getElementById('editActualCourse').value;
    const actualCloseType = document.getElementById('editActualCloseType').value;
    const status = document.getElementById('editStatus').value;
    const adminNote = document.getElementById('editAdminNote').value.trim();

    if (role === 'counselor') {
        const currentLevel = DataManager.getFunnelLevel(selectedLeadForEdit.status);
        const targetLevel = DataManager.getFunnelLevel(status);

        // Quy định: Bà tiên xanh không điều chuyển trạng thái dưới mục "tưới mát"
        // Chỉ có admin mới được chỉnh trạng thái ban đầu (DATA/NEW)
        if (status === 'DATA' || status === 'NEW') {
            alert(`Bà tiên xanh không được điều chuyển trạng thái về "Gieo hạt" (dưới mức Tưới Mát).\nChỉ có ${getAdminRoleDisplayName()} mới có quyền chỉnh trạng thái ban đầu!`);
            return;
        }

        // Quy định: Bà tiên xanh chỉ có thể cập nhật tiến trình lên trên (không chuyển lùi và không hủy)
        if (targetLevel < currentLevel || status === 'LOST' || status === 'REJECTED') {
            alert('Bà tiên xanh chỉ có thể cập nhật tiến trình lên trên (từ Tưới Mát trở lên)!\nKhông được phép chuyển lùi trạng thái hoặc hủy hồ sơ.');
            return;
        }
    }

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
    const role = getActiveAdminRole();
    if (role !== 'admin') {
        alert(`Chỉ ${getAdminRoleDisplayName()} mới có quyền xóa hồ sơ hạt giống!`);
        return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ ${id}?`)) {
        DataManager.deleteLead(id);
        refreshAdminDashboard();
    }
};

window.payoutAllForReferrer = function(phone) {
    if (!canCurrentRolePerform('approve_leads')) {
        alert(`Bạn không có quyền duyệt chi trả quả ngọt! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
        return;
    }
    if (confirm(`Xác nhận đã chi trả quả ngọt đang chờ cho ${phone}?`)) {
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
            l.actualCloseType === 'self' ? '🌟 Tự Vun Trồng (100% Quả Ngọt)' : '🧚 Bà Tiên Xanh (50% Quả Ngọt)',
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
        const lashThumb = c.image ? `
            <img src="${c.image}" alt="${c.name}" class="w-10 h-10 rounded-lg object-cover border border-amber-500/40 flex-shrink-0 shadow-sm" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=600&q=80'">
        ` : `
            <div class="w-10 h-10 rounded-lg bg-stone-900 border border-amber-500/20 flex items-center justify-center text-amber-400/60 flex-shrink-0">
                <i class="fa-solid fa-eye text-xs"></i>
            </div>
        `;

        const scholarshipDisplay = (c.scholarship > 0 || c.scholarshipNote) ? `
            <div>
                <div class="font-bold text-yellow-300 font-mono flex items-center gap-1">
                    <i class="fa-solid fa-gift text-yellow-400 text-[10px]"></i>
                    ${c.scholarshipFormatted || DataManager.formatMoneyShort(c.scholarship)}
                </div>
                ${c.scholarshipNote ? `<div class="text-[10px] text-amber-200/80 italic mt-0.5">${c.scholarshipNote}</div>` : ''}
            </div>
        ` : `<span class="text-slate-500">--</span>`;

        const hasDiscount = c.discountPrice && c.discountPrice < c.tuition;
        const priceDisplay = hasDiscount ? `
            <div>
                <span class="line-through text-slate-400 text-[10px] block font-mono">${c.tuitionFormatted || DataManager.formatMoneyShort(c.tuition)}</span>
                <span class="font-bold text-yellow-300 font-mono text-sm">${c.discountPriceFormatted || DataManager.formatMoneyShort(c.discountPrice)}</span>
            </div>
        ` : `
            <div>
                <span class="font-bold text-amber-200 font-mono text-sm">${c.tuitionFormatted || DataManager.formatMoneyShort(c.tuition)}</span>
                <span class="text-[10px] text-slate-400 block">${c.tuition.toLocaleString('vi-VN')} đ</span>
            </div>
        `;

        const wikiStatusBadge = c.showOnWiki !== false ? `
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <i class="fa-solid fa-eye text-[9px]"></i> Hiện Wiki
            </span>
        ` : `
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                <i class="fa-solid fa-eye-slash text-[9px]"></i> Ẩn
            </span>
        `;

        html += `
            <tr class="border-b border-amber-900/20 hover:bg-amber-500/5 transition-colors">
                <td class="py-2.5 px-3">
                    <div class="flex items-center gap-2.5">
                        ${lashThumb}
                        <div>
                            <div class="font-bold text-white flex items-center">
                                ${iconHtml}
                                <span>${c.name}</span>
                                ${badgeHtml}
                            </div>
                            <div class="text-[10px] text-slate-400 font-mono mt-0.5">ID: ${c.id} • ⏱️ ${c.duration || 'Linh hoạt'}</div>
                        </div>
                    </div>
                </td>
                <td class="py-2.5 px-3">
                    ${priceDisplay}
                </td>
                <td class="py-2.5 px-3">
                    ${scholarshipDisplay}
                </td>
                <td class="py-2.5 px-3 text-center">
                    ${wikiStatusBadge}
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

// Helper cập nhật preview ảnh mi
function updateCourseImagePreview(url) {
    const preview = document.getElementById('courseImagePreview');
    const placeholder = document.getElementById('courseImagePlaceholder');
    if (!preview || !placeholder) return;
    const cleanUrl = (url || '').trim();
    if (cleanUrl) {
        preview.src = cleanUrl;
        preview.classList.remove('hidden');
        placeholder.classList.add('hidden');
        preview.onerror = () => {
            preview.classList.add('hidden');
            placeholder.classList.remove('hidden');
        };
    } else {
        preview.src = '';
        preview.classList.add('hidden');
        placeholder.classList.remove('hidden');
    }
}

// Preset ảnh mẫu mi cho admin chọn nhanh
window.setQuickLashPreset = function(presetKey) {
    const presets = {
        classic: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=600&q=80',
        thienthan: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        volume: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
        thietke: 'https://images.unsplash.com/photo-1588510903716-1a00b875743b?auto=format&fit=crop&w=600&q=80',
        master: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
    };
    const url = presets[presetKey] || presets.classic;
    const input = document.getElementById('courseInputImage');
    if (input) {
        input.value = url;
    }
    updateCourseImagePreview(url);
};

window.openAddCourseModal = function() {
    if (!canCurrentRolePerform('config_courses')) {
        alert(`Bạn không có quyền thêm mới khóa học! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
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

    document.getElementById('courseInputShowOnWiki').checked = true;
    document.getElementById('courseInputImage').value = '';
    updateCourseImagePreview('');
    document.getElementById('courseInputTargetAudience').value = '';
    document.getElementById('courseInputCurriculum').value = '';
    document.getElementById('courseInputDuration').value = '1 - 2 tuần';
    document.getElementById('courseInputModelCount').value = '2 mẫu (1 canh + 1 thật)';
    document.getElementById('courseInputModelCost').value = 'Miễn phí (Học viện tài trợ)';
    document.getElementById('courseInputTuition').value = '';
    document.getElementById('courseInputDiscountPrice').value = '';
    const rSelfEl = document.getElementById('courseInputRewardSelf');
    if (rSelfEl) rSelfEl.value = 500000;
    document.getElementById('courseInputSelfPercent').value = 20;
    const rPassEl = document.getElementById('courseInputRewardPass');
    if (rPassEl) rPassEl.value = 250000;
    document.getElementById('courseInputAcaPercent').value = 10;
    document.getElementById('courseInputScholarship').value = 0;
    document.getElementById('courseInputScholarshipNote').value = '';
    document.getElementById('courseInputBadge').value = '';
    document.getElementById('courseInputIcon').value = 'graduation-cap';
    updateCourseRewardBiDirectional('init');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.openEditCourseModal = function(courseId) {
    if (!canCurrentRolePerform('config_courses')) {
        alert(`Bạn không có quyền chỉnh sửa bảng thưởng khóa học! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
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

    // 1. Show on Wiki
    const showOnWikiEl = document.getElementById('courseInputShowOnWiki');
    if (showOnWikiEl) showOnWikiEl.checked = course.showOnWiki !== false;

    // 2. Lash image & preview
    const imageEl = document.getElementById('courseInputImage');
    if (imageEl) imageEl.value = course.image || '';
    updateCourseImagePreview(course.image || '');

    // 3. Name
    document.getElementById('courseInputName').value = course.name || '';

    // 4. Target audience & Curriculum
    const targetAudienceEl = document.getElementById('courseInputTargetAudience');
    if (targetAudienceEl) targetAudienceEl.value = course.targetAudience || '';
    const curriculumEl = document.getElementById('courseInputCurriculum');
    if (curriculumEl) curriculumEl.value = course.curriculum || '';

    // 5. Practice specs: duration, modelCount, modelCost
    const durationEl = document.getElementById('courseInputDuration');
    if (durationEl) durationEl.value = course.duration || '';
    const modelCountEl = document.getElementById('courseInputModelCount');
    if (modelCountEl) modelCountEl.value = course.modelCount || '';
    const modelCostEl = document.getElementById('courseInputModelCost');
    if (modelCostEl) modelCostEl.value = course.modelCost || '';

    // 6. Prices & Scholarship
    document.getElementById('courseInputTuition').value = course.tuition || 0;
    const discountEl = document.getElementById('courseInputDiscountPrice');
    if (discountEl) discountEl.value = course.discountPrice !== undefined ? course.discountPrice : course.tuition;
    document.getElementById('courseInputScholarship').value = course.scholarship || 0;
    document.getElementById('courseInputScholarshipNote').value = course.scholarshipNote || '';

    // 7. Commission % & Money Rewards
    const tuition = course.tuition || 0;
    const rSelf = course.rewardSelf !== undefined ? course.rewardSelf : Math.round(tuition * (course.selfPercent || 20) / 100);
    const pSelf = course.selfPercent !== undefined ? course.selfPercent : (tuition > 0 ? Math.round((rSelf / tuition) * 1000) / 10 : 20);

    const rPass = course.rewardPass !== undefined ? course.rewardPass : Math.round(tuition * (course.acaPercent || 10) / 100);
    const pPass = course.acaPercent !== undefined ? course.acaPercent : (tuition > 0 ? Math.round((rPass / tuition) * 1000) / 10 : 10);

    const rewardSelfEl = document.getElementById('courseInputRewardSelf');
    if (rewardSelfEl) rewardSelfEl.value = rSelf;
    document.getElementById('courseInputSelfPercent').value = pSelf;

    const rewardPassEl = document.getElementById('courseInputRewardPass');
    if (rewardPassEl) rewardPassEl.value = rPass;
    document.getElementById('courseInputAcaPercent').value = pPass;

    document.getElementById('courseInputBadge').value = course.badge || '';
    if (document.getElementById('courseInputIcon')) {
        document.getElementById('courseInputIcon').value = course.icon || 'crown';
    }

    updateCourseRewardBiDirectional('init');

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

let lastEditedRewardSelfMode = 'money'; // 'money' | 'percent'
let lastEditedRewardPassMode = 'money'; // 'money' | 'percent'

function updateCourseRewardBiDirectional(trigger = 'init') {
    const tuitionInput = document.getElementById('courseInputTuition');
    const rewardSelfInput = document.getElementById('courseInputRewardSelf');
    const selfPercentInput = document.getElementById('courseInputSelfPercent');
    const rewardPassInput = document.getElementById('courseInputRewardPass');
    const acaPercentInput = document.getElementById('courseInputAcaPercent');
    const badgeSelfSummary = document.getElementById('badgeSelfSummary');
    const badgeAcaSummary = document.getElementById('badgeAcaSummary');
    const previewSelf = document.getElementById('coursePreviewSelfReward');
    const previewAca = document.getElementById('coursePreviewAcaReward');

    if (!tuitionInput) return;
    const tuition = parseInt(tuitionInput.value, 10) || 0;

    // 1. Tự chốt
    if (trigger === 'self_money') {
        lastEditedRewardSelfMode = 'money';
        const money = parseInt(rewardSelfInput?.value, 10) || 0;
        if (tuition > 0 && selfPercentInput) {
            const pct = Math.round((money / tuition) * 1000) / 10;
            selfPercentInput.value = pct;
        }
    } else if (trigger === 'self_percent') {
        lastEditedRewardSelfMode = 'percent';
        const pct = parseFloat(selfPercentInput?.value) || 0;
        if (tuition > 0 && rewardSelfInput) {
            const money = Math.round(tuition * pct / 100);
            rewardSelfInput.value = money;
        }
    }

    // 2. Nhờ ACA chốt
    if (trigger === 'pass_money') {
        lastEditedRewardPassMode = 'money';
        const money = parseInt(rewardPassInput?.value, 10) || 0;
        if (tuition > 0 && acaPercentInput) {
            const pct = Math.round((money / tuition) * 1000) / 10;
            acaPercentInput.value = pct;
        }
    } else if (trigger === 'pass_percent') {
        lastEditedRewardPassMode = 'percent';
        const pct = parseFloat(acaPercentInput?.value) || 0;
        if (tuition > 0 && rewardPassInput) {
            const money = Math.round(tuition * pct / 100);
            rewardPassInput.value = money;
        }
    }

    // 3. Khi thay đổi học phí niêm yết (tuition)
    if (trigger === 'tuition') {
        if (tuition > 0) {
            if (lastEditedRewardSelfMode === 'money') {
                const money = parseInt(rewardSelfInput?.value, 10) || 0;
                if (money > 0 && selfPercentInput) {
                    selfPercentInput.value = Math.round((money / tuition) * 1000) / 10;
                }
            } else {
                const pct = parseFloat(selfPercentInput?.value) || 0;
                if (pct > 0 && rewardSelfInput) {
                    rewardSelfInput.value = Math.round(tuition * pct / 100);
                }
            }

            if (lastEditedRewardPassMode === 'money') {
                const money = parseInt(rewardPassInput?.value, 10) || 0;
                if (money > 0 && acaPercentInput) {
                    acaPercentInput.value = Math.round((money / tuition) * 1000) / 10;
                }
            } else {
                const pct = parseFloat(acaPercentInput?.value) || 0;
                if (pct > 0 && rewardPassInput) {
                    rewardPassInput.value = Math.round(tuition * pct / 100);
                }
            }
        }
    }

    // 4. Cập nhật preview & badges hiển thị
    const currentRewardSelf = parseInt(rewardSelfInput?.value, 10) || 0;
    const currentPercentSelf = parseFloat(selfPercentInput?.value) || 0;
    const currentRewardPass = parseInt(rewardPassInput?.value, 10) || 0;
    const currentPercentAca = parseFloat(acaPercentInput?.value) || 0;

    const shortSelf = DataManager.formatMoneyShort ? DataManager.formatMoneyShort(currentRewardSelf) : currentRewardSelf;
    const shortPass = DataManager.formatMoneyShort ? DataManager.formatMoneyShort(currentRewardPass) : currentRewardPass;

    if (badgeSelfSummary) {
        badgeSelfSummary.textContent = `${shortSelf} (${currentPercentSelf}%)`;
    }
    if (previewSelf) {
        previewSelf.textContent = `${shortSelf} (${currentRewardSelf.toLocaleString('vi-VN')} đ)`;
    }

    if (badgeAcaSummary) {
        badgeAcaSummary.textContent = `${shortPass} (${currentPercentAca}%)`;
    }
    if (previewAca) {
        previewAca.textContent = `${shortPass} (${currentRewardPass.toLocaleString('vi-VN')} đ)`;
    }
}
window.updateCourseRewardPreview = () => updateCourseRewardBiDirectional('init');

function handleSaveCourseSubmit(e) {
    e.preventDefault();
    if (!canCurrentRolePerform('config_courses')) {
        alert(`Bạn không có quyền lưu thay đổi khóa học! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
        return;
    }
    const editId = document.getElementById('courseEditId')?.value?.trim();
    const name = document.getElementById('courseInputName')?.value?.trim();
    const showOnWiki = document.getElementById('courseInputShowOnWiki')?.checked !== false;
    const image = document.getElementById('courseInputImage')?.value?.trim() || '';
    const targetAudience = document.getElementById('courseInputTargetAudience')?.value?.trim() || '';
    const curriculum = document.getElementById('courseInputCurriculum')?.value?.trim() || '';
    const duration = document.getElementById('courseInputDuration')?.value?.trim() || '1 - 2 tuần';
    const modelCount = document.getElementById('courseInputModelCount')?.value?.trim() || 'Theo giáo trình';
    const modelCost = document.getElementById('courseInputModelCost')?.value?.trim() || 'Miễn phí';

    const tuition = parseInt(document.getElementById('courseInputTuition')?.value, 10) || 0;
    const discountInputVal = document.getElementById('courseInputDiscountPrice')?.value;
    const discountPrice = (discountInputVal !== '' && discountInputVal !== undefined && discountInputVal !== null)
        ? parseInt(discountInputVal, 10)
        : tuition;

    const scholarship = parseInt(document.getElementById('courseInputScholarship')?.value, 10) || 0;
    const scholarshipNote = document.getElementById('courseInputScholarshipNote')?.value?.trim() || '';
    const selfPercent = parseFloat(document.getElementById('courseInputSelfPercent')?.value) || 0;
    const acaPercent = parseFloat(document.getElementById('courseInputAcaPercent')?.value) || 0;

    const rewardSelfInputVal = document.getElementById('courseInputRewardSelf')?.value;
    const rewardSelf = (rewardSelfInputVal !== '' && rewardSelfInputVal !== undefined && rewardSelfInputVal !== null)
        ? parseInt(rewardSelfInputVal, 10)
        : Math.round(tuition * selfPercent / 100);

    const rewardPassInputVal = document.getElementById('courseInputRewardPass')?.value;
    const rewardPass = (rewardPassInputVal !== '' && rewardPassInputVal !== undefined && rewardPassInputVal !== null)
        ? parseInt(rewardPassInputVal, 10)
        : Math.round(tuition * acaPercent / 100);

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
        showOnWiki,
        image,
        targetAudience,
        curriculum,
        duration,
        modelCount,
        modelCost,
        tuition,
        discountPrice,
        scholarship,
        scholarshipNote,
        selfPercent,
        acaPercent,
        rewardSelf,
        rewardPass,
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

    // Đồng bộ lập tức ra toàn bộ giao diện: Wiki cẩm nang, Mobile reward card, máy tính thưởng, dropdown chọn khóa
    if (typeof renderWikiCourses === 'function') renderWikiCourses();
    if (typeof initRewardMobileCards === 'function') initRewardMobileCards();
    if (typeof populateCourseSelects === 'function') populateCourseSelects();
    if (typeof initRewardCalculator === 'function') initRewardCalculator();

    alert(editId ? `Đã cập nhật khóa học "${name}" thành công!` : `Đã thêm khóa học mới "${name}" thành công!`);
}

window.deleteCourseConfirm = function(id) {
    if (!canCurrentRolePerform('config_courses')) {
        alert(`Bạn không có quyền xóa khóa học! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
        return;
    }
    const courses = DataManager.getCourses(selectedAdminCampaignId);
    const course = courses.find(c => c.id === id);
    const courseName = course ? course.name : id;

    if (confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseName}" khỏi mẫu bảng thưởng này?`)) {
        DataManager.deleteCourse(id, selectedAdminCampaignId);
        renderAdminCoursesTable();

        if (typeof renderWikiCourses === 'function') renderWikiCourses();
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
    if (!canCurrentRolePerform('config_courses')) {
        alert(`Bạn không có quyền nhân bản mẫu bảng thưởng! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
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
    if (!canCurrentRolePerform('config_courses')) {
        alert(`Bạn không có quyền tạo mẫu bảng thưởng mới! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
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
    if (!canCurrentRolePerform('config_courses')) {
        alert(`Bạn không có quyền chỉnh sửa thông tin kỳ bảng thưởng! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
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
    if (!canCurrentRolePerform('config_courses')) {
        alert(`Bạn không có quyền lưu thông tin kỳ bảng thưởng! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
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
    if (!canCurrentRolePerform('config_courses')) {
        alert(`Bạn không có quyền kích hoạt bảng thưởng! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
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
    if (!canCurrentRolePerform('config_courses')) {
        alert(`Bạn không có quyền xóa mẫu bảng thưởng! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
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

// ==========================================================================
// 12. QUẢN LÝ & CẤP LẠI MẬT KHẨU THÀNH VIÊN DÀNH CHO ADMIN
// ==========================================================================

// Toggle ẩn / hiện mật khẩu trong các form nhập liệu
window.togglePasswordVisibility = function(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const icon = btn ? btn.querySelector('i') : null;
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    }
};

// Xem / Ẩn mật khẩu thành viên trong bảng
window.adminTogglePasswordReveal = function(userId, password) {
    const span = document.getElementById(`pwd_disp_${userId}`);
    const icon = document.getElementById(`pwd_icon_${userId}`);
    if (!span) return;
    if (span.textContent === '••••••') {
        span.textContent = password || '123456';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    } else {
        span.textContent = '••••••';
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
};

// Mở modal cấp lại mật khẩu cho thành viên
window.adminOpenResetPasswordModal = function(userId, name, identifier, currentPassword) {
    if (!canCurrentRolePerform('approve_members')) {
        alert(`Bạn không có quyền quản trị mật khẩu thành viên! Vui lòng liên hệ ${getAdminRoleDisplayName()}.`);
        return;
    }
    const modal = document.getElementById('adminResetPasswordModal');
    if (!modal) return;

    const idInput = document.getElementById('resetTargetUserId');
    const nameEl = document.getElementById('resetTargetUserName');
    const identEl = document.getElementById('resetTargetUserIdentifier');
    const curPwdEl = document.getElementById('resetTargetCurrentPassword');
    const newPwdInput = document.getElementById('resetNewPasswordInput');

    if (idInput) idInput.value = userId;
    if (nameEl) nameEl.textContent = name || 'Thành viên';
    if (identEl) identEl.textContent = identifier || '';
    if (curPwdEl) curPwdEl.textContent = currentPassword || '123456';
    if (newPwdInput) {
        newPwdInput.value = '';
        newPwdInput.type = 'password';
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => { if (newPwdInput) newPwdInput.focus(); }, 100);
};

// Đóng modal cấp lại mật khẩu
window.closeAdminResetPasswordModal = function() {
    const modal = document.getElementById('adminResetPasswordModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    const newPwdInput = document.getElementById('resetNewPasswordInput');
    if (newPwdInput) newPwdInput.value = '';
};

// Xử lý submit form cấp lại mật khẩu
function handleAdminResetPasswordSubmit(e) {
    e.preventDefault();
    if (!canCurrentRolePerform('approve_members')) {
        alert('Bạn không có quyền cấp lại mật khẩu thành viên!');
        return;
    }
    const userId = document.getElementById('resetTargetUserId')?.value;
    const newPassword = document.getElementById('resetNewPasswordInput')?.value?.trim();

    if (!userId) {
        alert('Không tìm thấy mã thành viên!');
        return;
    }
    if (!newPassword || newPassword.length < 6) {
        alert('Mật khẩu mới phải có tối thiểu 6 ký tự!');
        return;
    }

    const updated = DataManager.resetUserPassword(userId, newPassword);
    if (updated) {
        closeAdminResetPasswordModal();
        refreshAdminDashboard();
        if (typeof updateUserSessionUI === 'function') updateUserSessionUI();
        alert(`Đã cấp lại mật khẩu thành công cho ${updated.name}!\nMật khẩu mới là: ${newPassword}`);
    } else {
        alert('Có lỗi xảy ra khi cập nhật mật khẩu.');
    }
}

