const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Book = require('./models/Book');
const Game = require('./models/Game');

async function syncItems() {
  await mongoose.connect('mongodb://localhost:27017/swapandshare');
  console.log('Connected to DB');

  const books = await Book.find({ $or: [{ ownerEmail: '' }, { ownerEmail: { $exists: false } }] });
  const games = await Game.find({ $or: [{ ownerEmail: '' }, { ownerEmail: { $exists: false } }] });

  console.log(`Syncing ${books.length} books and ${games.length} games...`);

  for (const book of books) {
    const owner = await User.findById(book.owner);
    if (owner) {
      book.ownerEmail = owner.email;
      book.ownerName = owner.name;
      book.ownerMobile = owner.mobile || '';
      await book.save();
    }
  }

  for (const game of games) {
    const owner = await User.findById(game.owner);
    if (owner) {
      game.ownerEmail = owner.email;
      game.ownerName = owner.name;
      game.ownerMobile = owner.mobile || '';
      await game.save();
    }
  }

  console.log('Sync complete!');
  process.exit(0);
}

syncItems();
