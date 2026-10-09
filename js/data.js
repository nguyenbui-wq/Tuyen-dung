// ==========================================================================
// WINGS BEAUTY & ACADEMY - DATA MANAGER & BUSINESS LOGIC
// Phiên bản: Duyệt Đăng Ký Tham Gia Mini Game qua Ảnh Chuối Chuyển Đến Ví Admin 🍌
// ==========================================================================

const STORAGE_KEYS = {
    COURSES: 'wings_courses_v1',
    REWARD_CAMPAIGNS: 'wings_reward_campaigns_v1',
    ACTIVE_CAMPAIGN_ID: 'wings_active_campaign_id_v1',
    LEADS: 'wings_tuyendung_leads_v1',
    USERS: 'wings_users_v1',
    POSTS: 'wings_banana_posts_v1',
    GAME_REGISTRATIONS: 'wings_game_registrations_v1',
    BANANA_CONFIG: 'wings_banana_config_v1',
    CURRENT_USER: 'wings_current_session_v1',
    ADMIN_AUTH: 'wings_admin_auth_v1',
    ROLE_PERMISSIONS: 'wings_role_permissions_v1',
    THEME_MODE: 'wings_theme_mode_v1'
};

// ==========================================================================
// 0. BỘ CẤU HÌNH GIAO DIỆN 2 CHẾ ĐỘ: VƯỜN ƯƠM CẢM XÚC ⇄ PHIÊN BẢN THÔ TIÊU CHUẨN
// ==========================================================================
const WINGS_THEME_CONFIG = {
    nursery: {
        id: 'nursery',
        name: 'Vườn Ươm Wings',
        shortName: 'Vườn Ươm',
        icon: '🌱',
        buttonClass: 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/50 text-emerald-300',
        quote: {
            title: '“Vì lợi ích mười năm thì phải trồng cây,<br class="hidden sm:inline"> vì lợi ích trăm năm thì phải trồng người.”',
            sub: '— THẾ GIỚI CẢM XÚC & VƯỜN ƯƠM WINGS —'
        },
        hero: {
            badgeHtml: '<span>🌳 Vườn Ươm Wings</span><span class="text-amber-300">• Tuyển Sinh Tháng 10</span>',
            titleLine1: 'TRAO HẠT GIỐNG CƠ HỘI',
            titleLine2: 'GẶT THÀNH QUẢ VUN TRỒNG',
            descHtml: 'Mỗi data là một <strong class="text-amber-300">hạt giống cơ hội</strong> gửi gắm ước mơ. Hãy cùng <strong class="text-emerald-300">Bà Tiên Xanh</strong> vun trồng và gặt hái thành quả lên đến <strong class="text-yellow-400 font-bold">7.000.000đ</strong> cùng Mini Game <strong class="text-yellow-300">Chuối 🍌</strong>!',
            ctaHtml: '<i class="fa-solid fa-seedling text-black text-base"></i><span>🌰 TRAO HẠT GIỐNG CƠ HỘI (ƯU TIÊN)</span>'
        },
        storyBox: {
            title: '<i class="fa-solid fa-seedling text-emerald-400"></i> Ý Nghĩa Hành Trình Vun Trồng',
            subtitle: 'Vườn Ươm Wings',
            items: [
                { icon: '🌰', title: 'Hạt giống cơ hội:', desc: 'Mỗi người đang có mong muốn học nghề, đổi nghề hoặc tìm hướng đi mới.' },
                { icon: '🌱', title: 'Người gieo hạt (Bạn):', desc: 'Người đầu tiên nhìn thấy tiềm năng và mang cơ hội đến với Wings.' },
                { icon: '🧚', title: 'Bà tiên xanh:', desc: 'Tiếp nhận hạt giống, dùng sự tận tâm và kiến thức để nuôi dưỡng cơ hội.' },
                { icon: '🍎', title: 'Thành quả vun trồng:', desc: 'Sự ghi nhận xứng đáng cho quả ngọt bạn đã chung tay tạo nên.' }
            ],
            steps: ['🤲 Gieo hạt', '💧 Tưới mát', '🌱 Nảy mầm', '🌿 Đâm chồi', '🍎 Kết trái']
        },
        options: {
            opt1Title: '🌟 TỰ VUN TRỒNG',
            opt1Rate: '100%',
            opt1RateSub: 'Quả Ngọt',
            opt1Desc: 'Bạn trực tiếp tư vấn, gieo hạt và chăm sóc đến ngày kết trái.',
            opt2Title: '🌰 TRAO HẠT GIỐNG',
            opt2Rate: '50%',
            opt2RateSub: 'Quả Ngọt',
            opt2Desc: 'Bà tiên xanh đồng hành tư vấn, tưới mát và vun trồng.'
        },
        screen3: {
            badge: '<i class="fa-solid fa-seedling text-[10px]"></i> Vườn Ươm Wings • Nơi Gieo Mầm Cơ Hội',
            title: '🌰 Trao Hạt Giống Cơ Hội',
            subtitle: 'Gửi gắm ước mơ của người học để Bà Tiên Xanh chăm sóc, tưới mát và đồng hành!',
            sec1: '🌱 I. Người Gieo Hạt (Bạn)',
            sec2: '🌰 II. 4 Thông Tin Về Hạt Giống Cơ Hội',
            sec3Label: 'Lựa Chọn Hành Trình Vun Trồng:',
            radioPass: '🧚 Trao hạt giống cho Bà Tiên Xanh chăm sóc - <strong>50% Quả Ngọt</strong>',
            radioSelf: '🌟 Tôi tự mình tư vấn, chăm sóc đến ngày kết trái - <strong>100% Quả Ngọt</strong>',
            submitBtn: '<i class="fa-solid fa-seedling text-black text-lg"></i><span>🌰 TRAO HẠT GIỐNG & ĐĂNG KÝ GẶT THÀNH QUẢ</span>'
        },
        screen6: {
            kpiTotal: 'Tổng Hạt Giống',
            kpiWon: 'Đã Kết Trái 🍎',
            kpiPaid: 'Quả Ngọt Đã Hái',
            kpiUpcoming: 'Quả Ngọt Sắp Gặt',
            pipelineTitle: 'Vườn ươm đang vươn mình:',
            pipelinePotential: 'Tiềm năng quả ngọt:',
            stepperTitle: 'HÀNH TRÌNH VUN TRỒNG TỪNG HẠT GIỐNG',
            stepperSubtitle: 'Theo dõi sát sao từng bước tiếp nhận, tưới mát, nảy mầm, đâm chồi và kết trái ngọt',
            filterCare: '💧 Tưới Mát',
            filterCheckin: '🌱 Nảy Mầm',
            filterTraining: '🌿 Đâm Chồi',
            filterWon: '🍎 Kết Trái'
        },
        navTab2: {
            icon: 'fa-solid fa-seedling text-amber-400',
            label: 'Gieo Hạt'
        },
        stepperCard: {
            closeSelf: '🌟 Tự Vun Trồng (100% Quả Ngọt)',
            closePass: '🧚 Trao Bà Tiên Xanh (50% Quả Ngọt)',
            steps: [
                { level: 1, label: '🤲 Gieo hạt', icon: 'fa-seedling', desc: 'Đã nhận data' },
                { level: 2, label: '💧 Tưới mát', icon: 'fa-droplet', desc: 'Đang tư vấn' },
                { level: 3, label: '🌱 Nảy mầm', icon: 'fa-leaf', desc: 'Đã đến viện' },
                { level: 4, label: '🌿 Đâm chồi', icon: 'fa-spa', desc: 'Đang đào tạo' },
                { level: 5, label: '🍎 Kết trái', icon: 'fa-apple-whole', desc: 'Gặt quả ngọt' }
            ]
        },
        adminNav: {
            icon: 'fa-solid fa-tree text-[10px]',
            label: 'Kiểm Lâm',
            title: 'Khu vực Kiểm Lâm & Báo Cáo Hiệu Suất Vườn Ươm',
            modalTitle: 'Xác Thực Kiểm Lâm',
            modalDesc: 'Nhập mật khẩu Kiểm Lâm để mở quyền quản lý & duyệt'
        },
        leaderboard: {
            badge: '<i class="fa-solid fa-seedling text-emerald-400"></i> VƯỜN ƯƠM WINGS • BẢNG VINH DANH',
            title: 'BẢNG VINH DANH NGƯỜI GIEO HẠT',
            subtitle: 'Tôn vinh những Người Gieo Hạt & Thợ Săn Chuối mang lại nhiều quả ngọt nhất Wings',
            tabDataLabel: 'Người Gieo Hạt',
            tabDataIcon: '🌱',
            tableTitleData: '<i class="fa-solid fa-seedling text-emerald-400"></i> Bảng Vinh Danh Người Gieo Hạt (Hạt Giống Cơ Hội)',
            countUnitData: 'người gieo hạt',
            countUnitBanana: 'thợ săn chuối',
            podiumSubStat: '{0} hạt giống ({1} kết trái)',
            emptyMsg: 'Chưa có hạt giống nào được gieo trong kỳ này. Hãy là Người Gieo Hạt đầu tiên bứt phá!',
            theadCols: ['Hạng', 'Người Gieo Hạt', 'Số Hạt Giống', '🌱 Nảy Mầm', '🌿 Đâm Chồi', '🍎 Kết Trái', 'Quả Ngọt']
        },
        roles: {
            admin: '🌲 Kiểm Lâm (Vườn Ươm Wings)',
            counselor: '🧚 Bà Tiên Xanh (CV Hướng Nghiệp)',
            collaborator: '🌱 Người Gieo Hạt (Cộng Tác Viên)'
        },
        admin: {
            headerBadge: '🌲 KIỂM LÂM WINGS',
            headerSub: 'Hệ Thống Kiểm Lâm & Báo Cáo Vun Trồng Vườn Ươm Wings',
            titleTabLeads: '🌰 Quản Lý Hạt Giống & Tiến Trình',
            titleTabLeaderboard: '🏆 Bảng Vinh Danh',
            titleTabUsers: '🌱 Duyệt Người Gieo Hạt',
            titleTabPermissions: '🌲 Phân Quyền Kiểm Lâm',
            permDesc: 'Chỉ Kiểm Lâm mới có quyền tích chọn điều chỉnh quyền hạn cho các vị trí',
            permColAdmin: '1. Kiểm Lâm',
            permColCounselor: '2. Bà Tiên Xanh',
            permColCollab: '3. Người Gieo Hạt',
            btnConsOnline: '🌰 Trao Hạt (50%)',
            btnConsClient: '🌟 Tự Vun Trồng (100%)',
            funnelTitle: '<i class="fa-solid fa-seedling text-amber-400"></i> Hành Trình Vun Trồng Hạt Giống:',
            funnelTip: '💡 Hạt giống đâm chồi thì đã trải qua tưới mát và nảy mầm',
            funnelSteps: ['1. 🤲 Gieo hạt', '2. 💧 Tưới mát', '3. 🌱 Nảy mầm', '4. 🌿 Đâm chồi', '5. 🍎 Kết trái'],
            lbMainTitle: 'Bảng Vinh Danh Người Gieo Hạt & Vua Săn Chuối',
            lbMainSubtitle: 'Theo dõi thành tích vun trồng hạt giống và săn chuối của chuyên viên & người gieo hạt',
            lbTabDataBtn: '🌱 Đua Top Gieo Hạt',
            lbDataSectionTitle: 'Bảng Vinh Danh Người Gieo Hạt & Gặt Quả Ngọt Nhiều Nhất',
            lbTableHeaders: ['Hạng', 'Người Gieo Hạt', 'Số Hạt Giống', '🌱 Nảy Mầm', '🌿 Đâm Chồi', '🍎 Kết Trái (Won)', 'Quả Ngọt (VNĐ)'],
            statusOptions: [
                { value: 'ALL', text: 'Tất cả trạng thái' },
                { value: 'DATA', text: '1. 🤲 Gieo hạt (Data mới)' },
                { value: 'CARE', text: '2. 💧 Tưới mát (Chăm sóc)' },
                { value: 'CHECKIN', text: '3. 🌱 Nảy mầm (Checkin học viện)' },
                { value: 'TRAINING', text: '4. 🌿 Đâm chồi (Đang đào tạo)' },
                { value: 'WON', text: '5. 🍎 Kết trái (Duyệt quả ngọt)' },
                { value: 'PAID', text: '🍎 Đã thu hoạch (Chi trả thưởng)' },
                { value: 'LOST', text: '🥀 Khô héo / Thất bại' }
            ]
        }
    },
    standard: {
        id: 'standard',
        name: 'Phiên Bản Tiêu Chuẩn',
        shortName: 'Bản Thô',
        icon: '📊',
        buttonClass: 'bg-blue-950/50 hover:bg-blue-900/60 border-blue-500/50 text-blue-300',
        quote: {
            title: 'CHƯƠNG TRÌNH ĐỐI TÁC TUYỂN SINH WINGS ACADEMY',
            sub: '— HỆ THỐNG TELESALES & CỘNG TÁC VIÊN GIỚI THIỆU —'
        },
        hero: {
            badgeHtml: '<span>🎯 Chương Trình Đối Tác</span><span class="text-amber-300">• Tuyển Sinh Tháng 10</span>',
            titleLine1: 'GIỚI THIỆU HỌC VIÊN',
            titleLine2: 'NHẬN HOA HỒNG HẤP DẪN',
            descHtml: 'Mỗi thông tin ứng viên giới thiệu thành công nhận hoa hồng trực tiếp lên đến <strong class="text-yellow-400 font-bold">7.000.000đ</strong> cùng cơ hội nhận thưởng <strong class="text-yellow-300">Chuối 🍌</strong> tham gia Mini Game hàng tháng!',
            ctaHtml: '<i class="fa-solid fa-file-pen text-black text-base"></i><span>📋 NỘP DATA ỨNG VIÊN (ƯU TIÊN)</span>'
        },
        storyBox: {
            title: '<i class="fa-solid fa-list-check text-blue-400"></i> Quy Trình Duyệt Data & Chi Trả Thưởng',
            subtitle: 'Telesales CRM',
            items: [
                { icon: '📋', title: 'Data ứng viên:', desc: 'Người có nguyện vọng học nghề nối mi chuyên nghiệp hoặc nâng cao tay nghề.' },
                { icon: '👤', title: 'Người giới thiệu (Bạn):', desc: 'Người cung cấp SĐT và nhu cầu của ứng viên vào hệ thống Wings.' },
                { icon: '👩‍💼', title: 'Chuyên viên hướng nghiệp:', desc: 'Chuyên viên tiếp nhận hồ sơ, tư vấn lộ trình học và hỗ trợ ứng viên nhập học.' },
                { icon: '💰', title: 'Hoa hồng chi trả:', desc: 'Nhận tiền thưởng vào hệ thống lương sau khi học viên hoàn thành khóa học.' }
            ],
            steps: ['1. Tiếp nhận', '2. Tư vấn', '3. Check-in', '4. Đào tạo', '5. Hoàn thành']
        },
        options: {
            opt1Title: '🌟 TỰ CHỐT',
            opt1Rate: '100%',
            opt1RateSub: 'Hoa Hồng',
            opt1Desc: 'Bạn trực tiếp tư vấn và chốt khóa học cho ứng viên.',
            opt2Title: '🤝 GỬI DATA',
            opt2Rate: '50%',
            opt2RateSub: 'Hoa Hồng',
            opt2Desc: 'Chuyên viên hướng nghiệp tư vấn và chốt khóa học giúp bạn.'
        },
        screen3: {
            badge: '<i class="fa-solid fa-file-lines text-[10px]"></i> Hệ Thống Tiếp Nhận Ứng Viên Wings',
            title: '📋 Nộp Thông Tin Ứng Viên',
            subtitle: 'Gửi data để đội ngũ chuyên viên Wings liên hệ tư vấn và chi trả hoa hồng!',
            sec1: '👤 I. Thông Tin Người Giới Thiệu (CTV)',
            sec2: '📋 II. Thông Tin Chi Tiết Ứng Viên',
            sec3Label: 'Lựa Chọn Hình Thức Tư Vấn & Chốt:',
            radioPass: '🤝 Bàn giao data cho Chuyên viên tư vấn - <strong>50% Hoa Hồng</strong>',
            radioSelf: '🌟 Tôi trực tiếp tư vấn và chốt khóa học - <strong>100% Hoa Hồng</strong>',
            submitBtn: '<i class="fa-solid fa-paper-plane text-black text-lg"></i><span>📤 GỬI DATA ỨNG VIÊN & NHẬN HOA HỒNG</span>'
        },
        screen6: {
            kpiTotal: 'Tổng Data Đã Gửi',
            kpiWon: 'Đã Chốt Thành Công',
            kpiPaid: 'Hoa Hồng Đã Nhận',
            kpiUpcoming: 'Hoa Hồng Đang Chờ',
            pipelineTitle: 'Tiến độ hồ sơ ứng viên:',
            pipelinePotential: 'Tiềm năng hoa hồng:',
            stepperTitle: 'TIẾN ĐỘ TỪNG HỒ SƠ ỨNG VIÊN / DATA',
            stepperSubtitle: 'Theo dõi quy trình tiếp nhận, tư vấn, check-in, đào tạo và nhận hoa hồng',
            filterCare: 'Đang Tư Vấn',
            filterCheckin: 'Check-in',
            filterTraining: 'Đào Tạo',
            filterWon: 'Đã Chốt'
        },
        navTab2: {
            icon: 'fa-solid fa-file-circle-plus text-amber-400',
            label: 'Nộp Data'
        },
        stepperCard: {
            closeSelf: '🌟 Tự Chốt (100% Hoa Hồng)',
            closePass: '🤝 Chuyên Viên Chốt (50% Hoa Hồng)',
            steps: [
                { level: 1, label: '1. Tiếp nhận', icon: 'fa-file-lines', desc: 'Đã nhận data' },
                { level: 2, label: '2. Tư vấn', icon: 'fa-comments', desc: 'Đang tư vấn' },
                { level: 3, label: '3. Check-in', icon: 'fa-location-dot', desc: 'Đã đến viện' },
                { level: 4, label: '4. Đào tạo', icon: 'fa-chalkboard-user', desc: 'Đang đào tạo' },
                { level: 5, label: '5. Hoàn thành', icon: 'fa-circle-check', desc: 'Nhận hoa hồng' }
            ]
        },
        adminNav: {
            icon: 'fa-solid fa-shield-halved text-[10px]',
            label: 'Admin',
            title: 'Khu vực Quản Trị & Báo Cáo Hiệu Suất KPI',
            modalTitle: 'Xác Thực Quản Trị',
            modalDesc: 'Nhập mật khẩu quản trị để vào chức năng cài đặt & duyệt'
        },
        leaderboard: {
            badge: '<i class="fa-solid fa-trophy text-amber-400"></i> BẢNG VINH DANH & ĐUA TOP',
            title: 'BẢNG XẾP HẠNG ĐUA TOP',
            subtitle: 'Vinh danh những Chiến Binh Tuyển Sinh & Thợ Săn Chuối xuất sắc nhất Wings',
            tabDataLabel: 'Đua Top Giới Thiệu',
            tabDataIcon: '👑',
            tableTitleData: '<i class="fa-solid fa-crown text-yellow-400"></i> Bảng Đua Top Giới Thiệu (Data Khách Hàng)',
            countUnitData: 'người đua top',
            countUnitBanana: 'thợ săn chuối',
            podiumSubStat: '{0} khách ({1} chốt)',
            emptyMsg: 'Chưa có dữ liệu đua top trong kỳ này. Hãy là người đầu tiên bứt phá!',
            theadCols: ['Hạng', 'Người Giới Thiệu', 'Số Data', 'Checkin', 'Training', 'Đã Chốt', 'Thưởng Nhận']
        },
        roles: {
            admin: '👑 Quản Trị Viên (Admin)',
            counselor: '🛡️ Chuyên Viên Hướng Nghiệp',
            collaborator: '💼 Cộng Tác Viên Tuyển Sinh'
        },
        admin: {
            headerBadge: 'EXECUTIVE PORTAL',
            headerSub: 'Hệ Thống Quản Trị & Báo Cáo Hiệu Suất KPI Tuyển Sinh',
            titleTabLeads: '📋 Quản Lý Data & Tiến Trình',
            titleTabLeaderboard: '🏆 Bảng Đua Top',
            titleTabUsers: '👥 Duyệt Tài Khoản CTV',
            titleTabPermissions: '🛡️ Phân Quyền 3 Cấp',
            permDesc: 'Chỉ Quản trị viên (Admin) mới có quyền tích chọn điều chỉnh quyền hạn cho các vị trí',
            permColAdmin: '1. Quản Trị Viên',
            permColCounselor: '2. Chuyên Viên Hướng Nghiệp',
            permColCollab: '3. Cộng Tác Viên',
            btnConsOnline: '🤝 Gửi Data (50%)',
            btnConsClient: '🌟 Tự Chốt (100%)',
            funnelTitle: '<i class="fa-solid fa-filter text-blue-400"></i> Phễu Chuyển Đổi Tuyển Sinh (5 Bước):',
            funnelTip: '💡 Khách học nghề thì đã hoàn thành tư vấn và check-in',
            funnelSteps: ['1. Tiếp nhận', '2. Tư vấn', '3. Check-in', '4. Đào tạo', '5. Hoàn tất'],
            lbMainTitle: 'Bảng Xếp Hạng Hiệu Suất & Đua Top',
            lbMainSubtitle: 'Theo dõi thành tích tuyển sinh và săn chuối của chuyên viên & CTV',
            lbTabDataBtn: '👑 Đua Top Giới Thiệu',
            lbDataSectionTitle: 'Xếp Hạng Người Giới Thiệu Data Nhiều Nhất & Thưởng Cao Nhất',
            lbTableHeaders: ['Hạng', 'Người Giới Thiệu', 'Số Khách (Data)', 'Đã Checkin', 'Đang Training', 'Đã Chốt (Won)', 'Tổng Thưởng (VNĐ)'],
            statusOptions: [
                { value: 'ALL', text: 'Tất cả trạng thái' },
                { value: 'DATA', text: '1. Tiếp nhận (Data mới)' },
                { value: 'CARE', text: '2. Tư vấn (Chăm sóc)' },
                { value: 'CHECKIN', text: '3. Check-in (Đến học viện)' },
                { value: 'TRAINING', text: '4. Đào tạo (Học nghề)' },
                { value: 'WON', text: '5. Hoàn tất (Thành công)' },
                { value: 'PAID', text: 'Đã chi trả thưởng' },
                { value: 'LOST', text: 'Thất bại / Hủy' }
            ]
        }
    }
};

