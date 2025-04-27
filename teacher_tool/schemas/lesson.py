from typing import Optional

import pydantic


class StudentForListingResponse(pydantic.BaseModel):
    id: int
    fio: str
    group: str
    is_active: Optional[bool] = None
    teacher_id: Optional[int] = None

class UnitForListingResponse(pydantic.BaseModel):
    id: int
    name: str

class WordForListingResponse(pydantic.BaseModel):
    id: int
    title: str
    translation: str
    topic: Optional[str] = None
    is_completed: bool

class CreateUnitWordRequest(pydantic.BaseModel):
    title: str
    topic: str

class CreateUnitRequest(pydantic.BaseModel):
    name: str

class UpdateUnitWordRequest(pydantic.BaseModel):
    title: Optional[str] = None
    translation: Optional[str] = None
    completed: Optional[bool] = None
    topic: Optional[str] = None

class CreateStudentRequest(pydantic.BaseModel):
    group: str
    fio: str
    teacher_id: Optional[int] = None

class UpdateStudentRequest(pydantic.BaseModel):
    group: Optional[str] = None
    fio: Optional[str] = None
    is_active: Optional[bool] = None


class UpdateTeacherRequest(pydantic.BaseModel):
    fio: str

class UpdateUnitRequest(pydantic.BaseModel):
    name: Optional[str] = None


class CsvFileColumns(pydantic.BaseModel):
    title: str
    topic: str

class WordSynonymsSchema(pydantic.BaseModel):
    id: int
    title: str
