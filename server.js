const express = require('express');

const app = express();

// MIDDLEWARE
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());

app.listen(6000, () => {
  console.log('Server is running on port: 6000');
});