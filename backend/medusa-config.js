const dotenv = require('dotenv');

let ENV_FILE_NAME = '.env';
if (process.env.NODE_ENV) {
  ENV_FILE_NAME = `.env.${process.env.NODE_ENV}`;
}

if (!process.env.MEDUSA_BACKEND_URL) {
  dotenv.config({ path: process.env.PWD + '/../' + ENV_FILE_NAME });
}

module.exports = {
  projectConfig: {
    jwtSecret: process.env.MEDUSA_JWT_SECRET,
    cookieSecret: process.env.MEDUSA_COOKIE_SECRET,
    cors: {
      origin: [
        process.env.NEXT_PUBLIC_APP_URL,
        process.env.NEXT_PUBLIC_ADMIN_URL,
        'http://localhost:3000',
        'http://localhost:7001',
        'http://localhost:7000',
      ],
      credentials: true,
    },
    database_url: process.env.MONGODB_URI,
    redis_url: process.env.MEDUSA_REDIS_URL || 'redis://localhost:6379',
    database_extra: {
      connectionString: process.env.MONGODB_URI,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  plugins: [
    {
      resolve: '@medusajs/mongo',
      options: {
        clientUrl: process.env.MONGODB_URI,
      },
    },
  ],
  featureFlags: {
    product_categories: true,
    publishable_api_keys: true,
    sales_channels: false,
    tax_inclusive_pricing: false,
  },
};
