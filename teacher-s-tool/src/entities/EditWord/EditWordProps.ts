import { UpdateWordByUnitRequest, WordResponse } from '../../api';

export interface EditWordProps {
    /**
     * Редактировать слово
     */
    editWord: (editWord: UpdateWordByUnitRequest) => Promise<void>;

    /**
     * Открыть модально окно
     */
    isOpen: boolean;

    /**
     * Слово для изменения
     */
    selectedWord: WordResponse | null;

    /**
     * Id юнита, которому принадлежит редактируемое слово
     */
    unitId: string;

    /**
     * Действие после успешного редактирования (получить все слова)
     */
    getAllWords: () => Promise<void>;

    /**
     * Очистить режим редактирования и слово для редактирования
     */
    clearWord: () => void
} 