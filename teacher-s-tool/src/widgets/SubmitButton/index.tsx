import { Button, Form } from 'antd';
import React from 'react';
import { SubmitButtonProps } from './SubmitButtonProps';

export default function SubmitButton({ form, children }: React.PropsWithChildren<SubmitButtonProps>) {
	const [submittable, setSubmittable] = React.useState<boolean>(false);

	const values = Form.useWatch([], form);

	React.useEffect(() => {
		form
			.validateFields({ validateOnly: true })
			.then(() => setSubmittable(true))
			.catch(() => setSubmittable(false));
	}, [form, values]);

	return (
		<Button block type="primary" htmlType="submit" disabled={!submittable}>
			{children}
		</Button>
	);
};