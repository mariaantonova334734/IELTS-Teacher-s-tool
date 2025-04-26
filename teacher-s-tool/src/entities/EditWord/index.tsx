import { App, Checkbox, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { WordResponse } from '../../api';
import { EditWordProps } from './EditWordProps';

export default function EditWord({ editWord, getAllWords, unitId, selectedWord, isOpen, clearWord }: EditWordProps) {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();
	const { message } = App.useApp();

	useEffect(() => {
		if (selectedWord) {
			form.setFieldsValue({
				title: selectedWord.title,
				translation: selectedWord.translation,
				completed: selectedWord.is_completed
			});
		}
	}, [selectedWord, form]);

	const handleOk = async () => {
		const messageKey = 'updatable';
		try {
			message.open({
				key: messageKey,
				type: 'loading',
				content: 'Ждите...'
			});
			setConfirmLoading(true);
			if (selectedWord?.id !== undefined) {
				await form.validateFields()
					.then(async () => {
						await editWord({
							unitId,
							wordId: selectedWord.id,
							title: form.getFieldValue('title'),
							translation: form.getFieldValue('translation'),
							completed: form.getFieldValue('completed'),
							topic: form.getFieldValue('topic')
						});
						message.open({
							key: messageKey,
							type: 'success',
							content: 'Успешно'
						});
						clearWord();
						form.resetFields();
						await getAllWords();
					}).catch(() => {
						message.open({
							key: messageKey,
							type: 'error',
							content: 'Заполните поля!'
						});
					});
			} else {
				console.error('Отсутствует выбранное слово');
				message.error({
					key: messageKey,
					type: 'error',
					content: 'Отсутствует выбранное слово'
				});
			}
		} catch (e) {
			console.error('Ошибка при изменении слова или загрузке данных', e);
		} finally {
			setConfirmLoading(false);
		}
	};

	const handleCancel = () => {
		clearWord();
		setConfirmLoading(false);
		form.resetFields();
	};

	return (
		<Modal
			title="Обновление слова"
			open={isOpen}
			okText='Сохранить'
			cancelText='Отмена'
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={handleCancel}
		>
			<Form<WordResponse>
				form={form}
				layout="vertical"
				autoComplete="off"
				initialValues={{
					title: selectedWord?.title || '',
					translation: selectedWord?.translation || '',
					completed: selectedWord?.is_completed || '',
					topic: selectedWord?.topic || ''
				}}
			> 
				<Form.Item
					name="title"
					label="Слово:"
					rules={[{ required: true, message: 'Введите слово'}]}
				>
					<Input 
						placeholder="Слово: " />
				</Form.Item>

				<Form.Item
					name="translation"
					label="Значение:"
					rules={[{ required: true, message: 'Введите описание слова'}]}
				>
					<Input 
						placeholder="Значение: " />
				</Form.Item>

				<Form.Item
					name="topic"
					label="Тема:"
					rules={[{ required: true, message: 'Введите тему'}]}
				>
					<Input 
						placeholder="Тема: " />
				</Form.Item>


				<Form.Item name="completed" valuePropName="checked" label={null}>
					<Checkbox>Обучение завершено</Checkbox>
				</Form.Item>
			</Form>
		</Modal>
	);
}