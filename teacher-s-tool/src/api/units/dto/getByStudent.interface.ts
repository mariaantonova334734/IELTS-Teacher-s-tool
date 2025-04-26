export interface GetUnitByStudentRequest {
    studentId: string;
}

export interface UnitResponse {
    /**
     * id юнита
     */
    id: string;
    
    /**
     * Название юнита
     */
    name: string;
}
export type GetUnitsByStudentResponse = UnitResponse[];