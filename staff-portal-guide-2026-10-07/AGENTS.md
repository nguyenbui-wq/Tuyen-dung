# Rules cho agent xây Wings Staff Portal

Đọc `HUONG_DAN.md`, `BUILD_VERSION_DEPLOY.md` và yêu cầu mới nhất của người dùng trước khi làm. Bộ này là bàn giao cho một website mới; tên mặc định `wings-staff-portal`. Khi đưa vào repo mới, copy file này vào root và copy các tài liệu vào vị trí các link được cập nhật tương ứng.

## Phạm vi và source

1. Xem `git status` trước khi sửa; giữ nguyên thay đổi ngoài công việc đang làm. Workspace WingsOBS chứa nhiều repo, không mặc định toàn thư mục là một repo.
2. Frontend ở repo `wings-staff-portal`; backend module ở repo Wings được chọn làm source chuẩn. Ghi commit của cả hai trong biên bản release.
3. Frontend lưu trên Git và deploy Vercel, dùng domain của Vercel; React/Vite chạy tại `/`. Backend PHP Phalcon và DB `management` vẫn ở Wings. API production là `https://api.wingslashes.com/1/staff-portal`. Không đưa frontend lên server Wings hoặc chuyển backend/database sang Vercel.
4. Không copy toàn bộ Ctrl/Checkout. Tái sử dụng pattern API/DB; chỉ mang dependency và logic cần cho nghiệp vụ.
5. `wings-ctrl/wingsctrl.php` và bản trong `wings-dashboard` có thể khác nhau. Khi sửa backend chung, so sánh bản đang chạy với đúng source trước khi tạo patch.
6. Không lấy mật khẩu/token từ tài liệu cũ đưa vào code, báo cáo hoặc prompt. Dùng cấu hình server/SSH alias và secret storage hiện có.
7. Chủ động hoàn thành phần việc đã được giao. File rules không tạo thêm bước xin phép. Nếu người dùng đã giao cả deploy và xác định môi trường thì tiến hành trong phạm vi đó; nếu chỉ giao viết tài liệu thì chuẩn bị artifact, không tự triển khai live. Chỉ hỏi khi thiếu quyết định thực sự ảnh hưởng nghiệp vụ hoặc đích triển khai chưa xác định.

## Database và authentication

8. Dùng `user.id` của Wings làm danh tính gốc. Không nhầm với `wingsctrl_users.id`. Quyền website mới ở `wings_portal_*`.
9. Backend tự xác minh OTP/danh tính; không tin phone, user object, role, `is_approved`, `modify_staff_id` hoặc actor do browser gửi.
10. Người mới là viewer/pending, chưa có store. Owner duyệt theo business. Không có auto-owner, mock login, PIN bypass hoặc tài khoản mặc định trong production.
11. Mọi API dữ liệu kiểm tra session, nhân viên còn hoạt động, trạng thái portal, permission, business, store và tài nguyên. Danh sách store rỗng nghĩa là không có quyền.
12. Session dùng cookie HttpOnly/Secure và có expiry/revoke. Request ghi phải qua CSRF/Origin check. Reload gọi `/auth/me`; localStorage không quyết định quyền.
13. Mỗi thay đổi schema có migration đánh số, checksum và lịch sử đã chạy; thử local/staging trước. Runtime không tạo/alter bảng qua HTTP.
14. Ghi SQL bằng bind parameters. Ghi nghiệp vụ và audit trong transaction. Không log OTP, PIN, cookie, raw token hoặc request auth đầy đủ.
15. Không tự sửa bảng/quyền dùng chung của Ctrl/Checkout để app mới chạy. Migration mới additive; thay đổi phá vỡ tương thích cần kế hoạch chuyển đổi riêng.

## API và frontend

16. Browser gọi same-origin `/api/1/staff-portal`; Vercel rewrite sang `https://api.wingslashes.com/1/staff-portal`. Giữ domain API trong cấu hình server `WINGS_API_UPSTREAM`. Không hardcode IP origin hoặc gọi DB từ Vercel/browser. Không đưa secret vào `VITE_*`.
17. Dùng wrapper `status/code/message/data` nhất quán, HTTP status đúng. Backend trả field allowlist, không serialize toàn hồ sơ nhân viên hoặc token Wings.
18. Guard portal chạy trước phần middleware legacy có thể đổi user/business/store theo payload. Mọi route chưa phân loại phải bị từ chối.
19. UI có loading, chưa đăng nhập, pending, active và lỗi kết nối. Không dùng cached user để mở dữ liệu khi kiểm tra session thất bại.
20. Hiện version từ `package.json` qua biến build, kèm commit ngắn tại trang thông tin/cài đặt. Không gõ version riêng trong component.
21. Không tự retry POST ghi khi chưa có idempotency. PWA nếu có không cache auth/API riêng tư.

## Version, kiểm tra và release

