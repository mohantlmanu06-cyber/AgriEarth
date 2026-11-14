@echo off
echo ========================================================
echo        Starting Field Shift Platform
echo ========================================================
echo.
echo Starting Django Backend on port 8000...
start "Field Shift Backend (Django)" cmd /k "cd /d %~dp0backend && python manage.py runserver 127.0.0.1:8000"

echo.
echo Starting Vite Frontend on port 5173...
start "Field Shift Frontend (Vite React)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo   Field Shift is launching!
echo   Frontend: http://localhost:5173
echo   Backend:  http://127.0.0.1:8000/api/
echo ========================================================
timeout /t 3 >nul
start http://localhost:5173
