# Gửi file này cho agent triển khai

Các file đi kèm là specification và release kit, chưa phải ứng dụng đã được build hoặc deploy.

## Prompt có thể gửi nguyên văn

> Hãy xây website nội bộ Wings Staff Portal theo `HUONG_DAN.md`, tuân thủ `AGENTS.md`, và tích hợp release kit theo `BUILD_VERSION_DEPLOY.md`. Vercel người dùng đã setup riêng: giữ nguyên project/domain/settings/env, không tự cấu hình lại. Frontend lưu trên Git và dùng domain Vercel: **chỉ commit/push để Vercel tự build/deploy, không chạy thêm CLI deploy**. Backend PHP Phalcon và MySQL management vẫn ở Wings, production API `https://api.wingslashes.com/1/staff-portal`, đi qua Cloudflare đang proxy domain này. Frontend gọi API bằng Vercel rewrite cùng origin; giữ DNS API, không hardcode IP. Dùng tài khoản nhân viên Wings, xác minh OTP ở backend, quyền role/chi nhánh, người mới chờ duyệt. Chức năng nghiệp vụ cần làm: **[điền chức năng]**. Git repo/Vercel project/branch production: **[điền hoặc xác minh từ project đã kết nối]**. Phạm vi được giao: **[local / staging / production]**. Hoàn thiện code và kiểm thử; backend/migration cần làm trước frontend phụ thuộc vào chúng. Bump version trước commit/push, chờ Vercel Ready rồi đối chiếu commit, version, API và browser login/logout. Báo kết quả và cách rollback; không hỏi lại những quyết định đã được xác nhận và không coi Vercel Ready là bằng chứng backend/auth đã hoàn thành.

## Thứ tự đọc và sử dụng

1. `AGENTS.md`: các rule bắt buộc khi xây app và phát hành.
2. `HUONG_DAN.md`: kiến trúc, database, auth, API, role/store và nghiệm thu.
3. `001_wings_portal_core.sql`: schema đề xuất, kiểm tra trên staging trước.
4. `BUILD_VERSION_DEPLOY.md`: quy trình từ version đến live/rollback.
5. `release-kit/`: script và mẫu tích hợp source vào repo frontend.

Khi chuyển bộ tài liệu sang máy khác, các link source tuyệt đối trong tài liệu gốc cần được đổi sang checkout tương ứng. Nội dung và code mẫu vẫn đọc độc lập được. Bộ kit không chứa thông tin đăng nhập server.
