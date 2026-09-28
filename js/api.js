/**
 * api.js
 * Базовые функции для работы с backend API.
 * Каждая функция возвращает { success: true, data } или { success: false, error },
 * поэтому компонентам не нужно оборачивать вызовы в try/catch.
 */

const API_BASE_URL = 'http://localhost:3000/api';
const REQUEST_TIMEOUT = 8000; // мс

async function apiRequest(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      // тело ответа могло быть пустым (например, у некоторых 204/500)
    }

    if (!response.ok) {
      const message = (data && data.message) || `Ошибка сервера (${response.status})`;
      return { success: false, error: message };
    }

    return { success: true, data };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return { success: false, error: 'Сервер не отвечает. Попробуйте позже.' };
    }
    return { success: false, error: 'Не удалось подключиться к серверу.' };
  }
}

// Курсы
function getCourses() {
  return apiRequest('/courses');
}

function getCourseById(id) {
  return apiRequest(`/courses/${id}`);
}

// Отзывы
function getReviews() {
  return apiRequest('/reviews');
}

function submitReview(reviewData) {
  return apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

// Запись на курс
function submitBooking(bookingData) {
  return apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

// Калькулятор стоимости
function calculatePrice(calcData) {
  return apiRequest('/calculate', {
    method: 'POST',
    body: JSON.stringify(calcData),
  });
}

// Общая утилита — экранирование текста перед вставкой в innerHTML
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
