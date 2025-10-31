# MarmaraShop - Full-Stack E-Commerce Platform

A modern, scalable e-commerce platform built with **Next.js** (frontend), **MedusaJS** (backend), and **MongoDB** (database). Features include dynamic category landing pages, product catalog with advanced filtering, Cash on Delivery (COD) payments, OzonExpress shipping integration, comprehensive admin panel, and automated order notifications.

## 🚀 Features

### Frontend (Customer-Facing)
- Dynamic category landing pages with category-specific products
- Advanced product catalog with filtering (category, price range, availability)
- Shopping cart with local storage persistence
- Multi-step checkout process with COD payment
- Order tracking and history
- SEO-optimized pages with meta tags
- Responsive mobile design
- Performance optimized with lazy loading

### Backend (MedusaJS)
- RESTful API for product and category management
- Order creation and status management
- Cash on Delivery (COD) payment handling
- OzonExpress shipping integration
- Webhook system for shipment status updates
- JWT-based authentication for admin users
- Role-based access control (RBAC)
- Event-driven notification system

### Admin Dashboard
- Secure login with JWT tokens
- Product and category management (CRUD operations)
- Order management with status updates
- Shipment tracking and management
- Customer management and communication
- Admin user management with role assignment
- Dashboard with key metrics
- Notification logs and preferences

### Additional Features
- Email and SMS notifications (SendGrid, Twilio integration)
- Webhook-based order event system
- MongoDB with Mongoose ODM
- TypeScript for type safety
- Comprehensive testing (Jest, Playwright)
- CI/CD pipeline (GitHub Actions)

## 📋 Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend | Next.js | 14+ |
| Framework | React | 18+ |
| Styling | TailwindCSS | 3+ |
| Backend | MedusaJS | 2.x |
| Database | MongoDB | Latest |
| ORM | Mongoose | 7+ |
| Language | TypeScript | 5+ |
| API Client | Axios | 1.6+ |
| State Management | Zustand | 4+ |
| Testing | Jest | 29+ |
| E2E Testing | Playwright | Latest |

## 📁 Project Structure

```
MarmaraShop/
├── frontend/                    # Customer-facing Next.js app
│   ├── app/                    # Next.js App Router
│   │   ├── categories/[slug]/  # Dynamic category pages
│   │   ├── products/[id]/      # Product detail pages
│   │   ├── cart/               # Shopping cart page
│   │   ├── checkout/           # Checkout page
│   │   └── account/            # User account pages
│   ├── components/             # Reusable React components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions and helpers
│   ├── styles/                 # Global CSS and TailwindCSS
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                     # MedusaJS backend
│   ├── src/
│   │   ├── api/               # Custom API routes
│   │   ├── services/          # Business logic services
│   │   ├── models/            # Custom data models
│   │   ├── migrations/        # Database migrations
│   │   ├── plugins/           # Custom plugins
│   │   ├── events/            # Event definitions
│   │   └── utils/             # Utility functions
│   ├── medusa-config.js        # MedusaJS configuration
│   ├── package.json
│   └── tsconfig.json
│
├── admin/                       # Admin dashboard Next.js app
│   ├── app/
│   │   ├── login/             # Admin login page
│   │   ├── dashboard/         # Dashboard with metrics
│   │   ├── products/          # Product management
│   │   ├── categories/        # Category management
│   │   ├── orders/            # Order management
│   │   ├── customers/         # Customer management
│   │   ├── shipments/         # Shipment management
│   │   ├── notifications/     # Notification logs
│   │   └── settings/          # Admin settings
│   ├── middleware.ts           # Authentication middleware
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example               # Environment variables template
├── .env.local                 # Local development env (Git ignored)
├── .gitignore
├── package.json               # Root monorepo config
└── README.md
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB (local or Atlas)
- Redis (for MedusaJS queue system)
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd MarmaraShop
```

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm install:all

# Or install individually:
npm install --workspace=frontend
npm install --workspace=backend
npm install --workspace=admin
```

### Step 3: Configure Environment Variables
```bash
# Copy .env.example to .env.local and update with your values
cp .env.example .env.local

# Edit .env.local with your configuration:
# - MongoDB connection string
# - Redis URL
# - OzonExpress API credentials
# - SendGrid/Twilio credentials
# - JWT secrets (generate with: openssl rand -base64 32)
```

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:9000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

**Terminal 3 - Admin:**
```bash
cd admin
npm run dev
# Runs on http://localhost:7001
```

### Step 5: Access Applications
- **Customer Frontend:** http://localhost:3000
- **Admin Dashboard:** http://localhost:7001
- **Backend API:** http://localhost:9000
- **MedusaJS Admin (if included):** http://localhost:7000

## 📚 Development Guide

### Code Style & Formatting
All applications use ESLint and Prettier for code consistency:
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Running Tests
```bash
# Run tests in all workspaces
npm run test --workspaces

