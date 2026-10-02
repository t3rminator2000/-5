const express = require('express');
const router = express.Router();

const {
    getBookings,
    addBooking
} = require('../controllers/bookingsController');

const {
    validateBooking
} = require('../middleware/validation');

router.get('/', getBookings);
router.post('/', validateBooking, addBooking);

module.exports = router;
