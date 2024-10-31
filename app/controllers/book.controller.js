const { Op } = require('sequelize');
const Book = require('../models/book.model');

//Create a book
exports.createBook = async(req, res) => {
    const bookDetails = {};
    if(req.body.title) bookDetails.title = req.body.title;
    if(req.body.author) bookDetails.author = req.body.author;
    if(req.body.ISBN) bookDetails.ISBN = req.body.ISBN;
    if(req.body.available_quantity) bookDetails.available_quantity = req.body.available_quantity;
    if(req.body.shelf_location) bookDetails.shelf_location = req.body.shelf_location;

    await Book.create(bookDetails)
        .then(result => {
          res.status(201).json({
            message: 'Book created successfully!'
          });
        })
        .catch(err => {
            res.status(400).json({ message: err.message });
        }); 
    }

//List all books
exports.getAllBooks = async(req, res) => {
    await Book.findAll()
        .then(books => {
            res.status(200).json({ books: books });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};

//update book's details
exports.updateBook = async(req, res) => {
    const book_id = req.params.id;
    const newBookDetails = {};
    if(req.body.title) newBookDetails.title = req.body.title;
    if(req.body.author) newBookDetails.author = req.body.author;
    if(req.body.ISBN) newBookDetails.ISBN = req.body.ISBN;
    if(req.body.available_quantity) newBookDetails.available_quantity = req.body.available_quantity;
    if(req.body.shelf_location) newBookDetails.shelf_location = req.body.shelf_location;

    await Book.findByPk(book_id)
      .then(book => {
        if (!book) {
          return res.status(404).json({ message: 'Book not found!' });
        }
        book.update(newBookDetails)
        .then(result => {
          res.status(200).json({message: 'Book updated!'});
        })
        .catch(err => {
          res.status(500).json({ message: err.message });
        })
      })
  }

//Delete a book
exports.deleteBook = async(req, res) => {
  const book_id = req.params.id;
  await Book.findByPk(book_id)
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Book not found!' });
      }
      book.destroy()
      .then(result => {
        res.status(200).json({ message: 'Book deleted!' });
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      })
  });
}

//Search for a book by title, author, or ISBN
exports.search = async(req,res) => {
  if( !req.body.title &&  !req.body.author &&  !req.body.ISBN)
  {
    return res.status(400).json({ message: 'Please enter your search terms' });
  }
  await Book.findOne({
    where: {
      [Op.or]: [{ title: req.body.title || ''}, { author: req.body.author || '' },{ISBN: req.body.ISBN || ''}],
    }
  })
  .then(books => {
    res.status(200).json({ book: books });
  })
  .catch(err => {
      res.status(500).json({ message: err.message });
  });
}

