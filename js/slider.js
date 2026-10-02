document.addEventListener('DOMContentLoaded', async () => {
    const track = document.querySelector('.reviews__track');
    const prevButton = document.querySelector('.reviews__button--prev');
    const nextButton = document.querySelector('.reviews__button--next');
    const dotsContainer = document.querySelector('.reviews__dots');

    if (!track || !prevButton || !nextButton || !dotsContainer) {
        return;
    }

    try {
        const reviews = await getReviews();

        if (reviews.length === 0) {
            track.innerHTML = '<p>Пока отзывов нет.</p>';
            return;
        }

        const imageMap = {
            'Анна': 'img/ana.jpg',
            'Максим': 'img/maksim.jpg',
            'Елена': 'img/el.jpg'
        };

        track.innerHTML = '';
        dotsContainer.innerHTML = '';

        reviews.forEach((review, index) => {
            const card = document.createElement('article');
            card.className = 'review-card';

            const photoSrc = imageMap[review.author];
            const photo = photoSrc
                ? `<img class="review-card__photo" src="${photoSrc}" alt="Фото ${escapeHtml(review.author)}">`
                : `<div class="review-card__photo review-card__photo--placeholder">${escapeHtml(review.author.charAt(0).toUpperCase())}</div>`;

            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

            card.innerHTML = `
                ${photo}
                <div class="review-card__content">
                    <h3 class="review-card__name">${escapeHtml(review.author)}</h3>
                    <p class="review-card__text">${escapeHtml(review.text)}</p>
                    <p class="review-card__rating" aria-label="Оценка ${review.rating} из 5">${stars}</p>
                </div>
            `;

            track.appendChild(card);

            const dot = document.createElement('button');
            dot.className = 'reviews__dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `Отзыв ${index + 1}`);
            dotsContainer.appendChild(dot);
        });

        const cards = track.querySelectorAll('.review-card');
        const dots = dotsContainer.querySelectorAll('.reviews__dot');
        let currentIndex = 0;

        function showReview(index) {
            cards.forEach((card, i) => {
                card.classList.toggle('review-card--active', i === index);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('reviews__dot--active', i === index);
            });
        }

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            showReview(currentIndex);
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            showReview(currentIndex);
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                showReview(currentIndex);
            });
        });

        showReview(currentIndex);
    } catch (error) {
        console.error(error);
        track.innerHTML = '<p>Не удалось загрузить отзывы с сервера.</p>';
        dotsContainer.innerHTML = '';
    }
});

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
