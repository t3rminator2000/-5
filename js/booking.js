document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm');

    if (!form) {
        return;
    }

    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const courseInput = document.getElementById('course');
    const dateInput = document.getElementById('date');
    const privacyCheckbox = document.getElementById('privacyAgree');
    const submitBtn = document.querySelector('.submit-btn');

    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';

        if (value.startsWith('8')) {
            value = value.replace('8', '7');
        } else if (!value.startsWith('7')) {
            value = '7' + value;
        }

        if (value.length >= 1) formattedValue = `+${value[0]}`;
        if (value.length >= 2) formattedValue += `(${value.substring(1, 4)}`;
        if (value.length >= 4) formattedValue += `)-${value.substring(4, 7)}`;
        if (value.length >= 7) formattedValue += `-${value.substring(7, 9)}`;
        if (value.length >= 9) formattedValue += `-${value.substring(9, 11)}`;

        e.target.value = formattedValue.substring(0, 17);
    });

    privacyCheckbox.addEventListener('change', () => {
        submitBtn.disabled = !privacyCheckbox.checked;
    });

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return regex.test(email);
    }

    function showError(input, errorElementId, message) {
        input.classList.add('error');
        const errorElement = document.getElementById(errorElementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function hideError(input, errorElementId) {
        input.classList.remove('error');
        const errorElement = document.getElementById(errorElementId);
        errorElement.style.display = 'none';
    }

    form.querySelectorAll('.form-input[required]').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.id === 'fullName' && input.value.trim().length < 3) {
                showError(input, 'fullNameError', 'Введите корректное ФИО (минимум 3 символа)');
            } else if (input.id === 'phone' && input.value.length !== 17) {
                showError(input, 'phoneError', 'Введите телефон в формате +7(XXX)-XXX-XX-XX');
            } else if (input.id === 'course' && !input.value) {
                showError(input, 'courseError', 'Выберите курс');
            } else if (input.id === 'date' && !input.value) {
                showError(input, 'dateError', 'Выберите дату занятия');
            } else {
                hideError(input, `${input.id}Error`);
            }
        });
    });

    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !validateEmail(emailInput.value)) {
            showError(emailInput, 'emailError', 'Введите корректный адрес электронной почты');
        } else {
            hideError(emailInput, 'emailError');
        }
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();

        let isValid = true;

        if (fullNameInput.value.trim().length < 3) {
            showError(fullNameInput, 'fullNameError', 'Введите корректное ФИО (минимум 3 символа)');
            isValid = false;
        } else {
            hideError(fullNameInput, 'fullNameError');
        }

        if (phoneInput.value.length !== 17) {
            showError(phoneInput, 'phoneError', 'Введите телефон в формате +7(XXX)-XXX-XX-XX');
            isValid = false;
        } else {
            hideError(phoneInput, 'phoneError');
        }

        if (!courseInput.value) {
            showError(courseInput, 'courseError', 'Выберите курс');
            isValid = false;
        } else {
            hideError(courseInput, 'courseError');
        }

        if (!dateInput.value) {
            showError(dateInput, 'dateError', 'Выберите дату занятия');
            isValid = false;
        } else {
            hideError(dateInput, 'dateError');
        }

        if (emailInput.value && !validateEmail(emailInput.value)) {
            showError(emailInput, 'emailError', 'Введите корректный адрес электронной почты');
            isValid = false;
        } else {
            hideError(emailInput, 'emailError');
        }

        if (!privacyCheckbox.checked) {
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        clearFormStatus();

        try {
            const booking = await createBooking({
                name: fullNameInput.value.trim(),
                phone: phoneInput.value.trim(),
                email: emailInput.value.trim(),
                courseId: Number(courseInput.value),
                date: dateInput.value
            });

            showFormStatus(`Запись №${booking.id} успешно создана!`, false);

            form.reset();
            submitBtn.disabled = true;
        } catch (error) {
            console.error(error);
            showFormStatus(`Ошибка: ${error.message}`, true);
            submitBtn.disabled = false;
        } finally {
            submitBtn.textContent = 'Записаться';
        }
    });

    function showFormStatus(message, isError) {
        const status = document.getElementById('formStatus');
        status.textContent = message;
        status.style.display = 'block';
        status.style.color = isError ? '#e74c3c' : '#27ae60';
    }

    function clearFormStatus() {
        const status = document.getElementById('formStatus');
        status.style.display = 'none';
        status.textContent = '';
    }
});
