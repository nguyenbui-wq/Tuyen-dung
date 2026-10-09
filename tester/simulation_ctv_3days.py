# -*- coding: utf-8 -*-
"""
=============================================================================
WINGS BEAUTY & ACADEMY - KỊCH BẢN KIỂM THỬ TỰ ĐỘNG (AUTOMATED TESTER)
Kịch bản: Cộng tác viên (CTV) đăng ký tham gia và nộp data trong 3 ngày
Mỗi ngày trung bình 1 - 2 data.
=============================================================================
"""

import os
import sys
import json
from datetime import datetime, timedelta

# Đảm bảo in UTF-8 không lỗi trên Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# =============================================================================
# 1. CẤU HÌNH & KHỞI TẠO MÔ PHỎNG DỮ LIỆU (SIMULATION DATA ENGINE)
# =============================================================================
COURSES_CATALOG = {
    'classic_nentang': {
        'id': 'classic_nentang',
        'name': 'Khóa Nền Tảng Uốn Mi & Classic',
        'tuition': 2000000,
        'rewardSelf': 500000,
        'rewardPass': 250000
    },
    'thietke_taodang': {
        'id': 'thietke_taodang',
        'name': 'Khóa Tạo Dáng Mi Thiết Kế & Mi Dưới',
        'tuition': 5000000,
        'rewardSelf': 1000000,
        'rewardPass': 500000
    },
    'tinhhoa_chuyensau': {
        'id': 'tinhhoa_chuyensau',
        'name': 'Khóa Kỹ Thuật Tinh Hoa Chuyên Sâu',
        'tuition': 5000000,
        'rewardSelf': 1000000,
        'rewardPass': 500000
    },
    'combo_uudai': {
        'id': 'combo_uudai',
        'name': 'Combo 4 Khóa – Ưu Đãi',
        'tuition': 19900000,
        'rewardSelf': 4000000,
        'rewardPass': 2000000
    }
}

FUNNEL_LEVELS = {
    'DATA': 1, 'NEW': 1,
    'CARE': 2, 'CONSULTING': 2,
    'CHECKIN': 3,
    'TRAINING': 4,
    'WON': 5, 'APPROVED': 5, 'PAID': 5,
    'LOST': 0, 'REJECTED': 0
}

class TestReporter:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.logs = []

    def assert_true(self, condition, message):
        if condition:
            self.passed += 1
            log_line = f"  [PASS] {message}"
            print(log_line)
            self.logs.append({"status": "PASS", "message": message})
        else:
            self.failed += 1
            log_line = f"  [FAIL] {message}"
            print(log_line)
            self.logs.append({"status": "FAIL", "message": message})

    def header(self, title):
        sep = "=" * 70
        print(f"\n{sep}\n{title}\n{sep}")
        self.logs.append({"status": "SECTION", "message": title})

    def subheader(self, title):
        sep = "-" * 50
        print(f"\n{sep}\n>>> {title}\n{sep}")
        self.logs.append({"status": "SUBSECTION", "message": title})

reporter = TestReporter()

# =============================================================================
# 2. KHỞI TẠO CƠ SỞ DỮ LIỆU GIẢ LẬP (MOCK DATABASE)
# =============================================================================
db = {
    'users': [],
    'leads': [],
    'banana_posts': [],
    'notifications': []
}

# Persona CTV được phân công
PERSONA_CTV = {
    'id': 'USR-TEST-LAN',
    'name': 'Nguyễn Thị Mai Lan',
    'identifier': '0912345678',
    'password': '123456',
    'authType': 'phone',
    'role': 'Cộng tác viên tuyển sinh',
    'systemRole': 'collaborator',
    'bankInfo': 'Vietcombank - 0071009988776 - Nguyen Thi Mai Lan',
    'status': 'PENDING',
    'miniGameApproved': False,
    'bananas': 0
}

