#!/usr/bin/env node

/**
 * Build Verification Script
 * Verifies that the production build is working correctly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verifying Production Build...\n');

// Check if build directory exists
const buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  console.error('❌ Build directory not found. Run "npm run build" first.');
  process.exit(1);
}

console.log('✅ Build directory exists');

// Check for essential files
const essentialFiles = [
  'index.html',
  'static/js',
  'static/css',
  'static/media'
];

console.log('\n📁 Checking essential files...');
essentialFiles.forEach(file => {
  const filePath = path.join(buildPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check build size
console.log('\n📊 Build size analysis...');
const buildSize = getDirectorySize(buildPath);
console.log(`📦 Total build size: ${buildSize}`);

// Check for common issues
console.log('\n🔍 Checking for common issues...');

// Check if index.html has proper meta tags
const indexPath = path.join(buildPath, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  if (indexContent.includes('<title>')) {
    console.log('✅ Title tag found');
  } else {
    console.log('❌ Title tag missing');
  }
  
  if (indexContent.includes('react')) {
    console.log('✅ React app detected');
  } else {
    console.log('❌ React app not detected');
  }
} else {
  console.log('❌ index.html not found');
}

// Check static assets
console.log('\n🎨 Checking static assets...');
const staticPath = path.join(buildPath, 'static');
if (fs.existsSync(staticPath)) {
  const staticFiles = fs.readdirSync(staticPath, { recursive: true });
  console.log(`📁 Static files: ${staticFiles.length}`);
  
  // Check for JS bundles
  const jsFiles = staticFiles.filter(file => file.endsWith('.js'));
  console.log(`📜 JavaScript bundles: ${jsFiles.length}`);
  
  // Check for CSS files
  const cssFiles = staticFiles.filter(file => file.endsWith('.css'));
  console.log(`🎨 CSS files: ${cssFiles.length}`);
  
  // Check for media files
  const mediaFiles = staticFiles.filter(file => 
    file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.svg')
  );
  console.log(`🖼️  Media files: ${mediaFiles.length}`);
} else {
  console.log('❌ Static directory not found');
}

// Test production build locally
console.log('\n🚀 Testing production build...');
try {
  console.log('Starting local server...');
  console.log('Visit http://localhost:3000 to test the build');
  console.log('Press Ctrl+C to stop the server');
  
  execSync('npx serve -s build -l 3000', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Could not start local server:', error.message);
  console.log('You can manually test with: npx serve -s build -l 3000');
}

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

console.log('\n✅ Build verification completed!');
console.log('\n📋 Next steps:');
console.log('1. Test all routes manually');
console.log('2. Check API connectivity');
console.log('3. Verify authentication flow');
console.log('4. Test PDF generation');
console.log('5. Check print functionality');
console.log('6. Deploy to production server');
