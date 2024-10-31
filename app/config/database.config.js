require( "dotenv" ).config();
const { DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } = process.env;
module.exports = {
   development: {
      username: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      host: DATABASE_HOST,
      dialect: "postgres",
      define: {
         timestamps: false,
       },
   },
   test: {
      username: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      host: DATABASE_HOST,
      dialect: "postgres"
   },
   production: {
      username: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      host: DATABASE_HOST,
      dialect: "postgres"
   }
}


// const { Sequelize } = require('@sequelize/core');
// const { PostgresDialect } = require('@sequelize/postgres');
// const dotenv = require('dotenv');
// dotenv.config();

// exports.connectDB = async() =>{
//   const sequelize = new Sequelize({
//     dialect: PostgresDialect,
//     database: process.env.DATABASE,
//     user: process.env.USERNAME,
//     password: process.env.PASSWORD,
//     host: process.env.HOST,
//     port: 5432,
//     ssl: false,
//     clientMinMessages: 'notice',
//   });

//     try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }