const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const db = [
  { id: 1, author: 'John Doe', text: 'This company is worth every coin!' },
  { id: 2, author: 'Amanda Doe', text: 'They really know how to make you happy.' },
];

const app = express();

// MIDDLEWARE
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());

// ENDPOINTS
app.get('/testimonials', (req, res) => {
  res.json(db);
});

app.get('/testimonials/random', (req, res) => {
  if (db.length === 0) {
    return res.status(404).json({ message: 'Testimonial not found' });
  } else {
    const index = Math.floor(Math.random() * db.length);
    const result = db[index];
    res.json(result);
  }
});

app.get('/testimonials/:id', (req, res) => {
  const id = req.params.id;
  const index = db.findIndex(testimonial => testimonial.id == id);
  if(index === -1) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }
  const result = db[index];
  res.json(result);
});

app.post('/testimonials', (req, res) => {
  const { author, text} = req.body;
  if (!author || !text) {
    return res.status(400).json({ message: 'Author and text are required'});
  }
  const testimonial = {
    id: uuidv4(),
    author,
    text
  };
  db.push(testimonial);
  res.status(201).json({ message: 'OK'});
});

app.put('/testimonials/:id', (req, res) => {
  const  id  = req.params.id;
  const { author, text } = req.body;
  if (!author || !text) {
    return res.status(400).json({ message: 'Author and text are required'});
  }
  const index = db.findIndex(testimonial => testimonial.id == id);
  if (index === -1){
    return res.status(404).json({ message: 'Testimonial not found' });
  } else {
    db[index].author = author;
    db[index].text = text;
  }
  res.status(200).json({ message: 'OK'});
});

app.delete('/testimonials/:id', (req, res) => {
  const id = req.params.id;
  const index = db.findIndex(testimonial => testimonial.id == id);
  if (index === -1) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }
  const deleted = db.splice(index, 1);
  res.status(200).json({ message: 'OK'});
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...'});
});

app.listen(6000, () => {
  console.log('Server is running on port: 6000');
});