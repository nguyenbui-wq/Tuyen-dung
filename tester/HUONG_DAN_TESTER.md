# HƯỚNG DẪN TESTER - DỰ ÁN WINGS TUYỂN DỤNG & CỘNG TÁC VIÊN

Tài liệu này cung cấp đầy đủ thông tin dành cho Tester để kiểm thử hệ thống với lệnh khởi động nhanh `gotest`.

---

## 1. Cách khởi động kiểm thử bằng lệnh `gotest`

Tại thư mục dự án (`d:\Desktop\Wingslashes\Tuyen Dung`), bạn có thể khởi động kiểm thử theo bất kỳ cách nào dưới đây:

### Cách 1: Chạy trực tiếp từ Terminal (CMD / PowerShell)
```bash
gotest
```
*(Hoặc trên PowerShell: `.\gotest` hoặc `.\gotest.bat`)*

### Cách 2: Nhấp đúp chuột vào file
Nhấp đúp chuột vào file **`gotest.bat`** tại thư mục gốc của dự án.

> **Kết quả:**
> 1. Terminal tự động chạy kịch bản kiểm thử mô phỏng 3 ngày và in bảng kết quả 32/32 tests PASSED.
> 2. Trình duyệt tự động mở trang giao diện trực quan **Tester Center** tại:
>    👉 `http://localhost:8080/tester/index.html`

---

## 2. Kịch bản kiểm thử chi tiết: Đóng vai CTV Nguyễn Thị Mai Lan (3 Ngày)

### 👤 Thông tin Persona Cộng Tác Viên (CTV):
* **Họ tên:** Nguyễn Thị Mai Lan
* **Số điện thoại (ID đăng nhập):** `0912345678`
* **Mật khẩu:** `123456`
* **Vai trò:** Cộng tác viên tuyển sinh (`collaborator`)
* **Tài khoản ngân hàng:** Vietcombank - 0071009988776 - Nguyen Thi Mai Lan

---

### 📅 Kế hoạch 3 Ngày (Mỗi ngày trung bình 1 - 2 data):

#### Ngày 1 (06/10/2026): Đăng ký CTV, nhận chuối & nộp data đầu tiên
1. **Đăng ký CTV:** Mai Lan đăng ký tài khoản mới $\rightarrow$ Hệ thống ghi nhận trạng thái `PENDING` (Chờ duyệt).
2. **Duyệt CTV:** Admin duyệt tài khoản $\rightarrow$ Chuyển thành `APPROVED` (Kích hoạt phiên làm việc).
3. **Mini Game nhận chuối 🍌:** Mai Lan nộp link bài đăng Facebook giới thiệu khóa học $\rightarrow$ Admin duyệt bài, Mai Lan nhận **1 🍌 Chuối**.
4. **Nộp Data Khách 1 (Lê Thị Ngọc Mai):**
   * SĐT: `0901111222` | Khóa học: *Khóa Nền Tảng Uốn Mi & Classic*
   * Hình thức: **"Bàn giao CV Hướng nghiệp chốt (50%)"**
   * **Kiểm tra trạng thái ban đầu:** Hệ thống tự gán là **`DATA` (Data mới - Level 1)**.
   * **Kiểm tra mức thưởng:** **250.000đ** (50% cho CV chốt).

---

#### Ngày 2 (07/10/2026): Nộp 2 data (Có Data Tự Chốt) & Kiểm tra Phân quyền
1. **Nộp Data Khách 2 (Trần Thu Hà) - TỰ CHỐT 100%:**
   * SĐT: `0903333444` | Khóa học: *Combo 4 Khóa – Ưu Đãi (19,9M)*
   * Hình thức: **"Tự chốt (100% Thưởng)"**
   * Lịch hẹn checkin shop: Ngày 08/10 lúc 14:00 (Đã cọc 2 triệu giữ chỗ).
   * **Kiểm tra trạng thái ban đầu:** 
     ⭐ Hệ thống tự động đưa vào mục **`CARE` (Chăm Sóc - Level 2)** (thay vì `DATA`) và tự sinh ghi chú lịch hẹn checkin shop!
   * **Kiểm tra mức thưởng:** **4.000.000đ** (100% tự chốt).
