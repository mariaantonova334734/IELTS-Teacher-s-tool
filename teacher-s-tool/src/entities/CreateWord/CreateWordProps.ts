import { AddWordToUnitRequest } from '../../api';

export interface CreateWordProps {
    /**
     * Создание слова
     */
    createWord: (newWord: AddWordToUnitRequest) => Promise<void>; 

    /**
     * Открыть модальное окно
     */
    isOpen: boolean; 
    
    /**
     * Очистить текущее слово и режим модального окна ('edit, 'create')
     */
    clearWord: () => void;

    /**
     * Действие после успешного создания слова (загрузить все слова юнита)
     */
    getAllWords: () => Promise<void>

    /**
     * Id юнита, который будет содержать создаваемое слово
     */
    unitId: string; 
}