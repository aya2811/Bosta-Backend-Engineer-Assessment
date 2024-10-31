const {DataTypes } = require('sequelize');
const {sequelize} = require("../config/database");
const User = require('./user.model');
const Book = require('./book.model');

const Loan = sequelize.define(
  'Loan',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
                if (value < this.loan_date) {
                  throw new Error('due_date must be greater than loan_date.');
                }
              }
        }
    },
    return_date: {
        type: DataTypes.DATE
    },
    loan_status: {
        type: DataTypes.ENUM(['OnLoan', 'Overdue', 'Returned']),
        defaultValue: 'OnLoan',
    }

  }
);

Book.belongsToMany(User, { through: {model: Loan,unique: false} ,foreignKey: 'BookId',constraints: false});
User.belongsToMany(Book, { through: {model: Loan,unique: false} ,foreignKey: 'UserId',constraints: false});
User.hasMany(Loan);
Loan.belongsTo(User);
Book.hasMany(Loan);
Loan.belongsTo(Book);

Loan.sync({alter: true});


module.exports = Loan;