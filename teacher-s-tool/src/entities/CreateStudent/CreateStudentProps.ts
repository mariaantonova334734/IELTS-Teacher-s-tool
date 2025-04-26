import { CreateStudentRequest } from '../../api';

export interface CreateStudentProps {
    /**
     * Создать студента
     */
    createStudent: (req: CreateStudentRequest) => void;

    /**
     * Открыть модальное окно
     */
    isOpen: boolean;

    /**
     * Действие после успешного создания студента
     */
    onCreateSuccess: () => void; 

    /**
     * Очистить режим редактирования/создания
     * */
    clearMode: () => void
}
