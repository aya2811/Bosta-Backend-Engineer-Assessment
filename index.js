const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {connectDB} = require("./app/config/database");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

connectDB();

const userRoutes = require('./app/routes/user.routes');
const bookRoutes = require('./app/routes/book.routes');
const loanRoutes = require('./app/routes/loan.routes');

app.use('/api/user', userRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/loan', loanRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});