# config.py
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Variáveis de ambiente lidas do .env
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_DB: str

    FIREBASE_PROJECT_ID: str

    # Origens permitidas no CORS (separadas por vírgula)
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = False

    def db_url(self) -> str:
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
        )

settings = Settings()
