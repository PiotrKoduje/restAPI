const express = require('express');
const router = express.Router();
const db = require('./../db');
const { v4: uuidv4 } = require('uuid');


router.route('/concerts').get((req, res) => {
  res.json(db.concerts);
});

router.route('/concerts/:id').get((req, res) => {
  const id = req.params.id;
  const index = db.concerts.findIndex(concert => concert.id == id);
  if(index === -1) {
    return res.status(404).json({ message: 'Concert not found' });
  }
  const result = db.concerts[index];
  res.json(result);
});

router.route('/concerts').post((req, res) => {
  const { performer, genre, price, day, image} = req.body;
  if (!performer || !genre || !price || !day || !image) {
    return res.status(400).json({ message: 'All fields are required'});
  }
  const concert = {
    id: uuidv4(),
    performer,
    genre,
    price,
    day,
    image
  };
  db.concerts.push(concert);
  res.status(201).json({ message: 'OK'}); 
});

router.route('/concerts/:id').put((req, res) => {
  const  id  = req.params.id;
  const { performer, genre, price, day, image } = req.body;
  
  const index = db.concerts.findIndex(concert => concert.id == id);
  if (index === -1){
    return res.status(404).json({ message: 'Concert not found' });
  } else {
    if (performer !== undefined) db.concerts[index].performer = performer;
    if (genre !== undefined) db.concerts[index].genre = genre;
    if (price !== undefined) db.concerts[index].price = price;
    if (day !== undefined) db.concerts[index].day = day;
    if (image !== undefined) db.concerts[index].image = image;
  }
  res.status(200).json({ message: 'OK'}); 
});

router.route('/concerts/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.concerts.findIndex(concert => concert.id == id);
  if (index === -1) {
    return res.status(404).json({ message: 'Concert not found' });
  }
  const deleted = db.concerts.splice(index, 1);
  res.status(200).json({ message: 'OK'});
});

module.exports = router;