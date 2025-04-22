// logger.js
const winston = require('winston');

// Define log format
const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

// Create the logger
const logger = winston.createLogger({
  level: 'info', // Default log level
  transports: [
    // Console transport for development or testing (with colored output)
    new winston.transports.Console({
      format: logFormat,
    }),

    // File transport for production or persistent logging
    new winston.transports.File({
      filename: 'logs/app.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

// If you're in a development environment, log at debug level to the console as well
if (process.env.NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      level: 'debug', // Set the logging level for development to 'debug'
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Utility function to log a database query
const logQuery = (query, params) => {
  logger.info(`Executing query: ${query} with parameters: ${JSON.stringify(params)}`);
};

// Error handling (can be extended for database or other critical failures)
const logError = (error) => {
  logger.error(`Error: ${error.message}`);
};

// Expose the logger
module.exports = {
  logger,
  logQuery,
  logError,
};
