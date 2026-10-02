const API_URL = '/api';

async function getCourses() {
    const response = await fetch(`${API_URL}/courses`);

    if (!response.ok) {
        throw new Error('Не удалось загрузить курсы');
    }

    return response.json();
}

async function createBooking(booking) {
    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Не удалось отправить запись');
    }

    return data;
}

async function getReviews() {
    const response = await fetch(`${API_URL}/reviews`);

    if (!response.ok) {
        throw new Error('Не удалось загрузить отзывы');
    }

    return response.json();
}

async function createReview(review) {
    const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Не удалось отправить отзыв');
    }

    return data;
}

async function calculatePrice(calculation) {
    const response = await fetch(`${API_URL}/calculate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(calculation)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || 'Не удалось выполнить расчёт'
        );
    }

    return data;
}
