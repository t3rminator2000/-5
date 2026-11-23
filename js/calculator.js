// Цены за занятие в зависимости от тарифа (за 60 минут)
const prices = {
    'Выгодный': 500,
    'Комфортный': 800,
    'Усиленный': 1200
};

// Коэффициенты для разной длительности
const durationCoefficients = {
    '30 минут': 0.5,
    '45 минут': 0.75,
    '60 минут': 1.0,
    '90 минут': 1.5,
    '120 минут': 2.0
};

function calculateCost() {
    const lessonsCount = parseInt(document.querySelector('input[type="number"]').value) || 0;
    const duration = document.querySelector('select').value;
    const tariff = document.querySelector('input[name="tariff"]:checked')?.value;
    
    if (!tariff) {
        document.getElementById('total-cost').textContent = 'Выберите тариф';
        return;
    }
    
    const basePrice = prices[tariff];
    const coefficient = durationCoefficients[duration] || 1;
    const totalCost = lessonsCount * basePrice * coefficient;
    
    document.getElementById('total-cost').textContent = totalCost.toLocaleString('ru-RU') + ' ₽';
}

// Слушатели событий
document.querySelector('input[type="number"]').addEventListener('input', calculateCost);
document.querySelector('select').addEventListener('change', calculateCost);
document.querySelectorAll('input[name="tariff"]').forEach(radio => {
    radio.addEventListener('change', calculateCost);
});

// Инициализация при загрузке
calculateCost();
