# 🚀 VISIGA-SMS Frontend Production Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Code Quality Checks
- [x] No linting errors
- [x] No console warnings
- [x] All Material-UI prop types fixed
- [x] MUI X DatePicker migration completed
- [x] All imports resolved

### 2. Build Optimization
```bash
# Update browserslist data
npx update-browserslist-db@latest

# Clean install
npm ci

# Build for production
npm run build
```

### 3. Production Environment Setup

#### Environment Variables
Create `.env.production`:
```env
REACT_APP_API_URL=https://your-production-api.com
GENERATE_SOURCEMAP=false
PUBLIC_URL=/
```

#### Build Scripts
```json
{
  "scripts": {
    "build:prod": "NODE_ENV=production npm run build",
    "build:analyze": "npm run build && npx source-map-explorer build/static/js/*.js",
    "serve:prod": "npx serve -s build -l 3000"
  }
}
```

## 🏗️ Build Process

### Step 1: Clean Build
```bash
# Remove previous builds
rm -rf build

# Clean install dependencies
npm ci
```

### Step 2: Production Build
```bash
# Set production environment
export NODE_ENV=production
export GENERATE_SOURCEMAP=false

# Build the application
npm run build
```

### Step 3: Verify Build
```bash
# Check build output
ls -la build/

# Test production build locally
npx serve -s build -l 3000
```

## 🌐 Server Configuration

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/visiga-sms/build;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Apache Configuration
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/visiga-sms/build
    
    <Directory "/var/www/visiga-sms/build">
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## 🔧 Performance Optimizations

### 1. Bundle Analysis
```bash
# Install bundle analyzer
npm install -g source-map-explorer

# Analyze bundle
npm run build
source-map-explorer build/static/js/*.js
```

### 2. Code Splitting
```javascript
// Implement lazy loading for routes
const StudentEvaluationReport = React.lazy(() => 
  import('./Pages/StudentEvaluation/StudentEvaluationReport')
);

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <StudentEvaluationReport />
</Suspense>
```

### 3. Image Optimization
```javascript
// Use WebP format for images
const optimizedImage = image.visigalogo.replace('.png', '.webp');

// Implement lazy loading for images
<img 
  src={image.visigalogo} 
  loading="lazy" 
  alt="Visiga Logo"
/>
```

## 🛡️ Security Configuration

### 1. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;">
```

### 2. HTTPS Configuration
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Your app configuration
}
```

## 📊 Monitoring & Analytics

### 1. Error Tracking
```javascript
// Add Sentry for error tracking
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### 2. Performance Monitoring
```javascript
// Add performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🚀 Deployment Strategies

### 1. Blue-Green Deployment
```bash
# Deploy to staging
npm run build
rsync -av build/ staging-server:/var/www/visiga-sms/

# Test staging
curl -I https://staging.your-domain.com

# Switch to production
# (Update load balancer configuration)
```

### 2. CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy
        run: |
          # Your deployment commands
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint issues
npm run lint

# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. Runtime Issues
```bash
# Check console for errors
# Verify API connectivity
# Check CORS configuration
# Validate authentication flow
```

#### 3. Performance Issues
```bash
# Analyze bundle size
npm run build:analyze

# Check for memory leaks
# Optimize images
# Implement lazy loading
```

## 📋 Post-Deployment Checklist

- [ ] All routes work on refresh
- [ ] API connectivity verified
- [ ] Authentication flow working
- [ ] PDF generation functional
- [ ] Print functionality working
- [ ] Mobile responsiveness
- [ ] Performance metrics acceptable
- [ ] Error monitoring active
- [ ] Analytics tracking
- [ ] SSL certificate valid
- [ ] Security headers configured

## 🎯 Quick Commands

```bash
# Full production build
npm ci && npm run build

# Test locally
npx serve -s build -l 3000

# Deploy to server
rsync -av build/ user@server:/var/www/visiga-sms/

# Check deployment
curl -I https://your-domain.com
```

## 📞 Support

If you encounter any issues during deployment:
1. Check the build logs
2. Verify environment variables
3. Test API connectivity
4. Check server configuration
5. Review browser console for errors

---

**Note**: Always test the production build locally before deploying to ensure everything works correctly.
