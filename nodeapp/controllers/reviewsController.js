const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/reviews.json');

function getReviews(req, res) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const reviews = JSON.parse(data);

        res.json(reviews);
    } catch (error) {
        console.error('Ошибка чтения отзывов:', error);

        res.status(500).json({
            error: true,
            message: 'Не удалось загрузить отзывы',
            field: null
        });
    }
}

function addReview(req, res) {
    const { author, text, rating } = req.body;

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const reviews = JSON.parse(data);

        const newId =
            reviews.length > 0
                ? Math.max(...reviews.map(review => review.id)) + 1
                : 1;

        const newReview = {
            id: newId,
            author,
            text,
            rating: Number(rating)
        };

        reviews.push(newReview);

        fs.writeFileSync(
            filePath,
            JSON.stringify(reviews, null, 2),
            'utf8'
        );

        res.status(201).json(newReview);
    } catch (error) {
        console.error('Ошибка сохранения отзыва:', error);

        res.status(500).json({
            error: true,
            message: 'Не удалось сохранить отзыв',
            field: null
        });
    }
}

module.exports = {
    getReviews,
    addReview
};
