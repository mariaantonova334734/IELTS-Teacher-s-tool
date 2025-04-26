
/**
 * Dto для входа юзера в систему
 * (логин)
 */
export interface LoginUserRequestDto {
    /**
     * Username
     */
    username: string;

    /**
     * Пароль
     */
    password: string;
}

/**
 * Dto для входа юзера в систему
 * (логин)
 */
export interface LoginUserResponseDto {
    /**
     * Токен
     */
    access_token: string;

    /**
     * Id преподавателя
     */
    id: string;
}