# app/main.py

"""
Main FastAPI app instance declaration
"""



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core import conf
from app.api.api import api_router
from app.logging import console_log as log
from app.core.db import create_db_and_tables
from app.core.security import create_default_superuser
import tracemalloc

app = FastAPI(
    title=conf.settings.PROJECT_NAME,
    version=conf.settings.VERSION,
    description=conf.settings.DESCRIPTION,
    openapi_url="/openapi.json",
    docs_url="/docs",
)

# Set all CORS enabled origins
if conf.settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in conf.settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    log.info("Starting up...")
    await create_db_and_tables()
    await create_default_superuser()
    tracemalloc.start()
    

@app.on_event("shutdown")
async def shutdown_event():
    log.info("Shutting down...")
    tracemalloc.stop()

@app.get("/ping")
async def pong():
    log.info("Pong!")
    return {"message": "success!"}



@app.get("/")
async def root():
    log.info("Root!")
    return {"message": "Hello World!"}