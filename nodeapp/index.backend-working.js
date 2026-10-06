const express = require('express');
const calculateRouter = require('./routes/calculate');
const reviewsRouter = require('./routes/reviews');
const coursesRouter = require('./routes/courses');
const bookingsRouter = require('./routes/bookings');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/courses', coursesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/calculate', calculateRouter);

app.get('/', (req, res) => {
    res.json({
        message: 'API работает!'
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: 'Маршрут не найден',
        field: null
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: true,
        message: 'Внутренняя ошибка сервера',
        field: null
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});
