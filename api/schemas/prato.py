from typing import Optional
from pydantic import BaseModel
from schemas.alergeno import Alergeno

class PratoBase(BaseModel):
    designacao: str
    alergeno_id: int

class PratoCreate(PratoBase):
    pass

class Prato(PratoBase):
    id: int
    alergeno: Optional[Alergeno]

    class Config:
        from_attributes = True
