const express = require('express');
const { createBook, getAllBooks,search, deleteBook, updateBook} = require('../controllers/book.controller');
const { checkAdmin, verifyToken } = require('../config/isAuth');
const router = express.Router();

router.get('/', checkAdmin,getAllBooks);
router.post('/',checkAdmin, createBook);
router.get('/search',verifyToken,search);
router.put('/:id',checkAdmin,updateBook);
router.delete('/:id',checkAdmin,deleteBook);


module.exports = router;