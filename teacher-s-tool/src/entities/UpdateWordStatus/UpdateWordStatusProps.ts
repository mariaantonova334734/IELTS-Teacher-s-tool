import { WordResponse } from '../../api';

export interface UpdateWordStatusProps {
    /**
     * Id юнита, в котором содержится изменяемое слово
     */
    unitId: string;

    /**
     * Начать обновление
     */
    startUpload: boolean;

    /**
     * Слово для обновления
     */
    word: WordResponse;

    /**
     * Начальное значение статуса изученности слова
     */
    initialIsCompleted: boolean
}