function getWingsThemeMode() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
        if (saved === 'standard' || saved === 'nursery') return saved;
    } catch (e) {}
    return 'nursery'; // Mặc định là thế giới cảm xúc Vườn Ươm Wings
}

function setWingsThemeMode(mode) {
    const validMode = (mode === 'standard') ? 'standard' : 'nursery';
    try {
        localStorage.setItem(STORAGE_KEYS.THEME_MODE, validMode);
    } catch (e) {}
    if (typeof applyWingsThemeUI === 'function') {
        applyWingsThemeUI(validMode);
    }
    return validMode;
}

function toggleWingsThemeMode() {
    const cur = getWingsThemeMode();
    const next = (cur === 'nursery') ? 'standard' : 'nursery';
    setWingsThemeMode(next);
    
    const msg = (next === 'nursery') 
        ? '🌱 Đã chuyển sang: Thế Giới Cảm Xúc Vườn Ươm Wings' 
        : '📊 Đã chuyển sang: Phiên Bản Thô Tiêu Chuẩn (Data & Hoa Hồng)';
    if (typeof showToast === 'function') {
        showToast(msg, 'info');
    }
    return next;
}

function getAdminRoleDisplayName() {
    const mode = getWingsThemeMode();
    return (mode === 'nursery') ? 'Kiểm Lâm' : 'Quản trị viên';
}

window.WINGS_THEME_CONFIG = WINGS_THEME_CONFIG;
window.getWingsThemeMode = getWingsThemeMode;
window.setWingsThemeMode = setWingsThemeMode;
window.toggleWingsThemeMode = toggleWingsThemeMode;
window.getAdminRoleDisplayName = getAdminRoleDisplayName;

// ==========================================================================
// ĐỊNH NGHĨA 3 CẤP BẬC VAI TRÒ & 4 QUYỀN HẠN CỐT LÕI
// 1. Quản trị viên (Admin) - Toàn quyền & duy nhất được sửa bảng phân quyền
// 2. Chuyên viên hướng nghiệp (Counselor) - Tùy chỉnh theo checkbox (Mặc định: Duyệt bài & Duyệt thành viên)
// 3. Cộng tác viên (Collaborator) - Không duyệt gì hết
// ==========================================================================
const DEFAULT_ROLE_PERMISSIONS = {
    admin: {
        id: 'admin',
        name: 'Kiểm Lâm (Admin)',
        badge: '🌲 Kiểm Lâm (Toàn Quyền)',
        badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40',
        permissions: {
            config_courses: true,      // 1. Bảng thưởng khóa học
            config_game: true,         // 2. Cấu hình game
            approve_members: true,     // 3. Duyệt người gieo hạt
            approve_game_regs: true,   // 4. Duyệt ảnh chuối
            approve_posts: true,       // 5. Duyệt bài link
            approve_leads: true        // 6. Quản lý & duyệt hạt giống
        }
    },
    counselor: {
        id: 'counselor',
        name: 'Bà Tiên Xanh 🧚',
        badge: '🧚 Bà Tiên Xanh (CV Hướng Nghiệp)',
        badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        permissions: {
            config_courses: true,      // Bảng thưởng khóa học (Cho phép theo setup ảnh người dùng)
            config_game: true,         // Cấu hình game (Cho phép theo setup ảnh người dùng)
            approve_members: false,    // Duyệt người gieo hạt (Khóa)
            approve_game_regs: false,  // Duyệt ảnh chuối (Khóa)
            approve_posts: true,       // Duyệt bài link (Cho phép)
            approve_leads: true        // Quản lý & duyệt hạt giống (Cho phép)
        }
    },
    collaborator: {
        id: 'collaborator',
        name: 'Người Gieo Hạt 🌱',
        badge: '🌱 Người Gieo Hạt (Cộng Tác Viên)',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        permissions: {
            config_courses: false,     // Người gieo hạt không duyệt gì hết
            config_game: false,
            approve_members: false,
            approve_game_regs: false,
            approve_posts: false,
            approve_leads: false
        }
    }
};

const SYSTEM_PERMISSIONS_LIST = [
    {
        key: 'config_courses',
        name: 'Bảng thưởng khóa học',
        desc: 'Thiết lập danh mục khóa học, mức thưởng tự chốt/gửi data, nhân bản & quản lý chiến dịch',
        icon: 'fa-solid fa-graduation-cap text-amber-400'
    },
    {
        key: 'config_game',
        name: 'Cấu hình game',
        desc: 'Cài đặt ví admin nhận chuối, số chuối yêu cầu tham gia và số chuối thưởng link bài',
        icon: 'fa-solid fa-sliders text-yellow-400'
    },
    {
        key: 'approve_members',
        name: 'Duyệt người gieo hạt',
        desc: 'Phê duyệt tài khoản CTV mới đăng ký (SĐT/Gmail), cấp lại mật khẩu & đổi quyền',
        icon: 'fa-solid fa-user-check text-emerald-400'
    },
    {
        key: 'approve_game_regs',
        name: 'Duyệt ảnh chuối',
        desc: 'Kiểm duyệt ảnh chụp biên lai chuyển chuối của người chơi để mở quyền tham gia mini game',
        icon: 'fa-solid fa-receipt text-amber-300'
    },
    {
        key: 'approve_posts',
        name: 'Duyệt bài link',
        desc: 'Kiểm tra đường link bài đăng / video Facebook, TikTok nộp duyệt nhận chuối thưởng',
        icon: 'fa-solid fa-share-nodes text-yellow-400'
    },
    {
        key: 'approve_leads',
        name: 'Quản lý & Duyệt hạt giống',
        desc: 'Chăm sóc hạt giống, chuyển bước phễu đào tạo và duyệt quả ngọt hoa hồng thành công',
        icon: 'fa-solid fa-seedling text-emerald-400'
    }
];

