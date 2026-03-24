import express from 'express';
import { getDb } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', authenticate, (req: any, res: any) => {
  try {
    const { items } = req.body; // items: [{ book_id, quantity, type, rental_duration, price }]
    const userId = req.user.id;
    const db = getDb();

    // Calculate total price
    const totalPrice = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    db.transaction(() => {
      // Create order
      const orderStmt = db.prepare('INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)');
      const orderInfo = orderStmt.run(userId, totalPrice, 'completed');
      const orderId = orderInfo.lastInsertRowid;

      // Insert order items and update stock
      const itemStmt = db.prepare('INSERT INTO order_items (order_id, book_id, quantity, type, rental_duration, price) VALUES (?, ?, ?, ?, ?, ?)');
      const stockStmt = db.prepare('UPDATE books SET stock = stock - ? WHERE id = ?');

      for (const item of items) {
        itemStmt.run(orderId, item.book_id, item.quantity, item.type, item.rental_duration || null, item.price);
        stockStmt.run(item.quantity, item.book_id);
      }
    })();

    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user orders
router.get('/', authenticate, (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const db = getDb();

    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    
    // Fetch items for each order
    const ordersWithItems = orders.map((order: any) => {
      const items = db.prepare('SELECT order_items.*, books.title, books.image_url FROM order_items JOIN books ON order_items.book_id = books.id WHERE order_id = ?').all(order.id);
      return { ...order, items };
    });

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
