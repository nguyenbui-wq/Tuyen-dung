// ==========================================================================
// WINGS BEAUTY & ACADEMY - FRONTEND APPLICATION SCRIPT (MOBILE-FIRST iPHONE)
// Tối ưu hóa chuyển tab iOS, Thẻ khóa học di động & Thao tác cảm ứng ngón cái
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    if (typeof applyWingsThemeUI === 'function') {
        applyWingsThemeUI(typeof getWingsThemeMode === 'function' ? getWingsThemeMode() : 'nursery');
    }
    initIosBottomTabBar();
    initRewardMobileCards();
    initRewardCalculator();
    if (typeof renderWikiCourses === 'function') renderWikiCourses();
    initUserAuth();
    initLeadForm();
    initBananaMiniGame();
    initGameRegistrationProof();
    initTracking();
    initPublicLeaderboard();
    initPosterModal();
    initTouchChips();
    initUserProfileModal();
    updateUserSessionUI();
    checkImpersonationState();
});

// ==========================================================================
// 0. BỘ CẬP NHẬT GIAO DIỆN THEO 2 CHẾ ĐỘ: VƯỜN ƯƠM CẢM XÚC ⇄ BẢN THÔ TIÊU CHUẨN
// ==========================================================================
function applyWingsThemeUI(mode) {
    const validMode = (mode === 'standard') ? 'standard' : 'nursery';
    const cfg = (typeof WINGS_THEME_CONFIG !== 'undefined' && WINGS_THEME_CONFIG[validMode]) 
        ? WINGS_THEME_CONFIG[validMode] 
        : null;
    if (!cfg) return;

    // 1. Nút chuyển đổi trên Header
    const btnTheme = document.getElementById('btnToggleThemeMode');
    const iconTheme = document.getElementById('themeModeIcon');
    const labelTheme = document.getElementById('themeModeLabel');
    if (iconTheme) iconTheme.textContent = cfg.icon;
    if (labelTheme) labelTheme.textContent = cfg.shortName;
    if (btnTheme) {
        btnTheme.className = `relative px-2 sm:px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 min-h-[34px] active:scale-95 transition-all shadow-sm cursor-pointer select-none ${cfg.buttonClass}`;
        btnTheme.title = (validMode === 'nursery')
            ? 'Đang ở: Thế giới cảm xúc Vườn Ươm Wings. Bấm để chuyển sang Phiên bản thô tiêu chuẩn'
            : 'Đang ở: Phiên bản thô tiêu chuẩn. Bấm để chuyển sang Thế giới cảm xúc Vườn Ươm Wings';
    }

    // 2. Screen 2: Hero & Thể lệ
    const badgeHero = document.getElementById('badgeHeroTheme');
    if (badgeHero) badgeHero.innerHTML = cfg.hero.badgeHtml;

    const bannerQuote = document.getElementById('bannerQuotePhilosophy');
    if (bannerQuote) {
        bannerQuote.innerHTML = `
            <p class="${validMode === 'nursery' ? 'font-serif italic text-amber-200' : 'font-sans font-bold text-amber-300 uppercase tracking-wider'} text-xs sm:text-sm leading-relaxed">
                ${cfg.quote.title}
            </p>
            <div class="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">
                ${cfg.quote.sub}
            </div>
        `;
    }

    const titleHero = document.getElementById('titleHeroTheme');
    if (titleHero) {
        titleHero.innerHTML = `
            ${cfg.hero.titleLine1} <br>
            <span class="gold-foil-text drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                ${cfg.hero.titleLine2}
            </span>
        `;
    }

    const descHero = document.getElementById('descHeroTheme');
    if (descHero) descHero.innerHTML = cfg.hero.descHtml;

    const storyBoxTitle = document.getElementById('storyBoxTitle');
    if (storyBoxTitle) storyBoxTitle.innerHTML = cfg.storyBox.title;

    const storyBoxSubtitle = document.getElementById('storyBoxSubtitle');
    if (storyBoxSubtitle) storyBoxSubtitle.textContent = cfg.storyBox.subtitle;

    const storyBoxGrid = document.getElementById('storyBoxGrid');
    if (storyBoxGrid) {
        let gridHtml = '';
        cfg.storyBox.items.forEach(it => {
            gridHtml += `
                <div class="flex items-start gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span class="text-base">${it.icon}</span>
                    <div>
                        <strong class="${validMode === 'nursery' ? 'text-amber-300' : 'text-yellow-300'}">${it.title}</strong>
                        <span class="text-slate-300 block text-[10px] leading-tight">${it.desc}</span>
                    </div>
                </div>
            `;
        });
        storyBoxGrid.innerHTML = gridHtml;
    }

    const storyBoxSteps = document.getElementById('storyBoxSteps');
    if (storyBoxSteps) {
        const stepColors = ['text-blue-300', 'text-amber-300', 'text-purple-300', 'text-cyan-300', 'text-emerald-400'];
        let stepsHtml = '';
        cfg.storyBox.steps.forEach((st, idx) => {
            const colorCls = stepColors[idx] || 'text-white';
            stepsHtml += `<span class="${colorCls} font-bold whitespace-nowrap">${st}</span>`;
            if (idx < cfg.storyBox.steps.length - 1) {
                stepsHtml += `<span class="text-slate-600">➔</span>`;
            }
        });
        storyBoxSteps.innerHTML = stepsHtml;
    }

    // 2 Option Cards
    const hOpt1Title = document.getElementById('heroOpt1Title');
    const hOpt1Rate = document.getElementById('heroOpt1Rate');
    const hOpt1Desc = document.getElementById('heroOpt1Desc');
    if (hOpt1Title) hOpt1Title.textContent = cfg.options.opt1Title;
    if (hOpt1Rate) hOpt1Rate.textContent = `${cfg.options.opt1Rate} ${cfg.options.opt1RateSub}`;
    if (hOpt1Desc) hOpt1Desc.textContent = cfg.options.opt1Desc;

    const hOpt2Title = document.getElementById('heroOpt2Title');
    const hOpt2Rate = document.getElementById('heroOpt2Rate');
    const hOpt2Desc = document.getElementById('heroOpt2Desc');
    if (hOpt2Title) hOpt2Title.textContent = cfg.options.opt2Title;
    if (hOpt2Rate) hOpt2Rate.textContent = `${cfg.options.opt2Rate} ${cfg.options.opt2RateSub}`;
    if (hOpt2Desc) hOpt2Desc.textContent = cfg.options.opt2Desc;

    const btnHeroCta = document.getElementById('btnHeroCta');
    if (btnHeroCta) btnHeroCta.innerHTML = cfg.hero.ctaHtml;

    // 3. Screen 3: Lead Form
    const lfBadge = document.getElementById('leadFormBadge');
    if (lfBadge) lfBadge.innerHTML = cfg.screen3.badge;

    const lfTitle = document.getElementById('leadFormTitle');
    if (lfTitle) lfTitle.textContent = cfg.screen3.title;

    const lfSubtitle = document.getElementById('leadFormSubtitle');
    if (lfSubtitle) lfSubtitle.textContent = cfg.screen3.subtitle;

    const lfSec1 = document.getElementById('leadFormSection1Title');
    if (lfSec1) lfSec1.textContent = cfg.screen3.sec1;

    const lfSec2 = document.getElementById('leadFormSection2Title');
    if (lfSec2) lfSec2.textContent = cfg.screen3.sec2;

    const lfSec2Icon = document.getElementById('leadFormSection2Icon');
    if (lfSec2Icon) lfSec2Icon.className = (validMode === 'nursery') ? 'fa-solid fa-seedling text-emerald-400 text-sm' : 'fa-solid fa-list-check text-blue-400 text-sm';

    const lfSec3 = document.getElementById('leadFormSection3Title');
    if (lfSec3) lfSec3.textContent = cfg.screen3.sec3Label;

    const rPass = document.getElementById('leadRadioPassSpan');
    if (rPass) rPass.innerHTML = cfg.screen3.radioPass;

    const rSelf = document.getElementById('leadRadioSelfSpan');
    if (rSelf) rSelf.innerHTML = cfg.screen3.radioSelf;

    const btnSubmit = document.getElementById('btnSubmitLead');
    if (btnSubmit) btnSubmit.innerHTML = cfg.screen3.submitBtn;

    // 4. Bottom Nav Bar Tab 2
    const bIcon = document.getElementById('bottomNavTab2Icon');
    const bLabel = document.getElementById('bottomNavTab2Label');
    if (bIcon) bIcon.className = cfg.navTab2.icon;
    if (bLabel) bLabel.textContent = cfg.navTab2.label;

    // 5. Screen 6: Dashboard "Tôi"
    const kpiTotal = document.getElementById('ctvKpiTitleTotal');
    const kpiWon = document.getElementById('ctvKpiTitleWon');
    const kpiPaid = document.getElementById('ctvKpiTitlePaid');
    const kpiUpcoming = document.getElementById('ctvKpiTitleUpcoming');

    if (kpiTotal) kpiTotal.textContent = cfg.screen6.kpiTotal;
    if (kpiWon) kpiWon.textContent = cfg.screen6.kpiWon;
    if (kpiPaid) kpiPaid.textContent = cfg.screen6.kpiPaid;
    if (kpiUpcoming) {
        kpiUpcoming.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles text-yellow-400"></i> ${cfg.screen6.kpiUpcoming}`;
    }

    const pipeTitle = document.getElementById('ctvPipelineBreakdownTitle');
    if (pipeTitle) pipeTitle.textContent = cfg.screen6.pipelineTitle;

    const pipePot = document.getElementById('ctvPipelinePotentialLabel');
    if (pipePot) pipePot.textContent = cfg.screen6.pipelinePotential;

    const stTitle = document.getElementById('ctvStepperSectionTitle');
    if (stTitle) stTitle.textContent = cfg.screen6.stepperTitle;

    const stSub = document.getElementById('ctvStepperSectionSubtitle');
    if (stSub) stSub.textContent = cfg.screen6.stepperSubtitle;

    const stIcon = document.getElementById('ctvStepperSectionIcon');
    if (stIcon) stIcon.className = (validMode === 'nursery') ? 'fa-solid fa-seedling text-amber-400 text-sm' : 'fa-solid fa-timeline text-amber-400 text-sm';

    const btnGieo = document.getElementById('ctvBtnGieoThem');
    if (btnGieo) btnGieo.textContent = (validMode === 'nursery') ? 'Gieo Thêm Hạt Giống' : 'Nộp Thêm Data Mới';

    const tabCare = document.getElementById('ctvTabLabel_CARE');
    const tabCheckin = document.getElementById('ctvTabLabel_CHECKIN');
    const tabTraining = document.getElementById('ctvTabLabel_TRAINING');
    const tabWon = document.getElementById('ctvTabLabel_WON');

    if (tabCare) tabCare.textContent = cfg.screen6.filterCare;
    if (tabCheckin) tabCheckin.textContent = cfg.screen6.filterCheckin;
    if (tabTraining) tabTraining.textContent = cfg.screen6.filterTraining;
    if (tabWon) tabWon.textContent = cfg.screen6.filterWon;

    // 6. Cập nhật lại Dashboard cá nhân nếu đang có user
    const curUser = (typeof DataManager !== 'undefined' && DataManager.getCurrentUser) ? DataManager.getCurrentUser() : null;
    if (curUser && typeof renderCollaboratorDashboard === 'function') {
        renderCollaboratorDashboard(curUser);
    }

    // 7. Header Admin Button (Kiểm Lâm / Admin)
    const adminBtn = document.getElementById('btnOpenAdminAuth');
    const adminIcon = document.getElementById('adminNavIcon');
    const adminLabel = document.getElementById('adminNavLabel');
    if (cfg.adminNav) {
        if (adminIcon) adminIcon.className = cfg.adminNav.icon;
        if (adminLabel) adminLabel.textContent = cfg.adminNav.label;
        if (adminBtn) adminBtn.title = cfg.adminNav.title;
    }

    // 8. Embedded Admin Panel (Screen 7) & Modal Auth
    const adminBadge = document.getElementById('adminPanelBadge');
    const adminTitle = document.getElementById('adminPanelTitle');
    if (adminBadge) {
        adminBadge.textContent = (validMode === 'nursery') ? '🌲 KIỂM LÂM PANEL' : 'ADMIN PANEL';
        adminBadge.className = (validMode === 'nursery')
            ? 'text-[10px] font-bold text-emerald-400 uppercase tracking-wider block'
            : 'text-[10px] font-bold text-purple-400 uppercase tracking-wider block';
    }
    if (adminTitle) {
        adminTitle.textContent = (validMode === 'nursery') ? 'Kiểm Lâm & Duyệt Vườn Ươm' : 'Quản Trị & Duyệt';
    }

    const authModalIcon = document.getElementById('adminAuthModalIcon');
    const authModalTitle = document.getElementById('adminAuthModalTitle');
    const authModalDesc = document.getElementById('adminAuthModalDesc');
    if (cfg.adminNav) {
        if (authModalIcon) authModalIcon.innerHTML = `<i class="fa-solid ${(validMode === 'nursery') ? 'fa-tree' : 'fa-shield-halved'}"></i>`;
        if (authModalTitle) authModalTitle.textContent = cfg.adminNav.modalTitle;
        if (authModalDesc) authModalDesc.textContent = cfg.adminNav.modalDesc;
    }

    // 9. Bottom Nav Bar Tab 4 (Bảng Xếp Hạng / Vinh Danh)
    const tab4Label = document.getElementById('bottomNavTab4Label');
    if (tab4Label) {
        tab4Label.textContent = (validMode === 'nursery') ? 'Vinh Danh' : 'Xếp Hạng';
    }

    // 10. Screen 5: Bảng Xếp Hạng / Vinh Danh
    const lbBadge = document.getElementById('publicLbBadge');
    const lbTitle = document.getElementById('publicLbTitle');
    const lbSubtitle = document.getElementById('publicLbSubtitle');
    const lbDataIcon = document.getElementById('btnPublicLbDataIcon');
    const lbDataLabel = document.getElementById('btnPublicLbDataLabel');

    if (cfg.leaderboard) {
        if (lbBadge) lbBadge.innerHTML = cfg.leaderboard.badge;
        if (lbTitle) lbTitle.textContent = cfg.leaderboard.title;
        if (lbSubtitle) lbSubtitle.textContent = cfg.leaderboard.subtitle;
        if (lbDataIcon) lbDataIcon.textContent = cfg.leaderboard.tabDataIcon;
        if (lbDataLabel) lbDataLabel.textContent = cfg.leaderboard.tabDataLabel;
    }

    if (typeof renderPublicLeaderboard === 'function') {
        renderPublicLeaderboard();
    }
}
window.applyWingsThemeUI = applyWingsThemeUI;

// ==========================================================================
// 1. THANH ĐIỀU HƯỚNG ĐÁY MÀN HÌNH CHUẨN iPHONE & BỘ ĐIỀU HƯỚNG 6 SCREENS (SPA ROUTER)
// ==========================================================================
window.navigateToScreen = function(screenId) {
    const screenMap = {
        'the-le': 'screen-home',
        'home': 'screen-home',
        'screen-home': 'screen-home',
        'form-dang-ky': 'screen-lead-form',
        'lead-form': 'screen-lead-form',
        'screen-lead-form': 'screen-lead-form',
        'mini-game': 'screen-mini-game',
        'screen-mini-game': 'screen-mini-game',
        'bang-xep-hang': 'screen-leaderboard',
        'leaderboard': 'screen-leaderboard',
        'screen-leaderboard': 'screen-leaderboard',
        'tra-cuu': 'screen-search-dashboard',
        'search-dashboard': 'screen-search-dashboard',
        'screen-search-dashboard': 'screen-search-dashboard',
        'toi': 'screen-search-dashboard',
        'screen-me': 'screen-search-dashboard',
        'admin': 'screen-admin',
        'screen-admin': 'screen-admin',
        'adminDashboardSection': 'screen-admin'
    };

    const targetScreen = screenMap[screenId] || screenId;
    const allScreens = [
        'screen-home',
        'screen-lead-form',
        'screen-mini-game',
        'screen-leaderboard',
        'screen-search-dashboard',
        'screen-admin'
    ];

    allScreens.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === targetScreen) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });

    // Cập nhật trạng thái active trên các tab đáy màn hình
    const tabItems = document.querySelectorAll('.ios-tab-item');
    tabItems.forEach(tab => {
        const dScreen = tab.getAttribute('data-screen');
        const dTarget = tab.getAttribute('data-target');
        if (dScreen === targetScreen || screenMap[dTarget] === targetScreen) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Chuyển thẳng sang trang quản trị admin.html (Hình 3) - Không mở giao diện nhúng trung gian Hình 2
    if (targetScreen === 'screen-admin') {
        window.location.href = 'admin.html';
        return;
    }

    // Cuộn mượt
    if (screenId === 'tra-cuu') {
        const traCuuEl = document.getElementById('tra-cuu');
        if (traCuuEl) {
            traCuuEl.scrollIntoView({ behavior: 'smooth' });
            return;
        }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.openAdminPinModalFromScreen6 = function() {
    const authModal = document.getElementById('adminAuthModal');
    const pinInput = document.getElementById('adminPinInput');
    const authError = document.getElementById('adminAuthError');
    if (authModal) {
        authModal.classList.remove('hidden');
        authModal.classList.add('flex');
        if (pinInput) {
            pinInput.value = '';
            setTimeout(() => pinInput.focus(), 150);
        }
        if (authError) authError.classList.add('hidden');
    }
};

function initIosBottomTabBar() {
    const tabItems = document.querySelectorAll('.ios-tab-item');
    if (!tabItems.length) return;

    tabItems.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.getAttribute('data-screen') || tab.getAttribute('data-target');
            if (target && typeof window.navigateToScreen === 'function') {
                window.navigateToScreen(target);
            }
        });
    });
}


