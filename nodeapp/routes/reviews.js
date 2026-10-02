const express = require('express');
const router = express.Router();

const {
    getReviews,
    addReview
} = require('../controllers/reviewsController');

const {
    validateReview
} = require('../middleware/validation');

router.get('/', getReviews);
router.post('/', validateReview, addReview);

module.exports = router;
