const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Utility functions for the food delivery application
 */
module.exports = {
  /**
   * Generate a random string of specified length
   * @param {number} length - Length of the random string
   * @returns {string} Random string
   */
  generateRandomString: (length = 32) => {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  },

  /**
   * Format a date to MySQL datetime format
   * @param {Date} date - Date object to format
   * @returns {string} Formatted datetime string
   */
  formatDateToMySQL: (date = new Date()) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  },

  /**
   * Delete a file from the filesystem
   * @param {string} filePath - Path to the file
   * @returns {Promise<boolean>} True if deleted successfully
   */
  deleteFile: async (filePath) => {
    try {
      const fullPath = path.join(__dirname, '../', filePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  },

  /**
   * Validate an email address
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  /**
   * Paginate an array of results
   * @param {Array} data - Array of data to paginate
   * @param {number} page - Current page number
   * @param {number} limit - Items per page
   * @returns {Object} Paginated result { data, total, pages, currentPage }
   */
  paginate: (data, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = data.length;
    const pages = Math.ceil(total / limit);

    return {
      data: data.slice(startIndex, endIndex),
      meta: {
        total,
        pages,
        currentPage: page,
        perPage: limit,
        hasNext: endIndex < total,
        hasPrevious: startIndex > 0
      }
    };
  },

  /**
   * Generate a unique filename with extension
   * @param {string} originalname - Original filename
   * @returns {string} Unique filename
   */
  generateUniqueFilename: (originalname) => {
    const ext = path.extname(originalname);
    const basename = path.basename(originalname, ext);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    return `${basename}-${uniqueSuffix}${ext}`;
  },

  /**
   * Calculate distance between two coordinates (Haversine formula)
   * @param {number} lat1 - Latitude of point 1
   * @param {number} lon1 - Longitude of point 1
   * @param {number} lat2 - Latitude of point 2
   * @param {number} lon2 - Longitude of point 2
   * @returns {number} Distance in kilometers
   */
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  /**
   * Format currency with proper symbol and decimals
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (default 'USD')
   * @returns {string} Formatted currency string
   */
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(amount);
  },

  /**
   * Generate a slug from a string
   * @param {string} text - Text to convert to slug
   * @returns {string} Generated slug
   */
  generateSlug: (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  },

  /**
   * Delay execution for a specified time
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after delay
   */
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Deep clone an object
   * @param {Object} obj - Object to clone
   * @returns {Object} Deep cloned object
   */
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Capitalize the first letter of each word in a string
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  capitalizeWords: (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
};