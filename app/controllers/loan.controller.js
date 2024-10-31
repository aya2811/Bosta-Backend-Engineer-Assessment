const Loan = require('../models/loan.model');
const Book = require('../models/book.model');
const { Op } = require('sequelize');
const User = require('../models/user.model');
const fs = require('fs')
const converter = require('json-2-csv');

//Create a loan
exports.createLoan = async(req, res) => {
    const borrower_id = req.params.id;
    const book_id = req.body.book_id;
    if(!book_id)
    {
        return res
            .status(400)
            .json({ message: "Please Input Book ID" });
    }
    await Book.findByPk(book_id)
    .then(book =>{
        if (!book) return res.status(404).json({ message: 'Book not found!' });

        let available_quantity = book.dataValues.available_quantity  ;
        if(available_quantity == 0 ) {
            return res.status(404).json({ message: 'Sorry, There is no available copies left :(' });
        }

        User.findByPk(borrower_id)
        .then(borrower => {
            if (!borrower) return res.status(404).json({ message: 'User not found!' });

            borrower.getLoans({where:{loan_status: {[Op.or]: ['OnLoan', 'Overdue']},BookId: book_id}})
            .then(result => {
                if(result.length > 0) return res.status(400).json({ message: 'You already have this book !!' });
                Loan.create({BookId:book_id, UserId:borrower_id,due_date : new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000)})
                .then(result =>{
                    book.update({available_quantity:available_quantity-1});
                    res.status(201).json({message: 'Loan created successfully!', loan: result});
                })
            })
        })
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    }); 

}

//list all current loans (OnLoan or overdue)
exports.getAllLoans = async(req,res) => {
    await Loan.update({loan_status:'Overdue'},{where:{due_date: {[Op.lt]: Date.now()},loan_status: 'OnLoan'}})
    .then(result => {
            Loan.findAll({
                include:[ 
                    {
                        model: Book,
                        attributes: ['title','author','ISBN']
                    },
                    {
                        model: User,
                        attributes: ['name','email']   
                    }],
                where: {
                    loan_status: {[Op.or]: ['OnLoan', 'Overdue'] }
                },
                attributes: ['loan_date','due_date','loan_status']
            })
            .then(loans => {
                  res.status(200).json({ Loans: loans });
            })
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    }); 
}

//borrower return a book
exports.returnBook = async(req,res) => {
    const borrower_id = req.params.id;
    const book_id = req.body.book_id;

    if(!book_id)
    {
        return res.status(400).json({ message: "Please Input Book ID" });
    }
    await Loan.findOne({
                    attributes: ['id','loan_date','due_date','loan_status'],
                    where: {
                        BookId:book_id,
                        UserId:borrower_id, 
                        loan_status: {[Op.or]: ['OnLoan', 'Overdue'] }
                    }})
    .then(loan => {
        if (!loan) {
          return res.status(404).json({ message: 'Loan not found!' });
        }
        console.log(loan);
        loan.update({loan_status:'Returned', return_date:Date.now()})
        .then(result => {    
            Book.findByPk(book_id)
            .then( book => {
                book.update({available_quantity:book.dataValues.available_quantity+1});
                res.status(200).json({message: 'Book returned successfully!'});
            })
        })
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    }); 
    
}

