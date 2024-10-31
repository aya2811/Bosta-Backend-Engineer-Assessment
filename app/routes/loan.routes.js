const express = require('express');
const { createLoan, getAllLoans, returnBook, listBooks, listOverdue, exportAtPeriod, exportOverdueLastMonth, exportLoansLastMonth } = require('../controllers/loan.controller');
const router = express.Router();
const { verifyToken, checkAdmin } = require('../config/isAuth');


router.get('/all',checkAdmin,getAllLoans);
router.get('/overdue',checkAdmin,listOverdue);
router.get('/exportAt',checkAdmin,exportAtPeriod);
router.get('/exportOverdueLastMonth',checkAdmin,exportOverdueLastMonth);
router.get('/exportBorrowsLastMonth',checkAdmin,exportLoansLastMonth);
router.post('/:id',verifyToken, createLoan);
router.put('/:id', verifyToken,returnBook);
router.get('/:id',verifyToken,listBooks);



module.exports = router;