2. **Nộp Data Khách 3 (Phạm Hồng Nhung) - Bàn giao:**
   * SĐT: `0905555666` | Khóa học: *Khóa Tạo Dáng Mi Thiết Kế*
   * Hình thức: Bàn giao CV Hướng nghiệp $\rightarrow$ Trạng thái ban đầu = **`DATA`**. Thưởng: **500.000đ**.
3. **Kiểm tra phân quyền Chuyên viên Hướng nghiệp:**
   * ✅ Chuyên viên cập nhật Data 1 (Lê Thị Ngọc Mai) từ `DATA` $\rightarrow$ `CARE` (Tiến lên trên) $\rightarrow$ **Hợp lệ (Pass)**.
   * ❌ Chuyên viên thử điều chuyển Data 2 (Trần Thu Hà) lùi về `DATA` $\rightarrow$ **Bị chặn và cảnh báo** (Chỉ Admin mới có quyền chỉnh trạng thái ban đầu).
   * ❌ Chuyên viên thử hủy data (`LOST`) $\rightarrow$ **Bị chặn** (Chỉ Admin mới có quyền).

---

#### Ngày 3 (08/10/2026): Nộp Data thứ 4, hoàn thành lộ trình & Chi trả thưởng
1. **Nộp Data Khách 4 (Hoàng Thảo My) - TỰ CHỐT 100%:**
   * SĐT: `0907777888` | Khóa học: *Khóa Tinh Hoa Chuyên Sâu*
   * Hình thức: Tự chốt $\rightarrow$ Trạng thái ban đầu = **`CARE` (Chăm Sóc)**. Thưởng: **1.000.000đ**.
2. **Tiến trình Data 2 (Trần Thu Hà) hoàn tất:**
   * Khách đến shop checkin đúng lịch $\rightarrow$ Nâng lên **`CHECKIN`** (Level 3).
   * Khách đóng đủ học phí, vào lớp học $\rightarrow$ Nâng lên **`TRAINING`** (Level 4).
   * Khách thi đỗ mẫu thật xuất sắc $\rightarrow$ Nâng lên **`WON`** (Level 5 - Hoàn thành / Nhận thưởng).
   * Admin duyệt chi trả thưởng qua Vietcombank $\rightarrow$ Nâng lên **`PAID`** (Đã chi trả).
3. **Kiểm tra kết quả KPI Dashboard cá nhân của CTV Mai Lan:**
   * **Tổng Data:** 4 data.
   * **Chốt thành công:** 1 học viên (Trần Thu Hà).
   * **Tiền thưởng đã nhận:** 4.000.000đ.
   * **⭐ Dự đoán tiền thưởng sắp nhận:** 562.500đ (ước tính từ 2 data đang Chăm Sóc).
   * **Phễu chuyển đổi lũy tiến:** Data (4) $\rightarrow$ Chăm Sóc (3) $\rightarrow$ Checkin (1) $\rightarrow$ Training (1) $\rightarrow$ Won (1).

---

## 3. Kiểm thử trên Giao diện Web (Interactive Web Testing)

1. Mở trang Tester Center: `http://localhost:8080/tester/index.html`
2. Nhấn nút **"🚀 Nạp Dữ Liệu Vào Web Chính"**:
   * Dữ liệu mô phỏng của CTV Mai Lan và 4 data sẽ được ghi vào `localStorage` của trình duyệt.
   * Phiên đăng nhập sẽ tự động chuyển sang tài khoản của Mai Lan.
3. Chuyển sang Web chính (`http://localhost:8080/index.html`):
   * Bạn sẽ thấy ngay **Dashboard cá nhân của Mai Lan** hiển thị đầy đủ 4 thẻ KPI, thanh Stepper 5 bước cho từng data, và mục thông báo tiến độ.
4. Chuyển sang trang Quản trị (`http://localhost:8080/admin.html`):
   * Đăng nhập Admin (PIN `12345678`) hoặc Counselor (SĐT `0908888999` / Pass `123456`).
   * Kiểm tra bảng danh sách Data tuyển sinh, bảng xếp hạng và các nút điều chuyển trạng thái.
