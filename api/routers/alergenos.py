from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.alergeno import Alergeno, AlergenoCreate
from crud import alergeno as crud
from core.database import get_db

router = APIRouter(
    prefix="/alergenos",
    tags=["Alergenos"]
)

@router.post("/", response_model=Alergeno, status_code=status.HTTP_201_CREATED)
def create(alergeno_in: AlergenoCreate, db: Session = Depends(get_db)):
    return crud.create_alergeno(db, alergeno_in)

@router.get("/", response_model=List[Alergeno])
def read_many(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_alergenos(db, skip, limit)

@router.get("/{alergeno_id}", response_model=Alergeno)
def read_one(alergeno_id: int, db: Session = Depends(get_db)):
    obj = crud.get_alergeno(db, alergeno_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Alergeno não encontrado")
    return obj

@router.put("/{alergeno_id}", response_model=Alergeno)
def update(alergeno_id: int, alergeno_in: AlergenoCreate, db: Session = Depends(get_db)):
    obj = crud.update_alergeno(db, alergeno_id, alergeno_in)
    if not obj:
        raise HTTPException(status_code=404, detail="Alergeno não encontrado")
    return obj

@router.delete("/{alergeno_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(alergeno_id: int, db: Session = Depends(get_db)):
    obj = crud.delete_alergeno(db, alergeno_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Alergeno não encontrado")
    return None
