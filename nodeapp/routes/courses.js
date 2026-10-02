const express = require('express');
const router = express.Router();

const { getCourses } = require('../controllers/coursesController');

router.get('/', getCourses);

module.exports = router;
