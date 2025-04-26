import { Button, List } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CreateStudentRequest, GetAllStudentsResponseDto, UpdateStudentRequest } from '../../api';
import { StudentResponseDto } from '../../api/students/dto/getAll.interface';
import { studentService } from '../../api/students/service/student.service';
import { CreateStudent, EditStudent } from '../../entities';
import { RootState } from '../../store/store';
import { Loader, NoData, Student } from '../../widgets';


const NO_DATA_FOUND_TEXT = 'No students found';
const HEIGHT_FOR_HINT = '30vh';
export default function ShowStudents() {
	const teacherId = useSelector((s: RootState) => s.user.id);
	const [students, setStudents] = useState<GetAllStudentsResponseDto>([]);
	const [selectedStudent, setSelectedStudent] = useState<UpdateStudentRequest | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [mode, setMode] = useState<'edit' | 'create' | null>(null);

	const sortStudents = (student1: StudentResponseDto, student2: StudentResponseDto) => {
		if (student1.is_active === student2.is_active) {
			return student1.fio.localeCompare(student2.fio);
		} else {
			return student1.is_active ? -1 : 1;
		}
	};

	const getAllStudents = async () => {
		try {
			setLoading(true);
			if (!teacherId) {
				throw new Error('Id не установлен');
			}
			const response = await studentService.getAllStudents({ teacherId });
			setStudents(response.sort((student1, student2) => {
				return sortStudents(student1, student2);
			}));

		} finally {
			setLoading(false);
		}
	};
	const uploadAllStudents = useCallback(async() => {
		try {
			setLoading(true);
			if (!teacherId) {
				throw new Error('Id не установлен');
			}
			const response = await studentService.getAllStudents({ teacherId });
			setStudents(response.sort((student1, student2) => {
				return sortStudents(student1, student2);
			}));
		} finally {
			setLoading(false);
		}
	}, [teacherId]);

	useEffect(() => {
		uploadAllStudents();
	}, [uploadAllStudents]);

	const createStudent = async (newStudent: CreateStudentRequest) => {
		return await studentService.createStudent(newStudent);
	};
	
	const updateStudent = async (req: UpdateStudentRequest) => {
		await studentService.updateStudent({
			...req
		});
	};
	

	const clearMode = () => {
		setMode(null);
	};

	return (
		loading ? <Loader height={HEIGHT_FOR_HINT}/>
			:<>
				<EditStudent 
					updateStudent={updateStudent}
					selectedStudent={selectedStudent}
					isOpen={mode === 'edit'}
					onEditSuccess={async () => {await getAllStudents();}}
					clearMode={clearMode}
				/>
				<CreateStudent
					createStudent={createStudent}
					isOpen={mode == 'create'}
					onCreateSuccess={async () => {await getAllStudents();}}
					clearMode={clearMode}
				/>
				<Button style={{marginBottom: '10px'}} onClick={() => { setMode('create'); }}>Добавить студента</Button>
			 <List
					locale={{
						emptyText: <NoData height={HEIGHT_FOR_HINT} description={NO_DATA_FOUND_TEXT}/>
					}}
					grid={{
						gutter: 16,
						xs: 1,
						sm: 2,
						md: 4,
						lg: 4,
						xl: 6,
						xxl: 3
					}}
					dataSource={students}
					renderItem={(student) => (
						<List.Item key={student.id}>
							<Student {...student} openEditModal={() => {setSelectedStudent({...student}); setMode('edit');}}/>
							
						</List.Item>
					)}>
				</List>


			</>
	);

}