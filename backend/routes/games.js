const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');
const { upload, cloudinary } = require('../middleware/cloudinary');

const router = express.Router();

// GET /api/games - Get all games
router.get('/', async (req, res) => {
  try {
    const { data: games, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/games/:id - Get single game
router.get('/:id', async (req, res) => {
  try {
    const { data: game, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !game) return res.status(404).json({ message: 'Game not found' });
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

    const image = req.file ? req.file.path : null;

    const { data: game, error } = await supabase
      .from('games')
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
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/games/:id - Update game (protected)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { data: game, error: findError } = await supabase
      .from('games')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !game) return res.status(404).json({ message: 'Game not found' });
    if (game.owner_id !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to edit this game' });

    const { title, description } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;

    if (req.file) {
      if (game.image) {
        const publicId = game.image.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      updates.image = req.file.path;
    }

    const { data: updatedGame, error: updateError } = await supabase
      .from('games')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;
    res.json(updatedGame);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/games/:id - Delete game (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: game, error: findError } = await supabase
      .from('games')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !game) return res.status(404).json({ message: 'Game not found' });
    if (game.owner_id !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this game' });

    if (game.image) {
      const publicId = game.image.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    const { error: deleteError } = await supabase
      .from('games')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) throw deleteError;
    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
