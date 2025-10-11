#!/usr/bin/env node

/**
 * Custom Build Script - Bypasses browserslist issues
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting custom build process...\n');

// Set environment variables to bypass browserslist
process.env.BROWSERSLIST_IGNORE_OLD_DATA = '1';
process.env.GENERATE_SOURCEMAP = 'false';
process.env.NODE_ENV = 'production';

// Create a custom browserslist config to avoid the warning
const browserslistConfig = `
# Browsers that we support
> 0.5%
last 2 versions
Firefox ESR
not dead
not IE 9-11 # For IE 9-11 support, remove 'not'.
`;

fs.writeFileSync('.browserslistrc', browserslistConfig);
console.log('✅ Created custom browserslist config');

// Run the build with custom settings
const buildProcess = spawn('npx', ['react-scripts', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    BROWSERSLIST_IGNORE_OLD_DATA: '1',
    GENERATE_SOURCEMAP: 'false',
    NODE_ENV: 'production'
  }
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Build completed successfully!');
    console.log('\n📁 Build output:');
    
    if (fs.existsSync('build')) {
      const files = fs.readdirSync('build');
      console.log('Files in build directory:', files);
      
      // Check build size
      const buildSize = getDirectorySize('build');
      console.log(`📦 Build size: ${buildSize}`);
    }
    
    console.log('\n🎯 Next steps:');
    console.log('1. Test locally: npx serve -s build -l 3000');
    console.log('2. Deploy to your production server');
    console.log('3. Configure server for SPA routing');
  } else {
    console.log(`\n❌ Build failed with code ${code}`);
    console.log('\n🔧 Try these alternatives:');
    console.log('1. Use yarn: yarn install && yarn build');
    console.log('2. Update browserslist: npm install caniuse-lite@latest');
    console.log('3. Clear cache: npm cache clean --force');
  }
});

buildProcess.on('error', (error) => {
  console.error('❌ Build process error:', error.message);
});

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
