/**
 * Dto для добавления нового юзера в систему
 * (регистрация)
 */
export interface CreateUserRequestDto {
    /**
     * Почта
     */
    email: string;

    /**
     * Username
     */
    login: string;

    /**
     * ФИО
     */
    fio: string;

    /**
     * Пароль
     */
    password: string;

    /**
     * Проверка набранного пароля
     */
    confirm_password: string;
}

/**
 * Dto для добавления нового юзера в систему (ответ от сервера)
 * (регистрация)
 */
export interface CreateUserResponseDto {
    /**
     * Id юзера в базе
     */
    id: string;

    /**
     * Почта
     */
    email: string;

    /**
     * Username
     */
    login: string;
}
