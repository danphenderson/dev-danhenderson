# app/conf.py

from pathlib import Path
from typing import Literal, Union
from pydantic_settings import BaseSettings
from toml import load as toml_load
from pydantic import AnyHttpUrl, AnyUrl, EmailStr, validator

PROJECT_DIR = Path(__file__).parent.parent.parent
PYPROJECT_CONTENT = toml_load(f"{PROJECT_DIR}/pyproject.toml")["project"]



class Settings(BaseSettings):

    class Config:
        case_sensitive = False
        env_file = PROJECT_DIR / ".env"
        env_file_encoding = "utf-8"
        

    # CORE SETTINGS
    SECRET_KEY: str
    ENVIRONMENT: Literal["DEV", "PYTEST", "STAGE", "PRODUCTION"]
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    BACKEND_CORS_ORIGINS: Union[str, list[AnyHttpUrl]]
    LOGGING_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
    LOGGING_FILE_NAME: str = "app_log"
    PUBLIC_ASSETS_DIR: str = "public"
    
    # PROJECT NAME, VERSION AND DESCRIPTION
    PROJECT_NAME: str = PYPROJECT_CONTENT["name"]
    VERSION: str = PYPROJECT_CONTENT["version"]
    DESCRIPTION: str = PYPROJECT_CONTENT["description"]

    # POSTGRESQL DEFAULT DATABASE
    DEFAULT_DATABASE_HOSTNAME: str
    DEFAULT_DATABASE_USER: str
    DEFAULT_DATABASE_PASSWORD: str
    DEFAULT_DATABASE_PORT: int
    DEFAULT_DATABASE_DB: str
    DEFAULT_SQLALCHEMY_DATABASE_URI: str = ""

    # FIRST SUPERUSER
    FIRST_SUPERUSER_EMAIL: EmailStr
    FIRST_SUPERUSER_PASSWORD: str

    # VALIDATORS
    @validator("BACKEND_CORS_ORIGINS")
    def _assemble_cors_origins(cls, cors_origins: Union[str, list[AnyHttpUrl]]):
        if isinstance(cors_origins, str):
            return [item.strip() for item in cors_origins.split(",")]
        return cors_origins

    @validator("DEFAULT_SQLALCHEMY_DATABASE_URI")
    def _assemble_default_db_connection(cls, v: str, values: dict[str, str]) -> str:
        return AnyUrl.build(
            scheme="postgresql+asyncpg",
            username=values["DEFAULT_DATABASE_USER"],
            password=values["DEFAULT_DATABASE_PASSWORD"],
            host=values["DEFAULT_DATABASE_HOSTNAME"],
            port=values["DEFAULT_DATABASE_PORT"], # type: ignore
            path=f"{values['DEFAULT_DATABASE_DB']}",
        ) 

def get_settings(**kwargs) -> Settings:
    settings = Settings(**kwargs)
    return settings

settings = get_settings()
