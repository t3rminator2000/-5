// Цены за 1 час (60 минут) в рублях
const PRICES = {
  economy: 800,   // Выгодный
  comfort: 1200,  // Комфортный
  premium: 1800,  // Усиленный
};

const lessonsInput = document.getElementById('lessons');
const durationSelect = document.getElementById('duration');
const tariffRadios = document.querySelectorAll('input[name="tariff"]');
const totalElement = document.getElementById('total');

function calculateTotal() {
  try {
    // Получаем количество занятий
    const lessons = parseInt(lessonsInput.value, 10);
    if (isNaN(lessons) || lessons < 1) {
      totalElement.textContent = '0';
      return;
    }

    // Получаем длительность в минутах
    const duration = parseInt(durationSelect.value, 10);

    // Получаем выбранный тариф
    let tariff = 'economy';
    tariffRadios.forEach((radio) => {
      if (radio.checked) tariff = radio.value;
    });

    // Базовая цена за час
    const pricePerHour = PRICES[tariff];

    // Пересчитываем цену под выбранную длительность
    const pricePerLesson = (pricePerHour * duration) / 60;

    // Итоговая стоимость
    const total = Math.round(pricePerLesson * lessons);

    // Форматируем с пробелами (например: 12 000)
    totalElement.textContent = total.toLocaleString('ru-RU');
  } catch (error) {
    totalElement.textContent = 'Ошибка';
    console.error('Ошибка расчёта:', error);
  }
}

// Слушатели событий — пересчёт при любом изменении
lessonsInput.addEventListener('input', calculateTotal);
durationSelect.addEventListener('change', calculateTotal);
tariffRadios.forEach((radio) => {
  radio.addEventListener('change', calculateTotal);
});

// Первичный расчёт при загрузке страницы
calculateTotal();
