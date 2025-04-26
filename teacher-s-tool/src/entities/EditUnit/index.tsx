import { App, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { UnitResponse } from '../../api';
import { EditUnitProps } from './EditUnitProps';

export default function EditUnit({ editUnit, getAllUnits, studentId, selectedUnit, isOpen, clearUnit }: EditUnitProps) {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();
	const { message } = App.useApp();
    

	useEffect(() => {
		if (selectedUnit) {
			form.setFieldsValue({
				name: selectedUnit.name
			});
		}
	}, [selectedUnit, form]);

	const handleOk = async () => {
		const messageKey = 'updatable';
		try {
			message.open({
				key: messageKey,
				type: 'loading',
				content: 'Ждите...'
			});
			setConfirmLoading(true);
			if (selectedUnit?.id !== undefined) {
				await form.validateFields()
					.then(async () => {
						await editUnit({
							unitId: selectedUnit.id,
							name: form.getFieldValue('name'),
							studentId
						});
						message.open({
							key: messageKey,
							type: 'success',
							content: 'Успешно'
						});
						clearUnit();
						form.resetFields();
						await getAllUnits();
					})
					.catch(() => {
						message.open({
							key: messageKey,
							type: 'error',
							content: 'Заполните поля!'
						});
					});
			} else {
				console.error('Отсутствует выбранный юнит');
				message.open({
					key: messageKey,
					type: 'error',
					content: 'Отсутствует выбранный юнит'
				});
			}
		} catch (e) {
			console.error('Ошибка при изменении юнита или загрузке данных', e);
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
			title="Обновление юнита"
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
				initialValues={{
					name: selectedUnit?.name || ''
				}}
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