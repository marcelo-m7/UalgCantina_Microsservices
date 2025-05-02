from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base

class Prato(Base):
    __tablename__ = "pratos"

    id             = Column(Integer, primary_key=True, index=True)
    designacao    = Column(String(255), nullable=False)
    # ===== Aqui:
    alergeno_id    = Column(
        Integer, 
        ForeignKey(
            "alergenos.id", 
            ondelete="RESTRICT", 
            onupdate="CASCADE"
        ), 
        nullable=False
    )

    alergeno = relationship(
        "Alergeno",
        back_populates="pratos"
    )
    ementas = relationship("Ementa", back_populates="prato")
