import fastapi
from fastapi import UploadFile, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import JSONResponse

from dependencies.auth_dependency import get_current_user
from external_systems.unit_of_work import AsyncSqlAlchemyUnitOfWork
from models import Teacher, Student
from schemas.lesson import CreateStudentRequest
from settings.db import get_async_session
from repository import lesson as lesson_repo
from schemas import lesson as lesson_schema
from repository import auth as auth_repo
from settings.settings import Config
from utils import UnitParams, CsvFileManager, OxfordApi, Token

lessons_router = fastapi.APIRouter(
    prefix='/lessons',
    tags=['lessons'],
    dependencies=[fastapi.Depends(get_current_user)]
)


@lessons_router.post(
    '/students',
    status_code=fastapi.status.HTTP_201_CREATED,
    response_model=None
)
async def create_student(
    body: CreateStudentRequest,
    current_user: Teacher = Depends(get_current_user),  # текущий преподаватель по токену
    session: AsyncSession = Depends(get_async_session),  # сессия
):
    # cоздаем объект студента
    student = Student(
        fio=body.fio,
        group=body.group,
        is_active=True,
        teacher_id=current_user.id  # берем ID текущего пользователя-преподавателя
    )

    #сохраняем в БД
    session.add(student)
    await session.commit()
    await session.refresh(student)  # обновляем объект из БД

    return student  # возвращаем созданного студента



@lessons_router.get(
    '/{teacher_id}/students',
    status_code=fastapi.status.HTTP_200_OK,
    response_model=list[lesson_schema.StudentForListingResponse]
)
async def get_students(
    teacher_id: int,
    session: AsyncSession = fastapi.Depends(get_async_session),
    current_user: Teacher = fastapi.Depends(get_current_user),
) -> list[lesson_schema.StudentForListingResponse]:
    if teacher_id != current_user.id:
        raise fastapi.HTTPException(status_code=403, detail="Access forbidden")

    async_unit_of_work = AsyncSqlAlchemyUnitOfWork(session)

    async with async_unit_of_work:
        repository = lesson_repo.StudentRepository(session)
        students = await repository.list(teacher_id=teacher_id)

    return [
        lesson_schema.StudentForListingResponse(
            group=student.group,
            id=student.id,
            fio=student.fio,
            is_active=student.is_active,
            teacher_id=student.teacher_id
        ) for student in students
    ]

@lessons_router.patch(
    '/students/{student_id}',
    status_code=fastapi.status.HTTP_200_OK,
    response_model=None
)
async def update_student_profile(
    body: lesson_schema.UpdateStudentRequest,
    student_id: int = fastapi.Path(...),
    session: AsyncSession = fastapi.Depends(get_async_session),
) -> None:
    async_unit_of_work = AsyncSqlAlchemyUnitOfWork(session)

    async with async_unit_of_work:
        repository = lesson_repo.StudentRepository(session)
        await repository.update(student_id, body.model_dump())


@lessons_router.get(
    '/students/{student_id}/units',
    status_code=fastapi.status.HTTP_200_OK,
    response_model=list[lesson_schema.UnitForListingResponse]
)
async def get_units_by_student(
    student_id: int = fastapi.Path(...),
    session: AsyncSession = fastapi.Depends(get_async_session),
) -> list[lesson_schema.UnitForListingResponse]:
    async_unit_of_work = AsyncSqlAlchemyUnitOfWork(session)

    async with async_unit_of_work:
        repository = lesson_repo.UnitRepository(session)
        units = await repository.list(student_id=student_id)

    return [
        lesson_schema.UnitForListingResponse(
            id=unit.id, name=unit.name
        ) for unit in units
    ]

@lessons_router.post(
    '/students/{student_id}/units',
    status_code=fastapi.status.HTTP_201_CREATED,
    response_model=None
)
async def create_unit(
    body: lesson_schema.CreateUnitRequest,
    student_id: int = fastapi.Path(...),
    session: AsyncSession = fastapi.Depends(get_async_session),
) -> None:
    async_unit_of_work = AsyncSqlAlchemyUnitOfWork(session)

    async with async_unit_of_work:
        repository = lesson_repo.UnitRepository(session)
        await repository.create(body, student_id=student_id)