// ==========================================================================
// 2. RENDER BẢNG THƯỞNG THEO KHÓA HỌC (DẠNG TABLE ĐƠN GIẢN + NÚT CHỌN 1 CHẠM)
// ==========================================================================
function initRewardMobileCards() {
    const tableBody = document.getElementById('rewardTableBody');
    const courses = DataManager.getCourses();

    // 1. Cập nhật Banner Chiến Dịch Đang Áp Dụng (Tên mẫu & thời gian diễn ra)
    const activeCampaign = DataManager.getActiveCampaign ? DataManager.getActiveCampaign() : null;
    const nameDisplay = document.getElementById('campaignNameDisplay');
    const periodDisplay = document.getElementById('campaignPeriodDisplay');
    if (activeCampaign) {
        if (nameDisplay) nameDisplay.textContent = activeCampaign.name || 'Bảng Thưởng Tuyển Sinh';
        if (periodDisplay) {
            const startStr = DataManager.formatDateShort ? DataManager.formatDateShort(activeCampaign.startDate) : (activeCampaign.startDate || '');
            const endStr = DataManager.formatDateShort ? DataManager.formatDateShort(activeCampaign.endDate) : (activeCampaign.endDate || '');
            periodDisplay.textContent = `${startStr} - ${endStr}`;
        }
    }

    // 2. Render Table Bảng Thưởng (Chuẩn phong cách poster: Tinh gọn, số tiền rút gọn M/K, vừa khít điện thoại)
    if (tableBody) {
        let html = '';
        courses.forEach((c, idx) => {
            const isHighlight = c.id && c.id.includes('combo');
            const rowBg = idx % 2 === 0 ? 'bg-[#fffdf8]' : 'bg-[#f8eed6]';
            
            // Biểu tượng chuẩn theo poster
            let iconHtml = '<i class="fa-solid fa-gem text-amber-700 text-xs mr-1"></i>';
            if (c.icon === 'crown' || c.id.includes('tinhhoa') || c.id.includes('volume') || c.id.includes('thietke')) {
                iconHtml = '<i class="fa-solid fa-crown text-amber-700 text-xs mr-1"></i>';
            } else if (c.icon === 'award' || c.id.includes('combo_uudai')) {
                iconHtml = '<i class="fa-solid fa-award text-amber-700 text-xs mr-1"></i>';
            } else if (c.icon === 'dollar-sign' || c.id.includes('combo_khonguudai')) {
                iconHtml = '<i class="fa-solid fa-dollar-sign text-amber-700 text-xs mr-1"></i>';
            } else if (c.icon) {
                iconHtml = `<i class="fa-solid fa-${c.icon} text-amber-700 text-xs mr-1"></i>`;
            }

            const tuitionShort = c.tuitionFormatted || (DataManager.formatMoneyShort ? DataManager.formatMoneyShort(c.tuition) : c.tuition);
            const rewardSelfShort = c.rewardSelfFormatted || (DataManager.formatMoneyShort ? DataManager.formatMoneyShort(c.rewardSelf) : c.rewardSelf);
            const rewardPassShort = c.rewardPassFormatted || (DataManager.formatMoneyShort ? DataManager.formatMoneyShort(c.rewardPass) : c.rewardPass);

            const scholarshipNoteHtml = (c.scholarship > 0 || c.scholarshipNote) ? `
                <div class="text-[9px] text-amber-800 font-medium italic mt-0.5 leading-none">
                    🎁 ${c.scholarshipFormatted ? `Tài trợ ${c.scholarshipFormatted}` : c.scholarshipNote}
                </div>
            ` : '';

            html += `
                <tr class="${rowBg} border-b border-amber-200/70 hover:bg-amber-100 transition-colors">
                    <!-- Cột 1: Tên Khóa Học + Icon chuẩn poster -->
                    <td class="py-2.5 px-2 sm:px-3">
                        <div class="flex items-center">
                            ${iconHtml}
                            <span class="font-bold text-stone-900 text-[11px] sm:text-xs leading-snug">${c.name}</span>
                        </div>
                        ${scholarshipNoteHtml}
                    </td>
                    <!-- Cột 2: Học Phí (Rút gọn như poster: 1,9M, 5,9M, 9,9M...) -->
                    <td class="py-2.5 px-1 sm:px-2 text-center font-mono font-bold text-stone-800 text-[11px] sm:text-xs whitespace-nowrap">
                        ${tuitionShort}
                    </td>
                    <!-- Cột 3: Thưởng Tự Chốt 100% (500K, 1M, 2M, 4M, 7M...) -->
                    <td class="py-2.5 px-1 sm:px-2 text-center whitespace-nowrap">
                        <strong class="font-mono font-black text-stone-950 text-xs sm:text-sm block leading-none">
                            ${rewardSelfShort}
                        </strong>
                    </td>
                    <!-- Cột 4: Thưởng Đưa Data 50% (250K, 500K, 1M, 2M, 3,5M...) -->
                    <td class="py-2.5 px-1 sm:px-2 text-center whitespace-nowrap">
                        <strong class="font-mono font-black text-stone-950 text-xs sm:text-sm block leading-none">
                            ${rewardPassShort}
                        </strong>
                    </td>
                    <!-- Cột 5: Nút Chọn 1-Chạm Bên Cạnh -->
                    <td class="py-2.5 px-2 text-right whitespace-nowrap">
                        <button type="button" onclick="quickSelectCourseForLead('${c.id}')" class="px-2 py-1 rounded-md bg-stone-900 hover:bg-black text-amber-300 font-extrabold text-[10px] sm:text-xs active:scale-95 shadow border border-amber-400/40 inline-flex items-center gap-1 transition-all" title="Bấm chọn khóa này để nộp data">
                            <i class="fa-solid fa-check text-[9px]"></i>
                            <span>Chọn</span>
                        </button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    }

    populateCourseSelects();
}

// Bấm 1 chạm chọn ngay khóa học trên điện thoại và cuộn đến form nộp data
window.quickSelectCourseForLead = function(courseId) {
    const select = document.getElementById('interestCourse');
    if (select) {
        select.value = courseId;
        select.dispatchEvent(new Event('change'));
    }
    if (typeof window.navigateToScreen === 'function') {
        window.navigateToScreen('screen-lead-form');
    }
    if (typeof showToast === 'function') {
        const courses = (DataManager.getCourses ? DataManager.getCourses() : []);
        const found = courses.find(item => item.id === courseId);
        showToast(`Đã chọn: ${found ? found.name : 'Khóa học'}`, 'success');
    }
};

// ==========================================================================
// 2.2. WIKI CẨM NANG CONTROLLER (BẢNG THƯỞNG - THỂ LỆ GAME - KHÓA HỌC)
// ==========================================================================
window.switchWikiTab = function(tabName) {
    const tabs = ['reward', 'game', 'courses'];
    tabs.forEach(t => {
        const btn = document.getElementById(`wikiTabBtn_${t}`);
        const pane = document.getElementById(`wikiContent_${t}`);
        if (t === tabName) {
            if (btn) {
                btn.className = 'wiki-tab-btn active flex-1 py-2 px-1.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md';
                const icon = btn.querySelector('i');
                if (icon && t === 'reward') icon.className = 'fa-solid fa-money-bill-wave text-stone-950 text-xs';
                if (icon && t === 'courses') icon.className = 'fa-solid fa-graduation-cap text-stone-950 text-xs';
            }
            if (pane) {
                pane.classList.remove('hidden');
            }
            if (t === 'reward') {
                if (typeof initRewardMobileCards === 'function') initRewardMobileCards();
                if (typeof initRewardCalculator === 'function') initRewardCalculator();
            }
            if (t === 'courses') {
                if (typeof renderWikiCourses === 'function') renderWikiCourses();
            }
        } else {
            if (btn) {
                btn.className = 'wiki-tab-btn flex-1 py-2 px-1.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 text-slate-400 hover:text-white';
                const icon = btn.querySelector('i');
                if (icon && t === 'reward') icon.className = 'fa-solid fa-money-bill-wave text-amber-400 text-xs';
                if (icon && t === 'courses') icon.className = 'fa-solid fa-graduation-cap text-amber-400 text-xs';
            }
            if (pane) {
                pane.classList.add('hidden');
            }
        }
    });
};

// ==========================================================================
// 2.3. RENDER DANH SÁCH KHÓA HỌC TRÊN WIKI (ĐỒNG BỘ ĐỘNG VỚI BẢNG THƯỞNG)
// ==========================================================================
window.renderWikiCourses = function() {
    const container = document.getElementById('wikiCoursesListContainer');
    if (!container) return;

    const courses = (DataManager.getCourses ? DataManager.getCourses() : []);
    // Lọc các khóa học được quản trị viên cho phép hiển thị trên WIKI
    const wikiCourses = courses.filter(c => c.showOnWiki !== false);

    if (wikiCourses.length === 0) {
        container.innerHTML = `
            <div class="gold-card p-6 text-center rounded-2xl space-y-2 border border-amber-500/20">
                <i class="fa-solid fa-graduation-cap text-3xl text-amber-400/50"></i>
                <h4 class="text-sm font-bold text-white">Chưa Có Khóa Học Nào Bật Hiển Thị</h4>
                <p class="text-xs text-slate-400">Các khóa học đang được cập nhật hoặc tạm ẩn. Vui lòng quay lại sau!</p>
            </div>
        `;
        return;
    }

    let html = '';
    wikiCourses.forEach((c) => {
        // Icon
        let iconHtml = '👑';
        if (c.icon === 'gem') iconHtml = '💎';
        else if (c.icon === 'shield') iconHtml = '🛡️';
        else if (c.icon === 'award') iconHtml = '🏆';
        else if (c.icon === 'star') iconHtml = '⭐';
        else if (c.icon === 'crown') iconHtml = '👑';
        else if (c.icon === 'graduation-cap') iconHtml = '🎓';

        // Badge
        const badgeText = c.badge || (c.name.includes('Combo') ? 'HOT COMBO' : 'Khóa Chuyên Sâu');

        // Giá niêm yết & Giá ưu đãi
        const hasDiscount = c.discountPrice && c.discountPrice < c.tuition;
        const mainPriceNum = hasDiscount ? c.discountPrice : c.tuition;
        const originalPriceNum = c.tuition;

        // Ảnh bộ mi đại diện
        const fallbackImg = 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=600&q=80';
        const lashImage = c.image || fallbackImg;

        // Nội dung đào tạo tách theo dòng
        const curriculumLines = (c.curriculum || '')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        let curriculumHtml = '';
        if (curriculumLines.length > 0) {
            curriculumHtml = `
                <div class="p-3 rounded-xl bg-black/40 border border-amber-500/10 space-y-1.5 text-[11px]">
                    <div class="font-bold text-amber-300 text-[10px] uppercase flex items-center gap-1">
                        <i class="fa-solid fa-list-check text-amber-400"></i> Nội Dung Đào Tạo:
                    </div>
                    <ul class="text-slate-300 space-y-1 list-disc list-inside text-[11px] leading-relaxed">
                        ${curriculumLines.map(line => `<li>${line.replace(/^[•\-\*]\s*/, '')}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Học bổng tài trợ
        const scholarshipHtml = (c.scholarship > 0 || c.scholarshipNote) ? `
            <span class="text-[10px] text-emerald-400 font-bold block mt-0.5">
                🎁 ${c.scholarshipNote || `Tài trợ ${c.scholarshipFormatted || (DataManager.formatMoneyShort ? DataManager.formatMoneyShort(c.scholarship) : c.scholarship)} học bổng`}
            </span>
        ` : '';

        // Card style: highlight combo
        const isCombo = c.id && c.id.includes('combo');
        const cardClass = isCombo
            ? 'gold-card p-3.5 sm:p-4 rounded-2xl space-y-3 border-2 border-amber-400/80 bg-gradient-to-b from-amber-950/20 to-black shadow-xl hover:border-amber-400 transition-all'
            : 'gold-card p-3.5 sm:p-4 rounded-2xl space-y-3 border border-amber-500/20 bg-[#121622] shadow-xl hover:border-amber-400/40 transition-all';

        html += `
            <div class="${cardClass}">
                <!-- Header: Tên khóa học + Badge + Giá & Thời gian -->
                <div class="flex items-start justify-between gap-2 border-b border-amber-500/20 pb-2.5">
                    <div class="flex-1 pr-1">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30 inline-flex items-center gap-1 mb-1">
                            <span>${iconHtml}</span>
                            <span>${badgeText}</span>
                        </span>
                        <h4 class="font-heading font-black text-sm sm:text-base text-white leading-snug">${c.name}</h4>
                    </div>
                    <div class="text-right flex-shrink-0">
                        ${hasDiscount ? `
                            <div class="line-through text-slate-400 text-[10px] font-mono">${originalPriceNum.toLocaleString('vi-VN')} đ</div>
                            <div class="font-mono font-black text-yellow-300 text-sm sm:text-base">${mainPriceNum.toLocaleString('vi-VN')} đ</div>
                        ` : `
                            <div class="font-mono font-black text-yellow-300 text-sm sm:text-base">${c.tuition.toLocaleString('vi-VN')} đ</div>
                        `}
                        ${scholarshipHtml}
                        <span class="text-[10px] text-slate-400 block mt-0.5">⏱️ ${c.duration || 'Linh hoạt'}</span>
                    </div>
                </div>

                <!-- Lash Image & Key Practice Specs -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <!-- Ảnh bộ mi đại diện -->
                    <div class="sm:col-span-1 rounded-xl overflow-hidden border border-amber-500/30 bg-black/60 shadow-md aspect-video sm:aspect-square relative group">
                        <img src="${lashImage}" alt="${c.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.onerror=null;this.src='${fallbackImg}'">
                        <div class="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <i class="fa-solid fa-eye text-[8px]"></i> Mẫu mi đại diện
                        </div>
                    </div>

                    <!-- 3 Thông số thực hành: Thời gian, Số mẫu, Chi phí mẫu -->
                    <div class="sm:col-span-2 grid grid-cols-3 gap-2">
                        <div class="p-2 rounded-xl bg-black/50 border border-amber-500/20 text-center flex flex-col justify-center">
                            <div class="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Thời Gian</div>
                            <div class="text-xs font-bold text-amber-300 mt-0.5">${c.duration || '1 - 2 tuần'}</div>
                        </div>
                        <div class="p-2 rounded-xl bg-black/50 border border-amber-500/20 text-center flex flex-col justify-center">
                            <div class="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Thực Hành Mẫu</div>
                            <div class="text-xs font-bold text-yellow-300 mt-0.5">${c.modelCount || 'Theo giáo trình'}</div>
                        </div>
                        <div class="p-2 rounded-xl bg-black/50 border border-amber-500/20 text-center flex flex-col justify-center">
                            <div class="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Chi Phí Mẫu</div>
                            <div class="text-xs font-bold text-emerald-400 mt-0.5">${c.modelCost || 'Miễn phí'}</div>
                        </div>
                    </div>
                </div>

                <!-- Đối tượng học viên -->
                ${c.targetAudience ? `
                    <p class="text-[11px] text-slate-300 leading-relaxed bg-black/25 p-2 rounded-xl border border-amber-500/10">
                        <strong class="text-white flex items-center gap-1 mb-0.5"><i class="fa-solid fa-user-check text-amber-400 text-[10px]"></i> Đối tượng phù hợp:</strong>
                        <span>${c.targetAudience}</span>
                    </p>
                ` : ''}

                <!-- Nội dung đào tạo chi tiết -->
                ${curriculumHtml}

                <!-- Footer: Thưởng hoa hồng tuyển sinh + Nút chọn khóa tư vấn -->
                <div class="flex items-center justify-between pt-1 border-t border-amber-500/10">
                    <div class="text-[10px] text-slate-300">
                        💰 Thưởng: <strong class="text-yellow-300 font-mono">Tự chốt ${c.rewardSelfFormatted || (DataManager.formatMoneyShort ? DataManager.formatMoneyShort(c.rewardSelf) : c.rewardSelf)}</strong> | <span class="text-amber-200 font-mono">Data ${c.rewardPassFormatted || (DataManager.formatMoneyShort ? DataManager.formatMoneyShort(c.rewardPass) : c.rewardPass)}</span>
                    </div>
                    <button type="button" onclick="quickSelectCourseForLead('${c.id}')" class="px-3 py-1.5 rounded-lg btn-gold font-black text-[11px] active:scale-95 shadow transition-all flex items-center gap-1.5">
                        <i class="fa-solid fa-paper-plane text-[9px]"></i>
                        <span>Chọn Khóa Này</span>
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
};

window.smoothScrollToWiki = function(e, tab = null) {
    if (e && e.preventDefault) e.preventDefault();
    const user = DataManager.getCurrentUser ? DataManager.getCurrentUser() : null;
    if (user && typeof window.navigateToScreen === 'function') {
        window.navigateToScreen('screen-home');
    }
    const wikiEl = document.getElementById('wiki');
    if (wikiEl) {
        wikiEl.scrollIntoView({ behavior: 'smooth' });
    }
    if (tab && typeof window.switchWikiTab === 'function') {
        window.switchWikiTab(tab);
    }
};

function populateCourseSelects() {
    const courseSelects = document.querySelectorAll('.course-select-options');
    const courses = DataManager.getCourses();
    courseSelects.forEach(select => {
        const currentVal = select.value;
        let options = '';
        courses.forEach(c => {
            options += `<option value="${c.id}">${c.name} (Học phí: ${c.tuitionFormatted})</option>`;
        });
        select.innerHTML = options;
        if (currentVal && courses.some(c => c.id === currentVal)) {
            select.value = currentVal;
        }
    });
}

// ==========================================================================
// 3. MÁY TÍNH THƯỞNG NHANH CHO iPHONE
// ==========================================================================
function initRewardCalculator() {
    const courseSelect = document.getElementById('calcCourse');
    const roleRadioButtons = document.querySelectorAll('input[name="calcRole"]');
    const selectedPayout = document.getElementById('calcSelectedPayout');

    if (!courseSelect) return;

    function updateCalc() {
        const courses = DataManager.getCourses();
        const selectedCourseId = courseSelect.value;
        const course = courses.find(c => c.id === selectedCourseId) || courses[0];
        
        let selectedRole = 'pass';
        roleRadioButtons.forEach(radio => {
            if (radio.checked) selectedRole = radio.value;
        });

        const currentRewardNum = selectedRole === 'self' ? course.rewardSelf : course.rewardPass;
        
        if (selectedPayout) {
            selectedPayout.innerHTML = `
                <div class="text-[11px] uppercase tracking-wider text-amber-300/80 mb-1">Mức thưởng bạn sẽ nhận:</div>
                <div class="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow">
                    ${DataManager.formatCurrency(currentRewardNum)}
                </div>
                <div class="text-[11px] text-slate-300 mt-1">
                    ${selectedRole === 'self' ? '<span class="text-yellow-300 font-semibold"><i class="fa-solid fa-user-check mr-1"></i>Hình thức: Người giới thiệu tự chốt</span>' : '<span class="text-emerald-300 font-semibold"><i class="fa-solid fa-users mr-1"></i>Hình thức: Bàn giao đội ACA chốt giúp</span>'}
                </div>
                ${course.scholarship > 0 ? `
                    <div class="text-[10px] text-emerald-400 mt-1.5 flex items-center justify-center gap-1">
                        <i class="fa-solid fa-gift"></i> Học bổng khóa này: <strong>${course.scholarshipFormatted}</strong>
                    </div>
                ` : ''}
            `;
        }
    }

    courseSelect.addEventListener('change', updateCalc);
    roleRadioButtons.forEach(r => r.addEventListener('change', updateCalc));
    updateCalc();
}

// ==========================================================================
// 4. TOUCH CHIPS CHO LỰA CHỌN TRÊN MÀN HÌNH CẢM ỨNG
// ==========================================================================
function initTouchChips() {
    document.querySelectorAll('.touch-chip-group').forEach(group => {
        const chips = group.querySelectorAll('.touch-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const radio = chip.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    chips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    // Kích hoạt sự kiện change để các listener form (như Tự chốt) bắt được ngay
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });
    });
}

// ==========================================================================
// 5. ĐĂNG KÝ (SĐT / GMAIL) & ĐĂNG NHẬP THÀNH VIÊN (iOS Bottom Sheet)
// ==========================================================================
function initUserAuth() {
    const btnOpenRegister = document.getElementById('btnOpenRegisterModal');
    const btnOpenLogin = document.getElementById('btnOpenLoginModal');
    const registerModal = document.getElementById('userRegisterModal');
    const loginModal = document.getElementById('userLoginModal');
    const registerForm = document.getElementById('userRegisterForm');
    const loginForm = document.getElementById('userLoginForm');
    const btnLogout = document.getElementById('btnUserLogout');

    if (btnOpenRegister && registerModal) {
        btnOpenRegister.addEventListener('click', () => {
            registerModal.classList.remove('hidden');
            registerModal.classList.add('flex');
        });
    }

    if (btnOpenLogin && loginModal) {
        btnOpenLogin.addEventListener('click', () => {
            loginModal.classList.remove('hidden');
            loginModal.classList.add('flex');
            document.getElementById('loginIdentifier')?.focus();
        });
    }

    document.querySelectorAll('.close-user-auth-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            registerModal?.classList.add('hidden');
            registerModal?.classList.remove('flex');
            loginModal?.classList.add('hidden');
            loginModal?.classList.remove('flex');
        });
    });

    const btnSwitchToLogin = document.getElementById('btnSwitchToLogin');
    if (btnSwitchToLogin) {
        btnSwitchToLogin.addEventListener('click', () => {
            registerModal?.classList.add('hidden');
            registerModal?.classList.remove('flex');
            loginModal?.classList.remove('hidden');
            loginModal?.classList.add('flex');
        });
    }

    const btnSwitchToRegister = document.getElementById('btnSwitchToRegister');
    if (btnSwitchToRegister) {
        btnSwitchToRegister.addEventListener('click', () => {
            loginModal?.classList.add('hidden');
            loginModal?.classList.remove('flex');
            registerModal?.classList.remove('hidden');
            registerModal?.classList.add('flex');
        });
    }

    // Toggle ẩn/hiện mật khẩu
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

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const identifier = document.getElementById('regIdentifier').value.trim();
            const role = document.getElementById('regRole').value;
            const bankInfo = ''; // Đã bỏ trường nhập STK theo yêu cầu
            const passEl = document.getElementById('regPassword');
            const passConfirmEl = document.getElementById('regPasswordConfirm');
            const password = passEl ? passEl.value.trim() : '';
            const passwordConfirm = passConfirmEl ? passConfirmEl.value.trim() : '';

            if (!name || !identifier) {
                alert('Vui lòng điền họ tên và số điện thoại hoặc Gmail!');
                return;
            }

            if (!password || password.length < 6) {
                alert('Vui lòng nhập mật khẩu tối thiểu 6 ký tự!');
                if (passEl) passEl.focus();
                return;
            }

            if (password !== passwordConfirm) {
                alert('Xác nhận mật khẩu không trùng khớp! Vui lòng nhập lại.');
                if (passConfirmEl) passConfirmEl.focus();
                return;
            }

            const res = DataManager.registerUser({ name, identifier, role, bankInfo, password });
            if (!res.success) {
                alert(res.message);
                return;
            }

            registerModal.classList.add('hidden');
            registerModal.classList.remove('flex');
            registerForm.reset();
            showPendingApprovalNotice(res.user);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const identifier = document.getElementById('loginIdentifier').value.trim();
            const passEl = document.getElementById('loginPassword');
            const password = passEl ? passEl.value.trim() : '';
            const loginError = document.getElementById('loginErrorMsg');

            if (!identifier) {
                alert('Vui lòng nhập số điện thoại hoặc Gmail!');
                return;
            }

            if (!password) {
                if (loginError) {
                    loginError.textContent = 'Vui lòng nhập mật khẩu đăng nhập!';
                    loginError.classList.remove('hidden');
                } else {
                    alert('Vui lòng nhập mật khẩu đăng nhập!');
                }
                if (passEl) passEl.focus();
                return;
            }

            const res = DataManager.loginUser(identifier, password);
            if (!res.success) {
                if (loginError) {
                    loginError.textContent = res.message;
                    loginError.classList.remove('hidden');
                } else {
                    alert(res.message);
                }
                return;
            }

            loginModal.classList.add('hidden');
            loginModal.classList.remove('flex');
            loginForm.reset();
            if (loginError) loginError.classList.add('hidden');

            updateUserSessionUI();
            alert(`Chào mừng ${res.user.name} đã đăng nhập thành công vào Wings!`);
        });
    }

    // Inline login form inside initial auth card
    const inlineLoginForm = document.getElementById('initialPasswordLoginForm');
    if (inlineLoginForm) {
        inlineLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const identifier = document.getElementById('inlineLoginIdentifier')?.value.trim();
            const password = document.getElementById('inlineLoginPassword')?.value.trim();
            const errEl = document.getElementById('inlineLoginError');

            if (!identifier) {
                if (errEl) { errEl.textContent = 'Vui lòng nhập Số điện thoại hoặc Gmail!'; errEl.classList.remove('hidden'); }
                return;
            }
            if (!password) {
                if (errEl) { errEl.textContent = 'Vui lòng nhập mật khẩu!'; errEl.classList.remove('hidden'); }
                return;
            }

            const res = DataManager.loginUser(identifier, password);
            if (!res.success) {
                if (errEl) {
                    errEl.textContent = res.message;
                    errEl.classList.remove('hidden');
                } else {
                    alert(res.message);
                }
                return;
            }

            if (errEl) errEl.classList.add('hidden');
            inlineLoginForm.reset();
            updateUserSessionUI();
            alert(`Chào mừng ${res.user.name} đã đăng nhập thành công vào Wings!`);
        });
    }

    // Inline register form inside initial auth card
    const inlineRegForm = document.getElementById('initialRegisterForm');
    if (inlineRegForm) {
        inlineRegForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('inlineRegName')?.value.trim();
            const identifier = document.getElementById('inlineRegIdentifier')?.value.trim();
            const password = document.getElementById('inlineRegPassword')?.value.trim();
            const errEl = document.getElementById('inlineRegError');

            if (!name || !identifier) {
                if (errEl) { errEl.textContent = 'Vui lòng điền họ tên và số điện thoại hoặc Gmail!'; errEl.classList.remove('hidden'); }
                return;
            }
            if (!password || password.length < 6) {
                if (errEl) { errEl.textContent = 'Vui lòng nhập mật khẩu tối thiểu 6 ký tự!'; errEl.classList.remove('hidden'); }
                return;
            }

            const res = DataManager.registerUser({ name, identifier, role: 'Cộng tác viên tuyển sinh', bankInfo: '', password });
            if (!res.success) {
                if (errEl) {
                    errEl.textContent = res.message;
                    errEl.classList.remove('hidden');
                } else {
                    alert(res.message);
                }
                return;
            }

            if (errEl) errEl.classList.add('hidden');
            inlineRegForm.reset();
            showPendingApprovalNotice(res.user);
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm('Bạn có chắc muốn đăng xuất?')) {
                DataManager.logoutUser();
                sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
                updateUserSessionUI();
                const adminPanel = document.getElementById('adminDashboardSection');
                if (adminPanel) adminPanel.classList.add('hidden');
            }
        });
    }
}

