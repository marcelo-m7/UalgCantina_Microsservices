from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base

class Ementa(Base):
    __tablename__ = "ementas"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(Date, nullable=False)
    prato_id = Column(Integer, ForeignKey("pratos.id"), nullable=False)

    prato = relationship("Prato", back_populates="ementas")
