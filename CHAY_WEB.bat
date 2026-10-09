@echo off
title Wings Academy - Web Tuyen Dung & Sync Server
cd /d "%~dp0"

echo ====================================================================
echo           WINGS BEAUTY & ACADEMY - WEB TUYEN DUNG & SYNC
echo ====================================================================
echo.
echo Dang khoi dong Web Server ho tro dong bo Wi-Fi (iPhone, iPad, PC)...
echo - May tinh PC:     http://localhost:8080/
echo - Trang Admin:     http://localhost:8080/admin.html
echo - Dong bo Wi-Fi:   Kiem tra IP duoc in ra ben duoi
echo.
echo * Luu y: Giu cua so nay de web luon hoat dong. Khi tat cua so nay
echo   thi web tren cong 8080 se dung lai.
echo ====================================================================
echo.

start http://localhost:8080/
python server.py

pause
