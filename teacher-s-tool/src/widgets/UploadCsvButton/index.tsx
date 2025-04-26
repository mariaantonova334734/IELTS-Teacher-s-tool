import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { App, Button, Flex, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { useState } from 'react';
import { UploadCsvButtonProps } from './UploadCsvButton.props';

export default function UploadCsvButton(props: UploadCsvButtonProps) {
	const { message } = App.useApp();
	const [file, setFile] = useState<File | null>(null);

	const beforeUpload = (file: File) => {
		const isCsv = file.type === 'text/csv';
		if (!isCsv) {
			message.error(`${file.name} is not a csv file`);
		} 
		return isCsv || Upload.LIST_IGNORE;
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleUpload = async (option: any) => {
		const file = option.file as File;
		setFile(file);
		option.onSuccess(file);
	};

	const onChange = (info: UploadChangeParam<UploadFile>) => {
		if (info.file.status == 'removed') {
			setFile(null);
		}
		if (info.file.status == 'done') {
			setFile(info.file.response);
		}
	};

	const onUpload = async () => {
		if (file) {
			await props.uploadFile(file);
		} else {
			message.error('Выберите файл');
			console.error('Выберите файл');
		}
	};
	return (
		<Flex gap={10} dir='horizontal' style={{height: 'max-content'}}>
			{
				file ? <Button icon={<DownloadOutlined />} onClick={onUpload}>Загрузить из выбранного файла</Button> : <></>
			}
			<Upload
				onChange={onChange}
				accept="text/csv"
				customRequest={handleUpload}
				maxCount={1}
				beforeUpload={beforeUpload}>
				<Button icon={<UploadOutlined />}>Только .csv</Button>
			</Upload>
		</Flex>
		
	);
}