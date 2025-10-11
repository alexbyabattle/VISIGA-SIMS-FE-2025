# Force Build Script - Bypasses browserslist hanging issue
Write-Host "🚀 Force Building Project..." -ForegroundColor Green
Write-Host ""

# Set environment variables
$env:BROWSERSLIST_IGNORE_OLD_DATA = "1"
$env:GENERATE_SOURCEMAP = "false"
$env:NODE_ENV = "production"

Write-Host "📝 Creating custom browserslist config..." -ForegroundColor Yellow
@"
# Browsers that we support
> 0.5%
last 2 versions
Firefox ESR
not dead
"@ | Out-File -FilePath ".browserslistrc" -Encoding UTF8

Write-Host "🏗️ Starting build process..." -ForegroundColor Yellow
Write-Host "⚠️  This may take a few minutes..." -ForegroundColor Red
Write-Host ""

# Try multiple build methods
$buildSuccess = $false

# Method 1: Direct react-scripts build
try {
    Write-Host "🔄 Attempting Method 1: react-scripts build..." -ForegroundColor Cyan
    & npx react-scripts build
    $buildSuccess = $true
    Write-Host "✅ Build completed with Method 1!" -ForegroundColor Green
} catch {
    Write-Host "❌ Method 1 failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Method 2: Use yarn if npm fails
if (-not $buildSuccess) {
    try {
        Write-Host "🔄 Attempting Method 2: Using yarn..." -ForegroundColor Cyan
        npm install -g yarn
        yarn install
        yarn build
        $buildSuccess = $true
        Write-Host "✅ Build completed with Method 2!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Method 2 failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Method 3: Manual webpack build
if (-not $buildSuccess) {
    try {
        Write-Host "🔄 Attempting Method 3: Manual webpack..." -ForegroundColor Cyan
        npm install webpack webpack-cli webpack-dev-server
        npx webpack --mode=production
        $buildSuccess = $true
        Write-Host "✅ Build completed with Method 3!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Method 3 failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

if ($buildSuccess) {
    Write-Host ""
    Write-Host "🎉 Build completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Build output:" -ForegroundColor Cyan
    if (Test-Path "build") {
        $files = Get-ChildItem "build" -Recurse
        Write-Host "Files created: $($files.Count)" -ForegroundColor White
        
        # Calculate build size
        $totalSize = ($files | Measure-Object -Property Length -Sum).Sum
        $sizeMB = [math]::Round($totalSize / 1MB, 2)
        Write-Host "Build size: $sizeMB MB" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "🎯 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Test locally: npx serve -s build -l 3000"
    Write-Host "2. Deploy to your production server"
    Write-Host "3. Configure server for SPA routing"
} else {
    Write-Host ""
    Write-Host "❌ All build methods failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Manual troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check Node.js version: node --version"
    Write-Host "2. Clear npm cache: npm cache clean --force"
    Write-Host "3. Delete node_modules and reinstall"
    Write-Host "4. Update Node.js to latest LTS"
    Write-Host "5. Run as Administrator"
}

Write-Host ""
Read-Host "Press Enter to continue"
