const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /api/books — get all books with optional search and pagination
router.get('/', async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;

    // Build filter object for search
    const filter = {};
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (genre) filter.genre = { $regex: genre, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalBooks = await Book.countDocuments(filter);
    const books = await Book.find(filter).skip(skip).limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total: totalBooks,
      page: parseInt(page),
      totalPages: Math.ceil(totalBooks / parseInt(limit)),
      data: books
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET /api/books/:id — get single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid ID format', error: err.message });
  }
});

// POST /api/books — add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, genre, price, publishedDate, inStock } = req.body;

    // Validate required fields
    if (!title || !author || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'title, author, and price are required fields'
      });
    }

    const newBook = new Book({ title, author, genre, price, publishedDate, inStock });
    const savedBook = await newBook.save();

    res.status(201).json({ success: true, data: savedBook });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to add book', error: err.message });
  }
});

// PUT /api/books/:id — update a book by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, author, price } = req.body;

    // Validate required fields if provided
    if (title === '' || author === '' || price === '') {
      return res.status(400).json({
        success: false,
        message: 'title, author, and price cannot be empty'
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, data: updatedBook });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to update book', error: err.message });
  }
});

// DELETE /api/books/:id — delete a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to delete book', error: err.message });
  }
});

module.exports = router;
