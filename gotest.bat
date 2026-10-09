@echo off
title Wings Academy - Test Runner (gotest)
cd /d "%~dp0"

echo ====================================================================
echo           WINGS BEAUTY AND ACADEMY - KIEM THU TU DONG (GOTEST)
echo ====================================================================
echo.
echo Dang khoi chay kich ban kiem thu 3 ngay cua CTV Nguyen Thi Mai Lan...
echo.

python tester\simulation_ctv_3days.py

echo.
echo ====================================================================
echo Dang mo giao dien Tester Web Center tren trinh duyet...
echo URL: http://localhost:8080/tester/index.html
echo ====================================================================

start http://localhost:8080/tester/index.html
