# Fleet Management Next.js User Application - AWS S3 Deployment Guide

## Overview
This guide provides step-by-step instructions to deploy the Next.js User Application to AWS S3 as a static website and integrate it with the ECS backend API.

## Prerequisites
- AWS CLI installed and configured
- Node.js and npm installed
- Fleet Management Backend deployed on AWS ECS
- AWS S3 access permissions
- Next.js application configured for static export

## Deployment Steps

### 1. Environment Configuration

#### 1.1 Create Production Environment File
```bash
# Create .env.production in the project root
NEXT_PUBLIC_API_BASE_URL=https://fleet-ecs-backend-url.amazonaws.com
NEXT_PUBLIC_APP_NAME=Fleet Management User Portal
NEXT_PUBLIC_NODE_ENV=production
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-ecs-backend-url.amazonaws.com
```

#### 1.2 Update Next.js Configuration
Ensure `next.config.js` is configured for static export:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/fleet-user' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/fleet-user' : '',
}

module.exports = nextConfig
```

#### 1.3 Update API Configuration
Ensure API calls use environment variables:
```typescript
// lib/api.ts or utils/api.ts
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'
```

### 2. Build Production Assets

#### 2.1 Install Dependencies
```bash
npm install
```

#### 2.2 Build for Production
```bash
# Build Next.js application for static export
npm run build

# Alternative if you have a custom script
npm run export
```
This creates an `out/` folder with optimized static assets.

#### 2.3 Verify Build
```bash
# Check build output
ls -la out/
# Should contain: index.html, _next/, static assets, page files
```

#### 2.4 Test Local Static Build
```bash
# Install serve to test locally
npm install -g serve

# Test the static build
serve out/ -p 3000

# Open http://localhost:3000 to verify everything works
```

### 3. AWS S3 Bucket Setup

#### 3.1 Create S3 Bucket
```bash
# Replace 'your-fleet-user-bucket' with your unique bucket name
aws s3 mb s3://your-fleet-user-bucket --region us-east-1
```

#### 3.2 Configure Bucket for Static Website Hosting
```bash
# Enable static website hosting
aws s3 website s3://your-fleet-user-bucket \
  --index-document index.html \
  --error-document index.html
