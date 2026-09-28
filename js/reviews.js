/**
 * reviews.js
 * Загружает отзывы с сервера (GET /api/reviews) и подставляет их
 * в существующий слайдер на index.html вместо трёх захардкоженных карточек.
 *
 * Разметка (index.html):
 * <div class="reviews__slider">
 *   <div class="reviews__track"> ... .review-card ... </div>
 * </div>
 * <div class="reviews__dots"> ... .reviews__dot ... </div>
 *
 * Подключать после js/api.js и до js/slider.js.
 *
 * После любого исхода (успех, пустой список, ошибка сети) отправляется событие
 * "reviews:updated" — js/slider.js по нему сбрасывается на первый отзыв
 * и работает с актуальными карточками и точками.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const track = document.querySelector('.reviews__slider .reviews__track');
  if (!track) return;

  const dotsContainer = document.querySelector('.reviews__dots');
  const fallbackMarkup = track.innerHTML; // то, что было в HTML изначально

  track.innerHTML = '<p class="reviews__state">Загрузка отзывов…</p>';

  const result = await getReviews();

  if (!result.success) {
    // Не пугаем пользователя ошибкой на главной странице —
    // возвращаем то, что было зашито в HTML, и пишем причину в консоль
    track.innerHTML = fallbackMarkup;
    console.warn('Не удалось загрузить отзывы с сервера:', result.error);
    document.dispatchEvent(new CustomEvent('reviews:updated'));
    return;
  }

  if (!result.data.length) {
    track.innerHTML = '<p class="reviews__state">Пока нет отзывов.</p>';
    if (dotsContainer) dotsContainer.innerHTML = '';
    document.dispatchEvent(new CustomEvent('reviews:updated'));
    return;
  }

  track.innerHTML = result.data.map(renderReviewCard).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = result.data
      .map((_, index) => {
        const activeClass = index === 0 ? ' reviews__dot--active' : '';
        return `<button class="reviews__dot${activeClass}" type="button" aria-label="Отзыв ${index + 1}"></button>`;
      })
      .join('');
  }

  // Даём остальному коду (слайдеру) шанс переинициализироваться под новую разметку
  document.dispatchEvent(new CustomEvent('reviews:updated'));
});

function renderReviewCard(review) {
  const name = review.name || review.author || 'Без имени';
  const text = review.text || '';

  const photoMarkup = review.photo
    ? `<img class="review-card__photo" src="${escapeHtml(review.photo)}" alt="Фото ${escapeHtml(name)}">`
    : `<div class="review-card__photo review-card__photo--placeholder" aria-hidden="true">${escapeHtml(name.charAt(0).toUpperCase())}</div>`;

  return `
    <article class="review-card">
      ${photoMarkup}
      <div class="review-card__content">
        <h3 class="review-card__name">${escapeHtml(name)}</h3>
        <p class="review-card__text">${escapeHtml(text)}</p>
      </div>
    </article>
  `;
}
