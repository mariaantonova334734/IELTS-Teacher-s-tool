interface UpdateStudentRequest {
    /**
     * Идентификатор изменяемого студента
     */
    id: string;
    /**
     * Группа изменяемого студента
     */
    group: string;
    /**
     * ФИО изменяемого студента
     */
    fio: string;
    /**
     * Активный пользователь
     */
    is_active: boolean;
}

export type { UpdateStudentRequest };

