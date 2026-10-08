// ==========================================================================
// WINGS BEAUTY & ACADEMY - FRONTEND APPLICATION SCRIPT (MOBILE-FIRST iPHONE)
// Tối ưu hóa chuyển tab iOS, Thẻ khóa học di động & Thao tác cảm ứng ngón cái
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initIosBottomTabBar();
    initRewardMobileCards();
    initRewardCalculator();
    initUserAuth();
    initLeadForm();
    initBananaMiniGame();
    initGameRegistrationProof();
    initTracking();
    initPosterModal();
    initTouchChips();
    initUserProfileModal();
    updateUserSessionUI();
});

// ==========================================================================
// 1. THANH ĐIỀU HƯỚNG ĐÁY MÀN HÌNH CHUẨN iPHONE (iOS BOTTOM TAB BAR)
// ==========================================================================
function initIosBottomTabBar() {
    const tabItems = document.querySelectorAll('.ios-tab-item');
    if (!tabItems.length) return;

    tabItems.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            tabItems.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Tự động nhận diện section đang cuộn tới để đổi tab active (Ưu tiên Nộp data ở vị trí 2)
    const sections = ['the-le', 'form-dang-ky', 'mini-game', 'tra-cuu'];
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const top = el.offsetTop;
                const height = el.offsetHeight;
                if (scrollPosition >= top && scrollPosition < top + height) {
                    tabItems.forEach(t => {
                        if (t.getAttribute('data-target') === id) {
                            tabItems.forEach(item => item.classList.remove('active'));
                            t.classList.add('active');
                        }
                    });
                }
            }
        });
    }, { passive: true });
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
    // Cập nhật tab active trên iPhone Bottom Navigation
    document.querySelectorAll('.ios-tab-item').forEach(tab => {
        if (tab.getAttribute('data-target') === 'form-dang-ky') {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    const leadSection = document.getElementById('form-dang-ky');
    if (leadSection) {
        leadSection.scrollIntoView({ behavior: 'smooth' });
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

window.smoothScrollToWiki = function(e, tab = null) {
    if (e && e.preventDefault) e.preventDefault();
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
        const currentPercent = selectedRole === 'self' ? (course.selfPercent || 20) : (course.acaPercent || 10);
        
        if (selectedPayout) {
            selectedPayout.innerHTML = `
                <div class="text-[11px] uppercase tracking-wider text-amber-300/80 mb-1">Mức thưởng bạn sẽ nhận:</div>
                <div class="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow">
                    ${DataManager.formatCurrency(currentRewardNum)}
                </div>
                <div class="text-[11px] text-slate-300 mt-1">
                    Hoa hồng: <strong class="text-yellow-300">${currentPercent}%</strong> • ${selectedRole === 'self' ? 'Tự chốt thành công (100% thưởng)' : 'Nhờ đội ACA chốt giúp (50% thưởng)'}
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
            const bankInfo = document.getElementById('regBank').value.trim();
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

        // Đồng bộ quyền trên Dashboard nếu đang mở
        if (typeof applyRoleTabPermissions === 'function') applyRoleTabPermissions();
    } else {
        if (guestNav) guestNav.classList.remove('hidden');
        if (memberNav) memberNav.classList.add('hidden');

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
    }

    renderBananaProgramRules();
}

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
        if (sectionTitle) sectionTitle.textContent = "Đơn Đăng Ký Mini Game Đang Chờ Duyệt 🍌";
        if (sectionSubtitle) sectionSubtitle.innerHTML = "Quản trị viên đang kiểm tra ảnh chuyển chuối đến ví Admin. Quyền nộp link bài đăng sẽ được mở ngay sau khi duyệt!";

        container.innerHTML = `
            <div class="banana-card p-6 rounded-3xl text-center shadow-2xl relative">
                <div class="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 text-2xl mx-auto mb-3 animate-pulse">
                    🍌
                </div>
                <h3 class="text-lg font-heading font-black text-white mb-2">
                    ĐƠN ĐĂNG KÝ ĐANG CHỜ ADMIN DUYỆT!
                </h3>
                <p class="text-slate-300 text-xs max-w-md mx-auto mb-4 leading-relaxed">
                    Bạn đã nộp ảnh bằng chứng chuyển <strong class="text-yellow-400 font-bold">${gameReg.bananasTransferred} Chuối 🍌</strong> đến ví Admin. Quản trị viên đang kiểm tra và sẽ kích hoạt quyền chơi cho bạn trong ít phút!
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

                alert('Gửi đơn đăng ký thành công! Quản trị viên sẽ kiểm tra ảnh chuối đính kèm và duyệt mở quyền chơi cho bạn.');
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

            alert('Nộp link bài đăng thành công! Quản trị viên sẽ kiểm tra và cộng 1 Chuối 🍌 cho bạn.');
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

    const mId = document.getElementById('modalLeadId');
    if (mId) mId.textContent = lead.id;
    const mCust = document.getElementById('modalCustomerName');
    if (mCust) mCust.textContent = lead.customerName;
    const mCourse = document.getElementById('modalCourse');
    if (mCourse) mCourse.textContent = course?.name || 'Khóa học';
    const mClose = document.getElementById('modalCloseType');
    if (mClose) mClose.textContent = lead.closeType === 'self' ? 'Tự chốt (100% thưởng)' : 'Đưa data cho CV Hướng nghiệp (50% thưởng)';
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
    document.getElementById('profileInputBank').value = user.bankInfo || '';
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
                    const adminPanel = document.getElementById('adminDashboardSection');
                    if (typeof showAdminPanel === 'function') {
                        showAdminPanel();
                    } else if (adminPanel) {
                        adminPanel.classList.remove('hidden');
                    }
                    if (adminPanel) adminPanel.scrollIntoView({ behavior: 'smooth' });
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
    const bankInfo = document.getElementById('profileInputBank').value.trim();

    if (!name) {
        alert('Vui lòng nhập họ và tên của bạn!');
        return;
    }

    const updated = DataManager.updateUser(user.id, {
        name,
        role,
        bankInfo,
        avatar: currentEditingAvatar
    });

    if (updated) {
        closeUserProfileModal();
        updateUserSessionUI();
        alert('Đã cập nhật thông tin và ảnh đại diện thành công!');
    }
}