```

#### 3.3 Create Bucket Policy for Public Read Access
Create `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-fleet-user-bucket/*"
    }
  ]
}
```

Apply the policy:
```bash
aws s3api put-bucket-policy \
  --bucket your-fleet-user-bucket \
  --policy file://bucket-policy.json
```

#### 3.4 Disable Block Public Access
```bash
aws s3api put-public-access-block \
  --bucket your-fleet-user-bucket \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

### 4. Deploy Build Assets to S3

#### 4.1 Upload Build Files
```bash
# Upload all files with proper content types
aws s3 sync out/ s3://your-fleet-user-bucket \
  --delete \
  --cache-control "max-age=31536000" \
  --exclude "*.html" \
  --exclude "*.json"

# Upload HTML files with no cache
aws s3 sync out/ s3://your-fleet-user-bucket \
  --delete \
  --cache-control "no-cache" \
  --include "*.html" \
  --include "*.json"
```

#### 4.2 Set Content Types for Next.js Assets
```bash
# Ensure proper MIME types for HTML
aws s3 cp out/ s3://your-fleet-user-bucket \
  --recursive \
  --metadata-directive REPLACE \
  --content-type "text/html" \
  --include "*.html"

# JavaScript files
aws s3 cp out/ s3://your-fleet-user-bucket \
  --recursive \
  --metadata-directive REPLACE \
  --content-type "application/javascript" \
  --include "*.js"

# CSS files
aws s3 cp out/ s3://your-fleet-user-bucket \
  --recursive \
  --metadata-directive REPLACE \
  --content-type "text/css" \
  --include "*.css"

# JSON files
aws s3 cp out/ s3://your-fleet-user-bucket \
  --recursive \
  --metadata-directive REPLACE \
  --content-type "application/json" \
  --include "*.json"
```

### 5. Access Your Deployed Application

#### 5.1 Get Website URL
```bash
echo "http://your-fleet-user-bucket.s3-website-us-east-1.amazonaws.com"
```

#### 5.2 Test Deployment
- Open the URL in your browser
- Verify user registration/login functionality
- Check booking features work with ECS backend
- Test real-time updates and notifications
- Verify mobile responsiveness

### 6. Optional: CloudFront Setup (Recommended)

#### 6.1 Create CloudFront Distribution
```bash
# Create distribution-config.json
{
  "CallerReference": "fleet-user-$(date +%s)",
  "Comment": "Fleet Management User Application",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-your-fleet-user-bucket",
        "DomainName": "your-fleet-user-bucket.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-fleet-user-bucket",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "Compress": true
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "Enabled": true
}
```

#### 6.2 Deploy CloudFront
```bash
aws cloudfront create-distribution --distribution-config file://distribution-config.json
```

### 7. Custom Domain Setup (Optional)

#### 7.1 Route 53 Domain Configuration
```bash
# Create hosted zone for user app subdomain
aws route53 create-hosted-zone --name app.your-domain.com --caller-reference $(date +%s)

# Create A record pointing to CloudFront
aws route53 change-resource-record-sets --hosted-zone-id ZXXXXXXXXXXXXX --change-batch file://dns-change.json
```

#### 7.2 SSL Certificate Setup
```bash
# Request SSL certificate through ACM
aws acm request-certificate \
  --domain-name app.your-domain.com \
  --validation-method DNS \
  --region us-east-1
```

### 8. Backend Integration Checklist

#### 8.1 Verify API Connectivity
- [ ] ECS backend is accessible via HTTPS
- [ ] CORS is configured to allow user app domain
- [ ] Authentication endpoints work correctly
- [ ] Booking APIs return proper responses
- [ ] Real-time WebSocket connections work
- [ ] File upload endpoints functional

#### 8.2 Test User Application Features
- [ ] User registration and email verification
- [ ] Login/logout functionality
- [ ] Vehicle browsing and search
- [ ] Booking creation and management
- [ ] Payment processing integration
- [ ] Trip tracking and updates
- [ ] User profile management
- [ ] Notifications and alerts

### 9. Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | ECS Backend API URL | `https://api.fleet.com` |
| `NEXT_PUBLIC_APP_NAME` | Application Name | `Fleet Management User Portal` |
| `NEXT_PUBLIC_NODE_ENV` | Environment | `production` |
| `NEXT_PUBLIC_WEBSOCKET_URL` | WebSocket URL for real-time updates | `wss://api.fleet.com` |
| `NEXT_PUBLIC_PAYMENT_GATEWAY_URL` | Payment gateway endpoint | `https://payment.fleet.com` |
| `NEXT_PUBLIC_MAP_API_KEY` | Google Maps/Mapbox API key | `pk.xxxxxxxxxxxxx` |

### 10. Next.js Specific Configurations

#### 10.1 Static Generation Optimization
```javascript
// pages/index.js
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 60 // Revalidate every minute
  }
}
```

#### 10.2 Image Optimization for S3
```javascript
// next.config.js
module.exports = {
  images: {
    unoptimized: true, // Disable Next.js image optimization for S3
    domains: ['your-fleet-user-bucket.s3.amazonaws.com']
  }
}
```

### 11. Troubleshooting

#### 11.1 Common Next.js S3 Issues
- **404 Errors on Routes**: Ensure `trailingSlash: true` in next.config.js
- **Image Loading Issues**: Set `images.unoptimized: true`
- **API Routes Not Working**: API routes don't work with static export
- **Dynamic Routes 404**: Use `getStaticPaths` for dynamic routes
- **CSS/JS Not Loading**: Check asset prefix and base path configuration

#### 11.2 Debugging Commands
```bash
# Check Next.js build output
ls -la out/_next/static/

# Test static export locally
npx serve out/

# Check S3 bucket structure
aws s3 ls s3://your-fleet-user-bucket --recursive

# Test website endpoint
curl -I http://your-fleet-user-bucket.s3-website-us-east-1.amazonaws.com
```

### 12. Deployment Automation Script

Create `deploy.sh` for automated deployments:
```bash
#!/bin/bash
set -e

echo "Building Next.js User Application..."
npm run build

echo "Testing build locally..."
npx serve out/ &
SERVER_PID=$!
sleep 5
curl -f http://localhost:3000 > /dev/null || (echo "Build test failed" && kill $SERVER_PID && exit 1)
kill $SERVER_PID

echo "Deploying to S3..."
aws s3 sync out/ s3://your-fleet-user-bucket --delete

echo "Creating CloudFront invalidation..."
aws cloudfront create-invalidation --distribution-id EXXXXXXXXXXXXX --paths "/*"

echo "Deployment complete!"
echo "URL: http://your-fleet-user-bucket.s3-website-us-east-1.amazonaws.com"
echo "CloudFront URL: https://dxxxxxxxxxxxxx.cloudfront.net"
```

Make it executable:
```bash
chmod +x deploy.sh
```

### 13. Performance Optimization

#### 13.1 Build Optimization
```json
// package.json
{
  "scripts": {
    "build": "next build && next export",
    "build:analyze": "ANALYZE=true next build",
    "export": "next export"
  }
}
```

#### 13.2 Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle size
npm run build:analyze
```

### 14. Security Best Practices

- [ ] Use HTTPS only (CloudFront with SSL certificate)
- [ ] Implement proper CORS on backend
- [ ] Sanitize user inputs on frontend
- [ ] Use environment variables for sensitive configuration
- [ ] Enable S3 bucket versioning for rollback capability
- [ ] Set up CloudWatch monitoring
- [ ] Configure Content Security Policy (CSP)
- [ ] Implement rate limiting on API calls

### 15. Monitoring & Maintenance

#### 15.1 CloudWatch Metrics Setup
```bash
# Create CloudWatch dashboard
aws cloudwatch put-dashboard \
  --dashboard-name "Fleet-User-App" \
  --dashboard-body file://dashboard-config.json
```

#### 15.2 Error Tracking
```javascript
// Install Sentry for error tracking
npm install @sentry/nextjs

// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_NODE_ENV
})
```

#### 15.3 Performance Monitoring
```javascript
// pages/_app.js
import { reportWebVitals } from '../utils/analytics'

export function reportWebVitals(metric) {
  // Send to analytics service
  console.log(metric)
}
```

---

## Quick Deployment Commands Summary

```bash
# 1. Configure for static export
# Edit next.config.js with output: 'export'

# 2. Build the app
npm run build

# 3. Create S3 bucket
aws s3 mb s3://your-fleet-user-bucket

# 4. Configure static hosting
aws s3 website s3://your-fleet-user-bucket --index-document index.html --error-document index.html

# 5. Deploy files
aws s3 sync out/ s3://your-fleet-user-bucket --delete

# 6. Access your app
echo "http://your-fleet-user-bucket.s3-website-us-east-1.amazonaws.com"
```

## Mobile App Integration

### 16.1 Progressive Web App (PWA) Setup
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  // ... other config
})
```

### 16.2 App Manifest
```json
// public/manifest.json
{
  "name": "Fleet Management User App",
  "short_name": "Fleet User",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## Support

For issues or questions regarding the deployment:
1. Check Next.js build logs for compilation errors
2. Verify AWS CloudWatch logs for S3 access patterns
3. Test API endpoints directly with curl/Postman
4. Review browser console for frontend errors
5. Check CloudFront logs for caching issues

---
**Last Updated**: December 22, 2025
**Version**: 1.0.0
**Framework**: Next.js 14+ Static Export