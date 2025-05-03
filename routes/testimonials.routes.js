const express = require('express');
const router = express.Router();
const db = require('./../db');
const { v4: uuidv4 } = require('uuid');

router.route('/testimonials').get((req, res) => {
  res.json(db.testimonials);
});

router.route('/testimonials/random').get((req, res) => {
  if (db.testimonials.length === 0) {
    return res.status(404).json({ message: 'Testimonial not found' });
  } else {
    const index = Math.floor(Math.random() * db.testimonials.length);
    const result = db.testimonials[index];
    res.json(result);
  }
});

router.route('/testimonials/:id').get((req, res) => {
  const id = req.params.id;
  const index = db.testimonials.findIndex(testimonial => testimonial.id == id);
  if(index === -1) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }
  const result = db.testimonials[index];
  res.json(result);
});

router.route('/testimonials').post((req, res) => {
  const { author, text} = req.body;
  if (!author || !text) {
    return res.status(400).json({ message: 'Author and text are required'});
  }
  const testimonial = {
    id: uuidv4(),
    author,
    text
  };
  db.testimonials.push(testimonial);
  res.status(201).json({ message: 'OK'});
});

router.route('/testimonials/:id').put((req, res) => {
  const  id  = req.params.id;
  const { author, text } = req.body;
  if (!author || !text) {
    return res.status(400).json({ message: 'Author and text are required'});
  }
  const index = db.testimonials.findIndex(testimonial => testimonial.id == id);
  if (index === -1){
    return res.status(404).json({ message: 'Testimonial not found' });
  } else {
    db.testimonials[index].author = author;
    db.testimonials[index].text = text;
  }
  res.status(200).json({ message: 'OK'});
});

router.route('/testimonials/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.testimonials.findIndex(testimonial => testimonial.id == id);
  if (index === -1) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }
  const deleted = db.testimonials.splice(index, 1);
  res.status(200).json({ message: 'OK'});
});

module.exports = router;