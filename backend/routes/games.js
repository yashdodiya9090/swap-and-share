const express = require('express');
const authMiddleware = require('../middleware/auth');
const Game = require('../models/Game');

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
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, image } = req.body;
    
    if (!title || !description)
      return res.status(400).json({ message: 'Title and description are required' });

    const newGame = new Game({
      title,
      description,
      image: image || null,
      owner: req.user.id,
      ownerName: req.user.name,
      ownerEmail: req.user.email,
      ownerMobile: req.user.mobile || '',
    });

    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/games/:id - Update game (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (game.owner !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to edit this game' });

    const { title, description, image } = req.body;
    
    if (title) game.title = title;
    if (description) game.description = description;
    if (image !== undefined) game.image = image;

    const updatedGame = await game.save();
    res.json(updatedGame);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/games/:id - Delete game (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (game.owner !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this game' });

    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
