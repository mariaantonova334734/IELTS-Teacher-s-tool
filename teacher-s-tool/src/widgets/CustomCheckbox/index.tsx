import { Checkbox, CheckboxProps, ConfigProvider } from 'antd';

const CustomCheckbox = ({...props }: CheckboxProps) => {
	return (
		<ConfigProvider theme={{
			components: {
				Checkbox: {
					colorBorder: '#000000'
				}
			}
		}}>
			<Checkbox {...props} />
		</ConfigProvider>);
};

export { CustomCheckbox };

