from contextlib import asynccontextmanager

import uvicorn
import fastapi
from fastapi.middleware.cors import CORSMiddleware

from api.auth import auth_router
from api.lessons import lessons_router
from settings.db import initialize_postgres_db_test


@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):

    await initialize_postgres_db_test()
    yield

app = fastapi.FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(lessons_router)




if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)