//borrower check books he have
exports.listBooks = async(req,res) => {
    const borrower_id = req.params.id;
    await User.findByPk(borrower_id)
        .then(borrower => {
            if (!borrower) return res.status(404).json({ message: 'User not found!' });
            Loan.update(
                {loan_status:'Overdue'},
                {where:
                    {due_date: {[Op.lt]: Date.now()},
                    loan_status: 'OnLoan',
                    UserId: borrower_id
                    }
                })
            .then(result => {
                Book.findAll({
                    include:[ 
                        {
                            model: Loan,
                            attributes:[] ,
                            where: {
                                loan_status: {[Op.or]: ['OnLoan', 'Overdue'] }
                            }
                        }],
                    attributes: ['title','author','ISBN'],
                    
                })
                .then(books =>{
                    console.log(books)
                    res.status(200).json({Books: books});
                })
            })
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
}

exports.listOverdue = async(req,res) => {
    await Loan.update({loan_status:'Overdue'},{where:{due_date: {[Op.lt]: Date.now()},loan_status: 'OnLoan'}})
      .then(result => {
                Loan.findAll({
                    include:[ 
                        {
                            model: Book,
                            attributes: ['title','author','ISBN']
                        },
                        {
                            model: User,
                            attributes: ['name','email']   
                        }],
                    where: {
                        loan_status: {[Op.or]: ['Overdue'] }
                    },
                    attributes: ['loan_date','due_date','loan_status']
                })
              .then(loans => {
                  res.status(200).json({ Loans: loans });
              })
              .catch(err => {
                  res.status(500).json({ message: err.message });
              });
      })

}

exports.exportAtPeriod = async(req,res) => {
    const from = req.body.from;
    const to = req.body.to;
    if(!from && !to )
    {
        return res.status(400).json({ message: "Please Enter the spesefic period" });
    }
    await Loan.update({loan_status:'Overdue'},
                    {where:{
                        due_date: {[Op.lt]: Date.now()},
                        loan_date:  {[Op.lte]: to , [Op.gte]:from},
                        loan_status: 'OnLoan'}})
        .then(result=>{
            Loan.findAll({
                include:[{
                    model: Book,
                    attributes: ['title','author','ISBN'],
                },
                {
                    model: User,
                    attributes: ['name','email'] ,
                }]
                ,where: {
                    loan_date:  {[Op.lte]: to , [Op.gte]:from}
                },
                attributes: ['loan_date','due_date','loan_status'],
            })
            .then(loans => {
                const data = JSON.parse(JSON.stringify(loans));
                
                const csv = converter.json2csv(data, {expandNestedObjects:true});
        
                
                fs.writeFile('./files/Loans_at_period.csv', csv, (err) => {
                  if (err) throw err;
                  res.status(200).json('CSV file has been saved!' )
                });
            })
            
        })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
}

exports.exportOverdueLastMonth = async(req,res) =>{
    const from = new Date();
    from.setMonth(from.getMonth() - 1);
    const to = Date.now();
    await Loan.update({loan_status:'Overdue'},
        {where:{
            due_date: {[Op.lte]: to , [Op.gte]:from },
            loan_status: 'OnLoan'}})
        .then(result=>{
            Loan.findAll({
                include:[{
                    model: Book,
                    attributes: ['title','author','ISBN'],
                },
                {
                    model: User,
                    attributes: ['name','email'] ,
                }]
                ,where: {
                    due_date:  {[Op.lte]: to , [Op.gte]:from},
                    loan_status: 'Overdue'
                },
                attributes: ['loan_date','due_date','loan_status'],
            })
            .then(loans => {
                const data = JSON.parse(JSON.stringify(loans));
                
                const csv = converter.json2csv(data, {expandNestedObjects:true});

                
                fs.writeFile('./files/Overdue_last_month.csv', csv, (err) => {
                if (err) throw err;
                res.status(200).json('CSV file has been saved!' )
                });
            })

            })
        .catch(err => {
        res.status(500).json({ message: err.message });
        });
}

exports.exportLoansLastMonth = async(req,res) => {
    const from = new Date();
    from.setMonth(from.getMonth() - 1);
    const to = Date.now();
    await Loan.update({loan_status:'Overdue'},
        {where:{
            loan_date: {[Op.lte]: to , [Op.gte]:from },
            due_date: {[Op.lt]: Date.now()},
            loan_status: 'OnLoan'}})
        .then(result=>{
            Loan.findAll({
                include:[{
                    model: Book,
                    attributes: ['title','author','ISBN'],
                },
                {
                    model: User,
                    attributes: ['name','email'] ,
                }]
                ,where: {
                    loan_date:  {[Op.lte]: to , [Op.gte]:from}
                },
                attributes: ['loan_date','due_date','loan_status'],
            })
            .then(loans => {
                const data = JSON.parse(JSON.stringify(loans));
                
                const csv = converter.json2csv(data, {expandNestedObjects:true});

                
                fs.writeFile('./files/Borrows_last_month.csv', csv, (err) => {
                if (err) throw err;
                res.status(200).json('CSV file has been saved!' )
                });
            })

            })
        .catch(err => {
        res.status(500).json({ message: err.message });
        });

}