from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.database import Base

class Alergeno(Base):
    __tablename__ = "alergenos"

    id     = Column(Integer, primary_key=True, index=True)
    nome   = Column(String(255), nullable=False, unique=True)

    pratos = relationship(
        "Prato",
        back_populates="alergeno"
        # (opcional) , cascade="all, delete-orphan"
    )
