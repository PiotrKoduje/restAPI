const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
// const db = require('./db');
const path = require('path');
const socket = require('socket.io');
const mongoose = require('mongoose');
const Seat = require('./models/seat.model');

// IMPORT ROUTES
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();

// SERVE STATIC FILES FROM THE REACT APP
app.use(express.static(path.join(__dirname, '/client/build')));

// MIDDLEWARE
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not founds...'});
});

// CONNECT TO MONGOOSE
const uri = 'mongodb+srv://Peter:Programming445@cluster0.aqu9lhb.mongodb.net/NewWaveDB?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});
db.on('error', err => console.log('Error ' + err));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running..');
});

// WEBSOCKETS
const io = socket(server);

io.on('connection', async (socket) => {
  try {
    const seats = await Seat.find();
    io.to(socket.id).emit('startData', seats);
  } catch (err) {
    console.log('Error: ', err);
  }
});