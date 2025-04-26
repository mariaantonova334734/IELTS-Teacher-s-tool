import { Button, ButtonProps } from 'antd';

export default function StyledButton(props: ButtonProps) {
	return <Button style={{boxShadow: 'none'}} {...props} />;
}