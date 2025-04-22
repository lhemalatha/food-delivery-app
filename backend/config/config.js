require('dotenv').config();

module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    baseUrl: process.env.BASE_URL || 'http://localhost:5000'
  },

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'lhema2711',
    name: process.env.DB_NAME || 'food_delivery',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  // Authentication Configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    saltRounds: process.env.SALT_ROUNDS || 10
  },

  // File Upload Configuration
  upload: {
    directory: process.env.UPLOAD_DIR || 'public/uploads',
    maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg']
  },

  // Email Configuration (if needed)
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE || false,
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || ''
  },

  // Payment Gateway Configuration (if needed)
  payment: {
    stripeKey: process.env.STRIPE_KEY || '',
    currency: process.env.PAYMENT_CURRENCY || 'USD'
  },

  // CORS Configuration
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:3000']
  }
};