function showPendingApprovalNotice(user) {
    const modal = document.getElementById('regPendingApprovalModal');
    if (!modal) return;
    document.getElementById('pendingUserIdentifier').textContent = user.identifier;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Cập nhật trạng thái giao diện Thành Viên
function updateUserSessionUI() {
    const user = DataManager.getCurrentUser();
    const guestNav = document.getElementById('guestNavActions');
    const memberNav = document.getElementById('memberNavActions');
    const memberNameDisplay = document.getElementById('memberNameHeader');
    const memberBananaDisplay = document.getElementById('memberBananaCountHeader');



    if (user) {
        if (guestNav) guestNav.classList.add('hidden');
        if (memberNav) {
            memberNav.classList.remove('hidden');
            memberNav.classList.add('flex');
        }
        if (memberNameDisplay) memberNameDisplay.textContent = user.name;
        if (memberBananaDisplay) memberBananaDisplay.textContent = user.bananas || 0;

        // Cập nhật Avatar trên thanh Header
        const memberAvatarImg = document.getElementById('memberAvatarHeader');
        const memberDefaultIcon = document.getElementById('memberDefaultIconHeader');
        if (memberAvatarImg && memberDefaultIcon) {
            if (user.avatar && user.avatar.trim() !== '') {
                memberAvatarImg.src = user.avatar;
                memberAvatarImg.classList.remove('hidden');
                memberDefaultIcon.classList.add('hidden');
            } else {
                memberAvatarImg.src = '';
                memberAvatarImg.classList.add('hidden');
                memberDefaultIcon.classList.remove('hidden');
            }
        }

        // Cập nhật giao diện Form nộp data: TỰ ĐỘNG NHẬN DIỆN VÀ ẨN NHẬP LIỆU THÔNG TIN CÁ NHÂN
        const loggedInBox = document.getElementById('loggedInReferrerBox');
        const guestBox = document.getElementById('guestReferrerBox');
        const loggedNameDisp = document.getElementById('loggedInUserNameDisplay');
        const loggedIdDisp = document.getElementById('loggedInUserIdentifierDisplay');
        const loggedBankDisp = document.getElementById('loggedInUserBankDisplay');
        const loggedAvatarImg = document.getElementById('loggedInUserAvatarDisplay');
        const loggedDefaultIcon = document.getElementById('loggedInUserDefaultIcon');

        if (loggedInBox) loggedInBox.classList.remove('hidden');
        if (guestBox) guestBox.classList.add('hidden');

        if (loggedNameDisp) loggedNameDisp.textContent = user.name;
        if (loggedIdDisp) loggedIdDisp.textContent = `${user.identifier} (${user.role || 'Thành viên Wings'})`;
        if (loggedBankDisp) loggedBankDisp.textContent = user.bankInfo || 'Chưa cung cấp STK';

        // Cập nhật Avatar trong thẻ thành viên đã xác thực
        if (loggedAvatarImg && loggedDefaultIcon) {
            if (user.avatar && user.avatar.trim() !== '') {
                loggedAvatarImg.src = user.avatar;
                loggedAvatarImg.classList.remove('hidden');
                loggedDefaultIcon.classList.add('hidden');
            } else {
                loggedAvatarImg.src = '';
                loggedAvatarImg.classList.add('hidden');
                loggedDefaultIcon.classList.remove('hidden');
            }
        }

        const refName = document.getElementById('referrerName');
        const refPhone = document.getElementById('referrerPhone');
        const refRole = document.getElementById('referrerRole');
        const refBank = document.getElementById('referrerBank');

        if (refName) refName.value = user.name;
        if (refPhone) refPhone.value = user.identifier;
        if (refRole) refRole.value = user.role || 'Cộng tác viên';
        if (refBank) refBank.value = user.bankInfo || '';

        // Cập nhật nút Quản trị / Chuyên viên trên Header
        const adminAuthBtn = document.getElementById('btnOpenAdminAuth');
        if (adminAuthBtn) {
            if (user && (user.systemRole === 'counselor' || (user.role && user.role.toLowerCase().includes('chuyên viên')))) {
                adminAuthBtn.innerHTML = `<i class="fa-solid fa-user-shield text-[10px] text-sky-400"></i> <span class="hidden sm:inline text-sky-300 font-bold">Chuyên Viên</span>`;
                adminAuthBtn.className = "bg-sky-950/70 hover:bg-sky-900/80 text-sky-300 border border-sky-500/50 text-[11px] font-bold py-1.5 px-2 rounded-lg flex items-center gap-1 min-h-[32px] active:scale-95 shadow-md shadow-sky-950/40";
                adminAuthBtn.title = "Bảng Điều Hành Chuyên Viên Hướng Nghiệp";
            } else if (user && (user.systemRole === 'admin' || user.isAdmin)) {
                adminAuthBtn.innerHTML = `<i class="fa-solid fa-crown text-[10px] text-amber-400"></i> <span class="hidden sm:inline text-amber-300 font-bold">Quản Trị</span>`;
                adminAuthBtn.className = "bg-purple-950/80 hover:bg-purple-900/80 text-amber-300 border border-amber-500/50 text-[11px] font-bold py-1.5 px-2 rounded-lg flex items-center gap-1 min-h-[32px] active:scale-95 shadow-md shadow-amber-950/40";
                adminAuthBtn.title = "Bảng Điều Hành Quản Trị Viên";
            } else {
                adminAuthBtn.innerHTML = `<i class="fa-solid fa-shield-halved text-[10px]"></i> <span class="hidden sm:inline">Admin</span>`;
                adminAuthBtn.className = "bg-purple-950/60 hover:bg-purple-900/60 text-amber-300 border border-amber-500/40 text-[11px] font-bold py-1.5 px-2 rounded-lg flex items-center gap-1 min-h-[32px] active:scale-95";
                adminAuthBtn.title = "Khu vực Admin duyệt";
            }
        }

        executeSearch(user.identifier);
        refreshBananaWalletWidget();
        renderMiniGameGatekeeperUI();
        renderMyBananaPosts();
        renderCollaboratorDashboard(user);
        updateNotificationBadge(user.identifier);

        // Hiển thị các phân hệ thành viên và thanh bar đáy màn hình sau khi đăng nhập
        const screenInitialAuth = document.getElementById('screen-initial-auth');
        const memberScreens = document.getElementById('memberScreensContainer') || document.getElementById('memberOnlySections');
        const theLe = document.getElementById('the-le');
        const bottomNav = document.getElementById('iosBottomNavBar');
        const headerLeaderboard = document.getElementById('btnHeaderLeaderboard');

        if (screenInitialAuth) screenInitialAuth.classList.add('hidden');
        if (memberScreens) memberScreens.classList.remove('hidden');
        if (theLe) theLe.classList.remove('hidden');

        if (bottomNav) {
            bottomNav.classList.remove('hidden');
            bottomNav.style.display = 'flex';
        }
        if (headerLeaderboard) {
            headerLeaderboard.classList.remove('flex');
            headerLeaderboard.classList.add('hidden', 'md:flex');
        }

        // Hiển thị khối điều kiện & quy định chi trả hoa hồng cho thành viên đã đăng nhập
        const wikiTerms = document.getElementById('wikiTermsAndRulesBox');
        if (wikiTerms) wikiTerms.classList.remove('hidden');

        // Mở Screen 2 ("Trang Chủ") khi đăng nhập
        if (typeof window.navigateToScreen === 'function') {
            window.navigateToScreen('screen-home');
        }

        // Đồng bộ quyền trên Dashboard nếu đang mở
        if (typeof applyRoleTabPermissions === 'function') applyRoleTabPermissions();
    } else {
        if (guestNav) guestNav.classList.remove('hidden');
        if (memberNav) memberNav.classList.add('hidden');

        // SCREEN 1: GIAO DIỆN BAN ĐẦU (CHƯA ĐĂNG NHẬP)
        // Hiện Screen 1 (Thẻ đăng ký/đăng nhập ban đầu WINGS ACADEMY) + Wiki bên dưới
        // Ẩn thanh bar đáy màn hình, ẩn Hero thể lệ, ẩn các phân hệ thành viên khác
        const screenInitialAuth = document.getElementById('screen-initial-auth');
        const screenHome = document.getElementById('screen-home');
        const theLe = document.getElementById('the-le');
        const memberScreens = document.getElementById('memberScreensContainer') || document.getElementById('memberOnlySections');
        const bottomNav = document.getElementById('iosBottomNavBar');
        const headerLeaderboard = document.getElementById('btnHeaderLeaderboard');
        const wikiTerms = document.getElementById('wikiTermsAndRulesBox');

        if (screenInitialAuth) screenInitialAuth.classList.remove('hidden');
        if (theLe) theLe.classList.add('hidden');
        if (screenHome) screenHome.classList.remove('hidden');
        if (memberScreens) memberScreens.classList.remove('hidden');

        ['screen-lead-form', 'screen-mini-game', 'screen-leaderboard', 'screen-search-dashboard', 'screen-admin'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        if (bottomNav) {
            bottomNav.classList.add('hidden');
            bottomNav.style.display = 'none';
        }
        if (headerLeaderboard) {
            headerLeaderboard.classList.add('hidden');
            headerLeaderboard.classList.remove('flex');
        }
        if (wikiTerms) {
            wikiTerms.classList.add('hidden');
        }

        const memberAvatarImg = document.getElementById('memberAvatarHeader');
        const memberDefaultIcon = document.getElementById('memberDefaultIconHeader');
        if (memberAvatarImg) memberAvatarImg.classList.add('hidden');
        if (memberDefaultIcon) memberDefaultIcon.classList.remove('hidden');

        const loggedInBox = document.getElementById('loggedInReferrerBox');
        const guestBox = document.getElementById('guestReferrerBox');
        if (loggedInBox) loggedInBox.classList.add('hidden');
        if (guestBox) guestBox.classList.remove('hidden');

        // Reset nút Admin trên Header
        const adminAuthBtn = document.getElementById('btnOpenAdminAuth');
        if (adminAuthBtn) {
            adminAuthBtn.innerHTML = `<i class="fa-solid fa-shield-halved text-[10px]"></i> <span class="hidden sm:inline">Admin</span>`;
            adminAuthBtn.className = "bg-purple-950/60 hover:bg-purple-900/60 text-amber-300 border border-amber-500/40 text-[11px] font-bold py-1.5 px-2 rounded-lg flex items-center gap-1 min-h-[32px] active:scale-95";
            adminAuthBtn.title = "Khu vực Admin duyệt";
        }

        renderMiniGameGuestUI();
        renderCollaboratorDashboardGuest();
        updateNotificationBadge(null);
    }

    renderBananaProgramRules();
    checkImpersonationState();
}

// ==========================================================================
// ĐĂNG NHẬP DƯỚI DANH NGHĨA (IMPERSONATION MODE)
// ==========================================================================
function checkImpersonationState() {
    const impStr = localStorage.getItem('wings_impersonation');
    const banner = document.getElementById('impersonationBanner');
    if (!impStr) {
        if (banner) banner.classList.add('hidden');
        return;
    }
    try {
        const imp = JSON.parse(impStr);
        const curUser = DataManager.getCurrentUser();
        if (banner && curUser) {
            banner.classList.remove('hidden');
            const nameEl = document.getElementById('impersonationUserName');
            const roleEl = document.getElementById('impersonationUserRole');
            if (nameEl) nameEl.textContent = curUser.name;
            if (roleEl) {
                const isNursery = (typeof getWingsThemeMode === 'function' ? getWingsThemeMode() : 'nursery') === 'nursery';
                let roleName = curUser.role;
                if (!roleName) {
                    if (curUser.systemRole === 'counselor') roleName = isNursery ? 'Bà Tiên Xanh' : 'Chuyên Viên Hướng Nghiệp';
                    else if (curUser.systemRole === 'admin') roleName = isNursery ? 'Kiểm Lâm' : 'Quản Trị Viên';
                    else roleName = isNursery ? 'Người Gieo Hạt' : 'Cộng Tác Viên';
                }
                roleEl.textContent = roleName;
            }
        }
    } catch (e) {
        if (banner) banner.classList.add('hidden');
    }
}
window.checkImpersonationState = checkImpersonationState;

function exitImpersonation() {
    const impStr = localStorage.getItem('wings_impersonation');
    localStorage.removeItem('wings_impersonation');
    if (impStr) {
        try {
            const imp = JSON.parse(impStr);
            if (imp.originalUserId) {
                const origUser = DataManager.getUserById(imp.originalUserId);
                if (origUser) {
                    DataManager.setCurrentUser(origUser);
                }
            } else if (imp.originalAdminRole === 'admin') {
                sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
            }
        } catch (e) {}
    }
    alert('Đã thoát chế độ xem. Đang quay trở lại Trang Quản Trị Hệ Thống...');
    window.location.href = 'admin.html';
}
window.exitImpersonation = exitImpersonation;

// ==========================================================================
// 6. MINI GAME CHUỐI 🍌 & DUYỆT THAM GIA
// ==========================================================================
function renderMiniGameGuestUI() {
    const container = document.getElementById('miniGameDynamicContainer');
    const walletBox = document.getElementById('bananaWalletSummaryBox');
    const sectionTitle = document.getElementById('miniGameSectionTitle');
    const sectionSubtitle = document.getElementById('miniGameSectionSubtitle');

    if (sectionTitle) sectionTitle.textContent = "Đăng Ký & Tham Gia Mini Game Nhận Chuối 🍌";
    if (sectionSubtitle) sectionSubtitle.innerHTML = `Đăng ký tham gia: Chuyển chuối đến ví Admin và tải ảnh xác nhận để Admin duyệt. Sau khi duyệt, nộp link bài đăng để nhận <strong class="text-yellow-400 font-bold">+1 🍌 cho mỗi bài hợp lệ!</strong>`;

    if (walletBox) {
        walletBox.innerHTML = `
            <div class="text-center py-4 p-4 rounded-2xl bg-black/40 border border-amber-500/20">
                <span class="text-3xl banana-glow block mb-2">🍌</span>
                <p class="text-xs text-slate-300 font-semibold mb-3">Đăng ký hoặc Đăng nhập để tham gia Mini Game nhận Chuối 🍌</p>
                <div class="flex items-center justify-center gap-2">
                    <button onclick="document.getElementById('btnOpenLoginModal')?.click()" class="btn-gold py-2 px-5 rounded-xl text-xs font-bold active:scale-95">
                        Đăng Nhập
                    </button>
                    <button onclick="document.getElementById('btnOpenRegisterModal')?.click()" class="btn-gold-outline py-2 px-5 rounded-xl text-xs font-bold active:scale-95">
                        Đăng Ký
                    </button>
                </div>
            </div>
        `;
    }

    if (container) {
        container.innerHTML = `
            <div class="banana-card p-6 sm:p-8 rounded-3xl text-center shadow-2xl">
                <span class="text-4xl banana-glow block mb-3">🍌</span>
                <h3 class="text-lg sm:text-xl font-heading font-extrabold text-white mb-2">Cần Đăng Nhập Để Tham Gia Mini Game</h3>
                <p class="text-slate-400 text-xs max-w-md mx-auto mb-5">
                    Hãy đăng ký tài khoản (bằng SĐT hoặc Gmail) và đăng nhập để tham gia Mini Game chia sẻ link nhận chuối!
                </p>
                <button onclick="document.getElementById('btnOpenLoginModal')?.click()" class="btn-gold py-3 px-7 rounded-xl text-xs sm:text-sm font-bold active:scale-95">
                    <i class="fa-solid fa-right-to-bracket mr-1.5"></i> Đăng Nhập Ngay
                </button>
            </div>
        `;
    }
}

function renderMiniGameGatekeeperUI() {
    const user = DataManager.getCurrentUser();
    const config = DataManager.getBananaConfig();
    const container = document.getElementById('miniGameDynamicContainer');
    const sectionTitle = document.getElementById('miniGameSectionTitle');
    const sectionSubtitle = document.getElementById('miniGameSectionSubtitle');
    const feeBox = document.getElementById('miniGameFeeBox');

    if (!container || !user) return;

    const gameReg = DataManager.getUserGameRegistration(user.id);
    const isApproved = user.miniGameApproved === true || (gameReg && gameReg.status === 'APPROVED');

    if (isApproved) {
        // CẬP NHẬT HEADER: KHÔNG CÒN CHỮ ĐĂNG KÝ
        if (sectionTitle) sectionTitle.textContent = "Nộp Link Bài Đăng / Video Nhận Chuối 🍌";
        if (sectionSubtitle) {
            sectionSubtitle.innerHTML = `Chào <strong>${user.name}</strong>! Bạn đã được duyệt tham gia. Hãy dán đường link bài đăng hoặc video tuyển dụng của bạn bên dưới để nhận <strong class="text-yellow-400 font-bold">+1 🍌 cho mỗi bài hợp lệ</strong>!`;
        }

        if (feeBox) {
            feeBox.innerHTML = `
                <div>
                    <div class="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                        <i class="fa-solid fa-circle-check"></i> Trạng Thái Hoạt Động
                    </div>
                    <div class="text-sm font-bold text-white mb-1">
                        Đã Kích Hoạt Quyền Tham Gia
                    </div>
                    <p class="text-slate-400 text-[11px] leading-relaxed">
                        Tài khoản của bạn đã được Admin duyệt thành công. Hãy tích cực chia sẻ bài viết để gom thật nhiều Chuối 🍌!
                    </p>
                </div>
                <div class="pt-2 border-t border-slate-800 text-[11px] text-yellow-300 font-semibold flex items-center justify-between">
                    <span>Thưởng mỗi link:</span>
                    <strong class="text-white">+${config.bananasPerValidLink || 1} 🍌</strong>
                </div>
            `;
        }

        // CHỈ HIỆN GIAO DIỆN ĐIỀN DỮ LIỆU ĐƯỜNG LINK / VIDEO
        container.innerHTML = `
            <div class="banana-card p-5 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                <div class="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
                    <div class="flex items-center gap-2 font-heading font-extrabold text-white text-base">
                        <span class="text-2xl banana-glow">🍌</span>
                        <span>Điền Dữ Liệu Đường Link / Video</span>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
                        <i class="fa-solid fa-circle-check"></i> Hoạt Động
                    </span>
                </div>

                <div class="p-3 rounded-xl bg-black/50 border border-amber-500/20 text-xs mb-4">
                    <div class="font-bold text-amber-300 mb-1 flex items-center gap-1">
                        <i class="fa-solid fa-circle-info"></i> Tiêu chuẩn bài đăng nhận chuối:
                    </div>
                    <ul class="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                        <li>Bài đăng/video công khai trên Facebook, TikTok, Reels, YouTube Shorts...</li>
                        <li>Nội dung giới thiệu tuyển sinh Wings Beauty & Academy.</li>
                        <li>Hashtag: #WingsAcademy #HocNoiMi #TuyenDungThang10</li>
                    </ul>
                </div>

                <form id="submitBananaPostForm" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                            Nền Tảng Đăng Tải:
                        </label>
                        <select id="postPlatform" class="form-input-luxury py-3 px-3 text-sm font-semibold">
                            <option value="Facebook">Facebook (Bài viết / Reels)</option>
                            <option value="TikTok">TikTok Video</option>
                            <option value="Zalo">Zalo Nhật ký / Video</option>
                            <option value="YouTube">YouTube Shorts</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                            Dán Đường Link Bài Đăng / Video <span class="text-rose-400">*</span>
                        </label>
                        <input type="url" id="postLink" required placeholder="https://www.facebook.com/... hoặc https://tiktok.com/@..." 
                            class="form-input-luxury py-3 px-3 text-sm font-mono">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                            Ghi Chú Thêm (Nếu có):
                        </label>
                        <input type="text" id="postNote" placeholder="Ví dụ: Đã đăng group Hội Nối Mi K12..." 
                            class="form-input-luxury py-2.5 px-3 text-xs">
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="btn-gold py-3.5 rounded-xl text-sm font-bold w-full shadow-lg active:scale-95">
                            <span>🍌</span> GỬI LINK ĐỂ ADMIN DUYỆT (+1 🍌)
                        </button>
                    </div>
                </form>
            </div>
        `;
        bindPostFormSubmit();

    } else if (gameReg && gameReg.status === 'PENDING') {
        const adminName = (typeof getAdminRoleDisplayName === 'function') ? getAdminRoleDisplayName() : 'Kiểm Lâm';
        if (sectionTitle) sectionTitle.textContent = "Đơn Đăng Ký Mini Game Đang Chờ Duyệt 🍌";
        if (sectionSubtitle) sectionSubtitle.innerHTML = `${adminName} đang kiểm tra ảnh chuyển chuối đến ví Admin. Quyền nộp link bài đăng sẽ được mở ngay sau khi duyệt!`;

        container.innerHTML = `
            <div class="banana-card p-6 rounded-3xl text-center shadow-2xl relative">
                <div class="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 text-2xl mx-auto mb-3 animate-pulse">
                    🍌
                </div>
                <h3 class="text-lg font-heading font-black text-white mb-2">
                    ĐƠN ĐĂNG KÝ ĐANG CHỜ ${adminName.toUpperCase()} DUYỆT!
                </h3>
                <p class="text-slate-300 text-xs max-w-md mx-auto mb-4 leading-relaxed">
                    Bạn đã nộp ảnh bằng chứng chuyển <strong class="text-yellow-400 font-bold">${gameReg.bananasTransferred} Chuối 🍌</strong> đến ví Admin. ${adminName} đang kiểm tra và sẽ kích hoạt quyền chơi cho bạn trong ít phút!
                </p>

                <div class="max-w-xs mx-auto p-3 rounded-xl bg-black/60 border border-amber-500/30 text-left mb-4">
                    <div class="text-[10px] uppercase text-amber-300 font-bold mb-1.5 flex items-center justify-between">
                        <span>Ảnh Chuối Đã Gửi:</span>
                        <span class="text-slate-400 text-[10px]">${DataManager.formatDate(gameReg.submittedAt)}</span>
                    </div>
                    <img src="${gameReg.proofImage}" alt="Ảnh bằng chứng chuyển chuối" class="w-full h-36 object-cover rounded-lg border border-slate-700 mb-2">
                    ${gameReg.note ? `<p class="text-[11px] text-slate-300 italic truncate">"${gameReg.note}"</p>` : ''}
                </div>

                <button onclick="reOpenGameRegistrationModal()" class="btn-gold-outline py-2.5 px-4 rounded-xl text-xs font-semibold active:scale-95">
                    <i class="fa-solid fa-arrow-up-from-bracket mr-1"></i> Gửi Lại Ảnh Khác
                </button>
            </div>
        `;

    } else {
        if (sectionTitle) sectionTitle.textContent = "Đăng Ký Tham Gia Mini Game Nhận Chuối 🍌";
        if (sectionSubtitle) {
            sectionSubtitle.innerHTML = `Điều kiện tham gia: Chuyển chuối đến ví Admin và tải ảnh xác nhận để Admin duyệt. Sau khi duyệt, nộp link bài đăng/video để nhận <strong class="text-yellow-400 font-bold">+1 🍌 cho mỗi bài hợp lệ!</strong>`;
        }

        const fee = config.requiredBananasToEnter || 3;
        const wallet = config.adminWalletAddress || 'WINGS-BANANA-ADMIN-8888';

        container.innerHTML = `
            <div class="banana-card p-5 sm:p-8 rounded-3xl shadow-2xl relative">
                <div class="text-center mb-5">
                    <span class="text-3xl banana-glow block mb-1">🍌</span>
                    <h3 class="text-xl font-heading font-black text-white uppercase">
                        Đăng Ký Tham Gia Mini Game
                    </h3>
                    <p class="text-slate-300 text-xs mt-1">
                        Chuyển thành công <strong class="text-yellow-300 font-bold">${fee} Chuối 🍌</strong> đến ví Admin và đính kèm ảnh xác nhận.
                    </p>
                </div>

                <!-- Admin Wallet Box -->
                <div class="p-3.5 rounded-2xl bg-black/60 border border-amber-500/30 mb-5 text-xs text-slate-300 space-y-1.5">
                    <div class="font-bold text-amber-300 uppercase flex items-center gap-1.5 text-[11px]">
                        <i class="fa-solid fa-wallet text-yellow-400"></i> Ví Chuối Admin Nhận Phí:
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 font-mono text-xs">
                        <div>Mã Ví: <strong class="text-yellow-400 font-bold">${wallet}</strong></div>
                        <div>Người nhận: <strong class="text-white">${config.adminWalletOwner}</strong></div>
                    </div>
                </div>

                <!-- Form Upload Proof -->
                <form id="gameProofSubmitForm" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                            Tải Ảnh Màn Hình Chuyển Chuối <span class="text-rose-400">*</span>
                        </label>
                        <div class="border-2 border-dashed border-amber-500/40 rounded-2xl p-5 text-center bg-black/40 hover:border-amber-400 transition-all cursor-pointer relative" id="dropzoneProofImage">
                            <!-- Hỗ trợ mở trực tiếp Camera iPhone hoặc Thư viện ảnh -->
                            <input type="file" id="proofImageFileInput" accept="image/*" required class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                            <div id="proofImagePlaceholder">
                                <i class="fa-solid fa-camera text-3xl text-amber-400 mb-2"></i>
                                <div class="text-sm text-white font-bold">Chạm để chụp ảnh hoặc chọn từ Album iPhone</div>
                                <div class="text-[11px] text-slate-400 mt-1">Hỗ trợ ảnh chụp màn hình chuyển chuối</div>
                            </div>
                            <div id="proofImagePreviewContainer" class="hidden">
                                <img id="proofImagePreview" src="" alt="Xem trước ảnh chuối" class="max-h-44 mx-auto rounded-xl border border-amber-500/40 shadow-lg">
                                <span class="inline-block mt-2 text-xs text-amber-300 underline font-semibold">Chạm để đổi ảnh khác</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold uppercase text-slate-300 mb-1">
                            Ghi Chú Đơn Đăng Ký (Nếu có):
                        </label>
                        <input type="text" id="gameRegNote" placeholder="Ví dụ: Đã chuyển 3 chuối lúc 10h15..." 
                            class="form-input-luxury py-2.5 px-3 text-xs">
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="btn-gold py-3.5 rounded-xl text-sm font-bold w-full shadow-xl active:scale-95">
                            <span>🍌</span> GỬI ẢNH ĐỂ ADMIN DUYỆT THAM GIA
                        </button>
                    </div>
                </form>
            </div>
        `;

        bindProofUploadForm();
    }
}

function bindProofUploadForm() {
    const fileInput = document.getElementById('proofImageFileInput');
    const placeholder = document.getElementById('proofImagePlaceholder');
    const previewContainer = document.getElementById('proofImagePreviewContainer');
    const previewImg = document.getElementById('proofImagePreview');
    const form = document.getElementById('gameProofSubmitForm');

    let base64Image = null;

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(evt) {
                base64Image = evt.target.result;
                if (previewImg) previewImg.src = base64Image;
                if (placeholder) placeholder.classList.add('hidden');
                if (previewContainer) previewContainer.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = DataManager.getCurrentUser();
            if (!user) return;

            if (!base64Image) {
                alert('Vui lòng chọn hoặc chụp ảnh màn hình chuyển chuối đính kèm!');
                return;
            }

            const note = document.getElementById('gameRegNote')?.value || '';
            const config = DataManager.getBananaConfig();

            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang gửi ảnh...`;

            setTimeout(() => {
                DataManager.submitGameRegistration({
                    userId: user.id,
                    userName: user.name,
                    userIdentifier: user.identifier,
                    bananasTransferred: config.requiredBananasToEnter || 3,
                    proofImage: base64Image,
                    note: note
                });

                const adminName = (typeof getAdminRoleDisplayName === 'function') ? getAdminRoleDisplayName() : 'Kiểm Lâm';
                alert(`Gửi đơn đăng ký thành công! ${adminName} sẽ kiểm tra ảnh chuối đính kèm và duyệt mở quyền chơi cho bạn.`);
                renderMiniGameGatekeeperUI();
            }, 500);
        });
    }
}

window.reOpenGameRegistrationModal = function() {
    const user = DataManager.getCurrentUser();
    if (!user) return;
    const gameReg = DataManager.getUserGameRegistration(user.id);
    if (gameReg) {
        gameReg.status = 'NOT_SUBMITTED';
        renderMiniGameGatekeeperUI();
    }
};

function bindPostFormSubmit() {
    const postForm = document.getElementById('submitBananaPostForm');
    if (!postForm) return;

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = DataManager.getCurrentUser();
        if (!user) return;

        const platform = document.getElementById('postPlatform')?.value || 'TikTok';
        const link = document.getElementById('postLink')?.value?.trim() || '';
        const note = document.getElementById('postNote')?.value?.trim() || '';

        if (!link) {
            alert('Vui lòng dán đường link bài đăng hoặc video!');
            return;
        }

        const btn = postForm.querySelector('button[type="submit"]');
        const oldText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang nộp link...`;

        setTimeout(() => {
            DataManager.addBananaPost({
                userId: user.id,
                userName: user.name,
                userIdentifier: user.identifier,
                platform,
                link,
                note
            });

            btn.disabled = false;
            btn.innerHTML = oldText;
            postForm.reset();

            const adminName = (typeof getAdminRoleDisplayName === 'function') ? getAdminRoleDisplayName() : 'Kiểm Lâm';
            alert(`Nộp link bài đăng thành công! ${adminName} sẽ kiểm tra và cộng 1 Chuối 🍌 cho bạn.`);
            renderMyBananaPosts();
        }, 500);
    });
}

function initBananaMiniGame() {}
function initGameRegistrationProof() {}

function renderBananaProgramRules() {
    const config = DataManager.getBananaConfig();
    const ruleFeeDisplay = document.getElementById('bananaRuleRequiredFee');
    const ruleRewardPerLink = document.getElementById('bananaRulePerLink');
    const ruleGuidelines = document.getElementById('bananaRuleGuidelines');
    const ruleDesc = document.getElementById('bananaRuleDescription');

    if (ruleFeeDisplay) ruleFeeDisplay.textContent = `${config.requiredBananasToEnter} 🍌`;
    if (ruleRewardPerLink) ruleRewardPerLink.textContent = `${config.bananasPerValidLink} 🍌`;
    if (ruleDesc) ruleDesc.textContent = config.programFeeDescription || '';
    if (ruleGuidelines && config.guidelines) {
        ruleGuidelines.innerHTML = config.guidelines.split('\n').map(g => `<li>${g}</li>`).join('');
    }
}

function refreshBananaWalletWidget() {
    const user = DataManager.getCurrentUser();
    const config = DataManager.getBananaConfig();
    const walletBox = document.getElementById('bananaWalletSummaryBox');
    if (!walletBox || !user) return;

    const userBananas = user.bananas || 0;
    const gameReg = DataManager.getUserGameRegistration(user.id);
    const isApproved = user.miniGameApproved === true || (gameReg && gameReg.status === 'APPROVED');

    walletBox.innerHTML = `
        <div class="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-black/60 border border-amber-500/40">
            <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl banana-glow">
                    🍌
                </div>
                <div>
                    <div class="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Ví Chuối Của Bạn</div>
                    <div class="text-xl sm:text-2xl font-black text-yellow-300 flex items-baseline gap-1">
                        ${userBananas} <span class="text-xs font-semibold text-slate-300">Chuối 🍌</span>
                    </div>
                </div>
            </div>

            <div class="text-right">
                <div class="text-[10px] text-slate-400">Mini Game:</div>
                <div class="text-xs font-bold ${isApproved ? 'text-emerald-400' : 'text-amber-400'}">
                    ${isApproved ? `<i class="fa-solid fa-circle-check"></i> Đã duyệt chơi` : (gameReg && gameReg.status === 'PENDING') ? `<i class="fa-solid fa-hourglass-half"></i> Chờ duyệt ảnh` : `<i class="fa-solid fa-lock"></i> Chưa chuyển chuối`}
                </div>
            </div>
        </div>
    `;
}

function renderMyBananaPosts() {
    const user = DataManager.getCurrentUser();
    const container = document.getElementById('myBananaPostsHistory');
    if (!container || !user) return;

    const allPosts = DataManager.getBananaPosts();
    const myPosts = allPosts.filter(p => p.userId === user.id);

    if (myPosts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 text-slate-400 text-xs">
                <i class="fa-solid fa-link-slash text-2xl text-amber-500/40 mb-1"></i>
                <p>Bạn chưa nộp link bài đăng nào.</p>
            </div>
        `;
        return;
    }

    let html = '';
    myPosts.forEach(p => {
        let statusBadge = '';
        if (p.status === 'APPROVED') {
            statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">+${p.bananasAwarded} 🍌</span>`;
        } else if (p.status === 'REJECTED') {
            statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">Từ chối</span>`;
        } else {
            statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">Chờ duyệt</span>`;
        }

        html += `
            <div class="p-3 rounded-xl bg-black/40 border border-slate-800 text-xs space-y-1.5 hover:border-amber-500/30 transition-all">
                <div class="flex items-center justify-between gap-2">
                    <span class="font-bold text-amber-400 uppercase text-[11px]">[${p.platform}]</span>
                    ${statusBadge}
                </div>
                <div>
                    <a href="${p.link}" target="_blank" class="text-slate-200 hover:text-amber-300 underline font-mono text-[11px] truncate block">
                        ${p.link}
                    </a>
                </div>
                ${p.note ? `<div class="text-[10px] text-slate-400 italic">Ghi chú: ${p.note}</div>` : ''}
                <div class="text-[10px] text-slate-500 text-right">${DataManager.formatDate(p.createdAt)}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ==========================================================================
// 7. FORM BÀN GIAO DATA (TỐI ƯU CẢM ỨNG iPHONE)
// ==========================================================================
function initLeadForm() {
    const leadForm = document.getElementById('leadSubmissionForm');
    if (!leadForm) return;

    // Lắng nghe thay đổi Hình thức nhận thưởng để ẩn/hiện mục Kế Hoạch Đội ACA
    const closeTypeRadios = document.querySelectorAll('input[name="closeType"]');
    const selfPlanningSection = document.getElementById('selfClosePlanningSection');

    function togglePlanningSection() {
        const selected = document.querySelector('input[name="closeType"]:checked')?.value;
        if (selected === 'self') {
            if (selfPlanningSection) selfPlanningSection.classList.remove('hidden');
        } else {
            if (selfPlanningSection) selfPlanningSection.classList.add('hidden');
        }
    }

    closeTypeRadios.forEach(r => r.addEventListener('change', togglePlanningSection));
    togglePlanningSection();

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const referrerName = document.getElementById('referrerName').value.trim();
        const referrerPhone = document.getElementById('referrerPhone').value.trim();
        const referrerRole = document.getElementById('referrerRole')?.value || 'Nhân sự / CTV';
        const referrerBank = document.getElementById('referrerBank')?.value.trim() || '';

        const customerName = document.getElementById('customerName').value.trim();
        const customerPhone = document.getElementById('customerPhone').value.trim();
        const customerTarget = document.querySelector('input[name="customerTarget"]:checked')?.value || 'Làm nghề';
        const customerTargetDetail = document.getElementById('customerTargetDetail').value.trim();
        const customerStage = document.querySelector('input[name="customerStage"]:checked')?.value || 'Đang tìm hiểu';
        const customerPainPoint = document.getElementById('customerPainPoint').value.trim();

        const interestCourseId = document.getElementById('interestCourse').value;
        const closeType = document.querySelector('input[name="closeType"]:checked')?.value || 'pass';

        if (!referrerName || !referrerPhone) {
            alert('Vui lòng đăng nhập hoặc điền thông tin người giới thiệu!');
            return;
        }

        if (!customerName || !customerPhone) {
            alert('Vui lòng điền họ tên và số điện thoại của khách hàng!');
            return;
        }

        // Với hình thức "Tự chốt", yêu cầu có lịch hẹn ngày lên và ngày đóng học phí để đội ACA lên kế hoạch
        let appointmentDate = '';
        let tuitionPaymentDate = '';
        let tuitionPaymentNote = '';

        if (closeType === 'self') {
            appointmentDate = document.getElementById('appointmentDate')?.value || '';
            tuitionPaymentDate = document.getElementById('tuitionPaymentDate')?.value || '';
            tuitionPaymentNote = document.getElementById('tuitionPaymentNote')?.value.trim() || '';

            if (!appointmentDate || !tuitionPaymentDate) {
                alert('Vì bạn chọn "Tự chốt (100% Thưởng)", vui lòng chọn Lịch hẹn ngày lên học viện và Ngày đóng học phí để đội ngũ ACA chuẩn bị chu đáo nhé!');
                return;
            }
        }

        const submitBtn = leadForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang gửi dữ liệu...`;

        setTimeout(() => {
            const newLead = DataManager.addLead({
                referrerName,
                referrerPhone,
                referrerRole,
                referrerBank,
                customerName,
                customerPhone,
                customerTarget,
                customerTargetDetail,
                customerStage,
                customerPainPoint,
                interestCourseId,
                closeType,
                appointmentDate,
                tuitionPaymentDate,
                tuitionPaymentNote
            });

            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            showSuccessModal(newLead);
            
            // Xóa form khách hàng để sẵn sàng nộp khách tiếp theo
            document.getElementById('customerName').value = '';
            document.getElementById('customerPhone').value = '';
            document.getElementById('customerTargetDetail').value = '';
            document.getElementById('customerPainPoint').value = '';
            if (document.getElementById('appointmentDate')) document.getElementById('appointmentDate').value = '';
            if (document.getElementById('tuitionPaymentDate')) document.getElementById('tuitionPaymentDate').value = '';
            if (document.getElementById('tuitionPaymentNote')) document.getElementById('tuitionPaymentNote').value = '';

            const searchPhoneInput = document.getElementById('searchReferrerPhone');
            if (searchPhoneInput) {
                searchPhoneInput.value = referrerPhone;
                executeSearch(referrerPhone);
            }
        }, 600);
    });
}

