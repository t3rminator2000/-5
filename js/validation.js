
        document.addEventListener('DOMContentLoaded', function () {
            const form = document.getElementById('registrationForm');
            const submitBtn = form.querySelector('button[type="submit"]');

            // Поля формы
            const fioInput = document.getElementById('fio');
            const phoneInput = document.getElementById('phone');
            const emailInput = document.getElementById('email');
            const agreementCheckbox = document.getElementById('agreement');

            // Регулярное выражение для email
            const emailRegex = /^[^\s]+@[^\s]+\.[^\s]+$/;

            /**
             * Показать ошибку для поля
             */
            function showError(input, message) {
                input.classList.add('error');

                // Удаляем предыдущее сообщение об ошибке, если оно есть
                const existingError = input.parentElement.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }

                const errorSpan = document.createElement('span');
                errorSpan.classList.add('error-message');
                errorSpan.textContent = message;
                input.parentElement.appendChild(errorSpan);
            }

            /**
             * Убрать ошибку с поля
             */
            function clearError(input) {
                input.classList.remove('error');
                const existingError = input.parentElement.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
            }

            /**
             * Валидация ФИО
             */
            function validateFio() {
                const value = fioInput.value.trim();
                if (value === '') {
                    showError(fioInput, 'ФИО не должно быть пустым');
                    return false;
                }
                clearError(fioInput);
                return true;
            }

            /**
             * Валидация телефона (11 цифр)
             */
            function validatePhone() {
                const value = phoneInput.value.trim();
                // Извлекаем только цифры
                const digits = value.replace(/\D/g, '');
                if (digits.length !== 11) {
                    showError(phoneInput, 'Телефон должен содержать 11 цифр (введено: ' + digits.length + ')');
                    return false;
                }
                clearError(phoneInput);
                return true;
            }

            /**
             * Валидация email
             */
            function validateEmail() {
                const value = emailInput.value.trim();
                if (!emailRegex.test(value)) {
                    showError(emailInput, 'Введите корректный email');
                    return false;
                }
                clearError(emailInput);
                return true;
            }

            /**
             * Валидация чекбокса согласия
             */
            function validateAgreement() {
                if (!agreementCheckbox.checked) {
                    showError(agreementCheckbox, 'Необходимо дать согласие');
                    return false;
                }
                clearError(agreementCheckbox);
                return true;
            }

            /**
             * Полная валидация формы
             */
            function validateForm() {
                const isFioValid = validateFio();
                const isPhoneValid = validatePhone();
                const isEmailValid = validateEmail();
                const isAgreementValid = validateAgreement();

                return isFioValid && isPhoneValid && isEmailValid && isAgreementValid;
            }

            // Валидация при отправке формы
            form.addEventListener('submit', function (event) {
                event.preventDefault();

                if (validateForm()) {
                    alert('Заявка отправлена!');
                    form.reset();
                    // Убираем все ошибки после успешной отправки
                    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
                    document.querySelectorAll('.error-message').forEach(el => el.remove());
                }
            });

            // Валидация при потере фокуса (blur) для каждого поля
            fioInput.addEventListener('blur', validateFio);
            phoneInput.addEventListener('blur', validatePhone);
            emailInput.addEventListener('blur', validateEmail);
            agreementCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    clearError(this);
                }
            });
        });

