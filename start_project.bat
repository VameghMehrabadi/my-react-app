@echo off
echo در حال اجرای پروژه React (Vite) ...
cd /d %~dp0

start cmd /k "npm run dev"


timeout /t 5 /nobreak >nul


start http://localhost:5173

pause
