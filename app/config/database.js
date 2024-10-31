const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require( __dirname + "/database.config.js" )[ env ];

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

connectDB = async() =>{
    try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    } catch (error) {
    console.error('Unable to connect to the database:', error);
    }
}
module.exports = {sequelize,connectDB};