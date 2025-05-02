from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.ementa import Ementa, EmentaCreate
from crud import ementa as crud
from core.database import get_db

router = APIRouter(
    prefix="/ementas",
    tags=["Ementas"]
)

@router.post("/", response_model=Ementa, status_code=status.HTTP_201_CREATED)
def create(ementa_in: EmentaCreate, db: Session = Depends(get_db)):
    return crud.create_ementa(db, ementa_in)

@router.get("/", response_model=List[Ementa])
def read_many(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_ementas(db, skip, limit)

@router.get("/{ementa_id}", response_model=Ementa)
def read_one(ementa_id: int, db: Session = Depends(get_db)):
    obj = crud.get_ementa(db, ementa_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Ementa não encontrada")
    return obj

@router.put("/{ementa_id}", response_model=Ementa)
def update(ementa_id: int, ementa_in: EmentaCreate, db: Session = Depends(get_db)):
    obj = crud.update_ementa(db, ementa_id, ementa_in)
    if not obj:
        raise HTTPException(status_code=404, detail="Ementa não encontrada")
    return obj

@router.delete("/{ementa_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(ementa_id: int, db: Session = Depends(get_db)):
    obj = crud.delete_ementa(db, ementa_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Ementa não encontrada")
    return None
