# Bộ bàn giao cho agent — Wings Staff Portal

**Đã chốt:** frontend lưu Git, dùng Vercel người dùng đã setup; chỉ push để tự build/deploy. Backend PHP/MySQL ở Wings, API domain `https://api.wingslashes.com` qua Cloudflare. Không tự cấu hình lại Vercel hoặc DNS.

Đọc theo thứ tự:

1. [Prompt giao agent](AGENT_HANDOFF.md)
2. [Rule bắt buộc](AGENTS.md)
3. [Thiết kế database, auth và API](HUONG_DAN.md)
4. [Quy trình version/build/push/deploy](BUILD_VERSION_DEPLOY.md)
5. [SQL core mẫu](001_wings_portal_core.sql)
6. [Release kit](release-kit/): scripts và package fragment để tích hợp vào app mới.

Kiểm tra bộ kit: cú pháp toàn bộ script Node và JSON hợp lệ; thử build metadata/manifest, bump package+lockfile và chặn release build khi Git chưa sạch bằng repository tạm đã qua. Đây là kiểm tra tooling bằng fixture, chưa phải kiểm thử website thực tế.

Chưa chạy SQL, kết nối hoặc thay đổi Vercel/Cloudflare/Wings, push Git hay deploy. Không kèm mật khẩu hoặc token. Các đường dẫn source tuyệt đối trong tài liệu gốc là tham chiếu máy hiện tại, cần đổi sang checkout tương ứng nếu agent chạy ở máy khác.

Chức năng nghiệp vụ và repo/branch thực tế sẽ được điền hoặc xác minh khi agent nhận việc.
