# MarmaraShop - Local Development Setup Guide

## ✅ Fixed Package Issues

The package.json files have been updated with correct versions. The following issues were resolved:
- ❌ `@medusajs/medusa-cli@^2.0.0` → ✅ Removed (not needed for Express-based backend)
- ❌ `react-table@^8.10.0` → ✅ `@tanstack/react-table@^8.10.0`
- ✅ All package versions now compatible with Node.js 22.x

## Prerequisites

- **Node.js:** v18+ (you have v22.17.1 ✓)
- **npm:** v9+ (comes with Node.js)
- **Git:** For version control
- **MongoDB:** Local or Atlas (for database)

## Installation Steps

### 1. Clone or Navigate to Project

```bash
cd ~/Desktop/projects/MarmaraShop
```

### 2. Clean Install (Recommended)

First, clean up any previous installation artifacts:

```bash
# Remove node_modules and lock files
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf admin/node_modules admin/package-lock.json
```

### 3. Install Dependencies

```bash
# Install all dependencies at once
npm install
```

**If that fails, install each workspace separately:**

```bash
# Root dependencies
npm install

# Frontend
npm install --workspace=frontend

# Backend
npm install --workspace=backend

# Admin
npm install --workspace=admin
```

### 4. Setup Environment Variables

Create `.env.local` files for each workspace:

**Root `.env.local`:**
```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend `.env.local`:**
```env
NODE_ENV=development
PORT=9000
MONGODB_URI=mongodb://localhost:27017/marmara_shop
MONGODB_DB_NAME=marmara_shop
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
ADMIN_JWT_SECRET=your_super_secret_admin_key_min_32_chars_long
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_min_32_chars

# Optional Services
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
OZONEXPRESS_API_KEY=your_ozonexpress_key
OZONEXPRESS_API_SECRET=your_ozonexpress_secret
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
```

**Admin `.env.local`:**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_ADMIN_URL=http://localhost:7001
```

### 5. Setup MongoDB (Choose One)

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/marmara_shop`
4. Add to `.env.local`

**Option B: Local MongoDB**
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows with Chocolatey
choco install mongodb

# Linux (Ubuntu)
sudo apt-get install -y mongodb
sudo service mongod start
```

Then use: `mongodb://localhost:27017/marmara_shop`

### 6. Start Development Servers

**Terminal 1 - Backend (Port 9000):**
```bash
npm run dev --workspace=backend
```

**Terminal 2 - Frontend (Port 3000):**
```bash
npm run dev --workspace=frontend
```

**Terminal 3 - Admin (Port 7001):**
```bash
npm run dev --workspace=admin
```

### 7. Access Applications

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:9000/health
- **Admin:** http://localhost:7001

### 8. Admin Login

**Demo Credentials:**
- Email: `admin@marmara.shop`
- Password: `password123`

## Troubleshooting

### Issue: "ETARGET: No matching version found"

**Solution:** Run clean install:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port already in use"

**Solution:** Change port in scripts or kill process:
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Issue: MongoDB connection error

**Solution:** Verify MongoDB is running:
```bash
# Check if MongoDB is running
mongo --version
# Start MongoDB if needed
mongod
```

### Issue: Module not found errors

**Solution:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

## Available Scripts

### Root Scripts
```bash
npm run dev          # Start all dev servers
npm run build        # Build all apps
npm run test         # Run tests for all apps
npm run lint         # Lint all apps
```

### Frontend Scripts
```bash
cd frontend
npm run dev          # Start dev server on port 3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npm run type-check   # TypeScript check
npm test             # Run tests
```

### Backend Scripts
```bash
cd backend
npm run dev          # Start dev server on port 9000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
npm run type-check   # TypeScript check
npm test             # Run tests
npm run seed         # Seed sample data (optional)
npm run migrate      # Run database migrations
```

### Admin Scripts
```bash
cd admin
npm run dev          # Start dev server on port 7001
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npm run type-check   # TypeScript check
npm test             # Run tests
```

## Database Seeding (Optional)

To populate sample data:

```bash
cd backend
npm run seed
```

This will add:
- 10+ sample products
- 5+ categories with hierarchy
- 3+ demo orders
- Sample shipments

## Development Workflow

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** in frontend, backend, or admin

3. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   ```

4. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Type Checking

```bash
# TypeScript check
npm run type-check

# Watch mode
npm run type-check -- --watch
```

## Linting

```bash
# Run linter
npm run lint

# Fix linting errors
npm run lint -- --fix
```

## Production Build

```bash
# Build all apps
npm run build

# This creates optimized builds in each app's `.next` or `dist` folder
```

## Common Commands Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start all dev servers |
| `npm run build` | Build all apps |
| `npm test` | Run all tests |
| `npm run lint` | Lint all code |
| `npm run type-check` | TypeScript validation |

## Next Steps

1. ✅ Complete installation
2. 📖 Read README.md for project overview
3. 🗂️ Review project structure in IMPLEMENTATION_COMPLETE.md
4. 🚀 Start developing!

## Documentation

- **IMPLEMENTATION_COMPLETE.md** - Full project documentation
- **README.md** - Project overview
- **CI-CD-SETUP.md** - Deployment guide
- **IMPLEMENTATION_INDEX.md** - File structure reference

## Need Help?

Check the troubleshooting section above or review the inline code comments for specific modules.

---

**Happy coding! 🚀**
