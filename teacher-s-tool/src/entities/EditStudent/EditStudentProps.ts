import { UpdateStudentRequest } from '../../api';

export interface EditStudentProps {
    /**
     * Обновить данные студента
     */
    updateStudent: (req: UpdateStudentRequest) => void; 

    /**
     * Выбранный студент для редактирования его полей
     */
    selectedStudent: UpdateStudentRequest | null;

    /**
     * Открыть модальное окно
     */
    isOpen: boolean; 

    /**
     * Действие после успешного редактирования
     */
    onEditSuccess: () => void; 

    /**
     * Очистка режима редактирования
     */
    clearMode: () => void
}