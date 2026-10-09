# -*- coding: utf-8 -*-
"""
Wings Beauty & Academy - Local Multi-Device Sync Server
Chạy cổng 8080 và tự động đồng bộ dữ liệu giữa iPhone, iPad và Máy tính qua Wi-Fi
"""

import os
import sys
import json
import socket
from http.server import HTTPServer, SimpleHTTPRequestHandler

if sys.platform == 'win32':
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
DB_FILE = os.path.join(DATA_DIR, 'db.json')

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '192.168.84.41'

def seed_db_if_empty():
    os.makedirs(DATA_DIR, exist_ok=True)
    needs_seed = True
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                existing = json.load(f)
                if isinstance(existing, dict) and len(existing.get('users', [])) > 0:
                    needs_seed = False
        except Exception:
            needs_seed = True

    if needs_seed:
        seed_data = {
            "users": [
                {
                    "id": "USR-2610-ACA",
                    "name": "Vy Đào (Chuyên viên ACA)",
                    "identifier": "0908888999",
                    "password": "123456",
                    "authType": "phone",
                    "role": "🧚 Bà tiên xanh (CV Hướng nghiệp)",
                    "systemRole": "counselor",
                    "bankInfo": "Techcombank - 88889999000 - Vy Dao",
                    "status": "APPROVED",
                    "miniGameApproved": True,
                    "bananas": 10,
                    "registeredAt": "2026-10-07T08:00:00",
                    "approvedAt": "2026-10-07T08:15:00"
                },
                {
                    "id": "USR-2610-001",
                    "name": "Trần Thị Thu Thảo",
                    "identifier": "0903123456",
                    "password": "123456",
                    "authType": "phone",
                    "role": "🌱 Người gieo hạt (Học viên cũ K12)",
                    "systemRole": "collaborator",
                    "bankInfo": "MB Bank - 0903123456 - Tran Thi Thu Thao",
                    "status": "APPROVED",
                    "miniGameApproved": True,
                    "bananas": 5,
                    "registeredAt": "2026-10-07T08:00:00",
                    "approvedAt": "2026-10-07T08:30:00"
                },
                {
                    "id": "USR-2610-002",
                    "name": "Lê Hoàng Anh",
                    "identifier": "hoanganh.wings@gmail.com",
                    "password": "123456",
                    "authType": "email",
                    "role": "🌱 Người gieo hạt (Kỹ thuật viên Wings)",
                    "systemRole": "collaborator",
                    "bankInfo": "Vietcombank - 0071001234567 - Le Hoang Anh",
                    "status": "APPROVED",
                    "miniGameApproved": False,
                    "bananas": 3,
                    "registeredAt": "2026-10-07T09:00:00",
                    "approvedAt": "2026-10-07T09:15:00"
                },
                {
                    "id": "USR-2610-003",
                    "name": "Nguyễn Phương Linh",
                    "identifier": "0918999888",
                    "password": "123456",
                    "authType": "phone",
                    "role": "🌱 Người gieo hạt (Tuyển sinh)",
                    "systemRole": "collaborator",
                    "bankInfo": "Techcombank - 19033455667788 - Nguyen Phuong Linh",
                    "status": "PENDING",
                    "miniGameApproved": False,
                    "bananas": 0,
                    "registeredAt": "2026-10-07T16:00:00",
                    "approvedAt": None
                }
            ],
            "leads": [],
            "game_regs": [],
            "posts": []
        }
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(seed_data, f, ensure_ascii=False, indent=2)
        print("[INFO] Khoi tao seed data ban dau cho data/db.json thanh cong!")

class WingsSyncHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Cho phép mọi thiết bị trong mạng Wi-Fi (iPhone, Android, PC) gọi API
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_HEAD(self):
        if self.path == '/api/db' or self.path.startswith('/api/db?'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            return
        return super().do_HEAD()

    def do_GET(self):
        # Endpoint đồng bộ toàn bộ cơ sở dữ liệu
        if self.path == '/api/db' or self.path.startswith('/api/db?'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            
            if os.path.exists(DB_FILE):
                with open(DB_FILE, 'r', encoding='utf-8') as f:
                    content = f.read()
            else:
                content = '{}'
            self.wfile.write(content.encode('utf-8'))
            return

        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/db' or self.path.startswith('/api/db?'):
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode('utf-8')
            try:
                new_data = json.loads(body)
                os.makedirs(DATA_DIR, exist_ok=True)

                current_data = {}
                if os.path.exists(DB_FILE):
                    try:
                        with open(DB_FILE, 'r', encoding='utf-8') as f:
                            current_data = json.load(f)
                    except Exception:
                        current_data = {}

                # Hợp nhất thông minh dữ liệu giữa các thiết bị
                merged = dict(current_data)
                for key, val in new_data.items():
                    if isinstance(val, list):
                        # Merge list by ID
                        existing_items = {item['id']: item for item in merged.get(key, []) if isinstance(item, dict) and 'id' in item}
                        for item in val:
                            if isinstance(item, dict) and 'id' in item:
                                item_id = item['id']
                                cur_item = existing_items.get(item_id)
                                if cur_item:
                                    merged_item = dict(cur_item)
                                    merged_item.update(item)
                                    # Preserve approved status if existing was approved and new client sends pending
                                    if cur_item.get('status') in ['APPROVED', 'REJECTED'] and item.get('status') == 'PENDING':
                                        merged_item['status'] = cur_item['status']
                                        if 'approvedAt' in cur_item:
                                            merged_item['approvedAt'] = cur_item['approvedAt']
                                    # Preserve admin / counselor systemRole if existing had elevated role
                                    if cur_item.get('systemRole') in ['admin', 'counselor'] and item.get('systemRole') == 'collaborator':
                                        merged_item['systemRole'] = cur_item['systemRole']
                                        merged_item['role'] = cur_item['role']
                                    existing_items[item_id] = merged_item
                                else:
                                    existing_items[item_id] = item
                        merged[key] = list(existing_items.values())
                    elif isinstance(val, dict):
                        merged_dict = dict(merged.get(key, {}))
                        merged_dict.update(val)
                        merged[key] = merged_dict
                    else:
                        merged[key] = val

                with open(DB_FILE, 'w', encoding='utf-8') as f:
                    json.dump(merged, f, ensure_ascii=False, indent=2)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(b'{"status":"ok"}')
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
            return

        return super().do_POST()

def main():
    os.chdir(BASE_DIR)
    seed_db_if_empty()
    local_ip = get_local_ip()
    server_address = ('0.0.0.0', PORT)
    httpd = HTTPServer(server_address, WingsSyncHandler)
    print("=" * 65)
    print("  WINGS BEAUTY & ACADEMY - MULTI-DEVICE SYNC SERVER")
    print("=" * 65)
    print(f"  May tinh PC:    http://localhost:{PORT}/")
    print(f"  Dien thoai/IP:  http://{local_ip}:{PORT}/")
    print(f"  Trang Admin:    http://{local_ip}:{PORT}/admin.html")
    print(f"  Tester Center:  http://{local_ip}:{PORT}/tester/index.html")
    print("=" * 65)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Wings Sync Server...")
        httpd.server_close()

if __name__ == '__main__':
    main()