# Run tests in specific workspace
npm run test --workspace=frontend

# Run tests with coverage
npm run test:coverage --workspace=frontend
```

### Database Setup
```bash
# Run migrations
cd backend
npm run migrate

# Seed sample data
npm run seed
```

## 🔐 Security Configuration

### Environment Variables
Never commit `.env.local` - always use `.env.example` template. Required secrets:
- `MEDUSA_JWT_SECRET`: Min 32 characters
- `MEDUSA_COOKIE_SECRET`: Secure random string
- `ADMIN_JWT_SECRET`: Min 32 characters
- `WEBHOOK_SECRET`: For webhook signature verification
- API keys for third-party services

### Security Best Practices
- ✅ All API endpoints require authentication where applicable
- ✅ Rate limiting on public endpoints
- ✅ CORS properly configured
- ✅ Helmet.js for security headers
- ✅ Input validation and sanitization
- ✅ Secure cookie settings (httpOnly, Secure, SameSite)
- ✅ XSS prevention with sanitization
- ✅ SQL injection prevention via Mongoose

## 🚀 Deployment

### Backend Deployment (MedusaJS)
Options: AWS, Heroku, Railway, DigitalOcean
```bash
# Build backend
cd backend
npm run build

# Deploy to your platform (follow platform-specific guides)
```

### Frontend Deployment (Next.js)
Recommended: Vercel (seamless Next.js integration)
```bash
# Connect repository to Vercel
# Environment variables auto-configured from .env
```

### Admin Deployment
Deploy to separate domain (e.g., admin.marmara.shop)
```bash
# Build admin app
cd admin
npm run build
```

## 📖 API Documentation

### Key Endpoints

#### Products
- `GET /api/store/products` - List products (public)
- `GET /api/store/products/:id` - Get product details
- `POST /api/admin/products` - Create product (admin)
- `PATCH /api/admin/products/:id` - Update product (admin)
- `DELETE /api/admin/products/:id` - Delete product (admin)

#### Categories
- `GET /api/store/categories` - List categories (public)
- `GET /api/store/categories/:slug/products` - Products in category
- `POST /api/admin/categories` - Create category (admin)
- `PATCH /api/admin/categories/:id` - Update category (admin)

#### Orders
- `POST /api/store/checkout/submit` - Create order (COD)
- `GET /api/store/orders/:orderId` - Get order details
- `GET /api/store/guest/track-order` - Track guest order
- `GET /api/admin/orders` - List all orders (admin)
- `PATCH /api/admin/orders/:id` - Update order status (admin)

#### Shipping
- `POST /api/store/shipping/calculate` - Calculate shipping costs
- `GET /api/store/shipments/track/:trackingNumber` - Track shipment
- `POST /api/admin/shipments/create` - Create shipment (admin)

#### Authentication
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/refresh` - Refresh JWT token
- `POST /api/admin/auth/logout` - Logout

Full API documentation available in `/backend/docs/API.md`

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running: `mongosh` or MongoDB Atlas connection
- Check `MONGODB_URI` in `.env.local`
- Ensure database name matches `MONGODB_DB_NAME`

### Redis Connection Issues
- Verify Redis is running: `redis-cli ping`
- Check `MEDUSA_REDIS_URL` in `.env.local`
- Redis is required for MedusaJS job queue

### Next.js Build Issues
- Clear `.next` folders: `rm -rf frontend/.next admin/.next`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

## 📝 Environment Variables Reference

See `.env.example` for full list. Key variables:

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true
MONGODB_DB_NAME=marmara_shop

# MedusaJS
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_REDIS_URL=redis://localhost:6379

# Third-party APIs
OZONEXPRESS_API_KEY=your_key
SENDGRID_API_KEY=your_key
TWILIO_ACCOUNT_SID=your_sid

# JWT Secrets (generate with: openssl rand -base64 32)
MEDUSA_JWT_SECRET=your_32_char_min_secret
ADMIN_JWT_SECRET=your_32_char_min_secret
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support & Issues

For bugs and feature requests, please create an issue on GitHub.

For documentation questions, refer to:
- [Next.js Docs](https://nextjs.org/docs)
- [MedusaJS Docs](https://docs.medusajs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

**Last Updated:** October 2024
**Version:** 1.0.0