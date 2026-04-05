const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const Game = require('../models/Game');

const router = express.Router();

// GET /api/stats - Get total counts for home page
router.get('/', async (req, res) => {
  try {
    const [userCount, bookCount, gameCount] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Game.countDocuments(),
    ]);

    res.json({
      users: userCount,
      books: bookCount,
      games: gameCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
