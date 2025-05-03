const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

// import routes
const testimonialsRoutes = require('./routes/testimonials.routes')


const app = express();

// MIDDLEWARE
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());


app.use(testimonialsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...'});
});

app.listen(6000, () => {
  console.log('Server is running on port: 6000');
});