function showSuccessModal(lead) {
    const modal = document.getElementById('submissionSuccessModal');
    if (!modal) return;

    const course = COURSES_CONFIG.find(c => c.id === lead.interestCourseId);
    const rewardEstimate = lead.closeType === 'self' ? course?.rewardSelfFormatted : course?.rewardPassFormatted;
    const isSelf = (lead.closeType === 'self');

    const mId = document.getElementById('modalLeadId');
    if (mId) mId.textContent = lead.id;
    const mCust = document.getElementById('modalCustomerName');
    if (mCust) mCust.textContent = lead.customerName;
    const mCourse = document.getElementById('modalCourse');
    if (mCourse) mCourse.textContent = course?.name || 'Khóa học';
    const mClose = document.getElementById('modalCloseType');
    if (mClose) mClose.textContent = isSelf ? 'Tự chốt (100% thưởng)' : 'Đưa data cho CV Hướng nghiệp (50% thưởng)';
    
    const mStatus = document.getElementById('modalInitialStatus');
    if (mStatus) {
        if (isSelf) {
            mStatus.innerHTML = `<span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-yellow-300 border border-amber-500/40 text-[10px] font-bold"><i class="fa-solid fa-headset mr-1"></i>2. Chăm Sóc (Đã xếp lịch checkin)</span>`;
        } else {
            mStatus.innerHTML = `<span class="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold"><i class="fa-solid fa-inbox mr-1"></i>1. Data mới (Bàn giao CV)</span>`;
        }
    }

    const mDesc = document.getElementById('modalSuccessDesc');
    if (mDesc) {
        if (isSelf) {
            mDesc.innerHTML = `Hồ sơ tự chốt đã vào ngay bước <strong class="text-yellow-400">Chăm Sóc</strong> & lên lịch hẹn checkin tại shop.`;
        } else {
            mDesc.textContent = 'Đã gửi hồ sơ về Bộ phận Hướng nghiệp.';
        }
    }

    const mReward = document.getElementById('modalRewardEst');
    if (mReward) mReward.textContent = rewardEstimate;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

window.closeSuccessModal = function() {
    const modal = document.getElementById('submissionSuccessModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

// ==========================================================================
// 8. TRA CỨU TIẾN ĐỘ CÁ NHÂN (DẠNG CARD DI ĐỘNG)
// ==========================================================================
function initTracking() {
    const searchBtn = document.getElementById('btnSearchReferrer');
    const phoneInput = document.getElementById('searchReferrerPhone');

    if (!searchBtn || !phoneInput) return;

    searchBtn.addEventListener('click', () => {
        executeSearch(phoneInput.value.trim());
    });

    phoneInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeSearch(phoneInput.value.trim());
        }
    });
}

