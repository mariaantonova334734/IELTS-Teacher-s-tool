import typing as t
from typing import Optional, Union, Any, Sequence

import sqlalchemy as sa

import models
from repository.abstract import AbstractRepository
from schemas import lesson as lesson_schemas


class StudentRepository(AbstractRepository):
    async def list(self, teacher_id: int) -> list[models.Student]:
        stmt = sa.select(models.Student).where(models.Student.teacher_id == teacher_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def update(self, idx: int, body: dict) -> None:
        body = {key: value for key, value in body.items() if value is not None}
        stmt = sa.update(models.Student).where(models.Student.id == idx).values(**body)
        await self.session.execute(stmt)
    async def create(self, body: lesson_schemas.CreateStudentRequest) -> models.Student:
        teacher_id = None

        if body.teacher_login:
            stmt = sa.select(models.Teacher.id).where(models.Teacher.login == body.teacher_login)
            result = await self.session.execute(stmt)
            teacher_id = result.scalar()

        stmt = sa.insert(models.Student).values(
            fio=body.fio,
            group=body.group,
            is_active=True,
            teacher_id=teacher_id
        ).returning(models.Student)

        result = await self.session.execute(stmt)
        await self.session.commit()

        student = result.scalar_one()
        return student


class UnitRepository(AbstractRepository):

    async def list(self, student_id: Optional[int] = None):
        stmt = sa.select(models.Unit)
        filters = []

        if student_id:
            filters.append(models.Unit.student_id == student_id)

        stmt = stmt.filter(*filters)
        units = (await self.session.execute(stmt)).scalars().all()

        return units

    async def update(self, idx: int, body: t.Any) -> t.NoReturn:
        stmt = sa.update(models.Unit).where(models.Unit.id == idx).values(**body)
        await self.session.execute(stmt)

    async def create(
        self,
        body: lesson_schemas.CreateUnitRequest,
        student_id: Optional[int] = None
    ) -> None:
        stmt = sa.insert(models.Unit).values(
            name=body.name,
            student_id=student_id
        )
        await self.session.execute(stmt)

class WordRepository(AbstractRepository):

    async def list(self, unit_id: Optional[int] = None) -> list:
        stmt = sa.select(models.Word)
        filters = []

        if unit_id:
            filters.append(models.Word.unit_id == unit_id)

        stmt = stmt.filter(*filters)
        words = (await self.session.execute(stmt)).scalars().all()

        return words

    async def create(
        self,
        body: Union[lesson_schemas.CreateUnitWordRequest, lesson_schemas.CsvFileColumns],
        word_translation: Optional[str] = None,
        unit_id: Optional[int] = None
    ) -> int:
        stmt = sa.insert(models.Word).values(
            title=body.title,
            unit_id=unit_id,
            topic=body.topic,
            translation=word_translation
        )
        result = await self.session.execute(stmt)
        return result.inserted_primary_key[0] if result.inserted_primary_key else 0

    async def update(self, idx: int, body: dict) -> None:
        body = {key: value for key, value in body.items() if value is not None}
        stmt = sa.update(models.Word).where(models.Word.id == idx).values(**body)
        await self.session.execute(stmt)


    async def delete(self, idx: int) -> None:
        stmt = sa.delete(models.Word).where(models.Word.id == idx)
        await self.session.execute(stmt)

from sqlalchemy import delete, Row, RowMapping


class WordSynonymRepository(AbstractRepository):

    async def bulk_create(self, titles: list, word_id: int) -> None:
        for title in titles:
            stmt = sa.insert(models.WordSynonyms).values(
                title=title,
                word_id=word_id,
            )
            await self.session.execute(stmt)

    async def list(self, word_id: Optional[int] = None) -> Sequence[Union[Union[Row[Any], RowMapping], Any]]:
        stmt = sa.select(models.WordSynonyms)
        filters = []

        if word_id:
            filters.append(models.WordSynonyms.word_id == word_id)

        stmt = stmt.filter(*filters)
        word_synonyms = (await self.session.execute(stmt)).scalars().all()

        return word_synonyms
    #для удаления синонимов по word_id
    async def delete_by_word_id(self, word_id: int) -> None:
        stmt = delete(models.WordSynonyms).where(models.WordSynonyms.word_id == word_id)
        await self.session.execute(stmt)
        await self.session.commit()
