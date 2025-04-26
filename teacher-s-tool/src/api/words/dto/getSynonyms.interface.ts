export interface GetSynonymsRequest {
    /**
     * Id слова, у которого находим синонимы
     */
    wordId: string;
}
export interface SynonymsResponse {
    /**
     * id синонима
     */
    id: string;

    /**
     * Текст синонима
     */
    title: string;
}

export type GetSynonymsResponse = SynonymsResponse[];