const Seat = require('../models/seat.model');
const { prepareForClient, isValid} = require('../utils');

const Collection = Seat;

exports.getAll = async (req, res) => {
  try {
    let data = await Collection.find();
    const result = prepareForClient(data, false);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Collection.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const data = await Collection.findOne().skip(rand);
    if (!data) return res.status(404).json({ message: 'Not found' });
    else {
      const result = prepareForClient(data);
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  if (!isValid(req.params.id)) {
    return res.status(404).json({ message: 'Not found' });
  }
  try {
    const data = await Collection.findById(req.params.id);
    if(!data) return res.status(404).json({ message: 'Not found' });
    else {
      const result = prepareForClient(data);
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ message: err.message});
  }
};

exports.addNew = async (req, res) => {
  const { day, seat, client, email } = req.body;
  if (!day || !seat || !client || !email) {
    return res.status(400).json({ message: 'Day, seat, client and email are required'})
  }
  try {
    const data = new Collection({ day: day, seat: seat, client: client, email: email });
    await data.save();
    const updatedSeats = await Collection.find();
    req.io.emit('seatsUpdated', updatedSeats);
    const result = prepareForClient(data);
    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateById = async (req, res) => {
  const { day, seat, client, email } = req.body;
  if (!isValid(req.params.id)) {
    return res.status(404).json({ message: 'Not found' });
  }
  if (!day || !seat || !client || !email) {
    return res.status(400).json({ message: 'Day, seat, client and email are required'})
  }
  try {
    const data = await Collection.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    else {
      data.day = day;
      data.seat = seat;
      data.client = client;
      data.email = email;
      await data.save();
      const result = prepareForClient(data);
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteById = async (req, res) => {
  if (!isValid(req.params.id)) {
    return res.status(404).json({ message: 'Not found' });
  }
  try {
    const data = await Collection.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    else {
      const dataToRemove = await Collection.deleteOne({ _id: req.params.id });
      const result = prepareForClient(data);
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};