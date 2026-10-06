function validateReview(req, res, next) {
    const { author, text, rating } = req.body;

    if (!author || author.trim().length < 2) {
        return res.status(400).json({
            error: true,
            message: 'Имя автора должно содержать минимум 2 символа',
            field: 'author'
        });
    }

    if (!text || text.trim().length < 2) {
        return res.status(400).json({
            error: true,
            message: 'Текст отзыва не может быть пустым',
            field: 'text'
        });
    }

    const numericRating = Number(rating);

    if (
        rating === undefined ||
        rating === null ||
        !Number.isInteger(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
    ) {
        return res.status(400).json({
            error: true,
            message: 'Оценка должна быть целым числом от 1 до 5',
            field: 'rating'
        });
    }

    next();
}
function validateBooking(req, res, next) {
    const { name, phone, email, courseId, date } = req.body;

    if (!name || name.trim().length < 2) {
        return res.status(400).json({
            error: true,
            message: 'ФИО должно содержать минимум 2 символа',
            field: 'name'
        });
    }

    const phoneRegex = /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;

    if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({
            error: true,
            message: 'Телефон должен быть в формате +7(XXX)-XXX-XX-XX',
            field: 'phone'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (email && !emailRegex.test(email)) {
        return res.status(400).json({
            error: true,
            message: 'Введите корректный email',
            field: 'email'
        });
    }

    if (!courseId) {
        return res.status(400).json({
            error: true,
            message: 'Необходимо выбрать курс',
            field: 'courseId'
        });
    }

    if (typeof courseId !== 'number') {
        return res.status(400).json({
            error: true,
            message: 'courseId должен быть числом',
            field: 'courseId'
        });
    }

    if (!date) {
        return res.status(400).json({
            error: true,
            message: 'Необходимо указать дату',
            field: 'date'
        });
    }

    next();
}

module.exports = {
    validateReview,
    validateBooking
};
