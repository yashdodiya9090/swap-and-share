const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const gameRoutes = require('./routes/games');
const statsRoutes = require('./routes/stats');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images (Legacy support if any local uploads exist)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/stats', statsRoutes);

// Catch-all route for frontend (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start server
const port = process.env.PORT || 7860;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log('✅ Connected to Supabase backend layer');
});
