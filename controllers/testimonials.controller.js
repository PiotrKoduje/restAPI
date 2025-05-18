const Testimonial = require('../models/testimonial.model');
const { prepareForClient, isValid} = require('../utils');

const Collection = Testimonial;

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
  const { author, text } = req.body;
  if (!author || !text) {
    return res.status(400).json({ message: 'Author and text are required'})
  }
  try {
    const data = new Collection({ author: author, text: text });
    await data.save();
    const result = prepareForClient(data);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateById = async (req, res) => {
  const { author, text } = req.body;
  if (!isValid(req.params.id)) {
    return res.status(404).json({ message: 'Not found' });
  }
  if (!author || !text) {
    return res.status(400).json({ message: 'Author and text are required'})
  }
  try {
    const data = await Collection.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    else {
      data.author = author;
      data.text = text;
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
