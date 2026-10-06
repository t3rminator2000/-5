/**
 * Калькулятор стоимости обучения
 * Формула: базовая_цена_за_минуту × продолжительность × кол-во_занятий × коэффициент_тарифа
 */

(function () {
    'use strict';

    // Базовая цена за минуту (руб)
    const BASE_PRICE_PER_MINUTE = 30;

    // DOM-элементы
    const form = document.getElementById('calc-form');
    const lessonsCountInput = document.getElementById('lessons-count');
    const lessonDurationSelect = document.getElementById('lesson-duration');
    const tariffRadios = document.querySelectorAll('input[name="tariff"]');
    const totalPriceElement = document.getElementById('total-price');

    /**
     * Получает выбранный коэффициент тарифа
     * @returns {number}
     */
    function getTariffCoefficient() {
        const selected = document.querySelector('input[name="tariff"]:checked');
        return selected ? parseFloat(selected.value) : 1.0;
    }

    /**
     * Получает количество занятий
     * @returns {number}
     */
    function getLessonsCount() {
        const value = parseInt(lessonsCountInput.value, 10);
        return isNaN(value) || value < 1 ? 1 : value;
    }

    /**
     * Получает длительность занятия в минутах
     * @returns {number}
     */
    function getLessonDuration() {
        const value = parseInt(lessonDurationSelect.value, 10);
        return isNaN(value) || value < 1 ? 60 : value;
    }

    /**
     * Форматирует число с пробелами (1000 → 1 000)
     * @param {number} num
     * @returns {string}
     */
    function formatNumber(num) {
        return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    /**
     * Основной расчёт стоимости
     */
    function calculateTotal() {
        const lessonsCount = getLessonsCount();
        const duration = getLessonDuration();
        const tariff = getTariffCoefficient();

        const total = BASE_PRICE_PER_MINUTE * duration * lessonsCount * tariff;

        // Анимация изменения числа
        animateValue(totalPriceElement, total, 400);
    }

    /**
     * Анимация плавного изменения числа
     * @param {HTMLElement} element
     * @param {number} endValue
     * @param {number} duration - длительность анимации в мс
     */
    function animateValue(element, endValue, duration) {
        const startValue = parseInt(element.textContent.replace(/\s/g, ''), 10) || 0;
        const range = endValue - startValue;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Функция плавности (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + range * easeOut;

            element.textContent = formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Навешивает обработчики событий на все поля формы
     */
    function bindEvents() {
        // Изменение количества занятий
        lessonsCountInput.addEventListener('input', calculateTotal);

        // Изменение длительности
        lessonDurationSelect.addEventListener('change', calculateTotal);

        // Изменение тарифа
        tariffRadios.forEach(radio => {
            radio.addEventListener('change', calculateTotal);
        });
    }

    // Инициализация при загрузке
    function init() {
        bindEvents();
        calculateTotal();
    }

    // Запуск после полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
