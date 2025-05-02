from datetime import date
from pydantic import BaseModel
from typing import List

class PratoBase(BaseModel):
    designacao: str

class Prato(PratoBase):
    id: int
    class Config:
        orm_mode = True

class EmentaBase(BaseModel):
    data: date

class Ementa(EmentaBase):
    id: int
    pratos: List[Prato]
    class Config:
        orm_mode = True