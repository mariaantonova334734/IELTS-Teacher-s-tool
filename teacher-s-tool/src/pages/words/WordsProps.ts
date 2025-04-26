import { WordResponse } from '../../api';

/**
 * Строка таблицы слов
 */
export interface WordsTable extends WordResponse {
    /**
     * Синонимы для слова
     */
    synonyms?: string;
}