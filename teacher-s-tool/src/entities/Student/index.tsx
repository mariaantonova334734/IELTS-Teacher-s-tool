import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Image } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { useNavigate } from 'react-router-dom';
import { StudentProps } from './StudentProps';

export default function Student(props: StudentProps) {
	const navigate = useNavigate();
	const STATUS_ACTIVE_TEXT = 'Занимается';
	const STATUS_DEFAULT_TEXT = 'Не занимается';
	return (

		<Card
			hoverable
			style={{border: '1px solid black'}}
			cover={<Image style={{border: '1px solid black'}} src='/student.png' preview={false}/>}>
			<Flex vertical align="flex-start" gap={16}>
				<Button type='dashed' onClick={() => {
					navigate(`/units/${props.id}`);
				}}>{`${'ФИО: ' + props.fio}`}</Button>
				<Paragraph style={{margin: '0'}}>Группа: {props.group}</Paragraph>
				<Paragraph style={{margin: '0'}}>Статус: {props.is_active ? STATUS_ACTIVE_TEXT : STATUS_DEFAULT_TEXT}</Paragraph>
				<Button icon={<EditOutlined />} onClick={() => { props.openEditModal(); }}/>
			</Flex>	
					
		</Card>

	);
}