// 1. DANH MỤC KHÓA HỌC & BIỂU PHÍ THƯỞNG MẪU BAN ĐẦU (DO ADMIN QUẢN LÝ)
const INITIAL_COURSES = [
    {
        id: 'ws_coban',
        name: 'Workshop Cơ Bản & Nhập Môn',
        image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=600&q=80',
        targetAudience: 'Người mới bắt đầu muốn tìm hiểu nghề nối mi, khám phá xem bản thân có phù hợp với nghề trước khi đầu tư học chuyên sâu.',
        curriculum: 'Cấu tạo sinh học sợi mi thật, chu kỳ sinh trưởng và cách bảo vệ mắt.\nPhân biệt thông số mi: Độ cong (J, B, C, D), độ dày (0.05, 0.07, 0.15) và chiều dài.\nKỹ thuật cầm nhíp, cách lấy keo không đọng giọt và đặt mi chuẩn trục.\nThực hành kỹ thuật căn bản trên búp bê canh chuyên dụng.',
        duration: '1 - 2 ngày',
        modelCount: '1 mẫu canh chuyên dụng',
        modelCost: 'Miễn phí (Học viện tài trợ)',
        tuition: 1900000,
        tuitionFormatted: '1,9M',
        discountPrice: 1900000,
        discountPriceFormatted: '1,9M',
        showOnWiki: true,
        scholarship: 0,
        scholarshipFormatted: '0 đ',
        scholarshipNote: '',
        selfPercent: 26.3,
        acaPercent: 13.2,
        rewardSelf: 500000,
        rewardSelfFormatted: '500K',
        rewardPass: 250000,
        rewardPassFormatted: '250K',
        badge: 'Khóa Trải Nghiệm',
        icon: 'gem'
    },
    {
        id: 'nentang',
        name: 'Nền Tảng Nối Mi Chuyên Nghiệp',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        targetAudience: 'Học viên muốn nắm chắc tay nghề nền tảng vững vàng để có thể đi làm thợ tại các Salon hoặc Spa chuyên nghiệp.',
        curriculum: 'Kỹ thuật nối mi Classic One-by-One chuẩn quốc tế từng sợi tơi mượt.\nKỹ thuật nối mi Thiên Thần tơi xốp, giữ nếp mi đều đẹp.\nCăn chỉnh khoảng cách chân keo chuẩn 0.5 - 1mm không gây cộm ngứa hay kích ứng mắt.\nXử lý các khuyết điểm mi khó: Mi nghiêng, mi quặp, mi thưa, mi có sẹo.\nKỹ thuật dặm mi và tháo mi an toàn 100% không rụng một sợi mi thật nào.\nThực hành trực tiếp trên người mẫu thật dưới sự kèm cặp 1-1 của Giảng viên.',
        duration: '1 - 2 tuần',
        modelCount: '2 mẫu (1 canh + 1 thật)',
        modelCost: 'Miễn phí (Học viện tài trợ)',
        tuition: 5900000,
        tuitionFormatted: '5,9M',
        discountPrice: 5500000,
        discountPriceFormatted: '5,5M',
        showOnWiki: true,
        scholarship: 0,
        scholarshipFormatted: '0 đ',
        scholarshipNote: '',
        selfPercent: 17.0,
        acaPercent: 8.5,
        rewardSelf: 1000000,
        rewardSelfFormatted: '1M',
        rewardPass: 500000,
        rewardPassFormatted: '500K',
        badge: 'Phổ biến nhất',
        icon: 'shield'
    },
    {
        id: 'tinhhoa',
        name: 'Khóa Tinh Hoa Wings',
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        targetAudience: 'Thợ mi muốn giải quyết triệt để vấn đề mi mau rụng, nâng cao độ bền bộ mi lên gấp đôi và làm chủ kỹ thuật phối tầng tinh tế.',
        curriculum: 'Bí quyết giữ độ bền mi lên đến 6 - 8 tuần độc quyền của Wings.\nKiểm soát giọt keo, cân bằng nhiệt độ và độ ẩm phòng nối mi bất chấp thời tiết.\nKỹ thuật phối tầng mi đa chiều tạo hiệu ứng chuyển màu và độ sâu cho đôi mắt.\nBí quyết chụp ảnh, quay video cận cảnh mi chuẩn studio để hút khách trên mạng xã hội.',
        duration: '3 - 5 ngày',
        modelCount: '2 mẫu thật kèm 1-1',
        modelCost: 'Miễn phí (Học viện tài trợ)',
        tuition: 9900000,
        tuitionFormatted: '9,9M',
        discountPrice: 8900000,
        discountPriceFormatted: '8,9M',
        showOnWiki: true,
        scholarship: 0,
        scholarshipFormatted: '0 đ',
        scholarshipNote: '',
        selfPercent: 20.2,
        acaPercent: 10.1,
        rewardSelf: 2000000,
        rewardSelfFormatted: '2M',
        rewardPass: 1000000,
        rewardPassFormatted: '1M',
        badge: 'Đỉnh cao độ bền',
        icon: 'crown'
    },
    {
        id: 'volume_mega',
        name: 'Khóa Volume & Mega Volume',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
        targetAudience: 'Thợ mi muốn làm chủ kỹ thuật tạo fan tay thần tốc và các dáng mi đen dày, bồng bềnh sang trọng phong cách Âu Mỹ & Nga.',
        curriculum: 'Làm chủ 3 phương pháp tạo fan tay siêu tốc: Lắc fan, gạt fan và nhấc fan từ 3D đến 10D.\nKỹ thuật tạo ngọn xòe đều tăm tắp, gốc fan gom siêu nhỏ không đọng keo.\nPhân bổ trọng lượng an toàn, nối Mega Volume đen huyền nhưng siêu nhẹ không nặng mắt.',
        duration: '3 - 5 ngày',
        modelCount: '2 mẫu thật kèm 1-1',
        modelCost: 'Miễn phí (Học viện tài trợ)',
        tuition: 9900000,
        tuitionFormatted: '9,9M',
        discountPrice: 8900000,
        discountPriceFormatted: '8,9M',
        showOnWiki: true,
        scholarship: 0,
        scholarshipFormatted: '0 đ',
        scholarshipNote: '',
        selfPercent: 20.2,
        acaPercent: 10.1,
        rewardSelf: 2000000,
        rewardSelfFormatted: '2M',
        rewardPass: 1000000,
        rewardPassFormatted: '1M',
        badge: 'Âu Mỹ & Nga',
        icon: 'crown'
    },
    {
        id: 'thietke_taodang',
        name: 'Khóa Thiết Kế & Tạo Dáng Mi',
        image: 'https://images.unsplash.com/photo-1588510903716-1a00b875743b?auto=format&fit=crop&w=600&q=80',
        targetAudience: 'Thợ mi chuyên nghiệp muốn trở thành Nhà thiết kế mi (Lash Stylist), định hình phong cách độc bản cho từng khách hàng.',
        curriculum: 'Phân tích nhân trắc học mắt: Mắt một mí, mí lót, mắt xếch, mắt bụp, mí sụp.\nCác dáng mi thiết kế hot trend: Mi Katun, Babydoll, Cat-eye mắt mèo, Anime Manga.\nKỹ thuật phối mi màu Ombre, đính đá pha lê và kim tuyến cao cấp.',
        duration: '3 - 5 ngày',
        modelCount: '3 mẫu thật thực hành dáng',
        modelCost: 'Miễn phí (Học viện tài trợ)',
        tuition: 9900000,
        tuitionFormatted: '9,9M',
        discountPrice: 8900000,
        discountPriceFormatted: '8,9M',
        showOnWiki: true,
        scholarship: 0,
        scholarshipFormatted: '0 đ',
        scholarshipNote: '',
        selfPercent: 20.2,
        acaPercent: 10.1,
        rewardSelf: 2000000,
        rewardSelfFormatted: '2M',
        rewardPass: 1000000,
        rewardPassFormatted: '1M',
        badge: 'Stylist Độc Bản',
        icon: 'crown'
    },
    {
        id: 'combo_uudai',
        name: 'Combo 4 Khóa – Ưu Đãi',
        image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80',
        targetAudience: 'Học viên muốn học trọn vẹn từ cơ bản đến nâng cao để trở thành thợ cứng tay nghề với chi phí tiết kiệm nhất.',
        curriculum: 'Trọn bộ 4 khóa: Classic Nền Tảng + Tinh Hoa + Volume & Mega + Thiết Kế Tạo Dáng.\nTặng cốp đồ nghề học tập cao cấp đầy đủ nhíp, keo, mi chuẩn salon.\nThực hành không giới hạn số lượng mẫu thật cho đến khi hoàn toàn tự tin.',
        duration: '3 - 4 tuần',
        modelCount: 'Không giới hạn mẫu thật',
        modelCost: 'Miễn phí 100%',
        tuition: 19900000,
        tuitionFormatted: '19,9M',
        discountPrice: 17900000,
        discountPriceFormatted: '17,9M',
        scholarship: 2000000,
        scholarshipFormatted: '2M',
        scholarshipNote: 'Tài trợ học bổng 2.000.000đ cho 5 HV đầu tiên',
        showOnWiki: true,
        selfPercent: 20.0,
        acaPercent: 10.0,
        rewardSelf: 4000000,
        rewardSelfFormatted: '4M',
        rewardPass: 2000000,
        rewardPassFormatted: '2M',
        badge: 'HOT COMBO',
        icon: 'award'
    },
    {
        id: 'combo_khong_uudai',
        name: 'Combo 4 Khóa – Cao Cấp Master',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
        targetAudience: 'Học viên có định hướng mở tiệm Salon riêng hoặc trở thành Giảng viên đào tạo nghề mi chuyên nghiệp.',
        curriculum: 'Toàn bộ 4 khóa kỹ thuật chuyên sâu Master đỉnh cao.\nTư vấn chiến lược set up salon, bố trí không gian tiệm chuẩn phong thủy và thẩm mỹ.\nQuy trình chăm sóc và giữ chân khách hàng VIP độc quyền của Wings.\nChiến lược marketing xây dựng thương hiệu cá nhân để luôn kín lịch khách.\nCấp chứng chỉ tốt nghiệp Master danh giá của Wings Beauty & Academy.',
        duration: '1 - 2 tháng',
        modelCount: 'Không giới hạn mẫu thật + Kèm mở tiệm',
        modelCost: 'Miễn phí 100%',
        tuition: 29900000,
        tuitionFormatted: '29,9M',
        discountPrice: 29900000,
        discountPriceFormatted: '29,9M',
        scholarship: 0,
        scholarshipFormatted: '0 đ',
        scholarshipNote: '',
        showOnWiki: true,
        selfPercent: 23.4,
        acaPercent: 11.7,
        rewardSelf: 7000000,
        rewardSelfFormatted: '7M',
        rewardPass: 3500000,
        rewardPassFormatted: '3,5M',
        badge: 'VIP MASTER',
        icon: 'star'
    }
];

// MẪU BẢNG THƯỞNG & CHIẾN DỊCH BAN ĐẦU CÓ THỜI GIAN DIỄN RA RÕ RÀNG
const INITIAL_CAMPAIGNS = [
    {
        id: 'camp_2026_10',
        name: 'Bảng Thưởng Tuyển Sinh Tháng 10/2026',
        startDate: '2026-10-01',
        endDate: '2026-10-31',
        isActive: true,
        note: 'Tạm ngưng thưởng MSL • Áp dụng tài trợ học bổng 2.000.000đ cho 5 HV đầu tiên',
        courses: INITIAL_COURSES,
        createdAt: '2026-10-01T00:00:00'
    }
];

// Biến động toàn cục, tự động đồng bộ từ DataManager.getCourses()
let COURSES_CONFIG = INITIAL_COURSES;

