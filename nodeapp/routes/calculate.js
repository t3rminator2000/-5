const express = require('express');
const router = express.Router();

const {
    calculatePrice
} = require('../controllers/calculateController');

router.post('/', calculatePrice);

module.exports = router;