function executeSearch(query) {
    const resultsContainer = document.getElementById('trackingResultsContainer');
    const emptyState = document.getElementById('trackingEmptyState');
    const cardsContainer = document.getElementById('trackingCardsContainer');
    const statTotalSent = document.getElementById('statTotalSent');
    const statWonCount = document.getElementById('statWonCount');
    const statTotalEarned = document.getElementById('statTotalEarned');
    const statPendingReward = document.getElementById('statPendingReward');

    if (!resultsContainer || !cardsContainer || !query) return;

    const allLeads = DataManager.getLeads();
    const cleanQuery = query.toLowerCase().replace(/\s+/g, '');
    const myLeads = allLeads.filter(l => l.referrerPhone.toLowerCase().replace(/\s+/g, '') === cleanQuery);

    if (myLeads.length === 0) {
        if (emptyState) {
            emptyState.innerHTML = `
                <div class="py-8 text-center text-slate-400">
                    <i class="fa-regular fa-folder-open text-3xl mb-2 text-amber-500/40"></i>
                    <p class="font-semibold text-slate-300 text-xs">Không tìm thấy hồ sơ nào với <span class="text-amber-400 font-mono">${query}</span></p>
                    <p class="text-[11px] text-slate-500 mt-1">Hãy kiểm tra lại SĐT hoặc Gmail của bạn.</p>
                </div>
            `;
            emptyState.classList.remove('hidden');
        }
        resultsContainer.classList.add('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    resultsContainer.classList.remove('hidden');

    let wonCount = 0;
    let totalEarned = 0;
    let pendingReward = 0;

    let html = '';
    myLeads.forEach(l => {
        const course = COURSES_CONFIG.find(c => c.id === l.actualCourseId) || COURSES_CONFIG.find(c => c.id === l.interestCourseId);
        const statusConfig = LEAD_STATUS[l.status] || LEAD_STATUS.NEW;

        const isWon = ['WON', 'APPROVED', 'PAID'].includes(l.status);
        if (isWon) wonCount++;

        if (l.status === 'PAID') {
            totalEarned += l.rewardAmount;
        } else if (l.status === 'APPROVED' || l.status === 'WON') {
            pendingReward += l.rewardAmount;
        }

        // Render card gọn gàng chuẩn điện thoại
        html += `
            <div class="gold-card p-3.5 rounded-2xl space-y-2 border-slate-800">
                <div class="flex items-center justify-between text-xs">
                    <span class="font-mono text-amber-400 font-bold">${l.id}</span>
                    <span class="px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusConfig.color}">
                        ${statusConfig.label}
                    </span>
                </div>

                <div class="flex items-start justify-between">
                    <div>
                        <div class="font-bold text-white text-sm">${l.customerName}</div>
                        <div class="text-[11px] text-slate-400 font-mono">${l.customerPhone.slice(0, 3)}****${l.customerPhone.slice(-3)}</div>
                    </div>
                    <div class="text-right">
                        <div class="font-black text-amber-300 text-base">${DataManager.formatCurrency(l.rewardAmount)}</div>
                        <div class="text-[10px] text-slate-400">${l.closeType === 'self' ? '100% tự chốt' : '50% đưa data'}</div>
                    </div>
                </div>

                <div class="bg-black/40 p-2 rounded-xl text-[11px] text-slate-300 flex items-center justify-between">
                    <span>Khóa học:</span>
                    <strong class="text-amber-200">${course?.name || '--'}</strong>
                </div>

                <!-- Hiển thị Kế Hoạch ACA nếu có lịch hẹn -->
                ${l.appointmentDate ? `
                    <div class="p-2.5 rounded-xl bg-yellow-950/25 border border-yellow-500/30 text-[11px] space-y-0.5">
                        <div class="text-yellow-300 font-bold flex items-center gap-1">
                            <i class="fa-regular fa-calendar-check text-yellow-400"></i> Kế Hoạch Đội ACA:
                        </div>
                        <div class="text-white">Lịch hẹn lên: <strong class="text-yellow-300">${DataManager.formatDate(l.appointmentDate)}</strong></div>
                        <div class="text-slate-300">Ngày hẹn đóng học phí: <strong class="text-emerald-300">${l.tuitionPaymentDate || 'Chưa ghi nhận'}</strong></div>
                        ${l.tuitionPaymentNote ? `<div class="text-slate-400 italic text-[10px]">Ghi chú: ${l.tuitionPaymentNote}</div>` : ''}
                    </div>
                ` : ''}

                ${l.adminNote ? `<div class="text-[10px] text-yellow-300/90 italic bg-amber-950/20 p-2 rounded-lg border border-amber-500/20">Tiến độ: ${l.adminNote}</div>` : ''}
            </div>
        `;
    });

    cardsContainer.innerHTML = html;

    if (statTotalSent) statTotalSent.textContent = myLeads.length;
    if (statWonCount) statWonCount.textContent = wonCount;
    if (statTotalEarned) statTotalEarned.textContent = DataManager.formatCurrency(totalEarned);
    if (statPendingReward) statPendingReward.textContent = DataManager.formatCurrency(pendingReward);
}

// 9. MODAL XEM POSTER GỐC
function initPosterModal() {
    const btnOpen = document.getElementById('btnViewOriginalPoster');
    const modal = document.getElementById('posterModal');
    const btnClose = document.getElementById('btnClosePosterModal');

    if (btnOpen && modal) {
        btnOpen.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        });
    }

    if (btnClose && modal) {
        btnClose.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }
}

