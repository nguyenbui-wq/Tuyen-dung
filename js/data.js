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
    ROLE_PERMISSIONS: 'wings_role_permissions_v1'
};

// ==========================================================================
// ĐỊNH NGHĨA 3 CẤP BẬC VAI TRÒ & 4 QUYỀN HẠN CỐT LÕI
// 1. Quản trị viên (Admin) - Toàn quyền & duy nhất được sửa bảng phân quyền
// 2. Chuyên viên hướng nghiệp (Counselor) - Tùy chỉnh theo checkbox (Mặc định: Duyệt bài & Duyệt thành viên)
// 3. Cộng tác viên (Collaborator) - Không duyệt gì hết
// ==========================================================================
const DEFAULT_ROLE_PERMISSIONS = {
    admin: {
        id: 'admin',
        name: 'Quản trị viên',
        badge: '👑 Quản Trị Viên',
        badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40',
        permissions: {
            config_system: true,   // 1. Điều chỉnh cấu hình mini game, bảng thưởng khóa học
            approve_posts: true,   // 2. Duyệt bài
            approve_members: true, // 3. Duyệt thành viên
            approve_leads: true    // 4. Duyệt Data (duyệt thưởng)
        }
    },
    counselor: {
        id: 'counselor',
        name: 'Chuyên viên hướng nghiệp',
        badge: '🛡️ Chuyên Viên Hướng Nghiệp',
        badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        permissions: {
            config_system: false,  // Mặc định: tắt
            approve_posts: true,   // Mặc định: Duyệt bài
            approve_members: true, // Mặc định: Duyệt thành viên
            approve_leads: false   // Mặc định: tắt (Admin có thể tích chọn mở)
        }
    },
    collaborator: {
        id: 'collaborator',
        name: 'Cộng tác viên',
        badge: '💼 Cộng Tác Viên',
        badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        permissions: {
            config_system: false,  // Cộng tác viên không duyệt gì hết
            approve_posts: false,
            approve_members: false,
            approve_leads: false
        }
    }
};

const SYSTEM_PERMISSIONS_LIST = [
    {
        key: 'config_system',
        name: 'Điều chỉnh cấu hình',
        desc: 'Cấu hình mini game, bảng thưởng khóa học & chiến dịch',
        icon: 'fa-solid fa-sliders text-amber-400'
    },
    {
        key: 'approve_posts',
        name: 'Duyệt bài',
        desc: 'Kiểm duyệt link bài đăng / video nộp nhận chuối',
        icon: 'fa-solid fa-file-circle-check text-yellow-400'
    },
    {
        key: 'approve_members',
        name: 'Duyệt thành viên',
        desc: 'Duyệt ảnh chuyển chuối tham gia game & kích hoạt tài khoản',
        icon: 'fa-solid fa-user-check text-emerald-400'
    },
    {
        key: 'approve_leads',
        name: 'Duyệt Data (duyệt thưởng)',
        desc: 'Tiếp nhận, xử lý khách hàng và duyệt chi trả hoa hồng',
        icon: 'fa-solid fa-hand-holding-dollar text-cyan-400'
    }
];

