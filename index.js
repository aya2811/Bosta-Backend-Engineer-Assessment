const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const {connectDB} = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

connectDB();

// const borrowerRoutes = require('./routes/borrowerRoutes');
// const bookRoutes = require('./routes/bookRoutes');

// app.use('/api', borrowerRoutes);
// app.use('/api/book', bookRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});