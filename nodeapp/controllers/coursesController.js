const fs = require('fs');
const path = require('path');

function getCourses(req, res) {
    const filePath = path.join(__dirname, '../data/courses.json');

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const courses = JSON.parse(data);

        res.json(courses);
    } catch (error) {
        console.error('Ошибка чтения курсов:', error);

        res.status(500).json({
            error: true,
            message: 'Не удалось загрузить курсы',
            field: null
        });
    }
}

module.exports = {
    getCourses
};