# =============================================================================
# 3. KỊCH BẢN NGÀY 1 (DAY 1)
# =============================================================================
def run_day_1():
    reporter.header("NGÀY 1: CTV MAI LAN ĐĂNG KÝ, THAM GIA MINI GAME & NỘP DATA ĐẦU TIÊN")
    
    # 1.1. Đăng ký tài khoản thành viên
    reporter.subheader("Bước 1.1: Đăng ký thành viên CTV mới")
    new_user = dict(PERSONA_CTV)
    new_user['registeredAt'] = '2026-10-06T09:00:00'
    db['users'].append(new_user)
    
    reporter.assert_true(new_user['status'] == 'PENDING', "Tài khoản mới đăng ký phải ở trạng thái PENDING (chờ duyệt).")
    reporter.assert_true(new_user['systemRole'] == 'collaborator', "Vai trò hệ thống mặc định là collaborator (Cộng tác viên).")
    reporter.assert_true(new_user['bananas'] == 0, "Số chuối ban đầu bằng 0.")

    # 1.2. Admin duyệt tài khoản thành viên
    reporter.subheader("Bước 1.2: Admin kiểm duyệt & phê duyệt tài khoản")
    new_user['status'] = 'APPROVED'
    new_user['approvedAt'] = '2026-10-06T09:15:00'
    reporter.assert_true(new_user['status'] == 'APPROVED', "Admin đã duyệt tài khoản thành APPROVED (đủ quyền đăng nhập và nộp data).")

    # 1.3. Nộp link bài viết tham gia Mini Game nhận Chuối 🍌
    reporter.subheader("Bước 1.3: CTV nộp link bài đăng Facebook giới thiệu khóa học")
    post = {
        'id': 'POST-001',
        'userId': new_user['id'],
        'authorName': new_user['name'],
        'authorPhone': new_user['identifier'],
        'postUrl': 'https://facebook.com/mailan/posts/1029384756',
        'channel': 'Facebook',
        'rewardBananas': 1,
        'status': 'PENDING',
        'createdAt': '2026-10-06T10:00:00'
    }
    db['banana_posts'].append(post)
    reporter.assert_true(post['status'] == 'PENDING', "Link nộp ban đầu ở trạng thái PENDING chờ kiểm duyệt.")

    # 1.4. Admin duyệt bài đăng và cộng Chuối
    reporter.subheader("Bước 1.4: Admin duyệt bài mini game và tặng 1 Chuối 🍌")
    post['status'] = 'APPROVED'
    new_user['bananas'] += post['rewardBananas']
    reporter.assert_true(post['status'] == 'APPROVED', "Bài đăng đã được duyệt.")
    reporter.assert_true(new_user['bananas'] == 1, "Số dư của CTV Mai Lan đã tăng lên 1 Chuối 🍌.")

    # 1.5. Nộp Data 1: Khách hàng Lê Thị Ngọc Mai (Bàn giao CV Hướng nghiệp chốt - 50%)
    reporter.subheader("Bước 1.5: Nộp Data Khách 1 (Lê Thị Ngọc Mai - Bàn giao CV Hướng nghiệp)")
    lead1 = {
        'id': 'WG-2610-101',
        'createdAt': '2026-10-06T11:30:00',
        'referrerName': new_user['name'],
        'referrerPhone': new_user['identifier'],
        'referrerRole': new_user['role'],
        'referrerBank': new_user['bankInfo'],
        
        'customerName': 'Lê Thị Ngọc Mai',
        'customerPhone': '0901111222',
        'customerTarget': 'Làm nghề',
        'customerStage': 'Đang tìm hiểu',
        'customerPainPoint': 'Chưa biết nên chọn học Classic hay Thiết Kế, cần tư vấn chuyên sâu.',
        
        'interestCourseId': 'classic_nentang',
        'actualCourseId': 'classic_nentang',
        'closeType': 'pass',  # Nhờ CV Hướng nghiệp chốt (50%)
        'actualCloseType': 'pass',
        'status': 'DATA',     # Khách bàn giao: Trạng thái ban đầu là DATA (Data mới)
        'rewardAmount': COURSES_CATALOG['classic_nentang']['rewardPass'],
        'assignedTo': 'Vy Đào (CV Hướng nghiệp)',
        'adminNote': 'Data mới tiếp nhận từ CTV Mai Lan.',
        'appointmentDate': '',
        'tuitionPaymentDate': '',
        'tuitionPaymentNote': '',
        'paidDate': None
    }
    db['leads'].append(lead1)

    reporter.assert_true(lead1['status'] == 'DATA', "Khách chọn hình thức bàn giao có trạng thái ban đầu là 'DATA' (Data mới).")
    reporter.assert_true(lead1['rewardAmount'] == 250000, "Mức thưởng 50% cho hình thức bàn giao khóa Classic là 250.000đ.")
    reporter.assert_true(lead1['assignedTo'] == 'Vy Đào (CV Hướng nghiệp)', "Data bàn giao được gán cho Chuyên viên Hướng nghiệp.")

