export interface UpdateUnitRequest {
    /**
     * id юнита (в parameters)
     */
    unitId: string;

    /**
     * Id студента (в parameters)
     */
    studentId: string;
    
    /**
     * Имя юнита
     */
    name: string;
}