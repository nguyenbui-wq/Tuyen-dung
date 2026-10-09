# Wings Academy - PowerShell Test Runner (gotest)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "====================================================================" -ForegroundColor Yellow
Write-Host "          WINGS BEAUTY & ACADEMY - KIỂM THỬ TỰ ĐỘNG (GOTEST)" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Đang khởi chạy kịch bản kiểm thử 3 ngày của CTV Nguyễn Thị Mai Lan..." -ForegroundColor Cyan
Write-Host ""

$env:PYTHONIOENCODING = "utf-8"
python "$ScriptDir\tester\simulation_ctv_3days.py"

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Yellow
Write-Host "Đang mở giao diện Tester Web Center trên trình duyệt..." -ForegroundColor Green
Write-Host "URL: http://localhost:8080/tester/index.html" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Yellow

Start-Process "http://localhost:8080/tester/index.html"
