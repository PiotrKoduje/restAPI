const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  id: { type: String, required: false },
  author: { type: String, required: true },
  text: { type: String, required: true }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);