// ==========================================================================
// 10. QUẢN LÝ HỒ SƠ THÀNH VIÊN & CẬP NHẬT ẢNH ĐẠI DIỆN (AVATAR)
// ==========================================================================

let currentEditingAvatar = '';

const PRESET_AVATARS = [
    { id: 'p1', emoji: '👑', label: 'Vương miện', color: '#f59e0b' },
    { id: 'p2', emoji: '💎', label: 'Kim cương', color: '#06b6d4' },
    { id: 'p3', emoji: '👁️', label: 'Lashes Pro', color: '#ec4899' },
    { id: 'p4', emoji: '🌸', label: 'Hoa đào', color: '#f43f5e' },
    { id: 'p5', emoji: '✨', label: 'Lấp lánh', color: '#eab308' },
    { id: 'p6', emoji: '💅', label: 'Nghệ nhân', color: '#a855f7' }
];

function initUserProfileModal() {
    const btnOpenHeader = document.getElementById('btnOpenUserProfileModal');
    if (btnOpenHeader) {
        btnOpenHeader.addEventListener('click', openUserProfileModal);
    }

    const modal = document.getElementById('userProfileModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeUserProfileModal();
        });
    }

    const fileInput = document.getElementById('avatarFileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleAvatarFileUpload);
    }

    const btnRemoveAvatar = document.getElementById('btnRemoveAvatar');
    if (btnRemoveAvatar) {
        btnRemoveAvatar.addEventListener('click', () => {
            currentEditingAvatar = '';
            showAvatarPreview('');
        });
    }

    const profileForm = document.getElementById('userProfileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleSaveProfileSubmit);
    }
}

function handleAvatarFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP...)!');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            // Nén và resize ảnh về kích thước tối đa 256x256 để lưu nhẹ nhàng trong localStorage
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 256;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_SIZE) {
                    height = Math.round(height * MAX_SIZE / width);
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width = Math.round(width * MAX_SIZE / height);
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            currentEditingAvatar = compressedDataUrl;
            showAvatarPreview(compressedDataUrl);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function showAvatarPreview(avatarUrl) {
    const previewImg = document.getElementById('profileAvatarPreview');
    const fallbackBox = document.getElementById('profileAvatarFallback');

    if (!previewImg || !fallbackBox) return;

    if (avatarUrl && avatarUrl.trim() !== '') {
        previewImg.src = avatarUrl;
        previewImg.classList.remove('hidden');
        fallbackBox.classList.add('hidden');
    } else {
        previewImg.src = '';
        previewImg.classList.add('hidden');
        fallbackBox.classList.remove('hidden');
    }
}

function renderPresetAvatars() {
    const container = document.getElementById('presetAvatarsList');
    if (!container) return;

    let html = '';
    PRESET_AVATARS.forEach(p => {
        html += `
            <button type="button" onclick="selectPresetAvatar('${p.emoji}', '${p.color}')" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 flex items-center justify-center text-sm transition-all active:scale-90 shadow-sm" title="${p.label}">
                <span>${p.emoji}</span>
            </button>
        `;
    });
    container.innerHTML = html;
}

window.selectPresetAvatar = function(emoji, color) {
    // Tạo SVG avatar tròn với emoji và background màu sang trọng
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
            <defs>
                <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </radialGradient>
            </defs>
            <circle cx="64" cy="64" r="62" fill="url(#grad)" stroke="${color}" stroke-width="4"/>
            <text x="64" y="80" font-size="52" text-anchor="middle" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif">${emoji}</text>
        </svg>
    `;
    const svgDataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.trim());
    currentEditingAvatar = svgDataUrl;
    showAvatarPreview(svgDataUrl);
};

window.openUserProfileModal = function() {
    const user = DataManager.getCurrentUser();
    if (!user) {
        document.getElementById('btnOpenLoginModal')?.click();
        return;
    }

    currentEditingAvatar = user.avatar || '';
    document.getElementById('profileInputName').value = user.name || '';
    document.getElementById('profileInputIdentifier').value = user.identifier || '';
    document.getElementById('profileInputRole').value = user.role || 'Học viên cũ';
    if (document.getElementById('profileNewPassword')) document.getElementById('profileNewPassword').value = '';
    if (document.getElementById('profileConfirmPassword')) document.getElementById('profileConfirmPassword').value = '';
    document.getElementById('profileBananaCount').textContent = user.bananas || 0;

    // Cập nhật Cấp Bậc Hệ Thống & Nút tắt Bảng điều hành
    const sysRole = user.systemRole || (user.role && user.role.toLowerCase().includes('chuyên viên') ? 'counselor' : (user.isAdmin ? 'admin' : 'collaborator'));
    const badgeEl = document.getElementById('profileSystemRoleBadgeDisplay');
    const counselorBox = document.getElementById('profileCounselorActionBox');
    if (badgeEl) {
        if (sysRole === 'admin') {
            badgeEl.innerHTML = '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">👑 Quản Trị Viên</span>';
        } else if (sysRole === 'counselor') {
            badgeEl.innerHTML = '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">🛡️ Chuyên Viên Hướng Nghiệp</span>';
        } else {
            badgeEl.innerHTML = '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">💼 Cộng Tác Viên</span>';
        }
    }
    if (counselorBox) {
        if (sysRole === 'counselor' || sysRole === 'admin') {
            counselorBox.classList.remove('hidden');
            const btn = document.getElementById('btnOpenDashboardFromProfile');
            if (btn) {
                btn.onclick = () => {
                    closeUserProfileModal();
                    window.location.href = 'admin.html';
                };
            }
        } else {
            counselorBox.classList.add('hidden');
        }
    }

    const miniGameBadge = document.getElementById('profileMiniGameBadge');
    if (miniGameBadge) {
        if (user.miniGameApproved) {
            miniGameBadge.innerHTML = '<span class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check"></i> Đã mở quyền chơi</span>';
        } else {
            miniGameBadge.innerHTML = '<span class="text-amber-400 font-bold"><i class="fa-solid fa-hourglass-half"></i> Chưa tham gia / Chờ duyệt</span>';
        }
    }

    showAvatarPreview(currentEditingAvatar);
    renderPresetAvatars();

    const modal = document.getElementById('userProfileModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.closeUserProfileModal = function() {
    const modal = document.getElementById('userProfileModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

function handleSaveProfileSubmit(e) {
    e.preventDefault();
    const user = DataManager.getCurrentUser();
    if (!user) return;

    const name = document.getElementById('profileInputName').value.trim();
    const role = document.getElementById('profileInputRole').value;
    const newPassEl = document.getElementById('profileNewPassword');
    const confirmPassEl = document.getElementById('profileConfirmPassword');
    const newPassword = newPassEl ? newPassEl.value.trim() : '';
    const confirmPassword = confirmPassEl ? confirmPassEl.value.trim() : '';

    if (!name) {
        alert('Vui lòng nhập họ và tên của bạn!');
        return;
    }

    const updates = {
        name,
        role,
        avatar: currentEditingAvatar
    };

    if (newPassword) {
        if (newPassword.length < 6) {
            alert('Mật khẩu mới phải có tối thiểu 6 ký tự!');
            if (newPassEl) newPassEl.focus();
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Xác nhận mật khẩu mới không trùng khớp! Vui lòng kiểm tra lại.');
            if (confirmPassEl) confirmPassEl.focus();
            return;
        }
        updates.password = newPassword;
    }

    const updated = DataManager.updateUser(user.id, updates);

    if (updated) {
        closeUserProfileModal();
        updateUserSessionUI();
        if (newPassword) {
            alert('Đã cập nhật thông tin cá nhân và đổi mật khẩu mới thành công!');
        } else {
            alert('Đã cập nhật thông tin cá nhân và ảnh đại diện thành công!');
        }
    }
}

// ==========================================================================
// 12. BẢNG XẾP HẠNG ĐUA TOP (LEADERBOARD CÔNG KHAI)
// ==========================================================================
let currentPublicLbTimeFilter = 'month'; // 'month', 'week', 'day', 'year'
let currentPublicLbDate = new Date();
let currentPublicLbCategory = 'data'; // 'data', 'banana'
let currentPublicLbCampaign = 'ALL';

function initPublicLeaderboard() {
    populatePublicLbCampaignDropdown();
    updatePublicLbPeriodLabel();
    renderPublicLeaderboard();
}

function populatePublicLbCampaignDropdown() {
    const select = document.getElementById('selectPublicLbCampaign');
    if (!select) return;

    const campaigns = DataManager.getCampaigns ? DataManager.getCampaigns() : [];
    let html = '<option value="ALL">🌟 Tất Cả Các Chương Trình</option>';
    campaigns.forEach(c => {
        const activeTag = c.isActive ? ' (Đang Áp Dụng)' : '';
        html += `<option value="${c.id}">${c.name}${activeTag}</option>`;
    });
    select.innerHTML = html;
    select.value = currentPublicLbCampaign;
}
window.populatePublicLbCampaignDropdown = populatePublicLbCampaignDropdown;

function changePublicLbCampaign(campId) {
    currentPublicLbCampaign = campId || 'ALL';
    renderPublicLeaderboard();
}
window.changePublicLbCampaign = changePublicLbCampaign;

function updatePublicLbPeriodLabel() {
    const labelEl = document.getElementById('publicLbPeriodLabel');
    const d = currentPublicLbDate || new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const y = d.getFullYear();
    const day = String(d.getDate()).padStart(2, '0');

    let text = `${m}/${y}`;
    if (currentPublicLbTimeFilter === 'day') {
        text = `${day}/${m}/${y}`;
    } else if (currentPublicLbTimeFilter === 'week') {
        const startOfWeek = new Date(d);
        const dayOfWeek = (d.getDay() + 6) % 7;
        startOfWeek.setDate(d.getDate() - dayOfWeek);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const sD = String(startOfWeek.getDate()).padStart(2, '0');
        const eD = String(endOfWeek.getDate()).padStart(2, '0');
        text = `${sD}-${eD}/${m}/${y}`;
    } else if (currentPublicLbTimeFilter === 'year') {
        text = `Năm ${y}`;
    }

    if (labelEl) labelEl.textContent = text;
}
window.updatePublicLbPeriodLabel = updatePublicLbPeriodLabel;

function setPublicLbTimeFilter(mode) {
    currentPublicLbTimeFilter = mode;
    ['btnPublicLbMonth', 'btnPublicLbWeek', 'btnPublicLbDay', 'btnPublicLbYear'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const match = (mode === 'month' && id === 'btnPublicLbMonth') ||
                      (mode === 'week' && id === 'btnPublicLbWeek') ||
                      (mode === 'day' && id === 'btnPublicLbDay') ||
                      (mode === 'year' && id === 'btnPublicLbYear');
        if (match) {
            btn.className = 'px-2.5 py-1.5 rounded-lg filter-btn-active transition-all font-bold text-xs flex items-center gap-1';
        } else {
            btn.className = 'px-2.5 py-1.5 rounded-lg filter-btn-inactive transition-all font-bold text-xs flex items-center gap-1';
        }
    });
    updatePublicLbPeriodLabel();
    renderPublicLeaderboard();
}
window.setPublicLbTimeFilter = setPublicLbTimeFilter;

function shiftPublicLbPeriod(direction) {
    if (!currentPublicLbDate) currentPublicLbDate = new Date();
    const d = new Date(currentPublicLbDate);
    if (currentPublicLbTimeFilter === 'day') {
        d.setDate(d.getDate() + direction);
    } else if (currentPublicLbTimeFilter === 'week') {
        d.setDate(d.getDate() + direction * 7);
    } else if (currentPublicLbTimeFilter === 'year') {
        d.setFullYear(d.getFullYear() + direction);
    } else {
        d.setMonth(d.getMonth() + direction);
    }
    currentPublicLbDate = d;
    updatePublicLbPeriodLabel();
    renderPublicLeaderboard();
}
window.shiftPublicLbPeriod = shiftPublicLbPeriod;

function switchPublicLbCategory(cat) {
    currentPublicLbCategory = cat;
    const btnData = document.getElementById('btnPublicLbData');
    const btnBanana = document.getElementById('btnPublicLbBanana');
    if (cat === 'data') {
        if (btnData) btnData.className = 'py-2.5 px-3 rounded-xl filter-btn-active font-bold text-xs flex items-center justify-center gap-1.5 shadow-md';
        if (btnBanana) btnBanana.className = 'py-2.5 px-3 rounded-xl filter-btn-inactive font-bold text-xs flex items-center justify-center gap-1.5 shadow-md';
    } else {
        if (btnData) btnData.className = 'py-2.5 px-3 rounded-xl filter-btn-inactive font-bold text-xs flex items-center justify-center gap-1.5 shadow-md';
        if (btnBanana) btnBanana.className = 'py-2.5 px-3 rounded-xl filter-btn-active font-bold text-xs flex items-center justify-center gap-1.5 shadow-md';
    }
    renderPublicLeaderboard();
}
window.switchPublicLbCategory = switchPublicLbCategory;

function maskIdentifier(idStr) {
    if (!idStr) return '***';
    if (idStr.includes('@')) {
        const parts = idStr.split('@');
        const name = parts[0];
        if (name.length <= 2) return `${name.charAt(0)}***@${parts[1]}`;
        return `${name.slice(0, 2)}***@${parts[1]}`;
    }
    if (idStr.length >= 7) {
        return `${idStr.slice(0, 3)}***${idStr.slice(-3)}`;
    }
    return idStr;
}

function renderPublicLeaderboard() {
    const podiumEl = document.getElementById('publicLbPodium');
    const theadEl = document.getElementById('publicLbTableHeader');
    const tbodyEl = document.getElementById('publicLbTableBody');
    const titleEl = document.getElementById('publicLbTableTitle');
    const counterBadge = document.getElementById('publicLbCounterBadge');

    const themeMode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
    const isNursery = (themeMode === 'nursery');

    const leaderboard = DataManager.getLeaderboard(currentPublicLbTimeFilter, currentPublicLbDate, currentPublicLbCampaign);
    const isData = (currentPublicLbCategory === 'data');
    const list = isData ? leaderboard.dataLeaderboard : leaderboard.bananaLeaderboard;

    if (counterBadge) {
        if (isNursery) {
            counterBadge.textContent = isData ? `${list.length} người gieo hạt` : `${list.length} thợ săn chuối`;
        } else {
            counterBadge.textContent = isData ? `${list.length} người đua top` : `${list.length} thợ săn chuối`;
        }
    }

    if (titleEl) {
        if (isNursery) {
            titleEl.innerHTML = isData 
                ? '<i class="fa-solid fa-seedling text-emerald-400"></i> Bảng Vinh Danh Người Gieo Hạt (Hạt Giống Cơ Hội)'
                : '<span class="text-xs">🍌</span> Bảng Phong Thần Vua Săn Chuối Mini Game';
        } else {
            titleEl.innerHTML = isData 
                ? '<i class="fa-solid fa-crown text-yellow-400"></i> Bảng Đua Top Giới Thiệu (Data Khách Hàng)'
                : '<span class="text-xs">🍌</span> Bảng Phong Thần Vua Săn Chuối Mini Game';
        }
    }

    // 1. Render Top 3 Podium Cards
    if (podiumEl) {
        if (list.length === 0) {
            const emptyText = isNursery
                ? (isData ? 'Chưa có hạt giống nào được gieo trong kỳ này. Hãy là Người Gieo Hạt đầu tiên bứt phá!' : 'Chưa có hoạt động mini game trong kỳ này.')
                : 'Chưa có dữ liệu đua top trong kỳ này. Hãy là người đầu tiên bứt phá!';
            podiumEl.innerHTML = `
                <div class="p-6 rounded-2xl bg-black/40 border border-slate-800 text-center text-slate-400 text-xs">
                    <i class="fa-solid fa-trophy text-3xl mb-2 text-slate-600"></i>
                    <p>${emptyText}</p>
                </div>
            `;
        } else {
            const top1 = list[0];
            const top2 = list.length > 1 ? list[1] : null;
            const top3 = list.length > 2 ? list[2] : null;

            const formatCard = (item, rank, medal, borderColor, glowColor, heightClass) => {
                if (!item) return `<div class="flex-1 opacity-25"></div>`;
                const statVal = isData ? DataManager.formatCurrency(item.totalReward) : `${item.totalBananas} 🍌`;
                const subStat = isData 
                    ? (isNursery ? `${item.totalLeads} hạt (${item.wonLeads} kết trái)` : `${item.totalLeads} khách (${item.wonLeads} chốt)`)
                    : `${item.approvedPosts} bài duyệt`;
                return `
                    <div class="flex-1 min-w-0 flex flex-col items-center justify-end text-center ${heightClass} p-1.5 sm:p-3 rounded-2xl bg-gradient-to-b from-[#141824] to-[#0c0f16] border ${borderColor} shadow-xl relative group">
                        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full ${glowColor} flex items-center justify-center text-base sm:text-lg mb-1 shadow-md">
                            ${medal}
                        </div>
                        <div class="font-bold text-[11px] sm:text-xs text-white truncate max-w-full px-0.5" title="${item.name}">${item.name}</div>
                        <div class="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-full">${maskIdentifier(isData ? item.phone : item.identifier)}</div>
                        <div class="mt-1.5 py-1 px-1 rounded-lg bg-black/60 border border-amber-500/30 w-full text-center">
                            <div class="font-extrabold text-yellow-300 font-mono text-[10px] sm:text-xs truncate">${statVal}</div>
                            <div class="text-[8px] sm:text-[9px] text-slate-400 font-medium truncate">${subStat}</div>
                        </div>
                    </div>
                `;
            };

            podiumEl.innerHTML = `
                <div class="flex items-end justify-center gap-1.5 sm:gap-3 pt-2 w-full max-w-full">
                    <!-- Hạng 2 -->
                    ${formatCard(top2, 2, '🥈', 'border-slate-500/50', 'bg-slate-500/20 text-slate-300', 'min-h-[130px] sm:min-h-[140px]')}
                    <!-- Hạng 1 (Quán Quân) -->
                    ${formatCard(top1, 1, '🥇', 'border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.25)]', 'bg-amber-500/30 text-yellow-300 scale-105 sm:scale-110', 'min-h-[150px] sm:min-h-[160px] pb-3 sm:pb-4')}
                    <!-- Hạng 3 -->
                    ${formatCard(top3, 3, '🥉', 'border-amber-700/50', 'bg-amber-900/30 text-amber-500', 'min-h-[120px] sm:min-h-[130px]')}
                </div>
            `;
        }
    }

    // 2. Render Table Headers
    if (theadEl) {
        if (isData) {
            if (isNursery) {
                theadEl.innerHTML = `
                    <tr>
                        <th class="py-2.5 px-3 text-center w-12">Hạng</th>
                        <th class="py-2.5 px-3">Người Gieo Hạt</th>
                        <th class="py-2.5 px-3 text-center">Số Hạt Giống</th>
                        <th class="py-2.5 px-3 text-center text-purple-300">🌱 Nảy Mầm</th>
                        <th class="py-2.5 px-3 text-center text-cyan-300">🌿 Đâm Chồi</th>
                        <th class="py-2.5 px-3 text-center text-emerald-400">🍎 Kết Trái</th>
                        <th class="py-2.5 px-3 text-right text-yellow-300 font-bold">Quả Ngọt</th>
                    </tr>
                `;
            } else {
                theadEl.innerHTML = `
                    <tr>
                        <th class="py-2.5 px-3 text-center w-12">Hạng</th>
                        <th class="py-2.5 px-3">Người Giới Thiệu</th>
                        <th class="py-2.5 px-3 text-center">Số Data</th>
                        <th class="py-2.5 px-3 text-center text-purple-300">Checkin</th>
                        <th class="py-2.5 px-3 text-center text-cyan-300">Training</th>
                        <th class="py-2.5 px-3 text-center text-emerald-400">Đã Chốt</th>
                        <th class="py-2.5 px-3 text-right text-yellow-300 font-bold">Thưởng Nhận</th>
                    </tr>
                `;
            }
        } else {
            theadEl.innerHTML = `
                <tr>
                    <th class="py-2.5 px-3 text-center w-12">Hạng</th>
                    <th class="py-2.5 px-3">Thành Viên</th>
                    <th class="py-2.5 px-3 text-center">Số Bài Nộp</th>
                    <th class="py-2.5 px-3 text-center text-emerald-400">Hợp Lệ</th>
                    <th class="py-2.5 px-3 text-right text-yellow-300 font-bold">Chuối (🍌)</th>
                </tr>
            `;
        }
    }

    // 3. Render Table Rows
    if (tbodyEl) {
        if (list.length === 0) {
            const colspan = isData ? 7 : 5;
            const emptyRow = isNursery
                ? (isData ? 'Chưa có dữ liệu gieo hạt trong kỳ này' : 'Không có hoạt động mini game trong kỳ này')
                : 'Không có dữ liệu trong kỳ này';
            tbodyEl.innerHTML = `<tr><td colspan="${colspan}" class="text-center py-8 text-slate-400">${emptyRow}</td></tr>`;
            return;
        }

        let html = '';
        list.forEach(item => {
            let medal = `<span class="font-mono font-bold text-slate-400">#${item.rank}</span>`;
            if (item.rank === 1) medal = `<span class="text-base">🥇</span>`;
            else if (item.rank === 2) medal = `<span class="text-base">🥈</span>`;
            else if (item.rank === 3) medal = `<span class="text-base">🥉</span>`;

            if (isData) {
                html += `
                    <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                        <td class="py-2.5 px-3 text-center font-bold">${medal}</td>
                        <td class="py-2.5 px-3">
                            <div class="font-bold text-white text-xs">${item.name}</div>
                            <div class="text-[10px] text-slate-400 font-mono">${maskIdentifier(item.phone)}</div>
                        </td>
                        <td class="py-2.5 px-3 text-center font-bold text-white font-mono">${item.totalLeads}</td>
                        <td class="py-2.5 px-3 text-center font-bold text-purple-300 font-mono">${item.checkinLeads}</td>
                        <td class="py-2.5 px-3 text-center font-bold text-cyan-300 font-mono">${item.trainingLeads}</td>
                        <td class="py-2.5 px-3 text-center font-bold text-emerald-400 font-mono">${item.wonLeads}</td>
                        <td class="py-2.5 px-3 text-right font-extrabold text-yellow-300 font-mono text-xs">
                            ${DataManager.formatCurrency(item.totalReward)}
                        </td>
                    </tr>
                `;
            } else {
                html += `
                    <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                        <td class="py-2.5 px-3 text-center font-bold">${medal}</td>
                        <td class="py-2.5 px-3">
                            <div class="font-bold text-white text-xs">${item.name}</div>
                            <div class="text-[10px] text-slate-400 font-mono">${maskIdentifier(item.identifier)}</div>
                        </td>
                        <td class="py-2.5 px-3 text-center font-bold text-white font-mono">${item.totalPosts}</td>
                        <td class="py-2.5 px-3 text-center font-bold text-emerald-400 font-mono">${item.approvedPosts}</td>
                        <td class="py-2.5 px-3 text-right font-extrabold text-yellow-300 font-mono text-xs">
                            ${item.totalBananas} 🍌
                        </td>
                    </tr>
                `;
            }
        });

        tbodyEl.innerHTML = html;
    }
}
window.renderPublicLeaderboard = renderPublicLeaderboard;

