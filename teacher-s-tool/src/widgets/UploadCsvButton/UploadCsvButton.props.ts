
export interface UploadCsvButtonProps {
    /**
     * Функция загрузки при изменении файла
     */
    uploadFile: (file: File) => Promise<void>;
}
