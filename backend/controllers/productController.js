const db = require('../config/db');

// Get all products
exports.getAllProducts = (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch products' });
    res.json(results);
  });
};

// Get single product by ID
exports.getProductById = (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM products WHERE id = ?';
  db.query(query, [productId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch product' });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
};

// Create new product
exports.createProduct = (req, res) => {
  const { name, description, price, imageUrl, category } = req.body;
  const query = 'INSERT INTO products (name, description, price, imageUrl, category) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, description, price, imageUrl, category], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to add product' });
    res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
  });
};

// Update product
exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const { name, description, price, imageUrl, category } = req.body;
  const query = 'UPDATE products SET name=?, description=?, price=?, imageUrl=?, category=? WHERE id=?';
  db.query(query, [name, description, price, imageUrl, category, productId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update product' });
    res.json({ message: 'Product updated successfully' });
  });
};

// Delete product
exports.deleteProduct = (req, res) => {
  const productId = req.params.id;
  const query = 'DELETE FROM products WHERE id=?';
  db.query(query, [productId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete product' });
    res.json({ message: 'Product deleted successfully' });
  });
};
