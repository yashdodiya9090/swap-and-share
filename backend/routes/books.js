const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');
const { upload, cloudinary } = require('../middleware/cloudinary');

const router = express.Router();

// GET /api/books - Get all books
router.get('/', async (req, res) => {
  try {
    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/books/:id - Get single book
router.get('/:id', async (req, res) => {
  try {
    const { data: book, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !book) return res.status(404).json({ message: 'Book not found' });
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

    const image = req.file ? req.file.path : null;

    const { data: book, error } = await supabase
      .from('books')
      .insert([{
        title,
        description,
        image,
        owner_id: req.user.id,
        owner_name: req.user.name,
        owner_email: req.user.email,
        owner_mobile: req.user.mobile || '',
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/books/:id - Update book (protected)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { data: book, error: findError } = await supabase
      .from('books')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !book) return res.status(404).json({ message: 'Book not found' });
    if (book.owner_id !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to edit this book' });

    const { title, description } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;

    if (req.file) {
      if (book.image) {
        const publicId = book.image.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      updates.image = req.file.path;
    }

    const { data: updatedBook, error: updateError } = await supabase
      .from('books')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/books/:id - Delete book (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: book, error: findError } = await supabase
      .from('books')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !book) return res.status(404).json({ message: 'Book not found' });
    if (book.owner_id !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this book' });

    if (book.image) {
      const publicId = book.image.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    const { error: deleteError } = await supabase
      .from('books')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) throw deleteError;
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
