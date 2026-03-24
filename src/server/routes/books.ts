import express from 'express';
import { getDb } from '../db.js';

const router = express.Router();

// Get all books with optional filters
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { search, category, condition, minPrice, maxPrice } = req.query;

    let query = 'SELECT books.*, users.name as seller_name FROM books JOIN users ON books.seller_id = users.id WHERE stock > 0';
    const params: any[] = [];

    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (condition) {
      query += ' AND condition = ?';
      params.push(condition);
    }
    if (minPrice) {
      query += ' AND price_sell >= ?';
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += ' AND price_sell <= ?';
      params.push(Number(maxPrice));
    }

    query += ' ORDER BY created_at DESC';

    const books = db.prepare(query).all(...params);
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single book
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const book = db.prepare('SELECT books.*, users.name as seller_name FROM books JOIN users ON books.seller_id = users.id WHERE books.id = ?').get(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Fetch reviews
    const reviews = db.prepare('SELECT reviews.*, users.name as user_name FROM reviews JOIN users ON reviews.user_id = users.id WHERE book_id = ? ORDER BY created_at DESC').all(req.params.id);
    
    res.json({ ...book, reviews });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
