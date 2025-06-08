# services/api/app/config.py
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ───── MySQL ──────────────────────────────────────────
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_HOST: str
    MYSQL_PORT: int = 3306
    MYSQL_DB: str

    # ───── Firebase ──────────────────────────────────────
    FIREBASE_PROJECT_ID: str

    # ───── CORS ───────────────────────────────────────────
    # agora opcional – assume string vazia se não vier da env
    ALLOWED_ORIGINS: Optional[str] = ""

    # Config do Pydantic-Settings (v2)
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,   # permite usar nomes maiúsculos ou minúsculos
    )

    # ---------- helpers ----------
    @property
    def db_url(self) -> str:
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
        )

    @property
    def allowed_origins_list(self) -> List[str]:
        return [
            origin.strip()
            for origin in (self.ALLOWED_ORIGINS or "").split(",")
            if origin.strip()
        ]


settings = Settings()
