import { App, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { WordResponse } from '../../api';
import { CreateWordProps } from './CreateWordProps';

export default function CreateWord({ clearWord, getAllWords, unitId, isOpen, createWord }: CreateWordProps) {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();
	const { message } = App.useApp();
    
	const handleOk = async () => {
		const messageKey = 'updatable';
		try {
			message.open({
				key: messageKey,
				type: 'loading',
				content: 'Ждите...'
			});
			setConfirmLoading(true);
			await form.validateFields()
				.then(async () => {
					await createWord({
						unitId,
						title: form.getFieldValue('title'),
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
				})
				.catch(() => {
					message.open({
						key: messageKey,
						type: 'error',
						content: 'Заполните поля!'
					});
				});
			
		} catch (e) {
			message.open({
				key: messageKey,
				type: 'error',
				content: 'Что-то пошло не так!'
			});
			console.error('Ошибка при создании слова или загрузке данных', e);
		} finally {
			setConfirmLoading(false);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		setConfirmLoading(false);
		clearWord();
	};

	return (
		<Modal
			title="Создание слова"
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
					name="topic"
					label="Тема:"
					rules={[{ required: true, message: 'Введите тему'}]}
				>
					<Input 
						placeholder="Тема: " />
				</Form.Item>
			</Form>
		</Modal>
	);
}