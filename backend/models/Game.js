const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName: { type: String },
    ownerEmail: { type: String },
    ownerMobile: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
