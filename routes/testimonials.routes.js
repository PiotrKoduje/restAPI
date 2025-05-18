const express = require('express');
const router = express.Router();
const TestimonialsController = require('../controllers/testimonials.controller');

router.get('/testimonials', TestimonialsController.getAll);
router.get('/testimonials/random', TestimonialsController.getRandom);
router.get('/testimonials/:id', TestimonialsController.getById);
router.post('/testimonials', TestimonialsController.addNew);
router.put('/testimonials/:id', TestimonialsController.updateById);
router.delete('/testimonials/:id', TestimonialsController.deleteById);

module.exports = router;