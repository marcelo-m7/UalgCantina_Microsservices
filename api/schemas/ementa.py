from typing import Optional
from datetime import date
from pydantic import BaseModel
from schemas.prato import Prato

class EmentaBase(BaseModel):
    data: date
    prato_id: int

class EmentaCreate(EmentaBase):
    pass

class Ementa(EmentaBase):
    id: int
    prato: Optional[Prato]

    class Config:
        orm_mode = True
