-- Create the database
CREATE DATABASE IF NOT EXISTS food_delivery;
USE food_delivery;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_address TEXT NOT NULL,
    status ENUM('pending', 'confirmed', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, image_url) VALUES
('Burger', 'Juicy beef burger with fresh vegetables', 250.00, 'image/buger.jpg'),
('Pizza', 'Classic margherita pizza with fresh basil', 300.00, 'image/pizza.jpg'),
('Pasta', 'Creamy pasta with garlic sauce', 200.00, 'image/pasta.jpg'),
('Biryani', 'Fragrant rice dish with spices and meat', 299.00, 'image/biryani.webp'),
('Hot Dog', 'Classic hot dog with toppings', 280.00, 'image/Hot_dog.jpg'),
('Sandwich', 'Fresh vegetable sandwich', 150.00, 'image/sandwich.jpg'),
('Ice Cream', 'Variety of flavored ice creams', 189.00, 'image/ice_cream.jpg'),
('Juice', 'Fresh fruit juice', 80.00, 'image/juse.jpg'); 