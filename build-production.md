# Production Build Guide for VISIGA-SMS Frontend

## 🚀 Production Build Steps

### 1. Pre-Build Checklist
- ✅ All linting errors resolved
- ✅ No console warnings
- ✅ All imports are correct
- ✅ Environment variables configured

### 2. Build Commands

#### Development Build (for testing)
```bash
npm run build
```

#### Production Build (optimized)
```bash
NODE_ENV=production npm run build
```

### 3. Production Optimizations

#### Environment Variables
Create `.env.production` file:
```env
REACT_APP_API_URL=https://your-production-api.com
GENERATE_SOURCEMAP=false
```

#### Build Optimizations
- Minification enabled
- Tree shaking applied
- Code splitting implemented
- Asset optimization

### 4. Deployment Checklist

#### Static File Serving
- Ensure all routes work on refresh
- Configure server for SPA routing
- Set proper cache headers

#### Server Configuration (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/build;
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
}
```

#### Apache Configuration
```apache
<Directory "/path/to/build">
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</Directory>
```

### 5. Performance Optimizations

#### Bundle Analysis
```bash
npm install -g source-map-explorer
npm run build
source-map-explorer build/static/js/*.js
```

#### Code Splitting
- React.lazy() for route-based splitting
- Dynamic imports for heavy components
- Vendor chunk separation

### 6. Security Considerations

#### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

#### HTTPS Configuration
- SSL certificates
- HTTP to HTTPS redirects
- Secure headers

### 7. Monitoring & Analytics

#### Error Tracking
- Sentry integration
- Console error monitoring
- Performance monitoring

#### Analytics
- Google Analytics
- User behavior tracking
- Performance metrics

### 8. Testing Production Build

#### Local Testing
```bash
# Install serve globally
npm install -g serve

# Serve production build
serve -s build -l 3000
```

#### Health Checks
- API connectivity
- Route accessibility
- Asset loading
- Performance metrics

### 9. Deployment Strategies

#### Blue-Green Deployment
- Zero downtime deployments
- Instant rollback capability
- Load balancer configuration

#### CI/CD Pipeline
```yaml
# GitHub Actions example
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy
        run: # Your deployment commands
```

### 10. Troubleshooting Common Issues

#### Build Failures
- Check for TypeScript errors
- Verify all imports
- Check environment variables
- Review dependency conflicts

#### Runtime Issues
- Console errors
- Network connectivity
- CORS configuration
- Authentication flow

#### Performance Issues
- Bundle size analysis
- Image optimization
- Lazy loading implementation
- Caching strategies

## 🎯 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Run linting
npm run lint

# 3. Build for production
npm run build

# 4. Test production build locally
npx serve -s build -l 3000

# 5. Deploy to your server
# (Use your preferred deployment method)
```

## 📊 Build Output Analysis

After building, check:
- `build/static/js/` - JavaScript bundles
- `build/static/css/` - CSS files
- `build/index.html` - Main HTML file
- Bundle sizes and optimization
- Source maps (if enabled)

## 🔧 Environment Configuration

### Development
```env
REACT_APP_API_URL=http://localhost:8086
GENERATE_SOURCEMAP=true
```

### Production
```env
REACT_APP_API_URL=https://your-api-domain.com
GENERATE_SOURCEMAP=false
```

## 📝 Notes

- Always test the production build locally before deployment
- Monitor bundle sizes and performance
- Ensure all routes work correctly on refresh
- Configure proper caching headers
- Set up error monitoring and analytics
