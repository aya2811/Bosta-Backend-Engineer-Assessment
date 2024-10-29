const {DataTypes } = require('sequelize');
const db = require("../config/database");


const Borrower = db.define(
  'Borrower',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    registered_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

  }
);
Borrower.sync({alter: true});


module.exports = Borrower;