@lessons_router.patch(
    '/students/{student_id}/units/{unit_id}',
    status_code=fastapi.status.HTTP_200_OK,
    response_model=None
)
async def update_unit(
    body: lesson_schema.UpdateUnitRequest,
    unit_id: int = fastapi.Path(...),
    session: AsyncSession = fastapi.Depends(get_async_session),
) -> None:
    async_unit_of_work = AsyncSqlAlchemyUnitOfWork(session)

    async with async_unit_of_work:
        repository = lesson_repo.UnitRepository(session)
        await repository.update(unit_id, body.model_dump())



@lessons_router.patch(
    '/teachers/{teacher_id}',
    status_code=fastapi.status.HTTP_200_OK,
    response_model=None
)
async def update_teacher_profile(
    body: lesson_schema.UpdateTeacherRequest,
    teacher_id: int = fastapi.Path(...),
    session: AsyncSession = fastapi.Depends(get_async_session),
) -> None:
    async_unit_of_work = AsyncSqlAlchemyUnitOfWork(session)

    async with async_unit_of_work:
        repository = auth_repo.TeacherRepository(session)
        # await repository.update(teacher_id, body.model_dump()) # c exclude_unset=True можно обновлять только то, что прислал клиент, не затирая остальные поля None-ами или старыми значениями
        await repository.update(teacher_id, body.model_dump(exclude_unset=True)) # исключает поля, которые не были переданы в PATCH-запросе


@lessons_router.get(
    '/units/{unit_id}/words',
    status_code=fastapi.status.HTTP_200_OK,
    response_model=list[lesson_schema.WordForListingResponse]
)
async def get_words_by_unit(
    unit_id: int = fastapi.Path(...),
    session: AsyncSession = fastapi.Depends(get_async_session),
) -> list[lesson_schema.WordForListingResponse]:
    async_unit_of_work = AsyncSqlAlchemyUnitOfWork(session)

    async with async_unit_of_work:
        repository = lesson_repo.WordRepository(session)
        words = await repository.list(unit_id=unit_id)

    return [
        lesson_schema.WordForListingResponse(
            id=word.id,
            title=word.title,
            translation=word.translation,
            topic=word.topic,
            is_completed=word.completed
        ) for word in words
    ]



@lessons_router.post(
    "/units/{unit_id}/words",
    status_code=fastapi.status.HTTP_201_CREATED,
    response_model=None
)
async def create_new_word_into_unit(
    body: lesson_schema.CreateUnitWordRequest,
    unit_id: int = fastapi.Path(...),
    session: AsyncSession = fastapi.Depends(get_async_session),
    # user: Teacher = fastapi.Depends(get_current_user)
):
    async_unit_of_work = AsyncSqlAlchemyUnitOfWork(session)

    word_meta = await OxfordApi.parse_word_from_api(body.title)

    # если слово не найдено, сохраняем его без значений
    word_meaning = OxfordApi.get_meaning(word_meta) if word_meta else ""
    word_synonyms = OxfordApi.get_synonyms(word_meta) if word_meta else []

    async with async_unit_of_work:
        repository = lesson_repo.WordRepository(session)

        # записываем слово в любом случае
        word_id = await repository.create(body, word_meaning, unit_id)
        unit_words = await repository.list(unit_id)
        #если слово найдено, записываем синонимы
        if word_meta:
            repository = lesson_repo.WordSynonymRepository(session)
            await repository.bulk_create(word_synonyms, word_id)

        repository = lesson_repo.UnitRepository(session)
        await repository.update(
            unit_id
        )
    if not word_meta:
        return JSONResponse(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            content={"details": "Слово не найдено"}
        )

    return JSONResponse(
        status_code=fastapi.status.HTTP_201_CREATED,
        content={"details": "Слово добавлено"}
    )


