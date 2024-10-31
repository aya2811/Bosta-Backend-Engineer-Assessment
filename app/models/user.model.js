const {DataTypes } = require('sequelize');
const {sequelize} = require("../config/database");


const User = sequelize.define(
  'User',
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
        type: DataTypes.STRING,
        allowNull: false
    },
    registered_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    role: {
      type: DataTypes.ENUM(['Admin', 'Borrower']),
      defaultValue: 'Borrower',
    }

  }
);
User.sync({alter: true});


module.exports = User;