// 1. DANH MỤC KHÓA HỌC & BIỂU PHÍ THƯỞNG MẪU BAN ĐẦU (DO ADMIN QUẢN LÝ)
const INITIAL_COURSES = [
    {
        id: 'ws_coban',
        name: 'Workshop Cơ bản',
        tuition: 1900000,
        tuitionFormatted: '1,9M',
        scholarship: 0,
        scholarshipFormatted: '0 đ',
        scholarshipNote: '',
        selfPercent: 26.3,
        acaPercent: 13.2,
        rewardSelf: 500000,
        rewardSelfFormatted: '500K',
        rewardPass: 250000,
        rewardPassFormatted: '250K',
        badge: 'Cơ bản',
        icon: 'gem'
    },
    {
        id: 'nentang',
        name: 'Nền Tảng',
        tuition: 5900000,
        tuitionFormatted: '5,9M',
        scholarship: 0,
        scholarshipFormatted: '0 đ',
        scholarshipNote: '',
        selfPercent: 17.0,
        acaPercent: 8.5,
        rewardSelf: 1000000,
        rewardSelfFormatted: '1M',
        rewardPass: 500000,
        rewardPassFormatted: '500K',
        badge: 'Phổ biến',
        icon: 'shield'
    },
    {
        id: 'tinhhoa',
        name: 'Tinh Hoa',
        tuition: 9900000,
        tuitionFormatted: '9,9M',
        scholarship: 0,
        scholarshipFormatted: '0 đ',
        scholarshipNote: '',
        selfPercent: 20.2,
        acaPercent: 10.1,
        rewardSelf: 2000000,
        rewardSelfFormatted: '2M',
        rewardPass: 1000000,
        rewardPassFormatted: '1M',
        badge: 'Chuyên sâu',
        icon: 'crown'
    },
    {
        id: 'volume_mega',
        name: 'Volume & Mega',
        tuition: 9900000,
        tuitionFormatted: '9,9M',
        scholarship: 0,
        scholarshipFormatted: '0 đ',
        scholarshipNote: '',
        selfPercent: 20.2,
        acaPercent: 10.1,
        rewardSelf: 2000000,
        rewardSelfFormatted: '2M',
        rewardPass: 1000000,
        rewardPassFormatted: '1M',
        badge: 'Chuyên sâu',
        icon: 'crown'
    },
    {
        id: 'thietke_taodang',
        name: 'Thiết kế & Tạo dáng',
        tuition: 9900000,
        tuitionFormatted: '9,9M',
        scholarship: 0,
        scholarshipFormatted: '0 đ',
        scholarshipNote: '',
        selfPercent: 20.2,
        acaPercent: 10.1,
        rewardSelf: 2000000,
        rewardSelfFormatted: '2M',
        rewardPass: 1000000,
        rewardPassFormatted: '1M',
        badge: 'Chuyên sâu',
        icon: 'crown'
    },
    {
        id: 'combo_uudai',
        name: 'Combo 4 khóa – Ưu đãi',
        tuition: 19900000,
        tuitionFormatted: '19,9M',
        scholarship: 2000000,
        scholarshipFormatted: '2M',
        scholarshipNote: 'Tài trợ học bổng 2.000.000đ cho 5 HV đầu tiên',
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
        name: 'Combo 4 khóa – Không ưu đãi',
        tuition: 29900000,
        tuitionFormatted: '29,9M',
        scholarship: 0,
        scholarshipFormatted: '0 đ',
        scholarshipNote: '',
        selfPercent: 23.4,
        acaPercent: 11.7,
        rewardSelf: 7000000,
        rewardSelfFormatted: '7M',
        rewardPass: 3500000,
        rewardPassFormatted: '3,5M',
        badge: 'CAO CẤP',
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

// Trạng thái xử lý hồ sơ data
const LEAD_STATUS = {
    NEW: { id: 'NEW', label: 'Mới nhận data', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    CONSULTING: { id: 'CONSULTING', label: 'Đang tư vấn', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    WON: { id: 'WON', label: 'Chốt thành công', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    LOST: { id: 'LOST', label: 'Không thành công', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    APPROVED: { id: 'APPROVED', label: 'Đã duyệt thưởng', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    PAID: { id: 'PAID', label: 'Đã chi trả thưởng', color: 'bg-yellow-400/25 text-yellow-300 border-yellow-400/40 font-semibold' }
};

// 2. CẤU HÌNH BANANA MINI GAME & VÍ ADMIN
const DEFAULT_BANANA_CONFIG = {
    adminWalletAddress: 'WINGS-BANANA-ADMIN-8888', // Mã ví chuối của Admin
    adminWalletOwner: 'Bộ phận Hướng nghiệp Wings (Vy Đào)',
    bananasPerValidLink: 1,             // Cứ 1 link hợp lệ nhận 1 🍌
    requiredBananasToEnter: 3,          // Lệ phí / số chuối điều kiện để mở tham gia chương trình
    programFeeTitle: 'Điều Kiện Tham Gia Mini Game Tuyển Dụng',
    programFeeDescription: 'Để tham gia Mini Game và nộp link bài đăng, bạn cần chuyển đủ số Chuối 🍌 (theo lệ phí quy định) đến Ví Admin và đính kèm ảnh xác nhận chuyển chuối thành công để Admin duyệt mở quyền chơi.',
    guidelines: '1. Chuyển chuối đến Mã ví Admin: WINGS-BANANA-ADMIN-8888 (hoặc liên hệ Vy Đào).\n2. Chụp ảnh màn hình giao dịch chuyển chuối thành công và đính kèm vào form bên dưới.\n3. Quản trị viên kiểm tra ảnh chuối và duyệt quyền tham gia Mini Game cho bạn.'
};

// Dữ liệu mẫu người dùng (Các tài khoản thành viên thử nghiệm)
const INITIAL_DEMO_USERS = [
    {
        id: 'USR-2610-ACA',
        name: 'Vy Đào (Chuyên viên ACA)',
        identifier: '0908888999',
        password: '123456',
        authType: 'phone',
        role: 'Chuyên viên hướng nghiệp',
        systemRole: 'counselor',
        bankInfo: 'Techcombank - 88889999000 - Vy Dao',
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
        role: 'Học viên cũ (Khóa Tinh Hoa K12)',
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
        role: 'Nhân viên Wings (Kỹ thuật viên)',
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
        role: 'Cộng tác viên tuyển sinh',
        systemRole: 'collaborator',
        bankInfo: 'Techcombank - 19033455667788 - Nguyen Phuong Linh',
        status: 'PENDING',
        miniGameApproved: false,
        bananas: 0,
        registeredAt: '2026-10-07T16:00:00',
        approvedAt: null
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
    }
];

// Dữ liệu mẫu danh sách khách hàng ban đầu
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
        appointmentDate: '',
        tuitionPaymentDate: '',
        tuitionPaymentNote: '',
        
        status: 'PAID',
        actualCourseId: 'combo_uudai',
        actualCloseType: 'pass',
        rewardAmount: 2000000,
        assignedTo: 'Vy Đào (CV Hướng nghiệp)',
        adminNote: 'Khách cọc 5 triệu ngày 07/10, học lớp 15/10. Đã chuyển khoản thưởng 2.000.000đ cho bạn Thảo.',
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
        
        // KẾ HOẠCH CHO ĐỘI ACA
        appointmentDate: '2026-10-12T09:30',
        tuitionPaymentDate: '2026-10-12',
        tuitionPaymentNote: 'Đã cọc 3.000.000đ chuyển khoản. Lên học viện đóng 26.900.000đ còn lại tại quầy.',
        
        status: 'WON',
        actualCourseId: 'combo_khong_uudai',
        actualCloseType: 'self',
        rewardAmount: 7000000,
        assignedTo: 'Tự chốt (Trần Thị Thu Thảo)',
        adminNote: 'Đội ACA đã xếp phòng VIP 1 và tài liệu. Chờ khách lên ngày 12/10 để chi thưởng 7.000.000đ.',
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
        }
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_DEMO_USERS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.GAME_REGISTRATIONS)) {
            localStorage.setItem(STORAGE_KEYS.GAME_REGISTRATIONS, JSON.stringify(INITIAL_DEMO_GAME_REGISTRATIONS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
            localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_DEMO_POSTS));
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
        if (camp && Array.isArray(camp.courses) && camp.courses.length > 0) {
            if (camp.isActive) COURSES_CONFIG = camp.courses;
            return camp.courses;
        }
        COURSES_CONFIG = INITIAL_COURSES;
        return INITIAL_COURSES;
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
        const scholarship = parseInt(courseData.scholarship, 10) || 0;
        const selfPercent = parseFloat(courseData.selfPercent) || 0;
        const acaPercent = parseFloat(courseData.acaPercent) || 0;

        const rewardSelf = courseData.rewardSelf ? parseInt(courseData.rewardSelf, 10) : Math.round(tuition * selfPercent / 100);
        const rewardPass = courseData.rewardPass ? parseInt(courseData.rewardPass, 10) : Math.round(tuition * acaPercent / 100);

        const newCourse = {
            id: newId,
            name: courseData.name.trim(),
            tuition: tuition,
            tuitionFormatted: this.formatMoneyShort(tuition),
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
        const scholarship = parseInt(updated.scholarship, 10) || 0;
        const selfPercent = parseFloat(updated.selfPercent) || 0;
        const acaPercent = parseFloat(updated.acaPercent) || 0;

        const rewardSelf = updates.rewardSelf !== undefined ? parseInt(updates.rewardSelf, 10) : Math.round(tuition * selfPercent / 100);
        const rewardPass = updates.rewardPass !== undefined ? parseInt(updates.rewardPass, 10) : Math.round(tuition * acaPercent / 100);

        updated.name = updated.name.trim();
        updated.tuition = tuition;
        updated.tuitionFormatted = this.formatMoneyShort(tuition);
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

            status: 'NEW',
            actualCourseId: course.id,
            actualCloseType: leadData.closeType || 'pass',
            rewardAmount: reward,
            assignedTo: isSelf ? `Tự chốt (${leadData.referrerName})` : 'Vy Đào (CV Hướng nghiệp)',
            adminNote: '',
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

            // Đảm bảo có tài khoản Chuyên viên hướng nghiệp Vy Đào mẫu
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
        // Luôn đảm bảo Admin có full 4 quyền
        if (matrix && matrix.admin && matrix.admin.permissions) {
            matrix.admin.permissions.config_system = true;
            matrix.admin.permissions.approve_posts = true;
            matrix.admin.permissions.approve_members = true;
            matrix.admin.permissions.approve_leads = true;
        }
        localStorage.setItem(STORAGE_KEYS.ROLE_PERMISSIONS, JSON.stringify(matrix));
    }

    static hasPermission(roleId, permissionKey) {
        if (roleId === 'admin') return true;
        const matrix = this.getRolePermissions();
        if (matrix[roleId] && matrix[roleId].permissions) {
            return Boolean(matrix[roleId].permissions[permissionKey]);
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
                message: 'Tài khoản của bạn đang chờ Quản trị viên duyệt. Vui lòng liên hệ Hotline/Zalo Vy Đào để được kích hoạt nhanh!' 
            };
        }

        if (user.status === 'REJECTED') {
            return { success: false, code: 'REJECTED', message: 'Tài khoản của bạn không được phê duyệt hoặc đã bị khóa.' };
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
}

DataManager.init();
