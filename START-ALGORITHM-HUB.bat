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

call npm ls --depth=0 >nul 2>nul
if errorlevel 1 goto install_frontend
node -e "import('vite').then(() => {}).catch(error => { console.error(error); process.exitCode = 1; })" >nul 2>nul
if errorlevel 1 goto install_frontend
goto frontend_ready

:install_frontend
echo Installing or repairing frontend dependencies from package-lock.json...
call npm ci --no-audit --no-fund
if errorlevel 1 goto frontend_install_failed
call npm ls --depth=0
if errorlevel 1 goto frontend_verify_failed
node -e "import('vite').then(() => {}).catch(error => { console.error(error); process.exitCode = 1; })"
if errorlevel 1 goto frontend_verify_failed

:frontend_ready
pushd backend
call npm ls --depth=0 >nul 2>nul
if errorlevel 1 goto install_backend
node -e "const sqlite3=require('sqlite3'); const db=new sqlite3.Database(':memory:', error=>{if(error){console.error(error);process.exitCode=1;return;} db.close(closeError=>{if(closeError){console.error(closeError);process.exitCode=1;}});});" >nul 2>nul
if errorlevel 1 goto install_backend
goto backend_ready

:install_backend
echo Installing or repairing backend dependencies from backend\package-lock.json...
call npm ci --no-audit --no-fund
if errorlevel 1 goto backend_install_failed
call npm ls --depth=0
if errorlevel 1 goto backend_verify_failed
node -e "const sqlite3=require('sqlite3'); const db=new sqlite3.Database(':memory:', error=>{if(error){console.error(error);process.exitCode=1;return;} db.close(closeError=>{if(closeError){console.error(closeError);process.exitCode=1;}});});"
if errorlevel 1 goto backend_verify_failed

:backend_ready
popd

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
exit /b 0

:frontend_install_failed
echo ERROR: Frontend dependency installation failed. Check the npm output and network access, then run "npm ci" in the project folder.
pause
exit /b 1

:frontend_verify_failed
echo ERROR: Frontend dependencies are still incomplete after installation. Check the npm output and package-lock.json.
pause
exit /b 1

:backend_install_failed
popd
echo ERROR: Backend dependency installation failed. Check the npm output, network access, and any native build-tool requirements.
pause
exit /b 1

:backend_verify_failed
popd
echo ERROR: Backend dependencies are still incomplete or SQLite failed its native load check after installation. Check the npm output and package-lock.json.
pause
exit /b 1
