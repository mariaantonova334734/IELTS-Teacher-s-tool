import { App } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { wordService } from '../../api/words/service/words.service';
import { CustomCheckbox } from '../../widgets/CustomCheckbox';
import { UpdateWordStatusProps } from './UpdateWordStatusProps';

/**
 * Чекбокс для обновления статуса слова (изучено)
 */
export default function UpdateWordStatus({ unitId, startUpload, word, initialIsCompleted }: UpdateWordStatusProps) {
	const [isCompleted, setCompleted] = useState(initialIsCompleted);
	const [updated, setUpdated] = useState(false); 
	const { message } = App.useApp();

	const saveWordStatus = useCallback(async () => {
		try {
			if (word?.id !== undefined) {
				await wordService.updateWord({
					unitId,
					wordId: word.id,
					title: word.title,
					translation: word.translation,
					completed: isCompleted
				});
				
			} else {
				message.open({
					key: 'loading',
					type:'error',
					content: 'Что-то пошло не так при обновлении'
				});
				console.error('Отсутствует выбранное слово', word.title);
			}
		} catch (e) {
			message.open({
				key: 'loading',
				type:'error',
				content: 'Что-то пошло не так при обновлении'
			});
			console.error('Ошибка при изменении слова или загрузке данных', e, word);
		} 
	}, [word, isCompleted, unitId, message]);

	const toggleCompleted = () => {
		setCompleted(!isCompleted);
		setUpdated(true);
	};

	useEffect(() => {
		if (startUpload && updated) {
			saveWordStatus();
		}
	}, [startUpload, saveWordStatus, updated]);

	return <CustomCheckbox checked={isCompleted} onChange={toggleCompleted} />;
}