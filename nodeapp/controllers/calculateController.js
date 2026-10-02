const fs = require('fs');
const path = require('path');

function calculatePrice(req, res) {
    const { lessonsCount, duration, tariff } = req.body;

    const coefficients = {
        1: 1,
        1.2: 1.2,
        1.5: 1.5
    };

    const coefficient = coefficients[tariff];

    if (!coefficient) {
        return res.status(400).json({
            error: true,
            message: 'Неизвестный тариф',
            field: 'tariff'
        });
    }

    const BASE_PRICE_PER_MINUTE = 30;

    const totalPrice =
        BASE_PRICE_PER_MINUTE *
        duration *
        lessonsCount *
        coefficient;

    const logPath = path.join(
        __dirname,
        '../data/calculations.log'
    );

    const log = [
        `Дата: ${new Date().toISOString()}`,
        `Количество занятий: ${lessonsCount}`,
        `Длительность: ${duration} минут`,
        `Тариф: ${tariff}`,
        `Коэффициент: ${coefficient}`,
        `Итоговая стоимость: ${totalPrice} руб.`,
        '----------------------------------------'
    ].join('\n');

    fs.appendFileSync(logPath, log + '\n');

    res.json({
        lessonsCount,
        duration,
        tariff: Number(tariff),
        coefficient,
        totalPrice
    });
}

module.exports = {
    calculatePrice
};
