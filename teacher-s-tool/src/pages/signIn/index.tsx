import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { App, Card, ConfigProvider, Form, Input, Space, Typography } from 'antd';

import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../api/user/service/user.service';
import { appDispatch } from '../../store/store';
import { userActions } from '../../store/user.slice';
import { SubmitButton } from '../../widgets';

const { Title } = Typography;
/**
 * Страница входа
 */
export default function SignInPage() {
	const navigate = useNavigate();
	const { message } = App.useApp();
	const [form] = Form.useForm();
	const dispatch = useDispatch<appDispatch>();

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
				const response = await userService.loginUser({
					username: form.getFieldValue('login'),
					password: form.getFieldValue('password')
				});
				
				message.open({
					key: messageKey,
					type: 'success',
					content: 'Успешно'
				});
				form.resetFields();
				dispatch(userActions.saveToken({token: response.access_token, id: response.id}));
				navigate('/');
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
						<Title level={2}>Вход </Title>
					</div>
					<Form
						form={form}
						layout="vertical"
						onFinish={onFinish}
						autoComplete="off"
					
					> 
						{/**Имя юзера */}
						<Form.Item
							name="login"
							label="Имя пользователя"
							rules={[{ required: true, message: 'Введите имя'}]}
						>
							<Input 
								prefix={<UserOutlined className="site-form-item-icon" />}
								placeholder="Логин: " />
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

						<SubmitButton form={form}>Войти</SubmitButton>
			
					</Form>
					<div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
						<Space>
							Нет аккаунта?
							<Link to="/signUp">Зарегистрироваться</Link>
						</Space>
					</div>
				</Card>
			</div>
		</ConfigProvider>)
	;
}