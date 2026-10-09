-- THIẾT KẾ ĐỀ XUẤT cho website nhân viên mới; chưa áp dụng vào database.
-- Đọc HUONG_DAN.md trước khi dùng. Chạy trên database local/staging trước.
-- Chọn database bằng cấu hình CLI; file không tự USE một database production.
-- Các bảng Wings gốc được tham chiếu logic; chưa tạo FK sang bảng legacy
-- vì cần kiểm tra kiểu khóa, engine và dữ liệu thực tế bằng SHOW CREATE TABLE.
-- DATETIME trong các bảng mới dùng UTC; ứng dụng hiển thị Asia/Ho_Chi_Minh.
-- Migration chạy một lần bằng tài khoản migration. Runtime không chạy DDL.

CREATE TABLE wings_portal_users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    client_business_id BIGINT UNSIGNED NOT NULL,
    wings_user_id BIGINT UNSIGNED NOT NULL,
    display_name VARCHAR(255) DEFAULT NULL,
    avatar_url TEXT,
    role ENUM('owner', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
    status ENUM('pending', 'active', 'disabled') NOT NULL DEFAULT 'pending',
    approved_by_portal_user_id BIGINT UNSIGNED DEFAULT NULL,
    approved_at DATETIME DEFAULT NULL,
    last_login_at DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_portal_business_user (client_business_id, wings_user_id),
    KEY idx_portal_status (client_business_id, status),
    KEY idx_portal_wings_user (wings_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE wings_portal_user_stores (
    portal_user_id BIGINT UNSIGNED NOT NULL,
    client_store_id BIGINT UNSIGNED NOT NULL,
    granted_by_portal_user_id BIGINT UNSIGNED DEFAULT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (portal_user_id, client_store_id),
    KEY idx_portal_store_user (client_store_id, portal_user_id),
    CONSTRAINT fk_portal_store_user FOREIGN KEY (portal_user_id)
        REFERENCES wings_portal_users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE wings_portal_sessions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    portal_user_id BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    csrf_token CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    created_at DATETIME NOT NULL,
    last_seen_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_portal_session_token (token_hash),
    KEY idx_portal_session_user (portal_user_id, revoked_at),
    KEY idx_portal_session_expiry (expires_at),
    CONSTRAINT fk_portal_session_user FOREIGN KEY (portal_user_id)
        REFERENCES wings_portal_users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE wings_portal_audit_log (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    client_business_id BIGINT UNSIGNED NOT NULL,
    actor_portal_user_id BIGINT UNSIGNED DEFAULT NULL,
    actor_wings_user_id BIGINT UNSIGNED DEFAULT NULL,
    action VARCHAR(80) NOT NULL,
    entity_type VARCHAR(80) NOT NULL,
    entity_id VARCHAR(100) DEFAULT NULL,
    request_id CHAR(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    before_json LONGTEXT,
    after_json LONGTEXT,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    KEY idx_portal_audit_actor (actor_portal_user_id, created_at),
    KEY idx_portal_audit_entity (client_business_id, entity_type, entity_id),
    KEY idx_portal_audit_time (client_business_id, created_at),
    KEY idx_portal_audit_request (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Không tự tạo owner: bootstrap một nhân viên Wings đã xác minh theo mục 9.
-- Không lưu OTP, PIN, Wings login_token hoặc raw session token vào audit log.
