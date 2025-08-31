@echo off
echo ========================================
echo Vue 3 + Firebase Mini-SPA Setup
echo ========================================
echo.

echo Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✓ Node.js and npm are installed
echo.

echo Installing main project dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install main dependencies
    pause
    exit /b 1
)
echo ✓ Main dependencies installed
echo.

echo Installing Firebase Functions dependencies...
cd functions
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Firebase Functions dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Firebase Functions dependencies installed
echo.

echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Update src/config.ts with your Firebase project details
echo 2. Update src/emailService.ts with your project ID
echo 3. Run 'firebase login' to authenticate
echo 4. Run 'firebase use your-project-id' to set your project
echo 5. Start development: 'npm run serve' (Terminal 1) and 'npm run dev' (Terminal 2)
echo.
echo See setup.md for detailed instructions.
echo.
pause 