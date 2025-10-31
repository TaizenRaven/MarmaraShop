# CI/CD Pipeline Setup

This document describes the CI/CD pipeline configuration for MarmaraShop using GitHub Actions.

## GitHub Actions Workflow

Create `.github/workflows/ci.yml` in the project root with the following configuration:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run type check
      run: npm run typecheck

    - name: Build all apps
      run: npm run build

    - name: Run tests
      run: npm test

  security:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Run security scan
      run: |
        npm audit --production || true
```

## Deployment Configuration

### Backend (MedusaJS) - AWS/Railway/Heroku

```bash
# Vercel or AWS deployment
1. Push code to main branch
2. CI/CD pipeline runs tests
3. If tests pass, deploy to production
```

### Frontend (Next.js) - Vercel

```bash
# Vercel deployment
1. Connect GitHub repository to Vercel
2. Set environment variables:
   - NEXT_PUBLIC_MEDUSA_BACKEND_URL
   - NEXT_PUBLIC_APP_URL
3. Vercel auto-deploys on push to main
```

### Admin Panel (Next.js) - Vercel

```bash
# Separate Vercel project for admin
1. Create new Vercel project for admin app
2. Configure environment variables
3. Deploy to admin.marmara.shop
```

## Environment Variables

### Production Environment

Backend (.env.production):
```
MONGODB_URI=your_production_mongodb_uri
MEDUSA_JWT_SECRET=your_production_jwt_secret
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
OZONEXPRESS_API_KEY=your_ozonexpress_key
OZONEXPRESS_API_SECRET=your_ozonexpress_secret
```

Frontend (.env.production):
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.marmara.shop
NEXT_PUBLIC_APP_URL=https://marmara.shop
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_analytics_id
```

## Monitoring & Alerts

### Error Tracking (Sentry)
```typescript
// frontend/app/layout.tsx
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring
- Core Web Vitals monitoring via Google Analytics
- API response time tracking
- Database query performance

### Uptime Monitoring
- UptimeRobot for endpoint monitoring
- PagerDuty for on-call alerts

## Backup Strategy

### Database Backups
```bash
# MongoDB backup (daily)
mongodump --uri="mongodb+srv://..." --archive=backup-$(date +%Y%m%d).archive

# Store backups in AWS S3
aws s3 cp backup-*.archive s3://marmara-backups/
```

### Disaster Recovery
- Maintain minimum 30 days of backups
- Test restore procedures monthly
- Document recovery time objectives (RTO)

## Security Checklist

- [ ] SSL/TLS certificates installed
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevention implemented
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Secrets not hardcoded
- [ ] Environment variables secured
- [ ] Database encryption enabled
- [ ] API key rotation policy established
- [ ] WAF (Web Application Firewall) configured
- [ ] DDoS protection enabled

## Performance Targets

- Frontend bundle: < 150KB (gzipped)
- Page load time: < 3 seconds on 4G
- API response time: < 200ms (p95)
- Core Web Vitals: All green
- 99.9% uptime SLA

## Deployment Checklist

Before production deployment:
- [ ] All tests passing
- [ ] Security scan complete
- [ ] Performance benchmarks met
- [ ] Database migrations tested
- [ ] Backup created
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured
- [ ] Stakeholders notified
