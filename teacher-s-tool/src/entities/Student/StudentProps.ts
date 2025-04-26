export interface StudentProps {
    /**
     * Id студента
     */
    id: string;
    /**
     * ФИО студента
     */
    fio: string;
    /**
     * Логин студента для входа в систему
     */
    group: string;

    /**
     * Статус активности студента. true - студент занимается
     */
    is_active: boolean;

    openEditModal: () => void;
}