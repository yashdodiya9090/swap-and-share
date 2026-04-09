const express = require('express');
const Game = require('../models/Game');
const authMiddleware = require('../middleware/auth');
const { upload, cloudinary } = require('../middleware/cloudinary');

const router = express.Router();

// GET /api/games - Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/games/:id - Get single game
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/games - Create game (protected)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: 'Title and description are required' });

    // Cloudinary gives us req.file.path as the secure URL
    const image = req.file ? req.file.path : null;

    const game = new Game({
      title,
      description,
      image,
      owner: req.user.id,
      ownerName: req.user.name,
      ownerEmail: req.user.email,
      ownerMobile: req.user.mobile || '',
    });

    await game.save();
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/games/:id - Update game (protected)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (game.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to edit this game' });

    const { title, description } = req.body;
    if (title) game.title = title;
    if (description) game.description = description;

    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (game.image) {
        const publicId = game.image.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      game.image = req.file.path;
    }

    await game.save();
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/games/:id - Delete game (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (game.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this game' });

    // Delete image from Cloudinary
    if (game.image) {
      const publicId = game.image.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    await game.deleteOne();
    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
