interface StudentRequestDto {
    /**
     * Id преподавателя
     */
    teacherId: string;
}

interface StudentResponseDto {
    /**
     * Id студента
     */
    id: string;
    /**
     * ФИО студента
     */
    fio: string;
    /**
     * Группа студента для входа в систему
     */
    group: string;

    /**
     * Статус активности студента. true - студент занимается
     */
    is_active: boolean;
}

/**
 * Dto для получения списка студентов (ответ от сервера)
 */
type GetAllStudentsResponseDto = StudentResponseDto[];

export type { GetAllStudentsResponseDto, StudentRequestDto, StudentResponseDto };

