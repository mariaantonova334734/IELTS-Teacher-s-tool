export interface AddWordToUnitRequest {
    /**
     * Id юнита (parameters)
     */
    unitId: string;
    
    /**
     * Текст слова
     */
    title: string;

    /**
     * Тема для слова
     */
    topic: string;
}