import { Empty, Typography } from 'antd';

export default function NoData({ height, description }: { height: string, description: string }) {
	return (
		<Empty 
			image={'/empty.svg'}
			styles={{ image: { height } }}
			description={
				<Typography.Text>
					{ description }
				</Typography.Text>
			}>		
		</Empty>
	);
}