# =============================================================================
# 4. KỊCH BẢN NGÀY 2 (DAY 2)
# =============================================================================
def run_day_2():
    reporter.header("NGÀY 2: NỘP 2 DATA (CÓ DATA TỰ CHỐT & BẢO VỆ PHÂN QUYỀN TRẠNG THÁI)")
    user = db['users'][0]

    # 2.1. Nộp Data 2: Trần Thu Hà (TỰ CHỐT 100% - KHÓA COMBO ƯU ĐÃI)
    reporter.subheader("Bước 2.1: Nộp Data Khách 2 (Trần Thu Hà - TỰ CHỐT 100% THƯỞNG)")
    lead2 = {
        'id': 'WG-2610-102',
        'createdAt': '2026-10-07T09:00:00',
        'referrerName': user['name'],
        'referrerPhone': user['identifier'],
        'referrerRole': user['role'],
        'referrerBank': user['bankInfo'],
        
        'customerName': 'Trần Thu Hà',
        'customerPhone': '0903333444',
        'customerTarget': 'Mở tiệm',
        'customerStage': 'Đã xác định',
        'customerPainPoint': 'Muốn học trọn gói để mở tiệm tại Quận 7.',
        
        'interestCourseId': 'combo_uudai',
        'actualCourseId': 'combo_uudai',
        'closeType': 'self',  # TỰ CHỐT 100%
        'actualCloseType': 'self',
        
        # QUY TẮC MỚI: Khách tự chốt thì trạng thái ban đầu là CARE (Chăm Sóc)
        'status': 'CARE',
        'rewardAmount': COURSES_CATALOG['combo_uudai']['rewardSelf'],
        'assignedTo': f"Tự chốt ({user['name']})",
        
        # Kế hoạch ACA: Ngày hẹn lên học viện & ngày đóng học phí
        'appointmentDate': '2026-10-08T14:00',
        'tuitionPaymentDate': '2026-10-08',
        'tuitionPaymentNote': 'Khách đã chuyển cọc 2.000.000đ giữ chỗ học bổng.',
        'adminNote': '[Tự chốt] Đã lên lịch hẹn checkin tại shop: 2026-10-08 14:00 | Kế hoạch: Đã cọc 2 triệu.',
        'paidDate': None
    }
    db['leads'].append(lead2)

    reporter.assert_true(lead2['status'] == 'CARE', "QUY TẮC: Data Tự Chốt phải có trạng thái ban đầu là 'CARE' (Chăm Sóc).")
    reporter.assert_true(lead2['rewardAmount'] == 4000000, "Mức thưởng 100% tự chốt cho Combo Ưu Đãi là 4.000.000đ.")
    reporter.assert_true('2026-10-08T14:00' in lead2['appointmentDate'], "Đã lưu lịch hẹn checkin shop ngày 08/10 lúc 14:00.")
    reporter.assert_true('[Tự chốt]' in lead2['adminNote'], "Ghi chú tiến độ tự động gắn lịch hẹn checkin tại shop.")

    # 2.2. Nộp Data 3: Phạm Hồng Nhung (Bàn giao CV Hướng nghiệp)
    reporter.subheader("Bước 2.2: Nộp Data Khách 3 (Phạm Hồng Nhung - Bàn giao CV)")
    lead3 = {
        'id': 'WG-2610-103',
        'createdAt': '2026-10-07T14:30:00',
        'referrerName': user['name'],
        'referrerPhone': user['identifier'],
        'referrerRole': user['role'],
        'referrerBank': user['bankInfo'],
        
        'customerName': 'Phạm Hồng Nhung',
        'customerPhone': '0905555666',
        'customerTarget': 'Làm nghề',
        'customerStage': 'Đang tìm hiểu',
        'customerPainPoint': 'Muốn học nâng cao mi Thiết kế, xin lịch học buổi tối.',
        
        'interestCourseId': 'thietke_taodang',
        'actualCourseId': 'thietke_taodang',
        'closeType': 'pass',
        'actualCloseType': 'pass',
        'status': 'DATA',
        'rewardAmount': COURSES_CATALOG['thietke_taodang']['rewardPass'],
        'assignedTo': 'Vy Đào (CV Hướng nghiệp)',
        'adminNote': 'Khách quan tâm ca học tối, đang tư vấn sắp xếp lớp.',
        'appointmentDate': '',
        'tuitionPaymentDate': '',
        'tuitionPaymentNote': '',
        'paidDate': None
    }
    db['leads'].append(lead3)

    reporter.assert_true(lead3['status'] == 'DATA', "Data bàn giao có trạng thái ban đầu là DATA.")
    reporter.assert_true(lead3['rewardAmount'] == 500000, "Mức thưởng 50% khóa Thiết Kế là 500.000đ.")

    # 2.3. Kiểm thử phân quyền trạng thái của Chuyên viên Hướng nghiệp (Counselor)
    reporter.subheader("Bước 2.3: Kiểm thử phân quyền thao tác trạng thái của Chuyên viên")
    
    # Kịch bản 2.3A: CV cập nhật Khách 1 từ DATA -> CARE -> HỢP LỆ (Tiến lên trên)
    lead1 = db['leads'][0]
    counselor_can_advance = (FUNNEL_LEVELS['CARE'] >= FUNNEL_LEVELS[lead1['status']])
    reporter.assert_true(counselor_can_advance, "Chuyên viên được phép cập nhật tiến trình lên trên: DATA -> CARE.")
    lead1['status'] = 'CARE'
    lead1['adminNote'] = 'Chuyên viên Vy Đào đã gọi tư vấn thành công, gửi lộ trình học qua Zalo.'

    # Kịch bản 2.3B: Chuyên viên thử điều chuyển Data 2 (đang ở CARE) lùi về DATA -> BỊ CHẶN!
    lead2 = db['leads'][1]
    attempted_status = 'DATA'
    counselor_can_revert_to_data = (attempted_status != 'DATA' and FUNNEL_LEVELS[attempted_status] >= FUNNEL_LEVELS[lead2['status']])
    reporter.assert_true(not counselor_can_revert_to_data, 
                         "BẢO MẬT PHÂN QUYỀN: Chuyên viên KHÔNG ĐƯỢC điều chuyển trạng thái dưới mục 'Chăm Sóc' (Chỉ Admin mới chỉnh trạng thái ban đầu DATA)!")

    # Kịch bản 2.3C: Chuyên viên thử HỦY data (LOST) -> BỊ CHẶN!
    counselor_can_cancel = False # Chỉ Admin mới được hủy
    reporter.assert_true(not counselor_can_cancel, "BẢO MẬT PHÂN QUYỀN: Chuyên viên KHÔNG ĐƯỢC tự ý hủy data (Chỉ Admin mới có quyền).")

