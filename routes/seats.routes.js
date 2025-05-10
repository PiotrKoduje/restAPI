const express = require('express');
const router = express.Router();
const db = require('./../db');
const { v4: uuidv4 } = require('uuid');

router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

router.route('/seats/:id').get((req, res) => {
  const id = req.params.id;
  const index = db.seats.findIndex(seat => seat.id == id);
  if(index === -1) {
    return res.status(404).json({ message: 'Seat not found' });
  }
  const result = db.seats[index];
  res.json(result);
});

router.route('/seats').post((req, res) => {
  const { day, seat, client, email} = req.body;
  if (!day || !seat || !client || !email) {
    return res.status(400).json({ message: 'All fields are required'});
  }

  const seatsOfDay = db.seats.filter(reservation => reservation.day === day);
  const isSeatBusy = seatsOfDay.some(reservation => reservation.seat === seat);
  if (isSeatBusy) {
    return res.status(400).json({ message: 'The slot is already taken...'});
  }

  if (seat < 1 || seat > 50){
    return res.status(400).json({ message: 'There are only 50 seats'});
  }
  
  const newSeat = {
    id: uuidv4(),
    day,
    seat,
    client,
    email
  };
  db.seats.push(newSeat);
  res.status(201).json({ message: 'OK'});
});

router.route('/seats/:id').put((req, res) => {
  const  id  = req.params.id;
  const { day, seat, client, email } = req.body;
  
  const index = db.seats.findIndex(seat => seat.id == id);
  if (index === -1){
    return res.status(404).json({ message: 'Seat not found' });
    
  } else {
    if (day !== undefined) db.seats[index].day = day;
    if (seat !== undefined) db.seats[index].seat = seat;
    if (client !== undefined) db.seats[index].client = client;
    if(email !== undefined) db.seats[index].email = email;
  }
  res.status(200).json({ message: 'OK'});
  console.log(index); 
});

router.route('/seats/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.seats.findIndex(seat => seat.id == id);
  if (index === -1) {
    return res.status(404).json({ message: 'Seat not found' });
  }
  const deleted = db.seats.splice(index, 1);
  res.status(200).json({ message: 'OK'});
});

module.exports = router;