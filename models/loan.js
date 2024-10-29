const {DataTypes } = require('sequelize');
const db = require("../config/database");

const Loan = db.define(
  'Loan',
  {
    borrower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Borrower',
          key: 'id',
        },
        onDelete: 'CASCADE',
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Book',
          key: 'id',
        },
        onDelete: 'CASCADE',
    },
    loan_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false ,
        validate: {
            isGreaterThanLoanDate(value) {
                if (value > this.loan_date) {
                  throw new Error('due_date must be greater than loan_date.');
                }
              }
        }
    },
    return_date: {
        type: DataTypes.DATE
    },
    loan_status: {
        type: DataTypes.ENUM('OnLoan, Overdue, Returned'),
        defaultValue: 'OnLoan',
    }

  },
  {
    Indexes: [
        {
            name: 'book_borrower',
            fields: ['book_id', 'borrower_id']
        }
    ]
  }
);
Loan.sync({alter: true});


module.exports = Loan;