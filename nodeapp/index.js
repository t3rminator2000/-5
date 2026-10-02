const express = require('express');
const path = require('path');

const coursesRouter = require('./routes/courses');
const reviewsRouter = require('./routes/reviews');
const bookingsRouter = require('./routes/bookings');
const calculateRouter = require('./routes/calculate');

const app = express();

const PORT = process.env.PORT || 3000;

// JSON
app.use(express.json());

// API
app.use('/api/courses', coursesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/calculate', calculateRouter);

// Frontend
const frontendPath = path.join(__dirname, '../frontend');

app.use(express.static(frontendPath));

// 404
app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: 'Маршрут не найден',
        field: null
    });
});

// 500
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: true,
        message: 'Внутренняя ошибка сервера',
        field: null
    });
});

// Запуск
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});
