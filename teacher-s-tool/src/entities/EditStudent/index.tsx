import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { App, Checkbox, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { UpdateStudentRequest } from '../../api';

export default function EditStudent({ updateStudent, selectedStudent, isOpen, onEditSuccess, clearMode  }: { updateStudent: (req: UpdateStudentRequest) => void, selectedStudent: UpdateStudentRequest | null, isOpen: boolean, onEditSuccess: () => void; clearMode: () => void}) {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();
	const { message } = App.useApp();
	useEffect(() => {
		if (selectedStudent) {
			form.setFieldsValue({
				...selectedStudent
			});
		}
	}, [selectedStudent, form]);

	const handleOk = async () => {
		const messageKey = 'updatable';
		try {
			message.open({
				key: messageKey,
				type: 'loading',
				content: 'Ждите...'
			});
			setConfirmLoading(true);
			if (selectedStudent) {
				await form.validateFields()
					.then(async () => {
						await updateStudent({
							id: selectedStudent.id,
							fio: form.getFieldValue('fio'),
							group: form.getFieldValue('group'),
							is_active: form.getFieldValue('is_active')
						});
						message.open({
							key: messageKey,
							type: 'success',
							content: 'Успешно'
						});
						form.resetFields();
						clearMode();
						await onEditSuccess();
					})
					.catch(() => {
						message.open({
							key: messageKey,
							type: 'error',
							content: 'Заполните поля!'
						});
					});
			} else {
				message.open({
					key: messageKey,
					type: 'error',
					content: 'Не выбран студент!'
				});
			}
		} catch (e) {
			message.open({
				key: messageKey,
				type: 'error',
				content: 'Что-то пошло не так!'
			});
			console.error('Ошибка при изменении студента или загрузке данных', e);
		} finally {
			setConfirmLoading(false);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		setConfirmLoading(false);
		clearMode();
	};

	return (
		<Modal
			title="Обновление студента"
			open={isOpen}
			okText='Сохранить'
			cancelText='Отмена'
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={handleCancel}
			destroyOnClose
		>
			<Form
				form={form}
				layout="vertical"
				autoComplete="off"
				initialValues={{
					fio: selectedStudent?.fio,
					group: selectedStudent?.group,
					is_active: selectedStudent?.is_active
				}}
					
			> 
				{/**ФИО юзера */}
				<Form.Item
					name="fio"
					label="ФИО"
					rules={[{ required: true, message: 'Введите ФИО'}]}
				>
					<Input 
						prefix={<UserOutlined />}
						placeholder="ФИО: " />
				</Form.Item>

				{/** Группа */}
				<Form.Item
					name="group"
					label="Группа: "
					rules={[{ required: true, message: 'Введите Вашу группу в системе'}]}
				>
					<Input 
						prefix={<UserAddOutlined />}
						placeholder="Группа: " />
				</Form.Item>

				<Form.Item name="is_active" valuePropName="checked" label={null}>
					<Checkbox checked={selectedStudent?.is_active}>Пользователь активен</Checkbox>
				</Form.Item>

			</Form>
		</Modal>
	);
}