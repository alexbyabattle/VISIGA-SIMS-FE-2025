const fs = require('fs');
const path = require('path');

// Common warning patterns to fix
const warningPatterns = [
  {
    pattern: /console\.log\(/g,
    replacement: '// console.log(',
    description: 'Comment out console.log statements'
  },
  {
    pattern: /console\.warn\(/g,
    replacement: '// console.warn(',
    description: 'Comment out console.warn statements'
  },
  {
    pattern: /import\s+.*\s+from\s+['"][^'"]*['"];\s*(?=\n\s*$)/gm,
    replacement: '',
    description: 'Remove unused imports at end of import block'
  }
];

// Function to process files
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    warningPatterns.forEach(({ pattern, replacement, description }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
        console.log(`Fixed: ${description} in ${filePath}`);
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to walk directory
function walkDirectory(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDirectory(filePath, extensions);
    } else if (stat.isFile() && extensions.some(ext => file.endsWith(ext))) {
      processFile(filePath);
    }
  });
}

// Start cleanup
console.log('Starting code cleanup...');
walkDirectory('./src');
console.log('Cleanup completed!');
