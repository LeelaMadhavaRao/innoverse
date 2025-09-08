@echo off
echo 🚀 Innoverse Backend Deployment Helper
echo =====================================
echo.

echo 📋 Checking Git Status...
git status --porcelain
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git repository not found or not initialized
    pause
    exit /b 1
)

echo.
echo 📋 Current Branch:
git branch --show-current

echo.
echo 📋 Remote Repositories:
git remote -v

echo.
echo 📋 Recent Commits:
git log --oneline -3

echo.
echo 📋 Uncommitted Changes:
git status --porcelain

echo.
echo 🔧 Quick Actions:
echo 1. Add all changes:     git add .
echo 2. Commit changes:      git commit -m "your message"
echo 3. Push to main:        git push ino main
echo 4. Push to origin:      git push origin main
echo.

set /p choice="Choose action (1-4) or press Enter to skip: "

if "%choice%"=="1" (
    echo Adding all changes...
    git add .
    echo ✅ Changes added to staging
)

if "%choice%"=="2" (
    set /p message="Enter commit message: "
    git commit -m "%message%"
    echo ✅ Changes committed
)

if "%choice%"=="3" (
    echo Pushing to ino/main...
    git push ino main
    echo ✅ Pushed to ino remote
)

if "%choice%"=="4" (
    echo Pushing to origin/main...
    git push origin main
    echo ✅ Pushed to origin remote
)

echo.
echo 📋 Manual Steps to Check in Vercel Dashboard:
echo 1. Go to https://vercel.com/dashboard
echo 2. Find your innoverse-backend project
echo 3. Check the "Git" tab in project settings
echo 4. Ensure it's connected to the correct repository
echo 5. Check if auto-deployments are enabled
echo 6. Verify the production branch is set to "main"

pause
