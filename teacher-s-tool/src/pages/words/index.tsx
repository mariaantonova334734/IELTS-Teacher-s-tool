import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { App, Button, ConfigProvider, Flex, Space, Table, TableColumnsType, Tooltip } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AddWordToUnitRequest, DeleteWordByUnitRequest, WordResponse } from '../../api';
import { unitsService } from '../../api/units/service/units.service';
import { wordService } from '../../api/words/service/words.service';
import { CreateWord, EditWord, SynonymColumn, UpdateWordStatus } from '../../entities';
import { Loader, NoData, StyledButton } from '../../widgets';
import UploadCsvButton from '../../widgets/UploadCsvButton';
import { WordsTable } from './WordsProps';

const HEIGHT_FOR_HINT = '30vh';

/**
 * Страница для показа таблицы с объектами
 * @params unitId - id выбранного юнита
 */
export default function ShowWords() {
	const { message } = App.useApp();
	const [words, setWords] = useState<WordsTable[]>([]);
	const [execSaveStatus, setSaveStatus] = useState<boolean>(false);
	const { unitId } = useParams<string>();
	const [mode, setMode] = useState<'edit' | 'create' | null>(null);
	const [selectedWord, setSelectedWord] = useState<WordResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const getAllWords = async () => {
		try {
			setLoading(true);
			const response = await wordService.getWordsByUnit({
				unitId: unitId as string
			});
			setWords(response);
			setSaveStatus(false);
		} finally {
			setLoading(false);
		}
	};

	const editUnitViaFile = async (file: File) => 
	{
		const messageKey = 'updatable';
		try {
			setLoading(true);
			await unitsService.updateUnitViaFile({
				file,
				unitId: unitId as string
			});
			const response = await wordService.getWordsByUnit({
				unitId: unitId as string
			});
			setWords(response);
			message.open({
				key: messageKey,
				type: 'success',
				content: 'Обновление произошло успешно'
			});
		} catch (e: unknown) {
			if (e instanceof Error) {
				console.error(e, 'Ошибка при обновлении юнита через файл');
				message.open({
					key: messageKey,
					type: 'error',
					content: 'Упс, что-то пошло не так!'
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const uploadAllWords = useCallback(async() => {
		try {
			setLoading(true);
			const response = await wordService.getWordsByUnit({
				unitId: unitId as string
			});
			setWords(response);
			setSaveStatus(false);
		} finally {
			setLoading(false);
		}
	}, [unitId]);
    
	useEffect(() => {
		uploadAllWords();
	}, [uploadAllWords]);

	const editWord = async(
		{topic, title, translation, completed}: 
		{topic: string, title: string, translation: string, completed: boolean}) => 
	{
		try {
			if(selectedWord) {
				await wordService.updateWord({
					title,
					translation,
					completed,
					topic,
					wordId: selectedWord.id,
					unitId: unitId as string
				});
			}
		} catch {
			console.error('Ошибка при редактировании слова');
		} 
	};

	const createWord = async(word: AddWordToUnitRequest) => {
		try {
			await wordService.addWord(word);
		} catch {
			console.error('Ошибка при создании слова');
		}
	};

	const deleteWord = async(word: DeleteWordByUnitRequest) => {
		try {
			await wordService.deleteWord(word);
			await getAllWords();
		} catch {
			console.error('Ошибка при удалении слова');
		}
	};
    
	const columnsMeta: TableColumnsType<WordsTable> = [
		{
			title: 'Изучено',
			dataIndex: 'is_completed',
			render: (completed, record: WordResponse) => {
				if (!unitId) {
					return 'Нет данных';
				}
				return <UpdateWordStatus unitId={unitId} startUpload={execSaveStatus} word={record} initialIsCompleted={completed}/>;
			}
		},
		{
			title: 'Тема',
			dataIndex: 'topic',
			sorter: (a, b) => a.topic.localeCompare(b.topic),
			sortDirections: ['descend', 'ascend', 'descend'],
			defaultSortOrder: 'ascend'
		},
		{
			title: 'Текст слова',
			dataIndex: 'title'
		},
		{
			title: 'Значение',
			dataIndex: 'translation'
		},
		{
			title: 'Синонимы',
			dataIndex: 'synonyms',
			render: (_, record: WordResponse) => {
				return <SynonymColumn wordId={record.id}/>;
			}
		},
		

		{
			title: 'Действия',
			dataIndex: 'action',
			render: (_, record) => (
				<Space> 
					<StyledButton icon={<EditOutlined />} onClick={() => { setSelectedWord(record); setMode('edit');}}></StyledButton>
					<StyledButton danger icon={<DeleteOutlined />} onClick={async () => { setSelectedWord(record); await deleteWord({unitId: unitId as string, wordId: record.id});}}></StyledButton>
				</Space>
			)
		}
	];

	const clearWord = () => {
		setSelectedWord(null);
		setMode(null);
	};
    
	return (
		<ConfigProvider
			theme={{
				token: {
					colorBgContainer: '#ffe7ba'
				},
				components: {
					Button: {
						colorPrimary: '#69b1ff'
					},
					Table: {
						borderColor: 'black'
					}
				}
			}}>
			{loading ? <Loader height={HEIGHT_FOR_HINT}/> :
				<>
					<Flex justify='space-between'>
						<Space>
							<Button style={{marginBottom: '10px'}} onClick={() => { setMode('create'); }}>Добавить слово</Button>
							<Tooltip placement='top' title={'Нажмите перед обновлением'}>
								<Button style={{marginBottom: '10px'}} onClick={() => { setSaveStatus(true);}}>Сохранить  ✓</Button>
							</Tooltip>
						</Space>
						
						 <UploadCsvButton
						 uploadFile={editUnitViaFile}/>
					</Flex>
					
					<EditWord
						selectedWord={selectedWord}
						clearWord={clearWord}
						unitId={unitId as string} 
						editWord={editWord}
						getAllWords={getAllWords}
						isOpen={mode == 'edit'}
					/>

					<CreateWord
						unitId={unitId as string} 
						clearWord={clearWord}
						getAllWords={getAllWords}
						createWord={createWord}
						isOpen={mode == 'create'}
					/>

					<Table<WordsTable>
						bordered
						columns={columnsMeta}
						dataSource={words}
						locale={{
							emptyText: <NoData height={HEIGHT_FOR_HINT} description={'Нет данных о словах'}/>
						}}
						pagination={ false }
						rowKey={'id'}
					/>
				</>}
		</ConfigProvider>
	);
}