const express = require('express');
const router = express.Router();
const SeatsController = require('../controllers/seats.controller');


router.get('/seats',SeatsController.getAll);
router.get('/seats/random', SeatsController.getRandom);
router.get('/seats/:id', SeatsController.getById);
router.post('/seats', SeatsController.addNew);
router.put('/seats/:id', SeatsController.updateById);
router.delete('/seats/:id', SeatsController.deleteById);

module.exports = router;