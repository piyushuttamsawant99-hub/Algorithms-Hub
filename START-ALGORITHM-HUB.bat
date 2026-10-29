@echo off
setlocal
cd /d "%~dp0"

echo ================================================
echo             ALGORITHM HUB - START
echo ================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or is not on PATH.
  echo Install the Node.js LTS version from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm is not available. Reinstall Node.js LTS.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Installing frontend dependencies. This needs internet access on first run...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo ERROR: Frontend dependency installation failed.
    pause
    exit /b 1
  )
)

if not exist "backend\node_modules\express\index.js" (
  echo Installing backend dependencies. This needs internet access on first run...
  pushd backend
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    popd
    echo ERROR: Backend dependency installation failed.
    pause
    exit /b 1
  )
  popd
)

start "Algorithm Hub Backend" cmd /k "cd /d ""%~dp0backend"" && npm run dev"
timeout /t 2 /nobreak >nul
start "Algorithm Hub Frontend" cmd /k "cd /d ""%~dp0"" && npm run dev"
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"
echo.
echo Algorithm Hub has been started in separate terminal windows.
echo Keep both windows open while using the site.
echo If a browser does not open automatically, visit http://localhost:3000
pause
