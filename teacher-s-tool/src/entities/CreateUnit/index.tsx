import { App, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { UnitResponse } from '../../api';
import { CreateUnitProps } from './CreateUnitProps';

export default function CreateUnit({ clearUnit, createUnit, getAllUnits, studentId, isOpen }: CreateUnitProps) {
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
					await createUnit({
						name: form.getFieldValue('name'),
						studentId
					});
					await getAllUnits();
					clearUnit();
					message.open({
						key: messageKey,
						type: 'success',
						content: 'Успешно'
					});
					form.resetFields();
				})
				.catch(() => {
					message.open({
						key: messageKey,
						type: 'error',
						content: 'Заполните поля!'
					});
				});
		} catch (e) {
			console.error('Ошибка при создании юнита или загрузке данных', e);
			message.open({
				key: messageKey,
				type: 'error',
				content: 'Что-то пошло не так!'
			});
		} finally {
			setConfirmLoading(false);

		}
	};

	const handleCancel = () => {
		form.resetFields();
		setConfirmLoading(false);
		clearUnit();
	};

	return (
		<Modal
			title="Создание юнита"
			open={isOpen}
			okText='Сохранить'
			cancelText='Отмена'
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={handleCancel}
		>
			<Form<UnitResponse>
				form={form}
				layout="vertical"
				autoComplete="off"
			> 
				<Form.Item
					name="name"
					label="Название юнита"
					rules={[{ required: true, message: 'Введите название'}]}
				>
					<Input 
						placeholder="Название: " />
				</Form.Item>
			</Form>
		</Modal>
	);
}