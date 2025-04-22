exports.createOrder = async (req, res) => {
  const { customer_name, email, phone, food_name, quantity, address } = req.body;
  
  // Calculate total (in a real app, you'd fetch price from database)
  const basePrice = 200; // Example base price
  const total = basePrice * quantity;

  try {
    const [result] = await pool.query(
      'INSERT INTO orders (customer_name, email, phone, food_name, quantity, address, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [customer_name, email, phone, food_name, quantity, address, total]
    );
    
    res.status(201).json({ 
      order_id: result.insertId,
      message: 'Order placed successfully' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};