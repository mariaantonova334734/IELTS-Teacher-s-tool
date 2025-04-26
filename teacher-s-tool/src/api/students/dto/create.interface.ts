interface CreateStudentRequest {
    /**
     * Группа добавляемого студента
     */
    group: string;
    /**
     * ФИО добавляемого студента
     */
    fio: string;

    /**
     * id преподавателя
     */
    teacher_id: string;
}

export type { CreateStudentRequest };

