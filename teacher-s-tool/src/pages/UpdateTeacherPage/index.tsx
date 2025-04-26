import { useNavigate } from 'react-router-dom';
import { ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { App, Card, ConfigProvider, Form, Input } from 'antd';
import Title from 'antd/es/typography/Title';
import { useSelector } from 'react-redux';
import { teacherService } from '../../api/teachers/service/teacher.service';
import { RootState } from '../../store/store';
import { SubmitButton } from '../../widgets';


export default function UpdateTeacherPage() {
    const navigate = useNavigate();
	const { message } = App.useApp();
	const teacherId = useSelector((s: RootState) => s.user.id);
	const [form] = Form.useForm();

	const onFinish = async () => {
		const messageKey = 'updatable';
		try {
			message.open({
				key: messageKey,
				type: 'loading',
				content: 'Ждите...'
			});
			const validated = await form.validateFields();
			if (!teacherId) {
				throw new Error('Id не загружен');
			}
			if(validated) {
				await teacherService.updateProfile({
// 					login: form.getFieldValue('login'),
					fio: form.getFieldValue('fio'),
					teacherId
				});
//                 const response = await teacherService.updateProfile({
//                     login: form.getFieldValue('login'),
//                     fio: form.getFieldValue('fio'),
//                     teacherId
//             });
//
//                 // Сохраняем новый токен, если он пришёл
//                 if (response?.access_token) {
//                     localStorage.setItem('access_token', response.access_token);
//                 }

				
				message.open({
					key: messageKey,
					type: 'success',
					content: 'Успешно'
				});
				form.resetFields();
				navigate('/');
			} else {
				message.open({
					key: messageKey,
					type: 'error',
					content: 'Неправильное ФИО или логин!'
				});

			}
		} catch(e) {
			message.open({
				key: messageKey,
				type: 'error',
				content: 'Что-то пошло не так!'
			});
			console.error(e);
		}
	
	};

	return (
		<ConfigProvider theme={{
			token: {
				colorBgContainer: 'white' // цвет формы
			}
		}}
		>
			<div style={{height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
				<Card
					style={{ margin: '0 auto', padding: '10px 20px', width: 'fit-content'}}
					variant="borderless"
				>
					<div style={{ display: 'flex' }}>
						<Title level={2}>Обновление профиля</Title>
					</div>
				
					<Form
						form={form}
						layout="vertical"
						onFinish={onFinish}
						autoComplete="off"
					
					
					> 
		


						{/**ФИО юзера */}
						<Form.Item

							name="fio"
							label="ФИО"
							rules={[{ required: true, message: 'Введите ФИО' }]}
						>
							<Input 
								placeholder="ФИО: " 
								prefix={<UserOutlined className="site-form-item-icon" />}
							/>
							
						</Form.Item>

						<SubmitButton form={form}>Обновить</SubmitButton>
			
					</Form>
				</Card>
			</div>
			

		</ConfigProvider>
	);
}