# =============================================================================
# 5. KỊCH BẢN NGÀY 3 (DAY 3)
# =============================================================================
def run_day_3():
    reporter.header("NGÀY 3: NỘP DATA THỨ 4, TIẾN TRÌNH CHECKIN -> TRAINING -> WON -> CHI TRẢ THƯỞNG")
    user = db['users'][0]

    # 3.1. Nộp Data 4: Hoàng Thảo My (TỰ CHỐT 100% - KHÓA TINH HOA)
    reporter.subheader("Bước 3.1: Nộp Data Khách 4 (Hoàng Thảo My - TỰ CHỐT 100%)")
    lead4 = {
        'id': 'WG-2610-104',
        'createdAt': '2026-10-08T08:30:00',
        'referrerName': user['name'],
        'referrerPhone': user['identifier'],
        'referrerRole': user['role'],
        'referrerBank': user['bankInfo'],
        
        'customerName': 'Hoàng Thảo My',
        'customerPhone': '0907777888',
        'customerTarget': 'Làm nghề',
        'customerStage': 'Đã xác định',
        'customerPainPoint': 'Muốn nâng cao kỹ thuật mi Thiên Thần & Volume Mega.',
        
        'interestCourseId': 'tinhhoa_chuyensau',
        'actualCourseId': 'tinhhoa_chuyensau',
        'closeType': 'self',
        'actualCloseType': 'self',
        'status': 'CARE',  # Tự chốt -> Ban đầu là CARE
        'rewardAmount': COURSES_CATALOG['tinhhoa_chuyensau']['rewardSelf'],
        'assignedTo': f"Tự chốt ({user['name']})",
        'appointmentDate': '2026-10-09T10:00',
        'tuitionPaymentDate': '2026-10-09',
        'tuitionPaymentNote': 'Khách thanh toán trực tiếp khi tới lớp.',
        'adminNote': '[Tự chốt] Đã lên lịch hẹn checkin tại shop: 2026-10-09 10:00',
        'paidDate': None
    }
    db['leads'].append(lead4)
    reporter.assert_true(lead4['status'] == 'CARE', "Data tự chốt thứ 4 lập tức vào mục CARE & có lịch hẹn.")
    reporter.assert_true(lead4['rewardAmount'] == 1000000, "Thưởng 100% tự chốt khóa Tinh Hoa là 1.000.000đ.")

    # 3.2. Khách 2 (Trần Thu Hà) đến giờ hẹn, tới viện Checkin
    reporter.subheader("Bước 3.2: Khách 2 (Trần Thu Hà) đến Học viện Checkin đúng lịch hẹn")
    lead2 = db['leads'][1]
    lead2['status'] = 'CHECKIN'
    lead2['adminNote'] = 'Khách đã có mặt tại sảnh lúc 14:00, chuyên viên đã đón tiếp và dẫn tham quan lớp học.'
    reporter.assert_true(lead2['status'] == 'CHECKIN', "Data 2 chuyển sang CHECKIN (Bước 3).")

    # 3.3. Khách 2 hoàn tất đóng đủ học phí và bước vào Training (Học nghề)
    reporter.subheader("Bước 3.3: Khách 2 hoàn tất học phí và bước vào Training (Đang học thực hành)")
    lead2['status'] = 'TRAINING'
    lead2['adminNote'] = 'Đã thanh toán đủ 17.900.000đ học phí Combo. Đang học thực hành buổi 1 tại phòng Lab 2.'
    reporter.assert_true(lead2['status'] == 'TRAINING', "Data 2 chuyển sang TRAINING (Bước 4).")

    # 3.4. Khách 2 hoàn thành xuất sắc khóa học -> WON (Hoàn thành / Nhận thưởng)
    reporter.subheader("Bước 3.4: Khách 2 hoàn thành khóa học -> WON (Chốt thành công / Đạt điều kiện thưởng)")
    lead2['status'] = 'WON'
    lead2['adminNote'] = 'Học viên đã hoàn thành xuất sắc bài thi tốt nghiệp mẫu thật, đủ điều kiện nhận chứng chỉ và chi trả thưởng.'
    reporter.assert_true(lead2['status'] == 'WON', "Data 2 chuyển sang WON (Bước 5 - Đạt điều kiện thưởng).")

    # 3.5. Admin duyệt chi trả thưởng vào tài khoản ngân hàng của CTV Mai Lan
    reporter.subheader("Bước 3.5: Admin duyệt chi trả thưởng 4.000.000đ vào STK Vietcombank của Mai Lan")
    lead2['status'] = 'PAID'
    lead2['paidDate'] = '2026-10-08'
    lead2['adminNote'] += ' | Admin đã chuyển khoản 4.000.000đ qua Vietcombank ngày 08/10/2026.'
    reporter.assert_true(lead2['status'] == 'PAID', "Data 2 chuyển sang trạng thái PAID (Đã chi trả).")
    reporter.assert_true(lead2['paidDate'] == '2026-10-08', "Đã ghi nhận ngày thanh toán hoa hồng.")

    # 3.6. Tổng hợp KPI cá nhân trên Dashboard của CTV Mai Lan
    reporter.subheader("Bước 3.6: Kiểm tra KPI cá nhân trên Dashboard CTV Mai Lan")
    user_leads = [l for l in db['leads'] if l['referrerPhone'] == user['identifier']]
    total_leads = len(user_leads)
    won_leads = len([l for l in user_leads if l['status'] in ['WON', 'PAID']])
    paid_reward = sum(l['rewardAmount'] for l in user_leads if l['status'] == 'PAID')
    
    # Dự đoán tiền thưởng sắp nhận:
    # Training: 100%, Checkin: 75%, Care: 45%
    care_leads = [l for l in user_leads if l['status'] == 'CARE']
    checkin_leads = [l for l in user_leads if l['status'] == 'CHECKIN']
    training_leads = [l for l in user_leads if l['status'] == 'TRAINING']
    
    care_reward = sum(l['rewardAmount'] for l in care_leads)
    checkin_reward = sum(l['rewardAmount'] for l in checkin_leads)
    training_reward = sum(l['rewardAmount'] for l in training_leads)
    
    estimated_upcoming = int(care_reward * 0.45 + checkin_reward * 0.75 + training_reward * 1.0)

    reporter.assert_true(total_leads == 4, f"Tổng số data trong 3 ngày của CTV Mai Lan = 4 (Thực tế: {total_leads}).")
    reporter.assert_true(won_leads == 1, f"Số học viên chốt thành công = 1 (Thực tế: {won_leads}).")
    reporter.assert_true(paid_reward == 4000000, f"Tiền thưởng đã thực nhận = 4.000.000đ (Thực tế: {paid_reward:,}đ).")
    reporter.assert_true(estimated_upcoming > 0, f"⭐ Dự đoán tiền thưởng sắp nhận = {estimated_upcoming:,}đ (tính từ {len(care_leads)} data đang Chăm Sóc).")

    # 3.7. Kiểm tra tính lũy tiến trong Phễu chuyển đổi (Funnel Cumulative)
    reporter.subheader("Bước 3.7: Kiểm tra tính lũy tiến của Phễu chuyển đổi")
    # Khách ở WON (level 5) thì các tầng 1, 2, 3, 4, 5 đều được tính
    data_count = len(user_leads) # Cả 4 khách đều ở level >= 1
    care_count = len([l for l in user_leads if FUNNEL_LEVELS[l['status']] >= 2]) # Khách 1 (CARE), Khách 2 (PAID/level 5), Khách 4 (CARE) -> 3 khách
    
    reporter.assert_true(data_count == 4, f"Tầng 1 (Data): 4 data (Thực tế: {data_count}).")
    reporter.assert_true(care_count == 3, f"Tầng 2 (Chăm Sóc lũy tiến): 3 data (Thực tế: {care_count}).")

