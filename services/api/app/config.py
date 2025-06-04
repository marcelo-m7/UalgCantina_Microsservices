# services/api/app/config.py

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Variáveis de conexão MySQL
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_DB: str

    # Firebase
    FIREBASE_PROJECT_ID: str

    # CORS
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    class Config:
        env_file = ".env"
        case_sensitive = False

    def db_url(self) -> str:
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
        )

    @property
    def allowed_origins_list(self) -> list[str]:
        """Return CORS origins as a list.

        Pydantic will populate ``allowed_origins`` from the ``ALLOWED_ORIGINS``
        environment variable. The attribute name is ``allowed_origins`` in the
        model, therefore we should reference that attribute here. Using the
        upper‑case variant would raise ``AttributeError`` at runtime.
        """
        return [
            origin.strip()
            for origin in self.allowed_origins.split(",")
            if origin.strip()
        ]


settings = Settings()