// 5 BƯỚC TRONG HÀNH TRÌNH VUN TRỒNG: 🤲 Gieo Hạt => 💧 Tưới Mát => 🌱 Nảy Mầm => 🌿 Đâm Chồi => 🍎 Kết Trái
const FUNNEL_STAGES = [
    { key: 'DATA', label: '🤲 Gieo Hạt', level: 1, color: 'text-blue-400', badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { key: 'CARE', label: '💧 Tưới Mát', level: 2, color: 'text-amber-400', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { key: 'CHECKIN', label: '🌱 Nảy Mầm', level: 3, color: 'text-purple-400', badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { key: 'TRAINING', label: '🌿 Đâm Chồi', level: 4, color: 'text-cyan-400', badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    { key: 'WON', label: '🍎 Kết Trái', level: 5, color: 'text-emerald-400', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
];

// Trạng thái xử lý hồ sơ hạt giống cơ hội (tương thích các key hệ thống)
const LEAD_STATUS = {
    DATA: { id: 'DATA', label: '🤲 Gieo hạt (Mới)', level: 1, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    NEW: { id: 'NEW', label: '🤲 Gieo hạt (Mới)', level: 1, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    CARE: { id: 'CARE', label: '💧 Tưới mát (Chăm sóc)', level: 2, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    CONSULTING: { id: 'CONSULTING', label: '💧 Tưới mát (Chăm sóc)', level: 2, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    CHECKIN: { id: 'CHECKIN', label: '🌱 Nảy mầm (Checkin)', level: 3, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    TRAINING: { id: 'TRAINING', label: '🌿 Đâm chồi (Đào tạo)', level: 4, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    TRAINNING: { id: 'TRAINNING', label: '🌿 Đâm chồi (Đào tạo)', level: 4, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    WON: { id: 'WON', label: '🍎 Kết trái (Thành quả)', level: 5, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    HOAN_THANH: { id: 'HOAN_THANH', label: '🍎 Kết trái (Hoàn thành)', level: 5, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    APPROVED: { id: 'APPROVED', label: '🍎 Đã duyệt quả ngọt', level: 5, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    PAID: { id: 'PAID', label: '🍎 Đã thu hoạch (Chi trả)', level: 5, color: 'bg-yellow-400/25 text-yellow-300 border-yellow-400/40 font-semibold' },
    LOST: { id: 'LOST', label: '🥀 Khô héo / Thất bại', level: 0, color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' }
};

// 2. CẤU HÌNH BANANA MINI GAME & VÍ ADMIN
const DEFAULT_BANANA_CONFIG = {
    adminWalletAddress: 'WINGS-BANANA-ADMIN-8888', // Mã ví chuối của Admin
    adminWalletOwner: 'Bộ phận Hướng nghiệp Wings',
    bananasPerValidLink: 1,             // Cứ 1 link hợp lệ nhận 1 🍌
    requiredBananasToEnter: 3,          // Lệ phí / số chuối điều kiện để mở tham gia chương trình
    programFeeTitle: 'Điều Kiện Tham Gia Mini Game Tuyển Dụng',
    programFeeDescription: 'Để tham gia Mini Game và nộp link bài đăng, bạn cần chuyển đủ số Chuối 🍌 (theo lệ phí quy định) đến Ví Admin và đính kèm ảnh xác nhận chuyển chuối thành công để Admin duyệt mở quyền chơi.',
    guidelines: '1. Chuyển chuối đến Mã ví Admin: WINGS-BANANA-ADMIN-8888 (hoặc liên hệ Hotline Hướng nghiệp).\n2. Chụp ảnh màn hình giao dịch chuyển chuối thành công và đính kèm vào form bên dưới.\n3. Quản trị viên kiểm tra ảnh chuối và duyệt quyền tham gia Mini Game cho bạn.'
};

// Dữ liệu mẫu người dùng (Các tài khoản thành viên thử nghiệm)
const INITIAL_DEMO_USERS = [
    {
        id: 'USR-2610-ACA',
        name: 'Bà Tiên Xanh 🧚',
        identifier: '0908888999',
        password: '123456',
        authType: 'phone',
        role: '🧚 Bà Tiên Xanh',
        systemRole: 'counselor',
        bankInfo: 'Techcombank - 88889999000 - Wings Academy',
        status: 'APPROVED',
        miniGameApproved: true, // Đã được duyệt tham gia mini game
        bananas: 10,
        registeredAt: '2026-10-07T08:00:00',
        approvedAt: '2026-10-07T08:15:00'
    },
    {
        id: 'USR-2610-001',
        name: 'Trần Thị Thu Thảo',
        identifier: '0903123456',
        password: '123456',
        authType: 'phone',
        role: '🌱 Người gieo hạt (Học viên K12)',
        systemRole: 'collaborator',
        bankInfo: 'MB Bank - 0903123456 - Tran Thi Thu Thao',
        status: 'APPROVED',
        miniGameApproved: true, // Đã được duyệt tham gia mini game
        bananas: 5,
        registeredAt: '2026-10-07T08:00:00',
        approvedAt: '2026-10-07T08:30:00'
    },
    {
        id: 'USR-2610-002',
        name: 'Lê Hoàng Anh',
        identifier: 'hoanganh.wings@gmail.com',
        password: '123456',
        authType: 'email',
        role: '🌱 Người gieo hạt (Nhân viên Wings)',
        systemRole: 'collaborator',
        bankInfo: 'Vietcombank - 0071001234567 - Le Hoàng Anh',
        status: 'APPROVED',
        miniGameApproved: false, // Chưa được duyệt mini game, đang gửi ảnh chuối
        bananas: 3,
        registeredAt: '2026-10-07T09:00:00',
        approvedAt: '2026-10-07T09:15:00'
    },
    {
        id: 'USR-2610-003',
        name: 'Nguyễn Phương Linh',
        identifier: '0918999888',
        password: '123456',
        authType: 'phone',
        role: '🌱 Người gieo hạt (Cộng tác viên)',
        systemRole: 'collaborator',
        bankInfo: 'Techcombank - 19033455667788 - Nguyen Phuong Linh',
        status: 'PENDING',
        miniGameApproved: false,
        bananas: 0,
        registeredAt: '2026-10-07T16:00:00',
        approvedAt: null
    },
    {
        id: 'USR-2610-NGUYEN',
        name: 'Nguyên Bùi',
        identifier: 'nguyen.bui@wingslashes.com',
        password: '123456',
        authType: 'google',
        role: '🌱 Người gieo hạt (Cộng tác viên)',
        systemRole: 'collaborator',
        bankInfo: '',
        status: 'APPROVED',
        miniGameApproved: true,
        bananas: 8,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        registeredAt: '2026-10-07T08:00:00',
        approvedAt: '2026-10-07T08:15:00'
    }
];

// Dữ liệu mẫu đơn đăng ký tham gia mini game kèm ảnh chuối
const INITIAL_DEMO_GAME_REGISTRATIONS = [
    {
        id: 'GREG-2610-001',
        userId: 'USR-2610-001',
        userName: 'Trần Thị Thu Thảo',
        userIdentifier: '0903123456',
        bananasTransferred: 3,
        proofImage: 'assets/poster.jpg', // Ảnh bằng chứng demo
        note: 'Em đã chuyển 3 Chuối đến ví Admin WINGS-BANANA-ADMIN-8888 lúc 09:30 sáng nay.',
        status: 'APPROVED', // 'PENDING', 'APPROVED', 'REJECTED'
        adminNote: 'Đã nhận đủ 3 chuối vào ví. Duyệt mở quyền tham gia game.',
        submittedAt: '2026-10-07T09:35:00',
        reviewedAt: '2026-10-07T09:45:00'
    },
    {
        id: 'GREG-2610-002',
        userId: 'USR-2610-002',
        userName: 'Lê Hoàng Anh',
        userIdentifier: 'hoanganh.wings@gmail.com',
        bananasTransferred: 3,
        proofImage: 'assets/poster.jpg',
        note: 'Anh check ví nhận 3 chuối giúp em nhé, em gửi ảnh biên lai chuyển chuối đính kèm rồi.',
        status: 'PENDING', // Đang chờ admin duyệt mẫu
        adminNote: '',
        submittedAt: '2026-10-07T14:10:00',
        reviewedAt: null
    }
];

// Dữ liệu mẫu bài đăng nộp link Mini Game Chuối 🍌
const INITIAL_DEMO_POSTS = [
    {
        id: 'POST-2610-001',
        userId: 'USR-2610-001',
        userName: 'Trần Thị Thu Thảo',
        userIdentifier: '0903123456',
        platform: 'TikTok',
        link: 'https://tiktok.com/@thuthao_lashes/video/739182391283',
        note: 'Video review không gian phòng học thực hành và lớp nối mi Volume tại Wings.',
        status: 'APPROVED',
        bananasAwarded: 1,
        adminNote: 'Video chất lượng cao, có gắn hashtag đầy đủ.',
        createdAt: '2026-10-07T10:00:00',
        reviewedAt: '2026-10-07T11:00:00'
    },
    {
        id: 'POST-2610-002',
        userId: 'USR-2610-001',
        userName: 'Trần Thị Thu Thảo',
        userIdentifier: '0903123456',
        platform: 'Facebook',
        link: 'https://facebook.com/thuthao/posts/1029384756',
        note: 'Bài viết chia sẻ thể lệ chương trình Tháng 10 lên trang cá nhân chế độ công khai.',
        status: 'APPROVED',
        bananasAwarded: 1,
        adminNote: 'Link hợp lệ, bài đăng đúng quy định.',
        createdAt: '2026-10-07T13:30:00',
        reviewedAt: '2026-10-07T14:00:00'
    },
    {
        id: 'POST-2610-003',
        userId: 'USR-2610-002',
        userName: 'Lê Hoàng Anh',
        userIdentifier: 'hoanganh.wings@gmail.com',
        platform: 'Facebook',
        link: 'https://facebook.com/hoanganh/posts/9988776655',
        note: 'Chia sẻ ảnh chứng chỉ Master của học viện Wings.',
        status: 'APPROVED',
        bananasAwarded: 1,
        adminNote: 'Bài viết tốt, duyệt +1 🍌.',
        createdAt: '2026-10-07T15:00:00',
        reviewedAt: '2026-10-07T15:30:00'
    },
    {
        id: 'POST-2610-004',
        userId: 'USR-2610-002',
        userName: 'Lê Hoàng Anh',
        userIdentifier: 'hoanganh.wings@gmail.com',
        platform: 'TikTok',
        link: 'https://tiktok.com/@hoanganh_lashes/video/8877665544',
        note: 'Video ngắn quay quy trình khử trùng dụng cụ nối mi an toàn 100%.',
        status: 'APPROVED',
        bananasAwarded: 1,
        adminNote: 'Video nét, đúng quy chuẩn.',
        createdAt: '2026-10-08T09:30:00',
        reviewedAt: '2026-10-08T10:00:00'
    },
    {
        id: 'POST-2610-005',
        userId: 'USR-2610-003',
        userName: 'Nguyễn Phương Linh',
        userIdentifier: '0918999888',
        platform: 'TikTok',
        link: 'https://tiktok.com/@phuonglinh_beauty/video/6655443322',
        note: 'Clip chia sẻ hành trình học nghề từ số 0 tại Wings.',
        status: 'APPROVED',
        bananasAwarded: 1,
        adminNote: 'Nội dung tích cực, duyệt ngay.',
        createdAt: '2026-10-08T11:00:00',
        reviewedAt: '2026-10-08T11:30:00'
    },
    {
        id: 'POST-2610-006',
        userId: 'USR-2610-001',
        userName: 'Trần Thị Thu Thảo',
        userIdentifier: '0903123456',
        platform: 'TikTok',
        link: 'https://tiktok.com/@thuthao_lashes/video/9988112233',
        note: 'Học viên K12 hướng dẫn kỹ thuật tạo fan volume nhanh trong 3 giây.',
        status: 'APPROVED',
        bananasAwarded: 1,
        adminNote: 'Kỹ thuật rất hay, duyệt +1 chuối.',
        createdAt: '2026-10-08T13:45:00',
        reviewedAt: '2026-10-08T14:15:00'
    }
];

// Dữ liệu mẫu danh sách khách hàng ban đầu (đầy đủ các bước Phễu chuyển đổi)
const INITIAL_DEMO_LEADS = [
    {
        id: 'WG-2610-001',
        createdAt: '2026-10-07T09:15:00',
        referrerName: 'Trần Thị Thu Thảo',
        referrerPhone: '0903123456',
        referrerRole: 'Học viên cũ (Khóa Tinh Hoa K12)',
        referrerBank: 'MB Bank - 0903123456 - Tran Thi Thu Thao',
        
        customerName: 'Nguyễn Bích Ngọc',
        customerPhone: '0912345678',
        customerTarget: 'Mở tiệm',
        customerTargetDetail: 'Muốn học xong mở tiệm mi mini tại Tân Bình, cần học kỹ thuật bài bản và tư vấn set up.',
        customerStage: 'Đã xác định',
        customerPainPoint: 'Lo lắng học xong chưa tự tin tay nghề để nhận khách giá cao, cần thực hành nhiều trên mẫu thật.',
        
        interestCourseId: 'combo_uudai',
        closeType: 'pass',
        appointmentDate: '2026-10-07T14:00',
        tuitionPaymentDate: '2026-10-07',
        tuitionPaymentNote: 'Đã hoàn tất thanh toán đủ 17.900.000đ học phí.',
        
        status: 'PAID', // Bước 5: Nhận thưởng (Hoàn thành)
        actualCourseId: 'combo_uudai',
        actualCloseType: 'pass',
        rewardAmount: 2000000,
        assignedTo: 'Bà Tiên Xanh 🧚',
        adminNote: 'Khách đã tốt nghiệp xuất sắc, hoàn tất chi trả thưởng 2.000.000đ vào STK bạn Thảo.',
        paidDate: '2026-10-07'
    },
    {
        id: 'WG-2610-002',
        createdAt: '2026-10-07T11:20:00',
        referrerName: 'Trần Thị Thu Thảo',
        referrerPhone: '0903123456',
        referrerRole: 'Học viên cũ (Khóa Tinh Hoa K12)',
        referrerBank: 'MB Bank - 0903123456 - Tran Thi Thu Thao',
        
        customerName: 'Hoàng Kim Yến',
        customerPhone: '0938776655',
        customerTarget: 'Mở tiệm',
        customerTargetDetail: 'Muốn học khóa Combo 4 khóa cao cấp để mở salon nối mi & uốn mi tại Q.1',
        customerStage: 'Đã xác định',
        customerPainPoint: 'Cần giảng viên hỗ trợ 1 kèm 1 và giáo trình quản lý salon',
        
        interestCourseId: 'combo_khong_uudai',
        closeType: 'self',
        appointmentDate: '2026-10-07T16:00',
        tuitionPaymentDate: '2026-10-07',
        tuitionPaymentNote: 'Đã cọc 3.000.000đ chuyển khoản.',
        
        status: 'TRAINING', // Bước 4: Training (Đang đào tạo)
        actualCourseId: 'combo_khong_uudai',
        actualCloseType: 'self',
        rewardAmount: 7000000,
        assignedTo: 'Tự chốt (Trần Thị Thu Thảo)',
        adminNote: 'Học viên đang thực hành mẫu thật thứ 2, tay nghề rất tiến bộ. Chờ tốt nghiệp để chi thưởng 7.000.000đ.',
        paidDate: null
    },
    {
        id: 'WG-2610-003',
        createdAt: '2026-10-08T08:30:00',
        referrerName: 'Lê Hoàng Anh',
        referrerPhone: 'hoanganh.wings@gmail.com',
        referrerRole: 'Nhân viên Wings (Kỹ thuật viên)',
        referrerBank: 'Vietcombank - 0071001234567 - Le Hoang Anh',
        
        customerName: 'Vũ Mai Lan',
        customerPhone: '0977112233',
        customerTarget: 'Làm nghề',
        customerTargetDetail: 'Muốn học nghề nối mi Classic và Volume để đi nước ngoài định cư.',
        customerStage: 'Đang tìm hiểu',
        customerPainPoint: 'Cần chứng chỉ quốc tế và học cấp tốc trong 2 tuần.',
        
        interestCourseId: 'volume_mega',
        closeType: 'pass',
        appointmentDate: '2026-10-08T09:00',
        tuitionPaymentDate: '',
        tuitionPaymentNote: '',
        
        status: 'CHECKIN', // Bước 3: Checkin (Đã đến học viện)
        actualCourseId: 'volume_mega',
        actualCloseType: 'pass',
        rewardAmount: 1000000,
        assignedTo: 'Bà Tiên Xanh 🧚',
        adminNote: 'Khách đã ghé học viện lúc 09:00, đang thử nhíp và xem lớp học trực tiếp.',
        paidDate: null
    },
    {
        id: 'WG-2610-004',
        createdAt: '2026-10-08T10:15:00',
        referrerName: 'Nguyễn Phương Linh',
        referrerPhone: '0918999888',
        referrerRole: 'Cộng tác viên tuyển sinh',
        referrerBank: 'Techcombank - 19033455667788 - Nguyen Phuong Linh',
        
        customerName: 'Đặng Quỳnh Chi',
        customerPhone: '0988556677',
        customerTarget: 'Nâng cao',
        customerTargetDetail: 'Đã biết nối mi cơ bản nhưng chưa làm được mi Katun và Anime.',
        customerStage: 'Đang so sánh',
        customerPainPoint: 'Muốn xem giáo trình thiết kế dáng mi độc quyền của Wings.',
        
        interestCourseId: 'thietke_taodang',
        closeType: 'pass',
        appointmentDate: '2026-10-09T14:30',
        tuitionPaymentDate: '',
        tuitionPaymentNote: '',
        
        status: 'CARE', // Bước 2: Chăm Sóc (Đang tư vấn)
        actualCourseId: 'thietke_taodang',
        actualCloseType: 'pass',
        rewardAmount: 1000000,
        assignedTo: 'Bà Tiên Xanh 🧚',
        adminNote: 'Đã gửi lộ trình đào tạo và bảng dáng mi qua Zalo. Hẹn chiều mai ghé xem lớp.',
        paidDate: null
    },
    {
        id: 'WG-2610-005',
        createdAt: '2026-10-08T14:00:00',
        referrerName: 'Chuyên viên Hướng nghiệp',
        referrerPhone: '0908888999',
        referrerRole: 'Chuyên viên hướng nghiệp',
        referrerBank: 'Techcombank - 88889999000 - Wings Academy',
        
        customerName: 'Bùi Thu Trang',
        customerPhone: '0909123888',
        customerTarget: 'Trải nghiệm',
        customerTargetDetail: 'Sinh viên mới tốt nghiệp muốn tìm hiểu thêm nghề làm đẹp thẩm mỹ.',
        customerStage: 'Mới tìm hiểu',
        customerPainPoint: 'Chưa có nhiều vốn, hỏi chính sách học bổng và tài trợ đồ nghề.',
        
        interestCourseId: 'classic_nentang',
        closeType: 'self',
        appointmentDate: '2026-10-09T14:30',
        tuitionPaymentDate: '2026-10-09',
        tuitionPaymentNote: 'Khách hẹn ghé shop xem lớp và đóng học phí trực tiếp tại quầy.',
        
        status: 'CARE', // Bước 2: Chăm Sóc (Khách tự chốt đã lên lịch hẹn checkin tại shop)
        actualCourseId: 'classic_nentang',
        actualCloseType: 'self',
        rewardAmount: 500000,
        assignedTo: 'Tự chốt (Chuyên viên Hướng nghiệp)',
        adminNote: '[Tự chốt] Đã đến mục Chăm Sóc & lên lịch hẹn checkin tại shop lúc 14:30 ngày 09/10/2026.',
        paidDate: null
    },
    {
        id: 'WG-2610-006',
        createdAt: '2026-10-06T15:00:00',
        referrerName: 'Lê Hoàng Anh',
        referrerPhone: 'hoanganh.wings@gmail.com',
        referrerRole: 'Nhân viên Wings (Kỹ thuật viên)',
        referrerBank: 'Vietcombank - 0071001234567 - Le Hoang Anh',
        
        customerName: 'Phạm Thùy Linh',
        customerPhone: '0933221100',
        customerTarget: 'Mở tiệm',
        customerTargetDetail: 'Học khóa Combo ưu đãi để về mở tiệm tại Bình Dương.',
        customerStage: 'Đã xác định',
        customerPainPoint: 'Cần hỗ trợ nhập nguyên liệu giá sỉ sau khi tốt nghiệp.',
        
        interestCourseId: 'combo_uudai',
        closeType: 'self',
        appointmentDate: '2026-10-06T16:00',
        tuitionPaymentDate: '2026-10-06',
        tuitionPaymentNote: 'Đã thanh toán 17.900.000đ học phí.',
        
        status: 'TRAINING', // Bước 4: Training (Đang đào tạo)
        actualCourseId: 'combo_uudai',
        actualCloseType: 'self',
        rewardAmount: 4000000,
        assignedTo: 'Tự chốt (Lê Hoàng Anh)',
        adminNote: 'Đang học tuần thứ 2, đã làm bài kiểm tra mi Thiên thần đạt loại Giỏi.',
        paidDate: null
    },
    {
        id: 'WG-2610-007',
        createdAt: '2026-10-08T15:20:00',
        referrerName: 'Trần Thị Thu Thảo',
        referrerPhone: '0903123456',
        referrerRole: 'Học viên cũ (Khóa Tinh Hoa K12)',
        referrerBank: 'MB Bank - 0903123456 - Tran Thi Thu Thao',
        
        customerName: 'Trần Minh Châu',
        customerPhone: '0944556611',
        customerTarget: 'Làm nghề',
        customerTargetDetail: 'Bạn thân của Thảo, muốn học chuyên sâu Khóa Tinh Hoa.',
        customerStage: 'Đã xác định',
        customerPainPoint: 'Muốn học chung ca thực hành với Thảo để kèm thêm.',
        
        interestCourseId: 'tinhhoa_chuyensau',
        closeType: 'self',
        appointmentDate: '2026-10-08T15:00',
        tuitionPaymentDate: '',
        tuitionPaymentNote: 'Đã lên viện đăng ký, chờ hoàn tất cọc.',
        
        status: 'CHECKIN', // Bước 3: Checkin (Đã đến học viện)
        actualCourseId: 'tinhhoa_chuyensau',
        actualCloseType: 'self',
        rewardAmount: 1000000,
        assignedTo: 'Tự chốt (Trần Thị Thu Thảo)',
        adminNote: 'Khách đã ghé sảnh tầng 1 lúc 15:00, đã gặp chuyên viên tư vấn.',
        paidDate: null
    }
];

class DataManager {
    static init() {
        if (!localStorage.getItem(STORAGE_KEYS.REWARD_CAMPAIGNS)) {
            let coursesToUse = INITIAL_COURSES;
            try {
                const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES));
                if (Array.isArray(existing) && existing.length > 0) coursesToUse = existing;
            } catch (e) {}
            const initialCampaigns = [
                {
                    id: 'camp_2026_10',
                    name: 'Bảng Thưởng Tuyển Sinh Tháng 10/2026',
                    startDate: '2026-10-01',
                    endDate: '2026-10-31',
                    isActive: true,
                    note: 'Tạm ngưng thưởng MSL • Áp dụng tài trợ học bổng 2.000.000đ cho 5 HV đầu tiên',
                    courses: coursesToUse,
                    createdAt: '2026-10-01T00:00:00'
                }
            ];
            localStorage.setItem(STORAGE_KEYS.REWARD_CAMPAIGNS, JSON.stringify(initialCampaigns));
            localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(coursesToUse));
        }
        if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
            localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_DEMO_LEADS));
        } else {
            try {
                const currentLeads = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS));
                let modifiedLeads = false;
                if (Array.isArray(currentLeads)) {
                    // Tự động đồng bộ: lead tự chốt có trạng thái ban đầu là CARE và note lên lịch hẹn
                    currentLeads.forEach(l => {
                        if ((l.actualCloseType === 'self' || l.closeType === 'self') && (l.status === 'DATA' || l.status === 'NEW')) {
                            l.status = 'CARE';
                            if (!l.adminNote) {
                                l.adminNote = '[Tự chốt] Đã đến mục Chăm Sóc & lên lịch hẹn checkin tại shop.';
                            }
                            modifiedLeads = true;
                        }
                    });
                    if (currentLeads.length < 4) {
                        const missing = INITIAL_DEMO_LEADS.filter(demoL => !currentLeads.some(curL => curL.id === demoL.id));
                        if (missing.length > 0) {
                            currentLeads.push(...missing);
                            modifiedLeads = true;
                        }
                    }
                    if (modifiedLeads) {
                        localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(currentLeads));
                    }
                }
            } catch (e) {}
        }
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_DEMO_USERS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.GAME_REGISTRATIONS)) {
            localStorage.setItem(STORAGE_KEYS.GAME_REGISTRATIONS, JSON.stringify(INITIAL_DEMO_GAME_REGISTRATIONS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
            localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_DEMO_POSTS));
        } else {
            try {
                const currentPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS));
                if (Array.isArray(currentPosts) && currentPosts.length < 4) {
                    const missingPosts = INITIAL_DEMO_POSTS.filter(demoP => !currentPosts.some(curP => curP.id === demoP.id));
                    if (missingPosts.length > 0) {
                        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([...currentPosts, ...missingPosts]));
                    }
                }
            } catch (e) {}
        }
        if (!localStorage.getItem(STORAGE_KEYS.BANANA_CONFIG)) {
            localStorage.setItem(STORAGE_KEYS.BANANA_CONFIG, JSON.stringify(DEFAULT_BANANA_CONFIG));
        }
    }

    // ======================== MẪU BẢNG THƯỞNG & CHIẾN DỊCH (DO ADMIN QUẢN LÝ) ========================
    static getCampaigns() {
        this.init();
        try {
            const data = localStorage.getItem(STORAGE_KEYS.REWARD_CAMPAIGNS);
            if (data) {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {}
        return INITIAL_CAMPAIGNS;
    }

    static saveCampaigns(campaigns) {
        localStorage.setItem(STORAGE_KEYS.REWARD_CAMPAIGNS, JSON.stringify(campaigns));
        const active = campaigns.find(c => c.isActive) || campaigns[0];
        if (active) {
            localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(active.courses || []));
            localStorage.setItem(STORAGE_KEYS.ACTIVE_CAMPAIGN_ID, active.id);
            COURSES_CONFIG = active.courses || [];
        }
    }

    static getActiveCampaign() {
        const campaigns = this.getCampaigns();
        const active = campaigns.find(c => c.isActive);
        return active || campaigns[0];
    }

    static setActiveCampaign(campaignId) {
        const campaigns = this.getCampaigns();
        let target = null;
        campaigns.forEach(c => {
            if (c.id === campaignId) {
                c.isActive = true;
                target = c;
            } else {
                c.isActive = false;
            }
        });
        if (target) {
            this.saveCampaigns(campaigns);
        }
        return target || this.getActiveCampaign();
    }

    static duplicateCampaign(sourceCampaignId, newName, startDate, endDate, makeActive = false, note = '') {
        const campaigns = this.getCampaigns();
        const source = campaigns.find(c => c.id === sourceCampaignId) || campaigns[0];
        if (!source) return null;

        const newId = `camp_${Date.now()}`;
        // Clone sâu danh sách khóa học
        const clonedCourses = JSON.parse(JSON.stringify(source.courses || []));

        if (makeActive) {
            campaigns.forEach(c => c.isActive = false);
        }

        const newCampaign = {
            id: newId,
            name: (newName || `${source.name} (Bản sao)`).trim(),
            startDate: startDate || new Date().toISOString().slice(0, 10),
            endDate: endDate || '',
            isActive: makeActive,
            note: (note || source.note || '').trim(),
            courses: clonedCourses,
            createdAt: new Date().toISOString()
        };

        campaigns.unshift(newCampaign);
        this.saveCampaigns(campaigns);
        return newCampaign;
    }

    static updateCampaignMeta(campaignId, meta) {
        const campaigns = this.getCampaigns();
        const index = campaigns.findIndex(c => c.id === campaignId);
        if (index === -1) return null;

        const current = campaigns[index];
        if (meta.name) current.name = meta.name.trim();
        if (meta.startDate !== undefined) current.startDate = meta.startDate;
        if (meta.endDate !== undefined) current.endDate = meta.endDate;
        if (meta.note !== undefined) current.note = meta.note ? meta.note.trim() : '';
        if (meta.isActive !== undefined) {
            if (meta.isActive) {
                campaigns.forEach(c => c.isActive = false);
            }
            current.isActive = meta.isActive;
        }

        campaigns[index] = current;
        this.saveCampaigns(campaigns);
        return current;
    }

    static deleteCampaign(campaignId) {
        let campaigns = this.getCampaigns();
        if (campaigns.length <= 1) {
            return { success: false, message: 'Hệ thống cần giữ lại ít nhất 1 mẫu bảng thưởng!' };
        }
        const deleting = campaigns.find(c => c.id === campaignId);
        const wasActive = deleting ? deleting.isActive : false;

        campaigns = campaigns.filter(c => c.id !== campaignId);
        if (wasActive && campaigns.length > 0) {
            campaigns[0].isActive = true;
        }
        this.saveCampaigns(campaigns);
        return { success: true };
    }

    // ======================== COURSES (QUẢN LÝ BỞI ADMIN) ========================
    static normalizeCourse(c) {
        if (!c) return c;
        const defaultMatch = INITIAL_COURSES.find(item => item.id === c.id);
        const tuition = parseInt(c.tuition, 10) || (defaultMatch ? defaultMatch.tuition : 0);
        let discountPrice = (c.discountPrice !== undefined && c.discountPrice !== '' && c.discountPrice !== null)
            ? parseInt(c.discountPrice, 10)
            : (defaultMatch && defaultMatch.discountPrice !== undefined ? defaultMatch.discountPrice : tuition);
        if (isNaN(discountPrice) || discountPrice <= 0) discountPrice = tuition;

        return {
            ...c,
            image: c.image || (defaultMatch && defaultMatch.image) || 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=600&q=80',
            targetAudience: c.targetAudience !== undefined && c.targetAudience !== null ? c.targetAudience : (defaultMatch ? defaultMatch.targetAudience : ''),
            curriculum: c.curriculum !== undefined && c.curriculum !== null ? c.curriculum : (defaultMatch ? defaultMatch.curriculum : ''),
            duration: c.duration || (defaultMatch ? defaultMatch.duration : '1 - 2 tuần'),
            modelCount: c.modelCount || (defaultMatch ? defaultMatch.modelCount : 'Theo giáo trình'),
            modelCost: c.modelCost || (defaultMatch ? defaultMatch.modelCost : 'Miễn phí'),
            tuition: tuition,
            tuitionFormatted: c.tuitionFormatted || this.formatMoneyShort(tuition),
            discountPrice: discountPrice,
            discountPriceFormatted: c.discountPriceFormatted || this.formatMoneyShort(discountPrice),
            showOnWiki: c.showOnWiki !== undefined ? Boolean(c.showOnWiki) : true
        };
    }

    static getCourses(targetCampaignId = null) {
        this.init();
        const campaigns = this.getCampaigns();
        let camp = null;
        if (targetCampaignId) {
            camp = campaigns.find(c => c.id === targetCampaignId);
        }
        if (!camp) {
            camp = this.getActiveCampaign();
        }
        let list = INITIAL_COURSES;
        if (camp && Array.isArray(camp.courses) && camp.courses.length > 0) {
            list = camp.courses;
        }
        const normalizedList = list.map(c => this.normalizeCourse(c));
        if (camp && camp.isActive) COURSES_CONFIG = normalizedList;
        return normalizedList;
    }

    static saveCourses(courses, targetCampaignId = null) {
        const campaigns = this.getCampaigns();
        let camp = null;
        if (targetCampaignId) {
            camp = campaigns.find(c => c.id === targetCampaignId);
        }
        if (!camp) {
            camp = campaigns.find(c => c.isActive) || campaigns[0];
        }
        if (camp) {
            camp.courses = courses;
            this.saveCampaigns(campaigns);
        }
    }

    static addCourse(courseData, targetCampaignId = null) {
        const courses = this.getCourses(targetCampaignId);
        const date = new Date();
        const newId = `course_${date.getTime()}`;

        const tuition = parseInt(courseData.tuition, 10) || 0;
        let discountPrice = (courseData.discountPrice !== undefined && courseData.discountPrice !== '' && courseData.discountPrice !== null)
            ? parseInt(courseData.discountPrice, 10)
            : tuition;
        if (isNaN(discountPrice) || discountPrice <= 0) discountPrice = tuition;

        const scholarship = parseInt(courseData.scholarship, 10) || 0;
        const selfPercent = parseFloat(courseData.selfPercent) || 0;
        const acaPercent = parseFloat(courseData.acaPercent) || 0;

        const rewardSelf = courseData.rewardSelf ? parseInt(courseData.rewardSelf, 10) : Math.round(tuition * selfPercent / 100);
        const rewardPass = courseData.rewardPass ? parseInt(courseData.rewardPass, 10) : Math.round(tuition * acaPercent / 100);

        const newCourse = {
            id: newId,
            name: courseData.name ? courseData.name.trim() : 'Khóa học mới',
            image: courseData.image ? courseData.image.trim() : 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=600&q=80',
            targetAudience: courseData.targetAudience ? courseData.targetAudience.trim() : '',
            curriculum: courseData.curriculum ? courseData.curriculum.trim() : '',
            duration: courseData.duration ? courseData.duration.trim() : '1 - 2 tuần',
            modelCount: courseData.modelCount ? courseData.modelCount.trim() : 'Theo giáo trình',
            modelCost: courseData.modelCost ? courseData.modelCost.trim() : 'Miễn phí',
            tuition: tuition,
            tuitionFormatted: this.formatMoneyShort(tuition),
            discountPrice: discountPrice,
            discountPriceFormatted: this.formatMoneyShort(discountPrice),
            showOnWiki: courseData.showOnWiki !== undefined ? Boolean(courseData.showOnWiki) : true,
            scholarship: scholarship,
            scholarshipFormatted: this.formatMoneyShort(scholarship),
            scholarshipNote: courseData.scholarshipNote ? courseData.scholarshipNote.trim() : '',
            selfPercent: selfPercent,
            acaPercent: acaPercent,
            rewardSelf: rewardSelf,
            rewardSelfFormatted: this.formatMoneyShort(rewardSelf),
            rewardPass: rewardPass,
            rewardPassFormatted: this.formatMoneyShort(rewardPass),
            badge: courseData.badge ? courseData.badge.trim() : '',
            icon: courseData.icon || 'graduation-cap'
        };

        courses.push(newCourse);
        this.saveCourses(courses, targetCampaignId);
        return newCourse;
    }

    static updateCourse(id, updates, targetCampaignId = null) {
        const courses = this.getCourses(targetCampaignId);
        const index = courses.findIndex(c => c.id === id);
        if (index === -1) return null;

        const current = courses[index];
        const updated = { ...current, ...updates };

        const tuition = parseInt(updated.tuition, 10) || 0;
        let discountPrice = (updated.discountPrice !== undefined && updated.discountPrice !== '' && updated.discountPrice !== null)
            ? parseInt(updated.discountPrice, 10)
            : tuition;
        if (isNaN(discountPrice) || discountPrice <= 0) discountPrice = tuition;

        const scholarship = parseInt(updated.scholarship, 10) || 0;
        const selfPercent = parseFloat(updated.selfPercent) || 0;
        const acaPercent = parseFloat(updated.acaPercent) || 0;

        const rewardSelf = updates.rewardSelf !== undefined ? parseInt(updates.rewardSelf, 10) : Math.round(tuition * selfPercent / 100);
        const rewardPass = updates.rewardPass !== undefined ? parseInt(updates.rewardPass, 10) : Math.round(tuition * acaPercent / 100);

        updated.name = updated.name ? updated.name.trim() : current.name;
        if (updated.image !== undefined) updated.image = (updated.image || '').trim();
        if (updated.targetAudience !== undefined) updated.targetAudience = (updated.targetAudience || '').trim();
        if (updated.curriculum !== undefined) updated.curriculum = (updated.curriculum || '').trim();
        if (updated.duration !== undefined) updated.duration = (updated.duration || '').trim();
        if (updated.modelCount !== undefined) updated.modelCount = (updated.modelCount || '').trim();
        if (updated.modelCost !== undefined) updated.modelCost = (updated.modelCost || '').trim();
        if (updated.showOnWiki !== undefined) updated.showOnWiki = Boolean(updated.showOnWiki);

        updated.tuition = tuition;
        updated.tuitionFormatted = this.formatMoneyShort(tuition);
        updated.discountPrice = discountPrice;
        updated.discountPriceFormatted = this.formatMoneyShort(discountPrice);
        updated.scholarship = scholarship;
        updated.scholarshipFormatted = this.formatMoneyShort(scholarship);
        updated.scholarshipNote = updated.scholarshipNote ? updated.scholarshipNote.trim() : '';
        updated.selfPercent = selfPercent;
        updated.acaPercent = acaPercent;
        updated.rewardSelf = rewardSelf;
        updated.rewardSelfFormatted = this.formatMoneyShort(rewardSelf);
        updated.rewardPass = rewardPass;
        updated.rewardPassFormatted = this.formatMoneyShort(rewardPass);
        updated.badge = updated.badge ? updated.badge.trim() : '';
        if (updated.icon) updated.icon = updated.icon;

        courses[index] = updated;
        this.saveCourses(courses, targetCampaignId);
        return updated;
    }

    static deleteCourse(id, targetCampaignId = null) {
        let courses = this.getCourses(targetCampaignId);
        courses = courses.filter(c => c.id !== id);
        this.saveCourses(courses, targetCampaignId);
        return true;
    }

    // ======================== LEADS ========================
    static getLeads() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS)) || [];
        } catch (e) {
            return [];
        }
    }

    static saveLeads(leads) {
        localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
        this.pushToServer();
    }

    static addLead(leadData) {
        const leads = this.getLeads();
        const date = new Date();
        const yyMM = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, '0')}`;
        const count = leads.length + 1;
        const newId = `WG-${yyMM}-${String(count).padStart(3, '0')}`;

        const course = COURSES_CONFIG.find(c => c.id === leadData.interestCourseId) || COURSES_CONFIG[0];
        const isSelf = leadData.closeType === 'self';
        const reward = isSelf ? course.rewardSelf : course.rewardPass;

        // Trạng thái ban đầu:
        // Khi data từ ứng viên theo chọn là tự chốt thì trạng thái ban đầu của data đã đến mục "Chăm sóc" và lên lịch hẹn checkin tại shop rồi.
        const initialStatus = isSelf ? 'CARE' : 'DATA';

        let initialAdminNote = leadData.adminNote ? leadData.adminNote.trim() : '';
        if (isSelf && !initialAdminNote) {
            if (leadData.appointmentDate) {
                const apptStr = leadData.appointmentDate.replace('T', ' ');
                initialAdminNote = `[Tự chốt] Đã lên lịch hẹn checkin tại shop: ${apptStr}`;
            } else {
                initialAdminNote = '[Tự chốt] Đã chuyển bước Chăm Sóc & lên lịch hẹn checkin tại shop.';
            }
            if (leadData.tuitionPaymentNote) {
                initialAdminNote += ` | Kế hoạch: ${leadData.tuitionPaymentNote.trim()}`;
            }
        }

        const newLead = {
            id: newId,
            createdAt: date.toISOString(),
            referrerName: leadData.referrerName ? leadData.referrerName.trim() : '',
            referrerPhone: leadData.referrerPhone ? leadData.referrerPhone.trim() : '',
            referrerRole: leadData.referrerRole || 'Nhân sự / CTV',
            referrerBank: leadData.referrerBank ? leadData.referrerBank.trim() : '',

            customerName: leadData.customerName ? leadData.customerName.trim() : '',
            customerPhone: leadData.customerPhone ? leadData.customerPhone.trim() : '',
            customerTarget: leadData.customerTarget || 'Làm nghề',
            customerTargetDetail: leadData.customerTargetDetail ? leadData.customerTargetDetail.trim() : '',
            customerStage: leadData.customerStage || 'Đang tìm hiểu',
            customerPainPoint: leadData.customerPainPoint ? leadData.customerPainPoint.trim() : '',

            interestCourseId: course.id,
            closeType: leadData.closeType || 'pass',

            // Kế hoạch dành cho Đội ACA (khi tự chốt)
            appointmentDate: leadData.appointmentDate || '',
            tuitionPaymentDate: leadData.tuitionPaymentDate || '',
            tuitionPaymentNote: leadData.tuitionPaymentNote ? leadData.tuitionPaymentNote.trim() : '',

            status: initialStatus,
            actualCourseId: course.id,
            actualCloseType: leadData.closeType || 'pass',
            rewardAmount: reward,
            assignedTo: isSelf ? `Tự chốt (${leadData.referrerName})` : 'Bà Tiên Xanh 🧚',
            adminNote: initialAdminNote,
            paidDate: null
        };

        leads.unshift(newLead);
        this.saveLeads(leads);
        return newLead;
    }

    static updateLead(id, updates) {
        const leads = this.getLeads();
        const index = leads.findIndex(l => l.id === id);
        if (index !== -1) {
            const current = leads[index];
            const updated = { ...current, ...updates };

            const course = COURSES_CONFIG.find(c => c.id === updated.actualCourseId) || COURSES_CONFIG[0];
            const isSelf = updated.actualCloseType === 'self';
            updated.rewardAmount = isSelf ? course.rewardSelf : course.rewardPass;

            // Nếu đổi sang tự chốt và trạng thái cũ còn ở DATA, tự động nâng lên CARE
            if (isSelf && (updated.status === 'DATA' || updated.status === 'NEW')) {
                updated.status = 'CARE';
                if (!updated.adminNote) {
                    updated.adminNote = '[Tự chốt] Đã đến mục Chăm Sóc & lên lịch hẹn checkin tại shop.';
                }
            }

            leads[index] = updated;
            this.saveLeads(leads);
            return updated;
        }
        return null;
    }

    static deleteLead(id) {
        let leads = this.getLeads();
        leads = leads.filter(l => l.id !== id);
        this.saveLeads(leads);
        return true;
    }

    // ======================== PIPELINE FUNNEL & LEADERBOARD ========================
    static getFunnelLevel(status) {
        if (!status) return 1;
        const s = String(status).toUpperCase();
        if (['WON', 'HOAN_THANH', 'APPROVED', 'PAID', 'HOANTHANH'].includes(s)) return 5;
        if (['TRAINING', 'TRAINNING', 'HOC_NGHE', 'DAOTAO'].includes(s)) return 4;
        if (['CHECKIN', 'CHECK_IN', 'HEN_LEN'].includes(s)) return 3;
        if (['CARE', 'CHAM_SOC', 'CHAMSOC', 'CONSULTING'].includes(s)) return 2;
        if (['DATA', 'NEW', 'MOI'].includes(s)) return 1;
        return 0; // LOST
    }

    static filterByTime(list, dateField = 'createdAt', timeFilter = 'month', targetDate = null, campaignId = 'ALL') {
        if (!Array.isArray(list)) return [];
        let filtered = list;

        // Lọc theo Chiến Dịch / Chương Trình
        if (campaignId && campaignId !== 'ALL') {
            const campaigns = this.getCampaigns();
            const camp = campaigns.find(c => c.id === campaignId);
            if (camp && camp.startDate && camp.endDate) {
                const s = new Date(camp.startDate);
                const e = new Date(camp.endDate);
                e.setHours(23, 59, 59, 999);
                filtered = filtered.filter(item => {
                    const raw = item[dateField];
                    if (!raw) return false;
                    const d = new Date(raw);
                    return d >= s && d <= e;
                });
            }
        }

        if (!timeFilter || timeFilter === 'all') return filtered;

        const refDate = targetDate ? new Date(targetDate) : new Date();
        const refYear = refDate.getFullYear();
        const refMonth = refDate.getMonth();
        const refDay = refDate.getDate();

        return filtered.filter(item => {
            const raw = item[dateField];
            if (!raw) return false;
            const d = new Date(raw);
            if (isNaN(d.getTime())) return false;

            if (timeFilter === 'day') {
                return d.getFullYear() === refYear && d.getMonth() === refMonth && d.getDate() === refDay;
            }
            if (timeFilter === 'month') {
                return d.getFullYear() === refYear && d.getMonth() === refMonth;
            }
            if (timeFilter === 'year') {
                return d.getFullYear() === refYear;
            }
            if (timeFilter === 'week') {
                const startOfWeek = new Date(refDate);
                const dayOfWeek = (refDate.getDay() + 6) % 7; // Thứ 2 = 0
                startOfWeek.setDate(refDate.getDate() - dayOfWeek);
                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 7);

                return d >= startOfWeek && d < endOfWeek;
            }
            return true;
        });
    }

    static getFunnelStats(timeFilter = 'month', targetDate = null) {
        let leads = this.getLeads();
        leads = this.filterByTime(leads, 'createdAt', timeFilter, targetDate);

        let dataCount = 0;
        let careCount = 0;
        let checkinCount = 0;
        let trainingCount = 0;
        let wonCount = 0;
        let paidReward = 0;
        let pendingReward = 0;

        leads.forEach(l => {
            const level = this.getFunnelLevel(l.status);
            // Lũy tiến: Khách đạt bước cao hơn thì các tầng dưới cũng tăng theo
            if (level >= 1) dataCount++;
            if (level >= 2) careCount++;
            if (level >= 3) checkinCount++;
            if (level >= 4) trainingCount++;
            if (level >= 5) wonCount++;

            if (l.status === 'PAID') {
                paidReward += (l.rewardAmount || 0);
            } else if (['WON', 'APPROVED', 'TRAINING', 'CHECKIN'].includes(l.status)) {
                pendingReward += (l.rewardAmount || 0);
            }
        });

        const rateCare = dataCount > 0 ? Math.round((careCount / dataCount) * 1000) / 10 : 0;
        const rateCheckin = dataCount > 0 ? Math.round((checkinCount / dataCount) * 1000) / 10 : 0;
        const rateTraining = dataCount > 0 ? Math.round((trainingCount / dataCount) * 1000) / 10 : 0;
        const rateWon = dataCount > 0 ? Math.round((wonCount / dataCount) * 1000) / 10 : 0;

        return {
            totalDataInFilter: leads.length,
            dataCount,
            careCount,
            checkinCount,
            trainingCount,
            wonCount,
            rateCare,
            rateCheckin,
            rateTraining,
            rateWon,
            paidReward,
            pendingReward,
            totalReward: paidReward + pendingReward
        };
    }

    static updateLeadFunnelStatus(id, newStatus, adminNote = null) {
        const leads = this.getLeads();
        const index = leads.findIndex(l => l.id === id);
        if (index === -1) return null;

        const lead = leads[index];
        lead.status = newStatus;
        if (adminNote !== null && adminNote !== undefined) {
            lead.adminNote = adminNote.trim();
        }
        if (newStatus === 'PAID' && !lead.paidDate) {
            lead.paidDate = new Date().toISOString().slice(0, 10);
        }

        leads[index] = lead;
        this.saveLeads(leads);
        return lead;
    }

    static getLeaderboard(timeFilter = 'month', targetDate = null, campaignId = 'ALL') {
        const leads = this.filterByTime(this.getLeads(), 'createdAt', timeFilter, targetDate, campaignId);
        const posts = this.filterByTime(this.getBananaPosts(), 'createdAt', timeFilter, targetDate, campaignId);

        // 1. Data Referral Leaderboard
        const refMap = {};
        leads.forEach(l => {
            const key = l.referrerPhone || l.referrerName || 'Khác';
            if (!refMap[key]) {
                refMap[key] = {
                    name: l.referrerName || 'Cộng tác viên',
                    phone: l.referrerPhone || '',
                    role: l.referrerRole || 'Nhân sự / CTV',
                    bank: l.referrerBank || '',
                    totalLeads: 0,
                    wonLeads: 0,
                    checkinLeads: 0,
                    trainingLeads: 0,
                    totalReward: 0,
                    paidReward: 0
                };
            }
            refMap[key].totalLeads += 1;
            const lvl = this.getFunnelLevel(l.status);
            if (lvl >= 3) refMap[key].checkinLeads += 1;
            if (lvl >= 4) refMap[key].trainingLeads += 1;
            if (lvl >= 5) {
                refMap[key].wonLeads += 1;
            }
            if (l.status === 'PAID') {
                refMap[key].paidReward += (l.rewardAmount || 0);
            }
            refMap[key].totalReward += (l.rewardAmount || 0);
        });

        const dataLeaderboard = Object.values(refMap).sort((a, b) => {
            if (b.totalReward !== a.totalReward) return b.totalReward - a.totalReward;
            if (b.wonLeads !== a.wonLeads) return b.wonLeads - a.wonLeads;
            return b.totalLeads - a.totalLeads;
        }).map((item, idx) => ({ ...item, rank: idx + 1 }));

        // 2. Banana Mini Game Leaderboard
        const postMap = {};
        posts.forEach(p => {
            const key = p.userIdentifier || p.userName || 'User';
            if (!postMap[key]) {
                postMap[key] = {
                    name: p.userName || 'Thành viên',
                    identifier: p.userIdentifier || '',
                    totalPosts: 0,
                    approvedPosts: 0,
                    totalBananas: 0
                };
            }
            postMap[key].totalPosts += 1;
            if (p.status === 'APPROVED') {
                postMap[key].approvedPosts += 1;
                postMap[key].totalBananas += (p.bananasAwarded || 1);
            }
        });

        // Kết hợp với danh sách users nếu user có chuối trong ví
        const users = this.getUsers();
        users.forEach(u => {
            const key = u.identifier;
            if (postMap[key]) {
                postMap[key].name = u.name || postMap[key].name;
                postMap[key].role = u.role;
                if (u.bananas && u.bananas > postMap[key].totalBananas) {
                    postMap[key].totalBananas = u.bananas;
                }
            } else if (u.bananas > 0) {
                postMap[key] = {
                    name: u.name,
                    identifier: u.identifier,
                    role: u.role,
                    totalPosts: 0,
                    approvedPosts: 0,
                    totalBananas: u.bananas
                };
            }
        });

        const bananaLeaderboard = Object.values(postMap).sort((a, b) => {
            if (b.totalBananas !== a.totalBananas) return b.totalBananas - a.totalBananas;
            return b.approvedPosts - a.approvedPosts;
        }).map((item, idx) => ({ ...item, rank: idx + 1 }));

        return { dataLeaderboard, bananaLeaderboard };
    }

    // ======================== DASHBOARD CÁ NHÂN CỦA CỘNG TÁC VIÊN ========================
    static getCollaboratorDashboardData(identifier) {
        const leads = this.getLeads();
        const idStr = (identifier || '').trim().toLowerCase();
        const userLeads = leads.filter(l => 
            (l.referrerPhone && l.referrerPhone.trim().toLowerCase() === idStr) ||
            (l.referrerName && l.referrerName.trim().toLowerCase() === idStr)
        );

        let totalLeads = userLeads.length;
        let wonLeads = 0;
        let paidReward = 0;
        let confirmedPendingReward = 0; // Đã chốt WON nhưng chưa chuyển tiền
        let estimatedUpcomingReward = 0; // Đang trong phễu: Chăm Sóc, Checkin, Training

        let careCount = 0;
        let checkinCount = 0;
        let trainingCount = 0;

        let careReward = 0;
        let checkinReward = 0;
        let trainingReward = 0;

        userLeads.forEach(l => {
            const amt = l.rewardAmount || 0;
            const lvl = this.getFunnelLevel(l.status);

            if (l.status === 'PAID') {
                wonLeads++;
                paidReward += amt;
            } else if (['WON', 'APPROVED', 'HOAN_THANH'].includes(l.status)) {
                wonLeads++;
                confirmedPendingReward += amt;
            } else if (['TRAINING', 'TRAINNING'].includes(l.status)) {
                trainingCount++;
                trainingReward += amt;
                estimatedUpcomingReward += amt; // Đang học xác suất 100% khi tốt nghiệp
            } else if (l.status === 'CHECKIN') {
                checkinCount++;
                checkinReward += amt;
                estimatedUpcomingReward += Math.round(amt * 0.75); // Checkin xác suất 75%
            } else if (['CARE', 'CONSULTING'].includes(l.status)) {
                careCount++;
                careReward += amt;
                estimatedUpcomingReward += Math.round(amt * 0.45); // Chăm sóc xác suất 45%
            } else if (['DATA', 'NEW'].includes(l.status)) {
                estimatedUpcomingReward += Math.round(amt * 0.25); // Mới nhận xác suất 25%
            }
        });

        return {
            totalLeads,
            wonLeads,
            paidReward,
            confirmedPendingReward,
            estimatedUpcomingReward,
            totalPipelineReward: careReward + checkinReward + trainingReward,
            inFunnelBreakdown: {
                careCount,
                careReward,
                checkinCount,
                checkinReward,
                trainingCount,
                trainingReward
            },
            leads: userLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        };
    }

    // ======================== THÔNG BÁO TIẾN TRÌNH DATA (NOTIFICATIONS) ========================
    static getUserNotifications(identifier) {
        if (!identifier) return { unreadCount: 0, list: [] };
        const data = this.getCollaboratorDashboardData(identifier);
        let readIds = [];
        try {
            readIds = JSON.parse(localStorage.getItem('wings_notifications_read') || '[]');
        } catch (e) {
            readIds = [];
        }

        const notifs = [];

        data.leads.forEach(l => {
            const timeStr = this.formatDate(l.createdAt);
            const amtFormatted = this.formatCurrency(l.rewardAmount);
            const course = COURSES_CONFIG.find(c => c.id === l.actualCourseId) || COURSES_CONFIG.find(c => c.id === l.interestCourseId);
            const courseName = course ? course.name : 'Khóa học Wings';

            // 1. Thông báo tiếp nhận (Gieo hạt)
            notifs.push({
                id: `notif_received_${l.id}`,
                leadId: l.id,
                type: 'RECEIVED',
                icon: 'fa-solid fa-seedling text-blue-400',
                title: `🤲 Đã tiếp nhận hạt giống: ${l.customerName}`,
                message: `Hạt giống cơ hội #${l.id} (${courseName}) đã được trao gửi đến Vườn Ươm Wings thành công.`,
                time: timeStr,
                badge: '🤲 Gieo hạt'
            });

            // 2. Thông báo khi đang tưới mát
            const lvl = this.getFunnelLevel(l.status);
            const isSelf = (l.actualCloseType === 'self' || l.closeType === 'self');
            if (lvl >= 2) {
                notifs.push({
                    id: `notif_care_${l.id}`,
                    leadId: l.id,
                    type: 'CARE',
                    icon: 'fa-solid fa-droplet text-amber-400',
                    title: isSelf ? `🌟 Tự vun trồng - Lên lịch hẹn: ${l.customerName}` : `💧 Đang tưới mát: ${l.customerName}`,
                    message: l.adminNote || (isSelf ? 'Tự vun trồng: Đã chăm sóc & lên lịch hẹn checkin tại học viện.' : 'Bà Tiên Xanh đang lắng nghe, tư vấn và tưới mát ước mơ học nghề cho học viên.'),
                    time: timeStr,
                    badge: isSelf ? 'Tự vun trồng' : '💧 Tưới mát'
                });
            }

            // 3. Thông báo khi nảy mầm
            if (lvl >= 3) {
                notifs.push({
                    id: `notif_checkin_${l.id}`,
                    leadId: l.id,
                    type: 'CHECKIN',
                    icon: 'fa-solid fa-leaf text-purple-400',
                    title: `🌱 Hạt giống đã nảy mầm: ${l.customerName}`,
                    message: `Học viên đã đến Vườn Ươm Wings trực tiếp trải nghiệm và lắng nghe định hướng nghề.`,
                    time: timeStr,
                    badge: '🌱 Nảy mầm'
                });
            }

            // 4. Thông báo khi đâm chồi (đào tạo)
            if (lvl >= 4) {
                notifs.push({
                    id: `notif_train_${l.id}`,
                    leadId: l.id,
                    type: 'TRAINING',
                    icon: 'fa-solid fa-spa text-cyan-400',
                    title: `🌿 Hạt giống đang đâm chồi: ${l.customerName}`,
                    message: `Học viên đang chăm chỉ thực hành đào tạo tay nghề. Quả ngọt dự kiến: ${amtFormatted}.`,
                    time: timeStr,
                    badge: '🌿 Đâm chồi'
                });
            }

            // 5. Thông báo kết trái (Won / Thành quả)
            if (lvl >= 5) {
                notifs.push({
                    id: `notif_won_${l.id}`,
                    leadId: l.id,
                    type: 'WON',
                    icon: 'fa-solid fa-apple-whole text-emerald-400',
                    title: `🍎 Hạt giống đã kết trái ngọt: ${l.customerName}!`,
                    message: `Học viên tốt nghiệp xuất sắc! Thành quả quả ngọt ${amtFormatted} đã sẵn sàng thu hoạch.`,
                    time: timeStr,
                    badge: '🍎 Kết trái'
                });
            }

            // 6. Thông báo đã thu hoạch quả ngọt (Chi trả)
            if (l.status === 'PAID') {
                notifs.push({
                    id: `notif_paid_${l.id}`,
                    leadId: l.id,
                    type: 'PAID',
                    icon: 'fa-solid fa-coins text-yellow-400',
                    title: `🍎 Đã thu hoạch quả ngọt: ${amtFormatted}`,
                    message: `Wings đã chuyển khoản thành quả vun trồng hạt giống ${l.customerName} vào tài khoản của bạn.`,
                    time: l.paidDate ? this.formatDate(l.paidDate) : timeStr,
                    badge: '🍎 Đã hái quả'
                });
            }
        });

        // Sắp xếp thông báo mới nhất lên đầu
        const list = notifs.map(n => ({
            ...n,
            isRead: readIds.includes(n.id)
        })).reverse();

        const unreadCount = list.filter(n => !n.isRead).length;
        return { unreadCount, list };
    }

    static markAllNotificationsRead(identifier) {
        const notifs = this.getUserNotifications(identifier);
        const readIds = notifs.list.map(n => n.id);
        localStorage.setItem('wings_notifications_read', JSON.stringify(readIds));
    }

    // ======================== USERS & AUTHENTICATION ========================
    static getUsers() {
        this.init();
        try {
            let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
            let changed = false;

            // Xóa bỏ tài khoản mock admin USR-ADMIN-01 nếu đã lưu trong localStorage trước đó
            const adminOldIndex = users.findIndex(u => u.id === 'USR-ADMIN-01' || (u.identifier === '0855955653' && u.isAdmin));
            if (adminOldIndex !== -1) {
                users.splice(adminOldIndex, 1);
                changed = true;
            }

            // Đảm bảo có tài khoản Chuyên viên hướng nghiệp (Bà Tiên Xanh) mẫu
            if (!users.some(u => u.identifier === '0908888999')) {
                const demoCounselor = INITIAL_DEMO_USERS.find(u => u.identifier === '0908888999');
                if (demoCounselor) {
                    users.unshift(demoCounselor);
                    changed = true;
                }
            }

            // Bảo đảm mọi tài khoản đều có trường mật khẩu và systemRole
            users.forEach(u => {
                if (!u.password) {
                    u.password = '123456';
                    changed = true;
                }
                if (!u.systemRole) {
                    if (u.identifier === '0908888999' || (u.role && u.role.toLowerCase().includes('chuyên viên'))) {
                        u.systemRole = 'counselor';
                        u.role = 'Chuyên viên hướng nghiệp';
                    } else if (u.isAdmin || (u.role && u.role.toLowerCase().includes('quản trị'))) {
                        u.systemRole = 'admin';
                        u.role = 'Quản trị viên';
                    } else {
                        u.systemRole = 'collaborator';
                    }
                    changed = true;
                }
                if (u.isAdmin && u.identifier === '0855955653') {
                    u.isAdmin = false;
                    u.systemRole = 'collaborator';
                    changed = true;
                }
            });

            if (changed) {
                this.saveUsers(users);
            }
            return users;
        } catch (e) {
            return INITIAL_DEMO_USERS;
        }
    }

    static saveUsers(users) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        this.pushToServer();
    }

    static getUserById(userId) {
        if (!userId) return null;
        const users = this.getUsers();
        return users.find(u => u.id === userId) || null;
    }

    // ======================== ROLE BASED ACCESS CONTROL (RBAC) ========================
    static getRolePermissions() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.ROLE_PERMISSIONS);
            if (!data) {
                this.saveRolePermissions(DEFAULT_ROLE_PERMISSIONS);
                return JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
            }
            const parsed = JSON.parse(data);
            let changed = false;
            ['admin', 'counselor', 'collaborator'].forEach(rId => {
                if (!parsed[rId]) {
                    parsed[rId] = JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS[rId]));
                    changed = true;
                }
                if (!parsed[rId].permissions) {
                    parsed[rId].permissions = {};
                    changed = true;
                }

                // Tương thích ngược từ các key cũ nếu có
                if (parsed[rId].permissions.config_courses === undefined) {
                    if (parsed[rId].permissions.config_system !== undefined) {
                        parsed[rId].permissions.config_courses = parsed[rId].permissions.config_system;
                    } else {
                        parsed[rId].permissions.config_courses = DEFAULT_ROLE_PERMISSIONS[rId].permissions.config_courses || false;
                    }
                    changed = true;
                }
                if (parsed[rId].permissions.config_game === undefined) {
                    if (parsed[rId].permissions.config_system !== undefined) {
                        parsed[rId].permissions.config_game = parsed[rId].permissions.config_system;
                    } else {
                        parsed[rId].permissions.config_game = DEFAULT_ROLE_PERMISSIONS[rId].permissions.config_game || false;
                    }
                    changed = true;
                }
                if (parsed[rId].permissions.approve_game_regs === undefined) {
                    parsed[rId].permissions.approve_game_regs = DEFAULT_ROLE_PERMISSIONS[rId].permissions.approve_game_regs || false;
                    changed = true;
                }

                SYSTEM_PERMISSIONS_LIST.forEach(p => {
                    if (parsed[rId].permissions[p.key] === undefined) {
                        parsed[rId].permissions[p.key] = DEFAULT_ROLE_PERMISSIONS[rId].permissions[p.key] || false;
                        changed = true;
                    }
                });
            });
            if (changed) {
                this.saveRolePermissions(parsed);
            }
            return parsed;
        } catch (e) {
            return JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
        }
    }

    static saveRolePermissions(matrix) {
        // Luôn đảm bảo Admin có full tất cả các quyền
        if (matrix && matrix.admin && matrix.admin.permissions) {
            SYSTEM_PERMISSIONS_LIST.forEach(p => {
                matrix.admin.permissions[p.key] = true;
            });
            // Legacy fallbacks
            matrix.admin.permissions.config_system = true;
        }
        localStorage.setItem(STORAGE_KEYS.ROLE_PERMISSIONS, JSON.stringify(matrix));
        this.pushToServer();
    }

    static hasPermission(roleId, permissionKey) {
        if (roleId === 'admin') return true;
        const matrix = this.getRolePermissions();
        if (matrix[roleId] && matrix[roleId].permissions) {
            if (matrix[roleId].permissions[permissionKey] !== undefined) {
                return Boolean(matrix[roleId].permissions[permissionKey]);
            }
        }
        return false;
    }

    static userHasPermission(user, permissionKey) {
        if (!user) return false;
        const role = user.systemRole || (user.role && user.role.toLowerCase().includes('chuyên viên') ? 'counselor' : (user.isAdmin ? 'admin' : 'collaborator'));
        return this.hasPermission(role, permissionKey);
    }

    static updateUserSystemRole(userId, newSystemRole) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            user.systemRole = newSystemRole;
            if (newSystemRole === 'admin') {
                user.isAdmin = true;
                user.role = 'Quản trị viên';
            } else if (newSystemRole === 'counselor') {
                user.isAdmin = false;
                user.role = 'Chuyên viên hướng nghiệp';
            } else {
                user.isAdmin = false;
                user.role = 'Cộng tác viên tuyển sinh';
            }
            this.saveUsers(users);

            const cur = this.getCurrentUser();
            if (cur && cur.id === userId) {
                this.setCurrentUser(user);
            }
            return user;
        }
        return null;
    }

    static registerUser(userData) {
        const users = this.getUsers();
        const identifierClean = userData.identifier.trim().toLowerCase();

        const existing = users.find(u => u.identifier.trim().toLowerCase() === identifierClean);
        if (existing) {
            return { success: false, message: 'Số điện thoại hoặc Gmail này đã được đăng ký trước đó!' };
        }

        const date = new Date();
        const yyMM = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, '0')}`;
        const newId = `USR-${yyMM}-${String(users.length + 1).padStart(3, '0')}`;
        const isEmail = identifierClean.includes('@');

        const newUser = {
            id: newId,
            name: userData.name.trim(),
            identifier: identifierClean,
            password: userData.password ? userData.password.trim() : '123456',
            authType: isEmail ? 'email' : 'phone',
            role: userData.role || 'Cộng tác viên tuyển sinh',
            systemRole: userData.systemRole || 'collaborator',
            isAdmin: userData.systemRole === 'admin',
            bankInfo: userData.bankInfo ? userData.bankInfo.trim() : '',
            status: 'PENDING',
            miniGameApproved: false,
            bananas: 0,
            registeredAt: date.toISOString(),
            approvedAt: null
        };

        users.unshift(newUser);
        this.saveUsers(users);
        return { success: true, user: newUser };
    }

    static loginUser(identifier, password) {
        const users = this.getUsers();
        const clean = (identifier || '').trim().toLowerCase();
        const user = users.find(u => u.identifier.trim().toLowerCase() === clean);

        if (!user) {
            return { success: false, code: 'NOT_FOUND', message: 'Tài khoản chưa tồn tại. Vui lòng đăng ký trước!' };
        }

        // Kiểm tra mật khẩu
        const inputPass = (password || '').trim();
        const userPass = (user.password || '123456').trim();
        if (inputPass !== userPass) {
            return { success: false, code: 'WRONG_PASSWORD', message: 'Mật khẩu không chính xác! Vui lòng kiểm tra lại.' };
        }

        if (user.status === 'PENDING') {
            return { 
                success: false, 
                code: 'PENDING', 
                message: 'Tài khoản của bạn đang chờ Quản trị viên duyệt. Vui lòng liên hệ Hotline Học viện để được kích hoạt nhanh!' 
            };
        }

        if (user.status === 'REJECTED') {
            return { success: false, code: 'REJECTED', message: 'Tài khoản của bạn không được phê duyệt hoặc đã bị khóa.' };
        }

        this.setCurrentUser(user);
        return { success: true, user };
    }

    static loginWithGoogle({ email, name, avatar }) {
        const users = this.getUsers();
        const clean = (email || '').trim().toLowerCase();
        let user = users.find(u => u.identifier.trim().toLowerCase() === clean);

        if (!user) {
            // Tự động tạo tài khoản mới nếu đăng nhập Google lần đầu
            const newId = `USR-${Date.now().toString().slice(-6)}`;
            user = {
                id: newId,
                name: name || 'Google User',
                identifier: clean,
                password: '123456',
                authType: 'google',
                role: 'Cộng tác viên tuyển sinh',
                systemRole: 'collaborator',
                bankInfo: '',
                status: 'APPROVED',
                miniGameApproved: true,
                bananas: 5,
                avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                registeredAt: new Date().toISOString(),
                approvedAt: new Date().toISOString()
            };
            users.unshift(user);
            this.saveUsers(users);
        } else {
            // Cập nhật avatar nếu người dùng có avatar mới từ Google
            if (avatar && (!user.avatar || user.avatar.trim() === '')) {
                user.avatar = avatar;
                this.saveUsers(users);
            }
        }

        if (user.status === 'REJECTED') {
            return { success: false, code: 'REJECTED', message: 'Tài khoản Google này đã bị khóa hoặc từ chối.' };
        }

        this.setCurrentUser(user);
        return { success: true, user };
    }

    static getCurrentUser() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            if (!data) return null;
            const current = JSON.parse(data);
            const users = this.getUsers();
            const fresh = users.find(u => u.id === current.id);
            return fresh || current;
        } catch (e) {
            return null;
        }
    }

    static setCurrentUser(user) {
        if (!user) {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        } else {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        }
    }

    static logoutUser() {
        this.setCurrentUser(null);
    }

    static approveUser(userId) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index].status = 'APPROVED';
            users[index].approvedAt = new Date().toISOString();
            this.saveUsers(users);

            const current = this.getCurrentUser();
            if (current && current.id === userId) {
                this.setCurrentUser(users[index]);
            }
            return users[index];
        }
        return null;
    }

    static rejectUser(userId) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index].status = 'REJECTED';
            this.saveUsers(users);
            return users[index];
        }
        return null;
    }

    static updateUser(userId, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            const current = users[index];
            const updated = { ...current, ...updates };
            if (updates.name) updated.name = updates.name.trim();
            if (updates.bankInfo !== undefined) updated.bankInfo = updates.bankInfo.trim();
            if (updates.avatar !== undefined) updated.avatar = updates.avatar;
            if (updates.role) updated.role = updates.role.trim();
            if (updates.password && updates.password.trim() !== '') {
                updated.password = updates.password.trim();
            }

            users[index] = updated;
            this.saveUsers(users);

            const curr = this.getCurrentUser();
            if (curr && curr.id === userId) {
                this.setCurrentUser(updated);
            }
            return updated;
        }
        return null;
    }

    static resetUserPassword(userId, newPassword) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index].password = (newPassword || '123456').trim();
            this.saveUsers(users);

            const curr = this.getCurrentUser();
            if (curr && curr.id === userId) {
                this.setCurrentUser(users[index]);
            }
            return users[index];
        }
        return null;
    }

    static adjustUserBananas(userId, amount) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index].bananas = Math.max(0, (users[index].bananas || 0) + amount);
            this.saveUsers(users);

            const current = this.getCurrentUser();
            if (current && current.id === userId) {
                this.setCurrentUser(users[index]);
            }
            return users[index];
        }
        return null;
    }

    // ======================== ĐĂNG KÝ THAM GIA MINI GAME KÈM ẢNH CHUỐI ========================
    static getGameRegistrations() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.GAME_REGISTRATIONS)) || [];
        } catch (e) {
            return [];
        }
    }

    static saveGameRegistrations(list) {
        localStorage.setItem(STORAGE_KEYS.GAME_REGISTRATIONS, JSON.stringify(list));
        this.pushToServer();
    }

    static getUserGameRegistration(userId) {
        const list = this.getGameRegistrations();
        return list.find(r => r.userId === userId) || null;
    }

    static submitGameRegistration(data) {
        const list = this.getGameRegistrations();
        const date = new Date();
        const count = list.length + 1;
        const newId = `GREG-2610-${String(count).padStart(3, '0')}`;

        // Kiểm tra xem user này đã từng nộp chưa
        const existingIdx = list.findIndex(r => r.userId === data.userId);

        const newReg = {
            id: existingIdx !== -1 ? list[existingIdx].id : newId,
            userId: data.userId,
            userName: data.userName,
            userIdentifier: data.userIdentifier,
            bananasTransferred: data.bananasTransferred || 3,
            proofImage: data.proofImage, // Base64 data URL
            note: data.note ? data.note.trim() : '',
            status: 'PENDING', // Bắt buộc Admin duyệt sau khi kiểm tra ảnh chuối!
            adminNote: '',
            submittedAt: date.toISOString(),
            reviewedAt: null
        };

        if (existingIdx !== -1) {
            list[existingIdx] = newReg;
        } else {
            list.unshift(newReg);
        }

        this.saveGameRegistrations(list);
        return newReg;
    }

    static approveGameRegistration(regId) {
        const list = this.getGameRegistrations();
        const index = list.findIndex(r => r.id === regId);
        if (index !== -1) {
            list[index].status = 'APPROVED';
            list[index].reviewedAt = new Date().toISOString();
            this.saveGameRegistrations(list);

            // Mở quyền tham gia mini game cho user
            const users = this.getUsers();
            const uIdx = users.findIndex(u => u.id === list[index].userId);
            if (uIdx !== -1) {
                users[uIdx].miniGameApproved = true;
                this.saveUsers(users);

                const current = this.getCurrentUser();
                if (current && current.id === users[uIdx].id) {
                    this.setCurrentUser(users[uIdx]);
                }
            }
            return list[index];
        }
        return null;
    }

    static rejectGameRegistration(regId, reason = 'Ảnh chưa thể hiện rõ giao dịch chuyển chuối hoặc chưa nhận được chuối') {
        const list = this.getGameRegistrations();
        const index = list.findIndex(r => r.id === regId);
        if (index !== -1) {
            list[index].status = 'REJECTED';
            list[index].adminNote = reason;
            list[index].reviewedAt = new Date().toISOString();
            this.saveGameRegistrations(list);

            const users = this.getUsers();
            const uIdx = users.findIndex(u => u.id === list[index].userId);
            if (uIdx !== -1) {
                users[uIdx].miniGameApproved = false;
                this.saveUsers(users);

                const current = this.getCurrentUser();
                if (current && current.id === users[uIdx].id) {
                    this.setCurrentUser(users[uIdx]);
                }
            }
            return list[index];
        }
        return null;
    }

    // ======================== BÀI ĐĂNG MINI GAME ========================
    static getBananaPosts() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];
        } catch (e) {
            return [];
        }
    }

    static saveBananaPosts(posts) {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
        this.pushToServer();
    }

    static addBananaPost(postData) {
        const posts = this.getBananaPosts();
        const date = new Date();
        const count = posts.length + 1;
        const newId = `POST-2610-${String(count).padStart(3, '0')}`;

        const newPost = {
            id: newId,
            userId: postData.userId,
            userName: postData.userName,
            userIdentifier: postData.userIdentifier,
            platform: postData.platform || 'Facebook',
            link: postData.link.trim(),
            note: postData.note ? postData.note.trim() : '',
            status: 'PENDING',
            bananasAwarded: 0,
            adminNote: '',
            createdAt: date.toISOString(),
            reviewedAt: null
        };

        posts.unshift(newPost);
        this.saveBananaPosts(posts);
        return newPost;
    }

    static approveBananaPost(postId, customBananas = null) {
        const posts = this.getBananaPosts();
        const index = posts.findIndex(p => p.id === postId);
        if (index !== -1 && posts[index].status !== 'APPROVED') {
            const config = this.getBananaConfig();
            const reward = customBananas !== null ? customBananas : (config.bananasPerValidLink || 1);

            posts[index].status = 'APPROVED';
            posts[index].bananasAwarded = reward;
            posts[index].reviewedAt = new Date().toISOString();
            this.saveBananaPosts(posts);

            this.adjustUserBananas(posts[index].userId, reward);
            return posts[index];
        }
        return null;
    }

    static rejectBananaPost(postId, reason = 'Link không hợp lệ hoặc chưa công khai') {
        const posts = this.getBananaPosts();
        const index = posts.findIndex(p => p.id === postId);
        if (index !== -1) {
            posts[index].status = 'REJECTED';
            posts[index].adminNote = reason;
            posts[index].reviewedAt = new Date().toISOString();
            this.saveBananaPosts(posts);
            return posts[index];
        }
        return null;
    }

    // ======================== CẤU HÌNH BANANA & VÍ ADMIN ========================
    static getBananaConfig() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.BANANA_CONFIG)) || DEFAULT_BANANA_CONFIG;
        } catch (e) {
            return DEFAULT_BANANA_CONFIG;
        }
    }

    static saveBananaConfig(config) {
        localStorage.setItem(STORAGE_KEYS.BANANA_CONFIG, JSON.stringify(config));
        this.pushToServer();
    }

    static resetDemoData() {
        localStorage.setItem(STORAGE_KEYS.REWARD_CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
        localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
        localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_DEMO_LEADS));
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_DEMO_USERS));
        localStorage.setItem(STORAGE_KEYS.GAME_REGISTRATIONS, JSON.stringify(INITIAL_DEMO_GAME_REGISTRATIONS));
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_DEMO_POSTS));
        localStorage.setItem(STORAGE_KEYS.BANANA_CONFIG, JSON.stringify(DEFAULT_BANANA_CONFIG));
    }

    static formatMoneyShort(num) {
        if (!num && num !== 0) return '0 đ';
        if (num >= 1000000) {
            const m = num / 1000000;
            return (Number.isInteger(m) ? m : m.toFixed(1)).toString().replace('.', ',') + 'M';
        }
        if (num >= 1000) {
            const k = num / 1000;
            return (Number.isInteger(k) ? k : k.toFixed(1)).toString().replace('.', ',') + 'K';
        }
        return this.formatCurrency(num);
    }

    static formatCurrency(num) {
        if (!num && num !== 0) return '0 đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    }

    static formatDate(isoStr) {
        if (!isoStr) return '--';
        try {
            const d = new Date(isoStr);
            return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        } catch (e) {
            return isoStr;
        }
    }

    static formatDateShort(dateStr) {
        if (!dateStr) return '--';
        try {
            const parts = dateStr.slice(0, 10).split('-');
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        } catch (e) {}
        return dateStr;
    }

    // ======================== MULTI-DEVICE WI-FI DATA SYNCHRONIZATION ========================
    static isSyncing = false;
    static isPushing = false;

    static async pushToServer() {
        if (typeof window === 'undefined' || !window.fetch || this.isPushing) return;
        this.isPushing = true;
        try {
            const payload = {
                users: this.getUsers(),
                leads: this.getLeads(),
                game_regs: this.getGameRegistrations(),
                posts: this.getBananaPosts(),
                banana_config: this.getBananaConfig(),
                role_permissions: this.getRolePermissions()
            };
            await fetch('/api/db', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (e) {
            // Offline or dev mode
        } finally {
            this.isPushing = false;
        }
    }

    static async syncWithServer() {
        if (typeof window === 'undefined' || !window.fetch || this.isSyncing) return;
        this.isSyncing = true;
        try {
            const res = await fetch('/api/db?t=' + Date.now(), { cache: 'no-store' });
            if (!res.ok) {
                this.isSyncing = false;
                return;
            }
            const serverDb = await res.json();
            if (!serverDb || typeof serverDb !== 'object') {
                this.isSyncing = false;
                return;
            }

            let dataChanged = false;

            // 1. Đồng bộ Users (Thành viên đăng ký)
            if (Array.isArray(serverDb.users) && serverDb.users.length > 0) {
                const localUsers = this.getUsers();
                const mergedUsers = [...localUsers];
                let usersChanged = false;

                serverDb.users.forEach(sUser => {
                    const idx = mergedUsers.findIndex(u => u.id === sUser.id || (u.identifier && sUser.identifier && u.identifier.trim().toLowerCase() === sUser.identifier.trim().toLowerCase()));
                    if (idx === -1) {
                        mergedUsers.unshift(sUser);
                        usersChanged = true;
                    } else {
                        const local = mergedUsers[idx];
                        if (local.status !== sUser.status || local.systemRole !== sUser.systemRole || local.bananas !== sUser.bananas || local.role !== sUser.role) {
                            mergedUsers[idx] = { ...local, ...sUser };
                            usersChanged = true;
                        }
                    }
                });

                if (usersChanged) {
                    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mergedUsers));
                    dataChanged = true;
                }

                // Nếu client hiện tại có user mà server chưa có (ví dụ vừa đăng ký trên iPhone trước đó) -> đẩy lên server!
                const hasLocalNewUsers = localUsers.some(lu => !serverDb.users.some(su => su.id === lu.id || (su.identifier && lu.identifier && su.identifier.trim().toLowerCase() === lu.identifier.trim().toLowerCase())));
                if (hasLocalNewUsers) {
                    this.pushToServer();
                }
            } else {
                const localUsers = this.getUsers();
                if (localUsers.length > 0) {
                    this.pushToServer();
                }
            }

            // 2. Đồng bộ Leads (Data tuyển dụng)
            if (Array.isArray(serverDb.leads) && serverDb.leads.length > 0) {
                const localLeads = this.getLeads();
                const mergedLeads = [...localLeads];
                let leadsChanged = false;

                serverDb.leads.forEach(sLead => {
                    const idx = mergedLeads.findIndex(l => l.id === sLead.id);
                    if (idx === -1) {
                        mergedLeads.unshift(sLead);
                        leadsChanged = true;
                    } else {
                        const local = mergedLeads[idx];
                        if (local.status !== sLead.status || local.adminNote !== sLead.adminNote || local.rewardAmount !== sLead.rewardAmount) {
                            mergedLeads[idx] = { ...local, ...sLead };
                            leadsChanged = true;
                        }
                    }
                });

                if (leadsChanged) {
                    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(mergedLeads));
                    dataChanged = true;
                }

                const hasLocalNewLeads = localLeads.some(ll => !serverDb.leads.some(sl => sl.id === ll.id));
                if (hasLocalNewLeads) {
                    this.pushToServer();
                }
            } else {
                const localLeads = this.getLeads();
                if (localLeads.length > 0) {
                    this.pushToServer();
                }
            }

            // 3. Đồng bộ Game Registrations (Đơn tham gia mini game)
            if (Array.isArray(serverDb.game_regs) && serverDb.game_regs.length > 0) {
                const localRegs = this.getGameRegistrations();
                const mergedRegs = [...localRegs];
                let regsChanged = false;
                serverDb.game_regs.forEach(sReg => {
                    const idx = mergedRegs.findIndex(r => r.id === sReg.id);
                    if (idx === -1) {
                        mergedRegs.unshift(sReg);
                        regsChanged = true;
                    } else if (mergedRegs[idx].status !== sReg.status) {
                        mergedRegs[idx] = { ...mergedRegs[idx], ...sReg };
                        regsChanged = true;
                    }
                });
                if (regsChanged) {
                    localStorage.setItem(STORAGE_KEYS.GAME_REGISTRATIONS, JSON.stringify(mergedRegs));
                    dataChanged = true;
                }
            }

            // 4. Đồng bộ Banana Posts (Link bài đăng)
            if (Array.isArray(serverDb.posts) && serverDb.posts.length > 0) {
                const localPosts = this.getBananaPosts();
                const mergedPosts = [...localPosts];
                let postsChanged = false;
                serverDb.posts.forEach(sPost => {
                    const idx = mergedPosts.findIndex(p => p.id === sPost.id);
                    if (idx === -1) {
                        mergedPosts.unshift(sPost);
                        postsChanged = true;
                    } else if (mergedPosts[idx].status !== sPost.status) {
                        mergedPosts[idx] = { ...mergedPosts[idx], ...sPost };
                        postsChanged = true;
                    }
                });
                if (postsChanged) {
                    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(mergedPosts));
                    dataChanged = true;
                }
            }

            // Cập nhật giao diện tự động khi có dữ liệu mới
            if (dataChanged) {
                window.dispatchEvent(new CustomEvent('wings-data-synced'));
                if (typeof renderUsersTable === 'function') {
                    renderUsersTable();
                }
                if (typeof refreshAdminDashboard === 'function') {
                    refreshAdminDashboard();
                }
                if (typeof renderCollaboratorDashboard === 'function') {
                    renderCollaboratorDashboard();
                }
                if (typeof updateUserSessionUI === 'function') {
                    updateUserSessionUI();
                }
            }
        } catch (e) {
            // Ignored
        } finally {
            this.isSyncing = false;
        }
    }
}

DataManager.init();

// Tự động đồng bộ liên tục giữa iPhone và Máy tính mỗi 2.5 giây qua Wi-Fi
if (typeof window !== 'undefined') {
    setTimeout(() => {
        DataManager.syncWithServer();
    }, 200);
    setInterval(() => {
        DataManager.syncWithServer();
    }, 2500);
}

