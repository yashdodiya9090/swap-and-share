const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    owner: { type: String, required: true },
    ownerName: { type: String },
    ownerEmail: { type: String },
    ownerMobile: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
