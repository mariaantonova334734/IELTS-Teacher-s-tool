import { Result } from 'antd';

export default function NotFoundPage () {
	return (
		<Result
			style={{transform: 'translate(0, 25%)'}}
			status="404"
			title="404"
			subTitle="Извините, страница не существует"
		/>
	);
}