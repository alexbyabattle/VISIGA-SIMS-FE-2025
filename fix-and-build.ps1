# PowerShell script to fix npm and build issues
Write-Host "🔧 Fixing npm and build issues..." -ForegroundColor Green
Write-Host ""

# Navigate to script directory
Set-Location $PSScriptRoot

Write-Host "🧹 Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "🗑️ Removing node_modules and package-lock.json..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🔄 Updating browserslist database..." -ForegroundColor Yellow
npm install caniuse-lite@latest

Write-Host "🏗️ Building project..." -ForegroundColor Yellow
$env:BROWSERSLIST_IGNORE_OLD_DATA = "1"
npm run build

Write-Host ""
Write-Host "✅ Build process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Check if build folder was created"
Write-Host "2. Test with: npx serve -s build -l 3000"
Write-Host "3. Deploy to your server"
Write-Host ""
Read-Host "Press Enter to continue"
