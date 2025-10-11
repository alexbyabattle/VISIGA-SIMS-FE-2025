@echo off
echo 🔧 Fixing npm and build issues...
echo.

echo 📁 Navigating to project directory...
cd /d "%~dp0"

echo 🧹 Cleaning npm cache...
npm cache clean --force

echo 🗑️ Removing node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo 📦 Installing dependencies...
npm install

echo 🔄 Updating browserslist database...
npm install caniuse-lite@latest

echo 🏗️ Building project...
set BROWSERSLIST_IGNORE_OLD_DATA=1
npm run build

echo.
echo ✅ Build process completed!
echo.
echo 📋 Next steps:
echo 1. Check if build folder was created
echo 2. Test with: npx serve -s build -l 3000
echo 3. Deploy to your server
echo.
pause