// ==========================================================================
// 13. CTV PERSONAL DASHBOARD, 5-STEP PIPELINE STEPPER & NOTIFICATIONS HUB
// ==========================================================================
let currentCtvLeadsFilter = 'ALL';
let currentCtvCachedLeads = [];

function quickLoginDemoCtv() {
    const res = DataManager.loginUser('0903123456', '123456');
    if (res.success) {
        updateUserSessionUI();
        const sec = document.getElementById('ctv-dashboard-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        alert(`Chào mừng bạn Trần Thị Thu Thảo! Đã tải Dashboard cá nhân của Cộng tác viên.`);
    } else {
        alert(res.message);
    }
}
window.quickLoginDemoCtv = quickLoginDemoCtv;

function renderCollaboratorDashboard(user) {
    if (!user) {
        renderCollaboratorDashboardGuest();
        return;
    }

    const guestCallout = document.getElementById('ctvGuestCallout');
    const loggedContainer = document.getElementById('ctvLoggedInContainer');
    if (guestCallout) guestCallout.classList.add('hidden');
    if (loggedContainer) loggedContainer.classList.remove('hidden');

    // 1. Cập nhật Thông Tin Hồ Sơ CTV
    const nameDisp = document.getElementById('ctvNameDisplay');
    const phoneDisp = document.getElementById('ctvPhoneDisplay');
    const roleDisp = document.getElementById('ctvRoleBadgeDisplay');
    const avatarImg = document.getElementById('ctvAvatarDisplay');
    const avatarDef = document.getElementById('ctvAvatarDefault');

    if (nameDisp) nameDisp.textContent = user.name || 'Cộng Tác Viên';
    if (phoneDisp) phoneDisp.textContent = user.identifier || '';
    if (roleDisp) roleDisp.textContent = `💼 ${user.role || 'CTV Tuyển Sinh'}`;

    if (avatarImg && avatarDef) {
        if (user.avatar && user.avatar.trim() !== '') {
            avatarImg.src = user.avatar;
            avatarImg.classList.remove('hidden');
            avatarDef.classList.add('hidden');
        } else {
            avatarImg.src = '';
            avatarImg.classList.add('hidden');
            avatarDef.classList.remove('hidden');
        }
    }

    // 2. Lấy dữ liệu thống kê từ DataManager
    const stats = DataManager.getCollaboratorDashboardData(user.identifier);
    currentCtvCachedLeads = stats.leads || [];

    // KPI 1: Tổng Data
    const kpiTotal = document.getElementById('ctvKpiTotalLeads');
    const kpiSubLeads = document.getElementById('ctvKpiSubLeads');
    if (kpiTotal) kpiTotal.textContent = stats.totalLeads;
    if (kpiSubLeads) {
        const inProgress = (stats.inFunnelBreakdown.careCount + stats.inFunnelBreakdown.checkinCount + stats.inFunnelBreakdown.trainingCount);
        kpiSubLeads.textContent = `${inProgress} đang trong phễu`;
    }

    // KPI 2: Chốt Thành Công
    const kpiWon = document.getElementById('ctvKpiWonLeads');
    const kpiWinRate = document.getElementById('ctvKpiWinRate');
    if (kpiWon) kpiWon.textContent = stats.wonLeads;
    if (kpiWinRate) {
        const rate = stats.totalLeads > 0 ? Math.round((stats.wonLeads / stats.totalLeads) * 1000) / 10 : 0;
        kpiWinRate.textContent = `Tỷ lệ chốt: ${rate}%`;
    }

    // KPI 3: Tiền Thưởng Đã Nhận
    const kpiPaid = document.getElementById('ctvKpiPaidReward');
    if (kpiPaid) kpiPaid.textContent = DataManager.formatCurrency(stats.paidReward);

    // KPI 4: ⭐ DỰ ĐOÁN TIỀN THƯỞNG SẮP NHẬN ĐƯỢC
    const kpiUpcoming = document.getElementById('ctvKpiUpcomingReward');
    const kpiUpcomingSub = document.getElementById('ctvKpiUpcomingSub');
    if (kpiUpcoming) kpiUpcoming.textContent = DataManager.formatCurrency(stats.estimatedUpcomingReward);
    if (kpiUpcomingSub) {
        const activeFunnelCount = stats.inFunnelBreakdown.trainingCount + stats.inFunnelBreakdown.checkinCount + stats.inFunnelBreakdown.careCount;
        kpiUpcomingSub.textContent = `Ước tính từ ${activeFunnelCount} khách đang xử lý`;
    }

    // Phễu Chi Tiết Vườn Ươm
    const pillTraining = document.getElementById('ctvPipelineTrainingPill');
    const pillCheckin = document.getElementById('ctvPipelineCheckinPill');
    const pillCare = document.getElementById('ctvPipelineCarePill');
    const grossTotalDisp = document.getElementById('ctvPipelineGrossTotal');

    const themeMode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
    if (themeMode === 'nursery') {
        if (pillTraining) pillTraining.textContent = `${stats.inFunnelBreakdown.trainingCount} 🌿 Đâm chồi (100%)`;
        if (pillCheckin) pillCheckin.textContent = `${stats.inFunnelBreakdown.checkinCount} 🌱 Nảy mầm (75%)`;
        if (pillCare) pillCare.textContent = `${stats.inFunnelBreakdown.careCount} 💧 Tưới mát (45%)`;
    } else {
        if (pillTraining) pillTraining.textContent = `${stats.inFunnelBreakdown.trainingCount} Đào tạo (100%)`;
        if (pillCheckin) pillCheckin.textContent = `${stats.inFunnelBreakdown.checkinCount} Check-in (75%)`;
        if (pillCare) pillCare.textContent = `${stats.inFunnelBreakdown.careCount} Tư vấn (45%)`;
    }
    if (grossTotalDisp) grossTotalDisp.textContent = DataManager.formatCurrency(stats.totalPipelineReward);

    // 3. Cập nhật Số Lượng Tab Lọc
    const countAll = stats.leads.length;
    let countCare = 0;
    let countCheckin = 0;
    let countTraining = 0;
    let countWon = 0;

    stats.leads.forEach(l => {
        const lvl = DataManager.getFunnelLevel(l.status);
        if (lvl === 2) countCare++;
        else if (lvl === 3) countCheckin++;
        else if (lvl === 4) countTraining++;
        else if (lvl >= 5) countWon++;
    });

    const setTabCount = (id, count) => {
        const el = document.getElementById(id);
        if (el) el.textContent = count;
    };
    setTabCount('ctvTabCount_ALL', countAll);
    setTabCount('ctvTabCount_CARE', countCare);
    setTabCount('ctvTabCount_CHECKIN', countCheckin);
    setTabCount('ctvTabCount_TRAINING', countTraining);
    setTabCount('ctvTabCount_WON', countWon);

    const badgeTotal = document.getElementById('ctvLeadsCountBadge');
    if (badgeTotal) badgeTotal.textContent = (themeMode === 'nursery') ? `${countAll} hạt giống` : `${countAll} hồ sơ`;

    // 4. Render danh sách các Data kèm 5-Step Stepper
    renderFilteredCtvLeads();
}
window.renderCollaboratorDashboard = renderCollaboratorDashboard;

function renderCollaboratorDashboardGuest() {
    const guestCallout = document.getElementById('ctvGuestCallout');
    const loggedContainer = document.getElementById('ctvLoggedInContainer');
    if (guestCallout) guestCallout.classList.remove('hidden');
    if (loggedContainer) loggedContainer.classList.add('hidden');
    currentCtvCachedLeads = [];
}
window.renderCollaboratorDashboardGuest = renderCollaboratorDashboardGuest;

function filterCtvLeadsTab(status) {
    currentCtvLeadsFilter = status;
    const tabs = ['ALL', 'CARE', 'CHECKIN', 'TRAINING', 'WON'];
    tabs.forEach(t => {
        const btn = document.getElementById(`ctvTabBtn_${t}`);
        if (!btn) return;
        if (t === status) {
            btn.className = 'px-3 py-1.5 rounded-xl filter-btn-active font-bold text-xs whitespace-nowrap active:scale-95 transition-all shadow-md';
        } else {
            btn.className = 'px-3 py-1.5 rounded-xl filter-btn-inactive font-bold text-xs whitespace-nowrap active:scale-95 transition-all';
        }
    });
    renderFilteredCtvLeads();
}
window.filterCtvLeadsTab = filterCtvLeadsTab;

function renderFilteredCtvLeads() {
    const container = document.getElementById('ctvLeadsListContainer');
    if (!container) return;

    let list = currentCtvCachedLeads;
    if (currentCtvLeadsFilter !== 'ALL') {
        list = list.filter(l => {
            const lvl = DataManager.getFunnelLevel(l.status);
            if (currentCtvLeadsFilter === 'CARE') return lvl === 2;
            if (currentCtvLeadsFilter === 'CHECKIN') return lvl === 3;
            if (currentCtvLeadsFilter === 'TRAINING') return lvl === 4;
            if (currentCtvLeadsFilter === 'WON') return lvl >= 5;
            return true;
        });
    }

    if (list.length === 0) {
        const themeMode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
        const isNursery = themeMode === 'nursery';
        const emptyMsg = isNursery ? 'Chưa có hạt giống cơ hội nào trong mục này.' : 'Chưa có hồ sơ data nào trong mục này.';
        const emptyBtn = isNursery
            ? '<i class="fa-solid fa-seedling text-xs"></i> Trao Hạt Giống Ngay'
            : '<i class="fa-solid fa-paper-plane text-xs"></i> Nộp Data Ngay';
        container.innerHTML = `
            <div class="p-6 rounded-2xl bg-black/40 border border-slate-800 text-center text-slate-400 text-xs">
                <i class="fa-solid ${isNursery ? 'fa-seedling' : 'fa-folder-open'} text-2xl text-amber-500/60 mb-2"></i>
                <p>${emptyMsg}</p>
                <button type="button" onclick="navigateToScreen('screen-lead-form')" class="btn-gold-outline py-2 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 mt-3 active:scale-95">
                    ${emptyBtn}
                </button>
            </div>
        `;
        return;
    }

    let html = '';
    list.forEach(lead => {
        html += renderSingleCtvLeadStepperCard(lead);
    });
    container.innerHTML = html;
}
window.renderFilteredCtvLeads = renderFilteredCtvLeads;

function renderSingleCtvLeadStepperCard(lead) {
    const currentLvl = DataManager.getFunnelLevel(lead.status); // 1 to 5
    const course = COURSES_CONFIG.find(c => c.id === lead.actualCourseId) || COURSES_CONFIG.find(c => c.id === lead.interestCourseId);
    const courseName = course ? course.name : (lead.actualCourseId || lead.interestCourseId || 'Khóa học Wings');
    const createdDate = DataManager.formatDateShort ? DataManager.formatDateShort(lead.createdAt) : (lead.createdAt || '').slice(0, 10);
    const isSelfClose = (lead.actualCloseType === 'self' || lead.closeType === 'self');
    const themeMode = (typeof getWingsThemeMode === 'function') ? getWingsThemeMode() : 'nursery';
    const isNursery = themeMode === 'nursery';

    const closeBadge = isNursery
        ? (isSelfClose
            ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-yellow-300 border border-amber-500/40">🌟 Tự Vun Trồng (100% Quả Ngọt)</span>`
            : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">🧚 Trao Bà Tiên Xanh (50% Quả Ngọt)</span>`)
        : (isSelfClose
            ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-yellow-300 border border-amber-500/40">🌟 Tự Chốt (100% Hoa Hồng)</span>`
            : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">🤝 Gửi Data (50% Hoa Hồng)</span>`);

    const rewardLabel = isNursery ? 'Quả Ngọt Dự Kiến:' : 'Hoa Hồng Dự Kiến:';
    const companionLabel = isNursery ? (lead.assignedTo || 'Bà Tiên Xanh 🧚') : (lead.assignedTo || 'Chuyên viên hướng nghiệp');

    // Cấu hình 5 bước trong hành trình
    const steps = isNursery ? [
        { level: 1, label: '🤲 Gieo hạt', icon: 'fa-seedling', desc: 'Đã nhận data' },
        { level: 2, label: '💧 Tưới mát', icon: 'fa-droplet', desc: 'Đang tư vấn' },
        { level: 3, label: '🌱 Nảy mầm', icon: 'fa-leaf', desc: 'Đã đến viện' },
        { level: 4, label: '🌿 Đâm chồi', icon: 'fa-spa', desc: 'Đang đào tạo' },
        { level: 5, label: '🍎 Kết trái', icon: 'fa-apple-whole', desc: 'Gặt quả ngọt' }
    ] : [
        { level: 1, label: '1. Tiếp nhận', icon: 'fa-inbox', desc: 'Đã nhận data' },
        { level: 2, label: '2. Tư vấn', icon: 'fa-comments', desc: 'Đang tư vấn' },
        { level: 3, label: '3. Check-in', icon: 'fa-location-dot', desc: 'Đã đến viện' },
        { level: 4, label: '4. Đào tạo', icon: 'fa-chalkboard-user', desc: 'Đang đào tạo' },
        { level: 5, label: '5. Hoàn thành', icon: 'fa-trophy', desc: 'Hoàn tất' }
    ];

    // Tính phần trăm line fill
    let progressPercent = 0;
    if (currentLvl === 1) progressPercent = 0;
    else if (currentLvl === 2) progressPercent = 25;
    else if (currentLvl === 3) progressPercent = 50;
    else if (currentLvl === 4) progressPercent = 75;
    else if (currentLvl >= 5) progressPercent = 100;

    // Render từng node
    let stepsHtml = '';
    steps.forEach((st) => {
        let nodeClass = 'step-node-pending';
        let nodeContent = `<i class="fa-solid ${st.icon} text-slate-500 text-[10px]"></i>`;
        let labelClass = 'text-slate-500 font-medium';

        if (st.level < currentLvl) {
            nodeClass = 'step-node-completed';
            nodeContent = `<i class="fa-solid fa-check text-white text-[10px]"></i>`;
            labelClass = 'text-emerald-400 font-semibold';
        } else if (st.level === currentLvl) {
            nodeClass = 'step-node-active';
            nodeContent = `<i class="fa-solid ${st.icon} text-black text-xs font-black"></i>`;
            labelClass = 'text-yellow-300 font-bold';
        }

        stepsHtml += `
            <div class="stepper-step">
                <div class="step-node ${nodeClass}">
                    ${nodeContent}
                </div>
                <span class="text-[9px] sm:text-[10px] ${labelClass} leading-tight block truncate max-w-full px-0.5">
                    ${st.label}
                </span>
            </div>
        `;
    });

    // Thông tin cập nhật mới nhất từ Học viện
    const noteText = lead.adminNote || (
        isNursery ? (
            currentLvl >= 5 ? '🍎 Hạt giống đã kết trái ngọt ngào! Học viên đã tốt nghiệp xuất sắc.' :
            currentLvl === 4 ? '🌿 Hạt giống đang đâm chồi vươn mình, học viên đang thực hành mẫu tại học viện.' :
            currentLvl === 3 ? '🌱 Hạt giống đã nảy mầm! Khách đã ghé học viện, đang trao đổi cùng chuyên viên.' :
            currentLvl === 2 ? '💧 Đang tưới mát hạt giống: Bà Tiên Xanh đang tư vấn lộ trình học cho khách hàng.' :
            '🤲 Đã tiếp nhận hạt giống cơ hội vào Vườn Ươm Wings.'
        ) : (
            currentLvl >= 5 ? '🏆 Hồ sơ đã hoàn tất! Học viên đã tốt nghiệp và hoa hồng đã được thanh toán.' :
            currentLvl === 4 ? '📚 Học viên đang trong khóa đào tạo thực hành mẫu tại học viện Wings.' :
            currentLvl === 3 ? '🏢 Khách hàng đã check-in tại học viện, chuyên viên đang hướng dẫn trực tiếp.' :
            currentLvl === 2 ? '📞 Chuyên viên tư vấn đang liên hệ định hướng nghề nghiệp và sắp xếp lịch hẹn.' :
            '📥 Hồ sơ ứng viên đã được tiếp nhận thành công vào hệ thống CRM.'
        )
    );

    const appointmentHtml = lead.appointmentDate ? `
        <div class="text-[10px] text-purple-300 flex items-center gap-1 mt-1">
            <i class="fa-regular fa-calendar-check text-[11px]"></i>
            <span>Lịch hẹn lên viện: <strong>${lead.appointmentDate.replace('T', ' ')}</strong></span>
        </div>
    ` : '';

    const tuitionNoteHtml = lead.tuitionPaymentNote ? `
        <div class="text-[10px] text-cyan-300 flex items-center gap-1 mt-0.5">
            <i class="fa-solid fa-receipt text-[10px]"></i>
            <span>${lead.tuitionPaymentNote}</span>
        </div>
    ` : '';

    const updateTitle = isNursery ? 'Cập nhật từ Vườn Ươm Wings:' : 'Cập nhật từ Hệ Thống Wings:';
    const updateIcon = isNursery ? 'fa-solid fa-seedling' : 'fa-solid fa-bell';
    const companionTitle = isNursery ? 'Đồng hành:' : 'Phụ trách:';

    return `
        <div class="p-3.5 rounded-2xl bg-black/60 border border-amber-500/25 hover:border-amber-500/50 shadow-lg space-y-3 transition-all">
            <!-- Header của thẻ Hạt giống / Data -->
            <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 flex-wrap">
                <div class="flex items-center gap-2">
                    <span class="font-mono text-xs font-bold text-amber-400">#${lead.id}</span>
                    <span class="text-[10px] text-slate-500 font-mono">${createdDate}</span>
                    ${closeBadge}
                </div>
                <div class="text-right">
                    <span class="text-[10px] text-slate-400 block leading-tight">${rewardLabel}</span>
                    <strong class="text-yellow-400 font-mono font-black text-xs sm:text-sm">
                        ${DataManager.formatCurrency(lead.rewardAmount)}
                    </strong>
                </div>
            </div>

            <!-- Thông tin khách hàng & Khóa học -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                    <div class="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                        <i class="fa-solid fa-user text-amber-400 text-xs"></i>
                        <span>${lead.customerName}</span>
                        <span class="text-slate-400 font-mono text-[11px]">(${maskIdentifier(lead.customerPhone)})</span>
                    </div>
                    <div class="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1">
                        <i class="fa-solid fa-graduation-cap text-yellow-400 text-xs"></i>
                        <span class="text-amber-200 font-medium">${courseName}</span>
                    </div>
                </div>
                <div class="text-[11px] text-slate-400 sm:text-right">
                    <div>Mục tiêu: <span class="text-white font-semibold">${lead.customerTarget || 'Học nghề'}</span></div>
                    <div>${companionTitle} <span class="text-amber-300">${companionLabel}</span></div>
                </div>
            </div>

            <!-- THANH TIẾN TRÌNH TRỰC QUAN 5 BƯỚC HÀNH TRÌNH VUN TRỒNG / SALES PIPELINE -->
            <div class="pt-1 pb-1">
                <div class="stepper-container">
                    <div class="step-line-bg">
                        <div class="step-line-fill" style="width: ${progressPercent}%;"></div>
                    </div>
                    ${stepsHtml}
                </div>
            </div>

            <!-- HỘP THÔNG BÁO TIẾN ĐỘ THỰC TẾ -->
            <div class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px]">
                <div class="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                    <i class="${updateIcon} text-xs"></i>
                    <span>${updateTitle}</span>
                </div>
                <p class="text-slate-200 leading-relaxed font-light">${noteText}</p>
                ${appointmentHtml}
                ${tuitionNoteHtml}
            </div>
        </div>
    `;
}
window.renderSingleCtvLeadStepperCard = renderSingleCtvLeadStepperCard;

// ======================== NOTIFICATION HUB ========================
function updateNotificationBadge(identifier) {
    const badgeHeader = document.getElementById('unreadNotifBadge');
    const badgeCtv = document.getElementById('ctvNotifCounterBadge');

    if (!identifier) {
        if (badgeHeader) badgeHeader.classList.add('hidden');
        if (badgeCtv) badgeCtv.classList.add('hidden');
        return;
    }

    const notifData = DataManager.getUserNotifications(identifier);
    const count = notifData.unreadCount || 0;

    const applyBadge = (el) => {
        if (!el) return;
        if (count > 0) {
            el.textContent = count > 99 ? '99+' : count;
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    };

    applyBadge(badgeHeader);
    applyBadge(badgeCtv);
}
window.updateNotificationBadge = updateNotificationBadge;

function openNotificationsModal() {
    const user = DataManager.getCurrentUser();
    if (!user) {
        alert('Vui lòng đăng nhập để xem thông báo cá nhân!');
        document.getElementById('btnOpenLoginModal')?.click();
        return;
    }

    renderNotificationsList(user.identifier);
    const modal = document.getElementById('ctvNotificationsModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}
window.openNotificationsModal = openNotificationsModal;

function closeNotificationsModal() {
    const modal = document.getElementById('ctvNotificationsModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}
window.closeNotificationsModal = closeNotificationsModal;

function markAllNotificationsAsRead() {
    const user = DataManager.getCurrentUser();
    if (user) {
        DataManager.markAllNotificationsRead(user.identifier);
        updateNotificationBadge(user.identifier);
        renderNotificationsList(user.identifier);
    }
}
window.markAllNotificationsAsRead = markAllNotificationsAsRead;

function renderNotificationsList(identifier) {
    const listEl = document.getElementById('ctvNotificationsList');
    if (!listEl) return;

    const notifData = DataManager.getUserNotifications(identifier);
    const list = notifData.list || [];

    if (list.length === 0) {
        listEl.innerHTML = `
            <div class="py-8 text-center text-slate-400 text-xs">
                <i class="fa-regular fa-bell-slash text-2xl text-slate-600 mb-2"></i>
                <p>Bạn chưa có thông báo mới nào.</p>
            </div>
        `;
        return;
    }

    let html = '';
    list.forEach(n => {
        const isRead = n.isRead;
        const bgClass = isRead ? 'bg-black/30 border-slate-800 opacity-70' : 'bg-gradient-to-r from-amber-950/20 to-slate-900 border-amber-500/30';
        const unreadDot = isRead ? '' : `<span class="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 animate-ping"></span>`;

        html += `
            <div class="p-3 rounded-2xl border ${bgClass} flex items-start gap-2.5 transition-all">
                <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-sm mt-0.5">
                    <i class="${n.icon}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1 mb-0.5">
                        <div class="font-bold text-white text-xs truncate flex items-center gap-1.5">
                            <span>${n.title}</span>
                            ${unreadDot}
                        </div>
                        <span class="text-[10px] text-slate-500 font-mono flex-shrink-0">${n.time}</span>
                    </div>
                    <p class="text-[11px] text-slate-300 leading-relaxed font-light">${n.message}</p>
                    <div class="mt-1 flex items-center gap-2">
                        <span class="px-2 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-yellow-300 border border-amber-500/30">${n.badge}</span>
                        <span class="text-[10px] text-slate-500 font-mono">Mã: ${n.leadId}</span>
                    </div>
                </div>
            </div>
        `;
    });

    listEl.innerHTML = html;
}
window.renderNotificationsList = renderNotificationsList;

// ==========================================================================
// 13. GIAO DIỆN ĐĂNG NHẬP & ĐĂNG KÝ BAN ĐẦU (TELESALES & CTV PORTAL)
// ==========================================================================

// Chuyển đổi giữa các chế độ xem trong thẻ ban đầu:
// 'main': Chế độ mặc định với nút Google Sign-In như poster
// 'password': Mở form đăng nhập bằng SĐT/Gmail & Mật khẩu
// 'register': Mở form đăng ký thành viên mới
window.switchInitialAuthView = function(view) {
    const mainView = document.getElementById('initialAuthMainView');
    const pwdView = document.getElementById('initialAuthPasswordView');
    const regView = document.getElementById('initialAuthRegisterView');

    if (mainView) mainView.classList.add('hidden');
    if (pwdView) pwdView.classList.add('hidden');
    if (regView) regView.classList.add('hidden');

    if (view === 'password' && pwdView) {
        pwdView.classList.remove('hidden');
        const input = document.getElementById('inlineLoginIdentifier');
        if (input) setTimeout(() => input.focus(), 50);
    } else if (view === 'register' && regView) {
        regView.classList.remove('hidden');
        const input = document.getElementById('inlineRegName');
        if (input) setTimeout(() => input.focus(), 50);
    } else if (mainView) {
        mainView.classList.remove('hidden');
    }
};

// Đăng nhập nhanh với Google (Nguyên Bùi hoặc nhập Gmail Google bất kỳ)
window.handleInitialGoogleLogin = function() {
    // 1. Kiểm tra tài khoản mẫu chuẩn poster: Nguyên Bùi (nguyen.bui@wingslashes.com)
    const googleProfile = {
        name: 'Nguyên Bùi',
        email: 'nguyen.bui@wingslashes.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };

    const confirmLogin = confirm(
        `Xác nhận đăng nhập với tài khoản Google:\n\n` +
        `👤 Tên: ${googleProfile.name}\n` +
        `📧 Email: ${googleProfile.email}\n\n` +
        `Bấm "OK" để đăng nhập với ${googleProfile.name}.\n` +
        `Bấm "Cancel" nếu bạn muốn nhập địa chỉ Gmail khác của bạn.`
    );

    if (confirmLogin) {
        const res = DataManager.loginWithGoogle(googleProfile);
        if (res.success) {
            updateUserSessionUI();
            if (typeof refreshAdminDashboard === 'function') refreshAdminDashboard();
            alert(`🎉 Chào mừng ${res.user.name} đã đăng nhập thành công vào Wings Portal!`);
        } else {
            alert(res.message || 'Không thể đăng nhập bằng tài khoản này.');
        }
    } else {
        // Cho phép nhập Gmail cá nhân của người dùng để đăng nhập / đăng ký tự động
        const customEmail = prompt('Nhập địa chỉ Gmail Google của bạn để đăng nhập:', '');
        if (customEmail && customEmail.trim() !== '') {
            const cleanEmail = customEmail.trim().toLowerCase();
            const defaultName = cleanEmail.split('@')[0];
            const customProfile = {
                name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
                email: cleanEmail,
                avatar: ''
            };
            const res = DataManager.loginWithGoogle(customProfile);
            if (res.success) {
                updateUserSessionUI();
                if (typeof refreshAdminDashboard === 'function') refreshAdminDashboard();
                alert(`🎉 Đăng nhập thành công với Gmail: ${cleanEmail}`);
            } else {
                alert(res.message || 'Lỗi khi đăng nhập bằng Google.');
            }
        }
    }
};

// Cuộn mượt đến thẻ đăng ký từ nút CTA ở chân trang Wiki
window.scrollToAuthOrOpenRegister = function() {
    const user = DataManager.getCurrentUser ? DataManager.getCurrentUser() : null;

    if (user) {
        // Đã đăng nhập: chuyển sang Screen 3 (Nộp Data)
        if (typeof window.navigateToScreen === 'function') {
            window.navigateToScreen('screen-lead-form');
        }
        return;
    }

    const callout = document.getElementById('ctvGuestCallout');
    if (callout) {
        callout.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof switchInitialAuthView === 'function') {
            switchInitialAuthView('register');
        }
    } else {
        const regModalBtn = document.getElementById('btnOpenRegisterModal');
        if (regModalBtn) regModalBtn.click();
    }
};



