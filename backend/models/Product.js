const pool = require('../config/db');

class Product {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM products');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  static async create({ name, description, price, category, image }) {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category, image]
    );
    return result.insertId;
  }
}

module.exports = Product;