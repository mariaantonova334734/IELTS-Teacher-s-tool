import { EditOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Space, Table, TableColumnsType } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateUnitRequest, GetUnitsByStudentResponse, UnitResponse } from '../../api';
import { unitsService } from '../../api/units/service/units.service';
import { CreateUnit, EditUnit } from '../../entities';
import { Loader, NoData, StyledButton } from '../../widgets';

const HEIGHT_FOR_HINT = '30vh';


/**
 * Страница для показа таблицы с объектами
 * @params studentId - id выбранного студента
 */
export default function ShowUnits() {
	const { studentId } = useParams<string>();
	const [units, setUnits] = useState<GetUnitsByStudentResponse>([]);
	const [mode, setMode] = useState<'edit' | 'create' | null>(null);
	const [selectedUnit, setSelectedUnit] = useState<UnitResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const navigate = useNavigate();

	const getAllUnits = async () => {
		try {
			setLoading(true);
			const response = await unitsService.getUnitByStudent({
				studentId: studentId as string
			});
			setUnits(response);
		} finally {
			setLoading(false);
		}
	};

	const uploadAllUnits = useCallback(async() => {
		try {
			setLoading(true);
			const response = await unitsService.getUnitByStudent({
				studentId: studentId as string
			});
			setUnits(response);
		} finally {
			setLoading(false);
		}
	}, [studentId]);
    
	useEffect(() => {
		uploadAllUnits();
	}, [uploadAllUnits]);

	const editUnit = async({unitId, name} : {unitId: string, name: string}) => {
		try {
			await unitsService.updateUnit({
				unitId,
				studentId: studentId as string,
				name
			});
			await getAllUnits();
		} catch {
			console.error('Ошибка при редактировании юнита');
		}
	};

	const createUnit = async(unit: CreateUnitRequest) => {
		try {
			await unitsService.createUnit(unit);
			await getAllUnits();
		} catch {
			console.error('Ошибка при создании юнита');
		}
	};
    
	const columnsMeta: TableColumnsType<UnitResponse> = [
		{
			title: 'Название юнита',
			dataIndex: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
			sortDirections: ['descend', 'ascend', 'descend'],
			defaultSortOrder: 'ascend'
		},
		{
			title: 'Действия',
			dataIndex: 'action',
			render: (_, record) => (
				<Space> 
					<StyledButton type="primary" onClick={() => {
						navigate(`/words/${record.id}`);
					}
					}>Просмотреть</StyledButton>
					<StyledButton icon={<EditOutlined />} onClick={() => { setSelectedUnit(record); setMode('edit');}}></StyledButton>
				</Space>
			)
		}
	];

	const clearUnit = () => {
		setSelectedUnit(null);
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
					<Button style={{marginBottom: '10px'}} onClick={() => { setMode('create'); }}>Добавить юнит</Button>

					<EditUnit
						selectedUnit={selectedUnit}
						clearUnit={clearUnit}
						studentId={studentId as string} 
						editUnit={editUnit}
						getAllUnits={getAllUnits}
						isOpen={mode == 'edit'}
					/>

					<CreateUnit
						studentId={studentId  as string} 
						createUnit={createUnit}
						getAllUnits={getAllUnits}
						clearUnit={clearUnit}
						isOpen={mode == 'create'}
					/>

					<Table
						columns={columnsMeta}
						dataSource={units}
						locale={{
							emptyText: <NoData height={HEIGHT_FOR_HINT} description={'Нет данных о юнитах'}/>
						}}
						pagination={ false }
						rowKey={'id'}
					/>
				</>}
		</ConfigProvider>
	);
}