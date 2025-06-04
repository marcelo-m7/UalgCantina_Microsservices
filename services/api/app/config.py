# services/api/app/config.py

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # MySQL connection variables
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_HOST: str = "db" #"db"
    MYSQL_PORT: int = 3306
    MYSQL_DB: str

    # Firebase
    FIREBASE_PROJECT_ID: str

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def db_url(self) -> str:
        """Build the SQLAlchemy database URL from settings."""
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{'db'}:{self.MYSQL_PORT}/{self.MYSQL_DB}?charset=utf8mb4"
        )

    @property
    def allowed_origins_list(self) -> list[str]:
        """
        Returns CORS origins as a list.
        Loaded from the environment variable ALLOWED_ORIGINS.
        """
        return [
            origin.strip()
            for origin in self.ALLOWED_ORIGINS.split(",")
            if origin.strip()
        ]


settings = Settings()
