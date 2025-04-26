import { CreateUnitRequest } from '../../api';

export interface CreateUnitProps {
    /**
     * Создание юнита
     */
    createUnit: (newUnit: CreateUnitRequest) => Promise<void>; 

    /**
     * Открыть модальное окно
     */
    isOpen: boolean; 

    /**
     * Очистка юнита
     */
    clearUnit: () => void; 

    /**
     * Действие после успешного создания юнита (получить все юниты)
     */
    getAllUnits: () => Promise<void>;

    /**
     * Id студента, которому принадлежит этот юнит
     */
    studentId: string;
}