22. `package.json.version` là nguồn version chính, `package-lock.json` phải khớp. PATCH sửa lỗi, MINOR thêm tính năng tương thích, MAJOR phá vỡ contract. App đầu tiên có thể phát hành `0.1.0` bằng version hiện tại, không cần bump giả.
23. Bump trước release build, cập nhật changelog, commit đúng file; không `git add -A` và không commit thay đổi của người khác. Không bump trong script deploy.
24. Release build yêu cầu đúng Git commit, đúng repo/app và lockfile. Local dùng Git sạch; trên Vercel dùng metadata commit của Git integration. Pin Node major tương thích Vercel và dependency trong lockfile. Build command trong source app chạy verify và build metadata; kiểm tra backend riêng trước release cần API mới. Không tự đổi build settings Vercel và không bỏ qua check để phát hành.
25. `verify` phải có kiểm thử thật về auth/role/store và luồng ghi quan trọng. Không thay bằng `echo OK`; build/lint không thay thế kiểm tra nghiệp vụ.
26. Build tạo `version.json` và manifest SHA-256. Với Git integration, Preview và Production có thể build lại từ cùng commit vì cấu hình môi trường khác; kiểm tra build Production riêng. Không so checksum giữa hai build khác môi trường rồi kết luận code sai.
27. Quy trình frontend được người dùng chốt: **commit + push Git → Vercel tự build/deploy**. Không chạy thêm `vercel deploy`, CLI build/deploy, deploy hook hoặc một CI khác để tạo deployment trùng. Lưu deployment URL/ID và bản production trước. Không SCP frontend lên Wings.
28. Kit cung cấp bump/build/check-backend/verify để ghép vào source frontend, không kèm cấu hình Vercel tự áp dụng. Backend/DB theo runbook Wings, hoàn thành trước khi frontend đi live; deploy Vercel không triển khai PHP hoặc migration.
29. Mọi lần thay backend chung: khóa deploy chung của Wings, ghi symlink/release hiện tại, so hash file nền, tạo release từ bản đang chạy, áp patch allowlist và kiểm tra lại nền trước switch. Nếu source thay đổi giữa chừng thì dừng, đồng bộ/review patch lại.
30. Sau deploy, kiểm tra version/commit/assets, API health/contract/schema, 401 khi chưa login và luồng nghiệp vụ bằng browser/tài khoản test. Chỉ báo thành công khi đã có bằng chứng.
31. Nếu kiểm tra live thất bại, trả code về bản trước nếu tương thích schema. Không rollback DB bằng xóa bảng/dữ liệu; báo rõ phần đã deploy và phần còn lỗi.
32. Báo cáo cuối: thay đổi gì, version, Git SHA frontend/backend, Vercel team/project, deployment URL/ID và environment, release backend Wings, migration đã chạy, kiểm tra đã qua/chưa chạy và cách rollback. Không gửi nội dung secret.

## Domain, proxy, cookie và môi trường

33. Ảnh người dùng cung cấp có record `api.wingslashes.com`, type A, origin `194.233.76.123`, Cloudflare Proxied. Đây là cấu hình tham chiếu từ ảnh, không phải kết quả kiểm tra live. Không sửa DNS/proxy/IP hoặc trỏ record API sang Vercel khi chỉ triển khai frontend.
34. Vercel external rewrite phải là proxy giữ nguyên URL browser, không dùng HTTP redirect sang Wings. Chỉ proxy namespace `/api/1/staff-portal`, không mở một proxy nhận URL tùy ý.
35. Cookie portal đi qua rewrite phải không có `Domain=api.wingslashes.com` hoặc `.wingslashes.com`; dùng cookie host-only, Path public `/api/1/staff-portal/`, HttpOnly, Secure, SameSite=Lax. Kiểm tra Set-Cookie/Cookie thực tế qua Vercel và Cloudflare trên browser trước nghiệm thu. Cookie của domain Wings cũ không tự trở thành phiên trên domain Vercel.
36. Backend allowlist chính xác Origin Production/Preview được phép; không dùng `*`, `*.vercel.app` hoặc chỉ kiểm tra hậu tố vercel.app. Origin/Referer không thay thế auth. Xác nhận proxy chuyển header cần thiết; nếu không đủ thì làm BFF hẹp có kiểm soát thay vì tắt kiểm tra CSRF/auth.
37. Preview dùng backend/database staging đã xác định. Nếu chưa có thì dừng các thử nghiệm OTP/ghi dữ liệu và cấu hình staging trước; không âm thầm trỏ Preview vào Production. Có thể cùng domain API nhưng namespace staging phải tách cấu hình và dữ liệu thật sự.
38. Cloudflare và Vercel không cache auth/dữ liệu riêng tư. Backend trả `Cache-Control: private, no-store`; rule CDN không được override thành cache chung. API trả JSON và status đúng, không trả HTML challenge hoặc redirect đăng nhập cho fetch.
39. Nếu có yêu cầu browser gọi trực tiếp domain API, phải đổi thiết kế có chủ đích: CORS allowlist chính xác, OPTIONS/header/credential đầy đủ; cookie cross-site có thể bị browser chặn dù SameSite=None/Secure. Không giải quyết bằng việc lưu token lâu dài trong localStorage. Mặc định dùng rewrite cùng origin.
40. Trước thao tác Vercel có tác động, xác minh team/project/commit/environment thật; không tự auto-link vào project khác. Không deploy bằng cả Git integration lẫn CLI tự động cho cùng một commit. Không dùng `--force`/Force Promote để bỏ qua kiểm tra lỗi.

41. Người dùng đã setup Vercel riêng và yêu cầu chưa cấu hình thêm: giữ nguyên project/link/domain/build settings/env/DNS. Dùng pipeline Git đã có. Chỉ đọc để xác minh; không tự áp config mẫu hoặc tạo deployment CLI. Nếu phát hiện thiếu routing/metadata cần thiết thì ghi rõ phần tích hợp cần làm, không báo đã hoạt động khi chưa kiểm tra.
