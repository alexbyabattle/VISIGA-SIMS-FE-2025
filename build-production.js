#!/usr/bin/env node

/**
 * Production Build Script for VISIGA-SMS Frontend
 * This script ensures the application is built correctly for production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Production Build Process...\n');

// Step 1: Clean previous builds
console.log('📁 Cleaning previous builds...');
try {
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true, force: true });
    console.log('✅ Previous build cleaned');
  }
} catch (error) {
  console.log('⚠️  No previous build to clean');
}

// Step 2: Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm ci --silent', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 3: Run linting
console.log('\n🔍 Running linting checks...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed');
} catch (error) {
  console.log('⚠️  Linting issues found, but continuing with build...');
}

// Step 4: Build for production
console.log('\n🏗️  Building for production...');
try {
  // Set production environment
  process.env.NODE_ENV = 'production';
  process.env.GENERATE_SOURCEMAP = 'false';
  
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Production build completed');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 5: Verify build output
console.log('\n🔍 Verifying build output...');
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  const files = fs.readdirSync(buildPath);
  console.log('✅ Build directory created with files:', files);
  
  // Check for essential files
  const essentialFiles = ['index.html', 'static'];
  const missingFiles = essentialFiles.filter(file => 
    !files.includes(file) && !files.some(f => f.includes(file))
  );
  
  if (missingFiles.length === 0) {
    console.log('✅ All essential files present');
  } else {
    console.log('⚠️  Missing files:', missingFiles);
  }
} else {
  console.error('❌ Build directory not found');
  process.exit(1);
}

// Step 6: Generate build report
console.log('\n📊 Generating build report...');
try {
  const buildStats = {
    timestamp: new Date().toISOString(),
    buildSize: getDirectorySize(buildPath),
    files: fs.readdirSync(buildPath, { recursive: true })
  };
  
  fs.writeFileSync(
    path.join(buildPath, 'build-report.json'),
    JSON.stringify(buildStats, null, 2)
  );
  console.log('✅ Build report generated');
} catch (error) {
  console.log('⚠️  Could not generate build report:', error.message);
}

console.log('\n🎉 Production build completed successfully!');
console.log('\n📋 Next Steps:');
console.log('1. Test the build locally: npx serve -s build -l 3000');
console.log('2. Deploy to your production server');
console.log('3. Configure server for SPA routing');
console.log('4. Set up monitoring and analytics');

function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  function calculateSize(itemPath) {
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(itemPath);
      files.forEach(file => calculateSize(path.join(itemPath, file)));
    } else {
      totalSize += stats.size;
    }
  }
  
  calculateSize(dirPath);
  return `${(totalSize / 1024 / 1024).toFixed(2)} MB`;
}
