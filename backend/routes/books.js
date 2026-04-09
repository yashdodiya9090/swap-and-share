const express = require('express');
const Book = require('../models/Book');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/books - Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/books/:id - Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/books - Create book (protected)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: 'Title and description are required' });

    let image = null;
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      image = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    const book = new Book({
      title,
      description,
      image,
      owner: req.user.id,
      ownerName: req.user.name,
      ownerEmail: req.user.email,
      ownerMobile: req.user.mobile || '',
    });

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/books/:id - Update book (protected)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to edit this book' });

    const { title, description } = req.body;
    if (title) book.title = title;
    if (description) book.description = description;
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      book.image = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/books/:id - Delete book (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this book' });

    await book.deleteOne();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
