const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/bookings.json');

function getBookings(req, res) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const bookings = JSON.parse(data);

        res.json(bookings);
    } catch (error) {
        console.error('Ошибка чтения заявок:', error);

        res.status(500).json({
            error: true,
            message: 'Не удалось загрузить заявки',
            field: null
        });
    }
}

function addBooking(req, res) {
    const {
        name,
        phone,
        email,
        courseId,
        date
    } = req.body;

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const bookings = JSON.parse(data);

        const newId =
            bookings.length > 0
                ? Math.max(...bookings.map(booking => booking.id)) + 1
                : 1;

        const newBooking = {
            id: newId,
            name,
            phone,
            email: email || '',
            courseId,
            date,
            status: 'new'
        };

        bookings.push(newBooking);

        fs.writeFileSync(
            filePath,
            JSON.stringify(bookings, null, 2),
            'utf8'
        );

        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Ошибка сохранения заявки:', error);

        res.status(500).json({
            error: true,
            message: 'Не удалось сохранить заявку',
            field: null
        });
    }
}

module.exports = {
    getBookings,
    addBooking
};
