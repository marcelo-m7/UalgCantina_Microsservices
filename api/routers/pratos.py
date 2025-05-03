from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.prato import Prato, PratoCreate
from crud import prato as crud
from core.database import get_db

router = APIRouter(
    prefix="/pratos",
    tags=["Pratos"]
)

@router.post("/", response_model=Prato, status_code=status.HTTP_201_CREATED)
def create(prato_in: PratoCreate, db: Session = Depends(get_db)):
    return crud.create_prato(db, prato_in)

@router.get("/", response_model=List[Prato])
def read_many(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_pratos(db, skip, limit)

@router.get("/{prato_id}", response_model=Prato)
def read_one(prato_id: int, db: Session = Depends(get_db)):
    obj = crud.get_prato(db, prato_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Prato não encontrado")
    return obj

@router.put("/{prato_id}", response_model=Prato)
def update(prato_id: int, prato_in: PratoCreate, db: Session = Depends(get_db)):
    obj = crud.update_prato(db, prato_id, prato_in)
    if not obj:
        raise HTTPException(status_code=404, detail="Prato não encontrado")
    return obj

@router.delete("/{prato_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(prato_id: int, db: Session = Depends(get_db)):
    obj = crud.delete_prato(db, prato_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Prato não encontrado")
    return None
