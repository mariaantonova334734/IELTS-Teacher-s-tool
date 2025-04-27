export interface GetAllWordsByUnitRequest {
    /**
     * Id юнита (parameters)
     */
    unitId: string; 
}

export interface WordResponse {
    /**
     * Id слова
     */
    id: string;
    
    /**
     * Текст слова
     */
    title: string;

    /**
     * Описание слова
     */
    translation: string;

    /**
     * Тема для слова
     */
    topic: string;

    /**
     * Изучение завершено?
     */
    is_completed: boolean;
}

export type GetAllWordsByUnitResponse = WordResponse[];
