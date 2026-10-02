document.addEventListener('DOMContentLoaded', async () => {
    const coursesGrid = document.querySelector('.courses__grid');
    const courseSelect = document.getElementById('course');

    try {
        const courses = await getCourses();

        // Заполняем список курсов в форме записи, если он есть на странице.
        if (courseSelect) {
            courseSelect.innerHTML = '<option value="">Выберите курс</option>';

            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = `${course.title} — ${course.price} ₽`;
                courseSelect.appendChild(option);
            });
        }

        // На странице курсов строим карточки непосредственно из API.
        if (coursesGrid) {
            const courseDetails = {
                1: {
                    icon: '🇬🇧',
                    description: 'От базовой грамматики до свободного общения. Программа подбирается под ваш уровень.'
                },
                2: {
                    icon: '🇩🇪',
                    description: 'Грамматика, произношение и разговорная практика с носителями языка.'
                },
                3: {
                    icon: '🇪🇸',
                    description: 'Быстрый старт в испанском: от приветствия до уверенных диалогов.'
                }
            };

            coursesGrid.innerHTML = '';

            courses.forEach(course => {
                const details = courseDetails[course.id] || {
                    icon: '🌐',
                    description: 'Современная программа обучения иностранному языку.'
                };

                const card = document.createElement('article');
                card.className = 'course-card';

                card.innerHTML = `
                    <div class="course-card__image course-card__image--english">
                        <span>${details.icon}</span>
                    </div>
                    <div class="course-card__content">
                        <h2 class="course-card__title">${escapeHtml(course.title)}</h2>
                        <p class="course-card__description">
                            ${escapeHtml(details.description)}
                        </p>
                        <p class="course-card__price">${course.price} ₽</p>
                    </div>
                `;

                coursesGrid.appendChild(card);
            });
        }
    } catch (error) {
        console.error(error);

        if (coursesGrid) {
            coursesGrid.innerHTML = '<p>Не удалось загрузить курсы с сервера.</p>';
        }

        if (courseSelect) {
            courseSelect.innerHTML = '<option value="">Ошибка загрузки курсов</option>';
        }
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
