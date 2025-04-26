import { UnitResponse, UpdateUnitRequest } from '../../api';

export interface EditUnitProps {
   /**
    * Редактировать юнит
    */
   editUnit: (editUnit: UpdateUnitRequest) => Promise<void>;

   /**
    * Выбранный юнит для изменения
    */
   selectedUnit: UnitResponse | null; 

   /**
    * Открыть модальное окно
    */
   isOpen: boolean; 

   /**
    * Id студента, который владеет юнитом
    */
   studentId: string;

   /**
    * Действие после успешного редактирования (получить все юниты)
    */
   getAllUnits: () => Promise<void>; 

   /**
    * Очистка режима модального окна и юнита для редактирования
    */
   clearUnit: () => void
}