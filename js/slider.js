/**
 * slider.js
 * Слайдер отзывов на index.html.
 *
 * Отзывы теперь подгружаются с сервера (js/reviews.js) уже после загрузки страницы,
 * поэтому карточки и точки нельзя запоминать один раз при старте — каждый раз
 * берём актуальные элементы из DOM. Когда reviews.js обновляет разметку,
 * он отправляет событие "reviews:updated", и слайдер сбрасывается на первый отзыв.
 */

document.addEventListener("DOMContentLoaded", () => {
    const prevButton = document.querySelector(".reviews__button--prev");
    const nextButton = document.querySelector(".reviews__button--next");
    const dotsContainer = document.querySelector(".reviews__dots");

    if (!prevButton || !nextButton) return;

    let currentIndex = 0;

    const getCards = () => document.querySelectorAll(".review-card");
    const getDots = () => document.querySelectorAll(".reviews__dot");

    function showReview(index) {
        getCards().forEach((card, i) => {
            card.classList.toggle("review-card--active", i === index);
        });

        getDots().forEach((dot, i) => {
            dot.classList.toggle("reviews__dot--active", i === index);
        });
    }

    function nextReview() {
        const total = getCards().length;
        if (!total) return;

        currentIndex = (currentIndex + 1) % total;
        showReview(currentIndex);
    }

    function previousReview() {
        const total = getCards().length;
        if (!total) return;

        currentIndex = (currentIndex - 1 + total) % total;
        showReview(currentIndex);
    }

    prevButton.addEventListener("click", previousReview);
    nextButton.addEventListener("click", nextReview);

    // Клики по точкам — через делегирование, чтобы работали и после перерисовки точек
    if (dotsContainer) {
        dotsContainer.addEventListener("click", (event) => {
            const dot = event.target.closest(".reviews__dot");
            if (!dot) return;

            currentIndex = Array.from(getDots()).indexOf(dot);
            showReview(currentIndex);
        });
    }

    // reviews.js обновил карточки и точки — начинаем с первого отзыва
    document.addEventListener("reviews:updated", () => {
        currentIndex = 0;
        showReview(currentIndex);
    });

    showReview(currentIndex);
});


