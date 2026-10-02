(function () {
    'use strict';

    const form = document.getElementById('calc-form');
    const lessonsCountInput = document.getElementById('lessons-count');
    const lessonDurationSelect = document.getElementById('lesson-duration');
    const tariffRadios = document.querySelectorAll('input[name="tariff"]');
    const totalPriceElement = document.getElementById('total-price');

    function getLessonsCount() {
        const value = parseInt(lessonsCountInput.value, 10);

        return isNaN(value) || value < 1 ? 1 : value;
    }

    function getLessonDuration() {
        const value = parseInt(lessonDurationSelect.value, 10);

        return isNaN(value) || value < 1 ? 60 : value;
    }

    function getTariff() {
        const selected = document.querySelector(
            'input[name="tariff"]:checked'
        );

        return selected ? parseFloat(selected.value) : 1;
    }

    function formatNumber(num) {
        return Math.round(num)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    // Анимация изменения стоимости
    function animatePrice(targetPrice) {
        const currentText = totalPriceElement.textContent
            .replace(/\s/g, '')
            .replace(/[^\d]/g, '');

        const startPrice = parseInt(currentText, 10) || 0;
        const duration = 600;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Плавное замедление к концу анимации
            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            const currentPrice =
                startPrice +
                (targetPrice - startPrice) * easedProgress;

            totalPriceElement.textContent =
                formatNumber(currentPrice);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    async function calculateTotal() {
        const lessonsCount = getLessonsCount();
        const duration = getLessonDuration();
        const tariff = getTariff();

        try {
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lessonsCount: lessonsCount,
                    duration: duration,
                    tariff: tariff
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Не удалось выполнить расчёт'
                );
            }

            animatePrice(data.totalPrice);

        } catch (error) {
            console.error('Ошибка калькулятора:', error);

            totalPriceElement.textContent = 'Ошибка';
        }
    }

    function bindEvents() {
        lessonsCountInput.addEventListener(
            'input',
            calculateTotal
        );

        lessonDurationSelect.addEventListener(
            'change',
            calculateTotal
        );

        tariffRadios.forEach(radio => {
            radio.addEventListener(
                'change',
                calculateTotal
            );
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            calculateTotal();
        });
    }

    function init() {
        bindEvents();
        calculateTotal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            init
        );
    } else {
        init();
    }

})();