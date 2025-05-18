const Concert = require('../models/concert.model');
const { prepareForClient, isValid} = require('../utils');

const Collection = Concert;

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
  const { performer, genre, price, day, image } = req.body;
  if (!performer || !genre || !price || !day || !image) {
    return res.status(400).json({ message: 'Performer, genre, price, day and image are required'})
  }
  try {
    const data = new Collection({ 
      performer: performer, 
      genre: genre, 
      price: price, 
      day: day, 
      image: image 
    });
    await data.save();
    const result = prepareForClient(data);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateById = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;
  if (!isValid(req.params.id)) {
    return res.status(404).json({ message: 'Not found' });
  }
  if (!performer || !genre || !price || !day || !image) {
    return res.status(400).json({ message: 'Author and text are required'})
  }
  try {
    const data = await Collection.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not founds' });
    else {
      data.performer = performer, 
      data.genre = genre, 
      data.price = price, 
      day.day = day, 
      day.image = image
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