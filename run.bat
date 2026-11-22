@echo off
setlocal enabledelayedexpansion

title MediTrack DSA Lab - Development Server

:: Ensure working directory is the project root
cd /d "%~dp0"

echo ===================================================
echo     MediTrack DSA Lab - Local Development Server
echo ===================================================
echo.

:: Check Node.js availability
where node >nul 2>&1
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\pnpm\bin\node.exe" (
        set "PATH=%LOCALAPPDATA%\pnpm\bin;!PATH!"
    ) else if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
        set "PATH=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;!PATH!"
    )
)

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH.
    echo Please install Node.js from https://nodejs.org/ or ensure node.exe is in your PATH.
    echo.
    pause
    exit /b 1
)

:: Check npm availability
where npm >nul 2>&1
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\pnpm\bin\npm.cmd" (
        set "PATH=%LOCALAPPDATA%\pnpm\bin;!PATH!"
    )
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not found in your system PATH.
    echo Please ensure npm is installed and added to your system PATH.
    echo.
    pause
    exit /b 1
)

:: Check whether node_modules directory exists
if not exist "node_modules\" (
    echo [ERROR] Dependencies are missing! The 'node_modules' folder was not found.
    echo.
    echo To install the required project dependencies, please run:
    echo     npm install
    echo.
    echo Note: In accordance with project policy, dependencies are not installed automatically.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detected:
node -v
echo [OK] npm detected:
call npm -v
echo [OK] Dependencies verified (node_modules present).
echo.
echo Starting Vite development server...
echo Launching default browser at http://localhost:5173/ ...
echo.

:: Automatically open browser after 2 seconds to allow Vite server to initialize
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5173/"

:: Keep the terminal open while Vite runs
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Vite server exited with code %errorlevel%.
    pause
    exit /b %errorlevel%
)

pause
