import { Typography } from 'antd';

export default function Loader({ height }: { height: string }) {
	return (
		<div style={{ height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Typography.Text type='secondary'>Loading...</Typography.Text>
		</div>
	);
}