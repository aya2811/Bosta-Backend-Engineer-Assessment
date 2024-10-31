const {DataTypes } = require('sequelize');
const {sequelize} = require("../config/database");

const Book = sequelize.define(
  'Book',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ISBN: {
        type: DataTypes.STRING,
        allowNull: false
    },
    available_quantity: {
        type: DataTypes.INTEGER,
        
    },
    shelf_location: {
        type: DataTypes.STRING
    }

  }
);
Book.sync({alter: true});


module.exports = Book;