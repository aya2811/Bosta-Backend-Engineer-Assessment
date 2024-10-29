const { Sequelize } = require('sequelize');


exports.connectDB = async() =>{
  const sequelize = new Sequelize(process.env.DATABASE, process.env.USERNAME, process.env.PASSWORD, {
    host: 'localhost',
    dialect: 'postgres' 
  });

    try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}