from pydantic import BaseModel

class AlergenoBase(BaseModel):
    nome: str

class AlergenoCreate(AlergenoBase):
    pass

class Alergeno(AlergenoBase):
    id: int

    class Config:
        from_attributes = True
