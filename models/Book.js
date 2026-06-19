const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  author: {
    type: String,
    required: [true, 'Author is required']
  },
  genre: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  publishedDate: {
    type: Date
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
