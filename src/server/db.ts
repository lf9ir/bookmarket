import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'database.sqlite');

let db: Database.Database;

export function initDb() {
  db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('buyer', 'seller', 'admin')) DEFAULT 'buyer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT,
      category TEXT,
      condition TEXT CHECK(condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
      price_sell DECIMAL(10, 2),
      price_rent DECIMAL(10, 2),
      seller_id INTEGER NOT NULL,
      stock INTEGER DEFAULT 1,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status TEXT CHECK(status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      type TEXT CHECK(type IN ('buy', 'rent')) NOT NULL,
      rental_duration INTEGER, -- in days
      price DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (book_id) REFERENCES books(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (book_id) REFERENCES books(id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (book_id) REFERENCES books(id),
      UNIQUE(user_id, book_id)
    );
  `);

  // Insert sample data if empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    db.exec(`
      INSERT INTO users (name, email, password, role) VALUES 
      ('Admin User', 'admin@example.com', '$2a$10$Xb7/e00z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z', 'admin'),
      ('Seller One', 'seller@example.com', '$2a$10$Xb7/e00z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z', 'seller'),
      ('Buyer One', 'buyer@example.com', '$2a$10$Xb7/e00z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z', 'buyer');

      INSERT INTO books (title, author, description, category, condition, price_sell, price_rent, seller_id, stock, image_url) VALUES
      ('The Great Gatsby', 'F. Scott Fitzgerald', 'A classic novel of the Jazz Age.', 'Fiction', 'good', 15.99, 2.99, 2, 5, 'https://picsum.photos/seed/gatsby/400/600'),
      ('Introduction to Algorithms', 'Thomas H. Cormen', 'Comprehensive textbook on algorithms.', 'Textbook', 'like_new', 85.00, 15.00, 2, 2, 'https://picsum.photos/seed/algorithms/400/600'),
      ('Clean Code', 'Robert C. Martin', 'A Handbook of Agile Software Craftsmanship.', 'Technology', 'new', 45.00, 8.00, 2, 10, 'https://picsum.photos/seed/cleancode/400/600'),
      ('Dune', 'Frank Herbert', 'Epic science fiction novel.', 'Sci-Fi', 'fair', 12.50, 1.99, 2, 1, 'https://picsum.photos/seed/dune/400/600');
    `);
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