@lessons_router.patch(
    "/units/{unit_id}/words/{word_id}",
    status_code=fastapi.status.HTTP_200_OK,
    response_model=None
)
async def update_unit_word(
    body: lesson_schema.UpdateUnitWordRequest,
    unit_id: int = fastapi.Path(...),
    session: AsyncSession = fastapi.Depends(get_async_session),
    word_id: int = fastapi.Path(...),
) -> None:
    async_unit_of_work = AsyncSqlAlchemyUnitOfWork(session)

    async with async_unit_of_work:
        repository = lesson_repo.WordRepository(session)
        await repository.update(word_id, body.model_dump())

    async with async_unit_of_work:
        repository = lesson_repo.WordRepository(session)
        unit_words = await repository.list(unit_id)
        repository = lesson_repo.UnitRepository(session)
        await repository.update(
            unit_id
        )

@lessons_router.delete(
    '/units/{unit_id}/words/{word_id}',
    status_code=fastapi.status.HTTP_204_NO_CONTENT,
    response_model=None
)
async def delete_unit_word(
        unit_id: int = fastapi.Path(...),
        session: AsyncSession = fastapi.Depends(get_async_session),
        word_id: int = fastapi.Path(...),
) -> None:
    async_unit_of_work = AsyncSqlAlchemyUnitOfWork(session)

    async with async_unit_of_work:
        # Сначала удаляем синонимы слова
        synonym_repo = lesson_repo.WordSynonymRepository(session)
        await synonym_repo.delete_by_word_id(word_id)

        # Теперь удаляем само слово
        word_repo = lesson_repo.WordRepository(session)
        await word_repo.delete(word_id)



@lessons_router.post(
    '/units/{unit_id}/words/upload',
    status_code=fastapi.status.HTTP_201_CREATED,
    response_model=None
)
async def upload_unit_words(
    unit_id: int = fastapi.Path(...),
    session: AsyncSession = fastapi.Depends(get_async_session),
    file: UploadFile = fastapi.File(...)
) -> None:
    async_unit_of_work = AsyncSqlAlchemyUnitOfWork(session)

    contents = await file.read()
    contents = contents.decode("utf-8")
    list_of_words = CsvFileManager.read(contents)

    for one_word in list_of_words:
        async with async_unit_of_work:
            word_meta = await OxfordApi.parse_word_from_api(one_word.title)

            if word_meta:
                word_meaning = OxfordApi.get_meaning(word_meta)
                word_synonyms = OxfordApi.get_synonyms(word_meta)

                word_repo = lesson_repo.WordRepository(session)
                word_id = await word_repo.create(one_word, word_translation=word_meaning, unit_id=unit_id)

                word_synonyms_repo = lesson_repo.WordSynonymRepository(session)
                await word_synonyms_repo.bulk_create(word_synonyms, word_id)


    async with async_unit_of_work:
        repository = lesson_repo.WordRepository(session)
        unit_words = await repository.list(unit_id)
        repository = lesson_repo.UnitRepository(session)
        await repository.update(
            unit_id
        )

@lessons_router.get(
    '/words/{word_id}/synonyms',
    status_code=fastapi.status.HTTP_200_OK,
    response_model=list[lesson_schema.WordSynonymsSchema]
)
async def get_word_synonyms(
    word_id: int = fastapi.Path(...),
    session: AsyncSession = fastapi.Depends(get_async_session),
) -> list[lesson_schema.WordSynonymsSchema]:
    async_unit_of_work = AsyncSqlAlchemyUnitOfWork(session)
    repository = lesson_repo.WordSynonymRepository(session)

    async with async_unit_of_work:
        word_synonyms = await repository.list(word_id=word_id)

    return [
        lesson_schema.WordSynonymsSchema(id=synonym.id, title=synonym.title)
        for synonym
        in word_synonyms
    ]
