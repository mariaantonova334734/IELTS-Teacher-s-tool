import { LockOutlined, MailOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { App, Card, ConfigProvider, Form, Input, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../api/user/service/user.service';
import { SubmitButton } from '../../widgets';

const { Title } = Typography;

/**
 * Страница регистрации
 */
export default function SignUpPage() {
	const { message } = App.useApp();
	const navigate = useNavigate();
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
			
			if(validated) {
				await userService.registerUser({
					email: form.getFieldValue('email'),
					login: form.getFieldValue('username'),
					fio: form.getFieldValue('fio'),
					password: form.getFieldValue('password'),
					confirm_password: form.getFieldValue('password')
				});
				message.open({
					key: messageKey,
					type: 'success',
					content: 'Успешно'
				});
				form.resetFields();
				navigate('/signIn');
			} else {
				message.open({
					key: messageKey,
					type: 'error',
					content: 'Неправильное имя пользователя или пароль!'
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
		  <div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					boxSizing: 'border-box'
				}}
			>
				<Card style={{ width: 500}}
					variant="borderless"
				>
				 <div style={{ display: 'flex', justifyContent: 'center' }}>
						<Title level={2}>Регистрация </Title>
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
							rules={[{ required: true, message: 'Введите ФИО'}]}
						>
							<Input 
								prefix={<UserOutlined />}
								placeholder="ФИО: " />
						</Form.Item>

						{/**Username в системе*/}
						<Form.Item
							name="username"
							label="Логин: "
							rules={[{ required: true, message: 'Введите Ваше имя в системе'}]}
						>
							<Input 
								prefix={<UserAddOutlined />}
								placeholder="Логин: " />
						</Form.Item>

						{/**email в системе*/}
						<Form.Item
							name="email"
							label="Почта"
							rules={[{ required: true, message: 'Введите почту'}]}
						>
							<Input 
								prefix={<MailOutlined />}
								placeholder="Почта: " />
						</Form.Item>

						{/**Пароль юзера */}
						<Form.Item
							name="password"
							label="Пароль"
							rules={[{ required: true, message: 'Введите пароль' }]}
						>
							<Input.Password 
								placeholder="Пароль: " 
								prefix={<LockOutlined className="site-form-item-icon" />}
								visibilityToggle={true}
							/>
							
						</Form.Item>

						<SubmitButton form={form}>Зарегистрироваться</SubmitButton>
			
					</Form>
					<div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
						<Space>
							Уже есть аккаунт?
							<Link to="/signIn">Войти в систему</Link>
						</Space>
						
					</div>
				</Card>
			</div>
		</ConfigProvider>)
	;
}