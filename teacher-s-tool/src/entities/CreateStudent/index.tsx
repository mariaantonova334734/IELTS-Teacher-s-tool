import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { App, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { CreateStudentProps } from './CreateStudentProps';

export default function CreateStudent({ isOpen, onCreateSuccess, createStudent, clearMode }: CreateStudentProps) {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const teacherId = useSelector((s: RootState) => s.user.id);
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
			if (!teacherId) {
				throw new Error('Не найден Id');
			}
			await form.validateFields()
				.then(async () => {
					await createStudent({
						fio: form.getFieldValue('fio'),
						group: form.getFieldValue('group'),
						teacher_id: teacherId
					});
				
					await onCreateSuccess();
					message.open({
						key: messageKey,
						type: 'success',
						content: 'Успешно'
					});
					clearMode();
					form.resetFields();

				}).catch(() => {
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
			console.error('Ошибка при добавлении студента или загрузке данных', e);
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
			title="Создание студента"
			open={isOpen}
			okText='Сохранить'
			cancelText='Отмена'
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={handleCancel}
		>
			<Form
				form={form}
				layout="vertical"
				autoComplete="off"
					
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

				{/** Логин - upd. группа */}
				<Form.Item
					name="group"
					label="Группа: "
					rules={[{ required: true, message: 'Введите группу в системе'}]}
				>
					<Input 
						prefix={<UserAddOutlined />}
						placeholder="Группа: " />
				</Form.Item>


			</Form>
		</Modal>
	);
}