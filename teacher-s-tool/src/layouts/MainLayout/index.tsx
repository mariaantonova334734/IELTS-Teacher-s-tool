import { ArrowLeftOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Layout, Space } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { appDispatch } from '../../store/store';
import { userActions } from '../../store/user.slice';

const { Header, Content } = Layout;
type MenuItem = 'students' | 'units' | 'words' | 'teacher';
function MainLayout({children, defaultMenuItem} : {children: React.ReactNode, defaultMenuItem: MenuItem}) {
	const navigate = useNavigate();
	const dispatch = useDispatch<appDispatch>();

	/**
	 * Описание страницы
	 */
	const description = new Map<MenuItem, string>();
	description.set('students', 'Список студентов');
	description.set('units', 'Страница юнитов');
	description.set('words', 'Страница слов');
	description.set('teacher', 'Обновление профиля');

	return (
		<ConfigProvider theme={{
			token: {
				colorBgContainer: '#ffd666'
			},
			components: {
				Button: {
					colorBgContainer: '#ffe7ba',
					colorPrimaryHover: '#5b8c00'
				},
				Input: {
					colorBgContainer: 'white'
				}
			}
		}}>
			<Layout style={{
				minHeight: '100vh'
			}}>
				<Header
					style={{
						position: 'sticky',
						top: 0,
						zIndex: 1,
						width: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent:'space-between'
					}}
				>
					
					<Space>
						<Button onClick={() => {navigate(-1);}} icon={<ArrowLeftOutlined />}/>
						<h2 style={{ color: 'white' }}>
							{description.get(defaultMenuItem)}
						</h2>
					</Space>
					<Space>
						<Button onClick={() => { navigate('/teacher/profile');}} icon={<ProfileOutlined />}/>
						<Button onClick={() => {dispatch(userActions.logout());}} icon={<LogoutOutlined />}/>
					</Space>

			
				
				</Header>
				<Content style={{ padding: '15px 48px' }}>
					<div
						style={{
							padding: 24,
							minHeight: 380,
							background: '#ffd666'
						}}
					>
						{children}
					</div>
				</Content>
			
			</Layout>
		</ConfigProvider>
	);
};

export default MainLayout;