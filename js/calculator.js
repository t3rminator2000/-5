/**
 * calculator.js
 * Калькулятор стоимости обучения (courses.html).
 * Расчёт больше не делается в браузере — при изменении любого поля
 * данные уходят на сервер (POST /api/calculate), а результат приходит оттуда.
 *
 * Разметка (courses.html):
 * <form id="calc-form">
 *   <input id="lessons-count" type="number" ...>
 *   <select id="lesson-duration">...</select>
 *   <input type="radio" name="tariff" value="1.0" ...>
 * </form>
 * <div class="calculator__result">
 *   Итоговая стоимость: <span id="total-price">0</span> ₽
 * </div>
 *
 * Подключать после js/api.js.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calc-form');
  const resultEl = document.getElementById('total-price');
  if (!form || !resultEl) return;

  const resultBlock = resultEl.closest('.calculator__result');
  const lessonsInput = document.getElementById('lessons-count');
  const durationSelect = document.getElementById('lesson-duration');

  let debounceTimer = null;
  let requestId = 0; // защита от «гонки» ответов, если предыдущий запрос ещё не вернулся

  function getTariff() {
    const checked = form.querySelector('input[name="tariff"]:checked');
    return checked ? Number(checked.value) : 1.0;
  }

  async function recalculate() {
    const lessonsCount = Number(lessonsInput.value);
    const duration = Number(durationSelect.value);
    const tariff = getTariff();

    if (!lessonsCount || lessonsCount < 1) {
      resultEl.textContent = '0';
      return;
    }

    const currentRequest = ++requestId;
    setLoading(true);

    const result = await calculatePrice({ lessonsCount, duration, tariff });

    // если пользователь успел изменить поля ещё раз — этот ответ уже неактуален
    if (currentRequest !== requestId) return;
    setLoading(false);

    if (result.success) {
      resultEl.textContent = result.data.totalPrice;
      if (resultBlock) {
        resultBlock.classList.remove('calculator__result--error');
        resultBlock.removeAttribute('title');
      }
    } else {
      resultEl.textContent = '—';
      if (resultBlock) {
        resultBlock.classList.add('calculator__result--error');
        resultBlock.title = result.error;
      }
    }
  }

  function setLoading(isLoading) {
    if (isLoading) resultEl.textContent = '…';
    if (resultBlock) resultBlock.classList.toggle('calculator__result--loading', isLoading);
  }

  // Число занятий — пересчитываем с небольшой задержкой, чтобы не слать запрос на каждый ввод символа
  lessonsInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(recalculate, 400);
  });

  // Длительность и тариф меняются кликом/выбором — пересчитываем сразу
  durationSelect.addEventListener('change', recalculate);
  form.querySelectorAll('input[name="tariff"]').forEach((radio) => {
    radio.addEventListener('change', recalculate);
  });

  // На случай нажатия Enter внутри формы (нет кнопки submit, но подстрахуемся)
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearTimeout(debounceTimer);
    recalculate();
  });

  // Первичный расчёт при загрузке страницы (по значениям формы по умолчанию)
  recalculate();
});
