const express = require('express');
const authMiddleware = require('../middleware/auth');
const Book = require('../models/Book');

const router = express.Router();

// GET /api/books - Get all books
router.get('/', async (req, res) => {
  try {
    // Fetch from MongoDB
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
// Note: image is now expected to be a URL string in req.body from UploadThing
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, image } = req.body;
    
    if (!title || !description)
      return res.status(400).json({ message: 'Title and description are required' });

    const newBook = new Book({
      title,
      description,
      image: image || null,
      owner: req.user.id,
      ownerName: req.user.name,
      ownerEmail: req.user.email,
      ownerMobile: req.user.mobile || '',
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/books/:id - Update book (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.owner !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to edit this book' });

    const { title, description, image } = req.body;
    
    if (title) book.title = title;
    if (description) book.description = description;
    if (image !== undefined) book.image = image;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/books/:id - Delete book (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.owner !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this book' });

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
