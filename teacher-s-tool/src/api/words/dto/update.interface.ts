export interface UpdateWordByUnitRequest {
    /**
     * Id юнита (parameters)
     */
    unitId: string;

    /**
     * Id слова в юните (parameters)
     */
    wordId: string;

    /**
     * Название слова
     */
    title: string;

    /**
     * Описание слова
     */
    translation: string;

    /**
     * Изучение завершено?
     */
    completed: boolean;

    /**
     * Тема
     */
    topic: string;
}