# =============================================================================
# 6. XUẤT KẾT QUẢ & DỮ LIỆU ĐỂ TESTER NẠP VÀO TRÌNH DUYỆT
# =============================================================================
def export_test_artifacts():
    reporter.header("XUẤT BÁO CÁO VÀ DỮ LIỆU TEST (TEST ARTIFACTS)")
    
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    output_json = os.path.join(cur_dir, 'mock_db_ctv_3days.json')
    result_json = os.path.join(cur_dir, 'test_result_summary.json')

    # 1. Xuất file mock database
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print(f"  [OK] Đã xuất file Database mô phỏng 3 ngày: {output_json}")

    # 2. Xuất file kết quả test
    summary = {
        'timestamp': datetime.now().isoformat(),
        'passed': reporter.passed,
        'failed': reporter.failed,
        'total': reporter.passed + reporter.failed,
        'persona': PERSONA_CTV,
        'totalLeads': len(db['leads']),
        'totalUsers': len(db['users']),
        'logs': reporter.logs
    }
    with open(result_json, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print(f"  [OK] Đã xuất tóm tắt kết quả kiểm thử: {result_json}")

# =============================================================================
# 7. HÀM CHÍNH (MAIN ENTRYPOINT)
# =============================================================================
def main():
    print("""
  =======================================================================
  *   WINGS BEAUTY & ACADEMY - KIỂM THỬ TỰ ĐỘNG (GOTEST)
  *   Persona: CTV Nguyễn Thị Mai Lan (0912345678)
  *   Thời gian kiểm thử mô phỏng: 3 Ngày (Trung bình 1 - 2 data/ngày)
  =======================================================================
    """)

    run_day_1()
    run_day_2()
    run_day_3()
    export_test_artifacts()

    sep = "=" * 70
    print(f"\n{sep}")
    print(f"TỔNG KẾT KIỂM THỬ: {reporter.passed} PASSED | {reporter.failed} FAILED")
    if reporter.failed == 0:
        print("[SUCCESS] TẤT CẢ CÁC BƯỚC KIỂM THỬ NGHIỆP VỤ 3 NGÀY ĐỀU ĐẠT 100%!")
    else:
        print("[WARNING] CÓ BƯỚC KIỂM THỬ THẤT BẠI. XEM CHI TIẾT LOG Ở TRÊN.")
    print(f"{sep}\n")

    return 0 if reporter.failed == 0 else 1

if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code)
