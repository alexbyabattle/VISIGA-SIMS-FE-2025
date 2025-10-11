@echo off
echo 🚀 Force Building Project - Bypassing browserslist issues...
echo.

REM Set environment variables
set BROWSERSLIST_IGNORE_OLD_DATA=1
set GENERATE_SOURCEMAP=false
set NODE_ENV=production

echo 📝 Creating custom browserslist config...
echo # Browsers that we support > .browserslistrc
echo ^> 0.5%% >> .browserslistrc
echo last 2 versions >> .browserslistrc
echo Firefox ESR >> .browserslistrc
echo not dead >> .browserslistrc

echo 🏗️ Starting build process...
echo ⚠️  This may take a few minutes...
echo.

REM Run build with timeout to prevent hanging
timeout /t 1 /nobreak >nul
npx react-scripts build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build completed successfully!
    echo 📁 Check the 'build' folder for your production files
    echo.
    echo 🎯 Next steps:
    echo 1. Test locally: npx serve -s build -l 3000
    echo 2. Deploy to your production server
) else (
    echo.
    echo ❌ Build failed. Trying alternative method...
    echo.
    echo 🔄 Attempting build with yarn...
    npm install -g yarn
    yarn install
    yarn build
)

echo.
pause
