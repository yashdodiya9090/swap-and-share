const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

// GET /api/stats - Get total counts for home page
router.get('/', async (req, res) => {
  try {
    const [
      { count: userCount, error: userError },
      { count: bookCount, error: bookError },
      { count: gameCount, error: gameError }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('books').select('*', { count: 'exact', head: true }),
      supabase.from('games').select('*', { count: 'exact', head: true })
    ]);

    if (userError || bookError || gameError) {
       throw (userError || bookError || gameError);
    }

    res.json({
      users: userCount || 0,
      books: bookCount || 0,
      games: gameCount || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
