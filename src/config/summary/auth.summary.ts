export enum AuthSummary {
    SIGNUP = 'Регистрация пользователя',
    SIGNUP_CONFIRM = 'Подтверждение регистрации по email',
    SIGNIN = 'Вход пользователя',
    SIGNIN_CONFIRM = 'Подтверждение входа по email',
    REFRESH_TOKEN = 'Получение нового access-токена',
    RESEND_CODE = 'Отправка нового кода на почту',
    CHANGE_PASSWORD = 'Запрос на смену пароля (для НЕ авторизованных пользователей)',
    CONFIRM_CHANGE_PASSWORD = 'Подтвердить смену пароля (для НЕ авторизованных пользователей)'
}
